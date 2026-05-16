export interface Policy {
  policy_number: string;
  patient_name: string;
  insurance_plan: string;
  coverage_percentage: number;
}

export interface SymptomMatch {
  symptom: string;
  specialty: string;
  service_name: string;
  base_cost: number;
  insurance_plan: string;
  coverage_percentage: number;
  hospital_name: string;
  service_price_multiplier: number;
  final_price: number;
  estimated_copay: number;
  score: number;
}

export interface HospitalResult {
  hospitalName: string;
  specialty: string;
  serviceName: string;
  baseCost: number;
  multiplier: number;
  finalPrice: number;
  coveragePercentage: number;
  estimatedCopay: number;
}

export interface PolicySummary {
  policyNumber: string;
  patientName: string;
  plan: string;
  coveragePercentage: number;
}

export interface CopayResult {
  policy: PolicySummary;
  hospitals: HospitalResult[];
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  systemType?: "info" | "success" | "error";
  systemIcon?: "phone" | "check" | "error" | "info";
  copayResults?: CopayResult;
}

export interface ApiMessage {
  role: "user" | "assistant";
  content: string;
}
