import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// ---- UPDATE THESE PATHS TO MATCH YOUR NEW FILE STRUCTURE ----
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const VerifyOtp = lazy(() => import("./pages/VerifyOtp"));
const VerifyResetOtp = lazy(() => import("./pages/VerifyResetOtp"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

// Protected pages – adjust these!
const Dashboard = lazy(() => import("./pages/Dashboard")); 
const ProcurementDashboard = lazy(() => import("./pages/Procurement/ProcurementDashboard"));
const SuppliersPage = lazy(() => import("./pages/Procurement/SuppliersPage"));
const PurchaseOrdersPage = lazy(() => import("./pages/Procurement/PurchaseOrdersPage"));
const AlertsPage = lazy(() => import("./pages/AlertsPage"));

// ❗ If AlertsPage still exists, find its new path and update this import:
// const AlertsPage = lazy(() => import("./pages/Procurement/AlertsPage")); // old path – fix it!

// If you no longer have AlertsPage, comment out the import and remove the route below.

const Layout = () => (
  <Navbar>
    <Outlet />
  </Navbar>
);

function App() {
  return (
    <ToastProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route element={<Layout />}>
              <Route path="/procurement-dashboard" element={<ProcurementDashboard />} />
              <Route path="/suppliers" element={<SuppliersPage />} />
              <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ToastProvider>
  );
}

export default App;