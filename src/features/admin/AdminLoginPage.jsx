import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { authAPI } from '../../shared/api/client';
import { saveSession } from '../../shared/auth/authStorage';

const AdminLoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useRef(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || '/admin';

  const login = async () => {
    if (!username.trim() || !password.trim()) {
      toast.current.show({
        severity: 'warn',
        summary: 'Completa tus datos',
        detail: 'Usuario y contrasena son obligatorios.',
        life: 3000
      });
      return;
    }

    setLoading(true);
    try {
      const { data } = await authAPI.login({ username: username.trim(), password });
      saveSession(data.token, {
        username: data.username,
        email: data.email,
        fullName: data.fullName
      });
      navigate(from, { replace: true });
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Acceso denegado',
        detail: error.message,
        life: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <Card title="Acceso administracion" subTitle="Autenticacion contra /auth/login">
        <Toast ref={toast} />

        <div className="claim-form">
          <label>
            Usuario
            <InputText value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label>
            Contrasena
            <Password value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} toggleMask />
          </label>
          <Button label="Entrar" icon="pi pi-sign-in" onClick={login} loading={loading} />
          <Link to="/">
            <Button label="Volver al inicio" text />
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default AdminLoginPage;

