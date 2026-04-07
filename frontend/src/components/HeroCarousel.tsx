import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import heroGwarighat from "@/assets/hero-gwarighat.jpg";
import heroDhuandhar from "@/assets/hero-dhuandhar.jpg";
import heroMarbleRocks from "@/assets/hero-marble-rocks.jpg";
import heroFort from "@/assets/hero-fort.jpg";

const slides = [
  {
    image: heroGwarighat,
    title: "Gwarighat",
    subtitle: "Sacred waters of Narmada",
    description: "Experience the spiritual serenity of the holy river",
  },
  {
    image: heroDhuandhar,
    title: "Dhuandhar Falls",
    subtitle: "The smoke cascade",
    description: "Witness nature's raw power and beauty",
  },
  {
    image: heroMarbleRocks,
    title: "Marble Rocks",
    subtitle: "Bhedaghat's wonder",
    description: "Marvel at the stunning white marble cliffs",
  },
  {
    image: heroFort,
    title: "Rani Durgavati Fort",
    subtitle: "Heritage of valour",
    description: "Explore centuries of rich history",
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover scale-105" />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 pt-20">
        <div className="max-w-4xl mx-auto">
          {/* Tagline */}
          <p
            className={`text-gold font-medium tracking-[0.3em] uppercase text-sm mb-4 transition-all duration-700 ${
              isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            }`}
          >
            {slides[currentSlide].subtitle}
          </p>

          {/* Title */}
          <h1
            className={`font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary-foreground font-bold mb-6 text-shadow transition-all duration-700 delay-100 ${
              isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            }`}
          >
            Experience Comfort in the
            <br />
            <span className="text-gold">Heart of Jabalpur</span>
          </h1>

          {/* Description */}
          <p
            className={`text-primary-foreground/90 text-lg md:text-xl max-w-2xl mx-auto mb-8 transition-all duration-700 delay-200 ${
              isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            }`}
          >
            {slides[currentSlide].description}
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300 ${
              isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            }`}
          >
            {isAuthenticated ? (
              <Link to="/rooms">
                <Button
                  size="lg"
                  className="bg-gold hover:bg-gold-dark text-accent-foreground font-medium px-8 py-6 text-base"
                >
                  Book Your Stay
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button
                  size="lg"
                  className="bg-gold hover:bg-gold-dark text-accent-foreground font-medium px-8 py-6 text-base"
                >
                  Sign In
                </Button>
              </Link>
            )}
            <Link to="/rooms">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/50 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 px-8 py-6 text-base w-full sm:w-auto"
              >
                Explore Rooms
              </Button>
            </Link>
          </div>
        </div>

        {/* Arrow Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-card/20 backdrop-blur-sm text-primary-foreground hover:bg-card/40 transition-all duration-300 hidden md:block"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-card/20 backdrop-blur-sm text-primary-foreground hover:bg-card/40 transition-all duration-300 hidden md:block"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
}
