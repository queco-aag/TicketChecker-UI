import { useEffect, useMemo, useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';
import { rewardsAPI } from '../../shared/api/client';

const AdminDashboardPage = () => {
  const toast = useRef(null);
  const currentYear = new Date().getFullYear();
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [stats, setStats] = useState({ reclamados: 0, pendientes: 0, enviados: 0 });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [reclamados, pendientes, enviados] = await Promise.all([
          rewardsAPI.obtenerReclamados(),
          rewardsAPI.obtenerPendientes(),
          rewardsAPI.obtenerEnviados()
        ]);
        setStats({
          reclamados: reclamados.data.length,
          pendientes: pendientes.data.length,
          enviados: enviados.data.length
        });
      } catch (error) {
        toast.current.show({
          severity: 'error',
          summary: 'No se pudo cargar el dashboard',
          detail: error.message,
          life: 4000
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [selectedYear]);

  const cards = useMemo(
    () => [
      { label: 'Reclamados', value: stats.reclamados, icon: 'pi pi-inbox', className: 'stat-card' },
      { label: 'Pendientes de Envío', value: stats.pendientes, icon: 'pi pi-clock', className: 'stat-card warning' },
      { label: 'Enviados', value: stats.enviados, icon: 'pi pi-send', className: 'stat-card success' }
    ],
    [stats]
  );

  const yearOptions = useMemo(() => {
    const years = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push({ label: `Año ${i}`, value: i });
    }
    return years;
  }, [currentYear]);

  return (
    <section className="dashboard-page">
      <Toast ref={toast} />

      <div className="page-header">
        <div>
          <h2>Panel Administrativo - Año {selectedYear}</h2>
          <p>Resumen de estado de premios y reclamaciones</p>
        </div>
        <Dropdown
          value={selectedYear}
          options={yearOptions}
          onChange={(e) => setSelectedYear(e.value)}
          placeholder="Seleccionar año"
        />
      </div>

      {loading ? (
        <div className="loading-container">
          <ProgressSpinner />
        </div>
      ) : (
        <div className="stats-grid">
          {cards.map((card) => (
            <Card key={card.label} className={card.className}>
              <div className="stat-content">
                <i className={card.icon} />
                <div>
                  <span>{card.label}</span>
                  <h3>{card.value}</h3>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminDashboardPage;

