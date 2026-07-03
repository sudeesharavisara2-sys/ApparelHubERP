import { useState } from 'react';
import { supplierService } from '../../services/supplierService';
import { UserPlus } from 'lucide-react';

const SupplierForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await supplierService.create(form);
      setForm({ name: '', contactPerson: '', email: '', phone: '', address: '' });
      setMessage('✅ Supplier created successfully!');
      if (onSuccess) setTimeout(onSuccess, 500);
    } catch (err) {
      // log error to avoid unused variable lint error
      // and help with debugging
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
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary btn-full mt-4">
          {loading ? 'Creating...' : 'Create Supplier'}
        </button>
      </form>
    </div>
  );
};

export default SupplierForm;