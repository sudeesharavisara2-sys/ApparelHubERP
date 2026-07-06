import { COLORS } from '../../../theme'; // Mapped: Go up 3 levels to reach src/theme.js

export const StatCard = ({ label, value, sub, icon: Icon, color }) => {
  return (
    <div className="bg-white rounded-xl p-5 border shadow-sm flex items-center justify-between w-full fade-in" style={{ borderColor: COLORS.border }}>
      <div>
        <h3 className="text-3xl font-bold m-0" style={{ color: COLORS.dark }}>{value !== undefined ? value : 0}</h3>
        <p className="text-sm font-medium mt-1 m-0" style={{ color: COLORS.slateText }}>{label}</p>
        {sub && <p className="text-xs mt-0.5 m-0" style={{ color: '#94A3B8' }}>{sub}</p>}
      </div>
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0" 
        style={{ backgroundColor: color }}
      >
        <Icon size={22} />
      </div>
    </div>
  );
};