import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyResetOtp from "./pages/VerifyResetOtp";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import InventoryDashboard from "./pages/Inventory/InventoryDashboard";
import AddProduct from "./pages/Inventory/AddProduct";
import EditProduct from "./pages/Inventory/EditProduct";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
                path="/inventory"
                element={
                   <ProtectedRoute>
                       <InventoryDashboard />
                   </ProtectedRoute>
                }
           />
            <Route path="*" element={<Navigate to="/" />} />
            <Route
               path="/inventory/add"
               element={
                   <ProtectedRoute>
                      <AddProduct />
                   </ProtectedRoute>
               }
           />
            <Route
               path="/inventory/edit/:id"
               element={
                   <ProtectedRoute>
                      <EditProduct />
                   </ProtectedRoute>
               }
           />
        </Routes>
    );
}

export default App;