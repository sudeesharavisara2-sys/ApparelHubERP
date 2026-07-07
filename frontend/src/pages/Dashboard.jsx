import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AuthCommon.css";

function Dashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // ⚠️ ආරක්ෂිත පියවර: පරිශීලකයාගේ Role එක අනුව Auto-Redirect කිරීම
    useEffect(() => {
        if (user) {
            const role = user.role;
            if (role === "HROfficer" || role === "HR" || role === "Admin" || role === "Senior HR Officer") {
                navigate("/hr-dashboard");
            }
        } else {
            navigate("/login");
        }
    }, [user, navigate]);

    if (!user) {
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

                <button className="btn primary" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Dashboard;