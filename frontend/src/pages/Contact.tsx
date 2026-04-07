import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Building, Globe } from "lucide-react";
import { GlowEffect } from "@/components/GlowEffect";

const contactInfo = [
  {
    icon: MapPin,
    title: "Address",
    details: ["Civil Lines, Near High Court", "Jabalpur, Madhya Pradesh", "India - 482001"],
  },
  {
    icon: Phone,
    title: "Phone",
    details: ["+91 761 240 1234", "+91 761 240 5678", "Toll Free: 1800-123-4567"],
  },
  {
    icon: Mail,
    title: "Email",
    details: ["reservations@narmadajabalpur.com", "info@narmadajabalpur.com", "support@narmadajabalpur.com"],
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: ["24/7 Front Desk", "Restaurant: 7 AM - 11 PM", "Spa: 9 AM - 9 PM"],
  },
];

const departments = [
  { value: "reservations", label: "Reservations" },
  { value: "events", label: "Events & Conferences" },
  { value: "feedback", label: "Feedback" },
  { value: "careers", label: "Careers" },
  { value: "other", label: "Other Inquiries" },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gold font-medium tracking-[0.3em] uppercase text-sm mb-3">
            Get In Touch
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary-foreground font-bold mb-4">
            Contact Us
          </h1>
          <div className="w-16 h-1 mx-auto bg-gold mt-6" />
          <p className="text-primary-foreground/80 mt-6 max-w-2xl mx-auto">
            We're here to help with any questions about your stay, 
            reservations, or special requests
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <GlowEffect key={index} className="rounded-xl bg-card p-6 shadow-lg border border-border text-center">
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4 transition-transform duration-500 hover:scale-110">
                  <info.icon className="h-7 w-7 text-gold" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">{info.title}</h3>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-muted-foreground text-sm">{detail}</p>
                ))}
              </GlowEffect>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <GlowEffect className="bg-card rounded-xl p-8 shadow-lg border border-border">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="h-6 w-6 text-gold" />
                <h2 className="font-serif text-2xl font-bold text-foreground">Send us a Message</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Full Name *</label>
                    <Input 
                      placeholder="Your name" 
                      className="h-12"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Email *</label>
                    <Input 
                      type="email" 
                      placeholder="Your email" 
                      className="h-12"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                    <Input 
                      type="tel" 
                      placeholder="Your phone" 
                      className="h-12"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Department *</label>
                    <select 
                      className="w-full h-12 px-3 rounded-md border border-input bg-background text-foreground"
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      required
                    >
                      <option value="">Select department</option>
                      {departments.map((dept) => (
                        <option key={dept.value} value={dept.value}>{dept.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Message *</label>
                  <Textarea 
                    placeholder="How can we help you?" 
                    className="min-h-[120px]"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  />
                </div>

                <Button type="submit" className="w-full h-12 bg-gold hover:bg-gold-dark text-accent-foreground font-bold">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </GlowEffect>

            {/* Map & Additional Info */}
            <div className="space-y-6">
              {/* Map */}
              <div className="bg-card rounded-xl overflow-hidden shadow-lg border border-border h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.8543657776184!2d79.9414!3d23.1815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3981b1!2sJabalpur%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Hotel Location"
                />
              </div>

              {/* Quick Links */}
              <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                <h3 className="font-serif text-xl font-bold text-foreground mb-4">Quick Links</h3>
                <div className="grid grid-cols-2 gap-4">
                  <a href="/booking" className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors">
                    <Building className="h-4 w-4" />
                    <span>Make a Reservation</span>
                  </a>
                  <a href="/offers" className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors">
                    <Globe className="h-4 w-4" />
                    <span>View Offers</span>
                  </a>
                  <a href="/attractions" className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors">
                    <MapPin className="h-4 w-4" />
                    <span>Attractions</span>
                  </a>
                  <a href="/rooms" className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors">
                    <Building className="h-4 w-4" />
                    <span>Browse Hotels</span>
                  </a>
                </div>
              </div>

              {/* Social & Support */}
              <div className="bg-primary rounded-xl p-6 text-center">
                <h3 className="font-serif text-xl font-bold text-primary-foreground mb-2">Need Immediate Assistance?</h3>
                <p className="text-primary-foreground/80 mb-4">Our support team is available 24/7</p>
                <Button variant="outline" className="border-primary-foreground/50 text-primary-foreground bg-transparent hover:bg-primary-foreground/10">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now: +91 761 240 1234
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
