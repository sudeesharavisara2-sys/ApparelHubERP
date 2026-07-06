import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AuthCommon.css";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <h1>ApparelHub ERP</h1>
        <p>Welcome, {user.username}</p>

        <div className="role-box">
          <span>Your Role</span>
          <strong>{user.role}</strong>
        </div>

        <p className="small-text">
          Dashboard Path: <strong>{user.dashboardUrl || "/dashboard"}</strong>
        </p>

        <div className="flex gap-3 mt-4">
          <button className="btn primary" onClick={() => navigate("/procurement-dashboard")}>
            Go to Procurement Dashboard
          </button>
          <button className="btn primary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;