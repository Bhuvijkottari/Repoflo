import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { Github, Upload, ArrowRight, FileText, CheckCircle2, AlertCircle, Loader2, Code2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { PortfolioData } from "@/lib/mockData";

const GeneratePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [githubUrl, setGithubUrl] = useState("");
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [githubData, setGithubData] = useState<PortfolioData | null>(null);
  const [githubFetching, setGithubFetching] = useState(false);
  const [githubError, setGithubError] = useState("");
  const [leetcodeFetching, setLeetcodeFetching] = useState(false);
  const [leetcodeData, setLeetcodeData] = useState<any>(null);
  const [leetcodeError, setLeetcodeError] = useState("");

  const isRecruiter = selectedTheme === "recruiter";

  useEffect(() => {
    const theme = sessionStorage.getItem("selectedTheme");
    if (!theme) {
      navigate("/themes");
      return;
    }
    setSelectedTheme(theme);
  }, [navigate]);

  // Auto-fetch GitHub data when URL changes
  useEffect(() => {
    const match = githubUrl.match(/github\.com\/([^\/\?#]+)/);
    if (!match) {
      setGithubData(null);
      setGithubError("");
      return;
    }
    const timer = setTimeout(async () => {
      setGithubFetching(true);
      setGithubError("");
      try {
        const { data, error } = await supabase.functions.invoke("fetch-github", { body: { githubUrl } });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        setGithubData(data as PortfolioData);
      } catch (e: any) {
        setGithubError(e.message || "Failed to fetch GitHub data");
        setGithubData(null);
      } finally {
        setGithubFetching(false);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [githubUrl]);

  // Auto-fetch LeetCode data when username changes (only for recruiter theme)
  useEffect(() => {
    if (!isRecruiter) {
      setLeetcodeData(null);
      setLeetcodeError("");
      return;
    }
    const username = leetcodeUsername.trim();
    if (!username) {
      setLeetcodeData(null);
      setLeetcodeError("");
      return;
    }
    const timer = setTimeout(async () => {
      setLeetcodeFetching(true);
      setLeetcodeError("");
      try {
        const { data, error } = await supabase.functions.invoke("fetch-leetcode", { body: { username } });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        setLeetcodeData(data);
      } catch (e: any) {
        setLeetcodeError(e.message || "Failed to fetch LeetCode data");
        setLeetcodeData(null);
      } finally {
        setLeetcodeFetching(false);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [leetcodeUsername, isRecruiter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubData) return;
    setIsProcessing(true);
    try {
      let finalData: PortfolioData = { ...githubData };

      // Attach LeetCode stats if available (recruiter only)
      if (isRecruiter && leetcodeData) {
        finalData.leetcodeStats = leetcodeData;
      }

      if (resumeFile) {
        setStatus("Parsing resume with AI...");
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const formData = new FormData();
        formData.append("resume", resumeFile);
        formData.append("githubData", JSON.stringify(githubData));
        const response = await fetch(`${supabaseUrl}/functions/v1/parse-resume`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${supabaseKey}` },
          body: formData,
        });
        if (!response.ok) {
          const errData = await response.json().catch(() => ({ error: "Failed to parse resume" }));
          throw new Error(errData.error || `Resume parsing failed (${response.status})`);
        }
        const data = await response.json();
        if (data?.error) throw new Error(data.error);
        finalData = { ...finalData, ...data, avatar: data.avatar || githubData.avatar, githubStats: githubData.githubStats, leetcodeStats: finalData.leetcodeStats };
      }

      setStatus("Generating portfolio...");
      sessionStorage.setItem("portfolioData", JSON.stringify(finalData));
      navigate(`/preview/${selectedTheme}`);
    } catch (e: any) {
      toast({ title: "Error processing data", description: e.message || "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
      setStatus("");
    }
  };

  if (!selectedTheme) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4 max-w-xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-display font-semibold mb-4">
            Step 2 of 2 — Theme: <span className="capitalize">{selectedTheme}</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-3">Add Your Info</h1>
          <p className="text-muted-foreground font-body">
            Provide your GitHub profile{isRecruiter ? ", LeetCode username," : ""} and resume — AI does the rest.
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
              <Github className="w-5 h-5 text-primary" /> GitHub Profile URL
            </Label>
            <Input type="url" placeholder="https://github.com/yourusername" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} required className="h-12 text-base" />
            {githubFetching && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Fetching GitHub profile...</div>
            )}
            {githubError && (
              <div className="flex items-center gap-2 text-sm text-destructive"><AlertCircle className="w-4 h-4" /> {githubError}</div>
            )}
            {githubData && !githubFetching && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                <img src={githubData.avatar} alt={githubData.name} className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-display font-semibold text-sm text-foreground">{githubData.name}</p>
                  <p className="text-xs text-muted-foreground">{githubData.title} · {githubData.githubStats?.publicRepos || 0} repos · {githubData.skills.slice(0, 4).join(", ")}</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />
              </motion.div>
            )}
          </div>

          {/* LeetCode Username - Only for Recruiter theme */}
          {isRecruiter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-3"
            >
              <Label className="font-display font-semibold flex items-center gap-2 text-foreground">
                <Code2 className="w-5 h-5 text-accent" /> LeetCode Username
                <span className="text-muted-foreground font-normal text-xs ml-1">(for recruiter analysis)</span>
              </Label>
              <Input type="text" placeholder="your_leetcode_username" value={leetcodeUsername} onChange={(e) => setLeetcodeUsername(e.target.value)} className="h-12 text-base" />
              {leetcodeFetching && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Fetching LeetCode profile...</div>
              )}
              {leetcodeError && (
                <div className="flex items-center gap-2 text-sm text-destructive"><AlertCircle className="w-4 h-4" /> {leetcodeError}</div>
              )}
              {leetcodeData && !leetcodeFetching && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-3 bg-accent/10 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm text-foreground">{leetcodeData.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {leetcodeData.totalSolved} solved · Easy {leetcodeData.easySolved} · Med {leetcodeData.mediumSolved} · Hard {leetcodeData.hardSolved}
                    </p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-accent ml-auto" />
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Resume Upload */}
          <div className="space-y-3">
            <Label className="font-display font-semibold flex items-center gap-2 text-foreground">
              <FileText className="w-5 h-5 text-primary" /> Upload Resume — <span className="text-muted-foreground font-normal text-xs">enriches experience & education</span>
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
                  <span className="font-body text-xs mt-1">PDF, DOC, TXT up to 10MB</span>
                </div>
              )}
              <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
            </label>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button type="submit" variant="cta" size="lg" className="w-full rounded-xl py-6 text-lg animate-pulse-glow" disabled={!githubData || isProcessing || githubFetching}>
              {isProcessing ? (
                <div className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /><span>{status || "Processing..."}</span></div>
              ) : (
                <>Generate Portfolio <ArrowRight className="ml-2 w-5 h-5" /></>
              )}
            </Button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
};

export default GeneratePage;
