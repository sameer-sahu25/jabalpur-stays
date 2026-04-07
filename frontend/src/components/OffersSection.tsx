import { useState, useEffect } from "react";
import { Sparkles, Calendar, Users, Percent, Check, Loader2, Heart, Sun, Gift, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { getOffers } from "@/lib/api";
import { BookingModal } from "./BookingModal";
import { useToast } from "./ui/use-toast";

interface Offer {
  id: number;
  title: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: string | number;
  minStay: number;
  applicableRoomTypes: string[];
  code: string;
  validTo: string | null;
}

const offerIcons: Record<string, any> = {
  "Weekend": Calendar,
  "Family": Users,
  "Honeymoon": Heart,
  "Summer": Sun,
  "Festival": Gift,
  "Stay": Clock,
};

const offerColors = ["bg-river", "bg-forest", "bg-gold-dark"];

export function OffersSection() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const data = await getOffers();
      // Only show top 3 on homepage
      setOffers(data);
    } catch (error) {
      console.error("Failed to fetch offers", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookOffer = (offer: Offer) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to book this special offer.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    setSelectedOffer(offer);
    setIsModalOpen(true);
  };

  const getIcon = (title: string) => {
    for (const key in offerIcons) {
      if (title.includes(key)) return offerIcons[key];
    }
    return Sparkles;
  };

  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-gold font-medium tracking-[0.3em] uppercase text-sm mb-3">
            Special Deals
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-primary-foreground font-bold mb-4">
            Exclusive Offers
          </h2>
          <div className="w-16 h-1 mx-auto bg-gold mt-6" />
          <p className="text-primary-foreground/80 mt-6 max-w-2xl mx-auto">
            Take advantage of our seasonal packages and special rates 
            for an unforgettable stay in Jabalpur.
          </p>
        </div>

        {/* Offers Grid */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 text-gold animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {offers.map((offer, index) => {
              const Icon = getIcon(offer.title);
              const colorClass = offerColors[index % offerColors.length];

              return (    <div
                  key={offer.id}
                  className="bg-card rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
                >
                  {/* Header */}
                  <div className={`${colorClass} p-6 relative`}>
                    {Number(offer.discountValue) > 0 && (
                      <div className="absolute top-4 right-4 bg-card rounded-full px-3 py-1">
                        <span className="text-foreground font-bold text-sm">
                          {offer.discountType === "percentage" 
                            ? `${parseFloat(offer.discountValue.toString())}% OFF` 
                            : `₹${parseFloat(offer.discountValue.toString())} OFF`}
                        </span>
                      </div>
                    )}
                    <div className="w-14 h-14 rounded-full bg-card/20 flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-primary-foreground">
                      {offer.title}
                    </h3>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-muted-foreground mb-4">
                      {offer.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4 p-3 bg-secondary rounded-lg">
                      <span className="text-sm text-muted-foreground">Use code:</span>
                      <code className="font-mono font-bold text-gold">{offer.code}</code>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>Valid till</span>
                      <span className="font-medium">
                        {offer.validTo ? new Date(offer.validTo).toLocaleDateString() : "Limited Time"}
                      </span>
                    </div>

                    {/* Applicable Room Types */}
                    <div className="mb-6 space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gold flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Applicable Room Types:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {offer.applicableRoomTypes && offer.applicableRoomTypes.length > 0 ? (
                          offer.applicableRoomTypes.map((type, i) => (
                            <span key={i} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full border border-border">
                              {type}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full border border-border">
                            All Room Types
                          </span>
                        )}
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleBookOffer(offer)}
                      className="w-full bg-gold hover:bg-gold-dark text-accent-foreground font-bold transition-all hover:scale-[1.02]"
                    >
                      Book This Offer
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link to="/offers">
            <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-accent-foreground px-8">
              <Percent className="h-4 w-4 mr-2" />
              View All Offers
            </Button>
          </Link>
        </div>
      </div>

      {selectedOffer && (
        <BookingModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedOffer={selectedOffer}
        />
      )}
    </section>
  );
}
