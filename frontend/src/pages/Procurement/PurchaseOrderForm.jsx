import { useState, useEffect } from 'react';
import { purchaseOrderService } from '../../services/purchaseOrderService';
import { supplierService } from '../../services/supplierService';
import { Plus, X, Calendar, User, Package } from 'lucide-react';
import { COLORS } from '../../theme';

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
        SupplierId: parseInt(form.supplierId),
        ExpectedDeliveryDate: form.expectedDeliveryDate ? new Date(form.expectedDeliveryDate).toISOString() : null,
        Remarks: "Created via React Frontend",
        BudgetedAmount: form.items.reduce((sum, item) => sum + (parseInt(item.quantity) * parseFloat(item.unitCost)), 0),
        Season: "Summer 2026",
        Items: form.items.map(item => ({
          ProductId: parseInt(item.productId),
          Quantity: parseInt(item.quantity),
          UnitCost: parseFloat(item.unitCost)
        }))
      };
      await purchaseOrderService.create(data);
      setForm({ supplierId: '', expectedDeliveryDate: '', remarks: '', items: [{ productId: '', quantity: '', unitCost: '' }] });
      setMessage('✅ Product Order created successfully!');
      if (onSuccess) setTimeout(onSuccess, 500);
    } catch {
      setMessage('❌ Failed to create product order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border shadow-sm fade-in" style={{ borderColor: COLORS.border }}>
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5" style={{ color: COLORS.yellow }} />
        <h3 className="text-lg font-semibold m-0" style={{ color: COLORS.black }}>Create Product Order</h3>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm mb-4 ${message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="flex items-center gap-1 text-sm font-medium mb-1.5" style={{ color: COLORS.slateText }}>
            <User className="w-4 h-4" /> Supplier *
          </label>
          <select value={form.supplierId} onChange={e => setForm({ ...form, supplierId: e.target.value })} required>
            <option value="">Select Supplier</option>
            {suppliers.map(s => <option key={s.id || s.Id} value={s.id || s.Id}>{s.name || s.Name}</option>)}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-1 text-sm font-medium mb-1.5" style={{ color: COLORS.slateText }}>
            <Calendar className="w-4 h-4" /> Expected Delivery
          </label>
          <input type="date" value={form.expectedDeliveryDate} onChange={e => setForm({ ...form, expectedDeliveryDate: e.target.value })} />
        </div>

        <div className="border-t border-gray-100 pt-4">
          <label className="text-sm font-medium block mb-2" style={{ color: COLORS.black }}>Order Items ({form.items.length})</label>
          {form.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <input type="number" placeholder="Product ID" value={item.productId} onChange={e => updateItem(idx, 'productId', e.target.value)} required />
              <input type="number" placeholder="Qty" value={item.quantity} onChange={e => updateItem(idx, 'quantity', e.target.value)} required />
              <input type="number" step="0.01" placeholder="Cost" value={item.unitCost} onChange={e => updateItem(idx, 'unitCost', e.target.value)} required />
              {form.items.length > 1 && (
                <button type="button" onClick={() => removeItem(idx)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 border-none cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addItem} className="flex items-center gap-1 text-sm font-medium border-none bg-none cursor-pointer mt-2" style={{ color: COLORS.info }}>
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>

        <button type="submit" disabled={loading} className="btn primary full mt-4">
          {loading ? 'Creating...' : 'Create Product Order'}
        </button>
      </form>
    </div>
  );
};

export default PurchaseOrderForm;