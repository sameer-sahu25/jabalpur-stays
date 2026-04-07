import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "New Delhi",
    rating: 5,
    text: "An absolutely wonderful stay! The room was immaculate, the staff went above and beyond, and the location made it so easy to visit all the attractions. Will definitely return!",
    date: "January 2026",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    location: "Mumbai",
    rating: 5,
    text: "Perfect base for exploring Jabalpur. The boat ride to Marble Rocks arranged by the hotel was magical. The food was delicious and authentic. Highly recommended!",
    date: "December 2025",
  },
  {
    id: 3,
    name: "Ananya Patel",
    location: "Bengaluru",
    rating: 5,
    text: "We celebrated our anniversary here and it was perfect. The honeymoon suite was luxurious, and the candlelight dinner by the pool was incredibly romantic.",
    date: "November 2025",
  },
  {
    id: 4,
    name: "Vikram Singh",
    location: "Jaipur",
    rating: 4,
    text: "Great hotel with excellent service. The breakfast buffet had wonderful variety. Minor suggestion - the gym could be better equipped. Otherwise, a fantastic stay!",
    date: "October 2025",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-gold font-medium tracking-[0.3em] uppercase text-sm mb-3">
            Guest Reviews
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground font-bold mb-4">
            What Our Guests Say
          </h2>
          <div className="section-divider mt-6" />
        </div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto relative">
          {/* Navigation Buttons */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 p-3 rounded-full bg-card shadow-lg hover:shadow-xl transition-all z-10"
          >
            <ChevronLeft className="h-6 w-6 text-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 p-3 rounded-full bg-card shadow-lg hover:shadow-xl transition-all z-10"
          >
            <ChevronRight className="h-6 w-6 text-foreground" />
          </button>

          {/* Testimonial Card */}
          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-lg text-center relative">
            <Quote className="absolute top-8 left-8 h-12 w-12 text-gold/20" />
            
            {/* Rating */}
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < testimonials[currentIndex].rating
                      ? "text-gold fill-gold"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>

            {/* Text */}
            <p className="text-lg md:text-xl text-foreground mb-8 italic leading-relaxed">
              "{testimonials[currentIndex].text}"
            </p>

            {/* Author */}
            <div>
              <p className="font-serif text-xl font-semibold text-foreground">
                {testimonials[currentIndex].name}
              </p>
              <p className="text-muted-foreground">
                {testimonials[currentIndex].location} • {testimonials[currentIndex].date}
              </p>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-gold w-8" : "bg-border hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
