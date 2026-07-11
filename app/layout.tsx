import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "아파트 실거래가 트래커",
  description: "관심 아파트 단지의 매매/전세/월세 실거래가를 매일 업데이트합니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
