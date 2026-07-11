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

  const naverUrl =
    complex.naverLandUrl ?? `https://search.naver.com/search.naver?query=${encodeURIComponent(`${complex.name} 아파트 시세`)}`;
  const kbUrl =
    complex.kbLandUrl ?? `https://search.naver.com/search.naver?query=${encodeURIComponent(`${complex.name} KB부동산 시세`)}`;
  const walkMapUrl =
    complex.address && complex.nearestStation
      ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(complex.address)}&destination=${encodeURIComponent(complex.nearestStation)}&travelmode=walking`
      : undefined;

  return (
    <main>
      <Link href="/" className="back-link">
        ← 전체 단지
      </Link>

      <div className="detail-heading">
        <h1>{complex.name}</h1>
        <p className="place">
          📍 {complex.sido} {complex.sigungu} {complex.dong}
          {complex.nearestStation && complex.walkMinutes && (
            <>
              {" "}
              · 🚇 {complex.nearestStation} 도보 {complex.walkMinutes}분
              {walkMapUrl && (
                <>
                  {" "}
                  (
                  <a href={walkMapUrl} target="_blank" rel="noopener noreferrer">
                    구글맵 경로
                  </a>
                  )
                </>
              )}
            </>
          )}
        </p>
      </div>

      <div className="hero-stats">
        <div className="hero-stat sale">
          <div className="label">🏢 최근 매매</div>
          <div className="value" style={{ color: "var(--jade)" }}>
            {latestSale ? (latestSale.amount / 10000).toFixed(2) : "-"}
            <span className="unit">
              억 · {latestSale?.dealDate ?? "거래 없음"}
              {latestSale && ` · ${latestSale.excluUseAr}㎡`}
            </span>
          </div>
        </div>
        <div className="hero-stat jeonse">
          <div className="label">🔑 최근 전세</div>
          <div className="value" style={{ color: "var(--gold)" }}>
            {latestJeonse ? (latestJeonse.amount / 10000).toFixed(2) : "-"}
            <span className="unit">
              억 · {latestJeonse?.dealDate ?? "거래 없음"}
              {latestJeonse && ` · ${latestJeonse.excluUseAr}㎡`}
            </span>
          </div>
        </div>
        <div className="hero-stat wolse">
          <div className="label">🏡 최근 월세</div>
          <div className="value" style={{ color: "var(--wine)" }}>
            {latestWolse ? `${(latestWolse.amount / 10000).toFixed(1)}/${latestWolse.monthlyRent}` : "-"}
            <span className="unit">
              {latestWolse ? `만원 · ${latestWolse.dealDate} · ${latestWolse.excluUseAr}㎡` : "거래 없음"}
            </span>
          </div>
        </div>
      </div>

      <div className="ext-links">
        <a className="ext-link" href={naverUrl} target="_blank" rel="noopener noreferrer">
          🟢 네이버 부동산에서 보기
        </a>
        <a className="ext-link" href={kbUrl} target="_blank" rel="noopener noreferrer">
          🔵 KB부동산에서 보기
        </a>
      </div>

      {(complex.pros?.length || complex.cons?.length) && (
        <div className="side-info">
          {complex.pros && complex.pros.length > 0 && (
            <div className="card pros-cons-card pros">
              <h3>👍 장점</h3>
              <ul>
                {complex.pros.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}
          {complex.cons && complex.cons.length > 0 && (
            <div className="card pros-cons-card cons">
              <h3>👎 단점</h3>
              <ul>
                {complex.cons.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <ComplexTabs trades={trades} />
    </main>
  );
}
