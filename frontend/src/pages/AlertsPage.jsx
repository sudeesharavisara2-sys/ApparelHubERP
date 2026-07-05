import { useState, useEffect } from "react";
import { AlertTriangle, Package } from "lucide-react";
import { purchaseOrderService } from "../services/purchaseOrderService";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../theme";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await purchaseOrderService.getReorderSuggestions();
        setAlerts(data);
      } catch (err) {
        console.error("Failed to load alerts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  if (loading) return <div className="text-center py-12 text-slate-400">Loading alerts...</div>;

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.border }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: COLORS.border }}>
        <h3 className="font-semibold" style={{ color: COLORS.dark }}>Low Stock Alerts from Inventory Module</h3>
        <p className="text-xs mt-0.5" style={{ color: COLORS.slateText }}>
          GET /api/PurchaseOrder/reorder/suggestions
        </p>
      </div>
      <div className="divide-y" style={{ borderColor: COLORS.border }}>
        {alerts.map((a, idx) => (
          <div key={idx} className="flex items-center gap-4 px-5 py-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <AlertTriangle size={18} className="text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: COLORS.dark }}>{a.productName || "Product"}</p>
              <p className="text-xs" style={{ color: COLORS.slateText }}>
                Current: {a.currentStock} • Reorder level: {a.reorderLevel}
              </p>
            </div>
            <button
              onClick={() => {
                navigate("/purchase-orders");
              }}
              className="text-xs font-semibold text-white px-3.5 py-2 rounded-lg transition flex items-center gap-1"
              style={{ background: COLORS.gold }}
            >
              <Package size={14} /> Create PO
            </button>
          </div>
        ))}
        {alerts.length === 0 && (
          <div className="px-5 py-8 text-center text-sm" style={{ color: COLORS.slateText }}>
            ✅ All items are at healthy stock levels.
          </div>
        )}
      </div>
    </div>
  );
}