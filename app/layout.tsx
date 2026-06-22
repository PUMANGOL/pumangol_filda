import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const pumangolDisplay = localFont({
  src: "../public/logo-font.ttf",
  variable: "--font-pumangol",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pumangol FILDA 2026 | Boa Energia para o seu Negócio",
  description:
    "Plataforma de captação e gestão de leads da Pumangol na FILDA 2026. Frota+, combustíveis, lubrificantes e soluções empresariais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt"
      className={`${montserrat.variable} ${pumangolDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
