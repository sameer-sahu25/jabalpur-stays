import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  image?: string;
}

export function AuthLayout({ children, title, subtitle, image = "/assets/hero-fort.jpg" }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/20 z-10" />
        <img
          src={image} // Fallback or dynamic
          alt="Luxury Hotel"
          className="object-cover w-full h-full"
          onError={(e) => {
            // Fallback if image fails
            e.currentTarget.src = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop";
          }}
        />
        <div className="absolute bottom-10 left-10 z-20 text-white">
          <h2 className="text-4xl font-serif font-bold mb-2">Jabalpur Stays</h2>
          <p className="text-lg opacity-90">Experience luxury like never before.</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {subtitle}
            </p>
          </div>
          {children}
          <div className="text-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-gold underline underline-offset-4">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
