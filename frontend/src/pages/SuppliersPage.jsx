import { Package } from 'lucide-react';
import SupplierList from '../components/suppliers/SupplierList';
import SupplierForm from '../components/suppliers/SupplierForm';

const SuppliersPage = () => {
    return (
        <div className="min-h-screen p-6" style={{
            background: 'radial-gradient(circle at top left, rgba(37, 99, 235, 0.16), transparent 34%), radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.15), transparent 34%), #f8fafc'
        }}>
            <div className="max-w-7xl mx-auto">
                {/* Header – glass card */}
                <div className="flex items-center gap-3 mb-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/50">
                    <div className="p-2.5 bg-blue-50 rounded-xl">
                        <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Suppliers</h1>
                        <p className="text-sm text-gray-500">Manage your supplier network</p>
                    </div>
                    <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">Management</span>
                </div>

                {/* Main grid – glass cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                            <SupplierForm onSuccess={() => window.location.reload()} />
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
                            <SupplierList />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuppliersPage;