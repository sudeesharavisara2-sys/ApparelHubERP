import { useState, useEffect, useCallback } from "react";
import { Plus, X, ClipboardList } from "lucide-react";
import { purchaseOrderService } from "../services/purchaseOrderService";
import { supplierService } from "../services/supplierService";
import { useToast } from "../context/ToastContext";
import { COLORS, statusMeta } from "../theme";

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ supplierId: "", productId: "", quantity: "", unitCost: "", season: "Summer 2026" });
  const { showToast } = useToast();

  const loadPageData = useCallback(async () => {
    try {
      const [ordersData, suppliersData] = await Promise.all([
        purchaseOrderService.getAll().catch(() => []),
        supplierService.getAll().catch(() => []),
      ]);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setSuppliers(Array.isArray(suppliersData) ? suppliersData : []);
    } catch {
      showToast("❌ Error loading procurement data");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    let active = true;
    const initialize = async () => {
      if (!active) return;
      await loadPageData();
    };
    initialize();
    return () => {
      active = false;
    };
  }, [loadPageData]);

  const getSupplierName = (id) => {
    const found = suppliers.find(s => String(s.id || s.Id) === String(id));
    return found?.name || found?.Name || "Unknown Supplier";
  };

  const handleCreatePO = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        SupplierId: Number(form.supplierId),
        ExpectedDeliveryDate: new Date(Date.now() + 7 * 86400000).toISOString(),
        Remarks: "Created via React Frontend",
        BudgetedAmount: Number(form.quantity) * Number(form.unitCost),
        Season: form.season,
        Items: [
          {
            ProductId: Number(form.productId),
            Quantity: Number(form.quantity),
            UnitCost: Number(form.unitCost)
          }
        ]
      };

      await purchaseOrderService.create(payload);
      showToast("✅ Purchase Order created successfully!");
      setShowModal(false);
      setForm({ supplierId: "", productId: "", quantity: "", unitCost: "", season: "Summer 2026" });
      loadPageData();
    } catch (error) {
      const errMsg = error.response?.data?.message || "Product ID or Supplier ID invalid constraint.";
      showToast(`❌ ${errMsg}`);
    }
  };

  const handleUpdateStatus = async (id, nextStatus) => {
    try {
      await purchaseOrderService.updateStatus(id, nextStatus);
      showToast(`✅ Status updated to ${nextStatus}`);
      loadPageData();
    } catch {
      showToast("❌ Failed to change status");
    }
  };

  if (loading) return <div className="text-center py-12 text-slate-400">Loading Orders...</div>;

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden fade-in" style={{ borderColor: COLORS.border }}>
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: COLORS.border }}>
        <h3 className="font-semibold m-0" style={{ color: COLORS.black }}>Purchase Orders ({orders.length})</h3>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 text-slate-900 text-sm font-semibold px-3.5 py-2 rounded-lg transition border-none cursor-pointer" style={{ background: COLORS.yellow }}>
          <Plus size={15} /> Create PO
        </button>
      </div>

      <div className="divide-y" style={{ borderColor: COLORS.border }}>
        {orders.map((p) => {
          const poId = p.id || p.Id;
          const status = p.status || p.Status || "Draft";
          const sMeta = statusMeta(status);
          const items = p.items || p.Items || [];

          return (
            <div key={poId} className="flex items-center gap-4 px-5 py-4 justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: COLORS.yellowBg }}>
                  <ClipboardList size={17} style={{ color: COLORS.yellow }} />
                </div>
                <div>
                  <p className="text-sm font-semibold m-0" style={{ color: COLORS.dark }}>PO-{p.poNumber || p.PONumber || poId} — {getSupplierName(p.supplierId || p.SupplierId)}</p>
                  <p className="text-xs m-0 text-slate-400">
                    {items.length > 0 ? items.map(i => `${i.productName || i.ProductName || "Product " + i.productId} x ${i.quantityOrdered || i.QuantityOrdered}`).join(", ") : "No items listed"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-slate-800" style={{ background: COLORS.yellowBg }}>{sMeta.label}</span>
                {status === "Draft" && (
                  <button onClick={() => handleUpdateStatus(poId, "PendingApproval")} className="btn sm primary">Submit</button>
                )}
                {status === "PendingApproval" && (
                  <button onClick={() => handleUpdateStatus(poId, "Approved")} className="btn sm success">Approve</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold m-0" style={{ color: COLORS.black }}>New Purchase Order</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 border-none bg-none cursor-pointer"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreatePO} className="space-y-3">
              <select value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })} className="w-full p-2 rounded-lg border text-sm" required>
                <option value="">Select Supplier</option>
                {suppliers.map(s => <option key={s.id || s.Id} value={s.id || s.Id}>{s.name || s.Name}</option>)}
              </select>
              <input type="number" placeholder="Product ID *" value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} required />
              <div className="flex gap-3">
                <input type="number" placeholder="Quantity *" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
                <input type="number" step="0.01" placeholder="Unit Cost (Rs) *" value={form.unitCost} onChange={(e) => setForm({ ...form, unitCost: e.target.value })} required />
              </div>
              <button type="submit" className="btn primary full">Create Order</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}