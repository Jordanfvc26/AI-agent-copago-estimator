import path from "path";
import fs from "fs";
import initSqlJs, { Database } from "sql.js";

export interface Policy {
  policy_number: string;
  patient_name: string;
  insurance_plan: string;
  coverage_percentage: number;
}

let cachedDb: Database | null = null;

async function getDatabase(): Promise<Database> {
  if (cachedDb) return cachedDb;
  const SQL = await initSqlJs();
  const dbPath = path.join(process.cwd(), "data", "policies.db");
  cachedDb = new SQL.Database(fs.readFileSync(dbPath));
  return cachedDb;
}

function rowToPolicy(columns: string[], row: unknown[]): Policy {
  return Object.fromEntries(columns.map((col, i) => [col, row[i]])) as unknown as Policy;
}

export async function lookupPolicy(policyNumber: string): Promise<Policy | null> {
  try {
    const db = await getDatabase();
    const normalized = policyNumber.trim().toUpperCase();
    const result = db.exec("SELECT * FROM policies WHERE UPPER(policy_number) = ?", [normalized]);

    if (!result.length || !result[0].values.length) return null;

    return rowToPolicy(result[0].columns, result[0].values[0]);
  } catch (error) {
    console.error("[DB] lookupPolicy failed:", error);
    return null;
  }
}
