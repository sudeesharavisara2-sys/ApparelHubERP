import { useState, useEffect, useCallback } from 'react'; // ✅ Added useCallback
import { purchaseOrderService } from '../../services/purchaseOrderService';
import { Search, RefreshCw, Trash2, RotateCcw, XCircle, PackageCheck } from 'lucide-react';

const statusMap = {
  0: { label: 'Draft', className: 'badge-draft' },
  1: { label: 'Pending', className: 'badge-pending' },
  2: { label: 'Approved', className: 'badge-approved' },
  3: { label: 'Shipped', className: 'badge-shipped' },
  4: { label: 'Received', className: 'badge-received' },
  5: { label: 'Cancelled', className: 'badge-cancelled' }
};

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: '0', label: 'Draft' },
  { value: '1', label: 'Pending' },
  { value: '2', label: 'Approved' },
  { value: '3', label: 'Shipped' },
  { value: '4', label: 'Received' },
  { value: '5', label: 'Cancelled' }
];

const PurchaseOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      if (showDeleted) {
        const data = await purchaseOrderService.getDeleted();
        setOrders(data);
        setTotalCount(data.length);
        setTotalPages(1);
      } else {
        const params = {
          page,
          pageSize,
          status: statusFilter ? parseInt(statusFilter) : undefined,
        };
        if (search) params.supplierId = parseInt(search) || undefined;
        const result = await purchaseOrderService.getFiltered(params);
        setOrders(result.items);
        setTotalCount(result.totalCount);
        setTotalPages(result.totalPages);
      }
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter, showDeleted]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusChange = async (id, status) => {
    await purchaseOrderService.updateStatus(id, parseInt(status));
    loadOrders();
  };

  const handleReceive = async (id) => {
    if (confirm('Receive this order? Stock will be updated.')) {
      await purchaseOrderService.receiveOrder(id);
      loadOrders();
      alert('✅ Order received! Stock updated.');
    }
  };

  const handleSoftDelete = async (id) => {
    if (!confirm('Soft delete this order?')) return;
    await purchaseOrderService.softDelete(id);
    loadOrders();
  };

  const handleRestore = async (id) => {
    await purchaseOrderService.restore(id);
    loadOrders();
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this order?')) return;
    await purchaseOrderService.cancel(id);
    loadOrders();
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length || !confirm(`Delete ${selectedIds.length} orders?`)) return;
    await purchaseOrderService.bulkDelete(selectedIds);
    setSelectedIds([]);
    loadOrders();
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (loading) return <div className="text-center py-8 text-gray-400">Loading...</div>;

  return (
    <div className="card fade-in">
      <div className="card-header">
        <h3 className="card-title">Purchase Orders</h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">{totalCount} orders</span>
          <button
            onClick={() => setShowDeleted(!showDeleted)}
            className={`btn btn-sm ${showDeleted ? 'btn-warning' : 'btn-outline'}`}
          >
            {showDeleted ? '🗑️ Deleted' : 'Show Deleted'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Supplier ID..."
              value={search}
              onChange={handleSearch}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button onClick={loadOrders} className="btn btn-secondary btn-sm">
          <RefreshCw className="w-4 h-4" />
        </button>
        {selectedIds.length > 0 && (
          <button onClick={handleBulkDelete} className="btn btn-danger btn-sm">
            <Trash2 className="w-4 h-4" />
            Delete ({selectedIds.length})
          </button>
        )}
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th className="w-8">
                <input
                  type="checkbox"
                  checked={selectedIds.length === orders.length && orders.length > 0}
                  onChange={() => {
                    if (selectedIds.length === orders.length) setSelectedIds([]);
                    else setSelectedIds(orders.map(o => o.id));
                  }}
                />
              </th>
              <th>PO #</th>
              <th>Supplier</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(o.id)}
                    onChange={() => handleToggleSelect(o.id)}
                  />
                </td>
                <td className="font-medium text-blue-600">{o.ponumber}</td>
                <td>{o.supplierName}</td>
                <td className="font-semibold">${o.totalAmount?.toFixed(2)}</td>
                <td>
                  <span className={`badge ${statusMap[o.status]?.className || 'badge-draft'}`}>
                    {statusMap[o.status]?.label || o.status}
                  </span>
                  {o.isDeleted && <span className="badge badge-danger ml-1">Deleted</span>}
                </td>
                <td>
                  <div className="flex items-center gap-1 flex-wrap">
                    {!o.isDeleted ? (
                      <>
                        {o.status < 3 && (
                          <select
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            className="px-2 py-1 border border-gray-200 rounded text-sm"
                            value={o.status}
                          >
                            {Object.entries(statusMap).map(([key, val]) => (
                              <option key={key} value={key}>{val.label}</option>
                            ))}
                          </select>
                        )}
                        {o.status === 3 && (
                          <button onClick={() => handleReceive(o.id)} className="btn btn-success btn-sm">
                            <PackageCheck className="w-4 h-4" />
                            Receive
                          </button>
                        )}
                        {o.status < 4 && o.status !== 5 && (
                          <button onClick={() => handleCancel(o.id)} className="btn btn-warning btn-sm">
                            <XCircle className="w-4 h-4" />
                            Cancel
                          </button>
                        )}
                        <button onClick={() => handleSoftDelete(o.id)} className="btn btn-danger btn-sm">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button onClick={() => handleRestore(o.id)} className="btn btn-success btn-sm">
                        <RotateCcw className="w-4 h-4" />
                        Restore
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan="6" className="text-center py-8 text-gray-400">No orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!showDeleted && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">Page {page} of {totalPages} ({totalCount} items)</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn btn-secondary btn-sm disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn btn-secondary btn-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrderList;