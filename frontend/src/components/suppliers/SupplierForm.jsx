import { useState } from 'react';
import { supplierService } from '../../services/supplierService';

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
        } catch {
            setMessage('❌ Failed to create supplier');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Add Supplier</h3>

            {message && (
                <div className={`p-3 rounded-lg text-sm mb-4 ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <input className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contact Person *" value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} required />
                <input className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Email *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                <input className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Phone *" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                <input className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Address *" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
                <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50">
                    {loading ? 'Creating...' : 'Create Supplier'}
                </button>
            </form>
        </div>
    );
};

export default SupplierForm;