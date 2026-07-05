import { TrendingUp, Truck, ClipboardList, Sparkles } from 'lucide-react';
import { VIOLET, SKY, GOLD, TEAL } from '../theme';

export const Navbar = ({ tab, setTab }) => {
  const items = [
    { id: "overview", label: "Overview", icon: TrendingUp, color: VIOLET },
    { id: "suppliers", label: "Suppliers", icon: Truck, color: SKY },
    { id: "orders", label: "Purchase Orders", icon: ClipboardList, color: GOLD },
    { id: "workflow", label: "Workflow", icon: Sparkles, color: TEAL },
  ];

  return (
    <nav className="flex gap-1 px-2">
      {items.map((it) => {
        const Icon = it.icon;
        const active = tab === it.id;
        return (
          <button
            key={it.id}
            onClick={() => setTab(it.id)}
            className="flex items-center gap-2 px-4 py-3 text-sm rounded-t-lg transition-all"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: active ? "#fff" : "#B7ADE0",
              background: active ? `${it.color}33` : "transparent",
              borderBottom: active ? `3px solid ${it.color}` : "3px solid transparent",
              fontWeight: 600,
            }}
          >
            <Icon size={15} />
            {it.label}
          </button>
        );
      })}
    </nav>
  );
};

export const LiveDot = () => {
  const CORAL = "#FF6B6B";
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: CORAL }} />
      <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: CORAL }} />
    </span>
  );
};