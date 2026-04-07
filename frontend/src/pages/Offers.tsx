import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, Users, Heart, Sun, Gift, Percent, Clock, Loader2, Check } from "lucide-react";
import { GlowEffect } from "@/components/GlowEffect";
import { getOffers } from "@/lib/api";
import { BookingModal } from "@/components/BookingModal";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

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

export default function Offers() {
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
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-primary relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gold/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full translate-x-1/2 translate-y-1/2" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-gold/20 text-gold px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Limited Time Deals</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary-foreground font-bold mb-4">
            Exclusive Offers
          </h1>
          <div className="w-16 h-1 mx-auto bg-gold mt-6" />
          <p className="text-primary-foreground/80 mt-6 max-w-2xl mx-auto">
            Take advantage of our seasonal packages and special rates 
            for an unforgettable stay in Jabalpur
          </p>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-10 w-10 text-gold animate-spin" />
              <p className="text-muted-foreground animate-pulse">Fetching exclusive deals...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {offers.map((offer, index) => {
                const Icon = getIcon(offer.title);
                const colorClass = offerColors[index % offerColors.length];
                
                return (
                  <GlowEffect key={offer.id} className="rounded-xl bg-card border border-border shadow-lg overflow-hidden">
                    <div className="flex flex-col h-full group">
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
                        <div className="w-14 h-14 rounded-full bg-card/20 flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110">
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
                  </GlowEffect>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {selectedOffer && (
        <BookingModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedOffer={selectedOffer}
        />
      )}

      {/* Terms Section */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Terms & Conditions</h2>
          <ul className="grid md:grid-cols-2 gap-4 text-muted-foreground">
            <li className="flex items-start gap-2">
              <Percent className="h-5 w-5 text-gold mt-0.5" />
              <span>Discounts are applicable on base room rates only</span>
            </li>
            <li className="flex items-start gap-2">
              <Percent className="h-5 w-5 text-gold mt-0.5" />
              <span>Offers cannot be combined with other promotions</span>
            </li>
            <li className="flex items-start gap-2">
              <Percent className="h-5 w-5 text-gold mt-0.5" />
              <span>Advance booking required, subject to availability</span>
            </li>
            <li className="flex items-start gap-2">
              <Percent className="h-5 w-5 text-gold mt-0.5" />
              <span>Blackout dates may apply during peak seasons</span>
            </li>
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
}
