export const StatCard = ({ label, value, sub, icon: Icon, color }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border shadow-sm flex items-center justify-between" style={{ borderColor: "#E2E8F0" }}>
      <div>
        <h3 className="text-3xl font-bold" style={{ color: "#1A0E3E" }}>{value}</h3>
        <p className="text-sm font-medium mt-1" style={{ color: "#64748B" }}>{label}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>{sub}</p>}
      </div>
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center text-white" 
        style={{ backgroundColor: color }}
      >
        <Icon size={22} />
      </div>
    </div>
  );
};