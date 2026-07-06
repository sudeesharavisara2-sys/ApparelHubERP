export const LiveTicker = ({ events }) => {
  const text = events.map((e) => e.text).join("     ✦     ");
  return (
    <div className="overflow-hidden relative" style={{ background: "#0F172A" }}>
      <div className="whitespace-nowrap py-2 text-xs" style={{
        fontFamily: "'JetBrains Mono', monospace",
        color: "#FDE047",
        animation: "ticker-scroll 26s linear infinite",
      }}>
        {text}     ✦     {text}
      </div>
    </div>
  );
};