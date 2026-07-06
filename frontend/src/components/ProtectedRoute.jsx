import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();

  // 1. යූසර් කෙනෙක් සිස්ටම් එකට ලොග් වෙලාම නැත්නම් කෙලින්ම ලොගින් පේජ් එකට යැවීම
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. 🛡️ CRITICAL ROLE BYPASS matrix:
  // ඔයාගේ රෝල් එක මොකක් වුණත් (Procurement Officer හෝ Admin) මේ අලුත් පේජ් දෙක බ්ලොක් නොවී 
  // ලස්සනට ලෝඩ් වෙන්න මෙතනින් අවසර දෙනවා.
  const targetPath = location.pathname;
  if (targetPath === "/supplier-portal" || targetPath === "/price-compare") {
    return <Outlet />;
  }

  // සාමාන්‍ය පිටු සඳහා යූසර්ව ඇතුළට යැවීම
  return <Outlet />;
}