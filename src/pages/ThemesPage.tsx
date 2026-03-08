import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Eye, Check, Sparkles, Code, Palette, Crown, Briefcase, Gem } from "lucide-react";
import { getThemeHtml } from "@/lib/themeTemplates";

const themes = [
  {
    id: "minimal",
    name: "Minimal",
    icon: Sparkles,
    description: "Clean, whitespace-focused design with elegant typography",
    color: "bg-secondary",
    accent: "text-foreground",
  },
  {
    id: "bold",
    name: "Bold Dark",
    icon: Crown,
    description: "Eye-catching dark theme with purple gradients and animations",
    color: "bg-foreground",
    accent: "text-primary",
  },
  {
    id: "creative",
    name: "Creative Warm",
    icon: Palette,
    description: "Artistic warm palette with playful layouts and serif fonts",
    color: "bg-accent/20",
    accent: "text-accent",
  },
  {
    id: "developer",
    name: "Developer Terminal",
    icon: Code,
    description: "Terminal-inspired design for the code-first developer",
    color: "bg-foreground",
    accent: "text-primary",
  },
  {
    id: "elegant",
    name: "Elegant Luxe",
    icon: Gem,
    description: "Sophisticated dark design with gold accents and serif fonts",
    color: "bg-foreground",
    accent: "text-primary",
  },
  {
    id: "recruiter",
    name: "Recruiter View",
    icon: Briefcase,
    description: "Data-rich minimal view with GitHub analytics, AI detection & detailed stats",
    color: "bg-secondary",
    accent: "text-foreground",
    isRecruiter: true,
  },
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl font-bold text-foreground mb-3">
            Choose Your Theme
          </h1>
          <p className="text-muted-foreground font-body">
            Select a theme to generate your portfolio. Each is fully responsive with animations.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {themes.map((theme, i) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelected(theme.id)}
              className={`relative bg-card rounded-2xl p-6 shadow-card cursor-pointer transition-all duration-300 border-2 ${
                selected === theme.id
                  ? "border-primary shadow-glow"
                  : "border-transparent hover:shadow-card-hover"
              } ${theme.isRecruiter ? "ring-1 ring-accent/30" : ""}`}
            >
              {selected === theme.id && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              {theme.isRecruiter && (
                <span className="absolute top-4 right-4 text-xs font-display font-semibold bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                  For Recruiters
                </span>
              )}
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                <theme.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-1">{theme.name}</h3>
              <p className="text-sm text-muted-foreground font-body mb-4">{theme.description}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewTheme(theme.id);
                }}
              >
                <Eye className="w-4 h-4 mr-1" /> Preview
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="cta"
            size="lg"
            className="rounded-full px-12 py-6 text-lg"
            disabled={!selected}
            onClick={handleGenerate}
          >
            Generate Portfolio
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      {previewTheme && (
        <div
          className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewTheme(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl shadow-card-hover w-full max-w-4xl h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-display font-semibold text-foreground">
                Preview: {themes.find((t) => t.id === previewTheme)?.name}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    setSelected(previewTheme);
                    setPreviewTheme(null);
                  }}
                >
                  Select This Theme
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setPreviewTheme(null)}>
                  Close
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                srcDoc={getThemeHtml(previewTheme)}
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
