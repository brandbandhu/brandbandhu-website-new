import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import popupImage from "@/assets/popup 2.png";

const services = [
  "SEO Services",
  "Social Media Marketing",
  "Meta Ads Management",
  "Google Ads (PPC)",
  "Website Development",
  "Performance Marketing",
  "Branding",
  "Content Marketing",
];

const PRIVYR_WEBHOOK_URL =
  (import.meta.env.VITE_PRIVYR_WEBHOOK_URL ?? "").trim() ||
  "https://www.privyr.com/api/v1/incoming-leads/0vZfjMQw/cgVVSiYW";

const Layout = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const hasShownRef = useRef(false);

  useEffect(() => {
    if (!isHome) {
      setShowPopup(false);
      return;
    }

    if (hasShownRef.current) return;
    hasShownRef.current = true;

    const timer = window.setTimeout(() => {
      setShowPopup(true);
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [isHome]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const service = String(formData.get("service") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    const payload = {
      name,
      email,
      phone,
      source: "Website Popup Enquiry",
      notes: `Service: ${service}\nMessage: ${message}`,
      fields: {
        service,
        message,
        page: "Popup",
      },
    };

    setLoading(true);
    try {
      const response = await fetch(PRIVYR_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Submission failed");
      }
      form.reset();
      setShowPopup(false);
      toast({ title: "Thanks! We’ll reach out shortly.", description: "Your enquiry has been received." });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-secondary/20 blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,hsl(var(--primary))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary))_1px,transparent_1px)] [background-size:46px_46px]" />
      </div>
      <Header />
      <main className={`flex-1 relative z-10 ${isHome ? "" : "pt-16 md:pt-20 lg:pt-24"}`}>{children}</main>
      <Footer />

      {showPopup ? (
        <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-[0_50px_120px_-60px_rgba(4,10,25,0.9)] border border-white/20"
          >
            <div className="grid md:grid-cols-2">
              <div className="relative bg-black p-6 flex items-center justify-center min-h-[360px]">
                <img src={popupImage} alt="BrandBandhu Enquiry" className="w-full max-w-sm max-h-[320px] object-contain" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a1834]/60" />
              </div>
              <div className="p-6 md:p-8 relative">
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="absolute right-4 top-4 rounded-full border border-border/60 p-2 text-muted-foreground hover:bg-muted"
                  aria-label="Close popup"
                >
                  <X size={16} />
                </button>
                <div className="mb-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-2">Free Strategy Call</p>
                  <h3 className="font-heading text-2xl font-bold text-foreground">Let’s Grow Your Brand</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Share your goals and we’ll send you a tailored growth plan.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input name="name" placeholder="Full name" required />
                  <Input name="email" type="email" placeholder="Email address" required />
                  <Input name="phone" placeholder="Phone number" />
                  <select
                    name="service"
                    defaultValue=""
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
                  >
                    <option value="" disabled>
                      Select a service
                    </option>
                    {services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                  <Textarea name="message" placeholder="Tell us about your goals..." rows={3} required />
                  <Button type="submit" variant="secondary" className="w-full font-heading font-semibold" disabled={loading}>
                    {loading ? "Sending..." : "Get My Growth Plan"}
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}

      <a
        href="https://wa.me/918623829117"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-green-600 px-4 py-3 text-white shadow-lg hover:bg-green-700 transition-colors"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M19.05 4.94A9.86 9.86 0 0 0 12.03 2C6.5 2 2 6.48 2 12c0 1.76.46 3.48 1.34 5L2 22l5.16-1.3A10.06 10.06 0 0 0 12.03 22C17.55 22 22 17.52 22 12a9.9 9.9 0 0 0-2.95-7.06zM12.03 20.2a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.06.77.82-2.98-.2-.31A8.14 8.14 0 0 1 3.8 12c0-4.54 3.69-8.2 8.23-8.2 2.2 0 4.26.85 5.8 2.4a8.12 8.12 0 0 1 2.4 5.8c0 4.53-3.7 8.2-8.2 8.2zm4.5-6.15c-.24-.12-1.42-.7-1.64-.77-.22-.08-.38-.12-.54.12-.16.24-.62.76-.76.92-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.18-.7-.62-1.17-1.38-1.3-1.62-.14-.24-.01-.37.1-.5.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.42-.54-.43h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.68 2.56 4.08 3.6.57.24 1.02.38 1.37.48.58.18 1.1.16 1.52.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
          </svg>
        </span>
      </a>
    </div>
  );
};

export default Layout;
