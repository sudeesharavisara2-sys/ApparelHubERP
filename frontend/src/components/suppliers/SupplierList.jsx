import { useState, useEffect, useCallback } from 'react';
import { supplierService } from '../../services/supplierService';
import { Search, RefreshCw, Trash2, RotateCcw, CheckCircle, XCircle } from 'lucide-react';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const loadSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (showDeleted) {
        const data = await supplierService.getDeleted();
        setSuppliers(data);
        setTotalCount(data.length);
        setTotalPages(1);
      } else {
        const result = await supplierService.getFiltered({
          page,
          pageSize,
          name: search || undefined,
        });
        setSuppliers(result.items || []);
        setTotalCount(result.totalCount || 0);
        setTotalPages(result.totalPages || 1);
      }
    } catch (err) {
      console.error('Error loading suppliers:', err);
      setError(err.message || 'Failed to load suppliers');
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, showDeleted]);

  useEffect(() => {
    const t = setTimeout(() => {
      loadSuppliers();
    }, 0);
    return () => clearTimeout(t);
  }, [loadSuppliers]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setPage(1);

    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => {
      loadSuppliers();
    }, 500);
    setSearchTimeout(timeout);
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === suppliers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(suppliers.map(s => s.id));
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await supplierService.toggleStatus(id);
      loadSuppliers();
    } catch {
      alert('Failed to toggle status');
    }
  };

  const handleSoftDelete = async (id) => {
    if (!confirm('Delete this supplier?')) return;
    try {
      await supplierService.softDelete(id);
      loadSuppliers();
    } catch {
      alert('Failed to delete supplier');
    }
  };

  const handleRestore = async (id) => {
    try {
      await supplierService.restore(id);
      loadSuppliers();
    } catch {
      alert('Failed to restore supplier');
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length || !confirm(`Delete ${selectedIds.length} suppliers?`)) return;
    try {
      await supplierService.bulkDelete(selectedIds);
      setSelectedIds([]);
      loadSuppliers();
    } catch {
      alert('Failed to delete suppliers');
    }
  };

  const handleRefresh = () => {
    loadSuppliers();
  };

  if (loading) {
    return (
      <div className="card fade-in">
        <div className="text-center py-8 text-gray-400">Loading suppliers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card fade-in">
        <div className="text-center py-8 text-red-500">
          <p>Error: {error}</p>
          <button onClick={handleRefresh} className="mt-2 btn btn-primary btn-sm">
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card fade-in">
      <div className="card-header">
        <h3 className="card-title">Supplier List</h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">{totalCount} suppliers</span>
          <button
            onClick={() => {
              setShowDeleted(!showDeleted);
              setPage(1);
            }}
            className={`btn btn-sm ${showDeleted ? 'btn-warning' : 'btn-outline'}`}
          >
            {showDeleted ? '🗑️ Deleted' : 'Show Deleted'}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search suppliers by name..."
              value={search}
              onChange={handleSearchChange}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button onClick={handleRefresh} className="btn btn-secondary btn-sm" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        {selectedIds.length > 0 && (
          <button onClick={handleBulkDelete} className="btn btn-danger btn-sm">
            <Trash2 className="w-4 h-4" />
            Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th className="w-8">
                <input
                  type="checkbox"
                  checked={selectedIds.length === suppliers.length && suppliers.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Name</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(s.id)}
                    onChange={() => handleToggleSelect(s.id)}
                  />
                </td>
                <td className="font-medium text-gray-800">{s.name}</td>
                <td>{s.contactPerson}</td>
                <td>{s.email}</td>
                <td>
                  <span className={`badge ${s.isActive ? 'badge-active' : 'badge-inactive'}`}>
                    {s.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {s.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {s.isDeleted && <span className="badge badge-danger ml-1">Deleted</span>}
                </td>
                <td>
                  <div className="flex items-center gap-1 flex-wrap">
                    {!s.isDeleted ? (
                      <>
                        <button
                          onClick={() => handleToggleStatus(s.id)}
                          className={`btn btn-sm ${s.isActive ? 'btn-warning' : 'btn-success'}`}
                        >
                          <RefreshCw className="w-3 h-3" />
                          {s.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleSoftDelete(s.id)}
                          className="btn btn-sm btn-danger"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleRestore(s.id)}
                        className="btn btn-sm btn-success"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Restore
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {suppliers.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-400">
                  {search ? 'No suppliers match your search' : 'No suppliers found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!showDeleted && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages} ({totalCount} items)
          </span>
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

export default SupplierList;