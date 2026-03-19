import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { rewardsAPI } from '../../shared/api/client';
import { mapListaNumerosPremiados } from '../../shared/api/mappers';
import ClaimsTable from './components/ClaimsTable';

const PendingListPage = () => {
  const toast = useRef(null);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await rewardsAPI.obtenerPendientes();
      setRows(mapListaNumerosPremiados(data));
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: error.message, life: 4000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markAsShipped = async (premioId) => {
    if (!premioId) {
      return;
    }

    try {
      await rewardsAPI.marcarEnviado(premioId);
      toast.current.show({
        severity: 'success',
        summary: 'Actualizado',
        detail: 'Premio marcado como enviado.',
        life: 3000
      });
      load();
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: error.message, life: 4000 });
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <ClaimsTable
        title="Premios pendientes"
        data={rows}
        loading={loading}
        showShipAction
        onShip={markAsShipped}
      />
    </>
  );
};

export default PendingListPage;

