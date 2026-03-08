import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { getThemeHtml } from "@/lib/themeTemplates";
import { Download, ArrowLeft, Smartphone, Monitor, Maximize } from "lucide-react";

const PreviewPage = () => {
  const { themeId } = useParams<{ themeId: string }>();
  const [viewMode, setViewMode] = useState<"desktop" | "mobile" | "fullscreen">("desktop");
  const html = getThemeHtml(themeId || "minimal");

  const handleDownload = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio-${themeId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (viewMode === "fullscreen") {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setViewMode("desktop")}>
            Exit Fullscreen
          </Button>
          <Button variant="default" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-1" /> Download
          </Button>
        </div>
        <iframe srcDoc={html} className="w-full h-full border-0" title="Portfolio Preview" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/themes">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Themes
              </Link>
            </Button>
            <h1 className="font-display text-2xl font-bold text-foreground capitalize">
              {themeId} Theme Preview
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-secondary rounded-lg p-1">
              <button
                onClick={() => setViewMode("desktop")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "desktop" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("mobile")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "mobile" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("fullscreen")}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
            <Button variant="cta" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-1" /> Download HTML
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <div
            className={`bg-card rounded-2xl shadow-card-hover overflow-hidden transition-all duration-500 ${
              viewMode === "mobile" ? "w-[390px] h-[844px]" : "w-full max-w-5xl h-[80vh]"
            }`}
          >
            <div className="bg-secondary/50 px-4 py-2 flex items-center gap-2 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-accent/60" />
                <div className="w-3 h-3 rounded-full bg-primary/40" />
              </div>
              <div className="flex-1 text-center text-xs text-muted-foreground font-body">
                portfolio-preview.html
              </div>
            </div>
            <iframe
              srcDoc={html}
              className="w-full border-0"
              style={{ height: "calc(100% - 36px)" }}
              title="Portfolio Preview"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PreviewPage;
