import type { Metadata } from "next";
import { Gowun_Batang, Gowun_Dodum, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Gowun_Batang({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display",
});

const body = Gowun_Dodum({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-body",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "아파트 실거래가 트래커",
  description: "관심 아파트 단지의 매매/전세/월세 실거래가를 매일 업데이트합니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <div className="site">
          <header className="masthead">
            <a href="/" className="masthead-brand">
              <span className="seal" aria-hidden="true">
                <svg viewBox="0 0 32 32" width="28" height="28">
                  <rect x="2" y="2" width="28" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M9 21 L16 9 L23 21 Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <line x1="9" y1="21" x2="23" y2="21" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </span>
              <span className="masthead-title">실거래가 帖</span>
            </a>
            <span className="masthead-tag">국토교통부 공개 데이터 · 매일 자동 갱신</span>
          </header>
          <div className="container">{children}</div>
        </div>
      </body>
    </html>
  );
}
