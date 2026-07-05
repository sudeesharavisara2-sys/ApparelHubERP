import { useState } from 'react';
import { supplierService } from '../../services/supplierService';
import { UserPlus } from 'lucide-react';

const SupplierForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    productCategories: '',
    averageDeliveryDays: 0,
    minimumOrderValue: 0
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await supplierService.create(form);
      setForm({ 
        name: '', 
        contactPerson: '', 
        email: '', 
        phone: '', 
        address: '',
        productCategories: '',
        averageDeliveryDays: 0,
        minimumOrderValue: 0
      });
      setMessage('✅ Supplier created successfully!');
      if (onSuccess) setTimeout(onSuccess, 500);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to create supplier');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-blue-600" />
          <h3 className="card-title">Add Supplier</h3>
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm mb-4 ${message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-3">
          <input
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Supplier Name *"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Contact Person *"
            value={form.contactPerson}
            onChange={e => setForm({ ...form, contactPerson: e.target.value })}
            required
          />
          <input
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Email *"
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Phone *"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            required
          />
          <input
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Address *"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            required
          />
          <input
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Product Categories (e.g. Fabrics, Cotton)"
            value={form.productCategories}
            onChange={e => setForm({ ...form, productCategories: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Avg Delivery Days"
              value={form.averageDeliveryDays}
              onChange={e => setForm({ ...form, averageDeliveryDays: parseInt(e.target.value) || 0 })}
            />
            <input
              type="number"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Min Order Value"
              value={form.minimumOrderValue}
              onChange={e => setForm({ ...form, minimumOrderValue: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary btn-full mt-4">
          {loading ? 'Creating...' : 'Create Supplier'}
        </button>
      </form>
    </div>
  );
};

export default SupplierForm;