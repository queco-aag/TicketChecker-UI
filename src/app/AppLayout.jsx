import { Link, Outlet } from 'react-router-dom';
import { Button } from 'primereact/button';

const AppLayout = () => {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>TicketChecker</h1>
          <p>Consulta y reclama premios de forma segura.</p>
        </div>
        <div className="header-actions">
          <Link to="/">
            <Button label="Verificar" icon="pi pi-search" text />
          </Link>
          <Link to="/admin/login">
            <Button label="Admin" icon="pi pi-shield" outlined />
          </Link>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;

