import { useState, useEffect } from "react";
import { AlertTriangle, Package } from "lucide-react";
import { purchaseOrderService } from "../services/purchaseOrderService"; // 🌟 Mapped perfectly to src/services
import { useNavigate } from "react-router-dom";
import { COLORS } from "../theme"; // 🌟 Mapped perfectly to src/theme.js

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await purchaseOrderService.getReorderSuggestions();
        const normalized = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data?.alerts)
              ? data.alerts
              : [];
        setAlerts(normalized);
      } catch (err) {
        console.error("Failed to load alerts:", err);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  if (loading) return <div className="text-center py-12 text-slate-400">Loading alerts...</div>;

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden fade-in" style={{ borderColor: COLORS.border }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: COLORS.border }}>
        <h3 className="font-semibold m-0" style={{ color: COLORS.dark }}>Low Stock Alerts from Inventory Module</h3>
        <p className="text-xs mt-0.5 m-0 text-slate-400 font-mono">
          GET /api/PurchaseOrder/reorder/suggestions
        </p>
      </div>
      
      <div className="divide-y" style={{ borderColor: COLORS.border }}>
        {alerts.map((a, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4 px-5 py-4 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle size={18} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm font-semibold m-0" style={{ color: COLORS.dark }}>
                  {a.productName || a.ProductName || a.name || a.Name || "Material / Product"}
                </p>
                <p className="text-xs m-0 mt-0.5" style={{ color: COLORS.slateText }}>
                  Current: <span className="text-red-600 font-semibold">{a.currentStock ?? a.CurrentStock ?? a.stock ?? a.Stock ?? "-"}</span> • Reorder level: {a.reorderLevel ?? a.ReorderLevel ?? a.reorderLevelRequired ?? a.ReorderLevelRequired ?? "-"}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => {
                navigate("/purchase-orders");
              }}
              className="text-xs font-semibold text-slate-900 px-3.5 py-2 rounded-lg transition flex items-center gap-1 border-none shadow-sm cursor-pointer hover:opacity-90"
              style={{ background: COLORS.yellow || "#EAB308" }}
            >
              <Package size={14} /> Create PO
            </button>
          </div>
        ))}
        
        {alerts.length === 0 && (
          <div className="px-5 py-12 text-center text-sm" style={{ color: COLORS.slateText }}>
            No low stock alerts returned from the server right now.
          </div>
        )}
      </div>
    </div>
  );
}