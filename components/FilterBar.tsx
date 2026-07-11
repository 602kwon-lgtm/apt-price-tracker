"use client";

import {
  applyFilters,
  computeAreaGroups,
  FLOOR_TIERS,
  recentMonthsRange,
  TRANSACTION_CLIFF_RANGE,
  type AreaGroup,
  type FloorTier,
  type TradeFilters,
} from "@/lib/filters";
import type { Trade } from "@/lib/types";

export { applyFilters };

export function useAreaGroups(trades: Trade[]): AreaGroup[] {
  return computeAreaGroups(trades.map((t) => t.excluUseAr));
}

export default function FilterBar({
  filters,
  onChange,
  areaGroups,
  resultCount,
}: {
  filters: TradeFilters;
  onChange: (next: TradeFilters) => void;
  areaGroups: AreaGroup[];
  resultCount: number;
}) {
  function toggleSet<T>(set: Set<T>, value: T): Set<T> {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  }

  const cliffActive = filters.dateFrom === TRANSACTION_CLIFF_RANGE.from && filters.dateTo === TRANSACTION_CLIFF_RANGE.to;
  const recent3 = recentMonthsRange(3);
  const recent3Active = filters.dateFrom === recent3.from && filters.dateTo === recent3.to;

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="filter-group">
        <span className="filter-label">계약일</span>
        <input
          type="month"
          value={filters.dateFrom}
          onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
        />
        <span className="muted">~</span>
        <input
          type="month"
          value={filters.dateTo}
          onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
        />
        <button
          className={`pill${filters.dateFrom === "" && filters.dateTo === "" ? " active" : ""}`}
          onClick={() => onChange({ ...filters, dateFrom: "", dateTo: "" })}
        >
          전체 기간
        </button>
        <button
          className={`pill${cliffActive ? " active" : ""}`}
          onClick={() =>
            onChange({ ...filters, dateFrom: TRANSACTION_CLIFF_RANGE.from, dateTo: TRANSACTION_CLIFF_RANGE.to })
          }
        >
          거래절벽시기 (21.11~23.07)
        </button>
        <button
          className={`pill${recent3Active ? " active" : ""}`}
          onClick={() => onChange({ ...filters, dateFrom: recent3.from, dateTo: recent3.to })}
        >
          최근 3개월
        </button>
      </div>

      <div className="filter-group">
        <span className="filter-label">전용면적</span>
        <button
          className={`pill${filters.areaGroupKeys.size === 0 ? " active" : ""}`}
          onClick={() => onChange({ ...filters, areaGroupKeys: new Set() })}
        >
          전체
        </button>
        {areaGroups.map((g) => (
          <button
            key={g.key}
            className={`pill${filters.areaGroupKeys.has(g.key) ? " active" : ""}`}
            onClick={() => onChange({ ...filters, areaGroupKeys: toggleSet(filters.areaGroupKeys, g.key) })}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="filter-group">
        <span className="filter-label">층</span>
        <button
          className={`pill${filters.floorTiers.size === 0 ? " active" : ""}`}
          onClick={() => onChange({ ...filters, floorTiers: new Set() })}
        >
          전체
        </button>
        {FLOOR_TIERS.map((t) => (
          <button
            key={t.key}
            className={`pill${filters.floorTiers.has(t.key as FloorTier) ? " active" : ""}`}
            onClick={() => onChange({ ...filters, floorTiers: toggleSet(filters.floorTiers, t.key as FloorTier) })}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="muted" style={{ marginTop: 12, marginBottom: 0, fontSize: 13 }}>
        필터링된 거래량: <strong style={{ color: "var(--text-primary)" }}>{resultCount}건</strong>
      </p>
    </div>
  );
}
