import PurchaseOrderList from '../components/purchaseOrders/PurchaseOrderList';
import PurchaseOrderForm from '../components/purchaseOrders/PurchaseOrderForm';
import ReorderSuggestions from '../components/purchaseOrders/ReorderSuggestions';

const PurchaseOrdersPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Purchase Orders</h1>
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Procurement</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <PurchaseOrderForm onSuccess={() => window.location.reload()} />
            <div className="mt-6">
              <ReorderSuggestions />
            </div>
          </div>
          <div className="lg:col-span-2">
            <PurchaseOrderList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrdersPage;