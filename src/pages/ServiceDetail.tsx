import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronDown } from "lucide-react";
import Layout from "@/components/Layout";
import FadeIn from "@/components/FadeIn";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const serviceData: Record<string, {
  title: string;
  tagline: string;
  overview: string;
  benefits: string[];
  process: { title: string; desc: string }[];
  tools: string[];
  faqs: { q: string; a: string }[];
}> = {
  seo: {
    title: "SEO Services",
    tagline: "Dominate Search Rankings & Drive Organic Growth",
    overview: "Our SEO services combine technical optimization, high-quality content creation, and strategic link building to help your website rank higher on Google. We focus on sustainable, white-hat practices that deliver long-term results.",
    benefits: ["Higher search engine rankings", "Increased organic traffic", "Better user experience", "Long-term sustainable growth", "Local SEO for targeted reach", "Comprehensive keyword strategy"],
    process: [
      { title: "SEO Audit", desc: "Complete analysis of your website's current SEO health." },
      { title: "Keyword Research", desc: "Identify high-value keywords your audience is searching for." },
      { title: "On-Page Optimization", desc: "Optimize content, meta tags, and site structure." },
      { title: "Link Building", desc: "Build authoritative backlinks to boost domain authority." },
    ],
    tools: ["Google Search Console", "SEMrush", "Ahrefs", "Screaming Frog", "Google Analytics", "Moz"],
    faqs: [
      { q: "How long does SEO take to show results?", a: "Typically 3-6 months to see significant results, with continuous improvement over time." },
      { q: "Do you guarantee #1 rankings?", a: "No ethical SEO agency can guarantee specific rankings. We focus on sustainable growth and measurable improvements." },
      { q: "What's included in your SEO package?", a: "Technical audit, keyword research, on-page optimization, content strategy, link building, and monthly reporting." },
    ],
  },
  "social-media": {
    title: "Social Media Marketing",
    tagline: "Build Engaged Communities & Drive Brand Awareness",
    overview: "We create and execute social media strategies that build authentic connections with your audience. From content creation to community management, we handle everything so you can focus on your business.",
    benefits: ["Increased brand awareness", "Higher engagement rates", "Community building", "Lead generation", "Brand loyalty", "Social proof"],
    process: [
      { title: "Strategy Development", desc: "Create a custom social media strategy aligned with your goals." },
      { title: "Content Creation", desc: "Design scroll-stopping content that resonates with your audience." },
      { title: "Community Management", desc: "Engage with your audience and build meaningful relationships." },
      { title: "Analytics & Optimization", desc: "Track performance and optimize for continuous improvement." },
    ],
    tools: ["Meta Business Suite", "Canva Pro", "Buffer", "Hootsuite", "Sprout Social", "Later"],
    faqs: [
      { q: "Which platforms do you manage?", a: "We manage Instagram, Facebook, LinkedIn, Twitter, and YouTube." },
      { q: "How many posts per week?", a: "Depends on your plan, typically 3-7 posts per platform per week." },
      { q: "Do you create the content?", a: "Yes! Our creative team handles everything from graphics to copy." },
    ],
  },
  "meta-ads": {
    title: "Meta Ads Management",
    tagline: "Precision-Targeted Ads That Convert on Facebook & Instagram",
    overview: "Our Meta advertising experts create high-converting campaigns on Facebook and Instagram. We use advanced targeting, creative testing, and data-driven optimization to maximize your return on ad spend.",
    benefits: ["Laser-focused audience targeting", "High-converting ad creatives", "Retargeting campaigns", "Lookalike audiences", "Detailed ROI tracking", "Scalable lead generation"],
    process: [
      { title: "Audience Research", desc: "Identify and segment your ideal customer profiles." },
      { title: "Creative Development", desc: "Design and test multiple ad variations." },
      { title: "Campaign Launch", desc: "Set up optimized campaign structure and bidding." },
      { title: "Optimize & Scale", desc: "Continuously optimize based on real-time performance data." },
    ],
    tools: ["Meta Ads Manager", "Facebook Pixel", "Meta Business Suite", "Canva", "AdEspresso", "Google Analytics"],
    faqs: [
      { q: "What's the minimum ad budget?", a: "We recommend a minimum of ₹15,000/month for effective results." },
      { q: "How quickly can I see results?", a: "Most clients see leads within the first week of campaign launch." },
      { q: "Do you handle creative production?", a: "Yes, we create all ad creatives, copy, and landing pages." },
    ],
  },
  "google-ads": {
    title: "Google Ads (PPC)",
    tagline: "Maximize ROI with Data-Driven Search & Display Campaigns",
    overview: "Our certified Google Ads specialists create and manage high-performing PPC campaigns. From search to display to shopping campaigns, we optimize every click to deliver maximum return on investment.",
    benefits: ["Immediate visibility on Google", "Pay only for results", "Precise audience targeting", "Measurable ROI", "Competitive advantage", "Scalable campaigns"],
    process: [
      { title: "Account Setup", desc: "Set up optimized Google Ads account and tracking." },
      { title: "Keyword Strategy", desc: "Research and select high-intent, cost-effective keywords." },
      { title: "Ad Creation", desc: "Write compelling ad copy and design landing pages." },
      { title: "Monitor & Optimize", desc: "Daily monitoring and bid optimization for best performance." },
    ],
    tools: ["Google Ads", "Google Analytics", "Google Tag Manager", "SEMrush", "SpyFu", "Unbounce"],
    faqs: [
      { q: "How much should I spend on Google Ads?", a: "Budget depends on your industry and goals. We recommend starting with ₹20,000-50,000/month." },
      { q: "What's a good Cost Per Lead?", a: "Varies by industry. We work to continuously reduce your CPL while maintaining lead quality." },
      { q: "Do you manage Shopping campaigns?", a: "Yes, we manage Search, Display, Shopping, and YouTube campaigns." },
    ],
  },
  "web-development": {
    title: "Website Development",
    tagline: "Modern, Fast Websites Built for Conversion",
    overview: "We build beautiful, mobile-responsive websites that not only look great but are engineered for performance and conversion. From landing pages to full e-commerce solutions, we deliver exceptional web experiences.",
    benefits: ["Mobile-responsive design", "Fast loading speeds", "SEO-optimized structure", "Conversion-focused UX", "CMS integration", "Ongoing support"],
    process: [
      { title: "Discovery & Planning", desc: "Understand your business needs and map the user journey." },
      { title: "Design & Prototype", desc: "Create stunning UI/UX designs for approval." },
      { title: "Development", desc: "Build with modern tech for speed and scalability." },
      { title: "Launch & Support", desc: "Deploy, test, and provide ongoing maintenance." },
    ],
    tools: ["React", "Next.js", "WordPress", "Shopify", "Figma", "Google PageSpeed"],
    faqs: [
      { q: "How long does a website take to build?", a: "Typically 2-6 weeks depending on complexity and features." },
      { q: "Do you provide hosting?", a: "We recommend and help set up hosting, and can manage it for you." },
      { q: "Can you redesign my existing website?", a: "Absolutely! We specialize in website redesigns and migrations." },
    ],
  },
};

const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/50 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors">
        <span className="font-heading font-semibold text-foreground pr-4">{q}</span>
        <ChevronDown size={20} className={`text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5 text-muted-foreground leading-relaxed">{a}</div>}
    </div>
  );
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = serviceData[slug || ""];

  if (!service) {
    return (
      <Layout>
        <div className="pt-32 pb-20 container text-center">
          <h1 className="font-heading font-bold text-3xl text-foreground mb-4">Service Not Found</h1>
          <Link to="/services"><Button variant="secondary">View All Services</Button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" />
        </div>
        <div className="container relative z-10 text-center max-w-4xl mx-auto">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-4 py-1.5 rounded-full bg-secondary/15 text-secondary text-xs font-heading font-semibold uppercase tracking-wider mb-6 border border-secondary/20">
            {service.title}
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground leading-tight mb-6">
            {service.tagline}
          </motion.h1>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20 bg-background">
        <div className="container max-w-4xl">
          <FadeIn>
            <SectionHeading label="Overview" title="What We Do" />
            <p className="text-muted-foreground text-lg leading-relaxed text-center">{service.overview}</p>
          </FadeIn>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-muted/50">
        <div className="container max-w-4xl">
          <FadeIn>
            <SectionHeading label="Benefits" title="Why Choose This Service" />
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-4">
            {service.benefits.map((b, i) => (
              <FadeIn key={b} delay={i * 0.05}>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-card shadow-card border border-border/50">
                  <CheckCircle2 size={20} className="text-secondary shrink-0" />
                  <span className="text-foreground font-medium">{b}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-background">
        <div className="container max-w-4xl">
          <FadeIn>
            <SectionHeading label="Our Process" title="How We Work" />
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-6">
            {service.process.map((p, i) => (
              <FadeIn key={p.title} delay={i * 0.1}>
                <div className="p-6 rounded-2xl bg-card shadow-card border border-border/50">
                  <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-heading font-bold text-sm mb-4">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      {slug !== "seo" ? (
        <section className="py-20 bg-muted/50">
          <div className="container max-w-4xl">
            <FadeIn>
              <SectionHeading label="Tools" title="Technologies We Use" />
            </FadeIn>
            <div className="flex flex-wrap justify-center gap-3">
              {service.tools.map((t) => (
                <span
                  key={t}
                  className="px-5 py-2.5 rounded-full bg-card shadow-card border border-border/50 text-sm font-medium text-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* FAQ */}
      <section className="py-20 bg-background">
        <div className="container max-w-3xl">
          <FadeIn>
            <SectionHeading label="FAQ" title="Frequently Asked Questions" />
          </FadeIn>
          <div className="space-y-3">
            {service.faqs.map((f) => (
              <FadeIn key={f.q}>
                <FAQItem q={f.q} a={f.a} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-hero">
        <div className="container text-center">
          <FadeIn>
            <h2 className="font-heading font-bold text-3xl md:text-5xl text-primary-foreground mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto mb-10">
              Book a free consultation and let's discuss how {service.title.toLowerCase()} can transform your business.
            </p>
            <Link to="/contact">
              <Button size="lg" variant="secondary" className="shadow-button font-heading font-semibold text-base px-10 h-13">
                Get Free Consultation <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceDetail;
