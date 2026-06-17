import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { QRCodeSection } from "@/components/landing/QRCodeSection";
import { About } from "@/components/landing/About";
import { Products } from "@/components/landing/Products";
import { Benefits } from "@/components/landing/Benefits";
import { CTAFinal } from "@/components/landing/CTAFinal";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <QRCodeSection />
        <About />
        <Products />
        <Benefits />
        <CTAFinal />
      </main>
      <Footer />
    </>
  );
}
