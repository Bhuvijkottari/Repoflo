import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProcessSection from "@/components/ProcessSection";
import RecruiterSection from "@/components/RecruiterSection";
import FeedbackSection from "@/components/FeedbackSection";
import { ArrowRight, X, Target, Sparkles, Layers, Wand2, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import themeBlue from "@/assets/theme-preview-blue.jpg";
import themeWarm from "@/assets/theme-preview-warm.jpg";
import themeDark from "@/assets/theme-preview-dark.jpg";
import themeGreen from "@/assets/theme-preview-green.jpg";
import themePink from "@/assets/theme-preview-pink.jpg";
import themePurple from "@/assets/theme-preview-purple.jpg";
import themeCoral from "@/assets/theme-preview-coral.jpg";
import themeCyan from "@/assets/theme-preview-cyan.jpg";
import themeMocha from "@/assets/theme-preview-mocha.jpg";
import themeMidnight from "@/assets/theme-preview-midnight.jpg";
import themeSteel from "@/assets/theme-preview-steel.jpg";
import themeOcean from "@/assets/theme-preview-ocean.jpg";
import themeSunset from "@/assets/theme-preview-sunset.jpg";
import themeForest from "@/assets/theme-preview-forest.jpg";
import themeCherry from "@/assets/theme-preview-cherry.jpg";
import themeLavender from "@/assets/theme-preview-lavender.jpg";
import themeArctic from "@/assets/theme-preview-arctic.jpg";
import themeEmerald from "@/assets/theme-preview-emerald.jpg";
import themeRoyal from "@/assets/theme-preview-royal.jpg";
import themeRocket from "@/assets/theme-preview-rocket.jpg";
import themeSakura from "@/assets/theme-preview-sakura.jpg";
import themeNeon from "@/assets/theme-preview-neon.jpg";
import themeElegant from "@/assets/theme-preview-elegant.jpg";
import themeMinimal from "@/assets/theme-preview-minimal.jpg";
import themeBold from "@/assets/theme-preview-bold.jpg";
import themeCreative from "@/assets/theme-preview-creative.jpg";
import themeTerminal from "@/assets/theme-preview-terminal.jpg";
import themeRecruiter from "@/assets/theme-preview-recruiter.jpg";

const themeImageMap: Record<string, string> = {
  blue: themeBlue, warm: themeWarm, dark: themeDark, green: themeGreen, pink: themePink,
  purple: themePurple, coral: themeCoral, cyan: themeCyan, mocha: themeMocha, midnight: themeMidnight, steel: themeSteel,
  ocean: themeOcean, sunset: themeSunset, forest: themeForest, cherry: themeCherry, lavender: themeLavender,
  arctic: themeArctic, emerald: themeEmerald, royal: themeRoyal, rocket: themeRocket, sakura: themeSakura,
  neon: themeNeon, elegant: themeElegant, minimal: themeMinimal, bold: themeBold, creative: themeCreative,
  terminal: themeTerminal, recruiter: themeRecruiter,
};

const getThemeImage = (category: string) => themeImageMap[category] || themeBlue;

const featureHighlights = [
  { icon: Wand2, title: "AI Powered", desc: "Smart content generation from your GitHub and resume data" },
  { icon: Layers, title: "20+ Themes", desc: "Handcrafted, fully responsive designs with smooth animations" },
  { icon: Globe, title: "One Click Deploy", desc: "Download production-ready HTML instantly, host anywhere" },
];

const Index = () => {
  const [showRecruiterPopup, setShowRecruiterPopup] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("recruiterPopupDismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setShowRecruiterPopup(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissPopup = () => {
    setShowRecruiterPopup(false);
    sessionStorage.setItem("recruiterPopupDismissed", "true");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      {/* Recruiter Popup */}
      <AnimatePresence>
        {showRecruiterPopup && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 glass-card rounded-2xl shadow-card-hover p-5 max-w-xs"
          >
            <button onClick={dismissPopup} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="font-display font-bold text-foreground text-sm">Are you a Recruiter?</span>
            </div>
            <p className="text-xs text-muted-foreground font-body mb-3">
              Try our Recruiter View for AI powered candidate assessments, GitHub analytics, and evaluation reports.
            </p>
            <div className="flex gap-2">
              <Button variant="cta" size="sm" className="rounded-full text-xs px-4" asChild>
                <Link to="/themes" onClick={dismissPopup}>
                  Try Recruiter View <ArrowRight className="ml-1 w-3.5 h-3.5" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="text-xs" onClick={dismissPopup}>
                Dismiss
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feature Highlights */}
      <section className="py-16 sm:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {featureHighlights.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="relative group"
              >
                <div className="bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-card hover:shadow-card-hover transition-all duration-300 h-full">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl gradient-primary flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    <f.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-bold text-foreground text-base mb-1.5">{f.title}</h3>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Themes Showcase */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-primary/[0.03] to-background pointer-events-none" />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-primary blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.02, 0.05, 0.02] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-accent blur-3xl pointer-events-none"
        />

        <div className="container mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-display font-semibold mb-4"
            >
              <Sparkles className="w-4 h-4" /> 20+ Premium Themes
            </motion.div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Themes for Every <span className="text-gradient">Style</span>
            </h2>
            <p className="text-muted-foreground font-body max-w-lg mx-auto text-base px-2">
              From minimal to bold, terminal to luxury. Every theme is fully responsive with animations and smooth navigation.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {[
              { name: "Recruiter", image: "recruiter" },
              { name: "Minimal", image: "minimal" },
              { name: "Bold Dark", image: "bold" },
              { name: "Creative", image: "creative" },
              { name: "Terminal", image: "terminal" },
              { name: "Elegant", image: "elegant" },
              { name: "Neon Cyber", image: "neon" },
              { name: "Ocean", image: "ocean" },
              { name: "Sunset", image: "sunset" },
              { name: "Forest", image: "forest" },
              { name: "Cherry", image: "cherry" },
              { name: "Lavender", image: "lavender" },
              { name: "Midnight", image: "midnight" },
              { name: "Coral", image: "coral" },
              { name: "Arctic", image: "arctic" },
              { name: "Mocha", image: "mocha" },
              { name: "Sakura", image: "sakura" },
              { name: "Graphite", image: "steel" },
              { name: "Emerald", image: "emerald" },
              { name: "Royal", image: "royal" },
            ].map((theme, i) => (
              <motion.div
                key={theme.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group cursor-pointer"
              >
                <Link to="/themes">
                  <div className="h-28 rounded-xl overflow-hidden mb-2 shadow-card group-hover:shadow-card-hover transition-all duration-300 border border-border/50 group-hover:border-primary/30">
                    <img src={getThemeImage(theme.image)} alt={theme.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <p className="text-xs font-display font-medium text-foreground text-center group-hover:text-primary transition-colors">{theme.name}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-14"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="cta" size="lg" className="rounded-full px-10 py-6 text-lg shadow-glow" asChild>
                <Link to="/themes">Start Building Now <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <ProcessSection />
      <RecruiterSection />
      <FeedbackSection />

      {/* Footer — Clean & Minimal */}
      <footer className="py-8 border-t border-border bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground font-body">
              Powered by <span className="font-semibold text-foreground">CODEHEXA</span>
            </p>
            <p className="text-sm text-muted-foreground font-body">
              © {new Date().getFullYear()} Repoflow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
