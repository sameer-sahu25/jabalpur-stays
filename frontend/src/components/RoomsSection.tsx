import { Wifi, Car, Coffee, Wind, Tv, Bath, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/Reveal";

import roomStandard from "@/assets/room-standard.jpg";
import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomPremium from "@/assets/room-premium.jpg";
import roomSuite from "@/assets/room-suite.jpg";

const rooms = [
  {
    id: "standard",
    name: "Standard Room",
    description: "Comfortable and cozy room perfect for solo travelers or couples seeking a peaceful stay.",
    price: 2499,
    image: roomStandard,
    size: "25 sqm",
    bed: "Queen Bed",
    amenities: ["wifi", "ac", "tv"],
    rating: 4.5,
  },
  {
    id: "deluxe",
    name: "Deluxe Room",
    description: "Spacious room with city views, modern amenities and elegant décor for a memorable stay.",
    price: 3999,
    image: roomDeluxe,
    size: "35 sqm",
    bed: "King Bed",
    amenities: ["wifi", "ac", "tv", "breakfast", "parking"],
    rating: 4.7,
  },
  {
    id: "premium",
    name: "Premium Room",
    description: "Luxurious room featuring panoramic views, premium furnishings and exclusive services.",
    price: 5499,
    image: roomPremium,
    size: "45 sqm",
    bed: "King Bed",
    amenities: ["wifi", "ac", "tv", "breakfast", "parking", "bath"],
    rating: 4.8,
  },
  {
    id: "suite",
    name: "Royal Suite",
    description: "The ultimate luxury experience with separate living area, premium amenities and personalized service.",
    price: 8999,
    image: roomSuite,
    size: "65 sqm",
    bed: "King Bed + Sofa",
    amenities: ["wifi", "ac", "tv", "breakfast", "parking", "bath"],
    rating: 4.9,
    featured: true,
  },
];

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  ac: Wind,
  tv: Tv,
  breakfast: Coffee,
  parking: Car,
  bath: Bath,
};

export function RoomsSection() {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <Reveal direction="down" delay={100} className="text-center mb-16">
          <p className="text-gold font-medium tracking-[0.3em] uppercase text-sm mb-3">
            Accommodations
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground font-bold mb-4">
            Our Luxurious Rooms
          </h2>
          <div className="section-divider mt-6" />
          <p className="text-muted-foreground mt-6 max-w-2xl mx-auto">
            Experience comfort and elegance in our carefully designed rooms, each offering 
            stunning views and world-class amenities.
          </p>
        </Reveal>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rooms.map((room, index) => (
            <Reveal
              key={room.id}
              direction="up"
              delay={200 + index * 100}
              className={`room-card bg-card group ${room.featured ? "lg:col-span-2 lg:row-span-2" : ""}`}
            >
              {/* Image */}
              <div className={`relative overflow-hidden ${room.featured ? "h-64 lg:h-96" : "h-56"}`}>
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {room.featured && (
                  <div className="absolute top-4 left-4 bg-gold text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="h-4 w-4 text-gold fill-gold" />
                  <span className="text-sm font-medium">{room.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-serif text-xl font-semibold text-foreground">
                    {room.name}
                  </h3>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {room.description}
                </p>

                {/* Room Details */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span>{room.size}</span>
                  <span>•</span>
                  <span>{room.bed}</span>
                </div>

                {/* Amenities */}
                <div className="flex items-center gap-3 mb-6">
                  {room.amenities.slice(0, 4).map((amenity) => {
                    const Icon = amenityIcons[amenity];
                    return Icon ? (
                      <div
                        key={amenity}
                        className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
                        title={amenity}
                      >
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ) : null;
                  })}
                  {room.amenities.length > 4 && (
                    <span className="text-sm text-muted-foreground">
                      +{room.amenities.length - 4} more
                    </span>
                  )}
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <span className="text-2xl font-serif font-bold text-foreground">
                      ₹{room.price.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground text-sm"> / night</span>
                  </div>
                  <Button
                    variant="outline"
                    className="border-gold text-gold hover:bg-gold hover:text-accent-foreground transition-all"
                    asChild
                  >
                    <Link to="/hotels">Book Now</Link>
                  </Button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            asChild
          >
            <Link to="/rooms">View All Rooms</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
