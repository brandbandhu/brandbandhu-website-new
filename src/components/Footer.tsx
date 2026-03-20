import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import logo from "@/assets/Logo .png";

const services = [
  { label: "SEO Services", path: "/services/seo" },
  { label: "Social Media Marketing", path: "/services/social-media" },
  { label: "Meta Ads", path: "/services/meta-ads" },
  { label: "Google Ads (PPC)", path: "/services/google-ads" },
  { label: "Website Development", path: "/services/web-development" },
];

const company = [
  { label: "About Us", path: "/about" },
  { label: "Case Studies", path: "/case-studies" },
  { label: "Blog", path: "/blog" },
  { label: "Contact", path: "/contact" },
];

const Footer = () => (
  <footer className="relative overflow-hidden bg-hero text-primary-foreground mt-20">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
    </div>

    <div className="container py-16 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="mb-4">
            <img src={logo} alt="BrandBandhu logo" className="w-28 h-28 md:w-32 md:h-32 object-contain" />
          </div>
          <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
            A premium digital marketing agency focused on growth and performance marketing for ambitious brands.
          </p>
          <div className="flex gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="w-9 h-9 rounded-lg bg-white/10 hover:bg-secondary/25 flex items-center justify-center transition-colors"
            >
              <Facebook size={16} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="w-9 h-9 rounded-lg bg-white/10 hover:bg-secondary/25 flex items-center justify-center transition-colors"
            >
              <Instagram size={16} />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-lg bg-white/10 hover:bg-secondary/25 flex items-center justify-center transition-colors"
            >
              <Linkedin size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4 text-primary-foreground/50">Services</h4>
          <ul className="space-y-2">
            {services.map((s) => (
              <li key={s.path}>
                <Link to={s.path} className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4 text-primary-foreground/50">Company</h4>
          <ul className="space-y-2">
            {company.map((c) => (
              <li key={c.path}>
                <Link to={c.path} className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4 text-primary-foreground/50">Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-primary-foreground/70">
              <Phone size={16} className="mt-0.5 text-secondary shrink-0" />
              +91 8623829117
            </li>
            <li className="flex items-start gap-3 text-sm text-primary-foreground/70">
              <Mail size={16} className="mt-0.5 text-secondary shrink-0" />
              brandbandhu.praavi@gmail.com
            </li>
            <li className="flex items-start gap-3 text-sm text-primary-foreground/70">
              <MapPin size={16} className="mt-0.5 text-secondary shrink-0" />
              1st Floor, Anand Complex, Solapur - Pune Hwy, near Ambika Jewellers, Loni Kalbhor, Pune, Maharashtra 412201
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div className="border-t border-white/10 relative z-10">
      <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/50">
        <span>© 2026 BrandBandhu. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary-foreground transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
