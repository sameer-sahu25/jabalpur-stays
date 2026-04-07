import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Star, MapPin, X, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Hotel {
  id: number;
  name: string;
  rating: string | number;
  address: string;
  area: string;
  description: string;
  amenities: string[];
  imageUrl: string;
}

export default function Hotels() {
  const [searchQuery, setSearchQuery] = useState("");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadHotels();
  }, []);

  async function loadHotels() {
    try {
      setIsLoading(true);
      const response = await fetchApi("/hotels?limit=100");
      console.log("Hotels data:", response);
      
      if (response && response.data && Array.isArray(response.data.hotels)) {
        setHotels(response.data.hotels);
      } else if (Array.isArray(response)) {
        setHotels(response);
      } else {
        console.warn("Unexpected API response format:", response);
        setHotels([]);
      }
    } catch (error) {
      console.error("Failed to load hotels:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load hotels. Please check if the backend is running.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Filter hotels based on search query
  const filteredHotels = hotels.filter(hotel => 
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Search Section */}
      <section className="relative h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80"
          alt="Hotels"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="font-serif text-3xl md:text-4xl text-primary-foreground font-bold mb-8">
            The Best Hotels in Jabalpur
          </h1>
          
          {/* Search Bar */}
          <div className="w-full max-w-4xl px-4">
            <div className="bg-card rounded-lg shadow-lg p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Location Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search hotel or area..."
                    className="pl-10 pr-10 h-12"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                    </button>
                  )}
                </div>
                
                <Button className="h-12 px-8 bg-primary hover:bg-primary/90">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Hotels Listing */}
      <section className="py-12 container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Hotels in Jabalpur
            </h2>
            <p className="text-muted-foreground">{filteredHotels.length} hotels found</p>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={hotel.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80"}
                    alt={hotel.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-sm font-semibold flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {hotel.rating}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-serif text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {hotel.name}
                  </h3>
                  
                  <div className="flex items-center text-muted-foreground text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{hotel.address}, {hotel.area}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities?.slice(0, 3).map((amenity, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full capitalize"
                      >
                        {amenity}
                      </span>
                    ))}
                    {hotel.amenities?.length > 3 && (
                      <span className="text-xs text-muted-foreground px-1 self-center">
                        +{hotel.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Starts from</span>
                      <span className="font-bold text-lg text-primary">₹2,499</span>
                    </div>
                    <Button asChild size="sm">
                      <Link to={`/booking?hotelId=${hotel.id}`}>Book Now</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      
      <Footer />
    </div>
  );
}
