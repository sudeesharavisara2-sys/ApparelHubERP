import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!user) {
        navigate("/login");
        return null;
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-card">
                <h1>ApparelHub ERP</h1>
                <p>Welcome, {user.username}</p>

                <div className="role-box">
                    <span>Your Role</span>
                    <strong>{user.role}</strong>
                </div>

                <button className="btn primary" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Dashboard;