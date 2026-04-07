import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

import { Header } from "@/components/Header";
import { HeroCarousel } from "@/components/HeroCarousel";
import { RoomsSection } from "@/components/RoomsSection";
import { AboutSection } from "@/components/AboutSection";
import { AttractionsSection } from "@/components/AttractionsSection";
import { AmenitiesSection } from "@/components/AmenitiesSection";
import { OffersSection } from "@/components/OffersSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroCarousel />
        <AboutSection />
        <RoomsSection />
        <AttractionsSection />
        <AmenitiesSection />
        <OffersSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
