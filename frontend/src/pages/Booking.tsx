import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarDays, Users, Bed, CreditCard, User, Mail, Phone, MapPin, Check, Loader2, Tag } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { fetchApi } from "@/lib/api";

const guestCounts = [
  { value: "1", label: "1 Guest" },
  { value: "2", label: "2 Guests" },
  { value: "3", label: "3 Guests" },
  { value: "4", label: "4 Guests" },
];

interface Room {
  id: number;
  type: string;
  price: string | number;
  number: string;
  hotelId: number;
}

interface Offer {
  id: number;
  title: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: string | number;
  code: string;
  minStay: number;
  applicableRoomTypes: string[];
}

export default function Booking() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hotelId = searchParams.get("hotelId");
  const initialOfferId = searchParams.get("offerId");
  const queryCheckIn = searchParams.get("checkIn");
  const queryCheckOut = searchParams.get("checkOut");
  const queryRoomType = searchParams.get("roomType");
  const queryGuests = searchParams.get("guests");

  const [checkIn, setCheckIn] = useState<Date | undefined>(queryCheckIn ? new Date(queryCheckIn) : undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(queryCheckOut ? new Date(queryCheckOut) : undefined);
  const [roomType, setRoomType] = useState<string | undefined>(queryRoomType || undefined);
  const [guests, setGuests] = useState<string | undefined>(queryGuests || undefined);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [availableTypes, setAvailableTypes] = useState<{ type: string; price: number; id: number }[]>([]);
  const [availableOffers, setAvailableOffers] = useState<Offer[]>([]);
  const [selectedOfferIds, setSelectedOfferIds] = useState<number[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  
  useEffect(() => {
    if (initialOfferId) {
      setSelectedOfferIds([Number(initialOfferId)]);
    }
  }, [initialOfferId]);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // Guest Details State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  // Payment Details State
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      toast({
        title: "Authentication Required",
        description: "Please login to book a room.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (hotelId) {
      fetchRooms();
      fetchOffers();
    } else {
      toast({
        title: "Error",
        description: "No hotel selected. Redirecting to hotels page.",
        variant: "destructive",
      });
      navigate("/hotels");
    }
  }, [hotelId, navigate, toast]);

  async function fetchRooms() {
    try {
      const data = await fetchApi(`/rooms?hotelId=${hotelId}`);
      console.log("Rooms data received:", data);
      
      if (!data || !data.data || !Array.isArray(data.data.rooms)) {
        console.error("Invalid rooms data format:", data);
        setAvailableTypes([]);
        return;
      }

      // Group by type and pick one representative for pricing
      const typesMap = new Map();
      data.data.rooms.forEach((room: Room) => {
        if (!typesMap.has(room.type)) {
          typesMap.set(room.type, {
            type: room.type,
            price: Number(room.price),
            id: room.id // Store one ID for booking (simplified)
          });
        }
      });
      setAvailableTypes(Array.from(typesMap.values()));
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      toast({
        title: "Error",
        description: "Failed to load room options.",
        variant: "destructive",
      });
    }
  }

  async function fetchOffers() {
    try {
      const data = await fetchApi("/offers");
      setAvailableOffers(data.data.offers);
    } catch (error) {
      console.error("Failed to fetch offers:", error);
    }
  }

  const selectedRoomTypeData = availableTypes.find(r => r.type === roomType);
  const nights = checkIn && checkOut ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const basePrice = selectedRoomTypeData ? selectedRoomTypeData.price * nights : 0;
  
  // Filter offers based on constraints
  const applicableOffers = availableOffers.filter(offer => {
    const isRoomTypeValid = !offer.applicableRoomTypes || 
                            offer.applicableRoomTypes.length === 0 || 
                            (roomType && offer.applicableRoomTypes.includes(roomType));
    const isMinStayValid = !offer.minStay || nights >= offer.minStay;
    return isRoomTypeValid && isMinStayValid;
  });

  // Calculate discounts
  const selectedOffersData = applicableOffers.filter(o => selectedOfferIds.includes(o.id));
  const totalDiscountAmount = selectedOffersData.reduce((acc, offer) => {
    let discount = 0;
    if (offer.discountType === "percentage") {
      discount = (basePrice * Number(offer.discountValue)) / 100;
    } else {
      discount = Number(offer.discountValue);
    }
    return acc + discount;
  }, 0);
  
  const totalPrice = Math.max(0, basePrice - totalDiscountAmount);

  const handleApplyPromoCode = async () => {
    if (!promoCode || !selectedRoomTypeData || !checkIn || !checkOut) return;

    try {
      setIsValidatingCode(true);
      const response = await fetchApi("/offers/validate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          code: promoCode,
          roomId: selectedRoomTypeData.id,
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
        }),
      });

      const offer = response.data.offer;
      if (!selectedOfferIds.includes(offer.id)) {
        setSelectedOfferIds(prev => [...prev, offer.id]);
        toast({
          title: "Promo Code Applied!",
          description: `${offer.title} has been added to your booking.`,
        });
      } else {
        toast({
          title: "Offer Already Applied",
          description: "This offer is already in your list.",
        });
      }
      setPromoCode("");
    } catch (error: any) {
      toast({
        title: "Invalid Code",
        description: error.message || "Could not validate promo code.",
        variant: "destructive",
      });
    } finally {
      setIsValidatingCode(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedRoomTypeData || !checkIn || !checkOut) return;

    try {
      setIsLoading(true);
      
      await fetchApi("/bookings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          roomId: selectedRoomTypeData.id,
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
          appliedOfferIds: selectedOfferIds,
        }),
      });

      toast({
        title: "Booking Confirmed!",
        description: "Your reservation has been successfully created.",
      });
      setTimeout(() => navigate("/"), 2000);
    } catch (error: any) {
      console.error("Booking failed:", error);
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create booking.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOffer = (id: number) => {
    setSelectedOfferIds(prev => 
      prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gold font-medium tracking-[0.3em] uppercase text-sm mb-3">
            Reserve Your Stay
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary-foreground font-bold mb-4">
            Book Your Room
          </h1>
          <div className="w-16 h-1 mx-auto bg-gold mt-6" />
          <p className="text-primary-foreground/80 mt-6 max-w-2xl mx-auto">
            Experience the finest hospitality in Jabalpur with our premium accommodations
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors",
                    step >= s ? "bg-gold text-accent-foreground" : "bg-secondary text-muted-foreground"
                  )}
                >
                  {step > s ? <Check className="h-5 w-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={cn(
                    "w-20 h-1 mx-2",
                    step > s ? "bg-gold" : "bg-secondary"
                  )} />
                )}
              </div>
            ))}
          </div>

          <div className="bg-card rounded-xl p-8 shadow-lg border border-border">
            {/* Step 1: Room Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Select Your Room</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Check-in Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-gold" />
                      Check-in
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal h-12 border-border hover:border-gold/50 transition-colors"
                        >
                          {checkIn ? format(checkIn, "dd MMM yyyy") : <span className="text-muted-foreground">Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkIn}
                          onSelect={setCheckIn}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Check-out Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-gold" />
                      Check-out
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal h-12 border-border hover:border-gold/50 transition-colors"
                        >
                          {checkOut ? format(checkOut, "dd MMM yyyy") : <span className="text-muted-foreground">Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkOut}
                          onSelect={setCheckOut}
                          disabled={(date) => date < (checkIn || new Date())}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Room Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <Bed className="h-4 w-4 text-gold" />
                      Room Type
                    </label>
                    <Select value={roomType} onValueChange={setRoomType}>
                      <SelectTrigger className="h-12 border-border hover:border-gold/50 transition-colors">
                        <SelectValue placeholder="Select room" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTypes.length > 0 ? (
                          availableTypes.map((room) => (
                            <SelectItem key={room.type} value={room.type}>
                              {room.type} - ₹{room.price.toLocaleString()}/night
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="loading" disabled>Loading rooms...</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Guests */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <Users className="h-4 w-4 text-gold" />
                      Guests
                    </label>
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger className="h-12 border-border hover:border-gold/50 transition-colors">
                        <SelectValue placeholder="Select guests" />
                      </SelectTrigger>
                      <SelectContent>
                        {guestCounts.map((count) => (
                          <SelectItem key={count.value} value={count.value}>
                            {count.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Price Summary */}
                {selectedRoomTypeData && nights > 0 && (
                  <div className="bg-secondary rounded-lg p-4 mt-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">{selectedRoomTypeData.type} × {nights} night{nights > 1 ? 's' : ''}</span>
                      <span className="font-medium">₹{basePrice.toLocaleString()}</span>
                    </div>
                    
                    {/* Offers Section */}
                    <div className="border-t border-border mt-4 pt-4">
                      <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                        <Tag className="h-4 w-4 text-gold" />
                        Promotions
                      </h4>
                      
                      {/* Promo Code Input */}
                      <div className="flex gap-2 mb-4">
                        <Input 
                          placeholder="Enter promo code" 
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          className="h-10"
                        />
                        <Button 
                          variant="outline" 
                          className="h-10 border-gold text-gold hover:bg-gold hover:text-accent-foreground"
                          onClick={handleApplyPromoCode}
                          disabled={!promoCode || isValidatingCode}
                        >
                          {isValidatingCode ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                        </Button>
                      </div>

                      {applicableOffers.length > 0 ? (
                        <div className="space-y-3">
                          {applicableOffers.map((offer) => (
                            <div key={offer.id} className="flex items-start gap-3 p-2 rounded hover:bg-background/50 transition-colors">
                              <Checkbox 
                                id={`offer-${offer.id}`} 
                                checked={selectedOfferIds.includes(offer.id)}
                                onCheckedChange={() => toggleOffer(offer.id)}
                              />
                              <div className="grid gap-1.5 leading-none">
                                <label
                                  htmlFor={`offer-${offer.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                  {offer.title} ({offer.discountType === "percentage" ? `${offer.discountValue}%` : `₹${offer.discountValue}`} OFF)
                                </label>
                                <p className="text-xs text-muted-foreground">
                                  {offer.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">No other applicable offers for this selection.</p>
                      )}
                    </div>

                    {totalDiscountAmount > 0 && (
                      <div className="flex justify-between text-green-600 mt-4 pt-4 border-t border-border italic text-sm">
                        <span>Offers Discount</span>
                        <span>- ₹{totalDiscountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-lg font-bold border-t border-border pt-2 mt-4">
                      <span>Total Amount</span>
                      <span className="text-gold">₹{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <Button 
                  className="w-full h-12 bg-gold hover:bg-gold-dark text-accent-foreground"
                  onClick={() => setStep(2)}
                  disabled={!checkIn || !checkOut || !roomType || !guests}
                >
                  Continue to Guest Details
                </Button>
              </div>
            )}

            {/* Step 2: Guest Details */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Guest Details</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <User className="h-4 w-4 text-gold" />
                      Full Name
                    </label>
                    <Input 
                      placeholder="Enter your full name" 
                      className="h-12" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gold" />
                      Email Address
                    </label>
                    <Input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="h-12" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gold" />
                      Phone Number
                    </label>
                    <Input 
                      type="tel" 
                      placeholder="Enter your phone number" 
                      className="h-12" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gold" />
                      City
                    </label>
                    <Input 
                      placeholder="Enter your city" 
                      className="h-12" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 h-12" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button 
                    className="flex-1 h-12 bg-gold hover:bg-gold-dark text-accent-foreground" 
                    onClick={() => setStep(3)}
                    disabled={!name || !email || !phone || !city}
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Payment Details</h2>
                
                <div className="bg-secondary rounded-lg p-6 mb-6">
                  <h3 className="font-semibold mb-4">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Room Type</span>
                      <span>{selectedRoomTypeData?.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-in</span>
                      <span>{checkIn && format(checkIn, "dd MMM yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-out</span>
                      <span>{checkOut && format(checkOut, "dd MMM yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Guests</span>
                      <span>{guests} Guest{Number(guests) > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-border pt-2 mt-2">
                      <span>Total Amount</span>
                      <div className="text-right">
                        {totalDiscountAmount > 0 && (
                          <div className="text-xs text-green-600 font-normal line-through">
                            ₹{basePrice.toLocaleString()}
                          </div>
                        )}
                        <span className="text-gold">₹{totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gold" />
                      Card Number
                    </label>
                    <Input 
                      placeholder="1234 5678 9012 3456" 
                      className="h-12" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Expiry Date
                      </label>
                      <Input 
                        placeholder="MM/YY" 
                        className="h-12" 
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        CVV
                      </label>
                      <Input 
                        placeholder="123" 
                        className="h-12" 
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 h-12" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button 
                    className="flex-1 h-12 bg-gold hover:bg-gold-dark text-accent-foreground"
                    onClick={handleBooking}
                    disabled={!cardNumber || !expiry || !cvv || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}