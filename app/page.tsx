import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { QRCodeSection } from "@/components/landing/QRCodeSection";
import { About } from "@/components/landing/About";
import { Products } from "@/components/landing/Products";
import { Benefits } from "@/components/landing/Benefits";
import { CTAFinal } from "@/components/landing/CTAFinal";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();
  const isLoggedIn = !!session;

  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex-1">
        <Hero isLoggedIn={isLoggedIn} />
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
