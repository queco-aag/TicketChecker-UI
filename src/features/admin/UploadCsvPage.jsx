import { useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { rewardsAPI } from '../../shared/api/client';

const UploadCsvPage = () => {
  const toast = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (!file) {
      toast.current.show({
        severity: 'warn',
        summary: 'Archivo requerido',
        detail: 'Selecciona un archivo CSV.',
        life: 3000
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await rewardsAPI.cargarCSV(formData);

      toast.current.show({
        severity: 'success',
        summary: 'Carga completada',
        detail: data?.mensaje || `Registros cargados: ${data?.cantidadCargada || 0}`,
        life: 4000
      });
      setFile(null);
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'No se pudo cargar el CSV',
        detail: error.message,
        life: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Carga masiva de premios" subTitle="Endpoint: POST /premios/cargar-csv">
      <Toast ref={toast} />

      <div className="claim-form">
        <label>
          Archivo CSV
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />
        </label>

        <Button
          label="Subir archivo"
          icon="pi pi-upload"
          onClick={upload}
          disabled={!file}
          loading={loading}
        />
      </div>
    </Card>
  );
};

export default UploadCsvPage;

