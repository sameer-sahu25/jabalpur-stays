import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Users, Bed, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
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
import { useToast } from "@/components/ui/use-toast";

const roomTypes = [
  { value: "Standard", label: "Standard Room" },
  { value: "Deluxe", label: "Deluxe Room" },
  { value: "Suite", label: "Royal Suite" },
];

const guestCounts = [
  { value: "1", label: "1 Guest" },
  { value: "2", label: "2 Guests" },
  { value: "3", label: "3 Guests" },
  { value: "4", label: "4 Guests" },
];

export function BookingForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [roomType, setRoomType] = useState<string>();
  const [guests, setGuests] = useState<string>();

  const handleCheckAvailability = () => {
    if (!checkIn || !checkOut || !roomType || !guests) {
      toast({
        title: "Missing Information",
        description: "Please select all fields to check availability.",
        variant: "destructive",
      });
      return;
    }

    const params = new URLSearchParams({
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      roomType,
      guests,
      hotelId: "1", // Default to the first hotel for now
    });

    navigate(`/booking?${params.toString()}`);
  };

  return (
    <div className="relative -mt-24 z-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="glass-card rounded-xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 items-end">
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
                    {checkIn ? (
                      format(checkIn, "dd MMM yyyy")
                    ) : (
                      <span className="text-muted-foreground">Select date</span>
                    )}
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
                    {checkOut ? (
                      format(checkOut, "dd MMM yyyy")
                    ) : (
                      <span className="text-muted-foreground">Select date</span>
                    )}
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
                  {roomTypes.map((room) => (
                    <SelectItem key={room.value} value={room.value}>
                      {room.label}
                    </SelectItem>
                  ))}
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
                  <SelectValue placeholder="Guests" />
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

            {/* Search Button */}
            <Button
              size="lg"
              className="h-12 bg-gold hover:bg-gold-dark text-accent-foreground font-medium gap-2"
              onClick={handleCheckAvailability}
            >
              <Search className="h-5 w-5" />
              Check Availability
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
