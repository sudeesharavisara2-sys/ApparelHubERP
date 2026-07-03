import { useState, useEffect } from 'react';
import { purchaseOrderService } from '../../services/purchaseOrderService';

const statusMap = {
    0: 'Draft', 1: 'Pending', 2: 'Approved', 3: 'Shipped', 4: 'Received', 5: 'Cancelled'
};

const PurchaseOrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadOrders = async () => {
        try {
            const data = await purchaseOrderService.getAll();
            setOrders(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadOrders(); }, []);

    const handleStatusChange = async (id, status) => {
        await purchaseOrderService.updateStatus(id, parseInt(status));
        loadOrders();
    };

    const handleReceive = async (id) => {
        if (confirm('Receive this order? Stock will be updated.')) {
            await purchaseOrderService.receiveOrder(id);
            loadOrders();
            alert('✅ Order received!');
        }
    };

    if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>;

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-700">Purchase Orders</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">PO #</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Supplier</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map((o) => (
                            <tr key={o.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-indigo-600">{o.ponumber}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{o.supplierName}</td>
                                <td className="px-6 py-4 text-sm font-semibold">${o.totalAmount?.toFixed(2) || '0.00'}</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                                        {statusMap[o.status] || o.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                        {o.status < 3 && (
                                            <select
                                                onChange={(e) => handleStatusChange(o.id, e.target.value)}
                                                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                value={o.status}
                                            >
                                                {Object.entries(statusMap).map(([key, val]) => (
                                                    <option key={key} value={key}>{val}</option>
                                                ))}
                                            </select>
                                        )}
                                        {o.status === 3 && (
                                            <button
                                                onClick={() => handleReceive(o.id)}
                                                className="px-4 py-1.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600"
                                            >
                                                Receive
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">No orders found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PurchaseOrderList;