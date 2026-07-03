import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
        <div className="dashboard-page fade-in">
            <div className="dashboard-card">
                <div className="logo">ApparelHub ERP</div>
                <p className="subtitle">Welcome back, {user.username}</p>

                <div className="role-badge">
                    <span>Your Role</span>
                    <strong>{user.role}</strong>
                </div>

                <div className="dashboard-grid">
                    <Link to="/suppliers" className="btn btn-primary">
                        📦 Suppliers
                    </Link>
                    <Link to="/purchase-orders" className="btn btn-primary">
                        📋 Orders
                    </Link>
                </div>

                <button onClick={handleLogout} className="btn btn-danger btn-full">
                    🚪 Logout
                </button>
            </div>
        </div>
    );
}

export default Dashboard;