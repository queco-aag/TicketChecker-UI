import { useEffect, useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Image } from 'primereact/image';
import { rewardsAPI, clavesAPI } from '../../shared/api/client';
import { getImageUrl } from '../../shared/utils/imageUtils';

const PrizesManagementPage = () => {
  const toast = useRef(null);
  const [premios, setPremios] = useState([]);
  const [claves, setClaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    rutaFoto: '',
    anio: new Date().getFullYear(),
    imagen: null // Archivo de imagen a subir
  });
  const [previewUrl, setPreviewUrl] = useState(null); // Vista previa de la imagen seleccionada

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

  const loadClaves = async () => {
    try {
      const response = await clavesAPI.listar();
      
      // Manejar diferentes estructuras de respuesta
      let clavesArray = [];
      if (response.data?.claves && Array.isArray(response.data.claves)) {
        clavesArray = response.data.claves;
      } else if (Array.isArray(response.data)) {
        clavesArray = response.data;
      }
      
      setClaves(clavesArray);
    } catch (error) {
      console.error('Error al cargar claves:', error);
      setClaves([]);
      toast.current.show({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No se pudieron cargar los años disponibles. Asegúrese de registrar claves primero.',
        life: 4000
      });
    }
  };

  useEffect(() => {
    loadPremios();
    loadClaves();
  }, []);

  const openNewDialog = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      rutaFoto: '',
      anio: new Date().getFullYear(),
      imagen: null
    });
    setPreviewUrl(null);
    setEditMode(false);
    setShowDialog(true);
  };

  const openEditDialog = (premio) => {
    setFormData({ ...premio, imagen: null });
    // Construir la URL completa de la imagen si existe
    const imageUrl = getImageUrl(premio.rutaFoto);
    setPreviewUrl(imageUrl);
    setEditMode(true);
    setShowDialog(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.current.show({
        severity: 'warn',
        summary: 'Formato no válido',
        detail: 'Solo se permiten imágenes JPG, PNG, GIF o WEBP.',
        life: 3000
      });
      e.target.value = '';
      return;
    }

    // Validar tamaño (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
      toast.current.show({
        severity: 'warn',
        summary: 'Archivo muy grande',
        detail: 'El tamaño máximo permitido es 5MB.',
        life: 3000
      });
      e.target.value = '';
      return;
    }

    // Crear vista previa
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    // Guardar el archivo en el estado
    setFormData({ ...formData, imagen: file });
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, imagen: null, rutaFoto: '' });
    setPreviewUrl(null);
    // Limpiar el input file
    const fileInput = document.getElementById('imagen');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSave = async () => {
    if (!formData.nombre || !formData.descripcion || !formData.anio) {
      toast.current.show({
        severity: 'warn',
        summary: 'Datos incompletos',
        detail: 'Nombre, descripción y año son obligatorios.',
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
    const imageUrl = getImageUrl(rowData.rutaFoto);


    return imageUrl ? (
      <div className="flex align-items-center justify-content-center">
        <Image
          src={imageUrl}
          alt={rowData.nombre}
          width="100"
          height="100"
          preview
          imageStyle={{ objectFit: 'cover', borderRadius: '4px' }}
        />
      </div>
    ) : (
      <div className="flex align-items-center justify-content-center" style={{ height: '100px' }}>
        <span className="text-muted text-sm">
          <i className="pi pi-image mr-2"></i>
          Sin imagen
        </span>
      </div>
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
          <Column field="anio" header="Año" sortable style={{ width: '100px' }} />
          <Column field="nombre" header="Nombre" sortable />
          <Column field="descripcion" header="Descripción" sortable />
          <Column header="Imagen" body={imageTemplate} style={{ width: '150px' }} />
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
              <label htmlFor="anio">Año del Sorteo *</label>
              <Dropdown
                id="anio"
                value={formData.anio}
                onChange={(e) => setFormData({ ...formData, anio: e.value })}
                options={claves.map(c => ({ label: c.anio.toString(), value: c.anio }))}
                placeholder="Seleccione el año del sorteo"
                disabled={editMode}
                emptyMessage="No hay años registrados. Vaya a Claves por Año para crear uno."
                showClear={false}
              />
              <small className="text-muted">
                El premio estará asociado a este año de sorteo. {editMode ? 'No se puede cambiar al editar.' : ''}
              </small>
            </div>

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
              <label htmlFor="imagen">Imagen del Premio</label>
              
              {/* Vista previa de la imagen existente o nueva */}
              {previewUrl && (
                <div className="mb-3 p-3 border-1 surface-border border-round" style={{ backgroundColor: '#f8f9fa' }}>
                  <div className="flex justify-content-between align-items-center mb-2">
                    <span className="text-sm font-semibold">Vista previa:</span>
                    <Button
                      icon="pi pi-times"
                      rounded
                      outlined
                      severity="danger"
                      size="small"
                      onClick={handleRemoveImage}
                      tooltip="Quitar imagen"
                      tooltipOptions={{ position: 'top' }}
                    />
                  </div>
                  <div className="text-center">
                    <Image src={previewUrl} alt="Vista previa" width="250" preview />
                    {formData.imagen && (
                      <div className="mt-2">
                        <small className="text-muted">
                          📎 {formData.imagen.name} ({(formData.imagen.size / 1024).toFixed(2)} KB)
                        </small>
                      </div>
                    )}
                    {!formData.imagen && formData.rutaFoto && (
                      <div className="mt-2">
                        <small className="text-muted">
                          🖼️ Imagen actual del premio
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Input de archivo */}
              <div className="flex align-items-center gap-2">
                <input
                  id="imagen"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1"
                  style={{ padding: '0.5rem' }}
                />
              </div>
              <small className="text-muted block mt-1">
                Formatos aceptados: JPG, PNG, GIF, WEBP. Tamaño máximo: 5MB
              </small>
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

