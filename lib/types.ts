export type TradeType = "sale" | "jeonse" | "wolse";

export interface Trade {
  type: TradeType;
  aptNm: string;
  dong: string;
  jibun: string;
  excluUseAr: number;
  floor: number;
  buildYear: number;
  dealDate: string; // YYYY-MM-DD
  /** 매매: 거래금액(만원) / 전월세: 보증금(만원) */
  amount: number;
  /** 월세(만원). 매매/전세는 0 */
  monthlyRent: number;
  contractTerm?: string;
  contractType?: string;
}

export interface ComplexConfig {
  id: string;
  name: string;
  aptNameKeyword: string;
  sido: string;
  sigungu: string;
  dong: string;
  lawdCd: string;
  pros?: string[];
  cons?: string[];
  naverLandUrl?: string;
  kbLandUrl?: string;
}
