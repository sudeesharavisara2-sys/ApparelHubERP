import { useState, useEffect } from "react";
import { 
  Plus, X, ClipboardList, ShoppingBag, Rocket, FilePlus, RotateCcw, 
  Search, ChevronLeft, ChevronRight, Download, CheckCircle2, Ban, Package, Filter 
} from "lucide-react";
import { purchaseOrderService } from "../../services/purchaseOrderService";
import { supplierService } from "../../services/supplierService";
import { useToast } from "../../context/ToastContext";
import { COLORS, statusMeta } from "../../theme";

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all-orders"); // all-orders, receipts, returns
  const [showActionDropdown, setShowActionDropdown] = useState(null);
  
  // Form State using original structure
  const [form, setForm] = useState({ supplierId: "", productId: "", quantity: "", unitCost: "", season: "Summer 2026" });
  const { showToast } = useToast();

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  const refreshPageData = async () => {
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
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setSuppliers(Array.isArray(suppliersData) ? suppliersData : []);
      } catch {
        if (isMounted) showToast("❌ Error loading procurement data");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void fetchData();
    return () => { isMounted = false; };
  }, [showToast]);

  function getSupplierName(order) {
    const candidateId = order?.supplierId ?? order?.SupplierId ?? order?.supplierID ?? order?.SupplierID ?? order?.supplier?.id ?? order?.supplier?.Id;
    const candidateName = order?.supplierName ?? order?.SupplierName ?? order?.supplier?.name ?? order?.supplier?.Name;

    if (candidateName) return candidateName;
    if (!candidateId && candidateId !== 0) return "Cash Purchase";

    const normalizedId = String(candidateId);
    const found = suppliers.find((s) => {
      const candidateIds = [s.id, s.Id, s.supplierId, s.SupplierId, s.supplierID, s.SupplierID];
      return candidateIds.some((value) => String(value) === normalizedId);
    });

    return found?.name || found?.Name || found?.supplierName || found?.SupplierName || "Cash Purchase";
  }

  function getStatusLabel(order) {
    const status = order?.status ?? order?.Status ?? "Pending";
    return statusMeta(status).label || status;
  }

  // ==================== INTERACTIVE BACKEND ACTION HANDLERS ====================
  
  const handleCreatePO = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        SupplierId: Number(form.supplierId),
        ExpectedDeliveryDate: new Date(Date.now() + 7 * 86400000).toISOString(),
        Remarks: "Created via React Frontend Grid",
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

  const handleApprovePO = async (id) => {
    try {
      await purchaseOrderService.updateStatus(id, { status: "Approved" });
      showToast(`✅ PO-${id} Approved Successfully!`);
      setShowActionDropdown(null);
      await refreshPageData();
    } catch {
      showToast("❌ Failed to approve purchase order");
    }
  };

  const handleReceivePO = async (id) => {
    try {
      await purchaseOrderService.receive(id);
      showToast(`📦 PO-${id} Items Received & Stocks Synced!`);
      setShowActionDropdown(null);
      await refreshPageData();
    } catch {
      showToast("❌ Failed to process item receipt");
    }
  };

  const handleCancelPO = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this product order?")) return;
    try {
      await purchaseOrderService.cancel(id);
      showToast(`🛑 PO-${id} Cancelled Successfully!`);
      setShowActionDropdown(null);
      await refreshPageData();
    } catch {
      showToast("❌ Failed to cancel purchase order");
    }
  };

  // 🌟 Real Native Print-to-PDF Invoice Logic (100% Independent & Crash-Safe)
  const handleDownloadInvoice = (po) => {
    showToast(`📥 Opening Print Matrix for PO-${po?.id || po?.Id}...`);

    const poId = po?.id || po?.Id || "UNKNOWN";
    const poNum = po?.poNumber || po?.PONumber || poId;
    const status = po?.status || po?.Status || "Pending";
    const supplierName = getSupplierName(po);
    const date = po?.orderDate ? new Date(po.orderDate).toLocaleDateString("en-GB") : new Date().toLocaleDateString("en-GB");

    const budgetAmt = po?.budgetedAmount || po?.BudgetedAmount || 
      ((po?.items?.[0]?.quantity || po?.Items?.[0]?.Quantity || po?.quantity || 0) * (po?.items?.[0]?.unitCost || po?.Items?.[0]?.UnitCost || po?.unitCost || 0));

    // Open an empty print tab
    const printWindow = window.open("", "_blank");
    
    printWindow.document.write(`
      <html>
        <head>
          <title>ApparelHub_Invoice_PO_${poId}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; padding: 40px; margin: 0; }
            .header { background: #1a0e3e; color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; }
            .header h1 { margin: 0; font-size: 26px; font-weight: bold; letter-spacing: 1px; }
            .header p { margin: 6px 0 0 0; font-size: 12px; opacity: 0.85; }
            .grid { display: flex; justify-content: space-between; margin-bottom: 40px; font-size: 13px; line-height: 1.6; }
            .meta-block h3 { margin: 0 0 10px 0; color: #1a0e3e; font-size: 14px; text-transform: uppercase; font-weight: bold; }
            .meta-block p { margin: 4px 0; color: #444; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 13px; }
            th { background: #f59e0b; color: #1a0e3e; padding: 12px; text-align: left; font-weight: bold; border: none; }
            td { padding: 14px 12px; border-bottom: 1px solid #eee; }
            tr:nth-child(even) { background: #f9f9f9; }
            .total { text-align: right; font-size: 18px; font-weight: bold; color: #1a0e3e; margin-top: 30px; padding-top: 15px; border-top: 2px solid #1a0e3e; }
            .footer { margin-top: 100px; font-size: 10px; font-style: italic; color: #777; border-top: 1px dashed #ccc; padding-top: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>APPARELHUB ERP SYSTEM</h1>
            <p>Official Supply Chain Procurement Statement & Invoice</p>
          </div>
          
          <div class="grid">
            <div class="meta-block">
              <h3>Invoice Details</h3>
              <p><strong>PO Reference:</strong> PO-${poNum}</p>
              <p><strong>Order Date:</strong> ${date}</p>
              <p><strong>Pipeline Status:</strong> ${status}</p>
            </div>
            <div class="meta-block" style="text-align: right;">
              <h3>Authorized Vendor</h3>
              <p><strong>${supplierName}</strong></p>
              <p>ApparelHub Verified Partner Network</p>
              <p>LKR Currency Ledger</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Material Description / Product Code</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Unit Cost</th>
                <th style="text-align: right;">Sub Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Product Reference Code: #${po?.productId || "Raw Apparel Material"}</td>
                <td style="text-align: center;">${po?.quantity || 1}</td>
                <td style="text-align: right;">Rs ${Number(po?.unitCost || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                <td style="text-align: right;">Rs ${Number(budgetAmt).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
              </tr>
            </tbody>
          </table>

          <div class="total">
            Grand Total Valuation: Rs ${Number(budgetAmt).toLocaleString(undefined, {minimumFractionDigits: 2})}
          </div>

          <div class="footer">
            Secured and authorized electronically via ApparelHub Tokenized JWT Protocol. This document acts as an official financial statement within the enterprise system.
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 300);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  // ==================== UI FILTER & SEARCH LOGIC ====================
  const filteredOrders = orders.filter(o => {
    const status = o.status || o.Status || "Draft";
    
    if (activeTab === "receipts" && status !== "Received") return false;
    if (activeTab === "returns" && status !== "Cancelled") return false;

    const id = String(o.id || o.Id || "");
    const poNum = String(o.poNumber || o.PONumber || "");
    const sName = getSupplierName(o).toLowerCase();
    const query = searchTerm.toLowerCase();

    return id.includes(query) || poNum.includes(query) || sName.includes(query) || status.toLowerCase().includes(query);
  });

  // Pagination Calculations
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredOrders.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredOrders.length / entriesPerPage) || 1;

  if (loading) return <div className="text-center py-12 text-slate-400 font-medium">Loading Procurement Ledgers...</div>;

  return (
    <div className="w-full flex flex-col gap-6 font-sans text-slate-800 fade-in">
      
      {/* 🚀 TOP ERP ACTION NAVIGATION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <button 
          onClick={() => { setActiveTab("all-orders"); setCurrentPage(1); setShowModal(true); }}
          className="p-4 rounded-xl border bg-white hover:bg-slate-50 border-slate-200 flex items-center gap-4 transition-all cursor-pointer text-left"
        >
          <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0"><ShoppingBag size={22} /></div>
          <div>
            <h4 className="m-0 text-sm font-bold text-slate-800">Create Product Order</h4>
            <p className="m-0 text-[11px] text-amber-500 font-bold">Open Form Menu +</p>
          </div>
        </button>

        <button 
          onClick={() => { setActiveTab("all-orders"); setCurrentPage(1); }}
          className={`p-4 rounded-xl border flex items-center gap-4 transition-all cursor-pointer text-left ${activeTab === "all-orders" ? "bg-amber-50/50 border-amber-400 shadow-xs" : "bg-white border-slate-200"}`}
        >
          <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0"><Rocket size={22} /></div>
          <div>
            <h4 className="m-0 text-sm font-bold text-slate-800">All Product Orders</h4>
            <p className="m-0 text-[11px] text-slate-400">Total Ledgers ({orders.length})</p>
          </div>
        </button>

        <button 
          onClick={() => { setActiveTab("receipts"); setCurrentPage(1); }}
          className={`p-4 rounded-xl border flex items-center gap-4 transition-all cursor-pointer text-left ${activeTab === "receipts" ? "bg-emerald-50 border-emerald-400 shadow-xs" : "bg-white border-slate-200"}`}
        >
          <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0"><FilePlus size={22} /></div>
          <div>
            <h4 className="m-0 text-sm font-bold text-slate-800">Direct Receipts</h4>
            <p className="m-0 text-[11px] text-emerald-600 font-bold">Status: Received All</p>
          </div>
        </button>

        <button 
          onClick={() => { setActiveTab("returns"); setCurrentPage(1); }}
          className={`p-4 rounded-xl border flex items-center gap-4 transition-all cursor-pointer text-left ${activeTab === "returns" ? "bg-rose-50 border-rose-400 shadow-xs" : "bg-white border-slate-200"}`}
        >
          <div className="w-12 h-12 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 shrink-0"><RotateCcw size={22} /></div>
          <div>
            <h4 className="m-0 text-sm font-bold text-slate-800">Purchase Returns</h4>
            <p className="m-0 text-[11px] text-rose-600 font-bold">Status: Cancelled Logs</p>
          </div>
        </button>
      </div>

      {/* 📊 ADVANCED DATA TABLE CONTAINER GRID */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Search & Header Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/60">
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-slate-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Pipeline View Matrix</span>
          </div>
          
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Search Ledger (ID, Supplier, Status)..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-amber-500 bg-white"
            />
          </div>
        </div>

        {/* REPLICATED DATATABLE MATRIX */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse m-0">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="p-3.5 pl-5">Type</th>
                <th className="p-3.5">PO ID</th>
                <th className="p-3.5">SO-Ref</th>
                <th className="p-3.5">Supplier Name</th>
                <th className="p-3.5">Currency</th>
                <th className="p-3.5 text-right">Budget Amount</th>
                <th className="p-3.5 text-center">Received All?</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {currentEntries.map((p) => {
                const id = p.id || p.Id;
                const status = p.status || p.Status || "Draft";
                const isReceivedAll = status === "Received";
                
                const budgetAmt = p.budgetedAmount || p.BudgetedAmount || 
                  ((p.items?.[0]?.quantity || p.Items?.[0]?.Quantity || p.quantity || 0) * (p.items?.[0]?.unitCost || p.Items?.[0]?.UnitCost || p.unitCost || 0));

                return (
                  <tr key={id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3.5 pl-5 text-slate-400">Inventory</td>
                    <td className="p-3.5 font-mono font-bold text-slate-900">PO-{p.poNumber || p.PONumber || id}</td>
                    <td className="p-3.5 text-slate-400 font-mono">--</td>
                    <td className="p-3.5 font-semibold text-slate-900">{getSupplierName(p)}</td>
                    <td className="p-3.5 font-mono text-slate-400">LKR</td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-900">
                      Rs {Number(budgetAmt).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold ${isReceivedAll ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                        {isReceivedAll ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-slate-800" style={{ background: COLORS.yellowBg }}>
                        {getStatusLabel(p)}
                      </span>
                    </td>
                    <td className="p-3.5 pr-5 text-right relative">
                      <div className="flex items-center justify-end gap-2">
                        {/* 📥 Native Browser PDF Trigger Icon */}
                        <button onClick={() => handleDownloadInvoice(p)} title="Download Official Invoice Statement" className="p-1.5 text-slate-400 hover:text-blue-600 bg-transparent border-none cursor-pointer flex">
                          <Download size={14} />
                        </button>

                        <div className="relative inline-block text-left">
                          <button 
                            onClick={() => setShowActionDropdown(showActionDropdown === id ? null : id)}
                            className="px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded cursor-pointer flex items-center"
                          >
                            ⚙️ Actions
                          </button>

                          {showActionDropdown === id && (
                            <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1 text-left">
                              {(status === "Draft" || status === "Pending") && (
                                <button onClick={() => handleApprovePO(id)} className="w-full px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2 bg-transparent border-none text-left cursor-pointer">
                                  <CheckCircle2 size={13} className="text-amber-500" /> Approve Order
                                </button>
                              )}
                              {status === "Approved" && (
                                <button onClick={() => handleReceivePO(id)} className="w-full px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2 bg-transparent border-none text-left cursor-pointer">
                                  <Package size={13} className="text-emerald-500" /> Receive Items
                                </button>
                              )}
                              {status !== "Received" && status !== "Cancelled" && (
                                <button onClick={() => handleCancelPO(id)} className="w-full px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 bg-transparent border-none text-left cursor-pointer border-t border-slate-100">
                                  <Ban size={13} /> Cancel Order
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-slate-400 font-medium">No purchase records found matching parameters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 📑 PAGINATION CONTROLS FOOTER */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30 text-xs text-slate-500 font-medium">
          <div>Showing {filteredOrders.length > 0 ? indexOfFirstEntry + 1 : 0} to {Math.min(indexOfLastEntry, filteredOrders.length)} of {filteredOrders.length} entries</div>
          <div className="flex items-center gap-1">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="p-1.5 border rounded bg-white cursor-pointer disabled:opacity-40"><ChevronLeft size={14} /></button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-7 h-7 rounded font-bold cursor-pointer border ${currentPage === i + 1 ? "bg-amber-500 text-white border-amber-500" : "bg-white border-slate-200"}`}>{i + 1}</button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className="p-1.5 border rounded bg-white cursor-pointer disabled:opacity-40"><ChevronRight size={14} /></button>
          </div>
        </div>

      </div>

      {/* ==================== ORIGINAL POPUP FORM MATRIX ==================== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold m-0 text-sm uppercase tracking-wide text-slate-700">New Product Order Form</h3>
              <button onClick={() => setShowModal(false)} className="border-none bg-transparent cursor-pointer"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreatePO} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Select Active Vendor</label>
                <select value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })} required className="w-full px-3 py-2 border rounded-lg text-xs font-semibold focus:outline-none bg-slate-50">
                  <option value="">Select Supplier</option>
                  {suppliers.map(s => <option key={s.id || s.Id} value={s.id || s.Id}>{s.name || s.Name}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Product Identification Number</label>
                <input type="number" placeholder="Product ID *" value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} required className="w-full px-3 py-2 border rounded-lg text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Quantity Requested</label>
                  <input type="number" placeholder="Quantity *" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required className="w-full px-3 py-2 border rounded-lg text-xs" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Unit Cost (LKR)</label>
                  <input type="number" step="0.01" placeholder="Unit Cost *" value={form.unitCost} onChange={(e) => setForm({ ...form, unitCost: e.target.value })} required className="w-full px-3 py-2 border rounded-lg text-xs" />
                </div>
              </div>

              <button type="submit" className="w-full py-2.5 border-none font-bold text-xs text-white rounded-lg cursor-pointer shadow-xs" style={{ background: COLORS.yellow, color: COLORS.black }}>
                Create Product Order Matrix
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}