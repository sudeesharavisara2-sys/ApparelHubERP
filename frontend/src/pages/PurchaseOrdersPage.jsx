import { useState, useEffect } from 'react';
import { purchaseOrderService } from '../services/purchaseOrderService';
import { supplierService } from '../services/supplierService';
import PurchaseOrderForm from '../components/purchaseOrders/PurchaseOrderForm';
import ReorderSuggestions from '../components/purchaseOrders/ReorderSuggestions';
import PurchaseOrderList from '../components/purchaseOrders/PurchaseOrderList';

const PurchaseOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [ordersRes, suppliersRes] = await Promise.all([
          purchaseOrderService.getAll(),
          supplierService.getAll(),
        ]);

        if (!isMounted) return;

        setOrders(ordersRes);
        setSuppliers(suppliersRes);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleReceive = (po) => {
    console.log('Order received:', po);
    void (async () => {
      try {
        const [ordersRes, suppliersRes] = await Promise.all([
          purchaseOrderService.getAll(),
          supplierService.getAll(),
        ]);
        setOrders(ordersRes);
        setSuppliers(suppliersRes);
      } catch (err) {
        console.error('Failed to refresh data:', err);
      }
    })();
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Loading orders...</div>;
  }

  return (
    <div className="min-h-screen p-6" style={{
      background: 'radial-gradient(circle at top left, rgba(37, 99, 235, 0.16), transparent 34%), radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.15), transparent 34%), #f8fafc'
    }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/50">
          <div className="p-2.5 bg-blue-50 rounded-xl">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Purchase Orders</h1>
            <p className="text-sm text-gray-500">Manage your procurement orders</p>
          </div>
          <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">Procurement</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
              <PurchaseOrderForm onSuccess={() => window.location.reload()} />
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
              <ReorderSuggestions />
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
              <PurchaseOrderList 
                orders={orders} 
                setOrders={setOrders} 
                suppliers={suppliers} 
                onReceive={handleReceive} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrdersPage;