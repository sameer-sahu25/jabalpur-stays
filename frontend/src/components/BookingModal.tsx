import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { format, differenceInDays } from "date-fns";
import { 
  CalendarDays, 
  Users, 
  Bed, 
  CreditCard, 
  Loader2, 
  CheckCircle2, 
  ArrowRight,
  ArrowLeft,
  Building2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createBooking, getHotels, getRoomsByHotel } from "@/lib/api";
import { cn } from "@/lib/utils";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOffer?: {
    id: number;
    title: string;
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: string | number;
    applicableRoomTypes?: string[];
  };
}

export function BookingModal({ isOpen, onClose, selectedOffer }: BookingModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [hotels, setHotels] = useState<any[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<string>("");
  const [rooms, setRooms] = useState<any[]>([]);
  const [isRoomsLoading, setIsRoomsLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState<string>("1");
  
  // Guest Info
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  // Payment Info
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchHotels();
      setStep(1);
      setIsSuccess(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedHotel) {
      setSelectedRoom(""); // Reset room selection when hotel changes
      fetchRooms(Number(selectedHotel));
    }
  }, [selectedHotel]);

  const fetchHotels = async () => {
    try {
      const data = await getHotels();
      setHotels(data);
    } catch (error) {
      console.error("Failed to fetch hotels", error);
    }
  };

  const fetchRooms = async (hotelId: number) => {
    console.log(`Fetching rooms for hotel: ${hotelId}`);
    setIsRoomsLoading(true);
    try {
      const data = await getRoomsByHotel(hotelId);
      console.log(`Rooms received for hotel ${hotelId}:`, data);
      
      // Filter rooms based on applicableRoomTypes if selectedOffer exists
      let filteredRooms = data || [];
      if (selectedOffer && selectedOffer.applicableRoomTypes && selectedOffer.applicableRoomTypes.length > 0) {
        console.log(`Filtering for room types: ${JSON.stringify(selectedOffer.applicableRoomTypes)}`);
        filteredRooms = data.filter((room: any) => 
          selectedOffer.applicableRoomTypes.includes(room.type)
        );
      }
      
      console.log(`Final rooms list:`, filteredRooms);
      setRooms(filteredRooms);
    } catch (error) {
      console.error("Failed to fetch rooms", error);
      toast({
        title: "Error",
        description: "Failed to fetch room types for this hotel.",
        variant: "destructive",
      });
    } finally {
      setIsRoomsLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!selectedHotel || !selectedRoom || !checkIn || !checkOut) {
        toast({
          title: "Missing Information",
          description: "Please fill in all booking details.",
          variant: "destructive",
        });
        return;
      }
      if (differenceInDays(checkOut, checkIn) <= 0) {
        toast({
          title: "Invalid Dates",
          description: "Check-out must be after check-in.",
          variant: "destructive",
        });
        return;
      }
    } else if (step === 2) {
      if (!guestName || !guestEmail || !guestPhone) {
        toast({
          title: "Missing Information",
          description: "Please fill in all guest details.",
          variant: "destructive",
        });
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const calculateTotalPrice = () => {
    if (!selectedRoom || !checkIn || !checkOut) return 0;
    const room = rooms.find(r => r.id.toString() === selectedRoom);
    if (!room) return 0;

    const days = differenceInDays(checkOut, checkIn);
    const basePrice = Number(room.price) * days;
    
    let discount = 0;
    if (selectedOffer) {
      if (selectedOffer.discountType === "percentage") {
        discount = (basePrice * Number(selectedOffer.discountValue)) / 100;
      } else {
        discount = Number(selectedOffer.discountValue);
      }
    }
    
    return Math.max(0, basePrice - discount);
  };

  const handleBooking = async () => {
    if (!cardNumber || !expiry || !cvv) {
      toast({
        title: "Payment Error",
        description: "Please fill in all payment details.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const bookingData = {
        roomId: Number(selectedRoom),
        checkIn: format(checkIn!, "yyyy-MM-dd"),
        checkOut: format(checkOut!, "yyyy-MM-dd"),
        appliedOfferIds: selectedOffer ? [selectedOffer.id] : [],
      };

      await createBooking(bookingData);
      setIsSuccess(true);
      toast({
        title: "Booking Successful!",
        description: "Your room has been booked successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message || "An error occurred while booking.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentRoom = rooms.find(r => r.id.toString() === selectedRoom);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-gold">
            {isSuccess ? "Booking Confirmed" : `Book Your Stay ${selectedOffer ? `- ${selectedOffer.title}` : ""}`}
          </DialogTitle>
          <DialogDescription>
            {isSuccess 
              ? "Your reservation has been received. We've sent a confirmation email with all details."
              : "Complete the steps below to confirm your luxury stay."
            }
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Thank you, {guestName}!</h3>
            <p className="text-muted-foreground mb-6">
              Your booking for {currentRoom?.type} at {hotels.find(h => h.id.toString() === selectedHotel)?.name} is confirmed.
            </p>
            <Button onClick={onClose} className="w-full bg-gold hover:bg-gold-dark">
              Close Preview
            </Button>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Progress Bar */}
            <div className="flex items-center gap-2 mb-8">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-colors",
                    step >= i ? "bg-gold" : "bg-secondary"
                  )} 
                />
              ))}
            </div>

            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gold" />
                    Select Hotel
                  </Label>
                  <Select value={selectedHotel} onValueChange={setSelectedHotel}>
                    <SelectTrigger className="border-gold/20 focus:ring-gold">
                      <SelectValue placeholder="Choose a hotel" />
                    </SelectTrigger>
                    <SelectContent>
                      {hotels.map((hotel) => (
                        <SelectItem key={hotel.id} value={hotel.id.toString()}>
                          {hotel.name} - {hotel.area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Bed className="h-4 w-4 text-gold" />
                    Select Room Type
                  </Label>
                  <Select 
                    value={selectedRoom} 
                    onValueChange={setSelectedRoom}
                    disabled={!selectedHotel || isRoomsLoading}
                  >
                    <SelectTrigger className="border-gold/20 focus:ring-gold">
                      <SelectValue placeholder={
                        !selectedHotel 
                          ? "Select hotel first" 
                          : isRoomsLoading 
                            ? "Loading rooms..." 
                            : rooms.length === 0 
                              ? "No rooms available" 
                              : "Choose a room"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.length > 0 ? (
                        rooms.map((room) => (
                          <SelectItem key={room.id} value={room.id.toString()}>
                            {room.type} - ₹{room.price}/night
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          {isRoomsLoading ? "Loading rooms..." : "No room types available"}
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-xs uppercase tracking-wider">
                      <CalendarDays className="h-3.5 w-3.5 text-gold" />
                      Check-in
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal border-gold/20",
                            !checkIn && "text-muted-foreground"
                          )}
                        >
                          {checkIn ? format(checkIn, "dd MMM") : <span>Select</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkIn}
                          onSelect={setCheckIn}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-xs uppercase tracking-wider">
                      <CalendarDays className="h-3.5 w-3.5 text-gold" />
                      Check-out
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal border-gold/20",
                            !checkOut && "text-muted-foreground"
                          )}
                        >
                          {checkOut ? format(checkOut, "dd MMM") : <span>Select</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkOut}
                          onSelect={setCheckOut}
                          disabled={(date) => date <= (checkIn || new Date())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gold" />
                    Number of Guests
                  </Label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger className="border-gold/20 focus:ring-gold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4].map((n) => (
                        <SelectItem key={n} value={n.toString()}>
                          {n} {n === 1 ? "Guest" : "Guests"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input 
                    value={guestName} 
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="John Doe"
                    className="border-gold/20 focus:ring-gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input 
                    type="email"
                    value={guestEmail} 
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="border-gold/20 focus:ring-gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input 
                    type="tel"
                    value={guestPhone} 
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="border-gold/20 focus:ring-gold"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Summary Card */}
                <div className="bg-secondary/50 p-4 rounded-lg space-y-2 border border-gold/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Stay Duration</span>
                    <span className="font-medium">{differenceInDays(checkOut!, checkIn!)} Nights</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Room Type</span>
                    <span className="font-medium">{currentRoom?.type}</span>
                  </div>
                  {selectedOffer && (
                    <div className="flex justify-between text-sm text-green-500">
                      <span>Discount ({selectedOffer.title})</span>
                      <span>
                        -{selectedOffer.discountType === "percentage" 
                          ? `${selectedOffer.discountValue}%` 
                          : `₹${selectedOffer.discountValue}`}
                      </span>
                    </div>
                  )}
                  <div className="pt-2 mt-2 border-t border-gold/10 flex justify-between items-center">
                    <span className="font-bold">Total Amount</span>
                    <span className="text-xl font-bold text-gold">₹{calculateTotalPrice().toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gold" />
                      Card Number
                    </Label>
                    <Input 
                      value={cardNumber} 
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4444 4444 4444 4444"
                      maxLength={19}
                      className="border-gold/20 focus:ring-gold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Expiry Date</Label>
                      <Input 
                        value={expiry} 
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="border-gold/20 focus:ring-gold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CVV</Label>
                      <Input 
                        type="password"
                        value={cvv} 
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="***"
                        maxLength={3}
                        className="border-gold/20 focus:ring-gold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {!isSuccess && (
            <>
              {step > 1 && (
                <Button 
                  variant="ghost" 
                  onClick={handleBack}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button 
                  onClick={handleNext}
                  className="flex-1 bg-gold hover:bg-gold-dark text-accent-foreground"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleBooking}
                  disabled={isLoading}
                  className="flex-1 bg-gold hover:bg-gold-dark text-accent-foreground"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Pay ₹{calculateTotalPrice().toLocaleString()}
                    </>
                  )}
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
