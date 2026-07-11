import Link from "next/link";
import { notFound } from "next/navigation";
import { getComplex, loadComplexes } from "@/lib/complexes";
import { readTrades } from "@/lib/store";
import ComplexTabs from "@/components/ComplexTabs";

export function generateStaticParams() {
  return loadComplexes().map((c) => ({ id: c.id }));
}

export default function ComplexPage({ params }: { params: { id: string } }) {
  const complex = getComplex(params.id);
  if (!complex) notFound();

  const trades = readTrades(complex.id);

  return (
    <main>
      <Link href="/" className="muted" style={{ fontSize: 14 }}>
        ← 전체 단지 목록
      </Link>
      <h1 style={{ marginBottom: 4 }}>{complex.name}</h1>
      <p className="secondary" style={{ marginTop: 0 }}>
        {complex.sido} {complex.sigungu} {complex.dong}
      </p>

      <div style={{ marginTop: 24 }}>
        <ComplexTabs trades={trades} />
      </div>
    </main>
  );
}
