"use client";

import { useMemo, useState } from "react";
import type { Trade } from "@/lib/types";

type SortKey = "dealDate" | "excluUseAr" | "floor" | "amount" | "monthlyRent";

function formatManwon(n: number): string {
  return n.toLocaleString("ko-KR");
}

export default function TradeTable({ trades }: { trades: Trade[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("dealDate");
  const [asc, setAsc] = useState(false);

  const sorted = useMemo(() => {
    const copy = [...trades];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === bv) return 0;
      const cmp = av < bv ? -1 : 1;
      return asc ? cmp : -cmp;
    });
    return copy;
  }, [trades, sortKey, asc]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setAsc(!asc);
    } else {
      setSortKey(key);
      setAsc(false);
    }
  }

  if (trades.length === 0) {
    return <p className="empty-state">아직 수집된 거래 내역이 없습니다.</p>;
  }

  const hasRent = trades.some((t) => t.type === "wolse");

  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => toggleSort("dealDate")}>계약일{sortKey === "dealDate" ? (asc ? " ▲" : " ▼") : ""}</th>
          <th onClick={() => toggleSort("excluUseAr")}>전용면적(㎡){sortKey === "excluUseAr" ? (asc ? " ▲" : " ▼") : ""}</th>
          <th onClick={() => toggleSort("floor")}>층{sortKey === "floor" ? (asc ? " ▲" : " ▼") : ""}</th>
          <th onClick={() => toggleSort("amount")}>
            {trades[0].type === "sale" ? "거래금액" : "보증금"}(만원){sortKey === "amount" ? (asc ? " ▲" : " ▼") : ""}
          </th>
          {hasRent && (
            <th onClick={() => toggleSort("monthlyRent")}>월세(만원){sortKey === "monthlyRent" ? (asc ? " ▲" : " ▼") : ""}</th>
          )}
        </tr>
      </thead>
      <tbody>
        {sorted.map((t, i) => (
          <tr key={i}>
            <td>{t.dealDate}</td>
            <td>{t.excluUseAr}</td>
            <td>{t.floor}</td>
            <td>{formatManwon(t.amount)}</td>
            {hasRent && <td>{t.monthlyRent > 0 ? formatManwon(t.monthlyRent) : "-"}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
