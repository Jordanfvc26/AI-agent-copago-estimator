import { UserCircle, PhoneCall, ArrowRight } from "lucide-react";

interface HandoffPromptProps {
  onConnect: () => void;
  onDismiss: () => void;
}

export function HandoffPrompt({ onConnect, onDismiss }: HandoffPromptProps) {
  return (
    <div className="my-4 animate-scale-in">
      <div style={{ background: "#FFFFFF", borderRadius: "16px", border: "1px solid #E5E7EB", overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
        <div style={{ height: "3px", background: "linear-gradient(90deg, #059669, #10B981, #34D399)" }} />
        <div style={{ padding: "20px" }}>
          <div className="flex items-center gap-3 mb-3">
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #059669, #10B981)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(5,150,105,0.3)" }}>
              <UserCircle size={22} color="#FFFFFF" strokeWidth={1.8} />
            </div>
            <div>
              <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#1F2937", margin: 0, fontFamily: "'DM Sans', Inter, sans-serif" }}>
                ¿Necesitas Asistencia Humana?
              </h4>
              <p style={{ fontSize: "12px", color: "#6B7280", margin: "2px 0 0 0" }}>
                Un especialista de soporte médico puede ayudarte directamente.
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <HandoffButton onClick={onConnect} variant="primary" icon={<PhoneCall size={14} strokeWidth={2} />} label="Sí, conéctame" />
            <HandoffButton onClick={onDismiss} variant="secondary" icon={<ArrowRight size={14} strokeWidth={2} />} label="No, continuar" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface HandoffButtonProps {
  onClick: () => void;
  variant: "primary" | "secondary";
  icon: React.ReactNode;
  label: string;
}

function HandoffButton({ onClick, variant, icon, label }: HandoffButtonProps) {
  const isPrimary = variant === "primary";
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: "10px 16px",
        borderRadius: "10px",
        background: isPrimary ? "linear-gradient(135deg, #059669, #10B981)" : "#FFFFFF",
        color: isPrimary ? "#FFFFFF" : "#374151",
        fontSize: "13px",
        fontWeight: 600,
        border: isPrimary ? "none" : "1px solid #D1D5DB",
        cursor: "pointer",
        boxShadow: isPrimary ? "0 2px 8px rgba(5,150,105,0.3)" : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
      }}
    >
      {icon}
      {label}
    </button>
  );
}
