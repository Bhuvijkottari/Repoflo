import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProcessSection from "@/components/ProcessSection";
import RecruiterSection from "@/components/RecruiterSection";
import FeedbackSection from "@/components/FeedbackSection";
import { Sparkles, Shield, ArrowRight, X, Target } from "lucide-react";
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
            className="fixed bottom-6 right-6 z-50 bg-card border border-border rounded-2xl shadow-card-hover p-5 max-w-xs"
          >
            <button onClick={dismissPopup} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="font-display font-bold text-foreground text-sm">Are you a Recruiter?</span>
            </div>
            <p className="text-xs text-muted-foreground font-body mb-3">
              Try our Recruiter View — get AI-powered candidate assessments, GitHub analytics, and downloadable evaluation reports.
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

      {/* Themes Showcase */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-display font-semibold mb-4">
              20+ Premium Themes
            </div>
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">Themes for Every Style</h2>
            <p className="text-muted-foreground font-body max-w-lg mx-auto">
              From minimal to bold, terminal to luxury — every theme is fully responsive with animations and clickable navigation.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {[
              { name: "Recruiter", image: "blue" },
              { name: "Minimal", image: "blue" },
              { name: "Bold Dark", image: "purple" },
              { name: "Creative", image: "warm" },
              { name: "Terminal", image: "green" },
              { name: "Elegant", image: "mocha" },
              { name: "Neon Cyber", image: "cyan" },
              { name: "Ocean", image: "blue" },
              { name: "Sunset", image: "coral" },
              { name: "Forest", image: "green" },
              { name: "Cherry", image: "pink" },
              { name: "Lavender", image: "purple" },
              { name: "Midnight", image: "midnight" },
              { name: "Coral", image: "coral" },
              { name: "Arctic", image: "cyan" },
              { name: "Mocha", image: "mocha" },
              { name: "Sakura", image: "pink" },
              { name: "Graphite", image: "steel" },
              { name: "Emerald", image: "green" },
              { name: "Royal", image: "purple" },
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
                <div className="h-24 rounded-xl overflow-hidden mb-2 shadow-sm group-hover:shadow-card-hover transition-all duration-300">
                  <img src={getThemeImage(theme.image)} alt={theme.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <p className="text-xs font-display font-medium text-foreground text-center">{theme.name}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="cta" size="lg" className="rounded-full px-10 py-6 text-lg" asChild>
                <Link to="/themes">Start Building Now <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <ProcessSection />
      <RecruiterSection />
      <FeedbackSection />

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-foreground">Repoflow</span>
          </div>
          <p className="text-sm text-muted-foreground font-body mb-2">
            Powered by <span className="font-semibold text-foreground">CODEHEXA</span>
          </p>
          <p className="text-xs text-muted-foreground font-body flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" /> 2026 Repoflow. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
