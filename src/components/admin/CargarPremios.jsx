import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import { ProgressBar } from 'primereact/progressbar';
import { premiosAPI } from '../../services/api';
import './CargarPremios.css';

const CargarPremios = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const fileUploadRef = useRef(null);
  
  const [archivo, setArchivo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  const handleFileSelect = (e) => {
    if (e.files && e.files.length > 0) {
      const file = e.files[0];
      if (!file.name.endsWith('.csv')) {
        toast.current.show({
          severity: 'warn',
          summary: 'Formato Inválido',
          detail: 'Por favor seleccione un archivo CSV',
          life: 3000
        });
        return;
      }
      setArchivo(file);
    }
  };

  const handleUpload = async () => {
    if (!archivo) {
      toast.current.show({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Por favor seleccione un archivo CSV',
        life: 3000
      });
      return;
    }

    setLoading(true);
    setResultado(null);

    try {
      const formData = new FormData();
      formData.append('file', archivo);

      const response = await premiosAPI.cargarCSV(formData);
      
      setResultado({
        success: true,
        data: response.data
      });

      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: `Se cargaron ${response.data.cantidad || 0} premios correctamente`,
        life: 5000
      });

      // Limpiar el archivo
      if (fileUploadRef.current) {
        fileUploadRef.current.clear();
      }
      setArchivo(null);
    } catch (error) {
      console.error('Error al cargar premios:', error);
      setResultado({
        success: false,
        error: error.response?.data?.mensaje || 'Error al cargar el archivo'
      });

      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.mensaje || 'No se pudo cargar el archivo CSV',
        life: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cargar-premios-container">
      <Toast ref={toast} />
      
      <div className="page-header">
        <Button
          icon="pi pi-arrow-left"
          label="Volver"
          className="p-button-text"
          onClick={() => navigate('/admin')}
        />
        <h1>Cargar Premios desde CSV</h1>
      </div>

      <Card className="cargar-card">
        <Message
          severity="info"
          text="El archivo CSV debe tener el siguiente formato:"
          className="info-message"
        />
        
        <div className="csv-format">
          <pre>
            numero,nombre_premio,descripcion,url_foto
            {'\n'}001,Bicicleta,Bicicleta de montaña,https://ejemplo.com/bici.jpg
            {'\n'}002,Tablet,Tablet 10 pulgadas,https://ejemplo.com/tablet.jpg
          </pre>
        </div>

        <Message
          severity="warn"
          text="Asegúrese de que el archivo no contenga tildes ni caracteres especiales en los encabezados"
          className="warning-message"
        />

        <div className="upload-section">
          <FileUpload
            ref={fileUploadRef}
            name="csv"
            accept=".csv"
            customUpload
            auto={false}
            chooseLabel="Seleccionar CSV"
            uploadLabel="Cargar"
            cancelLabel="Cancelar"
            onSelect={handleFileSelect}
            disabled={loading}
          />

          <Button
            label="Cargar Premios"
            icon="pi pi-upload"
            onClick={handleUpload}
            loading={loading}
            disabled={loading || !archivo}
            className="p-button-success upload-button"
          />
        </div>

        {loading && (
          <div className="progress-section">
            <ProgressBar mode="indeterminate" />
            <p>Cargando premios...</p>
          </div>
        )}

        {resultado && !loading && (
          <div className={`resultado-section ${resultado.success ? 'success' : 'error'}`}>
            {resultado.success ? (
              <>
                <i className="pi pi-check-circle"></i>
                <h3>Carga Exitosa</h3>
                <p>Se cargaron {resultado.data.cantidad || 0} premios correctamente</p>
                <Button
                  label="Ver Premios"
                  icon="pi pi-list"
                  onClick={() => navigate('/admin/premios')}
                />
              </>
            ) : (
              <>
                <i className="pi pi-times-circle"></i>
                <h3>Error en la Carga</h3>
                <p>{resultado.error}</p>
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default CargarPremios;
