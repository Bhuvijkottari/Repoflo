import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Eye, Check, Briefcase, ArrowRight } from "lucide-react";
import { getThemeHtml } from "@/lib/themeTemplates";
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

const themeImages: Record<string, string> = {
  blue: themeBlue, warm: themeWarm, dark: themeDark, green: themeGreen, pink: themePink,
  purple: themePurple, coral: themeCoral, cyan: themeCyan, mocha: themeMocha, midnight: themeMidnight, steel: themeSteel,
};

const themes = [
  { id: "recruiter", name: "Recruiter View", description: "Data-rich dashboard with GitHub analytics and AI-powered candidate assessment", image: "blue", isRecruiter: true },
  { id: "minimal", name: "Minimal", description: "Clean, whitespace-focused design with elegant typography", image: "blue" },
  { id: "bold", name: "Bold Dark", description: "Eye-catching dark theme with purple gradients", image: "purple" },
  { id: "creative", name: "Creative Warm", description: "Artistic warm palette with playful layouts", image: "warm" },
  { id: "developer", name: "Developer Terminal", description: "Terminal-inspired design for code-first devs", image: "green" },
  { id: "elegant", name: "Elegant Luxe", description: "Sophisticated dark design with gold accents", image: "mocha" },
  { id: "neon", name: "Neon Cyber", description: "Futuristic neon glows on dark background", image: "cyan" },
  { id: "ocean", name: "Ocean Breeze", description: "Cool ocean blues with fluid layouts", image: "blue" },
  { id: "sunset", name: "Sunset Glow", description: "Warm sunset gradients with soft tones", image: "coral" },
  { id: "forest", name: "Forest Green", description: "Natural earth tones with green accents", image: "green" },
  { id: "cherry", name: "Cherry Blossom", description: "Soft pink theme with delicate aesthetics", image: "pink" },
  { id: "lavender", name: "Lavender Dream", description: "Soft violet gradients with calming tones", image: "purple" },
  { id: "midnight", name: "Midnight Blue", description: "Deep midnight blues with starlight accents", image: "midnight" },
  { id: "coral", name: "Coral Reef", description: "Vibrant coral and warm red tones", image: "coral" },
  { id: "arctic", name: "Arctic Frost", description: "Icy cool blues with frosted glass effects", image: "cyan" },
  { id: "mocha", name: "Mocha Brown", description: "Rich coffee tones with warm contrast", image: "mocha" },
  { id: "sakura", name: "Sakura Pink", description: "Japanese-inspired soft pink design", image: "pink" },
  { id: "graphite", name: "Graphite Steel", description: "Industrial steel gray with sharp edges", image: "steel" },
  { id: "emerald", name: "Emerald Luxe", description: "Rich emerald greens with gold touches", image: "green" },
  { id: "royal", name: "Royal Purple", description: "Regal purple tones with luxurious feel", image: "purple" },
  { id: "rocket", name: "Launch Pad", description: "Space-inspired dark theme with starry vibes", image: "midnight" },
];

const ThemesPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    // Store selected theme and go to generate page to collect info
    sessionStorage.setItem("selectedTheme", selected);
    navigate("/generate");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-display font-semibold mb-4">
            Step 1 of 2
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-3">Choose Your Theme</h1>
          <p className="text-muted-foreground font-body">20+ themes — each fully responsive with animations and clickable nav.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-w-6xl mx-auto mb-12">
          {themes.map((theme, i) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              onClick={() => setSelected(theme.id)}
              className={`relative bg-card rounded-2xl overflow-hidden shadow-card cursor-pointer transition-all duration-300 border-2 ${
                selected === theme.id ? "border-primary shadow-glow" : "border-transparent hover:shadow-card-hover"
              } ${theme.isRecruiter ? "ring-2 ring-accent/40" : ""}`}
            >
              <div className="h-20 overflow-hidden">
                <img src={themeImages[theme.image]} alt={theme.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
              </div>
              {selected === theme.id && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </motion.div>
              )}
              {theme.isRecruiter && (
                <span className="absolute top-2 left-2 text-xs font-display font-semibold bg-background/90 text-accent px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Briefcase className="w-3 h-3" /> For Recruiters
                </span>
              )}
              <div className="p-5">
                <h3 className="font-display font-semibold text-foreground mb-2">{theme.name}</h3>
                <p className="text-xs text-muted-foreground font-body mb-4">{theme.description}</p>
                <Button variant="outline" size="sm" className="w-full" onClick={(e) => { e.stopPropagation(); setPreviewTheme(theme.id); }}>
                  <Eye className="w-4 h-4 mr-1" /> Preview
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="cta" size="lg" className="rounded-full px-12 py-6 text-lg animate-pulse-glow" disabled={!selected} onClick={handleContinue}>
              Continue — Add Your Info <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </div>

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
              <iframe srcDoc={getThemeHtml(previewTheme)} className="w-full h-full border-0" title="Theme Preview" />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ThemesPage;
