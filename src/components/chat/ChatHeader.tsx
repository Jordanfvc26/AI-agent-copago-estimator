import { Stethoscope } from "lucide-react";
import { PLAN_BADGE_COLORS } from "@/constants";

const PLANS = ["Gold", "Silver", "Basic"] as const;

function PlanBadge({ plan }: { plan: string }) {
  const color = PLAN_BADGE_COLORS[plan] ?? "#6B7280";
  return (
    <span
      style={{
        fontSize: "9px",
        fontWeight: 700,
        color,
        background: `${color}10`,
        border: `1px solid ${color}30`,
        padding: "3px 8px",
        borderRadius: "6px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      {plan}
    </span>
  );
}

export function ChatHeader() {
  return (
    <div
      className="px-5 py-3.5 flex items-center gap-3.5 flex-shrink-0"
      style={{ background: "#FFFFFF", borderBottom: "1px solid #E5E7EB" }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #059669, #10B981)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(5,150,105,0.25)",
        }}
      >
        <Stethoscope size={20} color="#FFFFFF" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <h1 style={{ fontSize: "15px", fontWeight: 700, color: "#1F2937", fontFamily: "'DM Sans', Inter, sans-serif", margin: 0 }}>
          Estimador de Copago
        </h1>
        <p style={{ fontSize: "11px", color: "#6B7280", fontWeight: 500, margin: 0 }}>
          Estimación de copago médico con IA
        </p>
      </div>
      <div className="flex gap-1.5">
        {PLANS.map((plan) => <PlanBadge key={plan} plan={plan} />)}
      </div>
    </div>
  );
}
