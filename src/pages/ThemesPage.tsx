import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Eye, Check, Briefcase, ArrowRight, X } from "lucide-react";
import { getThemeHtml } from "@/lib/themeTemplates";
import { dummyPreviewData } from "@/lib/mockData";
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

const themeImages: Record<string, string> = {
  blue: themeBlue, warm: themeWarm, dark: themeDark, green: themeGreen, pink: themePink,
  purple: themePurple, coral: themeCoral, cyan: themeCyan, mocha: themeMocha, midnight: themeMidnight, steel: themeSteel,
  ocean: themeOcean, sunset: themeSunset, forest: themeForest, cherry: themeCherry, lavender: themeLavender,
  arctic: themeArctic, emerald: themeEmerald, royal: themeRoyal, rocket: themeRocket, sakura: themeSakura,
  neon: themeNeon, elegant: themeElegant, minimal: themeMinimal, bold: themeBold, creative: themeCreative,
  terminal: themeTerminal, recruiter: themeRecruiter,
};

const themes = [
  { id: "recruiter", name: "Recruiter View", description: "Data-rich dashboard with GitHub analytics and AI powered candidate assessment", image: "recruiter", isRecruiter: true },
  { id: "minimal", name: "Minimal", description: "Clean, whitespace-focused design with elegant typography", image: "minimal" },
  { id: "bold", name: "Bold Dark", description: "Eye-catching dark theme with purple gradients", image: "bold" },
  { id: "creative", name: "Creative Warm", description: "Artistic warm palette with playful layouts", image: "creative" },
  { id: "developer", name: "Developer Terminal", description: "Terminal-inspired design for code-first devs", image: "terminal" },
  { id: "elegant", name: "Elegant Luxe", description: "Sophisticated dark design with gold accents", image: "elegant" },
  { id: "neon", name: "Neon Cyber", description: "Futuristic neon glows on dark background", image: "neon" },
  { id: "ocean", name: "Ocean Breeze", description: "Cool ocean blues with fluid layouts", image: "ocean" },
  { id: "sunset", name: "Sunset Glow", description: "Warm sunset gradients with soft tones", image: "sunset" },
  { id: "forest", name: "Forest Green", description: "Natural earth tones with green accents", image: "forest" },
  { id: "cherry", name: "Cherry Blossom", description: "Soft pink theme with delicate aesthetics", image: "cherry" },
  { id: "lavender", name: "Lavender Dream", description: "Soft violet gradients with calming tones", image: "lavender" },
  { id: "midnight", name: "Midnight Blue", description: "Deep midnight blues with starlight accents", image: "midnight" },
  { id: "coral", name: "Coral Reef", description: "Vibrant coral and warm red tones", image: "coral" },
  { id: "arctic", name: "Arctic Frost", description: "Icy cool blues with frosted glass effects", image: "arctic" },
  { id: "mocha", name: "Mocha Brown", description: "Rich coffee tones with warm contrast", image: "mocha" },
  { id: "sakura", name: "Sakura Pink", description: "Japanese-inspired soft pink design", image: "sakura" },
  { id: "graphite", name: "Graphite Steel", description: "Industrial steel gray with sharp edges", image: "steel" },
  { id: "emerald", name: "Emerald Luxe", description: "Rich emerald greens with gold touches", image: "emerald" },
  { id: "royal", name: "Royal Purple", description: "Regal purple tones with luxurious feel", image: "royal" },
  { id: "rocket", name: "Launch Pad", description: "Space-inspired dark theme with starry vibes", image: "rocket" },
];

const ThemesPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);

  const selectedThemeData = themes.find(t => t.id === selected);

  const handleContinue = () => {
    if (!selected) return;
    sessionStorage.setItem("selectedTheme", selected);
    navigate("/generate");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-32 container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-display font-semibold mb-4">
            Step 1 of 2
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-3">Choose Your Theme</h1>
          <p className="text-muted-foreground font-body">20+ themes — each fully responsive with animations and clickable nav.</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 max-w-6xl mx-auto">
          {themes.map((theme, i) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              onClick={() => setSelected(theme.id)}
              className={`relative bg-card rounded-xl overflow-hidden shadow-card cursor-pointer transition-all duration-300 border-2 ${
                selected === theme.id ? "border-primary shadow-glow ring-2 ring-primary/30" : "border-transparent hover:shadow-card-hover"
              } ${theme.isRecruiter ? "ring-2 ring-accent/40" : ""}`}
            >
              <div className="h-16 sm:h-20 overflow-hidden">
                <img src={themeImages[theme.image]} alt={theme.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
              </div>
              {selected === theme.id && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </motion.div>
              )}
              {theme.isRecruiter && (
                <span className="absolute top-1.5 left-1.5 text-[10px] font-display font-semibold bg-background/90 text-accent px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <Briefcase className="w-2.5 h-2.5" /> Recruiter
                </span>
              )}
              <div className="p-3 sm:p-4">
                <h3 className="font-display font-semibold text-foreground text-sm mb-1 truncate">{theme.name}</h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground font-body line-clamp-2 mb-2 sm:mb-3 h-7 sm:h-8">{theme.description}</p>
                <Button variant="outline" size="sm" className="w-full text-xs h-7 sm:h-8" onClick={(e) => { e.stopPropagation(); setPreviewTheme(theme.id); }}>
                  <Eye className="w-3 h-3 mr-1" /> Preview
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border shadow-2xl"
          >
            <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 border-primary">
                  <img src={themeImages[selectedThemeData?.image || "minimal"]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="font-display font-semibold text-foreground text-sm sm:text-base truncate">
                    {selectedThemeData?.name}
                    {selectedThemeData?.isRecruiter && (
                      <span className="ml-2 text-accent text-xs">For Recruiters</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground truncate hidden sm:block">{selectedThemeData?.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setSelected(null)} className="text-muted-foreground">
                  <X className="w-4 h-4" />
                </Button>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="cta" size="lg" className="rounded-full px-6 sm:px-10 animate-pulse-glow whitespace-nowrap" onClick={handleContinue}>
                    Continue <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      {previewTheme && (
        <div className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPreviewTheme(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-2xl shadow-card-hover w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-display font-semibold text-foreground">Preview: {themes.find((t) => t.id === previewTheme)?.name}</span>
              <div className="flex gap-2">
                <Button variant="default" size="sm" onClick={() => { setSelected(previewTheme); setPreviewTheme(null); }}>Select This Theme</Button>
                <Button variant="ghost" size="sm" onClick={() => setPreviewTheme(null)}>Close</Button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe srcDoc={getThemeHtml(previewTheme, dummyPreviewData)} className="w-full h-full border-0" title="Theme Preview" />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ThemesPage;
