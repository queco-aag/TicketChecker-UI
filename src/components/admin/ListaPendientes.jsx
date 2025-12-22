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
import './ListaPendientes.css';

const ListaPendientes = () => {
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
      const response = await premiosAPI.obtenerPendientes();
      setPremios(response.data);
    } catch (error) {
      console.error('Error al cargar premios pendientes:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los premios pendientes',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmarMarcarEnviado = (premio) => {
    confirmDialog({
      message: `¿Está seguro de marcar como enviado el premio "${premio.nombrePremio}" para ${premio.nombrePremiado}?`,
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

  const accionesTemplate = (rowData) => {
    return (
      <Button
        icon="pi pi-send"
        label="Marcar Enviado"
        className="p-button-success p-button-sm"
        onClick={() => confirmarMarcarEnviado(rowData)}
      />
    );
  };

  const fechaTemplate = (rowData) => {
    if (!rowData.fechaReclamacion) return '-';
    const fecha = new Date(rowData.fechaReclamacion);
    return fecha.toLocaleDateString('es-ES');
  };

  const header = (
    <div className="table-header">
      <h2>Premios Pendientes de Envío</h2>
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
    <div className="lista-pendientes-container">
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

      <Card className="pendientes-card">
        {premios.length > 0 && (
          <div className="alert-pendientes">
            <i className="pi pi-exclamation-circle"></i>
            <span>Hay {premios.length} premio(s) pendiente(s) de envío</span>
          </div>
        )}
        
        <DataTable
          value={premios}
          loading={loading}
          header={header}
          globalFilter={globalFilter}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          emptyMessage="No hay premios pendientes de envío"
          responsiveLayout="scroll"
          stripedRows
          rowClassName={() => 'pendiente-row'}
        >
          <Column field="numero" header="Número" sortable filter />
          <Column field="nombrePremio" header="Premio" sortable filter />
          <Column field="nombrePremiado" header="Premiado" sortable filter />
          <Column field="contactoPremiado" header="Contacto" sortable filter />
          <Column field="direccionPremiado" header="Dirección" sortable />
          <Column field="fechaReclamacion" header="Fecha Reclamación" body={fechaTemplate} sortable />
          <Column header="Acciones" body={accionesTemplate} />
        </DataTable>
      </Card>
    </div>
  );
};

export default ListaPendientes;
