import { useEffect, useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Tag } from 'primereact/tag';
import { clavesAPI } from '../../shared/api/client';

const YearKeysManagementPage = () => {
  const toast = useRef(null);
  const [claves, setClaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    clave: '',
    descripcion: '',
    activo: true,
    fechaInicio: null,
    fechaFin: null,
    totalNumeros: 0
  });

  const loadClaves = async () => {
    setLoading(true);
    try {
      const response = await clavesAPI.listar();
      console.log('Response.data:', response.data);

      // El backend retorna: { claves: [...], success: true }
      let clavesArray = [];

      if (response.data?.claves && Array.isArray(response.data.claves)) {
        clavesArray = response.data.claves;
      } else if (Array.isArray(response.data)) {
        clavesArray = response.data;
      }

      console.log('Claves cargadas:', clavesArray.length);
      setClaves(clavesArray);
    } catch (error) {
      console.error('Error en loadClaves:', error);
      setClaves([]);
      toast.current.show({
        severity: 'error',
        summary: 'Error al cargar claves',
        detail: error.message,
        life: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClaves();
  }, []);

  const openNewDialog = () => {
    setFormData({
      year: new Date().getFullYear(),
      clave: '',
      descripcion: '',
      activo: true,
      fechaInicio: null,
      fechaFin: null,
      totalNumeros: 0
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!formData.year || !formData.clave || !formData.descripcion) {
      toast.current.show({
        severity: 'warn',
        summary: 'Datos incompletos',
        detail: 'Todos los campos son obligatorios.',
        life: 3000
      });
      return;
    }

    try {
      const payload = {
        anio: formData.year,
        clave: formData.clave,
        descripcion: formData.descripcion
      };
      await clavesAPI.crear(payload);
      toast.current.show({
        severity: 'success',
        summary: 'Clave guardada',
        detail: 'La clave ha sido guardada correctamente.',
        life: 3000
      });
      setShowDialog(false);
      loadClaves();
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error al guardar',
        detail: error.message,
        life: 4000
      });
    }
  };

  const confirmDelete = (clave) => {
    confirmDialog({
      message: `¿Estás seguro de eliminar la clave del año ${clave.anio}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
      accept: () => handleDelete(clave.anio)
    });
  };

  const handleDelete = async (anio) => {
    try {
      await clavesAPI.eliminarPorAnio(anio);
      toast.current.show({
        severity: 'success',
        summary: 'Clave eliminada',
        detail: 'La clave ha sido eliminada correctamente.',
        life: 3000
      });
      loadClaves();
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error al eliminar',
        detail: error.message,
        life: 4000
      });
    }
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
          <h2>Mantenimiento de Claves por Año</h2>
          <p>Gestión de claves y códigos de concurso por año</p>
        </div>
        <Button
          label="Nueva Clave"
          icon="pi pi-plus"
          onClick={openNewDialog}
        />
      </div>

      <Card>
        <DataTable
          value={claves}
          loading={loading}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          emptyMessage="No hay claves registradas"
          responsiveLayout="scroll"
          sortField="anio"
          sortOrder={-1}
          size="small"
        >
          <Column field="anio" header="Año" sortable style={{ width: '100px' }} />
          <Column field="descripcion" header="Descripción" sortable />
          <Column body={actionsTemplate} style={{ width: '120px' }} />
        </DataTable>
      </Card>

      <Dialog
        header="Nueva Clave de Concurso"
        visible={showDialog}
        style={{ width: '500px' }}
        onHide={() => setShowDialog(false)}
        modal
      >
        <div className="flex flex-column gap-3">
          <div className="flex flex-column gap-2">
            <label htmlFor="year" className="font-semibold">Año *</label>
            <InputNumber
              id="year"
              value={formData.year}
              onValueChange={(e) => setFormData({ ...formData, year: e.value })}
              min={2020}
              max={2100}
              useGrouping={false}
              className="w-full"
            />
          </div>

          <div className="flex flex-column gap-2">
            <label htmlFor="clave" className="font-semibold">Clave del Concurso *</label>
            <InputText
              id="clave"
              value={formData.clave}
              onChange={(e) => setFormData({ ...formData, clave: e.target.value })}
              placeholder="Ej: LOTERIA2026"
              className="w-full"
            />
          </div>

          <div className="flex flex-column gap-2">
            <label htmlFor="descripcion" className="font-semibold">Descripción *</label>
            <InputText
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Ej: Concurso Primavera 2026"
              className="w-full"
            />
          </div>

          <div className="flex justify-content-end gap-2 mt-3">
            <Button label="Cancelar" outlined onClick={() => setShowDialog(false)} />
            <Button label="Guardar" icon="pi pi-check" onClick={handleSave} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default YearKeysManagementPage;

