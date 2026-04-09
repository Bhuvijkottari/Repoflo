import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Palette, Zap, Star, Users, ChevronDown, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroShapes from "@/assets/hero-shapes.png";
import { incrementVisitorCount, getVisitorCount, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

const HeroSection = () => {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    // Increment visitor count (fire and forget — onSnapshot will pick up the result)
    incrementVisitorCount().catch(() => {});

    // Real-time listener — always the source of truth for display
    const unsub = onSnapshot(
      doc(db, "site_stats", "visitors"),
      (snap) => {
        if (snap.exists()) {
          setVisitorCount(snap.data().count || 0);
        }
      },
      () => {
        // If listener fails, try a one-time read
        getVisitorCount().then((count) => setVisitorCount(count || 0));
      }
    );

    // Timeout fallback — if nothing resolved in 5s, show at least 1
    const timeout = setTimeout(() => {
      setVisitorCount((prev) => prev === null ? 1 : prev);
    }, 5000);

    return () => { unsub(); clearTimeout(timeout); };
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center pt-16 bg-[#0b1f3a]">
      
      {/* Animated background blobs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.04, 0.1, 0.04] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-[#3fc4e7]/10 blur-3xl"
      />

      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.03, 0.08, 0.03] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 left-0 w-96 h-96 rounded-full bg-[#69d2f1]/10 blur-3xl"
      />

      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-[#3fc4e7]/10 blur-3xl"
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
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
            className="inline-flex items-center gap-2 bg-[#3fc4e7]/10 text-[#69d2f1] px-4 py-1.5 rounded-full text-sm font-display font-semibold backdrop-blur-sm border border-[#3fc4e7]/20"
          >
            <Sparkles className="w-4 h-4" /> Powered by DEVORA TECHNOLOGIES
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-white tracking-tight"
          >
            Create a Stunning{" "}
            <span className="text-[#69d2f1]">Portfolio</span>{" "}
            in Minutes
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-[#b8c7e0] max-w-md font-body mb-6 leading-relaxed"
          >
            No coding. No stress. Just results.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4"
          >

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="cta"
                size="lg"
                className="rounded-full px-10 py-6 text-xl bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black"
                asChild
              >
                <Link to="/themes">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 py-6 text-lg border-2 border-[#3fc4e7]/40 text-white backdrop-blur-sm"
                asChild
              >
                <a
                  href="#process"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("process")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  How it Works <ChevronDown className="ml-1 w-4 h-4" />
                </a>
              </Button>
            </motion.div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-3 pt-4 text-[#b8c7e0] font-body text-sm"
          >
            <div className="flex items-center gap-2 bg-[#132f52] px-3 py-1.5 rounded-full backdrop-blur-sm">
              <Github className="w-4 h-4" />
              <span>GitHub + Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
              <span className="font-semibold text-white">Website</span>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex gap-8 pt-6 flex-wrap"
          >
            {[
              { icon: <Zap className="w-4 h-4 text-[#3fc4e7]" />, value: "20+", label: "Themes" },
              { icon: <Star className="w-4 h-4 text-[#3fc4e7]" />, value: "AI", label: "Powered" },
              { icon: <Users className="w-4 h-4 text-[#3fc4e7]" />, value: visitorCount !== null ? (visitorCount > 0 ? visitorCount.toLocaleString() : "0") : "...", label: "Visitors" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-[#3fc4e7]/20 flex items-center justify-center">
                  {stat.icon}
                </div>
                <div>
                  <span className="font-display font-bold text-white text-sm">{stat.value}</span>
                  <span className="text-[#b8c7e0] text-xs ml-1">{stat.label}</span>
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
          <img src={heroShapes} alt="Portfolio preview shapes" className="w-full drop-shadow-2xl" />
        </motion.div>

      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
      >
        <span className="text-xs text-[#b8c7e0] font-body">Scroll to explore</span>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-[#b8c7e0]" />
        </motion.div>

      </motion.div>

    </section>
  );
};

export default HeroSection;