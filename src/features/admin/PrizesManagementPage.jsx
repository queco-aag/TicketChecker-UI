import { useEffect, useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Image } from 'primereact/image';
import { rewardsAPI } from '../../shared/api/client';

const PrizesManagementPage = () => {
  const toast = useRef(null);
  const [premios, setPremios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    urlFoto: ''
  });

  const loadPremios = async () => {
    setLoading(true);
    try {
      const response = await rewardsAPI.listarPremios();

      // Manejar diferentes estructuras de respuesta
      let premiosArray = [];
      if (response.data?.premios && Array.isArray(response.data.premios)) {
        premiosArray = response.data.premios;
      } else if (Array.isArray(response.data)) {
        premiosArray = response.data;
      }

      setPremios(premiosArray);
    } catch (error) {
      setPremios([]);
      toast.current.show({
        severity: 'error',
        summary: 'Error al cargar premios',
        detail: error.message,
        life: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPremios();
  }, []);

  const openNewDialog = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      urlFoto: ''
    });
    setEditMode(false);
    setShowDialog(true);
  };

  const openEditDialog = (premio) => {
    setFormData({ ...premio });
    setEditMode(true);
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!formData.nombre || !formData.descripcion) {
      toast.current.show({
        severity: 'warn',
        summary: 'Datos incompletos',
        detail: 'Nombre y descripción son obligatorios.',
        life: 3000
      });
      return;
    }

    try {
      if (editMode) {
        await rewardsAPI.actualizarPremio(formData.id, formData);
        toast.current.show({
          severity: 'success',
          summary: 'Premio actualizado',
          detail: 'El premio se ha actualizado correctamente.',
          life: 3000
        });
      } else {
        await rewardsAPI.crearPremio(formData);
        toast.current.show({
          severity: 'success',
          summary: 'Premio creado',
          detail: 'El premio se ha creado correctamente.',
          life: 3000
        });
      }
      setShowDialog(false);
      loadPremios();
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error al guardar premio',
        detail: error.message,
        life: 4000
      });
    }
  };

  const confirmDelete = (premio) => {
    confirmDialog({
      message: `¿Estás seguro de eliminar el premio "${premio.nombre}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
      accept: () => handleDelete(premio.id)
    });
  };

  const handleDelete = async (premioId) => {
    try {
      await rewardsAPI.eliminarPremio(premioId);
      toast.current.show({
        severity: 'success',
        summary: 'Premio eliminado',
        detail: 'El premio ha sido eliminado correctamente.',
        life: 3000
      });
      loadPremios();
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error al eliminar',
        detail: error.message,
        life: 4000
      });
    }
  };

  const imageTemplate = (rowData) => {
    return rowData.urlFoto ? (
      <Image src={rowData.urlFoto} alt={rowData.nombre} width="80" preview />
    ) : (
      <span className="text-muted">Sin imagen</span>
    );
  };

  const actionsTemplate = (rowData) => {
    return (
      <div className="table-actions">
        <Button
          icon="pi pi-pencil"
          rounded
          text
          onClick={() => openEditDialog(rowData)}
          tooltip="Editar"
        />
        <Button
          icon="pi pi-trash"
          rounded
          text
          severity="danger"
          onClick={() => confirmDelete(rowData)}
          tooltip="Eliminar"
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
          <h2>Mantenimiento de Premios</h2>
          <p>Gestión del catálogo de premios disponibles</p>
        </div>
        <Button
          label="Nuevo Premio"
          icon="pi pi-plus"
          onClick={openNewDialog}
        />
      </div>

      <Card>
        <DataTable
          value={premios}
          loading={loading}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          emptyMessage="No hay premios registrados"
          responsiveLayout="scroll"
          size="small"
        >
          <Column field="id" header="ID" sortable style={{ width: '80px' }} />
          <Column field="nombre" header="Nombre" sortable />
          <Column field="descripcion" header="Descripción" sortable />
          <Column header="Foto" body={imageTemplate} style={{ width: '120px' }} />
          <Column body={actionsTemplate} style={{ width: '120px' }} />
        </DataTable>
      </Card>

      <Dialog
        header={editMode ? 'Editar Premio' : 'Nuevo Premio'}
        visible={showDialog}
        style={{ width: '700px', maxHeight: '90vh' }}
        onHide={() => setShowDialog(false)}
        modal
      >
        <div className="dialog-form">
          <div className="p-fluid grid">
            <div className="field col-12">
              <label htmlFor="nombre">Nombre del Premio *</label>
              <InputText
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: PlayStation 5"
              />
            </div>

            <div className="field col-12">
              <label htmlFor="descripcion">Descripción *</label>
              <InputTextarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={4}
                placeholder="Descripción detallada del premio"
              />
            </div>

            <div className="field col-12">
              <label htmlFor="urlFoto">URL de la Foto</label>
              <InputText
                id="urlFoto"
                value={formData.urlFoto}
                onChange={(e) => setFormData({ ...formData, urlFoto: e.target.value })}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              {formData.urlFoto && (
                <div className="mt-3 text-center">
                  <Image src={formData.urlFoto} alt="Vista previa" width="200" preview />
                </div>
              )}
            </div>
          </div>

          <div className="dialog-actions">
            <Button label="Cancelar" outlined onClick={() => setShowDialog(false)} />
            <Button label="Guardar" icon="pi pi-check" onClick={handleSave} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default PrizesManagementPage;

