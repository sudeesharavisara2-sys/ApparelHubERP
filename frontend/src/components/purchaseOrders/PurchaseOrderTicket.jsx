import React from 'react';
import { CheckCircle2, Package, Ban, RotateCcw } from 'lucide-react';
import { GRADIENTS, statusMeta, STATUS_FLOW, CORAL, MUTE } from '../../theme';

export const PurchaseOrderTicket = ({ po, supplier, onAdvance, onCancel, onReceive, onRestore }) => {
  const s = statusMeta(po.status);
  const total = po.items?.reduce((sum, it) => sum + it.quantity * it.unitCost, 0) || 0;
  const flowIndex = STATUS_FLOW.indexOf(po.status);
  const cancelled = po.status === "Cancelled";
  const pulsing = po.status === "Pending";

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: "#fff", border: "1px solid #ECE7FB" }}>
      <div className="flex items-center justify-between px-5 py-3 text-white" style={{ background: s.grad }}>
        <div className="flex items-center gap-3">
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>PO-{po.id}</span>
          <span className="text-xs opacity-90">{new Date(po.orderDate).toLocaleDateString()}</span>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full bg-white/25 ${pulsing ? "animate-pulse" : ""}`} style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, letterSpacing: "0.06em" }}>
          {s.label}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "16px", color: "#1A0E3E" }}>{supplier?.name || 'Unknown'}</div>
            {po.items?.map((it, i) => (
              <div key={i} className="text-sm mt-1" style={{ color: "#4B4470" }}>{it.quantity} × {it.productName || `Product ${it.productId}`} @ Rs {it.unitCost}</div>
            ))}
            <div className="text-sm mt-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: MUTE }}>Total: Rs {total.toLocaleString()}</div>
          </div>

          {!cancelled && (
            <div className="flex items-center gap-1">
              {STATUS_FLOW.map((step, i) => (
                <React.Fragment key={step}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: i <= flowIndex ? s.color : "#EDE9FA" }} />
                  {i < STATUS_FLOW.length - 1 && <div className="h-0.5 w-4" style={{ background: i < flowIndex ? s.color : "#EDE9FA" }} />}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {!cancelled && po.status !== "Received" && po.status !== "Approved" && (
            <button onClick={() => onAdvance(po.id)} className="text-xs px-4 py-2 rounded-full text-white shadow-sm flex items-center gap-1"
              style={{ background: GRADIENTS.sky, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>
              <CheckCircle2 size={13} /> Approve Order
            </button>
          )}
          {!cancelled && po.status === "Approved" && (
            <button onClick={() => onReceive(po.id)} className="text-xs px-4 py-2 rounded-full text-white shadow-sm flex items-center gap-1"
              style={{ background: GRADIENTS.teal, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>
              <Package size={13} /> Receive Items
            </button>
          )}
          {!cancelled && po.status !== "Received" && (
            <button onClick={() => onCancel(po.id)} className="text-xs px-4 py-2 rounded-full flex items-center gap-1"
              style={{ border: `1.5px solid ${CORAL}`, color: CORAL, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>
              <Ban size={13} /> Cancel
            </button>
          )}
          {cancelled && (
            <button onClick={() => onRestore(po.id)} className="text-xs px-4 py-2 rounded-full flex items-center gap-1"
              style={{ border: `1.5px solid ${MUTE}`, color: MUTE, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>
              <RotateCcw size={13} /> Restore
            </button>
          )}
        </div>
      </div>
    </div>
  );
};