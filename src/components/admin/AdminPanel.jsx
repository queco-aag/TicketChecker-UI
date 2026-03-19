import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { premiosAPI } from '../../services/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReclamados: 0,
    totalPendientes: 0,
    totalEnviados: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [reclamados, pendientes, enviados] = await Promise.all([
        premiosAPI.obtenerReclamados(),
        premiosAPI.obtenerPendientes(),
        premiosAPI.obtenerEnviados()
      ]);

      setStats({
        totalReclamados: reclamados.data.length || 0,
        totalPendientes: pendientes.data.length || 0,
        totalEnviados: enviados.data.length || 0
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'No se pudieron cargar las estadísticas',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel-container">
      <Toast ref={toast} />
      
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <Button
          label="Cargar Premios"
          icon="pi pi-upload"
          onClick={() => navigate('/admin/cargar')}
          className="p-button-success"
        />
      </div>

      {loading ? (
        <div className="loading-container">
          <ProgressSpinner />
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <Card className="stat-card stat-reclamados">
              <div className="stat-content">
                <i className="pi pi-gift stat-icon"></i>
                <div>
                  <h3>Premios Reclamados</h3>
                  <p className="stat-number">{stats.totalReclamados}</p>
                </div>
              </div>
            </Card>

            <Card className="stat-card stat-pendientes">
              <div className="stat-content">
                <i className="pi pi-clock stat-icon"></i>
                <div>
                  <h3>Pendientes de Envío</h3>
                  <p className="stat-number">{stats.totalPendientes}</p>
                </div>
              </div>
            </Card>

            <Card className="stat-card stat-enviados">
              <div className="stat-content">
                <i className="pi pi-check-circle stat-icon"></i>
                <div>
                  <h3>Premios Enviados</h3>
                  <p className="stat-number">{stats.totalEnviados}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="actions-grid">
            <Card className="action-card">
              <h3>
                <i className="pi pi-list"></i> Todos los Premios
              </h3>
              <p>Ver y administrar todos los premios reclamados</p>
              <Button
                label="Ver Lista"
                icon="pi pi-arrow-right"
                onClick={() => navigate('/admin/premios')}
              />
            </Card>

            <Card className="action-card">
              <h3>
                <i className="pi pi-clock"></i> Premios Pendientes
              </h3>
              <p>Premios reclamados pendientes de envío</p>
              <Button
                label="Ver Pendientes"
                icon="pi pi-arrow-right"
                className="p-button-warning"
                onClick={() => navigate('/admin/pendientes')}
              />
            </Card>

            <Card className="action-card">
              <h3>
                <i className="pi pi-check-circle"></i> Premios Enviados
              </h3>
              <p>Historial de premios ya enviados</p>
              <Button
                label="Ver Enviados"
                icon="pi pi-arrow-right"
                className="p-button-success"
                onClick={() => navigate('/admin/enviados')}
              />
            </Card>

            <Card className="action-card">
              <h3>
                <i className="pi pi-folder"></i> Proyectos
              </h3>
              <p>Gestionar proyectos y sus repositorios asociados</p>
              <Button
                label="Gestionar Proyectos"
                icon="pi pi-arrow-right"
                className="p-button-info"
                onClick={() => navigate('/admin/proyectos')}
              />
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
