import { useState, useEffect } from "react";
import { Plus, X, ClipboardList } from "lucide-react";
import { purchaseOrderService } from "../../services/purchaseOrderService";
import { supplierService } from "../../services/supplierService";
import { useToast } from "../../context/ToastContext";
import { COLORS, statusMeta } from "../../theme";

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ supplierId: "", productId: "", quantity: "", unitCost: "", season: "Summer 2026" });
  const { showToast } = useToast();

  const refreshPageData = async () => {
    try {
      const [ordersData, suppliersData] = await Promise.all([
        purchaseOrderService.getAll().catch(() => []),
        supplierService.getAll().catch(() => []),
      ]);
      const allOrders = Array.isArray(ordersData) ? ordersData : [];
      setOrders(allOrders);
      setSuppliers(Array.isArray(suppliersData) ? suppliersData : []);
    } catch {
      showToast("❌ Error loading procurement data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [ordersData, suppliersData] = await Promise.all([
          purchaseOrderService.getAll().catch(() => []),
          supplierService.getAll().catch(() => []),
        ]);

        if (!isMounted) return;

        const allOrders = Array.isArray(ordersData) ? ordersData : [];

        setOrders(allOrders);
        setSuppliers(Array.isArray(suppliersData) ? suppliersData : []);
      } catch {
        if (isMounted) {
          showToast("❌ Error loading procurement data");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchData();

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  function getSupplierName(order) {
    const candidateId = order?.supplierId ?? order?.SupplierId ?? order?.supplierID ?? order?.SupplierID ?? order?.supplier?.id ?? order?.supplier?.Id;
    const candidateName = order?.supplierName ?? order?.SupplierName ?? order?.supplier?.name ?? order?.supplier?.Name;

    if (candidateName) return candidateName;
    if (!candidateId && candidateId !== 0) return "Unknown Supplier";

    const normalizedId = String(candidateId);
    const found = suppliers.find((s) => {
      const candidateIds = [s.id, s.Id, s.supplierId, s.SupplierId, s.supplierID, s.SupplierID];
      return candidateIds.some((value) => String(value) === normalizedId);
    });

    return found?.name || found?.Name || found?.supplierName || found?.SupplierName || "Unknown Supplier";
  }

  function getStatusLabel(order) {
    const status = order?.status ?? order?.Status ?? "Pending";
    const label = statusMeta(status).label;
    return label || status;
  }

  const handleCreatePO = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        SupplierId: Number(form.supplierId),
        ExpectedDeliveryDate: new Date(Date.now() + 7 * 86400000).toISOString(),
        Remarks: "Created via React Frontend",
        BudgetedAmount: Number(form.quantity) * Number(form.unitCost),
        Season: form.season,
        Items: [{ ProductId: Number(form.productId), Quantity: Number(form.quantity), UnitCost: Number(form.unitCost) }]
      };
      await purchaseOrderService.create(payload);
      showToast("✅ Product Order created successfully!");
      setShowModal(false);
      setForm({ supplierId: "", productId: "", quantity: "", unitCost: "", season: "Summer 2026" });
      await refreshPageData();
    } catch {
      showToast("❌ Constraint validation failed");
    }
  };

  if (loading) return <div className="text-center py-12 text-slate-400">Loading Orders...</div>;

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: COLORS.border }}>
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: COLORS.border }}>
        <h3 className="font-semibold m-0" style={{ color: COLORS.black }}>Product Orders ({orders.length})</h3>
        <button
          onClick={() => setShowModal(true)}
          className="font-semibold text-sm px-3 py-2 rounded-lg border-none cursor-pointer flex items-center gap-2"
          style={{ background: COLORS.yellow, color: COLORS.black, height: "38px", whiteSpace: "nowrap" }}
        >
          <Plus size={15} /> Create Product Order
        </button>
      </div>
      <div className="divide-y" style={{ borderColor: COLORS.border }}>
        {orders.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm" style={{ color: COLORS.slateText }}>
            No purchase orders found yet.
          </div>
        ) : (
          orders.map((p) => (
            <div key={p.id || p.Id} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <ClipboardList style={{ color: COLORS.yellow }} />
                <div>
                  <p className="text-sm font-semibold m-0">PO-{p.poNumber || p.PONumber}</p>
                  <p className="text-xs m-0 mt-0.5" style={{ color: COLORS.slateText }}>
                    Supplier: {getSupplierName(p)}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-slate-800" style={{ background: COLORS.yellowBg }}>
                {getStatusLabel(p)}
              </span>
            </div>
          ))
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold m-0">New Product Order</h3>
              <button onClick={() => setShowModal(false)} className="border-none bg-none cursor-pointer"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreatePO} className="space-y-3">
              <select value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })} required>
                <option value="">Select Supplier</option>
                {suppliers.map(s => <option key={s.id || s.Id} value={s.id || s.Id}>{s.name || s.Name}</option>)}
              </select>
              <input type="number" placeholder="Product ID *" value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} required />
              <input type="number" placeholder="Quantity *" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
              <input type="number" step="0.01" placeholder="Unit Cost *" value={form.unitCost} onChange={(e) => setForm({ ...form, unitCost: e.target.value })} required />
              <button type="submit" className="btn primary full">Create Product Order</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}