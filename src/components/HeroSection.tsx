import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Palette, Zap, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroShapes from "@/assets/hero-shapes.png";
import { getVisitorCount, incrementVisitorCount } from "@/lib/firebase";

const HeroSection = () => {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    incrementVisitorCount().then(setVisitorCount).catch(() => {});
  }, []);

  return (
    <section className="relative min-h-screen gradient-hero overflow-hidden flex items-center pt-16">
      {/* Animated background blobs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.08, 0.05] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 left-0 w-80 h-80 rounded-full bg-accent/5 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-primary/3 blur-3xl"
      />

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-display font-semibold"
          >
            <Palette className="w-4 h-4" /> Powered by CODEHEXA
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-foreground"
          >
            Create a Stunning{" "}
            <span className="text-gradient">Portfolio</span>{" "}
            in Minutes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-muted-foreground max-w-md font-body mb-6"
          >
            No coding. No stress. Just results.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex justify-center lg:justify-start"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="cta" size="lg" className="rounded-full px-10 py-6 text-xl shadow-glow" asChild>
                <Link to="/themes">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>


          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-3 pt-4 text-muted-foreground font-body text-sm"
          >
            <Github className="w-5 h-5" />
            <span>GitHub + Resume</span>
            <ArrowRight className="w-4 h-4" />
            <span className="font-semibold text-foreground">Website</span>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex gap-8 pt-6"
          >
            {[
              { icon: <Zap className="w-4 h-4 text-primary" />, value: "20+", label: "Themes" },
              { icon: <Star className="w-4 h-4 text-primary" />, value: "AI", label: "Powered" },
              { icon: <Users className="w-4 h-4 text-primary" />, value: visitorCount > 0 ? visitorCount.toLocaleString() : "—", label: "Visitors" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                {stat.icon}
                <div>
                  <span className="font-display font-bold text-foreground text-sm">{stat.value}</span>
                  <span className="text-muted-foreground text-xs ml-1">{stat.label}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right visual */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="relative hidden lg:block"
        >
          <img src={heroShapes} alt="Portfolio preview shapes" className="w-full" />

          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-0 bg-card rounded-xl shadow-card p-4 min-w-[140px]"
          >
            <p className="font-display font-semibold text-sm text-foreground">Skills</p>
            <div className="mt-2 space-y-1.5">
              <div className="h-2 rounded-full bg-primary/70 w-full" />
              <div className="h-2 rounded-full bg-accent/60 w-4/5" />
              <div className="h-2 rounded-full bg-primary/40 w-3/5" />
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, -1, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-1/3 left-8 bg-card rounded-xl shadow-card p-4 min-w-[140px]"
          >
            <p className="font-display font-semibold text-sm text-foreground">20+ Themes</p>
            <div className="flex gap-1.5 mt-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20" />
              <div className="w-8 h-8 rounded-lg bg-accent/20" />
              <div className="w-8 h-8 rounded-lg bg-primary/30" />
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, 1.5, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 right-12 bg-card rounded-xl shadow-card p-4 min-w-[140px]"
          >
            <p className="font-display font-semibold text-sm text-foreground">Experience</p>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-primary/20 border-2 border-card -ml-1 first:ml-0" />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
