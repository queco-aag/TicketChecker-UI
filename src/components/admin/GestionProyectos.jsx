import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Tag } from 'primereact/tag';
import { proyectosAPI } from '../../services/api';
import { mapProyectos, mapRepositorios } from '../../services/apiMappers';
import './GestionProyectos.css';

const GestionProyectos = () => {
  const navigate = useNavigate();
  const toast = useRef(null);

  const [proyectos, setProyectos] = useState([]);
  const [loadingProyectos, setLoadingProyectos] = useState(true);

  const [proyectoDialogVisible, setProyectoDialogVisible] = useState(false);
  const [proyectoEditando, setProyectoEditando] = useState(null);
  const [proyectoForm, setProyectoForm] = useState({ nombre: '', descripcion: '' });
  const [savingProyecto, setSavingProyecto] = useState(false);

  const [repositoriosDialogVisible, setRepositoriosDialogVisible] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [repositorios, setRepositorios] = useState([]);
  const [loadingRepositorios, setLoadingRepositorios] = useState(false);
  const [repositorioDialogVisible, setRepositorioDialogVisible] = useState(false);
  const [repositorioForm, setRepositorioForm] = useState({ nombre: '', descripcion: '', url: '' });
  const [savingRepositorio, setSavingRepositorio] = useState(false);

  useEffect(() => {
    loadProyectos();
  }, []);

  const loadProyectos = async () => {
    setLoadingProyectos(true);
    try {
      const response = await proyectosAPI.listar();
      setProyectos(mapProyectos(response.data));
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'No se pudieron cargar los proyectos',
        life: 3000,
      });
    } finally {
      setLoadingProyectos(false);
    }
  };

  const loadRepositorios = async (proyectoId) => {
    setLoadingRepositorios(true);
    try {
      const response = await proyectosAPI.listarRepositorios(proyectoId);
      setRepositorios(mapRepositorios(response.data));
    } catch (error) {
      console.error('Error al cargar repositorios:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'No se pudieron cargar los repositorios',
        life: 3000,
      });
    } finally {
      setLoadingRepositorios(false);
    }
  };

  const abrirNuevoProyecto = () => {
    setProyectoEditando(null);
    setProyectoForm({ nombre: '', descripcion: '' });
    setProyectoDialogVisible(true);
  };

  const abrirEditarProyecto = (proyecto) => {
    setProyectoEditando(proyecto);
    setProyectoForm({ nombre: proyecto.nombre, descripcion: proyecto.descripcion || '' });
    setProyectoDialogVisible(true);
  };

  const guardarProyecto = async () => {
    if (!proyectoForm.nombre.trim()) {
      toast.current.show({
        severity: 'warn',
        summary: 'Atención',
        detail: 'El nombre del proyecto es obligatorio',
        life: 3000,
      });
      return;
    }

    setSavingProyecto(true);
    try {
      if (proyectoEditando) {
        await proyectosAPI.actualizar(proyectoEditando.id, proyectoForm);
        toast.current.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Proyecto actualizado correctamente',
          life: 3000,
        });
      } else {
        await proyectosAPI.crear(proyectoForm);
        toast.current.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Proyecto creado correctamente',
          life: 3000,
        });
      }
      setProyectoDialogVisible(false);
      loadProyectos();
    } catch (error) {
      console.error('Error al guardar proyecto:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'No se pudo guardar el proyecto',
        life: 3000,
      });
    } finally {
      setSavingProyecto(false);
    }
  };

  const confirmarEliminarProyecto = (proyecto) => {
    confirmDialog({
      message: `¿Está seguro de eliminar el proyecto "${proyecto.nombre}"? Se eliminarán también todos sus repositorios asociados.`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => eliminarProyecto(proyecto.id),
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
    });
  };

  const eliminarProyecto = async (id) => {
    try {
      await proyectosAPI.eliminar(id);
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Proyecto eliminado correctamente',
        life: 3000,
      });
      loadProyectos();
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'No se pudo eliminar el proyecto',
        life: 3000,
      });
    }
  };

  const abrirRepositorios = (proyecto) => {
    setProyectoSeleccionado(proyecto);
    setRepositoriosDialogVisible(true);
    loadRepositorios(proyecto.id);
  };

  const abrirNuevoRepositorio = () => {
    setRepositorioForm({ nombre: '', descripcion: '', url: '' });
    setRepositorioDialogVisible(true);
  };

  const guardarRepositorio = async () => {
    if (!repositorioForm.nombre.trim()) {
      toast.current.show({
        severity: 'warn',
        summary: 'Atención',
        detail: 'El nombre del repositorio es obligatorio',
        life: 3000,
      });
      return;
    }

    setSavingRepositorio(true);
    try {
      await proyectosAPI.agregarRepositorio(proyectoSeleccionado.id, repositorioForm);
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Repositorio agregado correctamente',
        life: 3000,
      });
      setRepositorioDialogVisible(false);
      loadRepositorios(proyectoSeleccionado.id);
    } catch (error) {
      console.error('Error al guardar repositorio:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'No se pudo agregar el repositorio',
        life: 3000,
      });
    } finally {
      setSavingRepositorio(false);
    }
  };

  const confirmarEliminarRepositorio = (repositorio) => {
    confirmDialog({
      message: `¿Está seguro de eliminar el repositorio "${repositorio.nombre}" del proyecto?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => eliminarRepositorio(repositorio.id),
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
    });
  };

  const eliminarRepositorio = async (repositorioId) => {
    try {
      await proyectosAPI.eliminarRepositorio(proyectoSeleccionado.id, repositorioId);
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Repositorio eliminado correctamente',
        life: 3000,
      });
      loadRepositorios(proyectoSeleccionado.id);
    } catch (error) {
      console.error('Error al eliminar repositorio:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'No se pudo eliminar el repositorio',
        life: 3000,
      });
    }
  };

  const activoTemplate = (rowData) => (
    <Tag
      value={rowData.activo ? 'Activo' : 'Inactivo'}
      severity={rowData.activo ? 'success' : 'secondary'}
    />
  );

  const accionesProyectoTemplate = (rowData) => (
    <div className="acciones-buttons">
      <Button
        icon="pi pi-database"
        className="p-button-rounded p-button-info p-button-sm"
        onClick={() => abrirRepositorios(rowData)}
        tooltip="Gestionar repositorios"
        tooltipOptions={{ position: 'top' }}
      />
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-warning p-button-sm"
        onClick={() => abrirEditarProyecto(rowData)}
        tooltip="Editar proyecto"
        tooltipOptions={{ position: 'top' }}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger p-button-sm"
        onClick={() => confirmarEliminarProyecto(rowData)}
        tooltip="Eliminar proyecto"
        tooltipOptions={{ position: 'top' }}
      />
    </div>
  );

  const accionesRepositorioTemplate = (rowData) => (
    <Button
      icon="pi pi-trash"
      className="p-button-rounded p-button-danger p-button-sm"
      onClick={() => confirmarEliminarRepositorio(rowData)}
      tooltip="Eliminar repositorio"
      tooltipOptions={{ position: 'top' }}
    />
  );

  const proyectoDialogFooter = (
    <div>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => setProyectoDialogVisible(false)}
        disabled={savingProyecto}
      />
      <Button
        label={proyectoEditando ? 'Actualizar' : 'Crear'}
        icon="pi pi-check"
        onClick={guardarProyecto}
        loading={savingProyecto}
      />
    </div>
  );

  const repositorioDialogFooter = (
    <div>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => setRepositorioDialogVisible(false)}
        disabled={savingRepositorio}
      />
      <Button
        label="Agregar"
        icon="pi pi-check"
        onClick={guardarRepositorio}
        loading={savingRepositorio}
      />
    </div>
  );

  return (
    <div className="gestion-proyectos-container">
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="page-header">
        <Button
          icon="pi pi-arrow-left"
          label="Volver"
          className="p-button-text"
          onClick={() => navigate('/admin')}
        />
        <h1>Gestión de Proyectos</h1>
        <Button
          label="Nuevo Proyecto"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={abrirNuevoProyecto}
        />
      </div>

      <Card>
        <DataTable
          value={proyectos}
          loading={loadingProyectos}
          emptyMessage="No hay proyectos creados"
          responsiveLayout="scroll"
          stripedRows
        >
          <Column field="nombre" header="Nombre" sortable />
          <Column field="descripcion" header="Descripción" sortable />
          <Column field="activo" header="Estado" body={activoTemplate} sortable />
          <Column header="Acciones" body={accionesProyectoTemplate} />
        </DataTable>
      </Card>

      {/* Dialogo de creación/edición de proyecto */}
      <Dialog
        header={proyectoEditando ? 'Editar Proyecto' : 'Nuevo Proyecto'}
        visible={proyectoDialogVisible}
        style={{ width: '450px' }}
        footer={proyectoDialogFooter}
        onHide={() => setProyectoDialogVisible(false)}
      >
        <div className="form-group">
          <label htmlFor="nombreProyecto">Nombre *</label>
          <InputText
            id="nombreProyecto"
            value={proyectoForm.nombre}
            onChange={(e) => setProyectoForm({ ...proyectoForm, nombre: e.target.value })}
            placeholder="Nombre del proyecto"
            className="w-full"
          />
        </div>
        <div className="form-group">
          <label htmlFor="descripcionProyecto">Descripción</label>
          <InputTextarea
            id="descripcionProyecto"
            value={proyectoForm.descripcion}
            onChange={(e) => setProyectoForm({ ...proyectoForm, descripcion: e.target.value })}
            placeholder="Descripción del proyecto"
            rows={3}
            className="w-full"
          />
        </div>
      </Dialog>

      {/* Dialogo de gestión de repositorios */}
      <Dialog
        header={`Repositorios del proyecto: ${proyectoSeleccionado?.nombre || ''}`}
        visible={repositoriosDialogVisible}
        style={{ width: '700px' }}
        onHide={() => setRepositoriosDialogVisible(false)}
      >
        <div className="repositorios-header">
          <p className="repositorios-descripcion">
            Un proyecto puede apuntar a más de un repositorio. Cada repositorio representa una
            fuente de datos independiente asociada a este proyecto.
          </p>
          <Button
            label="Agregar Repositorio"
            icon="pi pi-plus"
            className="p-button-success p-button-sm"
            onClick={abrirNuevoRepositorio}
          />
        </div>

        <DataTable
          value={repositorios}
          loading={loadingRepositorios}
          emptyMessage="Este proyecto no tiene repositorios asociados"
          responsiveLayout="scroll"
          stripedRows
        >
          <Column field="nombre" header="Nombre" sortable />
          <Column field="descripcion" header="Descripción" sortable />
          <Column field="url" header="URL" sortable />
          <Column header="Acciones" body={accionesRepositorioTemplate} />
        </DataTable>
      </Dialog>

      {/* Dialogo de nuevo repositorio */}
      <Dialog
        header="Agregar Repositorio"
        visible={repositorioDialogVisible}
        style={{ width: '450px' }}
        footer={repositorioDialogFooter}
        onHide={() => setRepositorioDialogVisible(false)}
      >
        <div className="form-group">
          <label htmlFor="nombreRepositorio">Nombre *</label>
          <InputText
            id="nombreRepositorio"
            value={repositorioForm.nombre}
            onChange={(e) => setRepositorioForm({ ...repositorioForm, nombre: e.target.value })}
            placeholder="Nombre del repositorio"
            className="w-full"
          />
        </div>
        <div className="form-group">
          <label htmlFor="descripcionRepositorio">Descripción</label>
          <InputTextarea
            id="descripcionRepositorio"
            value={repositorioForm.descripcion}
            onChange={(e) =>
              setRepositorioForm({ ...repositorioForm, descripcion: e.target.value })
            }
            placeholder="Descripción del repositorio"
            rows={3}
            className="w-full"
          />
        </div>
        <div className="form-group">
          <label htmlFor="urlRepositorio">URL</label>
          <InputText
            id="urlRepositorio"
            value={repositorioForm.url}
            onChange={(e) => setRepositorioForm({ ...repositorioForm, url: e.target.value })}
            placeholder="https://ejemplo.com/repositorio"
            className="w-full"
          />
        </div>
      </Dialog>
    </div>
  );
};

export default GestionProyectos;
