import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, CalendarClock } from "lucide-react";
import Layout from "@/components/Layout";
import FadeIn from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const PRIVYR_WEBHOOK_URL =
  (import.meta.env.VITE_PRIVYR_WEBHOOK_URL ?? "").trim() ||
  "https://www.privyr.com/api/v1/incoming-leads/0vZfjMQw/cgVVSiYW";

const contactInfo = [
  { icon: Phone, label: "Phone", value: "+91 8623829117", href: "tel:+918623829117" },
  { icon: Mail, label: "Email", value: "brandbandhu.praavi@gmail.com", href: "mailto:brandbandhu.praavi@gmail.com" },
  { icon: MapPin, label: "Address", value: "1st Floor, Anand Complex, Solapur - Pune Hwy, near Ambika Jewellers, Loni Kalbhor, Pune, Maharashtra 412201", href: "#" },
  { icon: Clock, label: "Working Hours", value: "Mon-Sat, 9 AM - 6 PM", href: "#" },
];

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

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
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
      source: "Website Contact Form",
      notes: `Service: ${service}\nMessage: ${message}`,
      fields: {
        service,
        message,
        page: "Contact",
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
        const message = await response.text();
        throw new Error(message || "Contact request failed");
      }

      form.reset();
      toast({ title: "Message Sent", description: "Our team will get back to you within 24 hours." });
    } catch (error) {
      const description =
        error instanceof Error && error.message
          ? error.message
          : "Please try again in a moment or contact us on WhatsApp.";

      toast({
        title: "Submission failed",
        description,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="pt-32 pb-20 bg-hero relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-pulse-glow" />
        </div>
        <div className="container relative z-10 text-center max-w-5xl mx-auto">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-4 py-1.5 rounded-full bg-secondary/15 text-secondary text-xs font-heading font-semibold uppercase tracking-wider mb-6 border border-secondary/20">
            Contact
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-heading font-extrabold text-4xl md:text-6xl text-primary-foreground leading-tight mb-6">
            Let’s Plan Your
            <span className="text-gradient"> Next Growth Phase</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-primary-foreground/75 max-w-3xl mx-auto">
            Share your goals and current challenges. We’ll suggest a practical roadmap tailored to your business.
          </motion.p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <FadeIn>
                <div className="rounded-3xl section-surface p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-5">
                    <Send className="text-secondary" />
                    <h2 className="font-heading font-bold text-2xl text-foreground">Request Free Consultation</h2>
                  </div>
                  <p className="text-muted-foreground mb-8">Fill in your details and our strategist will contact you within one business day.</p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                        <Input name="name" placeholder="Your name" required />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                        <Input name="email" type="email" placeholder="name@company.com" required />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Phone</label>
                        <Input name="phone" placeholder="+91-XXXXXXXXXX" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Primary Service</label>
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
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Message</label>
                      <Textarea name="message" placeholder="Tell us what you want to achieve in the next 3-6 months..." rows={5} required />
                    </div>

                    <Button type="submit" variant="secondary" size="lg" className="w-full shadow-button font-heading font-semibold" disabled={loading}>
                      {loading ? "Sending..." : "Send Request"}
                    </Button>
                  </form>
                </div>
              </FadeIn>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <FadeIn delay={0.1}>
                <div className="rounded-3xl bg-card shadow-card border border-border/60 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CalendarClock className="text-secondary" />
                    <h3 className="font-heading font-semibold text-xl">Consultation Slots</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Available Monday to Saturday. Share your preferred time and we’ll schedule a strategy call.
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.15}>
                <div className="space-y-4">
                  {contactInfo.map((c) => (
                    <a key={c.label} href={c.href} className="flex items-start gap-4 p-5 rounded-2xl bg-card shadow-card border border-border/60 hover:shadow-card-hover transition-shadow">
                      <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                        <c.icon size={20} className="text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{c.label}</p>
                        <p className="font-medium text-foreground">{c.value}</p>
                      </div>
                    </a>
                  ))}

                  <a
                    href="https://wa.me/918623829117"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-5 rounded-2xl bg-green-50 border border-green-200 hover:bg-green-100 transition-colors"
                  >
                    <MessageCircle size={24} className="text-green-600" />
                    <div>
                      <p className="font-heading font-semibold text-green-800">Chat on WhatsApp</p>
                      <p className="text-sm text-green-600">Fastest response from our team</p>
                    </div>
                  </a>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="rounded-2xl overflow-hidden border border-border/60 shadow-card">
                  <iframe
                    src="https://www.google.com/maps?q=1st%20Floor%2C%20Anand%20Complex%2C%20Solapur%20-%20Pune%20Hwy%2C%20near%20Ambika%20Jewellers%2C%20Loni%20Kalbhor%2C%20Pune%2C%20Maharashtra%20412201&output=embed"
                    width="100%"
                    height="240"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="BrandBandhu Location"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
