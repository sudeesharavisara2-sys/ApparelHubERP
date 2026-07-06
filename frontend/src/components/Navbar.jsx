import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  BarChart3, // 🌟 Procurement Dashboard එක වෙනුවෙන් අලුතින් එකතු කළා
  Truck,
  ClipboardList,
  AlertTriangle,
  LogOut,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { COLORS, GRADIENTS } from "../theme";

// 🌟 Navigation Items ලීස්ට් එක අලුත් පාරවල් (Paths) වලට අප්ඩේට් කළා
const navItems = [
  { id: "dashboard", label: "Main ERP Home", icon: LayoutDashboard, path: "/dashboard" },
  { id: "procurement-dashboard", label: "Procurement Dashboard", icon: BarChart3, path: "/procurement-dashboard" },
  { id: "suppliers", label: "Suppliers", icon: Truck, path: "/suppliers" },
  { id: "orders", label: "Purchase Orders", icon: ClipboardList, path: "/purchase-orders" },
  { id: "alerts", label: "Low Stock Alerts", icon: AlertTriangle, path: "/alerts" },
];

export default function Navbar({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // දැනට active වෙලා තියෙන පේජ් එක path එක අනුව නිවැරදිව ට්‍රැක් කිරීම
  const activeNav = navItems.find((item) => location.pathname === item.path)?.id || "dashboard";

  return (
    <div className="min-h-screen flex font-sans" style={{ background: "#F8FAFC" }}>
      {/* Sidebar - Dark Blue */}
      <aside className="w-64 flex flex-col shrink-0" style={{ background: COLORS.dark }}>
        <div className="h-16 flex items-center gap-2 px-5 border-b" style={{ borderColor: "#2A1A5E" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: GRADIENTS.gold }}>
            <Sparkles size={16} style={{ color: COLORS.dark }} />
          </div>
          <span className="font-bold text-lg text-white">Procurement</span>
        </div>

        {/* Navigation Items Render Core */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium border-none text-left cursor-pointer transition-colors ${
                  isActive ? "bg-[#F59E0B] text-[#1A0E3E]" : "text-slate-300 bg-transparent hover:bg-[#2A1A5E]"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={17} /> {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* User Info & Footer */}
        <div className="p-4 border-t" style={{ borderColor: "#2A1A5E" }}>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <ShieldCheck size={14} style={{ color: COLORS.gold }} /> JWT Authenticated
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
              style={{ background: GRADIENTS.gold, color: COLORS.dark }}
            >
              {user?.username?.slice(0, 2).toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate m-0">{user?.username || "User"}</p>
              <p className="text-xs text-slate-400 truncate m-0">{user?.role || "Procurement Officer"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 bg-transparent border-none text-left cursor-pointer transition-colors"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Render Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center px-6" style={{ borderColor: COLORS.border }}>
          <h1 className="text-lg font-bold m-0" style={{ color: COLORS.dark }}>
            {navItems.find(item => item.id === activeNav)?.label || "Dashboard"}
          </h1>
          <div className="ml-auto text-sm" style={{ color: COLORS.slateText }}>
            {new Date().toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">{children}</main>
      </div>
    </div>
  );
}