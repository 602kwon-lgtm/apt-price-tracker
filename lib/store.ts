import fs from "node:fs";
import path from "node:path";
import type { Trade } from "./types";

const DATA_DIR = path.join(process.cwd(), "data", "trades");

function filePath(complexId: string): string {
  return path.join(DATA_DIR, `${complexId}.json`);
}

export function readTrades(complexId: string): Trade[] {
  const p = filePath(complexId);
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, "utf-8")) as Trade[];
}

function tradeKey(t: Trade): string {
  return [t.type, t.dealDate, t.dong, t.jibun, t.excluUseAr, t.floor, t.amount, t.monthlyRent].join("|");
}

/** 기존 데이터에 신규 거래를 병합(중복 제거)하고 최신순으로 정렬해 저장한다. */
export function mergeAndWriteTrades(complexId: string, incoming: Trade[]): { total: number; added: number } {
  const existing = readTrades(complexId);
  const seen = new Map(existing.map((t) => [tradeKey(t), t]));
  let added = 0;

  for (const t of incoming) {
    const key = tradeKey(t);
    if (!seen.has(key)) {
      seen.set(key, t);
      added++;
    }
  }

  const merged = Array.from(seen.values()).sort((a, b) => (a.dealDate < b.dealDate ? 1 : a.dealDate > b.dealDate ? -1 : 0));

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(filePath(complexId), JSON.stringify(merged, null, 2), "utf-8");

  return { total: merged.length, added };
}
