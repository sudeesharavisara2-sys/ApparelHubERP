import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Truck, ClipboardList, CheckCircle2, Package, Radio, TrendingUp, AlertTriangle } from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { GRADIENTS, INK, MUTE } from '../theme';

const Workflow = () => {
  const steps = [
    { icon: Radio, title: "Sign in", desc: "Procurement officer authenticates.", grad: GRADIENTS.violet },
    { icon: Truck, title: "Manage suppliers", desc: "Add or update suppliers on file.", grad: GRADIENTS.sky },
    { icon: AlertTriangle, title: "Low-stock alert", desc: "Inventory flags a product below threshold.", grad: GRADIENTS.coral },
    { icon: ClipboardList, title: "Create order", desc: "Select a supplier and raise an order.", grad: GRADIENTS.gold },
    { icon: Package, title: "Receive items", desc: "Delivered goods are logged against the order.", grad: GRADIENTS.teal },
    { icon: TrendingUp, title: "Reporting", desc: "Analytics reads procurement data.", grad: GRADIENTS.violet },
  ];

  return (
    <div className="max-w-2xl mt-6">
      <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: INK }}>⚙️ Procurement Workflow</h3>
      {steps.map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white shadow-md" style={{ background: s.grad }}>
                <Icon size={17} />
              </div>
              {i < steps.length - 1 && <div className="w-0.5 flex-1" style={{ background: "linear-gradient(#E4DEF9, #E4DEF9)", minHeight: "30px" }} />}
            </div>
            <div className="pb-7">
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: INK }}>{s.title}</div>
              <div className="text-sm mt-0.5" style={{ color: MUTE }}>{s.desc}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Mock data - will be replaced with real API data
  const suppliers = [
    { id: 1, name: "ABC Textile", isActive: true },
    { id: 2, name: "XYZ Garments", isActive: true },
    { id: 3, name: "Best Fabric", isActive: false },
  ];
  const orders = [
    { id: 1, supplierId: 1, status: "Received", orderDate: "2026-06-28" },
    { id: 2, supplierId: 2, status: "Approved", orderDate: "2026-07-01" },
    { id: 3, supplierId: 1, status: "Pending", orderDate: "2026-07-04" },
  ];

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const active = suppliers.filter((s) => s.isActive === true).length;
  const openPOs = orders.filter((p) => !["Received", "Cancelled"].includes(p.status)).length;
  const received = orders.filter((p) => p.status === "Received").length;

  return (
    <div className="min-h-screen p-6" style={{
      background: 'radial-gradient(circle at top left, rgba(37, 99, 235, 0.16), transparent 34%), radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.15), transparent 34%), #f8fafc'
    }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500">Welcome back, <span className="font-semibold">{user.username}</span></p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 rounded-xl px-4 py-2 border border-blue-100">
              <span className="text-sm text-gray-500">Role</span>
              <strong className="text-blue-600 block">{user.role}</strong>
            </div>
            <button className="btn danger py-2 px-4 text-sm rounded-xl" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <StatCard label="Active Suppliers" value={active} sub={`${suppliers.length} on file`} grad={GRADIENTS.violet} icon={Truck} />
            <StatCard label="Open Orders" value={openPOs} sub="awaiting action" grad={GRADIENTS.gold} icon={ClipboardList} />
            <StatCard label="Received" value={received} sub="stock reconciled" grad={GRADIENTS.teal} icon={CheckCircle2} />
            <StatCard label="Total Orders" value={orders.length} sub="all time" grad={GRADIENTS.sky} icon={Package} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link to="/suppliers" className="btn primary py-4 text-base rounded-xl">
              📦 Manage Suppliers
            </Link>
            <Link to="/purchase-orders" className="btn primary py-4 text-base rounded-xl">
              📋 Purchase Orders
            </Link>
          </div>

          <Workflow />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;