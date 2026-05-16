import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getSystemPrompt } from "@/lib/systemPrompt";
import { parseSignal, type Signal } from "@/lib/parseSignals";
import { lookupSymptomVec } from "@/lib/pineconeSearch";
import { lookupPolicy, type Policy } from "@/lib/db";
import type { HospitalResult, SymptomMatch } from "@/types";

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type ApiMessage = { role: string; content: string };

async function callLLM(messages: ApiMessage[]): Promise<string> {
  const response = await openaiClient.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 1024,
    messages: [
      { role: "system", content: getSystemPrompt() },
      ...(messages as OpenAI.ChatCompletionMessageParam[]),
    ],
  });
  return response.choices[0]?.message?.content ?? "";
}

function cleanSignalsFromText(text: string): string {
  return text
    .replace(/SYMPTOM_IDENTIFIED\s*:?\s*\{[\s\S]*?\}/g, "")
    .replace(/POLICY_LOOKUP\s*:?\s*\{[\s\S]*?\}/g, "")
    .replace(/COPAY_READY\s*:?\s*\{[\s\S]*?\}/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function buildInjectionMessage(content: string, history: ApiMessage[], displayText: string, rawText: string, signalPattern: string): ApiMessage[] {
  const assistantText = displayText || rawText.replace(new RegExp(`${signalPattern}[\\s\\S]*$`), "").trim();
  return [...history, { role: "assistant", content: assistantText }, { role: "user", content }];
}

async function handleSymptomIdentified(signal: Signal & { type: "SYMPTOM_IDENTIFIED" }, messages: ApiMessage[]): Promise<NextResponse> {
  const matches = await lookupSymptomVec(signal.data.symptomDescription);
  if (!matches.length) return NextResponse.json({ content: signal.displayText || "Entiendo tus síntomas. Necesito también tu número de póliza para darte una estimación precisa del copago." });

  const uniqueMatches = deduplicateBySymptomAndSpecialty(matches);
  const matchSummary = uniqueMatches.slice(0, 5).map((m, i) => `${i + 1}. ${m.specialty} — ${m.service_name} (síntoma: "${m.symptom}")`).join("\n");
  const injectionText = `[SYMPTOM_MATCHES]\nServicios médicos encontrados para los síntomas del paciente:\n\n${matchSummary}`;

  const updatedMessages = buildInjectionMessage(injectionText, messages, signal.displayText, "", "SYMPTOM_IDENTIFIED");
  const followUp = await callLLM(updatedMessages);
  return NextResponse.json({ content: cleanSignalsFromText(followUp) });
}

async function handlePolicyLookup(signal: Signal & { type: "POLICY_LOOKUP" }, messages: ApiMessage[]): Promise<NextResponse> {
  const policy = await lookupPolicy(signal.data.policyNumber);
  const injectionText = buildPolicyInjectionText(signal.data.policyNumber, policy);
  const updatedMessages = buildInjectionMessage(injectionText, messages, signal.displayText, "", "POLICY_LOOKUP");
  const followUp = await callLLM(updatedMessages);
  const followUpSignal = parseSignal(followUp);

  if (followUpSignal.type === "COPAY_READY") return handleCopayReady(followUpSignal, updatedMessages);

  return NextResponse.json({ content: cleanSignalsFromText(followUp) });
}

function buildPolicyInjectionText(policyNumber: string, policy: Policy | null): string {
  if (!policy) return `[POLICY_NOT_FOUND]\nLa póliza "${policyNumber}" no existe. Pide al usuario que verifique. El formato válido es POL-XXXX (ej: POL-1001).`;
  return `[POLICY_FOUND]\nPóliza: ${policy.policy_number}\nPaciente: ${policy.patient_name}\nPlan: ${policy.insurance_plan}\nCobertura: ${policy.coverage_percentage}%\n\nConfirma los detalles al paciente. Si ya tienes [SYMPTOM_MATCHES], emite COPAY_READY.`;
}

function deduplicateBySymptomAndSpecialty(matches: SymptomMatch[]): SymptomMatch[] {
  const seen = new Set<string>();
  return matches.filter((match) => {
    const key = `${match.symptom}|${match.specialty}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function deduplicateByHospital(matches: SymptomMatch[]): SymptomMatch[] {
  const byHospital = new Map<string, SymptomMatch>();
  for (const match of matches) {
    const existing = byHospital.get(match.hospital_name);
    if (!existing || existing.score < match.score) byHospital.set(match.hospital_name, match);
  }
  return Array.from(byHospital.values()).sort((a, b) => a.estimated_copay - b.estimated_copay);
}

function mapMatchToHospitalResult(match: SymptomMatch): HospitalResult {
  return {
    hospitalName: match.hospital_name,
    specialty: match.specialty,
    serviceName: match.service_name,
    baseCost: match.base_cost,
    multiplier: match.service_price_multiplier,
    finalPrice: match.final_price,
    coveragePercentage: match.coverage_percentage,
    estimatedCopay: match.estimated_copay,
  };
}

async function handleCopayReady(signal: Signal & { type: "COPAY_READY" }, messages: ApiMessage[]): Promise<NextResponse> {
  const policy = await lookupPolicy(signal.data.policyNumber);
  if (!policy) return NextResponse.json({ content: "No pude encontrar esa póliza. Por favor verifica tu número de póliza." });

  const matches = await lookupSymptomVec(signal.data.symptomDescription, policy.insurance_plan);
  if (!matches.length) return NextResponse.json({ content: "No encontré servicios médicos que coincidan con tus síntomas. Por favor intenta describir tus síntomas de otra manera." });

  const hospitals = deduplicateByHospital(matches);
  const resultSummary = hospitals.map((h, i) => `${i + 1}. ${h.hospital_name}: copago estimado $${h.estimated_copay.toFixed(2)} (cobertura: ${h.coverage_percentage}%, especialidad: ${h.specialty})`).join("\n");
  const injectionText = `[COPAY_RESULTS]\nPaciente: ${policy.patient_name}\nPlan: ${policy.insurance_plan} (${policy.coverage_percentage}% cobertura)\n\nOpciones ordenadas por menor copago:\n${resultSummary}\n\nPresenta los resultados destacando la opción más económica.`;

  const updatedMessages = buildInjectionMessage(injectionText, messages, signal.displayText, "", "COPAY_READY");
  const followUp = await callLLM(updatedMessages);

  return NextResponse.json({
    content: cleanSignalsFromText(followUp),
    copayResults: {
      policy: { policyNumber: policy.policy_number, patientName: policy.patient_name, plan: policy.insurance_plan, coveragePercentage: policy.coverage_percentage },
      hospitals: hospitals.map(mapMatchToHospitalResult),
    },
  });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages)) return NextResponse.json({ error: "messages array required" }, { status: 400 });

    const rawResponse = await callLLM(messages);
    const signal = parseSignal(rawResponse);

    if (signal.type === "SYMPTOM_IDENTIFIED") return handleSymptomIdentified(signal, messages);
    if (signal.type === "POLICY_LOOKUP") return handlePolicyLookup(signal, messages);
    if (signal.type === "COPAY_READY") return handleCopayReady(signal, messages);
    if (signal.type === "HANDOFF_REQUESTED") return NextResponse.json({ content: signal.displayText, handoff: true });

    return NextResponse.json({ content: signal.displayText || rawResponse });
  } catch (error) {
    console.error("[API] Chat route error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "AI service unavailable" }, { status: 500 });
  }
}
