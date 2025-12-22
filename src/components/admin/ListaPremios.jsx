import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { premiosAPI } from '../../services/api';
import './ListaPremios.css';

const ListaPremios = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [premios, setPremios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    loadPremios();
  }, []);

  const loadPremios = async () => {
    setLoading(true);
    try {
      const response = await premiosAPI.obtenerReclamados();
      setPremios(response.data);
    } catch (error) {
      console.error('Error al cargar premios:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los premios',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmarMarcarEnviado = (premio) => {
    confirmDialog({
      message: `¿Está seguro de marcar como enviado el premio "${premio.nombrePremio}" del número ${premio.numero}?`,
      header: 'Confirmar Envío',
      icon: 'pi pi-exclamation-triangle',
      accept: () => marcarComoEnviado(premio.id),
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptClassName: 'p-button-success'
    });
  };

  const marcarComoEnviado = async (id) => {
    try {
      await premiosAPI.marcarEnviado(id);
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Premio marcado como enviado',
        life: 3000
      });
      loadPremios();
    } catch (error) {
      console.error('Error al marcar premio:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo marcar el premio como enviado',
        life: 3000
      });
    }
  };

  const reclamadoTemplate = (rowData) => {
    return (
      <span className={rowData.reclamado ? 'badge badge-success' : 'badge badge-secondary'}>
        {rowData.reclamado ? 'Sí' : 'No'}
      </span>
    );
  };

  const enviadoTemplate = (rowData) => {
    return (
      <span className={rowData.enviado ? 'badge badge-success' : 'badge badge-warning'}>
        {rowData.enviado ? 'Sí' : 'No'}
      </span>
    );
  };

  const accionesTemplate = (rowData) => {
    return (
      <div className="acciones-buttons">
        {!rowData.enviado && (
          <Button
            icon="pi pi-check"
            className="p-button-rounded p-button-success p-button-sm"
            onClick={() => confirmarMarcarEnviado(rowData)}
            tooltip="Marcar como enviado"
            tooltipOptions={{ position: 'top' }}
          />
        )}
      </div>
    );
  };

  const header = (
    <div className="table-header">
      <h2>Lista de Premios Reclamados</h2>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar..."
        />
      </span>
    </div>
  );

  return (
    <div className="lista-premios-container">
      <Toast ref={toast} />
      <ConfirmDialog />
      
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
          value={premios}
          loading={loading}
          header={header}
          globalFilter={globalFilter}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          emptyMessage="No se encontraron premios"
          responsiveLayout="scroll"
          stripedRows
        >
          <Column field="numero" header="Número" sortable filter />
          <Column field="nombrePremio" header="Premio" sortable filter />
          <Column field="descripcion" header="Descripción" sortable filter />
          <Column field="reclamado" header="Reclamado" body={reclamadoTemplate} sortable />
          <Column field="enviado" header="Enviado" body={enviadoTemplate} sortable />
          <Column header="Acciones" body={accionesTemplate} />
        </DataTable>
      </Card>
    </div>
  );
};

export default ListaPremios;
