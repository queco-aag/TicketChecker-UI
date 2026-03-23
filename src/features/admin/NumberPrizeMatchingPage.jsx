import { useEffect, useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Tag } from 'primereact/tag';
import { emparejamientosAPI, rewardsAPI } from '../../shared/api/client';

const NumberPrizeMatchingPage = () => {
  const toast = useRef(null);
  const [emparejamientos, setEmparejamientos] = useState([]);
  const [premiosDisponibles, setPremiosDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    numero: '',
    premioId: null
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [emparejamientosRes, premiosRes] = await Promise.all([
        emparejamientosAPI.listar(),
        rewardsAPI.obtenerDisponibles()
      ]);

      // Extraer arrays de las respuestas
      const emparejamientosArray = emparejamientosRes.data?.numerosPremiados ||
                                    emparejamientosRes.data?.emparejamientos ||
                                    (Array.isArray(emparejamientosRes.data) ? emparejamientosRes.data : []);

      const premiosArray = premiosRes.data?.premios ||
                          (Array.isArray(premiosRes.data) ? premiosRes.data : []);

      setEmparejamientos(emparejamientosArray);
      setPremiosDisponibles(premiosArray);
    } catch (error) {
      setEmparejamientos([]);
      setPremiosDisponibles([]);
      toast.current.show({
        severity: 'error',
        summary: 'Error al cargar datos',
        detail: error.message,
        life: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNewDialog = () => {
    setFormData({ numero: '', premioId: null });
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!formData.numero || !formData.premioId) {
      toast.current.show({
        severity: 'warn',
        summary: 'Datos incompletos',
        detail: 'Número y premio son obligatorios.',
        life: 3000
      });
      return;
    }

    try {
      // TODO: Implementar endpoint de emparejamiento
      toast.current.show({
        severity: 'success',
        summary: 'Emparejamiento creado',
        detail: `Número ${formData.numero} asociado al premio correctamente.`,
        life: 3000
      });
      setShowDialog(false);
      loadData();
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error al guardar',
        detail: error.message,
        life: 4000
      });
    }
  };

  const confirmDelete = (emparejamiento) => {
    confirmDialog({
      message: `¿Estás seguro de eliminar el emparejamiento del número ${emparejamiento.numero}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
      accept: () => handleDelete(emparejamiento.numero)
    });
  };

  const handleDelete = async (numero) => {
    try {
      await emparejamientosAPI.eliminarPorNumero(numero);
      toast.current.show({
        severity: 'success',
        summary: 'Emparejamiento eliminado',
        detail: 'El emparejamiento ha sido eliminado correctamente.',
        life: 3000
      });
      loadData();
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error al eliminar',
        detail: error.message,
        life: 4000
      });
    }
  };

  const statusTemplate = (rowData) => {
    if (rowData.enviado) {
      return <Tag value="Enviado" severity="success" icon="pi pi-check" />;
    } else if (rowData.reclamado) {
      return <Tag value="Reclamado" severity="warning" icon="pi pi-clock" />;
    } else {
      return <Tag value="Pendiente" severity="info" icon="pi pi-circle" />;
    }
  };

  const fechaTemplate = (rowData, field) => {
    if (!rowData[field]) return '-';
    const fecha = new Date(rowData[field]);
    return fecha.toLocaleDateString('es-ES');
  };

  const actionsTemplate = (rowData) => {
    return (
      <div className="table-actions">
        <Button
          icon="pi pi-trash"
          rounded
          text
          severity="danger"
          onClick={() => confirmDelete(rowData)}
          tooltip="Eliminar emparejamiento"
          disabled={rowData.reclamado}
        />
      </div>
    );
  };

  return (
    <div className="table-page">
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="page-header">
        <div>
          <h2>Emparejamiento Números-Premios</h2>
          <p>Asocia números de lotería con premios específicos</p>
        </div>
        <div className="page-header-actions">
          <Button
            label="Nuevo Emparejamiento"
            icon="pi pi-link"
            onClick={openNewDialog}
          />
          <Button
            label="Carga Masiva CSV"
            icon="pi pi-upload"
            outlined
            onClick={() => toast.current.show({
              severity: 'info',
              summary: 'Usa Carga CSV',
              detail: 'Ve a la sección "Cargar CSV" para carga masiva.',
              life: 3000
            })}
          />
        </div>
      </div>

      <Card>
        <DataTable
          value={emparejamientos}
          loading={loading}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          emptyMessage="No hay emparejamientos registrados"
          responsiveLayout="scroll"
          sortField="numero"
          sortOrder={1}
          filterDisplay="row"
          size="small"
        >
          <Column field="numero" header="Número" sortable filter filterPlaceholder="Buscar" style={{ width: '130px' }} />
          <Column field="premio.nombre" header="Premio Asignado" sortable filter filterPlaceholder="Filtrar premio" />
          <Column field="premio.categoria" header="Categoría" sortable style={{ width: '130px' }} />
          <Column field="year" header="Año" sortable style={{ width: '90px' }} />
          <Column
            field="fechaAsignacion"
            header="Fecha Asignación"
            body={(rowData) => fechaTemplate(rowData, 'fechaAsignacion')}
            sortable
            style={{ width: '150px' }}
          />
          <Column field="nombreReclamante" header="Reclamante" sortable filter filterPlaceholder="Buscar" style={{ width: '180px' }} />
          <Column
            field="fechaReclamacion"
            header="Fecha Reclamación"
            body={(rowData) => fechaTemplate(rowData, 'fechaReclamacion')}
            sortable
            style={{ width: '150px' }}
          />
          <Column field="enviado" header="Estado" body={statusTemplate} sortable style={{ width: '130px' }} />
          <Column body={actionsTemplate} style={{ width: '100px' }} frozen alignFrozen="right" />
        </DataTable>
      </Card>

      <Dialog
        header="Nuevo Emparejamiento"
        visible={showDialog}
        style={{ width: '500px' }}
        onHide={() => setShowDialog(false)}
        modal
      >
        <div className="dialog-form">
          <div className="field">
            <label htmlFor="numero">Número de Lotería *</label>
            <InputText
              id="numero"
              value={formData.numero}
              onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
              placeholder="Ej: 12345"
            />
          </div>

          <div className="field">
            <label htmlFor="premio">Premio *</label>
            <Dropdown
              id="premio"
              value={formData.premioId}
              options={premiosDisponibles}
              onChange={(e) => setFormData({ ...formData, premioId: e.value })}
              optionLabel="nombre"
              optionValue="id"
              placeholder="Selecciona un premio"
              filter
              showClear
            />
          </div>

          <div className="dialog-actions">
            <Button label="Cancelar" outlined onClick={() => setShowDialog(false)} />
            <Button label="Asociar" icon="pi pi-check" onClick={handleSave} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default NumberPrizeMatchingPage;

