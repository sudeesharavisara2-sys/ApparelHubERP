import { useState, useEffect } from 'react';
import { purchaseOrderService } from '../../services/purchaseOrderService';
import { ShoppingBag, DollarSign, PieChart, TrendingUp } from 'lucide-react';

const OrderStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    purchaseOrderService.getStats().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="grid grid-cols-2 md:grid-cols-4 gap-4"><div className="h-20 bg-gray-100 rounded-lg animate-pulse"></div><div className="h-20 bg-gray-100 rounded-lg animate-pulse"></div><div className="h-20 bg-gray-100 rounded-lg animate-pulse"></div><div className="h-20 bg-gray-100 rounded-lg animate-pulse"></div></div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <ShoppingBag className="w-5 h-5 text-blue-500" />
          <span>Total Orders</span>
        </div>
        <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalOrders}</p>
      </div>
      <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <DollarSign className="w-5 h-5 text-green-500" />
          <span>Total Value</span>
        </div>
        <p className="text-2xl font-bold text-gray-800 mt-1">${stats.totalAmount.toFixed(2)}</p>
      </div>
      <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <TrendingUp className="w-5 h-5 text-purple-500" />
          <span>Average Order</span>
        </div>
        <p className="text-2xl font-bold text-gray-800 mt-1">${stats.averageOrderValue.toFixed(2)}</p>
      </div>
      <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <PieChart className="w-5 h-5 text-orange-500" />
          <span>Statuses</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {Object.entries(stats.statusCounts).map(([key, count]) => (
            <span key={key} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
              {statusMap[key]?.label || key}: {count}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const statusMap = {
  0: { label: 'Draft' },
  1: { label: 'Pending' },
  2: { label: 'Approved' },
  3: { label: 'Shipped' },
  4: { label: 'Received' },
  5: { label: 'Cancelled' }
};

export default OrderStats;