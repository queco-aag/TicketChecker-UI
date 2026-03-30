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
import { FilterMatchMode } from 'primereact/api';
import { emparejamientosAPI, rewardsAPI } from '../../shared/api/client';

const NumberPrizeMatchingPage = () => {
  const toast = useRef(null);
  const dt = useRef(null);
  const [emparejamientos, setEmparejamientos] = useState([]);
  const [premiosDisponibles, setPremiosDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    numero: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'premio.nombre': { value: null, matchMode: FilterMatchMode.CONTAINS },
    nombreReclamante: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });
  const [formData, setFormData] = useState({
    numero: '',
    premioId: null
  });
  const [formErrors, setFormErrors] = useState({});

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
    initFilters();
  }, []);

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      numero: { value: null, matchMode: FilterMatchMode.CONTAINS },
      'premio.nombre': { value: null, matchMode: FilterMatchMode.CONTAINS },
      nombreReclamante: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    setGlobalFilterValue('');
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    const _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const clearFilter = () => {
    initFilters();
  };

  const openNewDialog = () => {
    setFormData({ numero: '', premioId: null });
    setFormErrors({});
    setShowDialog(true);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.numero || !formData.numero.trim()) {
      errors.numero = 'El número es obligatorio';
    } else if (!/^\d+$/.test(formData.numero.trim())) {
      errors.numero = 'El número debe contener solo dígitos';
    }

    if (!formData.premioId) {
      errors.premioId = 'Debe seleccionar un premio';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.current.show({
        severity: 'warn',
        summary: 'Datos incompletos',
        detail: 'Por favor, complete todos los campos correctamente.',
        life: 3000
      });
      return;
    }

    try {
      await emparejamientosAPI.asignar({
        numero: formData.numero.trim(),
        premioId: formData.premioId
      });
      toast.current.show({
        severity: 'success',
        summary: 'Emparejamiento creado',
        detail: `Número ${formData.numero} asociado al premio correctamente.`,
        life: 3000
      });
      setShowDialog(false);
      setFormData({ numero: '', premioId: null });
      setFormErrors({});
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
    if (!rowData[field]) return <span className="text-muted">-</span>;
    const fecha = new Date(rowData[field]);
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const numeroTemplate = (rowData) => {
    return <strong>{rowData.numero}</strong>;
  };

  const premioTemplate = (rowData) => {
    if (!rowData.premio?.nombre) return <span className="text-muted">-</span>;
    return (
      <div>
        <div>{rowData.premio.nombre}</div>
        {rowData.premio.anio && (
          <small className="text-muted">Año: {rowData.premio.anio}</small>
        )}
      </div>
    );
  };

  const premioOptionTemplate = (option) => {
    return (
      <div>
        <div>{option.nombre}</div>
        {option.anio && (
          <small className="text-muted">Año: {option.anio}</small>
        )}
      </div>
    );
  };

  const reclamanteTemplate = (rowData) => {
    if (!rowData.nombreReclamante) return <span className="text-muted">Sin reclamar</span>;
    return rowData.nombreReclamante;
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
          tooltipOptions={{ position: 'left' }}
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
        </div>
      </div>

      <Card>
        <div className="table-header">
          <div className="table-header-left">
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                placeholder="Buscar en todas las columnas..."
                style={{ width: '300px' }}
              />
            </span>
            {globalFilterValue && (
              <Button
                icon="pi pi-filter-slash"
                label="Limpiar"
                outlined
                size="small"
                onClick={clearFilter}
              />
            )}
          </div>
          <div className="table-header-right">
            <Tag
              value={`${emparejamientos.length} emparejamientos`}
              severity="info"
            />
          </div>
        </div>

        <DataTable
          ref={dt}
          value={emparejamientos}
          loading={loading}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          emptyMessage="No hay emparejamientos registrados"
          responsiveLayout="scroll"
          sortField="numero"
          sortOrder={1}
          filters={filters}
          globalFilterFields={['numero', 'premio.nombre', 'nombreReclamante', 'year']}
          filterDisplay="row"
          size="small"
          stripedRows
        >
          <Column
            field="numero"
            header="Número"
            body={numeroTemplate}
            sortable
            filter
            filterPlaceholder="Buscar"
            style={{ width: '130px' }}
          />
          <Column
            field="premio.nombre"
            header="Premio Asignado"
            body={premioTemplate}
            sortable
            filter
            filterPlaceholder="Filtrar premio"
          />
          <Column
            field="year"
            header="Año"
            sortable
            style={{ width: '90px' }}
          />
          <Column
            field="fechaAsignacion"
            header="Fecha Asignación"
            body={(rowData) => fechaTemplate(rowData, 'fechaAsignacion')}
            sortable
            style={{ width: '150px' }}
          />
          <Column
            field="nombreReclamante"
            header="Reclamante"
            body={reclamanteTemplate}
            sortable
            filter
            filterPlaceholder="Buscar"
            style={{ width: '180px' }}
          />
          <Column
            field="fechaReclamacion"
            header="Fecha Reclamación"
            body={(rowData) => fechaTemplate(rowData, 'fechaReclamacion')}
            sortable
            style={{ width: '150px' }}
          />
          <Column
            field="enviado"
            header="Estado"
            body={statusTemplate}
            sortable
            style={{ width: '130px' }}
          />
          <Column
            body={actionsTemplate}
            exportable={false}
            style={{ width: '100px' }}
            frozen
            alignFrozen="right"
          />
        </DataTable>
      </Card>

      <Dialog
        header="Nuevo Emparejamiento"
        visible={showDialog}
        style={{ width: '500px' }}
        onHide={() => {
          setShowDialog(false);
          setFormErrors({});
        }}
        modal
      >
        <div className="dialog-form">
          <div className="field">
            <label htmlFor="numero">
              Número de Lotería <span style={{ color: 'red' }}>*</span>
            </label>
            <InputText
              id="numero"
              value={formData.numero}
              onChange={(e) => {
                setFormData({ ...formData, numero: e.target.value });
                if (formErrors.numero) {
                  setFormErrors({ ...formErrors, numero: null });
                }
              }}
              placeholder="Ej: 12345"
              className={formErrors.numero ? 'p-invalid' : ''}
              autoFocus
            />
            {formErrors.numero && (
              <small className="p-error">{formErrors.numero}</small>
            )}
            <small>Ingrese solo dígitos numéricos</small>
          </div>

          <div className="field">
            <label htmlFor="premio">
              Premio <span style={{ color: 'red' }}>*</span>
            </label>
            <Dropdown
              id="premio"
              value={formData.premioId}
              options={premiosDisponibles}
              onChange={(e) => {
                setFormData({ ...formData, premioId: e.value });
                if (formErrors.premioId) {
                  setFormErrors({ ...formErrors, premioId: null });
                }
              }}
              optionLabel="nombre"
              optionValue="id"
              itemTemplate={premioOptionTemplate}
              placeholder="Selecciona un premio"
              filter
              showClear
              className={formErrors.premioId ? 'p-invalid' : ''}
              emptyMessage="No hay premios disponibles"
              emptyFilterMessage="No se encontraron premios"
            />
            {formErrors.premioId && (
              <small className="p-error">{formErrors.premioId}</small>
            )}
            {premiosDisponibles.length === 0 && (
              <small className="text-muted">
                No hay premios disponibles. Cree premios primero en la sección "Premios".
              </small>
            )}
          </div>

          <div className="dialog-actions">
            <Button
              label="Cancelar"
              outlined
              onClick={() => {
                setShowDialog(false);
                setFormErrors({});
              }}
            />
            <Button
              label="Asociar"
              icon="pi pi-check"
              onClick={handleSave}
              disabled={premiosDisponibles.length === 0}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default NumberPrizeMatchingPage;

