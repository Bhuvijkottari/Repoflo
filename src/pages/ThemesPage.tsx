import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Eye, Check, Sparkles, Code, Palette, Crown, Briefcase, Gem, Zap, Waves, Sun, Trees, Cherry, Flower2, Moon, Flame, Snowflake, Coffee, BarChart3, Layers, Diamond, Rocket } from "lucide-react";
import { getThemeHtml } from "@/lib/themeTemplates";

const themes = [
  { id: "recruiter", name: "Recruiter View", icon: Briefcase, description: "Data-rich dashboard with GitHub analytics, AI detection & detailed stats", gradient: "from-blue-500 to-indigo-600", isRecruiter: true },
  { id: "minimal", name: "Minimal", icon: Sparkles, description: "Clean, whitespace-focused design with elegant typography", gradient: "from-gray-300 to-gray-500" },
  { id: "bold", name: "Bold Dark", icon: Crown, description: "Eye-catching dark theme with purple gradients", gradient: "from-purple-600 to-blue-500" },
  { id: "creative", name: "Creative Warm", icon: Palette, description: "Artistic warm palette with playful layouts", gradient: "from-amber-400 to-orange-500" },
  { id: "developer", name: "Developer Terminal", icon: Code, description: "Terminal-inspired design for code-first devs", gradient: "from-green-500 to-emerald-700" },
  { id: "elegant", name: "Elegant Luxe", icon: Gem, description: "Sophisticated dark design with gold accents", gradient: "from-yellow-600 to-amber-800" },
  { id: "neon", name: "Neon Cyber", icon: Zap, description: "Futuristic neon glows on dark background", gradient: "from-cyan-400 to-pink-500" },
  { id: "ocean", name: "Ocean Breeze", icon: Waves, description: "Cool ocean blues with fluid layouts", gradient: "from-blue-400 to-teal-500" },
  { id: "sunset", name: "Sunset Glow", icon: Sun, description: "Warm sunset gradients with soft tones", gradient: "from-orange-400 to-rose-500" },
  { id: "forest", name: "Forest Green", icon: Trees, description: "Natural earth tones with green accents", gradient: "from-green-600 to-emerald-800" },
  { id: "cherry", name: "Cherry Blossom", icon: Cherry, description: "Soft pink theme with delicate aesthetics", gradient: "from-rose-500 to-red-700" },
  { id: "lavender", name: "Lavender Dream", icon: Flower2, description: "Soft violet gradients with calming tones", gradient: "from-violet-400 to-purple-600" },
  { id: "midnight", name: "Midnight Blue", icon: Moon, description: "Deep midnight blues with starlight accents", gradient: "from-slate-700 to-slate-900" },
  { id: "coral", name: "Coral Reef", icon: Flame, description: "Vibrant coral and warm red tones", gradient: "from-red-400 to-orange-500" },
  { id: "arctic", name: "Arctic Frost", icon: Snowflake, description: "Icy cool blues with frosted glass effects", gradient: "from-cyan-200 to-blue-400" },
  { id: "mocha", name: "Mocha Brown", icon: Coffee, description: "Rich coffee tones with warm contrast", gradient: "from-amber-700 to-yellow-900" },
  { id: "sakura", name: "Sakura Pink", icon: Flower2, description: "Japanese-inspired soft pink design", gradient: "from-pink-300 to-rose-400" },
  { id: "graphite", name: "Graphite Steel", icon: BarChart3, description: "Industrial steel gray with sharp edges", gradient: "from-gray-600 to-gray-800" },
  { id: "emerald", name: "Emerald Luxe", icon: Diamond, description: "Rich emerald greens with gold touches", gradient: "from-emerald-400 to-green-600" },
  { id: "royal", name: "Royal Purple", icon: Crown, description: "Regal purple tones with luxurious feel", gradient: "from-indigo-500 to-purple-700" },
  { id: "rocket", name: "Launch Pad", icon: Rocket, description: "Space-inspired dark theme with starry vibes", gradient: "from-indigo-900 to-slate-900" },
];

const ThemesPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);

  const handleGenerate = () => {
    if (selected) {
      navigate(`/preview/${selected}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-foreground mb-3">Choose Your Theme</h1>
          <p className="text-muted-foreground font-body">20+ themes — each fully responsive with animations & clickable nav.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-w-6xl mx-auto mb-12">
          {themes.map((theme, i) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setSelected(theme.id)}
              className={`relative bg-card rounded-2xl overflow-hidden shadow-card cursor-pointer transition-all duration-300 border-2 ${
                selected === theme.id ? "border-primary shadow-glow" : "border-transparent hover:shadow-card-hover"
              } ${theme.isRecruiter ? "ring-2 ring-accent/40" : ""}`}
            >
              {/* Gradient preview bar */}
              <div className={`h-20 bg-gradient-to-br ${theme.gradient}`} />

              {selected === theme.id && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              {theme.isRecruiter && (
                <span className="absolute top-2 left-2 text-xs font-display font-semibold bg-background/90 text-accent px-2 py-0.5 rounded-full">
                  For Recruiters
                </span>
              )}

              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <theme.icon className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-semibold text-foreground">{theme.name}</h3>
                </div>
                <p className="text-xs text-muted-foreground font-body mb-4">{theme.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewTheme(theme.id);
                  }}
                >
                  <Eye className="w-4 h-4 mr-1" /> Preview
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="cta" size="lg" className="rounded-full px-12 py-6 text-lg" disabled={!selected} onClick={handleGenerate}>
            Generate Portfolio
          </Button>
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
      {previewTheme && (
        <div className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPreviewTheme(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl shadow-card-hover w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-display font-semibold text-foreground">
                Preview: {themes.find((t) => t.id === previewTheme)?.name}
              </span>
              <div className="flex gap-2">
                <Button variant="default" size="sm" onClick={() => { setSelected(previewTheme); setPreviewTheme(null); }}>
                  Select This Theme
                </Button>
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
