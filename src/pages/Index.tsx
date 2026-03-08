import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProcessSection from "@/components/ProcessSection";
import RecruiterSection from "@/components/RecruiterSection";
import FeedbackSection from "@/components/FeedbackSection";
import { Sparkles, Shield } from "lucide-react";
import { motion } from "framer-motion";
import themeBlue from "@/assets/theme-preview-blue.jpg";
import themeWarm from "@/assets/theme-preview-warm.jpg";
import themeDark from "@/assets/theme-preview-dark.jpg";
import themeGreen from "@/assets/theme-preview-green.jpg";
import themePink from "@/assets/theme-preview-pink.jpg";

const themeImageMap: Record<string, string> = {
  blue: themeBlue,
  warm: themeWarm,
  dark: themeDark,
  green: themeGreen,
  pink: themePink,
};

const getThemeImage = (category: string) => themeImageMap[category] || themeBlue;

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

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
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              Themes for Every Style
            </h2>
            <p className="text-muted-foreground font-body max-w-lg mx-auto">
              From minimal to bold, terminal to luxury — every theme is fully responsive with animations and clickable navigation.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {[
              { name: "Recruiter", image: "blue" },
              { name: "Minimal", image: "blue" },
              { name: "Bold Dark", image: "dark" },
              { name: "Creative", image: "warm" },
              { name: "Terminal", image: "green" },
              { name: "Elegant", image: "warm" },
              { name: "Neon Cyber", image: "dark" },
              { name: "Ocean", image: "blue" },
              { name: "Sunset", image: "warm" },
              { name: "Forest", image: "green" },
              { name: "Cherry", image: "pink" },
              { name: "Lavender", image: "pink" },
              { name: "Midnight", image: "dark" },
              { name: "Coral", image: "warm" },
              { name: "Arctic", image: "blue" },
              { name: "Mocha", image: "warm" },
              { name: "Sakura", image: "pink" },
              { name: "Graphite", image: "dark" },
              { name: "Emerald", image: "green" },
              { name: "Royal", image: "dark" },
            ].map((theme, i) => (
              <motion.div
                key={theme.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="group cursor-pointer"
              >
                <div className="h-24 rounded-xl overflow-hidden mb-2 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                  <img src={getThemeImage(theme.image)} alt={theme.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-display font-medium text-foreground text-center">{theme.name}</p>
              </motion.div>
            ))}
          </div>
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
            <span className="font-display font-bold text-foreground">PortfolioForge</span>
          </div>
          <p className="text-sm text-muted-foreground font-body mb-2">
            20+ Themes Developed by <span className="font-semibold text-foreground">ADITHYA</span> and{" "}
            <span className="font-semibold text-foreground">THARUN K SHETTY</span>
          </p>
          <p className="text-xs text-muted-foreground font-body flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" /> 2026 PortfolioForge. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
