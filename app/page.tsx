import Benefits from "@/components/Benefits";
import Columns from "@/components/Columns";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import JsonLd from "@/components/JsonLd";
import LatestPosts from "@/components/LatestPosts";
import MediaSection from "@/components/MediaSection";
import Partner from "@/components/Partner";
import Process from "@/components/Process";
import Proof from "@/components/Proof";

export default function Home() {
  return (
    <>
      <JsonLd />
      <Header />
      <main>
        <Hero />
        <MediaSection />
        <Benefits />
        <Process />
        <Proof />
        <Partner />
        <FAQ />
        <Columns />
        <LatestPosts />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
