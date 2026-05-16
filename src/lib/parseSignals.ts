export type Signal =
  | { type: "SYMPTOM_IDENTIFIED"; data: { symptomDescription: string }; displayText: string }
  | { type: "POLICY_LOOKUP"; data: { policyNumber: string }; displayText: string }
  | { type: "COPAY_READY"; data: { symptomDescription: string; policyNumber: string }; displayText: string }
  | { type: "HANDOFF_REQUESTED"; displayText: string }
  | { type: "NONE"; displayText: string };

function extractJsonFromText(text: string): Record<string, unknown> | null {
  const attempts = [
    () => JSON.parse(text.trim()),
    () => JSON.parse(text.replace(/^```[\w]*\s*\n?/gm, "").replace(/\n?```\s*$/gm, "").trim()),
    () => {
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      return start !== -1 && end > start ? JSON.parse(text.slice(start, end + 1)) : null;
    },
  ];

  for (const attempt of attempts) {
    try {
      const result = attempt();
      if (result) return result;
    } catch { /* continue */ }
  }
  return null;
}

function extractSignalPayload(raw: string, pattern: RegExp): { displayText: string; afterMarker: string } | null {
  const match = raw.match(pattern);
  if (!match || match.index === undefined) return null;
  return {
    displayText: raw.slice(0, match.index).trim(),
    afterMarker: raw.slice(match.index + match[0].length).trim(),
  };
}

export function parseSignal(raw: string): Signal {
  const copayPayload = extractSignalPayload(raw, /COPAY_READY\s*:?\s*/);
  if (copayPayload) {
    const data = extractJsonFromText(copayPayload.afterMarker);
    if (data) return { type: "COPAY_READY", data: { symptomDescription: (data.symptomDescription as string) || "", policyNumber: (data.policyNumber as string) || "" }, displayText: copayPayload.displayText };
  }

  const symptomPayload = extractSignalPayload(raw, /SYMPTOM_IDENTIFIED\s*:?\s*/);
  if (symptomPayload) {
    const data = extractJsonFromText(symptomPayload.afterMarker);
    if (data && typeof data.symptomDescription === "string") return { type: "SYMPTOM_IDENTIFIED", data: { symptomDescription: data.symptomDescription }, displayText: symptomPayload.displayText };
  }

  const policyPayload = extractSignalPayload(raw, /POLICY_LOOKUP\s*:?\s*/);
  if (policyPayload) {
    const data = extractJsonFromText(policyPayload.afterMarker);
    if (data && typeof data.policyNumber === "string") return { type: "POLICY_LOOKUP", data: { policyNumber: data.policyNumber }, displayText: policyPayload.displayText };
  }

  if (raw.includes("HANDOFF_REQUESTED")) {
    return { type: "HANDOFF_REQUESTED", displayText: raw.replace(/HANDOFF_REQUESTED/g, "").trim() };
  }

  return { type: "NONE", displayText: raw };
}
