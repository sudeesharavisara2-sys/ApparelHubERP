import { useState } from 'react';
import { purchaseOrderService } from '../../services/purchaseOrderService';
import { PurchaseOrderTicket } from './PurchaseOrderTicket';
import { statusMeta, STATUS_FLOW, INK, MUTE } from '../../theme';

const PurchaseOrderList = ({ orders, setOrders, suppliers, onReceive }) => {
  const [filter, setFilter] = useState("All");
  const filters = ["All", ...STATUS_FLOW, "Cancelled"];

  const advance = async (id) => {
    try {
      await purchaseOrderService.updateStatus(id, "Approved");
      const updated = orders.map(p => p.id === id ? { ...p, status: "Approved" } : p);
      setOrders(updated);
    } catch {
      alert('Error approving order');
    }
  };

  const receive = async (id) => {
    try {
      await purchaseOrderService.receiveOrder(id);
      const po = orders.find(p => p.id === id);
      if (po) onReceive(po);
      const updated = orders.map(p => p.id === id ? { ...p, status: "Received" } : p);
      setOrders(updated);
    } catch {
      alert('Error receiving order');
    }
  };

  const cancel = async (id) => {
    try {
      await purchaseOrderService.cancel(id);
      const updated = orders.map(p => p.id === id ? { ...p, status: "Cancelled" } : p);
      setOrders(updated);
    } catch {
      alert('Error cancelling order');
    }
  };

  const restore = async (id) => {
    try {
      await purchaseOrderService.restore(id);
      const updated = orders.map(p => p.id === id ? { ...p, status: "Pending" } : p);
      setOrders(updated);
    } catch {
      alert('Error restoring order');
    }
  };

  const visible = filter === "All" ? orders : orders.filter((p) => p.status === filter);
  const filterColor = (f) => f === "All" ? INK : statusMeta(f).color;

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className="text-xs px-3.5 py-1.5 rounded-full transition-all"
            style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, letterSpacing: "0.03em",
              background: filter === f ? filterColor(f) : "#fff",
              color: filter === f ? "#fff" : MUTE,
              border: `1px solid ${filter === f ? filterColor(f) : "#ECE7FB"}`,
            }}>
            {f.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {visible.map((po) => (
          <PurchaseOrderTicket key={po.id} po={po} supplier={suppliers.find((s) => s.id === po.supplierId)}
            onAdvance={advance} onCancel={cancel} onReceive={receive} onRestore={restore} />
        ))}
        {visible.length === 0 && <div className="text-sm text-center py-8" style={{ color: MUTE }}>No purchase orders in this state.</div>}
      </div>
    </div>
  );
};

export default PurchaseOrderList;