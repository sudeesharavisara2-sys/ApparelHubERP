// src/components/common/LiveTicker.jsx

export const LiveTicker = ({ events }) => {
  const text = events.map((e) => e.text).join("     ✦     ");
  return (
    <div className="overflow-hidden relative" style={{ background: "#1A0E3E" }}>
      <div className="whitespace-nowrap py-2 text-xs" style={{
        fontFamily: "'JetBrains Mono', monospace",
        color: "#C9BFFF",
        animation: "ticker-scroll 26s linear infinite",
      }}>
        {text}     ✦     {text}
      </div>
    </div>
  );
};