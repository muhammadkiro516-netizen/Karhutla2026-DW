import { sha256Hex } from "@/lib/evidence";

/** Tamper-evident decision log: each entry hashes its content + previous hash (hash chain). */
export interface DecisionPayload {
  at: string; // ISO UTC
  cityId: string;
  school: string;
  ispu: number;
  recommended: string; // status code proposed by the engine
  decided: string; // status code approved (may differ = human override)
  approver: string;
  note?: string;
}
export interface DecisionEntry extends DecisionPayload { prevHash: string; hash: string }

export const GENESIS = "0".repeat(64);

function canonical(o: object): string {
  return JSON.stringify(Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined).sort(([a], [b]) => a.localeCompare(b))));
}

export async function appendDecision(log: DecisionEntry[], p: DecisionPayload): Promise<DecisionEntry[]> {
  const prevHash = log.at(-1)?.hash ?? GENESIS;
  const hash = await sha256Hex(new TextEncoder().encode(prevHash + canonical(p)));
  return [...log, { ...p, prevHash, hash }];
}

/** Returns index of first broken entry, or -1 when the whole chain is intact. */
export async function verifyChain(log: DecisionEntry[]): Promise<number> {
  let prev = GENESIS;
  for (let i = 0; i < log.length; i++) {
    const { hash, prevHash, ...p } = log[i];
    const expect = await sha256Hex(new TextEncoder().encode(prev + canonical(p)));
    if (prevHash !== prev || hash !== expect) return i;
    prev = hash;
  }
  return -1;
}
