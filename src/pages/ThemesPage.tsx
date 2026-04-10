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

const themeImages: Record<string, string> = {
  blue: themeBlue, warm: themeWarm, dark: themeDark, green: themeGreen, pink: themePink,
  purple: themePurple, coral: themeCoral, cyan: themeCyan, mocha: themeMocha, midnight: themeMidnight, steel: themeSteel,
  ocean: themeOcean, sunset: themeSunset, forest: themeForest, cherry: themeCherry, lavender: themeLavender,
  arctic: themeArctic, emerald: themeEmerald, royal: themeRoyal, rocket: themeRocket, sakura: themeSakura,
  neon: themeNeon, elegant: themeElegant, minimal: themeMinimal, bold: themeBold, creative: themeCreative,
  terminal: themeTerminal,
};

const themes = [
  { id: "forest", name: "Forest Green", description: "Natural earth tones with green accents", image: "forest" },
  { id: "arctic", name: "Arctic Frost", description: "Icy cool blues with frosted glass effects", image: "arctic" },
  { id: "developer", name: "Developer Terminal", description: "Terminal-inspired design for code-first devs", image: "terminal" },
  { id: "graphite", name: "Graphite Steel", description: "Industrial steel gray with sharp edges", image: "steel" },
  { id: "minimal", name: "Minimal", description: "Clean, whitespace-focused design with elegant typography", image: "minimal" },
  { id: "coral", name: "Coral Reef", description: "Vibrant coral and warm red tones", image: "coral" },
  { id: "emerald", name: "Emerald Luxe", description: "Rich emerald greens with gold touches", image: "emerald" },
  { id: "sakura", name: "Sakura Pink", description: "Japanese-inspired soft pink design", image: "sakura" },
  { id: "bold", name: "Bold Dark", description: "Eye-catching dark theme with purple gradients", image: "bold" },
  { id: "ocean", name: "Ocean Breeze", description: "Cool ocean blues with fluid layouts", image: "ocean" },
  { id: "cherry", name: "Cherry Blossom", description: "Soft pink theme with delicate aesthetics", image: "cherry" },
  { id: "lavender", name: "Lavender Dream", description: "Soft violet gradients with calming tones", image: "lavender" },
  { id: "mocha", name: "Mocha Brown", description: "Rich coffee tones with warm contrast", image: "mocha" },
  { id: "elegant", name: "Elegant Luxe", description: "Sophisticated dark design with gold accents", image: "elegant" },
  { id: "sunset", name: "Sunset Glow", description: "Warm sunset gradients with soft tones", image: "sunset" },
  { id: "midnight", name: "Midnight Blue", description: "Deep midnight blues with starlight accents", image: "midnight" },
  { id: "royal", name: "Royal Purple", description: "Regal purple tones with luxurious feel", image: "royal" },
  { id: "neon", name: "Neon Cyber", description: "Futuristic neon glows on dark background", image: "neon" },
  { id: "rocket", name: "Launch Pad", description: "Space-inspired dark theme with starry vibes", image: "rocket" },
  { id: "creative", name: "Creative Warm", description: "Artistic warm palette — best on laptop", image: "creative", laptopOnly: true },
] as const;

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
    <div className="min-h-screen bg-[#0b1f3a] text-white">
      <Navbar />

      <div className="pt-24 pb-32 container mx-auto px-4">

        {/* ── Hero ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#3fc4e7]/10 text-[#69d2f1] px-4 py-1.5 rounded-full text-sm font-display font-semibold mb-4 border border-[#3fc4e7]/20">
            Step 1 of 2
          </div>
          <h1 className="font-display text-4xl font-bold text-white mb-3">Choose Your Theme</h1>
          <p className="text-[#b8c7e0] font-body">20+ themes — each fully responsive with animations and clickable nav.</p>
        </motion.div>

        {/* ── Theme Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 max-w-6xl mx-auto">
          {themes.map((theme, i) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              onClick={() => setSelected(theme.id)}
              className={`relative bg-[#132f52] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
                selected === theme.id
                  ? "border-[#3fc4e7] shadow-lg shadow-[#3fc4e7]/20 ring-2 ring-[#3fc4e7]/25"
                  : "border-[#3fc4e7]/15 hover:border-[#3fc4e7]/40 hover:shadow-lg hover:shadow-[#3fc4e7]/10"
              }`}
            >
              {/* Thumbnail */}
              <div className="h-16 sm:h-20 overflow-hidden">
                <img
                  src={themeImages[theme.image]}
                  alt={theme.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>

              {/* Selected checkmark */}
              {selected === theme.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#3fc4e7] flex items-center justify-center shadow-md"
                >
                  <Check className="w-3.5 h-3.5 text-black" />
                </motion.div>
              )}

              {/* Card body */}
              <div className="p-3 sm:p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="font-display font-semibold text-white text-sm truncate">{theme.name}</h3>
                  {'laptopOnly' in theme && theme.laptopOnly && (
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 flex-shrink-0">LAPTOP</span>
                  )}
                </div>
                <p className="text-[10px] sm:text-xs text-[#b8c7e0] font-body line-clamp-2 mb-2 sm:mb-3 h-7 sm:h-8 leading-relaxed">
                  {theme.description}
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); setPreviewTheme(theme.id); }}
                  className="w-full h-7 sm:h-8 text-xs font-semibold font-body rounded-lg
                             bg-[#3fc4e7]/12 text-[#69d2f1] border border-[#3fc4e7]/25
                             hover:bg-[#3fc4e7]/22 hover:border-[#3fc4e7]/50
                             flex items-center justify-center gap-1 transition-all duration-200"
                >
                  <Eye className="w-3 h-3" /> Preview
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Sticky Bottom Bar ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-[#132f52]/95 backdrop-blur-lg border-t border-[#3fc4e7]/20 shadow-2xl"
          >
            <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border-2 border-[#3fc4e7]/50">
                  <img src={themeImages[selectedThemeData?.image || "minimal"]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="font-display font-semibold text-white text-sm sm:text-base truncate">
                    {selectedThemeData?.name}
                  </p>
                  <p className="text-xs text-[#b8c7e0] font-body truncate hidden sm:block">
                    {selectedThemeData?.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelected(null)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[#b8c7e0] hover:text-white hover:bg-[#3fc4e7]/10 border border-[#3fc4e7]/20 transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleContinue}
                  className="flex items-center gap-2 px-6 sm:px-10 py-2.5 rounded-full text-sm sm:text-base font-bold font-display
                             bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black
                             hover:opacity-90 transition-opacity shadow-lg shadow-[#3fc4e7]/25 whitespace-nowrap"
                >
                  Continue <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Preview Modal ── */}
      {previewTheme && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewTheme(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#132f52] border border-[#3fc4e7]/20 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#3fc4e7]/15">
              <span className="font-display font-semibold text-white">
                Preview: {themes.find((t) => t.id === previewTheme)?.name}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => { setSelected(previewTheme); setPreviewTheme(null); }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold font-display
                             bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black
                             hover:opacity-90 transition-opacity"
                >
                  <Check className="w-4 h-4" /> Select This Theme
                </button>
                <button
                  onClick={() => setPreviewTheme(null)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold font-body
                             text-[#b8c7e0] border border-[#3fc4e7]/20
                             hover:bg-[#3fc4e7]/10 hover:text-white transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>

            {/* iframe */}
            <div className="flex-1 overflow-hidden">
              <iframe
                srcDoc={getThemeHtml(previewTheme, dummyPreviewData)}
                className="w-full h-full border-0"
                title="Theme Preview"
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ThemesPage;
