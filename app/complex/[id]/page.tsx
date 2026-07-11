import Link from "next/link";
import { notFound } from "next/navigation";
import { getComplex, loadComplexes } from "@/lib/complexes";
import { readTrades } from "@/lib/store";
import ComplexTabs from "@/components/ComplexTabs";

export function generateStaticParams() {
  return loadComplexes().map((c) => ({ id: c.id }));
}

function latestOf(trades: ReturnType<typeof readTrades>, type: "sale" | "jeonse" | "wolse") {
  return trades.find((t) => t.type === type);
}

export default function ComplexPage({ params }: { params: { id: string } }) {
  const complex = getComplex(params.id);
  if (!complex) notFound();

  const trades = readTrades(complex.id);
  const latestSale = latestOf(trades, "sale");
  const latestJeonse = latestOf(trades, "jeonse");
  const latestWolse = latestOf(trades, "wolse");

  return (
    <main>
      <Link href="/" className="back-link">
        ← 전체 단지
      </Link>

      <div className="detail-heading">
        <h1>{complex.name}</h1>
        <p className="place">
          {complex.sido} {complex.sigungu} {complex.dong}
        </p>
      </div>

      <div className="hero-stats">
        <div className="hero-stat">
          <div className="label">최근 매매</div>
          <div className="value" style={{ color: "var(--jade)" }}>
            {latestSale ? (latestSale.amount / 10000).toFixed(2) : "-"}
            <span className="unit">억 · {latestSale?.dealDate ?? "거래 없음"}</span>
          </div>
        </div>
        <div className="hero-stat">
          <div className="label">최근 전세</div>
          <div className="value" style={{ color: "var(--gold)" }}>
            {latestJeonse ? (latestJeonse.amount / 10000).toFixed(2) : "-"}
            <span className="unit">억 · {latestJeonse?.dealDate ?? "거래 없음"}</span>
          </div>
        </div>
        <div className="hero-stat">
          <div className="label">최근 월세</div>
          <div className="value" style={{ color: "var(--wine)" }}>
            {latestWolse ? `${(latestWolse.amount / 10000).toFixed(1)}/${latestWolse.monthlyRent}` : "-"}
            <span className="unit">{latestWolse ? `만원 · ${latestWolse.dealDate}` : "거래 없음"}</span>
          </div>
        </div>
      </div>

      <ComplexTabs trades={trades} />
    </main>
  );
}
