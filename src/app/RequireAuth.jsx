import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getToken } from '../shared/auth/authStorage';

const RequireAuth = () => {
  const location = useLocation();
  const token = getToken();

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;

