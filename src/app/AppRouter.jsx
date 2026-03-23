import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './AppLayout';
import AdminLayout from './AdminLayout';
import RequireAuth from './RequireAuth';
import HomePage from '../features/public/HomePage';
import VerifyResultPage from '../features/public/VerifyResultPage';
import ClaimPrizePage from '../features/public/ClaimPrizePage';
import AdminDashboardPage from '../features/admin/AdminDashboardPage';
import UsersManagementPage from '../features/admin/UsersManagementPage';
import PrizesManagementPage from '../features/admin/PrizesManagementPage';
import UploadCsvPage from '../features/admin/UploadCsvPage';
import NumberPrizeMatchingPage from '../features/admin/NumberPrizeMatchingPage';
import YearKeysManagementPage from '../features/admin/YearKeysManagementPage';
import NumbersVerificationListPage from '../features/admin/NumbersVerificationListPage';
import ClaimedListPage from '../features/admin/ClaimedListPage';
import PendingListPage from '../features/admin/PendingListPage';
import ShippedListPage from '../features/admin/ShippedListPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="verificar/:numero" element={<VerifyResultPage />} />
          <Route path="reclamar/:numero" element={<ClaimPrizePage />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="usuarios" element={<UsersManagementPage />} />
            <Route path="premios" element={<PrizesManagementPage />} />
            <Route path="cargar-csv" element={<UploadCsvPage />} />
            <Route path="emparejamiento" element={<NumberPrizeMatchingPage />} />
            <Route path="claves-ano" element={<YearKeysManagementPage />} />
            <Route path="numeros-codigos" element={<NumbersVerificationListPage />} />
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

