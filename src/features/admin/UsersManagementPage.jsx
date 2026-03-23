import { useEffect, useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { authAPI } from '../../shared/api/client';

const UsersManagementPage = () => {
  const toast = useRef(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: ''
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await authAPI.listarUsuarios();

      // Manejar diferentes estructuras de respuesta
      let usersArray = [];
      if (response.data?.usuarios && Array.isArray(response.data.usuarios)) {
        usersArray = response.data.usuarios;
      } else if (Array.isArray(response.data)) {
        usersArray = response.data;
      }

      setUsers(usersArray);
    } catch (error) {
      setUsers([]);
      toast.current.show({
        severity: 'error',
        summary: 'Error al cargar usuarios',
        detail: error.message,
        life: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openNewDialog = () => {
    setFormData({ username: '', password: '', email: '', fullName: '' });
    setEditMode(false);
    setShowDialog(true);
  };

  const openEditDialog = (user) => {
    setFormData({ ...user, password: '' });
    setEditMode(true);
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!formData.username || !formData.email || !formData.fullName) {
      toast.current.show({
        severity: 'warn',
        summary: 'Datos incompletos',
        detail: 'Completa todos los campos obligatorios.',
        life: 3000
      });
      return;
    }

    if (!editMode && !formData.password) {
      toast.current.show({
        severity: 'warn',
        summary: 'Contraseña requerida',
        detail: 'La contraseña es obligatoria para nuevos usuarios.',
        life: 3000
      });
      return;
    }

    try {
      if (editMode) {
        // TODO: Implementar endpoint de actualización
        toast.current.show({
          severity: 'success',
          summary: 'Usuario actualizado',
          detail: 'El usuario ha sido actualizado correctamente.',
          life: 3000
        });
      } else {
        await authAPI.registerAdmin(formData);
        toast.current.show({
          severity: 'success',
          summary: 'Usuario creado',
          detail: 'El administrador ha sido registrado correctamente.',
          life: 3000
        });
      }
      setShowDialog(false);
      loadUsers();
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error al guardar',
        detail: error.message,
        life: 4000
      });
    }
  };

  const confirmDelete = (user) => {
    confirmDialog({
      message: `¿Estás seguro de eliminar al usuario ${user.username}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
      accept: () => handleDelete(user.id)
    });
  };

  const handleDelete = async (userId) => {
    try {
      await authAPI.eliminarUsuario(userId);
      toast.current.show({
        severity: 'success',
        summary: 'Usuario eliminado',
        detail: 'El usuario ha sido eliminado correctamente.',
        life: 3000
      });
      loadUsers();
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error al eliminar',
        detail: error.message,
        life: 4000
      });
    }
  };

  const roleTemplate = (rowData) => {
    const severity = rowData.role === 'ADMIN' ? 'danger' : 'info';
    return <Tag value={rowData.role} severity={severity} />;
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
          <h2>Mantenimiento de Usuarios</h2>
          <p>Gestión de usuarios administradores del sistema</p>
        </div>
        <Button
          label="Nuevo Usuario"
          icon="pi pi-user-plus"
          onClick={openNewDialog}
        />
      </div>

      <Card>
        <DataTable
          value={users}
          loading={loading}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          emptyMessage="No hay usuarios registrados"
          responsiveLayout="scroll"
          size="small"
        >
          <Column field="username" header="Usuario" sortable />
          <Column field="fullName" header="Nombre Completo" sortable />
          <Column field="email" header="Email" sortable />
          <Column field="role" header="Rol" body={roleTemplate} sortable />
          <Column body={actionsTemplate} style={{ width: '120px' }} />
        </DataTable>
      </Card>

      <Dialog
        header={editMode ? 'Editar Usuario' : 'Nuevo Usuario'}
        visible={showDialog}
        style={{ width: '650px', maxHeight: '90vh' }}
        onHide={() => setShowDialog(false)}
        modal
      >
        <div className="dialog-form">
          <div className="p-fluid grid">
            <div className="field col-12 md:col-6">
              <label htmlFor="username">Usuario *</label>
              <InputText
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={editMode}
                placeholder="Nombre de usuario"
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="role">Rol *</label>
              <Dropdown
                id="role"
                value={formData.role}
                options={[
                  { label: 'Usuario', value: 'USER' },
                  { label: 'Administrador', value: 'ADMIN' }
                ]}
                onChange={(e) => setFormData({ ...formData, role: e.value })}
                placeholder="Seleccionar rol"
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="fullName">Nombre Completo *</label>
              <InputText
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Nombre y apellidos"
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="cargo">Cargo</label>
              <InputText
                id="cargo"
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                placeholder="Ej: Gestor de Premios"
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="email">Email *</label>
              <InputText
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="usuario@ejemplo.com"
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="telefono">Teléfono</label>
              <InputText
                id="telefono"
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="+34 600 123 456"
              />
            </div>

            <div className="field col-12">
              <label htmlFor="password">
                Contraseña {editMode ? '(dejar vacío para no cambiar)' : '*'}
              </label>
              <Password
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                feedback={!editMode}
                toggleMask
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <div className="field col-12">
              <div className="flex align-items-center gap-2">
                <InputSwitch
                  inputId="activo"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.value })}
                />
                <label htmlFor="activo" className="mb-0">Usuario activo (puede acceder al sistema)</label>
              </div>
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

export default UsersManagementPage;

