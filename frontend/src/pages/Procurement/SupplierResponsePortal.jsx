import { useState, useEffect } from "react";
import { purchaseOrderService } from "../../services/purchaseOrderService";
import { useToast } from "../../context/ToastContext";
import { ClipboardList, CheckCircle, XCircle } from "lucide-react";


export default function SupplierResponsePortal() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadPendingOrders = async () => {
    try {
      const data = await purchaseOrderService.getAll();
      // සප්ලයර්ට තවම තීරණයක් නොගත් (Pending/Draft) ඕඩර්ස් පමණක් ෆිල්ටර් කිරීම
      const pending = Array.isArray(data) ? data.filter(o => (o.status || o.Status) === "Pending" || (o.status || o.Status) === "Draft") : [];
      setOrders(pending);
    } catch {
      showToast("❌ Error loading supplier orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPendingOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResponse = async (id, responseStatus) => {
    try {
      // Backend එකේ Supplier Response API එකට Status එක යැවීම
      await purchaseOrderService.updateStatus(id, { status: responseStatus });
      showToast(`✅ Order ${responseStatus} successfully!`);
      loadPendingOrders(); // ලැයිස්තුව Refresh කිරීම
    } catch {
      showToast("❌ Failed to update order status");
    }
  };

  if (loading) return <div className="text-center py-12 text-slate-400">Loading Portal Matrix...</div>;

  return (
    <div className="w-full flex flex-col gap-6 font-sans text-slate-800 fade-in">
      <div className="border-b pb-3">
        <h1 className="text-2xl font-extrabold m-0 text-slate-900">Supplier Response Portal</h1>
        <p className="text-xs text-slate-400 m-0 mt-1">Review incoming corporate procurement requests</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b font-bold text-xs uppercase tracking-wider text-slate-500">
          Pending Request Queue ({orders.length})
        </div>

        <div className="divide-y divide-slate-100">
          {orders.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-400 font-medium">
              No pending purchase orders requiring response at this moment.
            </div>
          ) : (
            orders.map((o) => {
              const id = o.id || o.Id;
              const amount = o.budgetedAmount || o.BudgetedAmount || 0;
              return (
                <div key={id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center shrink-0">
                      <ClipboardList size={20} />
                    </div>
                    <div>
                      <h4 className="m-0 text-sm font-bold text-slate-900">PO Reference: PO-{o.poNumber || id}</h4>
                      <p className="m-0 text-xs text-slate-400 mt-0.5">Delivery Target: {(o.expectedDeliveryDate || "7 Days").slice(0, 10)}</p>
                      <p className="m-0 text-xs text-slate-900 font-bold mt-1">Valuation: Rs {amount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button 
                      onClick={() => handleResponse(id, "Approved")}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1 border-none shadow-sm"
                    >
                      <CheckCircle size={14} /> Accept PO
                    </button>
                    <button 
                      onClick={() => handleResponse(id, "Cancelled")}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1 border-none shadow-sm"
                    >
                      <XCircle size={14} /> Reject PO
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}