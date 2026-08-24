import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { ForgotPasswordPage } from '../features/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../features/auth/ResetPasswordPage';
import { ProfilePage } from '../features/users/ProfilePage';
import { AccountSettingsPage } from '../features/users/AccountSettingsPage';
import { DiscoverPartnersPage } from '../features/partners/DiscoverPartnersPage';
import { PartnerDetailPage } from '../features/partners/PartnerDetailPage';
import { PartnerDashboardPage } from '../features/partners/PartnerDashboardPage';
import { MyBookingsPage } from '../features/bookings/MyBookingsPage';
import { PaymentHistoryPage } from '../features/payments/PaymentHistoryPage';
import { ChatPage } from '../features/chat/ChatPage';
import { SOSStatusPage } from '../features/sos/SOSStatusPage';
import { AdminLayout } from '../features/admin/AdminLayout';
import { AdminDashboardPage } from '../features/admin/AdminDashboardPage';
import { AdminUsersPage } from '../features/admin/AdminUsersPage';
import { AdminPartnersPage } from '../features/admin/AdminPartnersPage';
import { AdminBookingsPage } from '../features/admin/AdminBookingsPage';
import { AdminPaymentsPage } from '../features/admin/AdminPaymentsPage';
import { AdminSOSPage } from '../features/admin/AdminSOSPage';
import { AdminReportsPage } from '../features/admin/AdminReportsPage';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AdminRoute } from '../components/AdminRoute';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/partners" element={<DiscoverPartnersPage />} />
        <Route path="/partners/:id" element={<PartnerDetailPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/account/settings" element={<AccountSettingsPage />} />
          <Route path="/partner/dashboard" element={<PartnerDashboardPage />} />
          <Route path="/bookings" element={<MyBookingsPage />} />
          <Route path="/bookings/:bookingId/chat" element={<ChatPage />} />
          <Route path="/payments" element={<PaymentHistoryPage />} />
          <Route path="/sos/:id" element={<SOSStatusPage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="partners" element={<AdminPartnersPage />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="sos" element={<AdminSOSPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
