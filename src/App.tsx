import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LogisticsProvider } from './context/LogisticsContext';

// Layouts
import { PublicLayout } from './components/common/PublicLayout';
import { DashboardLayout } from './components/common/DashboardLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { PricingPage } from './pages/PricingPage';
import { BusinessOverviewPage } from './pages/BusinessOverviewPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Business Pages
import { BusinessDashboard } from './pages/business/BusinessDashboard';
import { CreateShipmentPage } from './pages/business/CreateShipmentPage';
import { ManageShipmentsPage } from './pages/business/ManageShipmentsPage';
import { QuotationsPage } from './pages/business/QuotationsPage';
import { TrackShipmentPage } from './pages/business/TrackShipmentPage';
import { ShipmentHistoryPage } from './pages/business/ShipmentHistoryPage';

// Transporter Pages
import { TransporterDashboard } from './pages/transporter/TransporterDashboard';
import { AvailableShipmentsPage } from './pages/transporter/AvailableShipmentsPage';
import { TransporterBookingsPage } from './pages/transporter/TransporterBookingsPage';
import { VehicleManagementPage } from './pages/transporter/VehicleManagementPage';
import { EarningsDashboardPage } from './pages/transporter/EarningsDashboardPage';

// Driver Pages
import { DriverDashboard } from './pages/driver/DriverDashboard';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { VehicleApprovalsPage } from './pages/admin/VehicleApprovalsPage';
import { AllShipmentsPage } from './pages/admin/AllShipmentsPage';
import { ComplaintsTransactionsPage } from './pages/admin/ComplaintsTransactionsPage';

// Helper component to redirect authenticated users who visit /dashboard directly
const DashboardRedirect: React.FC = () => {
  const { role } = useAuth();
  if (role) {
    return <Navigate to={`/dashboard/${role}`} replace />;
  }
  return <Navigate to="/dashboard/business" replace />;
};

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <LogisticsProvider>
          <Routes>
            {/* Public Marketing & Informational Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/about" element={<BusinessOverviewPage />} />
            </Route>

            {/* Authentication Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Protected Role-Based Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardRedirect />} />

              {/* 1. Business Owner Routes */}
              <Route
                path="business"
                element={
                  <ProtectedRoute allowedRoles={['business']}>
                    <BusinessDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="business/create-shipment"
                element={
                  <ProtectedRoute allowedRoles={['business']}>
                    <CreateShipmentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="business/manage-shipments"
                element={
                  <ProtectedRoute allowedRoles={['business']}>
                    <ManageShipmentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="business/quotations"
                element={
                  <ProtectedRoute allowedRoles={['business']}>
                    <QuotationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="business/track"
                element={
                  <ProtectedRoute allowedRoles={['business', 'transporter', 'driver', 'admin']}>
                    <TrackShipmentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="business/track/:shipmentId"
                element={
                  <ProtectedRoute allowedRoles={['business', 'transporter', 'driver', 'admin']}>
                    <TrackShipmentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="business/history"
                element={
                  <ProtectedRoute allowedRoles={['business']}>
                    <ShipmentHistoryPage />
                  </ProtectedRoute>
                }
              />

              {/* 2. Transporter Routes */}
              <Route
                path="transporter"
                element={
                  <ProtectedRoute allowedRoles={['transporter']}>
                    <TransporterDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="transporter/available-shipments"
                element={
                  <ProtectedRoute allowedRoles={['transporter']}>
                    <AvailableShipmentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="transporter/bookings"
                element={
                  <ProtectedRoute allowedRoles={['transporter']}>
                    <TransporterBookingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="transporter/vehicles"
                element={
                  <ProtectedRoute allowedRoles={['transporter']}>
                    <VehicleManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="transporter/earnings"
                element={
                  <ProtectedRoute allowedRoles={['transporter']}>
                    <EarningsDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* 3. Driver Routes */}
              <Route
                path="driver"
                element={
                  <ProtectedRoute allowedRoles={['driver']}>
                    <DriverDashboard />
                  </ProtectedRoute>
                }
              />

              {/* 4. Admin Panel Routes */}
              <Route
                path="admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UserManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/vehicles"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <VehicleApprovalsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/shipments"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AllShipmentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/complaints"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ComplaintsTransactionsPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </LogisticsProvider>
      </AuthProvider>
    </Router>
  );
};

