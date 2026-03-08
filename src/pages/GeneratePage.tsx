import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { Github, Upload, ArrowRight, FileText, CheckCircle2 } from "lucide-react";

const GeneratePage = () => {
  const navigate = useNavigate();
  const [githubUrl, setGithubUrl] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrl) return;
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      navigate("/themes", {
        state: { githubUrl, hasResume: !!resumeFile },
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4 max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-4xl font-bold text-foreground mb-3">
            Let's Build Your Portfolio
          </h1>
          <p className="text-muted-foreground font-body">
            Provide your GitHub profile and resume — AI does the rest.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-8 bg-card rounded-2xl p-8 shadow-card"
        >
          {/* GitHub URL */}
          <div className="space-y-3">
            <Label className="font-display font-semibold flex items-center gap-2 text-foreground">
              <Github className="w-5 h-5 text-primary" />
              GitHub Profile URL
            </Label>
            <Input
              type="url"
              placeholder="https://github.com/yourusername"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              required
              className="h-12 text-base"
            />
          </div>

          {/* Resume Upload */}
          <div className="space-y-3">
            <Label className="font-display font-semibold flex items-center gap-2 text-foreground">
              <FileText className="w-5 h-5 text-primary" />
              Upload Resume (PDF)
            </Label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-secondary/30 transition-colors">
              {resumeFile ? (
                <div className="flex items-center gap-2 text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-body text-sm">{resumeFile.name}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-muted-foreground">
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="font-body text-sm">Click to upload or drag & drop</span>
                  <span className="font-body text-xs mt-1">PDF, DOC up to 10MB</span>
                </div>
              )}
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <Button
            type="submit"
            variant="cta"
            size="lg"
            className="w-full rounded-xl py-6 text-lg"
            disabled={!githubUrl || isProcessing}
          >
            {isProcessing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
              />
            ) : (
              <>
                Continue to Themes <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
        </motion.form>
      </div>
    </div>
  );
};

export default GeneratePage;
