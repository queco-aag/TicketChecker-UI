import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const items = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      command: () => navigate('/')
    },
    {
      label: 'Panel Admin',
      icon: 'pi pi-cog',
      command: () => navigate('/admin')
    }
  ];

  const start = (
    <div className="header-logo">
      <img src="/assets/logo-aspadif.png" alt="ASPADIF" height="40" onError={(e) => e.target.style.display = 'none'} />
      <span className="header-title">Sistema de Gestión de Premios</span>
    </div>
  );

  return (
    <header className="app-header">
      <Menubar model={items} start={start} className="aspadif-menubar" />
    </header>
  );
};

export default Header;
