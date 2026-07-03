import { useState, useEffect } from 'react';
import { purchaseOrderService } from '../../services/purchaseOrderService';
import { ShoppingBag, DollarSign, TrendingUp, PieChart } from 'lucide-react';

const statusLabels = {
  0: 'Draft',
  1: 'Pending',
  2: 'Approved',
  3: 'Shipped',
  4: 'Received',
  5: 'Cancelled'
};

const OrderStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    purchaseOrderService.getStats()
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white rounded-xl shadow p-4 border border-gray-100 animate-pulse h-24"></div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4 border border-gray-100 text-center text-gray-400 col-span-4">
          No data available
        </div>
      </div>
    );
  }

  const statusCounts = stats.statusCounts || {};
  const statusSummary = Object.entries(statusCounts)
    .map(([key, count]) => ({ label: statusLabels[key] || key, count }))
    .filter(item => item.count > 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl shadow p-4 border border-gray-100 hover:shadow-md transition">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <ShoppingBag className="w-5 h-5 text-blue-500" />
          <span>Total Orders</span>
        </div>
        <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalOrders || 0}</p>
      </div>
      <div className="bg-white rounded-xl shadow p-4 border border-gray-100 hover:shadow-md transition">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <DollarSign className="w-5 h-5 text-green-500" />
          <span>Total Value</span>
        </div>
        <p className="text-2xl font-bold text-gray-800 mt-1">${(stats.totalAmount || 0).toFixed(2)}</p>
      </div>
      <div className="bg-white rounded-xl shadow p-4 border border-gray-100 hover:shadow-md transition">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <TrendingUp className="w-5 h-5 text-purple-500" />
          <span>Average Order</span>
        </div>
        <p className="text-2xl font-bold text-gray-800 mt-1">${(stats.averageOrderValue || 0).toFixed(2)}</p>
      </div>
      <div className="bg-white rounded-xl shadow p-4 border border-gray-100 hover:shadow-md transition">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <PieChart className="w-5 h-5 text-orange-500" />
          <span>Statuses</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {statusSummary.length > 0 ? (
            statusSummary.map(({ label, count }) => (
              <span key={label} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                {label}: {count}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400">No data</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderStats;