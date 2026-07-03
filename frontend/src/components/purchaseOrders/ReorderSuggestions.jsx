import { useState, useEffect } from 'react';
import { purchaseOrderService } from '../../services/purchaseOrderService';
import { Bell, AlertCircle } from 'lucide-react';

const ReorderSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    purchaseOrderService.getReorderSuggestions()
      .then(setSuggestions)
      .catch(() => {});
  }, []);

  if (suggestions.length === 0) {
    return (
      <div className="card fade-in">
        <div className="flex items-center gap-2 text-gray-400">
          <Bell className="w-5 h-5" />
          <span className="text-sm">No reorder suggestions</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card fade-in">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-orange-500" />
        <h4 className="font-semibold text-gray-700">Reorder Suggestions</h4>
        <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">{suggestions.length}</span>
      </div>

      <div className="space-y-3">
        {suggestions.map((item, i) => (
          <div key={i} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-100">
            <span className="font-medium text-gray-700">{item.productName}</span>
            <div className="text-sm space-x-3">
              <span className="text-red-600 font-semibold">Stock: {item.currentStock}</span>
              <span className="text-gray-400">| Reorder: {item.reorderLevel}</span>
              <span className="text-blue-600 font-semibold">→ Order {item.suggestedQuantity}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReorderSuggestions;