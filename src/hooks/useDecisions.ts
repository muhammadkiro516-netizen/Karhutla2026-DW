"use client";
import { useState, useEffect } from "react";
import { appendDecision, verifyChain, GENESIS } from "@/lib/audit";
import type { DecisionEntry, DecisionPayload } from "@/lib/audit";

// Suppress unused import warning — GENESIS is imported per spec contract
void GENESIS;

const STORAGE_KEY = "eduair.decisions";

export function useDecisions() {
  const [log, setLog] = useState<DecisionEntry[]>([]);
  const [chainValid, setChainValid] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed: DecisionEntry[] = raw ? (JSON.parse(raw) as DecisionEntry[]) : [];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLog(parsed);
      verifyChain(parsed).then((broken) => setChainValid(broken === -1));
    } catch {
      setLog([]);
    }
  }, []);

  const addDecision = async (payload: DecisionPayload): Promise<DecisionEntry[]> => {
    const newLog = await appendDecision(log, payload);
    setLog(newLog);
    setChainValid(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLog));
    } catch {
      /* ignore */
    }
    return newLog;
  };

  const getLatest = (schoolSlug: string): DecisionEntry | undefined =>
    [...log].reverse().find((e) => e.school === schoolSlug);

  return { log, chainValid, addDecision, getLatest };
}
