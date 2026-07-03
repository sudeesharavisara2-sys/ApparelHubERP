import { Package } from 'lucide-react';
import SupplierList from '../components/suppliers/SupplierList';
import SupplierForm from '../components/suppliers/SupplierForm';

const SuppliersPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-6 fade-in">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Suppliers</h1>
                    <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Management</span>
                </div>

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