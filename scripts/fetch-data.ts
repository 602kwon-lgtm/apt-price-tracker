import { loadComplexes } from "../lib/complexes";
import { fetchSaleTrades, fetchRentTrades, recentYearMonths } from "../lib/molit";
import { mergeAndWriteTrades } from "../lib/store";

const FULL_BACKFILL_START_YM = "200601"; // 실거래가 공개 시작 시점

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseMonthsBack(): string[] {
  const isFull = process.argv.includes("--full");
  if (isFull) {
    const months: string[] = [];
    const now = new Date();
    const cursor = new Date(now.getFullYear(), now.getMonth(), 1);
    const startYear = Number(FULL_BACKFILL_START_YM.slice(0, 4));
    const startMonth = Number(FULL_BACKFILL_START_YM.slice(4, 6));
    while (cursor.getFullYear() > startYear || (cursor.getFullYear() === startYear && cursor.getMonth() + 1 >= startMonth)) {
      months.push(`${cursor.getFullYear()}${String(cursor.getMonth() + 1).padStart(2, "0")}`);
      cursor.setMonth(cursor.getMonth() - 1);
    }
    return months;
  }

  const monthsArg = process.argv.find((a) => a.startsWith("--months="));
  const count = monthsArg ? Number(monthsArg.split("=")[1]) : Number(process.env.BACKFILL_MONTHS ?? 3);
  return recentYearMonths(count);
}

async function main() {
  const serviceKey = process.env.MOLIT_API_KEY;
  if (!serviceKey) {
    throw new Error("MOLIT_API_KEY 환경변수가 설정되어 있지 않습니다. .env 파일을 확인하세요.");
  }

  const complexes = loadComplexes();
  const yearMonths = parseMonthsBack();

  console.log(`대상 단지 ${complexes.length}개, 조회 기간 ${yearMonths.length}개월 (${yearMonths.at(-1)} ~ ${yearMonths[0]})`);

  for (const complex of complexes) {
    console.log(`\n[${complex.name}] (${complex.sigungu} ${complex.dong}, LAWD_CD=${complex.lawdCd}) 수집 시작`);
    const allTrades = [];

    for (const ym of yearMonths) {
      try {
        const [sale, rent] = await Promise.all([
          fetchSaleTrades(serviceKey, complex.lawdCd, ym, complex.aptNameKeyword),
          fetchRentTrades(serviceKey, complex.lawdCd, ym, complex.aptNameKeyword),
        ]);
        allTrades.push(...sale, ...rent);
        if (sale.length || rent.length) {
          console.log(`  ${ym}: 매매 ${sale.length}건, 전월세 ${rent.length}건`);
        }
      } catch (err) {
        console.error(`  ${ym}: 조회 실패 -`, (err as Error).message);
      }
      await sleep(250); // API 과호출 방지
    }

    const { total, added } = mergeAndWriteTrades(complex.id, allTrades);
    console.log(`[${complex.name}] 완료: 신규 ${added}건 추가, 누적 ${total}건 저장`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
