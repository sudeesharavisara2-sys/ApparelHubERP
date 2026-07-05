export const COLORS = {
  dark: "#0F172A",       // Deep Dark Blue
  darkLight: "#1E293B",  // Slate Dark Blue
  black: "#111827",      // Matte Black for clean text/headers
  yellow: "#EAB308",     // Vibrant Yellow for primary actions/highlights
  yellowLight: "#FDE047",// Light Yellow tint
  yellowBg: "#FEF9C3",   // Very light yellow background for badges
  slate: "#F8FAFC",      // Light ash gray background
  slateText: "#64748B",  // Muted gray for subtitles
  border: "#E2E8F0",     // Clean border gray
  success: "#10B981",    // Green
  danger: "#EF4444",     // Red
  info: "#3B82F6",       // Blue
};

export const GRADIENTS = {
  header: `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.black} 100%)`,
  yellow: `linear-gradient(135deg, ${COLORS.yellow}, ${COLORS.yellowLight})`,
  success: `linear-gradient(135deg, #10B981, #34D399)`,
  danger: `linear-gradient(135deg, #EF4444, #F87171)`,
  info: `linear-gradient(135deg, #3B82F6, #60A5FA)`,
};

export const STATUS_FLOW = ["Draft", "PendingApproval", "Approved", "Shipped", "Received"];

export const statusMeta = (status) => {
  switch (status) {
    case "Draft": return { label: "Draft", color: "#64748B", grad: "linear-gradient(135deg, #64748B, #94A3B8)" };
    case "PendingApproval": return { label: "Pending Approval", color: "#EAB308", grad: "linear-gradient(135deg, #EAB308, #FDE047)" };
    case "Approved": return { label: "Approved", color: "#3B82F6", grad: "linear-gradient(135deg, #3B82F6, #60A5FA)" };
    case "Shipped": return { label: "Shipped", color: "#6366F1", grad: "linear-gradient(135deg, #6366F1, #818CF8)" };
    case "Received": return { label: "Received", color: "#10B981", grad: "linear-gradient(135deg, #10B981, #34D399)" };
    case "Cancelled": return { label: "Cancelled", color: "#EF4444", grad: "linear-gradient(135deg, #EF4444, #F87171)" };
    default: return { label: status || "Pending", color: "#64748B", grad: "linear-gradient(135deg, #64748B, #94A3B8)" };
  }
};