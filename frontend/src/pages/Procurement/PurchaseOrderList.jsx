import { useState } from 'react';
import { purchaseOrderService } from '../../services/purchaseOrderService';
import PurchaseOrderTicket from './PurchaseOrderTicket';
import { STATUS_FLOW, COLORS } from '../../theme';

const PurchaseOrderList = ({ orders, setOrders, suppliers, onReceive }) => {
  const [filter, setFilter] = useState("All");
  const filters = ["All", ...STATUS_FLOW, "Cancelled"];

  const advance = async (id) => {
    try {
      await purchaseOrderService.updateStatus(id, "Approved");
      setOrders(orders.map(p => (p.id || p.Id) === id ? { ...p, status: "Approved", Status: "Approved" } : p));
    } catch {
      alert('Error approving order');
    }
  };

  const receive = async (id) => {
    try {
      await purchaseOrderService.receiveOrder(id);
      const po = orders.find(p => (p.id || p.Id) === id);
      if (po && onReceive) onReceive(po);
      setOrders(orders.map(p => (p.id || p.Id) === id ? { ...p, status: "Received", Status: "Received" } : p));
    } catch {
      alert('Error receiving order');
    }
  };

  const cancel = async (id) => {
    try {
      await purchaseOrderService.cancel(id);
      setOrders(orders.map(p => (p.id || p.Id) === id ? { ...p, status: "Cancelled", Status: "Cancelled" } : p));
    } catch {
      alert('Error cancelling order');
    }
  };

  const visible = filter === "All" ? orders : orders.filter((p) => (p.status || p.Status) === filter);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap mb-2">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className="text-xs px-3.5 py-1.5 rounded-full font-semibold border transition-all cursor-pointer"
            style={{
              background: filter === f ? COLORS.dark : "#fff",
              color: filter === f ? "#fff" : COLORS.slateText,
              borderColor: filter === f ? COLORS.dark : COLORS.border
            }}>
            {f.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {visible.map((po) => (
          <PurchaseOrderTicket 
            key={po.id || po.Id} 
            po={po} 
            supplier={suppliers.find((s) => String(s.id || s.Id) === String(po.supplierId || po.SupplierId))}
            onAdvance={advance} onCancel={cancel} onReceive={receive} 
          />
        ))}
        {visible.length === 0 && <div className="text-sm text-center py-8 text-slate-400">No product orders found in this state.</div>}
      </div>
    </div>
  );
};

export default PurchaseOrderList;