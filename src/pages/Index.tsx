import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProcessSection from "@/components/ProcessSection";
import FeedbackSection from "@/components/FeedbackSection";
import { Sparkles, Palette, Shield } from "lucide-react";
import { motion } from "framer-motion";

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
              <Palette className="w-4 h-4" /> 20+ Premium Themes
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
              { name: "Recruiter", color: "from-blue-500 to-indigo-600" },
              { name: "Minimal", color: "from-gray-300 to-gray-500" },
              { name: "Bold Dark", color: "from-purple-600 to-blue-500" },
              { name: "Creative", color: "from-amber-400 to-orange-500" },
              { name: "Terminal", color: "from-green-500 to-emerald-700" },
              { name: "Elegant", color: "from-yellow-600 to-amber-800" },
              { name: "Neon Cyber", color: "from-cyan-400 to-pink-500" },
              { name: "Ocean", color: "from-blue-400 to-teal-500" },
              { name: "Sunset", color: "from-orange-400 to-rose-500" },
              { name: "Forest", color: "from-green-600 to-emerald-800" },
              { name: "Cherry", color: "from-rose-500 to-red-700" },
              { name: "Lavender", color: "from-violet-400 to-purple-600" },
              { name: "Midnight", color: "from-slate-700 to-slate-900" },
              { name: "Coral", color: "from-red-400 to-orange-500" },
              { name: "Arctic", color: "from-cyan-200 to-blue-400" },
              { name: "Mocha", color: "from-amber-700 to-yellow-900" },
              { name: "Sakura", color: "from-pink-300 to-rose-400" },
              { name: "Graphite", color: "from-gray-600 to-gray-800" },
              { name: "Emerald", color: "from-emerald-400 to-green-600" },
              { name: "Royal", color: "from-indigo-500 to-purple-700" },
            ].map((theme, i) => (
              <motion.div
                key={theme.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="group cursor-pointer"
              >
                <div className={`h-24 rounded-xl bg-gradient-to-br ${theme.color} mb-2 group-hover:scale-105 transition-transform duration-300 shadow-sm`} />
                <p className="text-xs font-display font-medium text-foreground text-center">{theme.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ProcessSection />
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
            <Shield className="w-3 h-3" /> © 2026 PortfolioForge. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
