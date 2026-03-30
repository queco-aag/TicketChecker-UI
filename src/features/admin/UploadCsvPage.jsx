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
    <div className="table-page">
      <Toast ref={toast} />
      
      <div className="page-header">
        <div>
          <h2>Carga Masiva de Premios</h2>
          <p>Importa premios desde un archivo CSV</p>
        </div>
      </div>

      <Card>
        <div className="p-fluid">
          <div className="field">
            <label htmlFor="csvFile">Archivo CSV</label>
            <input
              id="csvFile"
              type="file"
              accept=".csv,text/csv"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
              className="p-inputtext"
            />
            <small className="text-muted">
              Selecciona un archivo CSV con el formato especificado
            </small>
          </div>

          <div className="field">
            <label>Formato del CSV:</label>
            <pre style={{ 
              background: '#f5f5f5', 
              padding: '1rem', 
              borderRadius: '4px',
              fontSize: '0.9rem',
              overflow: 'auto'
            }}>
numero,nombrePremio,descripcionPremio,urlFotoPremio,anio
18422,PlayStation 5,Consola de videojuegos,https://...,2026
32109,Xbox Series X,Consola Microsoft,https://...,2026
            </pre>
            <small className="text-muted">
              <strong>Importante:</strong> El campo <code>anio</code> es obligatorio y debe corresponder a un año con clave registrada.
            </small>
          </div>

          <div className="field">
            <Button
              label="Cargar Premios"
              icon="pi pi-upload"
              onClick={upload}
              disabled={!file}
              loading={loading}
              className="p-button-success"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UploadCsvPage;

