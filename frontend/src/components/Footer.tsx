import { Link } from "react-router-dom";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Github, 
  Linkedin, 
  Instagram, 
  Twitter, 
  Send,
  ArrowUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Rooms & Suites", href: "/rooms" },
  { name: "Sign In", href: "/login" },
  { name: "Special Offers", href: "/offers" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact Us", href: "/contact" },
];

const services = [
  "Restaurant & Bar",
  "Swimming Pool",
  "Spa & Wellness",
  "Conference Hall",
  "Airport Transfer",
  "Sightseeing Tours",
];

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "Github" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "Linkedin" },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-2xl font-bold mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-primary-foreground/70">
                Get exclusive offers and travel tips delivered to your inbox.
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 w-full md:w-80"
              />
              <Button className="bg-gold hover:bg-gold-dark text-accent-foreground">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="text-gold">
                <img src="/logo.svg" alt="Jabalpur Stays Fox Logo" className="w-12 h-12 object-contain" />
              </div>
              <div>
                <h4 className="font-serif text-xl font-bold">Jabalpur Stays</h4>
                <p className="text-xs text-primary-foreground/60 uppercase tracking-wider">
                  Luxury Hotel
                </p>
              </div>
            </div>
            <p className="text-primary-foreground/70 mb-6 text-sm leading-relaxed">
              Experience the perfect blend of traditional hospitality and modern luxury 
              in the heart of Jabalpur, surrounded by nature's wonders.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-gold transition-colors group"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5 group-hover:text-accent-foreground transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-gold transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-6">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-primary-foreground/70 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <span className="text-primary-foreground/70 text-sm">
                  123 Narmada Road, Near Gwarighat,<br />
                  Jabalpur, Madhya Pradesh 482001
                </span>
              </li>
              <li>
                <a
                  href="tel:+917612345678"
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-gold transition-colors text-sm"
                >
                  <Phone className="h-5 w-5 text-gold" />
                  +91 761 234 5678
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@narmadaretreat.com"
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-gold transition-colors text-sm"
                >
                  <Mail className="h-5 w-5 text-gold" />
                  info@narmadaretreat.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/60 text-sm text-center md:text-left">
              © 2026 Narmada Retreat. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-primary-foreground/60">
              <Link to="/privacy" className="hover:text-gold transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-gold transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gold text-accent-foreground shadow-lg hover:bg-gold-dark transition-all z-50 flex items-center justify-center"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </footer>
  );
}
