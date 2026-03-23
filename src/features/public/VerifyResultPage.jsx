import { useRef } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';

const VerifyResultPage = () => {
  const toast = useRef(null);
  const location = useLocation();
  const { numero } = useParams();
  const resultado = location.state?.resultado;

  if (!resultado) {
    return (
      <Card className="page-card" title="Resultado no disponible">
        <Toast ref={toast} />
        <p>No se encontró información del número consultado.</p>
        <Link to="/">
          <Button label="Volver al inicio" icon="pi pi-home" />
        </Link>
      </Card>
    );
  }

  return (
    <div className="verify-result-page">
      <Toast ref={toast} />

      <Link to="/">
        <Button label="Nueva consulta" icon="pi pi-arrow-left" text className="mb-3" />
      </Link>

      <Card className="result-card">
        <div className="result-header">
          <h2>Resultado de Verificación</h2>
          <Tag
            value={resultado.premiado ? '¡PREMIADO!' : 'Sin premio'}
            severity={resultado.premiado ? 'success' : 'info'}
            className="result-tag"
          />
        </div>

        <div className="numero-display">
          <span className="numero-label">Número consultado:</span>
          <span className="numero-value">{numero}</span>
        </div>

        <Divider />

        <p className="result-message">{resultado.mensaje}</p>

        {resultado.premiado && resultado.premio && (
          <div className="premio-details">
            <h3>Tu Premio</h3>

            {resultado.premio.urlFoto && (
              <div className="premio-image-container">
                <img
                  src={resultado.premio.urlFoto}
                  alt={resultado.premio.nombre}
                  className="premio-image"
                />
              </div>
            )}

            <div className="premio-info">
              <h4>{resultado.premio.nombre}</h4>
              <p>{resultado.premio.descripcion}</p>
            </div>

            <Divider />

            {!resultado.reclamado ? (
              <div className="claim-action">
                <p className="claim-prompt">
                  <i className="pi pi-info-circle" /> Para recibir tu premio, completa el proceso de reclamación.
                </p>
                <Link to={`/reclamar/${numero}`}>
                  <Button
                    label="Reclamar Premio Ahora"
                    icon="pi pi-gift"
                    className="p-button-success p-button-lg"
                    style={{ width: '100%' }}
                  />
                </Link>
              </div>
            ) : (
              <div className="already-claimed">
                <Tag
                  value="Este premio ya ha sido reclamado"
                  severity="warning"
                  icon="pi pi-check-circle"
                  style={{ fontSize: '1rem', padding: '0.75rem 1rem' }}
                />
              </div>
            )}
          </div>
        )}

        {!resultado.premiado && (
          <div className="no-prize-info">
            <i className="pi pi-info-circle" style={{ fontSize: '2rem', color: '#6b7280' }} />
            <p>Este número no tiene premio asignado en el concurso actual.</p>
            <Link to="/">
              <Button label="Consultar otro número" icon="pi pi-search" outlined />
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default VerifyResultPage;

