import { useState, useEffect } from 'react';
import { supplierService } from '../../services/supplierService';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSuppliers = async () => {
    try {
      const data = await supplierService.getAll();
      setSuppliers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSuppliers(); }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <table className="min-w-full bg-white rounded-lg shadow">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-left">Name</th>
          <th className="px-4 py-2 text-left">Contact</th>
          <th className="px-4 py-2 text-left">Email</th>
          <th className="px-4 py-2 text-left">Status</th>
          <th className="px-4 py-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {suppliers.map((s) => (
          <tr key={s.id} className="border-b">
            <td className="px-4 py-2">{s.name}</td>
            <td className="px-4 py-2">{s.contactPerson}</td>
            <td className="px-4 py-2">{s.email}</td>
            <td className="px-4 py-2">
              <span className={`px-2 py-1 rounded ${s.isActive ? 'bg-green-200' : 'bg-red-200'}`}>
                {s.isActive ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td className="px-4 py-2">
              <button
                onClick={async () => {
                  await supplierService.toggleStatus(s.id);
                  loadSuppliers();
                }}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Toggle
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SupplierList;