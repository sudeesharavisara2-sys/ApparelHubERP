import { useState, useEffect } from 'react';
import { purchaseOrderService } from '../../services/purchaseOrderService';
import { AlertCircle, Bell } from 'lucide-react';
import { COLORS } from '../../theme';

const ReorderSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    purchaseOrderService.getReorderSuggestions().then(setSuggestions).catch(() => {});
  }, []);

  if (suggestions.length === 0) {
    return (
      <div className="bg-white border rounded-xl p-4 flex items-center gap-2 text-slate-400" style={{ borderColor: COLORS.border }}>
        <Bell className="w-5 h-5" />
        <span className="text-sm">No reorder suggestions</span>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm fade-in" style={{ borderColor: COLORS.border }}>
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-orange-500" />
        <h4 className="font-semibold m-0 text-slate-700">Reorder Suggestions</h4>
        <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-orange-100 text-orange-700">{suggestions.length}</span>
      </div>

      <div className="space-y-3">
        {suggestions.map((item, i) => (
          <div key={i} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-100 text-sm">
            <span className="font-medium text-gray-700">{item.productName || item.Name}</span>
            <div className="space-x-3 font-mono">
              <span className="text-red-600 font-bold">Stock: {item.currentStock || item.StockQuantity}</span>
              <span className="text-blue-600 font-bold">→ Order {item.suggestedQuantity || item.SuggestedQuantity}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReorderSuggestions;