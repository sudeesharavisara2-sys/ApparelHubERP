import { useState, useEffect } from 'react';
import { supplierService } from '../../services/supplierService';
import { Search, CheckCircle, XCircle } from 'lucide-react';
import { COLORS } from '../../theme';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const data = await supplierService.getAll();
      setSuppliers(Array.isArray(data) ? data : []);
    } catch {
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeSuppliers = async () => {
      await loadSuppliers();
    };

    initializeSuppliers();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      await supplierService.toggleStatus(id);
      loadSuppliers();
    } catch {
      alert('Failed to toggle status');
    }
  };

  const filtered = suppliers.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="text-center py-8 text-gray-400">Loading suppliers...</div>;

  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm fade-in" style={{ borderColor: COLORS.border }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold m-0">Registered Suppliers</h3>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 py-2 border rounded-lg w-full text-sm" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b bg-slate-50" style={{ borderColor: COLORS.border }}>
              <th className="p-3">Name</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: COLORS.border }}>
            {filtered.map((s) => (
              <tr key={s.id || s.Id}>
                <td className="p-3 font-medium text-gray-900">{s.name || s.Name}</td>
                <td className="p-3">{s.contactPerson || s.ContactPerson}</td>
                <td className="p-3">{s.email || s.Email}</td>
                <td className="p-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${s.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {s.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {s.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-3">
                  <button onClick={() => handleToggleStatus(s.id || s.Id)} className="btn sm primary text-xs">Toggle Status</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierList;