import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { 
  Star, 
  MapPin, 
  Wifi, 
  Car, 
  Coffee, 
  Wind, 
  Tv, 
  Bath, 
  Loader2, 
  Search,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Dumbbell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchApi } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";
import { GlowEffect } from "@/components/GlowEffect";

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

interface HotelsResponse {
  status: string;
  results: number;
  total: number;
  page: number;
  totalPages: number;
  data: {
    hotels: Hotel[];
  };
}

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  parking: Car,
  breakfast: Coffee,
  ac: Wind,
  tv: Tv,
  bath: Bath,
  restaurant: Utensils,
  gym: Dumbbell
};

export default function Rooms() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isLoading, isError } = useQuery<HotelsResponse>({
    queryKey: ["hotels", debouncedSearch, page],
    queryFn: () => 
      fetchApi(`/hotels?page=${page}&limit=100${debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ""}`),
    placeholderData: keepPreviousData,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to page 1 on search
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value) {
      newParams.set("search", e.target.value);
    } else {
      newParams.delete("search");
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const hotels = data?.data.hotels || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground font-bold mb-6">
              Best Hotels Jabalpur - Hotels in Jabalpur listed on the site
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Find your perfect stay from our curated collection of luxury and comfort in the heart of Jabalpur.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search hotels by name..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 h-12 text-lg shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hotels Grid */}
      <section className="py-12 flex-grow">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading hotels...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-20">
              <p className="text-destructive text-lg font-medium">Failed to load hotels.</p>
              <p className="text-muted-foreground text-sm mt-2">The backend server might be down or there's a database connection issue.</p>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          ) : hotels.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No hotels found matching "{debouncedSearch}".</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchTerm("");
                  setPage(1);
                  setSearchParams({});
                }}
                className="mt-2 text-primary"
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {hotels.map((hotel) => (
                  <GlowEffect key={hotel.id} className="rounded-xl shadow-lg bg-card border border-border">
                    <div className="flex flex-col h-full group">
                      {/* Image Container */}
                      <div className="relative h-64 overflow-hidden rounded-t-xl">
                        <img
                          src={hotel.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"}
                          alt={hotel.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <Star className="h-4 w-4 text-gold fill-gold" />
                          <span className="text-sm font-bold text-foreground">{hotel.rating}</span>
                        </div>
                        <div className="absolute bottom-4 left-4 bg-primary/80 backdrop-blur-sm text-primary-foreground px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {hotel.area}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="font-serif text-2xl font-bold text-foreground mb-2 group-hover:text-gold transition-colors line-clamp-1">
                          {hotel.name}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
                          {hotel.description}
                        </p>

                        {/* Amenities */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {hotel.amenities.slice(0, 4).map((amenity) => {
                            const Icon = amenityIcons[amenity.toLowerCase()] || Star;
                            return (
                              <div
                                key={amenity}
                                className="bg-secondary/50 p-2 rounded-lg"
                                title={amenity}
                              >
                                <Icon className="h-4 w-4 text-gold" />
                              </div>
                            );
                          })}
                          {hotel.amenities.length > 4 && (
                            <div className="bg-secondary/50 p-2 rounded-lg text-[10px] font-bold text-muted-foreground flex items-center">
                              +{hotel.amenities.length - 4}
                            </div>
                          )}
                        </div>

                        <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Starting from</span>
                            <span className="text-2xl font-serif font-bold text-foreground">₹2,499</span>
                          </div>
                          <Button asChild className="bg-gold hover:bg-gold-dark text-accent-foreground font-bold px-6 shadow-md transition-all hover:scale-105">
                            <Link to={`/booking?hotelId=${hotel.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </GlowEffect>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
