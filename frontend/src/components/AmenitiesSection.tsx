import { 
  Wifi, 
  Car, 
  Coffee, 
  Waves, 
  Utensils, 
  Dumbbell,
  Sparkles,
  Clock,
  Shield,
  Heart
} from "lucide-react";
import { Reveal } from "@/components/Reveal";

const amenities = [
  {
    icon: Wifi,
    title: "High-Speed WiFi",
    description: "Complimentary high-speed internet throughout the property",
  },
  {
    icon: Utensils,
    title: "Fine Dining",
    description: "Multi-cuisine restaurant serving local and international dishes",
  },
  {
    icon: Waves,
    title: "Swimming Pool",
    description: "Temperature-controlled pool with poolside service",
  },
  {
    icon: Sparkles,
    title: "Spa & Wellness",
    description: "Rejuvenating spa treatments and wellness programs",
  },
  {
    icon: Car,
    title: "Valet Parking",
    description: "Complimentary valet parking for all guests",
  },
  {
    icon: Dumbbell,
    title: "Fitness Center",
    description: "State-of-the-art gym equipment available 24/7",
  },
  {
    icon: Coffee,
    title: "Room Service",
    description: "In-room dining available round the clock",
  },
  {
    icon: Clock,
    title: "24/7 Concierge",
    description: "Dedicated concierge to assist with all your needs",
  },
  {
    icon: Shield,
    title: "Security",
    description: "24-hour security and CCTV surveillance",
  },
  {
    icon: Heart,
    title: "Tour Assistance",
    description: "Curated local tours and travel arrangements",
  },
];

export function AmenitiesSection() {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <Reveal direction="down" delay={100} className="text-center mb-16">
          <p className="text-gold font-medium tracking-[0.3em] uppercase text-sm mb-3">
            World-Class Facilities
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground font-bold mb-4">
            Hotel Amenities
          </h2>
          <div className="section-divider mt-6" />
          <p className="text-muted-foreground mt-6 max-w-2xl mx-auto">
            Enjoy our comprehensive range of amenities designed to make 
            your stay comfortable and memorable.
          </p>
        </Reveal>

        {/* Amenities Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {amenities.map((amenity, index) => (
            <Reveal
              key={index}
              direction="up"
              delay={200 + index * 50}
              className="group p-6 rounded-xl bg-card border border-border hover:border-gold/30 hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors">
                <amenity.icon className="h-7 w-7 text-gold" />
              </div>
              <h3 className="font-medium text-foreground mb-2">{amenity.title}</h3>
              <p className="text-xs text-muted-foreground">{amenity.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
