<<<<<<< HEAD
import { useState, useEffect } from "react";
import { Truck, ClipboardList, Check, PackageCheck, ChevronRight } from "lucide-react";
import { purchaseOrderService } from "../services/purchaseOrderService";
import { supplierService } from "../services/supplierService";
import { COLORS } from "../theme";
=======
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AuthCommon.css";
>>>>>>> c0404b2fa0cf89e2042816d9d4ec6c6db5cc030d

export const StatCard = ({ label, value, icon: Icon, color }) => {
  return (
    <div className="bg-white rounded-xl p-5 border shadow-sm flex items-center justify-between w-full fade-in" style={{ borderColor: COLORS.border }}>
      <div>
        <h3 className="text-3xl font-bold m-0" style={{ color: COLORS.dark }}>{value !== undefined ? value : 0}</h3>
        <p className="text-sm font-medium mt-1 m-0" style={{ color: COLORS.slateText }}>{label}</p>
      </div>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: color }}>
        <Icon size={22} />
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState({ suppliers: 0, active: 0, open: 0, received: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersData, ordersData, statsData] = await Promise.all([
          supplierService.getAll().catch(() => []),
          purchaseOrderService.getAll().catch(() => []),
          purchaseOrderService.getStats().catch(() => null),
        ]);
        
        const safeSuppliers = Array.isArray(suppliersData) ? suppliersData : [];
        const safeOrders = Array.isArray(ordersData) ? ordersData : [];

        setSuppliers(safeSuppliers);
        setRecentOrders(safeOrders.slice(0, 4));

        setStats({
          suppliers: safeSuppliers.length,
          active: safeSuppliers.filter(s => s.isActive || s.IsActive).length,
          open: statsData?.totalOrders || statsData?.TotalOrders || safeOrders.filter(o => !["Received", "Cancelled"].includes(o.status || o.Status)).length,
          received: safeOrders.filter(o => (o.status || o.Status) === "Received").length
        });
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getSupplierName = (sId) => {
    if (!sId) return "Unknown";
    const found = suppliers.find(s => String(s.id || s.Id) === String(sId));
    return found?.name || found?.Name || "Unknown Vendor";
  };

  if (loading) return <div className="text-center py-12 text-slate-400">Loading Dashboard...</div>;

  return (
    <div className="flex flex-col gap-6 w-full fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <StatCard label="Total Suppliers" value={stats.suppliers} icon={Truck} color={COLORS.dark} />
        <StatCard label="Active Suppliers" value={stats.active} icon={Check} color={COLORS.success} />
        <StatCard label="Open Purchase Orders" value={stats.open} icon={ClipboardList} color={COLORS.yellow} />
        <StatCard label="Items Received" value={stats.received} icon={PackageCheck} color="#3B82F6" />
      </div>

      <div className="bg-white rounded-xl p-5 border shadow-sm" style={{ borderColor: COLORS.border }}>
        <h3 className="text-base font-semibold m-0 mb-4" style={{ color: COLORS.black }}>Module Workflow</h3>
        <div className="flex flex-wrap items-center gap-2">
          {["Login", "Manage Suppliers", "Low Stock Alert", "Create PO", "Supplier Accepts", "Receive Items", "Inventory Updated"].map((step, i, arr) => (
            <div key={step} className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: COLORS.slate, color: COLORS.slateText }}>{step}</span>
              {i < arr.length - 1 && <ChevronRight size={14} style={{ color: COLORS.slateText }} />}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 border shadow-sm" style={{ borderColor: COLORS.border }}>
        <h3 className="text-base font-semibold m-0 mb-4" style={{ color: COLORS.black }}>Recent Purchase Orders</h3>
        <div className="flex flex-col divide-y" style={{ borderColor: COLORS.border }}>
          {recentOrders.map((o) => {
            const id = o.id || o.Id;
            const sId = o.supplierId || o.SupplierId;
            const status = o.status || o.Status || "Pending";
            return (
              <div key={id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-semibold m-0 mb-0.5" style={{ color: COLORS.dark }}>PO-{o.poNumber || o.PONumber || id}</p>
                  <p className="text-xs m-0" style={{ color: COLORS.slateText }}>{getSupplierName(sId)} • {(o.orderDate || o.OrderDate || "").slice(0, 10)}</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">{status}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}