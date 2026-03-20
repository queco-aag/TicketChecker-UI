import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { buildClaimFormData } from '../../shared/api/mappers';
import { ticketsAPI } from '../../shared/api/client';

const ClaimPrizePage = () => {
  const { numero } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);

  const [form, setForm] = useState({
    nombre: '',
    contacto: '',
    direccionEnvio: '',
    comprobante: null
  });
  const [loading, setLoading] = useState(false);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.nombre.trim() || !form.contacto.trim()) {
      toast.current.show({
        severity: 'warn',
        summary: 'Campos obligatorios',
        detail: 'Nombre y contacto son obligatorios.',
        life: 3000
      });
      return;
    }

    setLoading(true);
    try {
      const payload = buildClaimFormData(form);
      await ticketsAPI.reclamar(numero, payload);
      toast.current.show({
        severity: 'success',
        summary: 'Reclamo enviado',
        detail: 'Hemos recibido tu solicitud de premio.',
        life: 3000
      });
      setTimeout(() => navigate('/'), 800);
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'No se pudo enviar',
        detail: error.message,
        life: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="page-card" title={`Reclamar ticket ${numero}`} subTitle="Completa tus datos para gestionar el envio.">
      <Toast ref={toast} />

      <form className="claim-form" onSubmit={handleSubmit}>
        <label>
          Nombre completo *
          <InputText value={form.nombre} onChange={(e) => updateField('nombre', e.target.value)} />
        </label>

        <label>
          Contacto *
          <InputText value={form.contacto} onChange={(e) => updateField('contacto', e.target.value)} />
        </label>

        <label>
          Direccion de envio
          <InputTextarea
            rows={3}
            value={form.direccionEnvio}
            onChange={(e) => updateField('direccionEnvio', e.target.value)}
          />
        </label>

        <label>
          Comprobante (opcional)
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(event) => updateField('comprobante', event.target.files?.[0] || null)}
          />
        </label>

        <div className="form-actions">
          <Button type="button" label="Cancelar" outlined onClick={() => navigate('/')} />
          <Button type="submit" label="Enviar reclamo" icon="pi pi-send" loading={loading} />
        </div>
      </form>
    </Card>
  );
};

export default ClaimPrizePage;

