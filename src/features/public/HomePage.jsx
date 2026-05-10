import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { ticketsAPI, authAPI, publicConfigAPI } from '../../shared/api/client';
import { saveSession } from '../../shared/auth/authStorage';

const HomePage = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const [numero, setNumero] = useState('');
  const [activeYear, setActiveYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // Estados para login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    const cargarConfigPublica = async () => {
      try {
        const { data } = await publicConfigAPI.obtener();
        if (Number.isInteger(data?.activeYear)) {
          setActiveYear(data.activeYear);
        }
      } catch (error) {
        // Si falla la carga, se mantiene el año actual local como fallback.
      }
    };
    cargarConfigPublica();
  }, []);

  const verificarNumero = async () => {
    if (!numero.trim()) {
      toast.current.show({
        severity: 'warn',
        summary: 'Dato requerido',
        detail: 'Por favor, introduce un número de papeleta.',
        life: 3000
      });
      return;
    }

    setLoading(true);
    try {
      const { data } = await ticketsAPI.verificar(numero.trim());

      if (data.premiado) {
        // Navegar a página de verificación con resultado
        navigate(`/verificar/${numero.trim()}`, { state: { resultado: data } });
      } else {
        toast.current.show({
          severity: 'info',
          summary: 'Sin premio',
          detail: data.mensaje || 'Este número no está premiado.',
          life: 5000
        });
      }
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error de verificación',
        detail: error.message,
        life: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      toast.current.show({
        severity: 'warn',
        summary: 'Datos incompletos',
        detail: 'Usuario y contraseña son obligatorios.',
        life: 3000
      });
      return;
    }

    setLoginLoading(true);
    try {
      const response = await authAPI.login({ username: username.trim(), password });
      
      // ===== DEBUG: Ver qué devuelve el backend =====
      console.log('========== DEBUG LOGIN ==========');
      console.log('Respuesta completa:', response);
      console.log('response.data:', response.data);
      console.log('Campos en response.data:', Object.keys(response.data || {}));
      console.log('=================================');
      
      // Manejar diferentes estructuras de respuesta
      const data = response.data;
      
      // Intentar extraer el token de diferentes ubicaciones
      const token = data.token || data?.data?.token;
      const userData = {
        username: data.username || data?.data?.username || username.trim(),
        email: data.email || data?.data?.email,
        fullName: data.fullName || data?.data?.fullName
      };
      
      console.log('Token extraído:', token);
      console.log('User data extraído:', userData);
      
      if (!token) {
        console.error('❌ ERROR: No se pudo extraer el token');
        console.error('Estructura recibida:', data);
        toast.current.show({
          severity: 'error',
          summary: 'Error de autenticación',
          detail: 'No se recibió token de autenticación del servidor',
          life: 4000
        });
        return;
      }
      
      // Guardar sesión
      saveSession(token, userData);
      
      // Verificar que se guardó correctamente
      const savedToken = localStorage.getItem('ticketchecker.admin.token');
      console.log('✅ Token guardado en localStorage:', savedToken ? 'SÍ' : 'NO');
      console.log('Longitud del token:', savedToken?.length);

      toast.current.show({
        severity: 'success',
        summary: 'Acceso concedido',
        detail: `Bienvenido, ${userData.fullName || userData.username}`,
        life: 2000
      });

      setTimeout(() => {
        navigate('/admin');
      }, 1000);
    } catch (error) {
      console.error('❌ Error en login:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Acceso denegado',
        detail: error.message,
        life: 4000
      });
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="home-page">
      <Toast ref={toast} />

      {/* Header con logo y acceso admin */}
      <div className="home-header">
        <div className="logo-container">
          <div className="logo-aspadif">
            <i className="pi pi-gift" style={{ fontSize: '3rem', color: '#1976d2' }} />
            <h1>ASPADIF</h1>
          </div>
          <p className="tagline">Sorteo Solidario</p>
        </div>

        <Button
          label="Login"
          icon="pi pi-sign-in"
          outlined
          onClick={() => setShowLoginDialog(true)}
          className="admin-access-btn"
        />
      </div>

      {/* Hero section con imagen de décimo */}
      <div className="hero-section">
        <div className="decimo-display">
          <div className="decimo-mockup">
            <div className="decimo-header">
              <span>SORTEO ASPADIF</span>
              <span className="decimo-year">{activeYear}</span>
            </div>
            <div className="decimo-body">
              <div className="decimo-number-display">00000</div>
              <div className="decimo-details">
                <span>Sorteo Solidario</span>
                <span>Consulta si tu número tiene premio</span>
              </div>
            </div>
          </div>
        </div>

        <Divider />

        {/* Buscador principal */}
        <Card className="search-card">
          <div className="search-content">
            <h2>¿Tienes premio?</h2>
            <p className="search-subtitle">
              Introduce el número de tu papeleta para verificar si has sido premiado en el concurso activo
            </p>

            <div className="search-input-group">
              <span className="p-input-icon-left search-input-wrapper">
                <i className="pi pi-ticket" />
                <InputText
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && verificarNumero()}
                  placeholder="Introduce tu número (ej: 12345)"
                  disabled={loading}
                  className="search-input"
                />
              </span>
              <Button
                label="Consultar Premio"
                icon="pi pi-search"
                onClick={verificarNumero}
                loading={loading}
                className="search-button"
                size="large"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Dialog de Login Admin */}
      <Dialog
        header="Acceso Administrativo"
        visible={showLoginDialog}
        style={{ width: '450px' }}
        onHide={() => {
          setShowLoginDialog(false);
          setUsername('');
          setPassword('');
        }}
        modal
      >
        <div className="login-dialog-content">
          <p className="login-dialog-description">
            Accede con tus credenciales de administrador para gestionar premios y números.
          </p>

          <div className="login-form">
            <div className="field">
              <label htmlFor="username">Usuario</label>
              <InputText
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Nombre de usuario"
                autoComplete="username"
              />
            </div>

            <div className="field">
              <label htmlFor="password">Contraseña</label>
              <Password
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                feedback={false}
                toggleMask
                placeholder="Contraseña"
                autoComplete="current-password"
              />
            </div>

            <div className="login-actions">
              <Button
                label="Iniciar Sesión"
                icon="pi pi-sign-in"
                onClick={handleLogin}
                loading={loginLoading}
                className="p-button-primary"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default HomePage;

