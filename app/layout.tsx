import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "sonner";
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
  title: "Pumangol FILDA 2026",
  description: "Sistema de captação e qualificação de leads comerciais",
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
      <body className="min-h-full flex flex-col font-sans">
          {children}
          <Toaster position="bottom-right" richColors toastOptions={{ className: "font-sans" }} />
        </body>
    </html>
  );
}
