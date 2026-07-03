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
        <div className="min-h-screen flex items-center justify-center p-6" style={{
            background: 'radial-gradient(circle at top left, rgba(37, 99, 235, 0.16), transparent 34%), radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.15), transparent 34%), #f8fafc'
        }}>
            <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800">ApparelHub ERP</h1>
                <p className="text-gray-500 mt-1">Welcome, <span className="font-semibold">{user.username}</span></p>

                <div className="bg-blue-50 rounded-xl p-5 my-5 border border-blue-100">
                    <span className="text-sm text-gray-500 block">Your Role</span>
                    <strong className="text-2xl text-blue-600 block mt-1">{user.role}</strong>
                </div>

                <div className="grid grid-cols-2 gap-3 my-5">
                    <Link to="/suppliers" className="btn primary py-4 text-base rounded-xl">
                        📦 Suppliers
                    </Link>
                    <Link to="/purchase-orders" className="btn primary py-4 text-base rounded-xl">
                        📋 Orders
                    </Link>
                </div>

                <button className="btn danger full py-4 text-base rounded-xl" onClick={handleLogout}>
                    🚪 Logout
                </button>
            </div>
        </div>
    );
}

export default Dashboard;