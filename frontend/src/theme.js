// src/theme.js
export const BG = "#F8F9FA";
export const INK = "#1A0E3E";
export const CORAL = "#FF6B6B";
export const GOLD = "#FFB100";
export const VIOLET = "#7C5CFF";
export const TEAL = "#00C2A8";
export const SKY = "#2F9BFF";
export const MUTE = "#8A83A8";

export const GRADIENTS = {
  header: `linear-gradient(110deg, ${INK} 0%, #2A1A5E 45%, ${VIOLET} 100%)`,
  coral: `linear-gradient(135deg, ${CORAL}, #FF9472)`,
  gold: `linear-gradient(135deg, ${GOLD}, #FFD166)`,
  violet: `linear-gradient(135deg, ${VIOLET}, #A78BFA)`,
  teal: `linear-gradient(135deg, ${TEAL}, #4EE0C3)`,
  sky: `linear-gradient(135deg, ${SKY}, #7ED0FF)`,
};

export const STATUS_FLOW = ["Pending", "Approved", "Received"];

export const statusMeta = (status) => {
  switch (status) {
    case "Received": return { color: TEAL, grad: GRADIENTS.teal, label: "RECEIVED" };
    case "Approved": return { color: SKY, grad: GRADIENTS.sky, label: "APPROVED" };
    case "Cancelled": return { color: CORAL, grad: GRADIENTS.coral, label: "CANCELLED" };
    default: return { color: VIOLET, grad: GRADIENTS.violet, label: "PENDING" };
  }
};