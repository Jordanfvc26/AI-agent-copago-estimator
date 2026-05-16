import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import type { SymptomMatch } from "@/types";

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pineconeClient = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const pineconeIndex = pineconeClient.index(process.env.PINECONE_INDEX_NAME!);

async function generateEmbedding(text: string): Promise<number[] | null> {
  try {
    const response = await openaiClient.embeddings.create({
      model: "text-embedding-3-large",
      input: text,
      dimensions: 1024,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error("[Pinecone] Embedding generation failed:", error instanceof Error ? error.message : error);
    return null;
  }
}

function buildQueryOptions(vector: number[], insurancePlan?: string) {
  return {
    vector,
    topK: 30,
    includeMetadata: true,
    ...(insurancePlan ? { filter: { insurance_plan: { $eq: insurancePlan } } } : {}),
  };
}

function mapMatchToSymptom(match: { metadata?: Record<string, unknown>; score?: number }): SymptomMatch | null {
  const meta = match.metadata;
  if (!meta) return null;
  return {
    symptom: meta.symptom as string,
    specialty: meta.specialty as string,
    service_name: meta.service_name as string,
    base_cost: meta.base_cost as number,
    insurance_plan: meta.insurance_plan as string,
    coverage_percentage: meta.coverage_percentage as number,
    hospital_name: meta.hospital_name as string,
    service_price_multiplier: meta.service_price_multiplier as number,
    final_price: meta.final_price as number,
    estimated_copay: meta.estimated_copay as number,
    score: match.score ?? 0,
  };
}

export async function lookupSymptomVec(symptomDescription: string, insurancePlan?: string): Promise<SymptomMatch[]> {
  const vector = await generateEmbedding(symptomDescription);
  if (!vector) return [];

  try {
    const queryResponse = await pineconeIndex.query(buildQueryOptions(vector, insurancePlan));
    const matches = queryResponse.matches ?? [];

    return matches
      .map(mapMatchToSymptom)
      .filter((match): match is SymptomMatch => match !== null)
      .sort((a, b) => a.estimated_copay - b.estimated_copay);
  } catch (error) {
    console.error("[Pinecone] Query failed:", error instanceof Error ? error.message : error);
    return [];
  }
}
