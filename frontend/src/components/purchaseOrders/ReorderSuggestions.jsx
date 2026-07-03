import { useState, useEffect } from 'react';
import { purchaseOrderService } from '../../services/purchaseOrderService';

const ReorderSuggestions = () => {
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        purchaseOrderService.getReorderSuggestions().then(setSuggestions);
    }, []);

    if (suggestions.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-gray-400 text-sm">No reorder suggestions</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h4 className="font-semibold text-gray-700 mb-4">Reorder Suggestions</h4>
            <ul className="space-y-2">
                {suggestions.map((item, i) => (
                    <li key={i} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-100">
                        <span className="font-medium text-gray-700">{item.productName}</span>
                        <div className="text-sm space-x-3">
                            <span className="text-red-600 font-semibold">Stock: {item.currentStock}</span>
                            <span className="text-gray-400">Reorder: {item.reorderLevel}</span>
                            <span className="text-blue-600 font-semibold">→ {item.suggestedQuantity}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReorderSuggestions;