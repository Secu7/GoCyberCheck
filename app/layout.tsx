import "./globals.css";
import type { Metadata } from "next";
import TurnstileScript from "@/components/turnstile-script";

// (옵션) Next 템플릿 폰트 — 템플릿 기준으로 유지
import { Geist, Geist_Mono } from "next/font/google";
const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "GoCyberCheck",
  description: "PIPEDA Quick-Check",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans?.variable ?? ""} ${geistMono?.variable ?? ""} antialiased`}>
        <TurnstileScript />
        {children}
      </body>
    </html>
  );
}
