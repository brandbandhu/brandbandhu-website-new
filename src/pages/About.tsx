import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Target, Eye, Lightbulb, BadgeCheck, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import FadeIn from "@/components/FadeIn";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";


const values = [
  "Strategy before execution",
  "Clear accountability and reporting",
  "Creative backed by data",
  "Long-term growth partnerships",
];

const About = () => (
  <Layout>
    <section className="pt-28 pb-20 bg-hero relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-pulse-glow" />
      </div>
      <div className="container relative z-10 max-w-5xl mx-auto text-center">
        <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-4 py-1.5 rounded-full bg-secondary/15 text-secondary text-xs font-heading font-semibold uppercase tracking-wider mb-6 border border-secondary/20">
          About BrandBandhu
        </motion.span>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-heading font-extrabold text-4xl md:text-6xl text-primary-foreground leading-tight mb-6">
          We Build Growth Systems,
          <span className="text-gradient"> Not Just Campaigns</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-primary-foreground/75 leading-relaxed max-w-3xl mx-auto">
          BrandBandhu is a performance-driven digital marketing agency from Pune helping ambitious brands turn attention into measurable revenue.
        </motion.p>
      </div>
    </section>

    <section className="py-20 bg-background/50">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-10">
          <FadeIn>
            <div className="section-surface rounded-3xl p-8 h-full">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <Target size={22} className="text-secondary" />
              </div>
              <h3 className="font-heading font-bold text-2xl text-foreground mb-3">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                Help businesses make confident marketing decisions with structured strategy, disciplined execution, and transparent measurement.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="section-surface rounded-3xl p-8 h-full">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                <Eye size={22} className="text-accent-foreground" />
              </div>
              <h3 className="font-heading font-bold text-2xl text-foreground mb-3">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                Become India’s most trusted growth partner for brands that value consistency, clarity, and sustainable scale.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>

    <section className="py-20 bg-background">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-14 items-stretch">
          <FadeIn>
            <div className="relative h-full">
              <div className="h-full rounded-3xl section-surface flex items-center justify-center p-8">
                <div className="text-center">
                  <Lightbulb size={62} className="text-secondary mx-auto mb-4" />
                  <p className="font-heading font-semibold text-foreground text-lg">Founder’s Growth Philosophy</p>
                  <p className="text-muted-foreground mt-2">Strategy. Execution. Compounding results.</p>
                </div>
              </div>
              <div className="absolute -bottom-5 -right-5 glass-panel rounded-2xl px-4 py-3 text-sm font-medium text-foreground">
                Since 2020
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <SectionHeading label="Our Story" title="Built in Pune, Trusted Across Industries" center={false} />
            <p className="text-muted-foreground leading-relaxed mb-4">
              We started BrandBandhu with one core belief: growing brands online should be strategic, accountable, and measurable.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              From an early two-person setup to a specialized team, our approach has stayed consistent: understand the business deeply, then execute with precision.
            </p>
            <div className="space-y-3">
              {values.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <BadgeCheck size={18} className="text-secondary mt-0.5" />
                  <span className="text-foreground/90">{item}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>

    <section className="py-20 bg-hero">
      <div className="container text-center">
        <FadeIn>
          <Sparkles className="text-secondary mx-auto mb-4" />
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-primary-foreground mb-6">
            Want to Build Long-Term Growth?
          </h2>
          <p className="text-primary-foreground/75 text-lg max-w-2xl mx-auto mb-10">
            Let’s design a strategy aligned to your market, budget, and growth goals.
          </p>
          <Link to="/contact">
            <Button size="lg" variant="secondary" className="shadow-button font-heading font-semibold text-base px-10 h-13">
              Talk to Our Team <ArrowRight className="ml-2" size={18} />
            </Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  </Layout>
);

export default About;



