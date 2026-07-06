import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// Public pages (Lazy Loading)
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const VerifyOtp = lazy(() => import("./pages/VerifyOtp"));
const VerifyResetOtp = lazy(() => import("./pages/VerifyResetOtp"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

// Protected pages (Lazy Loading)
const Dashboard = lazy(() => import("./pages/Dashboard")); 
const ProcurementDashboard = lazy(() => import("./pages/Procurement/ProcurementDashboard"));
const SuppliersPage = lazy(() => import("./pages/Procurement/SuppliersPage"));
const PurchaseOrdersPage = lazy(() => import("./pages/Procurement/PurchaseOrdersPage"));
const AlertsPage = lazy(() => import("./pages/AlertsPage"));

// 🌟 FIX: බ්ලොක් වීම වැළැක්වීමට නව පේජ් දෙක කෙලින්ම (Directly) Import කිරීම
import SupplierResponsePortal from "./pages/Procurement/SupplierResponsePortal";
import PriceCompareInterface from "./pages/Procurement/PriceCompareInterface";

const Layout = () => (
  <Navbar>
    <Outlet />
  </Navbar>
);

function App() {
  return (
    <ToastProvider>
      <Suspense fallback={<div className="text-center py-12">Loading ApparelHub Modular Grid...</div>}>
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
              
              {/* 🌟 100% Stable Core Scope Routes */}
              <Route path="/supplier-portal" element={<SupplierResponsePortal />} />
              <Route path="/price-compare" element={<PriceCompareInterface />} />
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