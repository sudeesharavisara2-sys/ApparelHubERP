import { useState, useEffect } from 'react';
import { purchaseOrderService } from '../../services/purchaseOrderService';
import { supplierService } from '../../services/supplierService';
import { Plus, X, Calendar, User, FileText, Package } from 'lucide-react';

const PurchaseOrderForm = ({ onSuccess }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    supplierId: '',
    expectedDeliveryDate: '',
    remarks: '',
    items: [{ productId: '', quantity: '', unitCost: '' }]
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    supplierService.getAll().then(setSuppliers).catch(() => {});
  }, []);

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { productId: '', quantity: '', unitCost: '' }] });
  };

  const removeItem = (idx) => {
    if (form.items.length === 1) return;
    setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });
  };

  const updateItem = (idx, field, value) => {
    const items = [...form.items];
    items[idx][field] = value;
    setForm({ ...form, items });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const data = {
        supplierId: parseInt(form.supplierId),
        expectedDeliveryDate: form.expectedDeliveryDate || null,
        remarks: form.remarks,
        items: form.items.map(item => ({
          productId: parseInt(item.productId),
          quantity: parseInt(item.quantity),
          unitCost: parseFloat(item.unitCost)
        }))
      };
      await purchaseOrderService.create(data);
      setForm({ supplierId: '', expectedDeliveryDate: '', remarks: '', items: [{ productId: '', quantity: '', unitCost: '' }] });
      setMessage('✅ Purchase Order created successfully!');
      if (onSuccess) setTimeout(onSuccess, 500);
    } catch (err) {
      console.error('Create purchase order error:', err);
      setMessage('❌ Failed to create purchase order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-indigo-600" />
          <h3 className="card-title">Create Purchase Order</h3>
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm mb-4 ${message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-600">
              <User className="w-4 h-4" />
              Supplier *
            </label>
            <select
              value={form.supplierId}
              onChange={e => setForm({ ...form, supplierId: e.target.value })}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select Supplier</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-600">
              <Calendar className="w-4 h-4" />
              Expected Delivery
            </label>
            <input
              type="date"
              value={form.expectedDeliveryDate}
              onChange={e => setForm({ ...form, expectedDeliveryDate: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-600">
              <FileText className="w-4 h-4" />
              Remarks
            </label>
            <input
              type="text"
              placeholder="Add remarks (optional)"
              value={form.remarks}
              onChange={e => setForm({ ...form, remarks: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-600">Order Items</label>
              <span className="text-xs text-gray-400">{form.items.length} items</span>
            </div>
            {form.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input
                  type="number"
                  placeholder="Product ID"
                  value={item.productId}
                  onChange={e => updateItem(idx, 'productId', e.target.value)}
                  required
                  className="w-1/3 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={e => updateItem(idx, 'quantity', e.target.value)}
                  required
                  className="w-1/3 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Cost"
                  value={item.unitCost}
                  onChange={e => updateItem(idx, 'unitCost', e.target.value)}
                  required
                  className="w-1/3 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {form.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition mt-1"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary btn-full mt-6"
        >
          {loading ? 'Creating...' : 'Create Purchase Order'}
        </button>
      </form>
    </div>
  );
};

export default PurchaseOrderForm;