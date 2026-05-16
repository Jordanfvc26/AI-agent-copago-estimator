export const PLAN_COLORS: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  Gold: {
    bg: "linear-gradient(135deg, #92400E, #B45309)",
    border: "#D97706",
    text: "#FEF3C7",
    badge: "#FCD34D",
  },
  Silver: {
    bg: "linear-gradient(135deg, #374151, #4B5563)",
    border: "#6B7280",
    text: "#E5E7EB",
    badge: "#D1D5DB",
  },
  Basic: {
    bg: "linear-gradient(135deg, #1E3A5F, #1E40AF)",
    border: "#3B82F6",
    text: "#DBEAFE",
    badge: "#93C5FD",
  },
};

export const PLAN_BADGE_COLORS: Record<string, string> = {
  Gold: "#D97706",
  Silver: "#6B7280",
  Basic: "#3B82F6",
};

export const SYSTEM_MESSAGE_BACKGROUNDS: Record<string, string> = {
  info: "linear-gradient(135deg, #1E3A5F, #1E3A5F)",
  success: "linear-gradient(135deg, #065F46, #047857)",
  error: "linear-gradient(135deg, #7F1D1D, #991B1B)",
};

export const CHAT_API_ENDPOINT = "/api/copay/chat";
export const INIT_MESSAGE = "Hola";
export const FALLBACK_ERROR_MESSAGE = "Lo siento, algo salió mal.";
