import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { premiosAPI } from '../../services/api';
import './ListaEnviados.css';

const ListaEnviados = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const dt = useRef(null);
  const [premios, setPremios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    loadPremios();
  }, []);

  const loadPremios = async () => {
    setLoading(true);
    try {
      const response = await premiosAPI.obtenerEnviados();
      const mappedPremios = mapNumerosPremiados(response.data);
      setPremios(mappedPremios);
    } catch (error) {
      console.error('Error al cargar premios enviados:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'No se pudieron cargar los premios enviados',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const fechaTemplate = (rowData) => {
    if (!rowData.fechaReclamacion) return '-';
    const fecha = new Date(rowData.fechaReclamacion);
    return fecha.toLocaleDateString('es-ES');
  };

  const header = (
    <div className="table-header">
      <h2>Premios Enviados</h2>
      <div className="header-actions">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar..."
          />
        </span>
        <Button
          icon="pi pi-file-excel"
          label="Exportar CSV"
          className="p-button-success"
          onClick={exportCSV}
        />
      </div>
    </div>
  );

  return (
    <div className="lista-enviados-container">
      <Toast ref={toast} />
      
      <div className="page-header">
        <Button
          icon="pi pi-arrow-left"
          label="Volver"
          className="p-button-text"
          onClick={() => navigate('/admin')}
        />
      </div>

      <Card>
        <DataTable
          ref={dt}
          value={premios}
          loading={loading}
          header={header}
          globalFilter={globalFilter}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          emptyMessage="No se encontraron premios enviados"
          responsiveLayout="scroll"
          stripedRows
          exportFilename="premios-enviados"
        >
          <Column field="numero" header="Número" sortable filter />
          <Column field="nombrePremio" header="Premio" sortable filter />
          <Column field="nombrePremiado" header="Premiado" sortable filter />
          <Column field="contactoPremiado" header="Contacto" sortable filter />
          <Column field="direccionPremiado" header="Dirección" sortable filter />
          <Column field="fechaReclamacion" header="Fecha Reclamación" body={fechaTemplate} sortable />
        </DataTable>
      </Card>
    </div>
  );
};

export default ListaEnviados;
