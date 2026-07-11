import type { Trade } from "./types";

export type FloorTier = "low" | "mid" | "high";

export const FLOOR_TIERS: { key: FloorTier; label: string }[] = [
  { key: "low", label: "저층 (1~5층)" },
  { key: "mid", label: "중층 (6~9층)" },
  { key: "high", label: "고층 (10층~)" },
];

export function floorTier(floor: number): FloorTier {
  if (floor <= 5) return "low";
  if (floor <= 9) return "mid";
  return "high";
}

export interface AreaGroup {
  key: string;
  label: string;
  min: number;
  max: number;
}

/** 전용면적 값들을 간격(gapThreshold) 기준으로 묶어 "비슷한 면적" 그룹을 만든다. */
export function computeAreaGroups(areas: number[], gapThreshold = 3): AreaGroup[] {
  const unique = Array.from(new Set(areas.filter((a) => a > 0))).sort((a, b) => a - b);
  if (unique.length === 0) return [];

  const clusters: number[][] = [[unique[0]]];
  for (let i = 1; i < unique.length; i++) {
    const current = clusters[clusters.length - 1];
    if (unique[i] - current[current.length - 1] <= gapThreshold) {
      current.push(unique[i]);
    } else {
      clusters.push([unique[i]]);
    }
  }

  return clusters.map((group) => {
    const min = group[0];
    const max = group[group.length - 1];
    const rounded = Math.round((min + max) / 2);
    return {
      key: `${min}-${max}`,
      label: min === max ? `${Math.round(min)}㎡` : `${rounded}㎡형 (${min}~${max})`,
      min,
      max,
    };
  });
}

/** 거래절벽시기(2021.11 ~ 2023.07) 프리셋 */
export const TRANSACTION_CLIFF_RANGE = { from: "2021-11", to: "2023-07" };

export function recentMonthsRange(count: number, from = new Date()): { from: string; to: string } {
  const to = `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, "0")}`;
  const start = new Date(from.getFullYear(), from.getMonth() - (count - 1), 1);
  const fromYm = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}`;
  return { from: fromYm, to };
}

export interface TradeFilters {
  dateFrom: string; // YYYY-MM
  dateTo: string; // YYYY-MM
  areaGroupKeys: Set<string>; // empty = 전체
  floorTiers: Set<FloorTier>; // empty = 전체
}

export function applyFilters(trades: Trade[], filters: TradeFilters, areaGroups: AreaGroup[]): Trade[] {
  return trades.filter((t) => {
    const ym = t.dealDate.slice(0, 7);
    if (filters.dateFrom && ym < filters.dateFrom) return false;
    if (filters.dateTo && ym > filters.dateTo) return false;

    if (filters.floorTiers.size > 0 && !filters.floorTiers.has(floorTier(t.floor))) return false;

    if (filters.areaGroupKeys.size > 0) {
      const group = areaGroups.find((g) => t.excluUseAr >= g.min && t.excluUseAr <= g.max);
      if (!group || !filters.areaGroupKeys.has(group.key)) return false;
    }

    return true;
  });
}
