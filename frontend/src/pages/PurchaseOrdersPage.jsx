import { ShoppingCart } from 'lucide-react';
import PurchaseOrderList from '../components/purchaseOrders/PurchaseOrderList';
import PurchaseOrderForm from '../components/purchaseOrders/PurchaseOrderForm';
import ReorderSuggestions from '../components/purchaseOrders/ReorderSuggestions';
import OrderStats from '../components/purchaseOrders/OrderStats';

const PurchaseOrdersPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-6 fade-in">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <ShoppingCart className="w-6 h-6 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Purchase Orders</h1>
                    <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Procurement</span>
                </div>

                {/* ✅ NEW: Statistics Dashboard */}
                <div className="mb-6">
                    <OrderStats />
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