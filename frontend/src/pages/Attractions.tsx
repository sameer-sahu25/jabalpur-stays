import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Navigation } from "lucide-react";
import { GlowEffect } from "@/components/GlowEffect";
import heroGwarighat from "@/assets/hero-gwarighat.jpg";
import heroDhuandhar from "@/assets/hero-dhuandhar.jpg";
import heroMarbleRocks from "@/assets/hero-marble-rocks.jpg";
import heroFort from "@/assets/hero-fort.jpg";
const attractions = [{
  id: 1,
  name: "Dhuandhar Falls",
  description: "The 'Smoke Cascade' where the mighty Narmada plunges through marble rocks, creating a spectacular misty waterfall. The name literally means 'smoke cascade' because of the mist created by the water crashing against rocks.",
  fullDescription: "One of India's most spectacular waterfalls, Dhuandhar Falls is a must-visit destination. The roaring waters create a thunderous sound that can be heard from miles away. Best visited during monsoon season when the falls are at their most majestic.",
  image: heroDhuandhar,
  distance: "25 km",
  duration: "45 mins",
  bestTime: "July - October",
  timings: "6:00 AM - 6:00 PM",
  entryFee: "₹25 per person",
  featured: true
}, {
  id: 2,
  name: "Marble Rocks Bhedaghat",
  description: "Stunning 100-feet marble cliffs along the Narmada river, offering magical boat rides especially during moonlit nights.",
  fullDescription: "The towering marble rocks on either side of the Narmada create a breathtaking gorge. Boat rides through the gorge, especially during full moon nights, offer an ethereal experience as the moonlight reflects off the white marble.",
  image: heroMarbleRocks,
  distance: "22 km",
  duration: "40 mins",
  bestTime: "October - March",
  timings: "7:00 AM - 5:30 PM",
  entryFee: "Boat ride ₹100/person",
  featured: true
}, {
  id: 3,
  name: "Gwarighat",
  description: "Sacred bathing ghat on the banks of Narmada river, known for its spiritual significance and beautiful evening aarti ceremony.",
  fullDescription: "One of the most sacred ghats on the Narmada, Gwarighat is a center of religious activity. The evening aarti ceremony is a spectacular sight with thousands of diyas floating on the river waters.",
  image: heroGwarighat,
  distance: "5 km",
  duration: "15 mins",
  bestTime: "Year round",
  timings: "Open 24 hours",
  entryFee: "Free",
  featured: false
}, {
  id: 4,
  name: "Rani Durgavati Fort",
  description: "Historic fort dedicated to the brave Gond queen, offering panoramic views and rich historical significance.",
  fullDescription: "Built in the 16th century, this fort was the stronghold of the legendary Gond queen Rani Durgavati. The fort offers stunning views of the surrounding landscape and houses a museum dedicated to the queen's legacy.",
  image: heroFort,
  distance: "15 km",
  duration: "30 mins",
  bestTime: "October - March",
  timings: "10:00 AM - 5:00 PM",
  entryFee: "₹20 per person",
  featured: false
}, {
  id: 5,
  name: "Chausath Yogini Temple",
  description: "Ancient 10th century circular temple dedicated to 64 yoginis, showcasing remarkable architecture and spiritual energy.",
  fullDescription: "One of the few circular temples in India, Chausath Yogini Temple is dedicated to 64 female deities. The temple's unique architecture and serene atmosphere make it a significant archaeological and spiritual site.",
  image: heroFort,
  distance: "20 km",
  duration: "35 mins",
  bestTime: "Year round",
  timings: "6:00 AM - 6:00 PM",
  entryFee: "Free",
  featured: false
}, {
  id: 6,
  name: "Balancing Rock",
  description: "A geological marvel where a massive rock balances perfectly on a smaller rock formation, defying gravity.",
  fullDescription: "Located near Madan Mahal, this incredible natural phenomenon features a large boulder delicately balanced on a smaller rock. It has withstood earthquakes and is a testament to the wonders of nature.",
  image: heroMarbleRocks,
  distance: "8 km",
  duration: "20 mins",
  bestTime: "Year round",
  timings: "6:00 AM - 7:00 PM",
  entryFee: "Free",
  featured: false
}];
export default function Attractions() {
  const handleGetDirections = (locationName: string) => {
    try {
      const query = encodeURIComponent(`${locationName} Jabalpur Madhya Pradesh`);
      const url = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
      
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        throw new Error('Pop-up blocked or window could not be opened');
      }
    } catch (error) {
      console.error('Error opening Google Maps:', error);
      alert('Unable to open Google Maps. Please check your browser settings or try again later.');
    }
  };

  const featuredAttractions = attractions.filter(a => a.featured);
  const otherAttractions = attractions.filter(a => !a.featured);
  return <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gold font-medium tracking-[0.3em] uppercase text-sm mb-3">
            Explore Jabalpur
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary-foreground font-bold mb-4">
            Nearby Attractions
          </h1>
          <div className="w-16 h-1 mx-auto bg-gold mt-6" />
          <p className="text-primary-foreground/80 mt-6 max-w-2xl mx-auto">
            Discover the natural wonders, historical monuments, and spiritual sites 
            that make Jabalpur a unique destination
          </p>
        </div>
      </section>

      {/* Featured Attractions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-8">Must-Visit Destinations</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {featuredAttractions.map(attraction => (
              <GlowEffect key={attraction.id} className="rounded-xl bg-card border border-border shadow-lg">
                <div className="group flex flex-col h-full">
                  <div className="relative h-72 overflow-hidden">
                    <img src={attraction.image} alt={attraction.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 left-4 bg-gold text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-2">{attraction.name}</h3>
                    <p className="text-muted-foreground mb-4">{attraction.fullDescription}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gold" />
                        <span className="text-muted-foreground">{attraction.distance} from hotel</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gold" />
                        <span className="text-muted-foreground">{attraction.duration} drive</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Navigation className="h-4 w-4 text-gold" />
                        <span className="text-muted-foreground">Best: {attraction.bestTime}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Entry: {attraction.entryFee}
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gold hover:bg-gold-dark text-accent-foreground"
                      onClick={() => handleGetDirections(attraction.name)}
                      aria-label={`Get directions to ${attraction.name}`}
                    >
                      Get Directions
                      <Navigation className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </GlowEffect>
            ))}
          </div>
        </div>
      </section>

      {/* Other Attractions */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-8">More Places to Explore</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherAttractions.map(attraction => (
              <GlowEffect key={attraction.id} className="rounded-xl bg-card border border-border shadow-lg">
                <div className="group flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img src={attraction.image} alt={attraction.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-serif text-lg font-bold text-primary-foreground">{attraction.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                        <MapPin className="h-3 w-3" />
                        <span>{attraction.distance}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{attraction.description}</p>
                    <div className="flex justify-between text-xs text-muted-foreground mb-4">
                      <span>{attraction.timings}</span>
                      <span>{attraction.entryFee}</span>
                    </div>
                    <div className="mt-auto">
                      <Button 
                        variant="outline"
                        className="w-full border-gold text-gold hover:bg-gold hover:text-accent-foreground transition-colors"
                        onClick={() => handleGetDirections(attraction.name)}
                        aria-label={`Get directions to ${attraction.name}`}
                      >
                        Get Directions
                        <Navigation className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </GlowEffect>
            ))}
          </div>
        </div>
      </section>

      {/* Tour Package CTA */}
      

      <Footer />
    </div>;
}