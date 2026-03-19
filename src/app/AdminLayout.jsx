import { useMemo } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { removeSession } from '../shared/auth/authStorage';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const items = useMemo(
    () => [
      { label: 'Dashboard', icon: 'pi pi-home', command: () => navigate('/admin') },
      { label: 'Cargar CSV', icon: 'pi pi-upload', command: () => navigate('/admin/cargar-csv') },
      { label: 'Reclamados', icon: 'pi pi-list', command: () => navigate('/admin/reclamados') },
      { label: 'Pendientes', icon: 'pi pi-clock', command: () => navigate('/admin/pendientes') },
      { label: 'Enviados', icon: 'pi pi-send', command: () => navigate('/admin/enviados') }
    ],
    [navigate]
  );

  const end = (
    <div className="admin-end">
      <span className="admin-path">{location.pathname}</span>
      <Button
        label="Cerrar sesion"
        icon="pi pi-sign-out"
        text
        onClick={() => {
          removeSession();
          navigate('/admin/login');
        }}
      />
      <Link to="/">
        <Button label="Portal publico" icon="pi pi-external-link" outlined size="small" />
      </Link>
    </div>
  );

  return (
    <div className="admin-shell">
      <Menubar model={items} end={end} />
      <section className="admin-main">
        <Outlet />
      </section>
    </div>
  );
};

export default AdminLayout;

