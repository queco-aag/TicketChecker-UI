import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { numerosAPI } from '../../services/api';
import { APP_CONFIG } from '../../config/constants';
import './ReclamarPremio.css';

const ReclamarPremio = () => {
  const { numero } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);
  const fileUploadRef = useRef(null);

  const [formData, setFormData] = useState({
    nombre: '',
    contacto: '',
    direccion: ''
  });
  const [archivo, setArchivo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.contacto.trim()) {
      newErrors.contacto = 'El contacto es requerido';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const instagramRegex = /@[\w.]+/;
      if (!emailRegex.test(formData.contacto) && !instagramRegex.test(formData.contacto)) {
        newErrors.contacto = 'Ingrese un email válido o un usuario de Instagram (@usuario)';
      }
    }

    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }

    if (!archivo) {
      newErrors.archivo = 'Debe adjuntar un comprobante del ticket';
    } else if (!APP_CONFIG.allowedImageTypes.includes(archivo.type)) {
      newErrors.archivo = 'El archivo debe ser una imagen (JPG, PNG)';
    } else if (archivo.size > APP_CONFIG.maxFileSize) {
      newErrors.archivo = 'El archivo no debe superar los 5MB';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.current.show({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Por favor complete todos los campos correctamente',
        life: 3000
      });
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('contacto', formData.contacto);
      formDataToSend.append('direccion', formData.direccion);
      formDataToSend.append('comprobante', archivo);

      await numerosAPI.reclamar(numero, formDataToSend);

      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: '¡Premio reclamado exitosamente! Nos pondremos en contacto pronto.',
        life: 5000
      });

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error al reclamar premio:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.mensaje || 'No se pudo reclamar el premio. Por favor intente nuevamente.',
        life: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    if (e.files && e.files.length > 0) {
      setArchivo(e.files[0]);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  return (
    <div className="reclamar-premio-container">
      <Toast ref={toast} />
      
      <Card title={`Reclamar Premio - Ticket #${numero}`} className="reclamar-card">
        <p className="instrucciones">
          Complete el siguiente formulario para reclamar su premio. 
          Nos pondremos en contacto con usted para coordinar la entrega.
        </p>

        <form onSubmit={handleSubmit} className="p-fluid">
          <div className="p-field">
            <label htmlFor="nombre">Nombre Completo *</label>
            <InputText
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              className={errors.nombre ? 'p-invalid' : ''}
              disabled={loading}
            />
            {errors.nombre && <small className="p-error">{errors.nombre}</small>}
          </div>

          <div className="p-field">
            <label htmlFor="contacto">Email o Instagram *</label>
            <InputText
              id="contacto"
              value={formData.contacto}
              onChange={(e) => handleInputChange('contacto', e.target.value)}
              placeholder="email@ejemplo.com o @usuario"
              className={errors.contacto ? 'p-invalid' : ''}
              disabled={loading}
            />
            {errors.contacto && <small className="p-error">{errors.contacto}</small>}
          </div>

          <div className="p-field">
            <label htmlFor="direccion">Dirección de Envío *</label>
            <InputTextarea
              id="direccion"
              value={formData.direccion}
              onChange={(e) => handleInputChange('direccion', e.target.value)}
              rows={3}
              className={errors.direccion ? 'p-invalid' : ''}
              disabled={loading}
            />
            {errors.direccion && <small className="p-error">{errors.direccion}</small>}
          </div>

          <div className="p-field">
            <label htmlFor="comprobante">Comprobante del Ticket *</label>
            <FileUpload
              ref={fileUploadRef}
              name="comprobante"
              accept="image/*"
              maxFileSize={APP_CONFIG.maxFileSize}
              customUpload
              auto={false}
              chooseLabel="Seleccionar Imagen"
              uploadLabel="Cargar"
              cancelLabel="Cancelar"
              onSelect={handleFileSelect}
              disabled={loading}
              className={errors.archivo ? 'p-invalid' : ''}
            />
            {errors.archivo && <small className="p-error">{errors.archivo}</small>}
            <small>Adjunte una foto del ticket físico (JPG, PNG, máx. 5MB)</small>
          </div>

          <div className="form-buttons">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-secondary"
              onClick={() => navigate('/')}
              disabled={loading}
              type="button"
            />
            <Button
              label="Reclamar Premio"
              icon="pi pi-check"
              className="p-button-success"
              loading={loading}
              disabled={loading}
              type="submit"
            />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ReclamarPremio;
