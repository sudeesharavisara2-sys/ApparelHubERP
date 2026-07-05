import { useState, useEffect } from "react";
import { Plus, X, Ban, RotateCcw, Check, PackageCheck, ClipboardList } from "lucide-react";
import { purchaseOrderService } from "../services/purchaseOrderService";
import { supplierService } from "../services/supplierService";
import { useToast } from "../context/ToastContext";
import { COLORS } from "../theme";

const statusFlow = {
  Pending: { next: "Approved", label: "Approve", icon: Check, color: "#3B82F6" },
  Approved: { next: "Received", label: "Receive Items", icon: PackageCheck, color: "#10B981" },
};

const statusStyle = {
  Pending: "bg-amber-100 text-amber-800",
  Approved: "bg-blue-100 text-blue-800",
  Ordered: "bg-indigo-100 text-indigo-800",
  Received: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    supplierId: "",
    productId: "",
    quantity: "",
    unitCost: "",
  });
  const { showToast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [ordersData, suppliersData] = await Promise.all([
          purchaseOrderService.getAll().catch(() => []),
          supplierService.getAll().catch(() => []),
        ]);

        if (!isMounted) return;

        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setSuppliers(Array.isArray(suppliersData) ? suppliersData : []);
      } catch (error) {
        console.error(error);
        showToast("❌ Failed to load data");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  // .NET PascalCase (Id / SupplierId) සහ camelCase දෙකම ආරක්ෂිතව handle කිරීම
  const supplierName = (id) => {
    if (!id || !Array.isArray(suppliers)) return "Unknown";
    const found = suppliers.find((s) => s && (s.id === id || s.Id === id || s.supplierId === id || s.SupplierId === id));
    return found?.name || found?.Name || found?.supplierName || found?.SupplierName || "Unknown";
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.supplierId || !form.productId || !form.quantity || !form.unitCost) {
      return showToast("❌ Please fill all fields");
    }
    try {
      // C# Backend DTO structure එකටම අකුරු (PascalCase) සකස් කළ payload එක
      const payload = {
        SupplierId: Number(form.supplierId),
        ExpectedDeliveryDate: new Date(Date.now() + 7 * 86400000).toISOString(),
        Remarks: "Created via Procurement Module",
        Items: [
          {
            ProductId: Number(form.productId),
            Quantity: Number(form.quantity),
            UnitCost: Number(form.unitCost),
          },
        ],
      };
      
      const newPO = await purchaseOrderService.create(payload);
      
      // Live state එක update කරගැනීම
      if (newPO) {
        setOrders([newPO, ...orders]);
      } else {
        // API response එක හිස් නම් database එකෙන් නැවත fetch කිරීම
        const ordersData = await purchaseOrderService.getAll().catch(() => []);
        setOrders(ordersData);
      }

      setForm({ supplierId: "", productId: "", quantity: "", unitCost: "" });
      setShowModal(false);
      showToast(`✅ PO Created Successfully`);
    } catch (error) {
      console.error("Failed to create PO:", error);
      const serverMessage = error.response?.data?.message || error.response?.data || "Failed to create PO";
      showToast(`❌ ${typeof serverMessage === "string" ? serverMessage : "Product ID or Database Constraint Error"}`);
    }
  };

  const advanceStatus = async (id) => {
    const po = orders.find((p) => (p.id === id || p.Id === id || p.purchaseOrderId === id || p.PurchaseOrderId === id));
    if (!po) return;
    
    const currentId = po.id || po.Id || po.purchaseOrderId || po.PurchaseOrderId;
    const currentStatus = po.status || po.Status;
    const next = statusFlow[currentStatus]?.next;
    if (!next) return;

    try {
      // Swagger URL path: /api/PurchaseOrder/{id}/status 
      await purchaseOrderService.updateStatus(currentId, next);
      
      const updated = orders.map((p) => {
        const pId = p.id || p.Id || p.purchaseOrderId || p.PurchaseOrderId;
        if (pId === currentId) {
          return { ...p, status: next, Status: next };
        }
        return p;
      });
      
      setOrders(updated);
      showToast(`✅ Status updated to ${next}`);
    } catch (error) {
      console.error("Failed to update status", error);
      showToast("❌ Failed to update status");
    }
  };

  const cancelPO = async (id) => {
    if (!confirm(`Cancel this order?`)) return;
    try {
      await purchaseOrderService.cancel(id);
      const updated = orders.map((p) => {
        const pId = p.id || p.Id || p.purchaseOrderId || p.PurchaseOrderId;
        return pId === id ? { ...p, status: "Cancelled", Status: "Cancelled" } : p;
      });
      setOrders(updated);
      showToast(`✅ Order cancelled`);
    } catch (error) {
      console.error("Failed to cancel PO", error);
      showToast("❌ Failed to cancel");
    }
  };

  const restorePO = async (id) => {
    try {
      await purchaseOrderService.restore(id);
      const updated = orders.map((p) => {
        const pId = p.id || p.Id || p.purchaseOrderId || p.PurchaseOrderId;
        return pId === id ? { ...p, status: "Pending", Status: "Pending" } : p;
      });
      setOrders(updated);
      showToast(`✅ Order restored`);
    } catch (error) {
      console.error("Failed to restore PO", error);
      showToast("❌ Failed to restore");
    }
  };

  if (loading) return <div className="text-center py-12 text-slate-400">Loading orders...</div>;

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.border }}>
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: COLORS.border }}>
        <h3 className="font-semibold" style={{ color: COLORS.dark }}>Purchase Orders ({orders.length})</h3>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 text-white text-sm font-semibold px-3.5 py-2 rounded-lg transition"
          style={{ background: COLORS.gold }}
        >
          <Plus size={15} /> Create PO
        </button>
      </div>

      <div className="divide-y" style={{ borderColor: COLORS.border }}>
        {orders.map((p) => {
          const orderId = p.id || p.Id || p.purchaseOrderId || p.PurchaseOrderId || "N/A";
          const currentSupplierId = p.supplierId || p.SupplierId;
          const currentStatus = p.status || p.Status || "Pending";
          const action = statusFlow[currentStatus];
          
          // C# backend array keys handle කිරීම
          const poItems = p.items || p.Items || p.purchaseOrderItems || p.PurchaseOrderItems || [];

          return (
            <div key={orderId} className="flex items-center gap-4 px-5 py-4 fade-in">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#FEF3C7" }}>
                <ClipboardList size={17} style={{ color: COLORS.gold }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: COLORS.dark }}>
                  PO-{orderId} — {supplierName(currentSupplierId)}
                </p>
                <div className="text-xs text-slate-500">
                  {poItems.length > 0 ? (
                    poItems.map((it, idx) => {
                      const pName = it.productName || it.ProductName || "Product " + (it.productId || it.ProductId || "");
                      const qty = it.quantity || it.Quantity || 0;
                      const cost = it.unitCost || it.UnitCost || 0;
                      return <span key={idx}>{pName} × {qty} @ Rs.{cost}</span>;
                    })
                  ) : (
                    <span>No item details attached</span>
                  )}
                  {(p.orderDate || p.OrderDate) && ` • ${(p.orderDate || p.OrderDate).slice(0, 10)}`}
                </div>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                  statusStyle[currentStatus] || "bg-slate-100 text-slate-700"
                }`}
              >
                {currentStatus}
              </span>
              <div className="flex gap-1.5 shrink-0">
                {action && (
                  <button
                    onClick={() => advanceStatus(orderId)}
                    className="flex items-center gap-1 text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition"
                    style={{ background: action.color }}
                  >
                    <action.icon size={12} /> {action.label}
                  </button>
                )}
                {!["Received", "Cancelled"].includes(currentStatus) && (
                  <button
                    onClick={() => cancelPO(orderId)}
                    className="flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition"
                  >
                    <Ban size={12} /> Cancel
                  </button>
                )}
                {currentStatus === "Cancelled" && (
                  <button
                    onClick={() => restorePO(orderId)}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
                  >
                    <RotateCcw size={12} /> Restore
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {orders.length === 0 && (
          <div className="px-5 py-8 text-center text-sm" style={{ color: COLORS.slateText }}>No purchase orders yet</div>
        )}
      </div>

      {/* New Purchase Order Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold" style={{ color: COLORS.dark }}>New Purchase Order</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <select
                value={form.supplierId}
                onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#F59E0B]"
                style={{ borderColor: COLORS.border }}
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.map((s) => {
                  const sId = s.id || s.Id || s.supplierId || s.SupplierId;
                  const sName = s.name || s.Name || "Unknown Supplier";
                  return (
                    <option key={sId} value={sId}>
                      {sName}
                    </option>
                  );
                })}
              </select>
              <input
                type="number"
                placeholder="Product ID (e.g., 1, 2) *"
                value={form.productId}
                onChange={(e) => setForm({ ...form, productId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#F59E0B]"
                style={{ borderColor: COLORS.border }}
                required
              />
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Quantity *"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  style={{ borderColor: COLORS.border }}
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Unit Cost *"
                  value={form.unitCost}
                  onChange={(e) => setForm({ ...form, unitCost: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  style={{ borderColor: COLORS.border }}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-white font-semibold py-2.5 rounded-lg text-sm transition"
                style={{ background: COLORS.gold }}
              >
                Create Purchase Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}