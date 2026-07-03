import { useState, useEffect } from 'react';
import { purchaseOrderService } from '../../services/purchaseOrderService';
import { supplierService } from '../../services/supplierService';

const PurchaseOrderForm = ({ onSuccess }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    supplierId: '',
    expectedDeliveryDate: '',
    remarks: '',
    items: [{ productId: '', quantity: '', unitCost: '' }]
  });

  useEffect(() => {
    supplierService.getAll().then(setSuppliers);
  }, []);

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { productId: '', quantity: '', unitCost: '' }] });
  };

  const removeItem = (i) => {
    setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });
  };

  const updateItem = (i, field, value) => {
    const items = [...form.items];
    items[i][field] = value;
    setForm({ ...form, items });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    if (onSuccess) onSuccess();
    alert('Purchase Order created successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Create Purchase Order</h3>
      <select className="w-full p-2 border mb-2" value={form.supplierId} onChange={e => setForm({ ...form, supplierId: e.target.value })} required>
        <option value="">Select Supplier</option>
        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
      <input className="w-full p-2 border mb-2" type="date" value={form.expectedDeliveryDate} onChange={e => setForm({ ...form, expectedDeliveryDate: e.target.value })} />
      <input className="w-full p-2 border mb-2" placeholder="Remarks" value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} />
      <h4 className="font-semibold mt-2">Order Items</h4>
      {form.items.map((item, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input className="w-1/3 p-1 border" placeholder="Product ID" type="number" value={item.productId} onChange={e => updateItem(i, 'productId', e.target.value)} required />
          <input className="w-1/3 p-1 border" placeholder="Qty" type="number" value={item.quantity} onChange={e => updateItem(i, 'quantity', e.target.value)} required />
          <input className="w-1/3 p-1 border" placeholder="Unit Cost" type="number" step="0.01" value={item.unitCost} onChange={e => updateItem(i, 'unitCost', e.target.value)} required />
          {form.items.length > 1 && (
            <button type="button" onClick={() => removeItem(i)} className="bg-red-500 text-white px-2 rounded">X</button>
          )}
        </div>
      ))}
      <button type="button" onClick={addItem} className="bg-green-500 text-white px-3 py-1 rounded mb-2">+ Add Item</button>
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Create PO</button>
    </form>
  );
};

export default PurchaseOrderForm;