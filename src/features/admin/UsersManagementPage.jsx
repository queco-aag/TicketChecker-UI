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
import { FilterMatchMode } from 'primereact/api';
import { authAPI } from '../../shared/api/client';

const UsersManagementPage = () => {
  const toast = useRef(null);
  const dt = useRef(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    username: { value: null, matchMode: FilterMatchMode.CONTAINS },
    email: { value: null, matchMode: FilterMatchMode.CONTAINS },
    role: { value: null, matchMode: FilterMatchMode.EQUALS }
  });
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    role: 'USER'
  });

  const roleOptions = [
    { label: 'Usuario', value: 'USER' },
    { label: 'Administrador', value: 'ADMIN' }
  ];

  const loadUsers = async () => {
    setLoading(true);
    // Limpiar el estado antes de cargar para forzar re-render
    setUsers([]);
    
    try {
      const response = await authAPI.listarUsuarios();

      // Manejar diferentes estructuras de respuesta
      let usersArray = [];
      if (response.data?.usuarios && Array.isArray(response.data.usuarios)) {
        usersArray = response.data.usuarios;
      } else if (Array.isArray(response.data)) {
        usersArray = response.data;
      }

      console.log('========== DEBUG USUARIOS ==========');
      console.log('Respuesta completa:', response.data);
      console.log('Array de usuarios:', usersArray);
      if (usersArray.length > 0) {
        console.log('Ejemplo de usuario (primero):', usersArray[0]);
        console.log('Campos disponibles:', Object.keys(usersArray[0]));
      }
      console.log('====================================');

      // Normalizar datos: asegurar que cada usuario tenga un campo role
      const normalizedUsers = usersArray.map(user => {
        console.log(`Usuario "${user.username}":`, {
          role: user.role,
          rol: user.rol,
          roles: user.roles,
          authorities: user.authorities
        });
        
        // Función helper para extraer rol
        const extractRole = (user) => {
          // 1. Intentar campo role directo
          if (user.role) {
            let roleStr = typeof user.role === 'string' ? user.role : String(user.role);
            // Remover prefijo ROLE_ si existe
            roleStr = roleStr.startsWith('ROLE_') ? roleStr.substring(5) : roleStr;
            return roleStr.toUpperCase();
          }
          
          // 2. Intentar campo rol (español)
          if (user.rol) {
            let roleStr = typeof user.rol === 'string' ? user.rol : String(user.rol);
            // Remover prefijo ROLE_ si existe
            roleStr = roleStr.startsWith('ROLE_') ? roleStr.substring(5) : roleStr;
            return roleStr.toUpperCase();
          }
          
          // 3. Intentar array roles
          if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
            let firstRole = user.roles[0];
            let roleStr = typeof firstRole === 'string' ? firstRole : String(firstRole);
            // Remover prefijo ROLE_ si existe
            roleStr = roleStr.startsWith('ROLE_') ? roleStr.substring(5) : roleStr;
            return roleStr.toUpperCase();
          }
          
          // 4. Intentar authorities (Spring Security)
          if (user.authorities && Array.isArray(user.authorities) && user.authorities.length > 0) {
            const authority = user.authorities.find(a => a.authority || a.role);
            if (authority) {
              let roleStr = authority.authority || authority.role;
              if (typeof roleStr === 'string') {
                // Remover prefijo ROLE_ si existe
                roleStr = roleStr.startsWith('ROLE_') ? roleStr.substring(5) : roleStr;
                return roleStr.toUpperCase();
              }
            }
          }
          
          // 5. Por defecto USER
          console.warn(`⚠️ Usuario "${user.username}" no tiene rol detectable. Asignando USER por defecto.`);
          return 'USER';
        };
        
        const finalRole = extractRole(user);
        console.log(`  → Rol final asignado: "${finalRole}"`);
        
        return {
          ...user,
          role: finalRole
        };
      });

      console.log('Usuarios normalizados (final):', normalizedUsers);
      setUsers(normalizedUsers);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
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
    initFilters();
  }, []);

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      username: { value: null, matchMode: FilterMatchMode.CONTAINS },
      email: { value: null, matchMode: FilterMatchMode.CONTAINS },
      role: { value: null, matchMode: FilterMatchMode.EQUALS }
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
    setFormData({ username: '', password: '', email: '', fullName: '', role: 'USER' });
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
        // Actualizar usuario - solo email y fullName
        const updateData = {
          email: formData.email,
          fullName: formData.fullName
        };
        await authAPI.actualizarUsuario(formData.id, updateData);
        toast.current.show({
          severity: 'success',
          summary: 'Usuario actualizado',
          detail: 'El usuario ha sido actualizado correctamente.',
          life: 3000
        });
      } else {
        // Crear nuevo usuario según el rol seleccionado
        const userData = {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          fullName: formData.fullName
        };
        
        if (formData.role === 'ADMIN') {
          await authAPI.registerAdmin(userData);
          toast.current.show({
            severity: 'success',
            summary: 'Administrador creado',
            detail: 'El administrador ha sido registrado correctamente.',
            life: 3000
          });
        } else {
          await authAPI.register(userData);
          toast.current.show({
            severity: 'success',
            summary: 'Usuario creado',
            detail: 'El usuario ha sido registrado correctamente.',
            life: 3000
          });
        }
      }
      
      // Cerrar el dialog
      setShowDialog(false);
      
      // Limpiar filtros para mostrar todos los usuarios
      initFilters();
      
      // Recargar la lista de usuarios (esperar a que termine)
      await loadUsers();
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
      // Limpiar filtros para mostrar todos los usuarios
      initFilters();
      // Esperar a que se recargue la lista
      await loadUsers();
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error al eliminar',
        detail: error.message,
        life: 4000
      });
    }
  };

  const handleToggleHabilitado = async (usuario) => {
    try {
      await authAPI.toggleHabilitado(usuario.id);
      toast.current.show({
        severity: 'success',
        summary: 'Estado actualizado',
        detail: `Usuario ${!usuario.habilitado ? 'activado' : 'desactivado'} correctamente.`,
        life: 3000
      });
      // Limpiar filtros para mostrar todos los usuarios
      initFilters();
      // Esperar a que se recargue la lista
      await loadUsers();
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error al cambiar estado',
        detail: error.message,
        life: 4000
      });
    }
  };

  const roleTemplate = (rowData) => {
    // El rol ya viene normalizado desde loadUsers
    const role = rowData.role || 'USER';
    
    if (role === 'ADMIN') {
      return (
        <Tag 
          value="ADMINISTRADOR" 
          severity="danger" 
          icon="pi pi-shield"
          style={{ fontWeight: 'bold' }}
        />
      );
    } else {
      return (
        <Tag 
          value="USUARIO" 
          severity="info" 
          icon="pi pi-user"
        />
      );
    }
  };

  // Template para filtro de rol
  const roleFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={[
          { label: 'Todos', value: null },
          { label: 'Administrador', value: 'ADMIN' },
          { label: 'Usuario', value: 'USER' }
        ]}
        onChange={(e) => options.filterCallback(e.value)}
        placeholder="Filtrar por rol"
        className="p-column-filter"
        showClear={false}
        style={{ minWidth: '10rem' }}
      />
    );
  };

  // Comparador personalizado para ordenar roles (ADMIN primero)
  const roleComparator = (role1, role2) => {
    const roleHierarchy = { 'ADMIN': 2, 'USER': 1 };
    // Los roles ya vienen normalizados desde loadUsers
    return (roleHierarchy[role2] || 0) - (roleHierarchy[role1] || 0);
  };

  const habilitadoTemplate = (rowData) => {
    const habilitado = rowData.habilitado === undefined || rowData.habilitado === null ? true : rowData.habilitado;
    return (
      <div className="flex align-items-center gap-2">
        <InputSwitch
          checked={habilitado}
          onChange={() => handleToggleHabilitado(rowData)}
          tooltip={habilitado ? 'Click para desactivar' : 'Click para activar'}
        />
        <Tag 
          value={habilitado ? 'Activo' : 'Inactivo'} 
          severity={habilitado ? 'success' : 'danger'} 
          icon={habilitado ? 'pi pi-check' : 'pi pi-times'} 
        />
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
        <div className="table-header">
          <div className="table-header-left">
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                placeholder="Buscar usuarios..."
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
            <div className="flex gap-2">
              <Tag
                icon="pi pi-shield"
                value={`${users.filter(u => u.role === 'ADMIN').length} Admin`}
                severity="danger"
              />
              <Tag
                icon="pi pi-user"
                value={`${users.filter(u => u.role === 'USER').length} User`}
                severity="info"
              />
              <Tag
                value={`${users.length} Total`}
                severity="success"
              />
            </div>
          </div>
        </div>

        <DataTable
          ref={dt}
          value={users}
          loading={loading}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          emptyMessage="No hay usuarios registrados"
          size="small"
          filters={filters}
          globalFilterFields={['username', 'fullName', 'email', 'role']}
          filterDisplay="row"
          stripedRows
          sortField="role"
          sortOrder={-1}
        >
          <Column field="username" header="Usuario" sortable filter filterPlaceholder="Buscar" style={{ width: '180px' }} />
          <Column field="fullName" header="Nombre Completo" sortable filter filterPlaceholder="Buscar" />
          <Column field="email" header="Email" sortable filter filterPlaceholder="Buscar" style={{ width: '250px' }} />
          <Column 
            field="role" 
            header="Rol" 
            body={roleTemplate} 
            sortable 
            filter
            filterElement={roleFilterTemplate}
            showFilterMatchModes={false}
            sortFunction={(e) => {
              const data = [...e.data];
              return data.sort((a, b) => {
                // Los roles ya están normalizados en mayúsculas
                return e.order * roleComparator(a.role || 'USER', b.role || 'USER');
              });
            }}
            style={{ width: '170px' }} 
          />
          <Column field="habilitado" header="Estado" body={habilitadoTemplate} sortable style={{ width: '120px' }} />
          <Column body={actionsTemplate} exportable={false} style={{ width: '120px' }} frozen alignFrozen="right" />
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
              {editMode && <small className="text-muted">El nombre de usuario no se puede modificar</small>}
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

            <div className="field col-12">
              <label htmlFor="fullName">Nombre Completo *</label>
              <InputText
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Nombre y apellidos"
              />
            </div>

            {!editMode && (
              <>
                <div className="field col-12">
                  <label htmlFor="role">Rol *</label>
                  <Dropdown
                    id="role"
                    value={formData.role}
                    options={roleOptions}
                    onChange={(e) => setFormData({ ...formData, role: e.value })}
                    placeholder="Seleccionar rol"
                  />
                  <small className="text-muted">
                    {formData.role === 'ADMIN' 
                      ? 'Los administradores tienen acceso completo al sistema'
                      : 'Los usuarios tienen acceso limitado al sistema'}
                  </small>
                </div>

                <div className="field col-12">
                  <label htmlFor="password">Contraseña *</label>
                  <Password
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    feedback
                    toggleMask
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>
              </>
            )}
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

