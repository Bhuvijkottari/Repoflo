import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { Github, Upload, ArrowRight, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { PortfolioData } from "@/lib/mockData";

const GeneratePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [githubUrl, setGithubUrl] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [githubData, setGithubData] = useState<PortfolioData | null>(null);
  const [githubFetching, setGithubFetching] = useState(false);
  const [githubError, setGithubError] = useState("");

  useEffect(() => {
    const theme = sessionStorage.getItem("selectedTheme");
    if (!theme) { navigate("/themes"); return; }
    setSelectedTheme(theme);
  }, [navigate]);

  useEffect(() => {
    const match = githubUrl.match(/github\.com\/([^\/\?#]+)/);
    if (!match) { setGithubData(null); setGithubError(""); return; }
    const timer = setTimeout(async () => {
      setGithubFetching(true); setGithubError("");
      try {
        const { data, error } = await supabase.functions.invoke("fetch-github", { body: { githubUrl } });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        setGithubData(data as PortfolioData);
      } catch (e: any) {
        setGithubError(e.message || "Failed to fetch GitHub data");
        setGithubData(null);
      } finally { setGithubFetching(false); }
    }, 800);
    return () => clearTimeout(timer);
  }, [githubUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubData) return;
    setIsProcessing(true);
    try {
      let finalData: PortfolioData = { ...githubData };
      if (resumeFile) {
        setStatus("AI is parsing your resume...");
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
    } finally { setIsProcessing(false); setStatus(""); }
  };

  if (!selectedTheme) return null;

  return (
    <div className="min-h-screen bg-[#0b1f3a] text-white">
      <Navbar />

      <div className="pt-24 pb-16 container mx-auto px-4 max-w-xl">

        {/* ── Hero ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#3fc4e7]/10 text-[#69d2f1] px-4 py-1.5 rounded-full text-sm font-display font-semibold mb-4 border border-[#3fc4e7]/20">
            Step 2 of 2 — Theme: <span className="capitalize">{selectedTheme}</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-white mb-3">Add Your Info</h1>
          <p className="text-[#b8c7e0] font-body">
            Provide your GitHub profile and resume — AI does the rest.
          </p>
        </motion.div>

        {/* ── Form ── */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-7 bg-[#132f52] rounded-2xl p-8 border border-[#3fc4e7]/20 shadow-xl"
        >

          {/* GitHub URL */}
          <div className="space-y-3">
            <Label className="font-display font-semibold flex items-center gap-2 text-white">
              <Github className="w-5 h-5 text-[#3fc4e7]" /> GitHub Profile URL
            </Label>
            <Input
              type="url"
              placeholder="https://github.com/yourusername"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              required
              className="h-12 text-base bg-[#0b1f3a] border-[#3fc4e7]/20 text-white placeholder:text-[#b8c7e0]/50 focus:border-[#3fc4e7]/50 focus:ring-[#3fc4e7]/20"
            />

            {/* Status rows */}
            {githubFetching && (
              <div className="flex items-center gap-2 text-sm text-[#b8c7e0] font-body">
                <Loader2 className="w-4 h-4 animate-spin text-[#3fc4e7]" /> Fetching GitHub profile...
              </div>
            )}
            {githubError && (
              <div className="flex items-center gap-2 text-sm text-red-400 font-body">
                <AlertCircle className="w-4 h-4" /> {githubError}
              </div>
            )}
            {githubData && !githubFetching && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-[#0b1f3a] border border-[#3fc4e7]/20 rounded-xl"
              >
                <img src={githubData.avatar} alt={githubData.name} className="w-12 h-12 rounded-full border-2 border-[#3fc4e7]/30 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-sm text-white truncate">{githubData.name}</p>
                  <p className="text-xs text-[#b8c7e0] font-body truncate">
                    {githubData.title} · {githubData.githubStats?.publicRepos || 0} repos · {githubData.skills.slice(0, 4).join(", ")}
                  </p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-[#3fc4e7] flex-shrink-0" />
              </motion.div>
            )}
          </div>

          {/* Resume Upload */}
          <div className="space-y-3">
            <Label className="font-display font-semibold flex items-center gap-2 text-white">
              <FileText className="w-5 h-5 text-[#3fc4e7]" /> Upload Resume —{" "}
              <span className="text-[#b8c7e0] font-normal text-xs">enriches experience & education</span>
            </Label>
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-[#3fc4e7]/25 rounded-xl cursor-pointer hover:border-[#3fc4e7]/50 hover:bg-[#3fc4e7]/5 transition-all duration-200">
              {resumeFile ? (
                <div className="flex items-center gap-2.5 text-white">
                  <CheckCircle2 className="w-5 h-5 text-[#3fc4e7]" />
                  <span className="font-body text-sm">{resumeFile.name}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-[#b8c7e0]">
                  <Upload className="w-8 h-8 mb-2 text-[#3fc4e7]/60" />
                  <span className="font-body text-sm">Click to upload or drag & drop</span>
                  <span className="font-body text-xs mt-1 text-[#b8c7e0]/60">PDF, DOC, TXT up to 10MB</span>
                </div>
              )}
              <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
            </label>
          </div>

          {/* Submit */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <button
              type="submit"
              disabled={!githubData || isProcessing || githubFetching}
              className="w-full h-13 py-3.5 rounded-xl text-base font-bold font-display
                         bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black
                         hover:opacity-90 active:scale-[0.98] transition-all duration-200
                         shadow-lg shadow-[#3fc4e7]/20
                         disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
                         flex items-center justify-center gap-2 w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {status || "Processing..."}
                </>
              ) : (
                <>
                  Generate Portfolio <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </motion.div>

        </motion.form>
      </div>
    </div>
  );
};

export default GeneratePage;
