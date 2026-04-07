import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import heroGwarighat from "@/assets/hero-gwarighat.jpg";
import heroDhuandhar from "@/assets/hero-dhuandhar.jpg";
import heroMarbleRocks from "@/assets/hero-marble-rocks.jpg";
import heroFort from "@/assets/hero-fort.jpg";

const attractions = [
  {
    id: 1,
    name: "Gwarighat",
    description: "Sacred bathing ghat on the banks of Narmada river, known for its spiritual significance and beautiful evening aarti ceremony.",
    image: heroGwarighat,
    distance: "5 km",
    duration: "15 mins",
  },
  {
    id: 2,
    name: "Dhuandhar Falls",
    description: "The 'Smoke Cascade' where the mighty Narmada plunges through marble rocks, creating a spectacular misty waterfall.",
    image: heroDhuandhar,
    distance: "25 km",
    duration: "45 mins",
  },
  {
    id: 3,
    name: "Marble Rocks Bhedaghat",
    description: "Stunning 100-feet marble cliffs along the Narmada river, offering magical boat rides especially during moonlit nights.",
    image: heroMarbleRocks,
    distance: "22 km",
    duration: "40 mins",
  },
  {
    id: 4,
    name: "Rani Durgavati Fort",
    description: "Historic fort dedicated to the brave Gond queen, offering panoramic views and rich historical significance.",
    image: heroFort,
    distance: "15 km",
    duration: "30 mins",
  },
];

export function AttractionsSection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-gold font-medium tracking-[0.3em] uppercase text-sm mb-3">
            Explore Jabalpur
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground font-bold mb-4">
            Nearby Attractions
          </h2>
          <div className="section-divider mt-6" />
          <p className="text-muted-foreground mt-6 max-w-2xl mx-auto">
            Discover the natural wonders and rich heritage of Jabalpur, 
            all within easy reach from our hotel.
          </p>
        </div>

        {/* Attractions Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {attractions.map((attraction, index) => (
            <div
              key={attraction.id}
              className={`group relative overflow-hidden rounded-xl ${
                index === 0 ? "md:row-span-2" : ""
              }`}
            >
              <div className={`relative ${index === 0 ? "h-full min-h-[500px]" : "h-64"}`}>
                <img
                  src={attraction.image}
                  alt={attraction.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 text-gold mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{attraction.distance} • {attraction.duration}</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-primary-foreground mb-2">
                    {attraction.name}
                  </h3>
                  <p className="text-primary-foreground/80 text-sm mb-4 line-clamp-2">
                    {attraction.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary-foreground/50 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 group-hover:border-gold group-hover:text-gold transition-all active:scale-95"
                    onClick={() => navigate("/attractions")}
                    role="link"
                    tabIndex={0}
                    aria-label={`Learn more about ${attraction.name}`}
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
