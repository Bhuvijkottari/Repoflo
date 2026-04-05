import { Link } from "react-router-dom";
import logo from "@/favicon/IMG-20260403-WA0058.jpg";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProcessSection from "@/components/ProcessSection";
import RecruiterSection from "@/components/RecruiterSection";
import FeedbackSection from "@/components/FeedbackSection";
import { ArrowRight, Sparkles, Layers, Wand2, Globe } from "lucide-react";
import { motion } from "framer-motion";
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
  return (
    <div className="min-h-screen bg-[#0b1f3a] text-white">
      <Navbar />
      <HeroSection />

      {/* Recruiter Popup */}
      

      {/* Feature Highlights */}
      <section className="py-16 sm:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1f3a] via-[#132f52]/30 to-[#0b1f3a] pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 relative">

          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-xs font-semibold text-[#3fc4e7] tracking-[3px] uppercase mb-3 font-body">Why Repoflo</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Everything you need to{" "}
              <span className="text-[#3fc4e7]">stand out</span>
            </h2>
            <p className="text-[#b8c7e0] font-body text-sm mt-2 max-w-md mx-auto">
              From your GitHub to a stunning portfolio in minutes — no code required.
            </p>
          </motion.div>

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
                <div className="bg-[#132f52] rounded-2xl p-5 sm:p-6 border border-[#3fc4e7]/20 shadow-lg hover:shadow-xl transition-all duration-300 h-full">

                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    <f.icon className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                  </div>

                  <h3 className="font-display font-bold text-white text-base mb-1.5">{f.title}</h3>
                  <p className="text-sm text-[#b8c7e0] font-body leading-relaxed">{f.desc}</p>

                </div>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* Themes Showcase */}
      <section className="py-16 sm:py-24 relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-b from-[#132f52] via-[#0b1f3a] to-[#0b1f3a] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 relative">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-16"
          >

            <div className="inline-flex items-center gap-2 bg-[#3fc4e7]/10 text-[#69d2f1] px-4 py-1.5 rounded-full text-sm font-display font-semibold mb-4">
              <Sparkles className="w-4 h-4" /> 20+ Premium Themes
            </div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Themes for Every <span className="text-[#69d2f1]">Style</span>
            </h2>

            <p className="text-[#b8c7e0] font-body max-w-lg mx-auto text-base px-2">
              From minimal to bold, terminal to luxury. Every theme is fully responsive with animations and smooth navigation.
            </p>

          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {[
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
                whileHover={{ y: -6 }}
                className="group cursor-pointer"
              >
                <Link to="/themes">
                  <div className="h-28 rounded-xl overflow-hidden mb-2 shadow-lg border border-[#3fc4e7]/20">
                    <img src={getThemeImage(theme.image)} alt={theme.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>

                  <p className="text-xs font-display font-medium text-white text-center group-hover:text-[#69d2f1] transition-colors">
                    {theme.name}
                  </p>

                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Button variant="cta" size="lg" className="rounded-full px-10 py-6 text-lg bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black" asChild>
              <Link to="/themes" className="flex items-center gap-2">Start Building Now <ArrowRight className="w-5 h-5" /></Link>
            </Button>
          </div>

        </div>
      </section>

      <ProcessSection />
      <RecruiterSection />
      <FeedbackSection />
      {/* Footer */}
      <footer className="py-8 border-t border-[#3fc4e7]/20 bg-[#0b1f3a]">
        <div className="container mx-auto px-4">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

            <Link to="/adminProtectedRoutes/auth/signin" className="flex items-center gap-2 group" title="Admin">
              <img
                src={logo}
                alt=""
                className="h-9 w-9 rounded-full object-cover transition-all group-hover:ring-2 group-hover:ring-[#3fc4e7]/50"
                style={{ border: "2px solid rgba(63,196,231,0.3)" }}
              />
              <span className="font-display font-bold text-white text-lg group-hover:text-[#3fc4e7] transition-colors">Repoflo</span>
            </Link>

            <p className="text-sm text-[#b8c7e0] font-body">
              © {new Date().getFullYear()} Repoflo · Powered by <span className="font-semibold text-white">Devora Technologies</span>
            </p>

          </div>

        </div>
      </footer>
    </div>
  );
};

export default Index;