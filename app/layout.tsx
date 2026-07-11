import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const nanumSquare = localFont({
  src: [
    { path: "./fonts/NanumSquareL.woff2", weight: "300", style: "normal" },
    { path: "./fonts/NanumSquareR.woff2", weight: "400", style: "normal" },
    { path: "./fonts/NanumSquareB.woff2", weight: "700", style: "normal" },
    { path: "./fonts/NanumSquareEB.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "아파트 실거래가 트래커",
  description: "관심 아파트 단지의 매매/전세/월세 실거래가를 매일 업데이트합니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={nanumSquare.variable}>
      <body>
        <div className="site">
          <header className="masthead">
            <a href="/" className="masthead-brand">
              <span className="seal" aria-hidden="true">🏠</span>
              <span className="masthead-title">아파트 실거래가 트래커</span>
            </a>
            <span className="masthead-tag">📡 국토교통부 공개 데이터 · 매일 자동 갱신</span>
          </header>
          <div className="container">{children}</div>
        </div>
      </body>
    </html>
  );
}
