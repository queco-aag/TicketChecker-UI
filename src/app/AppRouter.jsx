import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './AppLayout';
import AdminLayout from './AdminLayout';
import RequireAuth from './RequireAuth';
import VerifyTicketPage from '../features/public/VerifyTicketPage';
import ClaimPrizePage from '../features/public/ClaimPrizePage';
import AdminLoginPage from '../features/admin/AdminLoginPage';
import AdminDashboardPage from '../features/admin/AdminDashboardPage';
import UploadCsvPage from '../features/admin/UploadCsvPage';
import ClaimedListPage from '../features/admin/ClaimedListPage';
import PendingListPage from '../features/admin/PendingListPage';
import ShippedListPage from '../features/admin/ShippedListPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<VerifyTicketPage />} />
          <Route path="reclamar/:numero" element={<ClaimPrizePage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="cargar-csv" element={<UploadCsvPage />} />
            <Route path="reclamados" element={<ClaimedListPage />} />
            <Route path="pendientes" element={<PendingListPage />} />
            <Route path="enviados" element={<ShippedListPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

