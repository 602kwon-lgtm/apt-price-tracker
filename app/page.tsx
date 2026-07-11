import Link from "next/link";
import { loadComplexes } from "@/lib/complexes";
import { readTrades } from "@/lib/store";

export default function HomePage() {
  const complexes = loadComplexes();

  return (
    <main>
      <div className="page-heading">
        <h1>🏠 아파트 실거래가 트래커</h1>
        <p>
          국토교통부 실거래가 공개시스템 데이터를 매일 자동으로 가져와
          <br />
          관심 단지의 매매·전세·월세 흐름을 기록합니다.
        </p>
      </div>

      <div className="registry">
        {complexes.map((c, i) => {
          const trades = readTrades(c.id);
          const latestSale = trades.find((t) => t.type === "sale");
          return (
            <Link key={c.id} href={`/complex/${c.id}`} className="registry-item">
              <div className="registry-row">
                <span className="registry-name">
                  <span className="registry-index">{String(i + 1).padStart(2, "0")}</span>
                  {c.name}
                </span>
                <span className="registry-place">
                  📍 {c.sido.replace("특별시", "").replace("광역시", "")} {c.sigungu} {c.dong}
                </span>
              </div>
              <div className="registry-meta">
                <span className="chip">
                  누적 <strong>{trades.length}</strong>건
                </span>
                {latestSale && (
                  <span className="chip chip-jade">
                    💰 최근 매매 <strong>{(latestSale.amount / 10000).toFixed(2)}억</strong> ({latestSale.dealDate})
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
