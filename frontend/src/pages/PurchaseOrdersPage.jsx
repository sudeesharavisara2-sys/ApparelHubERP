import PurchaseOrderList from '../components/purchaseOrders/PurchaseOrderList';
import PurchaseOrderForm from '../components/purchaseOrders/PurchaseOrderForm';
import ReorderSuggestions from '../components/purchaseOrders/ReorderSuggestions';

const PurchaseOrdersPage = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Purchase Orders</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <PurchaseOrderForm onSuccess={() => window.location.reload()} />
                    <div className="mt-4">
                        <ReorderSuggestions />
                    </div>
                </div>
                <div className="lg:col-span-2">
                    <PurchaseOrderList />
                </div>
            </div>
        </div>
    );
};

export default PurchaseOrdersPage;