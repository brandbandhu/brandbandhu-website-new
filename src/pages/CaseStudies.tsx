import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CircleCheckBig } from "lucide-react";
import Layout from "@/components/Layout";
import FadeIn from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { contentApi, type CaseStudyRecord } from "@/lib/contentApi";

type CaseStudy = {
  id: number | string;
  title: string;
  client: string;
  problem: string;
  strategy: string;
  impact: string[];
  tags: string[];
  imageUrl?: string | null;
};

const legacyCaseStudies: CaseStudy[] = [
  {
    id: -1,
    title: "Solar Company Generated 400+ Leads in 3 Months",
    client: "SolarMax India",
    problem: "Low online visibility and limited qualified lead flow from digital channels.",
    strategy: "Combined high-intent Google Ads, structured Meta retargeting, and SEO foundation.",
    impact: ["400+ qualified leads", "65% lower CPL", "3x ROAS", "Top rankings for 15 keywords"],
    tags: ["Google Ads", "Meta Ads", "SEO"],
  },
  {
    id: -2,
    title: "E-Commerce Brand Scaled Revenue 5x in 6 Months",
    client: "FashionHive",
    problem: "High ad spend but poor conversion and weak repeat purchase behavior.",
    strategy: "Funnel-focused creative, CRO-led landing pages, and retargeting automation.",
    impact: ["5x revenue growth", "40% conversion lift", "250% ad ROI", "50K+ follower growth"],
    tags: ["Social Media", "CRO", "Meta Ads"],
  },
  {
    id: -3,
    title: "Real Estate Firm Booked 200+ Site Visits",
    client: "UrbanNest Realty",
    problem: "Lead quality mismatch and rising acquisition costs.",
    strategy: "Location-specific ad funnels, custom landing pages, and nurture workflows.",
    impact: ["200+ site visits", "55% CPL reduction", "30% lead-to-visit rate", "2 Cr+ attributed sales"],
    tags: ["Meta Ads", "Landing Pages", "Lead Nurture"],
  },
];

const toImpact = (value: string) =>
  value
    .split(/\r?\n+/)
    .map((item) => item.trim())
    .filter(Boolean);

const CaseStudies = () => {
  const [items, setItems] = useState<CaseStudy[]>(legacyCaseStudies);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCaseStudies = async () => {
      try {
        const data = await contentApi.listPublicCaseStudies();
        const mapped = data.map((item: CaseStudyRecord) => ({
          id: item.id,
          title: item.title,
          client: item.client_name || "Client",
          problem: item.challenge,
          strategy: item.solution,
          impact: toImpact(item.results ?? ""),
          tags: item.tags ?? (item.industry ? [item.industry] : []),
          imageUrl: item.image_url,
        }));
        if (mapped.length) {
          setItems(mapped);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load case studies");
      } finally {
        setLoading(false);
      }
    };

    void loadCaseStudies();
  }, []);

  return (
    <Layout>
      <section className="pt-32 pb-20 bg-hero relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-pulse-glow" />
        </div>
        <div className="container relative z-10 text-center max-w-5xl mx-auto">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-4 py-1.5 rounded-full bg-secondary/15 text-secondary text-xs font-heading font-semibold uppercase tracking-wider mb-6 border border-secondary/20">
            Case Studies
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-heading font-extrabold text-4xl md:text-6xl text-primary-foreground leading-tight mb-6">
            Growth Stories Backed by
            <span className="text-gradient"> Real Numbers</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-primary-foreground/75 max-w-3xl mx-auto">
            Explore how strategic execution across channels translated into measurable business outcomes.
          </motion.p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background">
        <div className="container max-w-6xl">
          {loading ? <p className="text-center text-muted-foreground mb-8">Loading case studies...</p> : null}
          {error ? <p className="text-center text-destructive mb-8">{error}</p> : null}
          <div className="relative md:pb-32">
            {items.map((cs, i) => (
              <motion.div
                key={cs.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="mb-8 md:mb-10 last:mb-0"
              >
                <motion.div whileHover={{ y: -3 }} className="rounded-3xl border border-border/60 bg-card shadow-card overflow-hidden">
                  <div className="grid lg:grid-cols-12">
                    <div className="lg:col-span-3 bg-hero p-6 md:p-8 text-primary-foreground">
                      <p className="text-xs uppercase tracking-wider text-secondary mb-2">Client</p>
                      <h3 className="font-heading font-bold text-xl mb-4">{cs.client}</h3>
                      <div className="flex flex-wrap gap-2">
                        {cs.tags.map((tag) => (
                          <span key={tag} className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/20">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-9 p-6 md:p-8">
                      <h2 className="font-heading font-bold text-2xl text-foreground mb-5">{cs.title}</h2>
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="section-surface rounded-xl p-4">
                          <p className="text-xs uppercase tracking-wider text-secondary mb-2">Challenge</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{cs.problem}</p>
                        </div>
                        <div className="section-surface rounded-xl p-4">
                          <p className="text-xs uppercase tracking-wider text-secondary mb-2">Approach</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{cs.strategy}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wider text-secondary mb-3">Impact</p>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {cs.impact.map((item) => (
                            <div key={item} className="flex items-center gap-2 text-sm font-medium text-foreground/90">
                              <CircleCheckBig size={16} className="text-secondary" />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-hero">
        <div className="container text-center">
          <FadeIn>
            <h2 className="font-heading font-bold text-3xl md:text-5xl text-primary-foreground mb-6">
              Want Similar Results for Your Brand?
            </h2>
            <p className="text-primary-foreground/75 text-lg max-w-2xl mx-auto mb-10">
              Let’s map your business goals and build a channel strategy tailored to your market.
            </p>
            <Link to="/contact">
              <Button size="lg" variant="secondary" className="shadow-button font-heading font-semibold text-base px-10 h-13">
                Book a Strategy Call <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
};

export default CaseStudies;
