import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { removeSession } from '../shared/auth/authStorage';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: 'pi pi-home', end: true },
    { to: '/admin/cargar-csv', label: 'Cargar CSV', icon: 'pi pi-upload' },
    { to: '/admin/reclamados', label: 'Reclamados', icon: 'pi pi-list' },
    { to: '/admin/pendientes', label: 'Pendientes', icon: 'pi pi-clock' },
    { to: '/admin/enviados', label: 'Enviados', icon: 'pi pi-send' }
  ];

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
      <header className="admin-topbar">
        <nav className="admin-nav" aria-label="Navegacion administrativa">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? 'is-active' : ''}`
              }
            >
              <i className={item.icon} aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        {end}
      </header>

      <section className="admin-main">
        <Outlet />
      </section>
    </div>
  );
};

export default AdminLayout;

