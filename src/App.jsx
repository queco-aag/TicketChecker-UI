import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import VerificarNumero from './components/public/VerificarNumero';
import ReclamarPremio from './components/public/ReclamarPremio';
import AdminPanel from './components/admin/AdminPanel';
import CargarPremios from './components/admin/CargarPremios';
import ListaPremios from './components/admin/ListaPremios';
import ListaEnviados from './components/admin/ListaEnviados';
import ListaPendientes from './components/admin/ListaPendientes';
import GestionProyectos from './components/admin/GestionProyectos';

// PrimeReact imports
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<VerificarNumero />} />
          <Route path="reclamar/:numero" element={<ReclamarPremio />} />
          <Route path="admin" element={<AdminPanel />} />
          <Route path="admin/cargar" element={<CargarPremios />} />
          <Route path="admin/premios" element={<ListaPremios />} />
          <Route path="admin/enviados" element={<ListaEnviados />} />
          <Route path="admin/pendientes" element={<ListaPendientes />} />
          <Route path="admin/proyectos" element={<GestionProyectos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
