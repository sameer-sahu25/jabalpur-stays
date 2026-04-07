import { Award, Users, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Parallax } from "@/components/Parallax";
import { Reveal } from "@/components/Reveal";
import { MagneticButton } from "@/components/MagneticButton";
import aboutLobby from "@/assets/about-lobby.jpg";
import aboutPool from "@/assets/about-pool.jpg";
import aboutRestaurant from "@/assets/about-restaurant.jpg";
import aboutRoom from "@/assets/about-room.jpg";

const stats = [
  { icon: Award, value: "15+", label: "Years of Excellence" },
  { icon: Users, value: "50K+", label: "Happy Guests" },
  { icon: Clock, value: "24/7", label: "Service Available" },
  { icon: MapPin, value: "4", label: "Nearby Attractions" },
];

export function AboutSection() {
  return (
    <section className="py-20 bg-secondary/30 relative overflow-hidden">
      {/* Background Layer */}
      <Parallax speed={-0.2} className="absolute inset-0 z-0">
        <div className="w-full h-full opacity-5 bg-[radial-gradient(circle_at_center,_var(--gold)_1px,_transparent_1px)] bg-[size:40px_40px]" />
      </Parallax>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content - Mid-ground Layer */}
          <Parallax speed={0.1} className="order-2 lg:order-1">
            <Reveal direction="left" delay={200}>
              <p className="text-gold font-medium tracking-[0.3em] uppercase text-sm mb-3">
                About Us
              </p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground font-bold mb-6">
                Welcome to Narmada Retreat
              </h2>
              <div className="section-divider ml-0 mb-6" />
              
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Nestled in the heart of Jabalpur, Madhya Pradesh, Narmada Retreat offers 
                  an unparalleled hospitality experience. Our hotel combines the rich cultural 
                  heritage of the region with modern luxury amenities.
                </p>
                <p>
                  Whether you're here to explore the magnificent Marble Rocks, witness the 
                  thundering Dhuandhar Falls, or seek spiritual solace at Gwarighat, our 
                  hotel serves as the perfect base for your adventures.
                </p>
                <p>
                  With beautifully appointed rooms, world-class dining, and personalized 
                  service, we ensure every moment of your stay is memorable.
                </p>
              </div>

              <div className="mt-8">
                <MagneticButton>
                  <Button
                    size="lg"
                    className="bg-gold hover:bg-gold-dark text-accent-foreground"
                  >
                    Discover More
                  </Button>
                </MagneticButton>
              </div>
            </Reveal>
          </Parallax>

          {/* Image Grid */}
          <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-lg">
                <img
                  src={aboutLobby}
                  alt="Hotel lobby"
                  className="w-full h-full object-cover img-zoom"
                />
              </div>
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
                <img
                  src={aboutPool}
                  alt="Pool area"
                  className="w-full h-full object-cover img-zoom"
                />
              </div>
            </div>
            <div className="pt-8 space-y-4">
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
                <img
                  src={aboutRestaurant}
                  alt="Restaurant"
                  className="w-full h-full object-cover img-zoom"
                />
              </div>
              <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-lg">
                <img
                  src={aboutRoom}
                  alt="Room interior"
                  className="w-full h-full object-cover img-zoom"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-border">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-7 w-7 text-gold" />
              </div>
              <div className="font-serif text-3xl font-bold text-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
