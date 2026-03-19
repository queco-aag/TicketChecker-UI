import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { numerosAPI } from '../../services/api';
import { mapNumeroVerificationResponse } from '../../services/apiMappers';
import './VerificarNumero.css';

const VerificarNumero = () => {
  const [numero, setNumero] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const toast = useRef(null);
  const navigate = useNavigate();

  const handleVerificar = async () => {
    if (!numero.trim()) {
      toast.current.show({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Por favor ingrese un número',
        life: 3000
      });
      return;
    }

    setLoading(true);
    setResultado(null);

    try {
      const response = await numerosAPI.verificar(numero);
      // Mapear la respuesta de la API al formato esperado
      const mappedData = mapNumeroVerificationResponse(response.data);
      setResultado(mappedData);

      if (mappedData.tienePremio) {
        toast.current.show({
          severity: 'success',
          summary: '¡Felicidades!',
          detail: 'Este número tiene premio',
          life: 3000
        });
      } else {
        toast.current.show({
          severity: 'info',
          summary: 'Sin premio',
          detail: 'Este número no tiene premio',
          life: 3000
        });
      }
    } catch (error) {
      console.error('Error al verificar número:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'No se pudo verificar el número. Por favor intente nuevamente.',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReclamar = () => {
    navigate(`/reclamar/${numero}`);
  };

  return (
    <div className="verificar-numero-container">
      <Toast ref={toast} />
      
      <Card title="Verificar Número de Ticket" className="verificar-card">
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="numero">Número de Ticket</label>
            <div className="p-inputgroup">
              <InputText
                id="numero"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="Ingrese el número de su ticket"
                disabled={loading}
                onKeyPress={(e) => e.key === 'Enter' && handleVerificar()}
              />
              <Button
                icon="pi pi-search"
                label="Verificar"
                onClick={handleVerificar}
                loading={loading}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {loading && (
          <div className="loading-container">
            <ProgressSpinner />
          </div>
        )}

        {resultado && !loading && (
          <div className="resultado-container">
            {resultado.tienePremio ? (
              <Card className="premio-card">
                {resultado.premio.urlFoto && (
                  <img
                    src={resultado.premio.urlFoto}
                    alt={resultado.premio.nombrePremio}
                    className="premio-imagen"
                  />
                )}
                <h2>{resultado.premio.nombrePremio}</h2>
                <p className="premio-descripcion">{resultado.premio.descripcion}</p>
                
                {resultado.premio.reclamado ? (
                  <div className="premio-reclamado">
                    <i className="pi pi-check-circle"></i>
                    <p>Este premio ya ha sido reclamado</p>
                  </div>
                ) : (
                  <Button
                    label="Reclamar Premio"
                    icon="pi pi-gift"
                    className="p-button-success"
                    onClick={handleReclamar}
                  />
                )}
              </Card>
            ) : (
              <Card className="sin-premio-card">
                <i className="pi pi-times-circle sin-premio-icon"></i>
                <h3>Este número no tiene premio</h3>
                <p>Lo sentimos, el número ingresado no resultó ganador en este sorteo.</p>
              </Card>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default VerificarNumero;
