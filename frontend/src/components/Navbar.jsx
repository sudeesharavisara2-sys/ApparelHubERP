import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, Package, ShoppingCart, LogOut } from "lucide-react";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!user) return null;

    return (
        <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
            <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <Link to="/dashboard" className="text-xl font-bold text-blue-600">
                        ApparelHub
                    </Link>
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">ERP</span>
                </div>

                <div className="flex items-center gap-6">
                    <Link to="/dashboard" className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition">
                        <LayoutDashboard size={18} />
                        <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                    <Link to="/suppliers" className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition">
                        <Package size={18} />
                        <span className="hidden sm:inline">Suppliers</span>
                    </Link>
                    <Link to="/purchase-orders" className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition">
                        <ShoppingCart size={18} />
                        <span className="hidden sm:inline">Orders</span>
                    </Link>

                    <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                        <span className="text-sm text-gray-500 hidden md:inline">{user.username}</span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition"
                        >
                            <LogOut size={18} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;