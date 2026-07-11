"use client";

import { useState } from "react";
import type { Trade } from "@/lib/types";
import PriceChart from "./PriceChart";
import TradeTable from "./TradeTable";

const TABS = [
  { key: "sale", label: "매매", color: "var(--series-sale)" },
  { key: "jeonse", label: "전세", color: "var(--series-jeonse)" },
  { key: "wolse", label: "월세", color: "var(--series-wolse)" },
] as const;

export default function ComplexTabs({ trades }: { trades: Trade[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("sale");

  const filtered = trades
    .filter((t) => t.type === tab)
    .sort((a, b) => (a.dealDate < b.dealDate ? -1 : 1));

  const activeMeta = TABS.find((t) => t.key === tab)!;

  return (
    <div>
      <div className="tabs">
        {TABS.map((t) => {
          const count = trades.filter((tr) => tr.type === t.key).length;
          return (
            <button
              key={t.key}
              className={`tab${tab === t.key ? " active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label} ({count})
            </button>
          );
        })}
      </div>

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
