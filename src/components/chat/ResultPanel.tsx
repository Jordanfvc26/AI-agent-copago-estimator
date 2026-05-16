import { Building2, Star } from "lucide-react";
import { PLAN_COLORS } from "@/constants";
import type { PolicySummary, HospitalResult } from "@/types";

interface ResultPanelProps {
  policy: PolicySummary;
  hospitals: HospitalResult[];
}

function PolicyCard({ policy }: { policy: PolicySummary }) {
  const colors = PLAN_COLORS[policy.plan] ?? PLAN_COLORS.Basic;
  return (
    <div style={{ background: colors.bg, borderRadius: "16px", padding: "20px", marginBottom: "12px", position: "relative", overflow: "hidden", border: `1px solid ${colors.border}`, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
      <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", filter: "blur(20px)" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p style={{ fontSize: "11px", color: colors.badge, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Plan de Seguro</p>
            <h3 style={{ fontSize: "24px", fontWeight: 800, color: "#FFFFFF", margin: "4px 0 0 0", fontFamily: "'DM Sans', Inter, sans-serif" }}>Plan {policy.plan}</h3>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "12px", padding: "8px 16px", textAlign: "center" }}>
            <p style={{ fontSize: "28px", fontWeight: 800, color: "#FFFFFF", margin: 0, lineHeight: 1 }}>{policy.coveragePercentage}%</p>
            <p style={{ fontSize: "10px", color: colors.text, margin: "2px 0 0 0", fontWeight: 500 }}>Cobertura</p>
          </div>
        </div>
        <div className="flex gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "12px" }}>
          <PolicyField label="Paciente" value={policy.patientName} color={colors.text} />
          <PolicyField label="Póliza" value={policy.policyNumber} color={colors.text} monospace />
        </div>
      </div>
    </div>
  );
}

function PolicyField({ label, value, color, monospace }: { label: string; value: string; color: string; monospace?: boolean }) {
  return (
    <div>
      <p style={{ fontSize: "10px", color, margin: 0, fontWeight: 500 }}>{label}</p>
      <p style={{ fontSize: "14px", color: "#FFFFFF", margin: "2px 0 0 0", fontWeight: 600, ...(monospace ? { fontFamily: "monospace" } : {}) }}>{value}</p>
    </div>
  );
}

function HospitalRow({ hospital, isBest }: { hospital: HospitalResult; isBest: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: isBest ? "rgba(16,185,129,0.04)" : "transparent" }}>
      <div className="flex items-center gap-3">
        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: isBest ? "linear-gradient(135deg, #059669, #10B981)" : "linear-gradient(135deg, #E5E7EB, #D1D5DB)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: isBest ? "0 2px 8px rgba(5,150,105,0.3)" : "none" }}>
          {isBest ? <Star size={16} color="#FFFFFF" strokeWidth={2} fill="#FFFFFF" /> : <Building2 size={16} color="#9CA3AF" strokeWidth={2} />}
        </div>
        <p style={{ fontSize: "13px", fontWeight: 600, color: "#1F2937", margin: 0 }}>
          {hospital.hospitalName}
          {isBest && <BestPriceBadge />}
        </p>
      </div>
      <div style={{ textAlign: "right" }}>
        <p style={{ fontSize: isBest ? "20px" : "16px", fontWeight: 800, color: isBest ? "#059669" : "#374151", margin: 0, fontFamily: "'DM Sans', Inter, sans-serif" }}>
          ${hospital.estimatedCopay.toFixed(2)}
        </p>
        <p style={{ fontSize: "10px", color: "#9CA3AF", margin: "1px 0 0 0" }}>copago estimado</p>
      </div>
    </div>
  );
}

function BestPriceBadge() {
  return (
    <span style={{ marginLeft: "8px", fontSize: "10px", fontWeight: 700, color: "#059669", background: "rgba(16,185,129,0.1)", padding: "2px 8px", borderRadius: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
      Mejor Precio
    </span>
  );
}

export function ResultPanel({ policy, hospitals }: ResultPanelProps) {
  return (
    <div className="my-4 animate-scale-in">
      <PolicyCard policy={policy} />
      <div style={{ background: "#FFFFFF", borderRadius: "16px", border: "1px solid #E5E7EB", overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
        <div style={{ background: "linear-gradient(135deg, #F9FAFB, #F3F4F6)", padding: "14px 16px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: "8px" }}>
          <Building2 size={16} color="#374151" strokeWidth={2} />
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#1F2937", margin: 0, fontFamily: "'DM Sans', Inter, sans-serif" }}>Opciones de Hospitales</h4>
            <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0 0" }}>{hospitals[0]?.specialty} — {hospitals[0]?.serviceName}</p>
          </div>
        </div>
        <div style={{ padding: "4px 0" }}>
          {hospitals.map((hospital, index) => (
            <div key={hospital.hospitalName} style={{ borderBottom: index < hospitals.length - 1 ? "1px solid #F3F4F6" : "none" }}>
              <HospitalRow hospital={hospital} isBest={index === 0} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
