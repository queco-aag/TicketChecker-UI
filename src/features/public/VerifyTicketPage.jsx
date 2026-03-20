import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { ticketsAPI } from '../../shared/api/client';
import { mapVerificationResponse } from '../../shared/api/mappers';

const VerifyTicketPage = () => {
  const toast = useRef(null);
  const [numero, setNumero] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  const verificar = async () => {
    if (!numero.trim()) {
      toast.current.show({
        severity: 'warn',
        summary: 'Dato requerido',
        detail: 'Introduce un numero de ticket.',
        life: 3000
      });
      return;
    }

    setLoading(true);
    setResultado(null);

    try {
      const { data } = await ticketsAPI.verificar(numero.trim());
      const mapped = mapVerificationResponse(data, numero.trim());
      setResultado(mapped);
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error de verificacion',
        detail: error.message,
        life: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="page-card" title="Verificar ticket" subTitle="Consulta si tu numero tiene premio.">
      <Toast ref={toast} />

      <div className="form-grid">
        <InputText
          value={numero}
          onChange={(event) => setNumero(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && verificar()}
          placeholder="Ejemplo: 12345"
          disabled={loading}
        />
        <Button
          label="Verificar"
          icon="pi pi-search"
          onClick={verificar}
          loading={loading}
        />
      </div>

      {resultado && (
        <section className="result-box">
          <div className="result-head">
            <h3>Resultado para el ticket {resultado.numero}</h3>
            <Tag
              value={resultado.premiado ? 'Premiado' : 'No premiado'}
              severity={resultado.premiado ? 'success' : 'danger'}
            />
          </div>

          <p>{resultado.mensaje || 'Consulta completada.'}</p>

          {resultado.premio && (
            <div className="reward-box">
              <h4>{resultado.premio.nombre}</h4>
              <p>{resultado.premio.descripcion}</p>
              {resultado.premio.urlFoto && (
                <img src={resultado.premio.urlFoto} alt={resultado.premio.nombre} className="reward-image" />
              )}
              {!resultado.reclamado ? (
                <Link to={`/reclamar/${resultado.numero}`}>
                  <Button label="Reclamar premio" icon="pi pi-gift" className="p-button-success" />
                </Link>
              ) : (
                <Tag value="Este premio ya fue reclamado" severity="warning" />
              )}
            </div>
          )}
        </section>
      )}
    </Card>
  );
};

export default VerifyTicketPage;

