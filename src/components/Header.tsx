import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/Logo .png";

const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Case Studies", path: "/case-studies" },
  { label: "Blog", path: "/blog" },
  { label: "Contact", path: "/contact" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHome && !scrolled
          ? "bg-transparent"
          : "bg-white/95 shadow-card border-b border-border/60 backdrop-blur"
      }`}
    >
      <div className="w-full bg-[#0b1c3f] text-white">
        <div className="container flex items-center justify-between h-9 text-xs md:text-sm">
          <span className="font-semibold tracking-wide">Call Us: +91 8623829117</span>
          <span className="font-semibold tracking-wide">Mail Us: brandbandhu.praavi@gmail.com</span>
        </div>
      </div>

      <div className="container flex items-center justify-between h-16 md:h-20 lg:h-24">
        <Link to="/" className="flex items-center group">
          <img
            src={logo}
            alt="BrandBandhu logo"
            className="h-10 md:h-12 lg:h-14 w-auto object-contain transition-transform duration-300 group-hover:-translate-y-0.5"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? "text-secondary bg-secondary/15 shadow-sm"
                  : isHome && !scrolled
                    ? "text-white/90 hover:text-white hover:bg-white/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/10"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link to="/contact">
            <Button variant="secondary" className="shadow-button font-heading font-semibold">
              Get Free Consultation
            </Button>
          </Link>
        </div>

        <button
          className="lg:hidden p-2 rounded-lg text-foreground hover:bg-secondary/10 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 border-b border-border/70 backdrop-blur overflow-hidden"
          >
            <nav className="container py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "text-secondary bg-secondary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/10"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/contact" className="mt-2">
                <Button variant="secondary" className="w-full shadow-button font-heading font-semibold">
                  Get Free Consultation
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

