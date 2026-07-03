import SupplierList from '../components/suppliers/SupplierList';
import SupplierForm from '../components/suppliers/SupplierForm';

const SuppliersPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Suppliers</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <SupplierForm onSuccess={() => window.location.reload()} />
                    </div>
                    <div className="lg:col-span-2">
                        <SupplierList />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuppliersPage;