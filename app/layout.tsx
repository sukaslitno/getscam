import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Getscam — Проверка номера телефона",
  description: "Узнай, кто звонил и можно ли ему доверять. Проверка номера по базам данных.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${manrope.variable} antialiased`}>
      <body className="min-h-screen font-[var(--font-manrope)]">{children}</body>
    </html>
  );
}
