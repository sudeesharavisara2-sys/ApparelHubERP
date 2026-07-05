import { useState, useEffect } from "react";
import { Truck, ClipboardList, Check, PackageCheck, ChevronRight } from "lucide-react";
import { purchaseOrderService } from "../services/purchaseOrderService";
import { supplierService } from "../services/supplierService";
import { COLORS } from "../theme";

const statusStyle = {
  Pending: "bg-amber-100 text-amber-800",
  Approved: "bg-blue-100 text-blue-800",
  Ordered: "bg-indigo-100 text-indigo-800",
  Received: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-red-100 text-red-800",
};

// Complete Tailwind StatCard Component
export const StatCard = ({ label, value, icon: Icon, color }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border shadow-sm flex items-center justify-between w-full" style={{ borderColor: "#E2E8F0" }}>
      <div>
        <h3 className="text-3xl font-bold m-0" style={{ color: "#1A0E3E" }}>{value !== undefined ? value : 0}</h3>
        <p className="text-sm font-medium mt-1 m-0" style={{ color: "#64748B" }}>{label}</p>
      </div>
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0" 
        style={{ backgroundColor: color }}
      >
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
        const [suppliersData, ordersData] = await Promise.all([
          supplierService.getAll().catch(() => []),
          purchaseOrderService.getAll().catch(() => []),
        ]);
        
        const safeSuppliers = Array.isArray(suppliersData) ? suppliersData : [];
        const safeOrders = Array.isArray(ordersData) ? ordersData : [];

        setSuppliers(safeSuppliers);
        setRecentOrders(safeOrders.slice(0, 4));

        setStats({
          suppliers: safeSuppliers.length,
          active: safeSuppliers.filter((s) => s && (s.isActive === true || s.status === "Active" || s.isActive === undefined)).length,
          open: safeOrders.filter((p) => p && !["Received", "Cancelled"].includes(p.status)).length,
          received: safeOrders.filter((p) => p && p.status === "Received").length,
        });
      } catch (err) {
        console.error("Dashboard engine error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const supplierName = (sId) => {
    if (!sId || !Array.isArray(suppliers)) return "Unknown";
    const found = suppliers.find((s) => s && (s.id === sId || s.supplierId === sId));
    return found?.name || found?.supplierName || "Unknown";
  };

  if (loading) return <div className="text-center py-12 text-slate-400">Loading dashboard data...</div>;

  return (
    <div className="flex flex-col gap-6 w-full box-border fade-in">
      
      {/* 4-Column Responsive Layout Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <StatCard label="Total Suppliers" value={stats.suppliers} icon={Truck} color="#6366f1" />
        <StatCard label="Active Suppliers" value={stats.active} icon={Check} color="#10B981" />
        <StatCard label="Open Purchase Orders" value={stats.open} icon={ClipboardList} color={COLORS?.gold || "#F59E0B"} />
        <StatCard label="Items Received" value={stats.received} icon={PackageCheck} color="#ec4899" />
      </div>

      {/* Module Workflow Section */}
      <div className="bg-white rounded-2xl p-5 border shadow-sm" style={{ borderColor: COLORS?.border || "#E2E8F0" }}>
        <h3 className="text-base font-semibold m-0 mb-4" style={{ color: COLORS?.dark || "#1A0E3E" }}>Module Workflow</h3>
        <div className="flex flex-wrap items-center gap-2">
          {[
            "Login", "Manage Suppliers", "Low Stock Alert", "Create PO", 
            "Supplier Accepts", "Receive Items", "Inventory Updated", "Analytics Reads Data"
          ].map((step, i, arr) => (
            <div key={step} className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: COLORS?.slate || "#F1F5F9", color: COLORS?.slateText || "#64748B" }}>
                {step}
              </span>
              {i < arr.length - 1 && <ChevronRight size={14} style={{ color: COLORS?.slateText || "#64748B" }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Purchase Orders Feed Section */}
      <div className="bg-white rounded-2xl p-5 border shadow-sm" style={{ borderColor: COLORS?.border || "#E2E8F0" }}>
        <h3 className="text-base font-semibold m-0 mb-4" style={{ color: COLORS?.dark || "#1A0E3E" }}>Recent Purchase Orders</h3>
        <div className="flex flex-col divide-y" style={{ borderColor: COLORS?.border || "#E2E8F0" }}>
          {Array.isArray(recentOrders) && recentOrders.map((p) => {
            const orderId = p?.id || p?.purchaseOrderId || "N/A";
            const currentSupplierId = p?.supplierId;
            const currentStatus = p?.status || "Pending";

            return (
              <div key={orderId} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-semibold m-0 mb-0.5" style={{ color: COLORS?.dark || "#1A0E3E" }}>PO-{orderId}</p>
                  <p className="text-xs m-0" style={{ color: COLORS?.slateText || "#64748B" }}>
                    {supplierName(currentSupplierId)} • {p?.orderDate?.slice(0, 10) || "N/A"}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[currentStatus] || "bg-slate-100 text-slate-700"}`}>
                  {currentStatus}
                </span>
              </div>
            );
          })}
          {(!recentOrders || recentOrders.length === 0) && (
            <div className="py-4 text-center text-sm" style={{ color: COLORS?.slateText || "#64748B" }}>
              No recent orders found
            </div>
          )}
        </div>
      </div>

    </div>
  );
}