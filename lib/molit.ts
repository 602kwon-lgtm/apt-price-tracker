import { XMLParser } from "fast-xml-parser";
import type { Trade, TradeType } from "./types";

const TRADE_URL =
  "http://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade";
const RENT_URL =
  "http://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent";

const parser = new XMLParser({ ignoreAttributes: true, trimValues: true });

function toNumber(v: unknown): number {
  if (v === undefined || v === null) return 0;
  const n = Number(String(v).replace(/,/g, "").trim());
  return Number.isNaN(n) ? 0 : n;
}

function toItemArray(items: unknown): Record<string, unknown>[] {
  if (!items) return [];
  return Array.isArray(items) ? (items as Record<string, unknown>[]) : [items as Record<string, unknown>];
}

async function callApi(
  baseUrl: string,
  serviceKey: string,
  lawdCd: string,
  dealYmd: string,
): Promise<Record<string, unknown>[]> {
  const url = `${baseUrl}?${new URLSearchParams({
    serviceKey,
    LAWD_CD: lawdCd,
    DEAL_YMD: dealYmd,
    numOfRows: "1000",
    pageNo: "1",
  }).toString()}`;

  const res = await fetch(url);
  const xml = await res.text();
  const parsed = parser.parse(xml);

  const header = parsed?.response?.header;
  const resultCode = header?.resultCode;
  const SUCCESS_CODES = new Set(["00", "000", "0"]);
  if (resultCode !== undefined && !SUCCESS_CODES.has(String(resultCode))) {
    throw new Error(
      `MOLIT API error (${lawdCd}/${dealYmd}): ${resultCode} ${header?.resultMsg ?? ""} ${
        xml.length < 500 ? xml : ""
      }`,
    );
  }

  const items = parsed?.response?.body?.items?.item;
  return toItemArray(items);
}

function normalize(s: string): string {
  return s.replace(/\s+/g, "").toLowerCase();
}

export function matchesComplex(aptNm: string, keyword: string, excludeKeyword?: string): boolean {
  const normalized = normalize(String(aptNm));
  if (!normalized.includes(normalize(keyword))) return false;
  if (excludeKeyword && normalized.includes(normalize(excludeKeyword))) return false;
  return true;
}

export async function fetchSaleTrades(
  serviceKey: string,
  lawdCd: string,
  dealYmd: string,
  aptNameKeyword: string,
  excludeKeyword?: string,
): Promise<Trade[]> {
  const items = await callApi(TRADE_URL, serviceKey, lawdCd, dealYmd);
  const filtered = items.filter((it) => matchesComplex(String(it.aptNm ?? ""), aptNameKeyword, excludeKeyword));

  return filtered.map((it) => {
    const y = String(it.dealYear).padStart(4, "0");
    const m = String(it.dealMonth).padStart(2, "0");
    const d = String(it.dealDay).padStart(2, "0");
    return {
      type: "sale" as TradeType,
      aptNm: String(it.aptNm ?? "").trim(),
      dong: String(it.umdNm ?? "").trim(),
      jibun: String(it.jibun ?? "").trim(),
      excluUseAr: toNumber(it.excluUseAr),
      floor: toNumber(it.floor),
      buildYear: toNumber(it.buildYear),
      dealDate: `${y}-${m}-${d}`,
      amount: toNumber(it.dealAmount),
      monthlyRent: 0,
    };
  });
}

export async function fetchRentTrades(
  serviceKey: string,
  lawdCd: string,
  dealYmd: string,
  aptNameKeyword: string,
  excludeKeyword?: string,
): Promise<Trade[]> {
  const items = await callApi(RENT_URL, serviceKey, lawdCd, dealYmd);
  const filtered = items.filter((it) => matchesComplex(String(it.aptNm ?? ""), aptNameKeyword, excludeKeyword));

  return filtered.map((it) => {
    const y = String(it.dealYear).padStart(4, "0");
    const m = String(it.dealMonth).padStart(2, "0");
    const d = String(it.dealDay).padStart(2, "0");
    const monthlyRent = toNumber(it.monthlyRent);
    return {
      type: (monthlyRent > 0 ? "wolse" : "jeonse") as TradeType,
      aptNm: String(it.aptNm ?? "").trim(),
      dong: String(it.umdNm ?? "").trim(),
      jibun: String(it.jibun ?? "").trim(),
      excluUseAr: toNumber(it.excluUseAr),
      floor: toNumber(it.floor),
      buildYear: toNumber(it.buildYear),
      dealDate: `${y}-${m}-${d}`,
      amount: toNumber(it.deposit),
      monthlyRent,
      contractTerm: it.contractTerm ? String(it.contractTerm) : undefined,
      contractType: it.contractType ? String(it.contractType) : undefined,
    };
  });
}

/** YYYYMM 형식 문자열 목록 (최신월 -> 과거월 순) */
export function recentYearMonths(count: number, from = new Date()): string[] {
  const result: string[] = [];
  const d = new Date(from.getFullYear(), from.getMonth(), 1);
  for (let i = 0; i < count; i++) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    result.push(`${y}${m}`);
    d.setMonth(d.getMonth() - 1);
  }
  return result;
}
