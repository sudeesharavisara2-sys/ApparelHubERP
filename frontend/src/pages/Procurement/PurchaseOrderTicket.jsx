import React from 'react';
import { CheckCircle2, Package, Ban } from 'lucide-react';
import { statusMeta, STATUS_FLOW, COLORS } from '../../theme';

const PurchaseOrderTicket = ({ po, supplier, onAdvance, onCancel, onReceive }) => {
  const currentStatus = po.status || po.Status || "Draft";
  const s = statusMeta(currentStatus);
  const items = po.items || po.Items || [];
  const total = items.reduce((sum, it) => sum + ((it.quantity || it.quantityOrdered || it.QuantityOrdered || 0) * (it.unitCost || it.UnitCost || 0)), 0);
  const flowIndex = STATUS_FLOW.indexOf(currentStatus);
  const cancelled = currentStatus === "Cancelled";

  return (
    <div className="rounded-xl overflow-hidden border shadow-sm bg-white" style={{ borderColor: COLORS.border }}>
      <div className="flex items-center justify-between px-5 py-3 text-white" style={{ background: COLORS.dark }}>
        <div className="flex items-center gap-3 font-mono text-sm">
          <span>PO-{po.id || po.Id}</span>
          <span className="opacity-60 text-xs">{new Date(po.orderDate || po.OrderDate).toLocaleDateString()}</span>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full text-slate-900" style={{ background: COLORS.yellow }}>
          {s.label}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="font-bold text-base" style={{ color: COLORS.black }}>{supplier?.name || supplier?.Name || 'Unknown Vendor'}</div>
            {items.map((it, i) => (
              <div key={i} className="text-sm text-slate-600 mt-1">
                {it.quantity || it.quantityOrdered || it.QuantityOrdered} × {it.productName || it.ProductName || `Product ID: ${it.productId || it.ProductId}`} @ Rs {it.unitCost || it.UnitCost}
              </div>
            ))}
            <div className="text-sm font-semibold mt-2 font-mono" style={{ color: COLORS.dark }}>Total: Rs {total.toLocaleString()}</div>
          </div>

          {!cancelled && (
            <div className="flex items-center gap-1">
              {STATUS_FLOW.map((step, i) => (
                <React.Fragment key={step}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: i <= flowIndex ? COLORS.success : "#EDE9FA" }} />
                  {i < STATUS_FLOW.length - 1 && <div className="h-0.5 w-4" style={{ background: i < flowIndex ? COLORS.success : "#EDE9FA" }} />}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {!cancelled && currentStatus !== "Received" && currentStatus !== "Approved" && (
            <button onClick={() => onAdvance(po.id || po.Id)} className="btn sm text-xs font-semibold text-slate-900 bg-yellow-400 border-none cursor-pointer" style={{ background: COLORS.yellow }}>
              <CheckCircle2 size={13} /> Approve Order
            </button>
          )}
          {!cancelled && currentStatus === "Approved" && (
            <button onClick={() => onReceive(po.id || po.Id)} className="btn sm success text-xs font-semibold cursor-pointer">
              <Package size={13} /> Receive Items
            </button>
          )}
          {!cancelled && currentStatus !== "Received" && (
            <button onClick={() => onCancel(po.id || po.Id)} className="btn sm text-xs font-semibold border-none cursor-pointer bg-red-100 text-red-600 hover:bg-red-200">
              <Ban size={13} /> Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderTicket;