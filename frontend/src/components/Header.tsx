import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Hotels", href: "/hotels" },
  { name: "Attractions", href: "/attractions" },
  { name: "Offers", href: "/offers" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* Main header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "bg-card/95 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="text-gold dark:text-gold-light">
                <img src="/logo.svg" alt="Jabalpur Stays Fox Logo" className="w-12 h-12 object-contain" />
              </div>
              <div className="hidden sm:block">
                <h1
                  className={`font-serif text-xl font-bold ${
                    isScrolled ? "text-foreground" : "text-primary-foreground"
                  }`}
                >
                  Jabalpur Stays
                </h1>
                <p
                  className={`text-xs tracking-widest uppercase ${
                    isScrolled ? "text-muted-foreground" : "text-primary-foreground/80"
                  }`}
                >
                  Luxury Hotel
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`nav-link text-sm font-medium tracking-wide uppercase transition-colors ${
                    isScrolled
                      ? "text-foreground hover:text-gold"
                      : "text-primary-foreground hover:text-gold"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Auth / CTA Button */}
            <div className="hidden lg:block">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`flex items-center gap-2 hover:bg-gold/10 ${
                        isScrolled ? "text-foreground" : "text-primary-foreground"
                      }`}
                    >
                      <User className="h-5 w-5" />
                      <span className="font-medium">{user?.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/rooms" className="cursor-pointer">
                        Explore Hotels
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login">
                  <Button
                    variant="default"
                    className="bg-gold hover:bg-gold-dark text-accent-foreground font-medium px-6"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 ${
                isScrolled ? "text-foreground" : "text-primary-foreground"
              }`}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-card border-t border-border animate-fade-in">
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-foreground hover:text-gold text-lg font-medium py-2 border-b border-border/50 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 py-4 border-b border-border/50">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-gold" />
                    </div>
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="justify-start text-destructive hover:text-destructive hover:bg-destructive/10 px-0"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-gold hover:bg-gold-dark text-accent-foreground">
                    Sign In
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
