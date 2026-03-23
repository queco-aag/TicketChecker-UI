import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { rewardsAPI } from '../../shared/api/client';
import { mapListaNumerosPremiados } from '../../shared/api/mappers';
import ClaimsTable from './components/ClaimsTable';

const ShippedListPage = () => {
  const toast = useRef(null);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await rewardsAPI.obtenerEnviados();
        const dataArray = response.data?.numerosPremiados ||
                         response.data?.enviados ||
                         (Array.isArray(response.data) ? response.data : []);
        setRows(mapListaNumerosPremiados(dataArray));
      } catch (error) {
        setRows([]);
        toast.current.show({ severity: 'error', summary: 'Error', detail: error.message, life: 4000 });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <>
      <Toast ref={toast} />
      <ClaimsTable title="Premios enviados" data={rows} loading={loading} />
    </>
  );
};

export default ShippedListPage;

