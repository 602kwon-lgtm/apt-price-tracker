import Link from "next/link";
import { loadComplexes } from "@/lib/complexes";
import { readTrades } from "@/lib/store";

export default function HomePage() {
  const complexes = loadComplexes();

  return (
    <main>
      <h1>아파트 실거래가 트래커</h1>
      <p className="secondary">
        국토교통부 실거래가 공개시스템 데이터를 매일 자동으로 가져와 관심 단지의 매매·전세·월세 흐름을 보여줍니다.
      </p>

      <div style={{ marginTop: 32 }}>
        {complexes.map((c) => {
          const trades = readTrades(c.id);
          const latest = trades[0];
          return (
            <Link key={c.id} href={`/complex/${c.id}`} className="complex-list-item">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <strong>{c.name}</strong>
                <span className="muted" style={{ fontSize: 13 }}>
                  {c.sido} {c.sigungu} {c.dong}
                </span>
              </div>
              <div style={{ marginTop: 8 }}>
                <span className="badge">누적 {trades.length}건</span>
                {latest && <span className="badge">최근 거래 {latest.dealDate}</span>}
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
