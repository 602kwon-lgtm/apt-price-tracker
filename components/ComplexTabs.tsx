"use client";

import { useMemo, useState } from "react";
import type { Trade } from "@/lib/types";
import type { TradeFilters } from "@/lib/filters";
import PriceChart from "./PriceChart";
import TradeTable from "./TradeTable";
import FilterBar, { applyFilters, useAreaGroups } from "./FilterBar";

const TABS = [
  { key: "sale", label: "매매", color: "var(--jade)" },
  { key: "jeonse", label: "전세", color: "var(--gold)" },
  { key: "wolse", label: "월세", color: "var(--wine)" },
] as const;

const EMPTY_FILTERS: TradeFilters = {
  dateFrom: "",
  dateTo: "",
  areaGroupKeys: new Set(),
  floorTiers: new Set(),
};

export default function ComplexTabs({ trades }: { trades: Trade[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("sale");
  const [filters, setFilters] = useState<TradeFilters>(EMPTY_FILTERS);

  const areaGroups = useAreaGroups(trades);

  const byType = useMemo(
    () => trades.filter((t) => t.type === tab).sort((a, b) => (a.dealDate < b.dealDate ? -1 : 1)),
    [trades, tab],
  );

  const filtered = useMemo(() => applyFilters(byType, filters, areaGroups), [byType, filters, areaGroups]);

  const activeMeta = TABS.find((t) => t.key === tab)!;

  return (
    <div>
      <div className="tabs">
        {TABS.map((t) => {
          const count = trades.filter((tr) => tr.type === t.key).length;
          return (
            <button
              key={t.key}
              data-kind={t.key}
              className={`tab${tab === t.key ? " active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label} ({count})
            </button>
          );
        })}
      </div>

      <FilterBar filters={filters} onChange={setFilters} areaGroups={areaGroups} resultCount={filtered.length} />

      {tab !== "wolse" && (
        <div className="card" style={{ marginBottom: 20 }}>
          <PriceChart
            data={filtered.map((t) => ({ dealDate: t.dealDate, amount: t.amount }))}
            color={activeMeta.color}
            unitLabel="억"
          />
        </div>
      )}

      <TradeTable trades={filtered} />
    </div>
  );
}
