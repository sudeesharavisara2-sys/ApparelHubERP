// src/components/common/StatCard.jsx
import { useCountUp } from '../../hooks/useCountUp';

export const StatCard = ({ label, value, sub, grad, icon: Icon }) => {
  const shown = useCountUp(value);
  return (
    <div className="flex-1 min-w-[150px] rounded-2xl p-4 relative overflow-hidden text-white shadow-lg" style={{ background: grad }}>
      <div className="absolute -right-4 -top-4 opacity-25"><Icon size={72} /></div>
      <div className="text-xs uppercase relative z-10" style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", opacity: 0.85 }}>
        {label}
      </div>
      <div className="mt-1 text-4xl relative z-10" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>
        {shown}
      </div>
      {sub && <div className="text-xs mt-1 relative z-10" style={{ opacity: 0.9 }}>{sub}</div>}
    </div>
  );
};