import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { Github, Upload, ArrowRight, FileText, CheckCircle2, AlertCircle, Loader2, ServerCrash } from "lucide-react";

const friendlyError = (e: any): string => {
  const msg: string = e?.message || String(e) || "";
  if (
    msg.includes("503") || msg.includes("504") || msg.includes("timeout") ||
    msg.includes("overloaded") || msg.includes("busy") || msg.includes("rate limit") ||
    msg.includes("too many") || msg.includes("upstream") || msg.includes("gateway") ||
    msg.includes("Function") || msg.includes("edge") || msg.includes("invoke") ||
    msg.includes("Failed to fetch") || msg.includes("NetworkError") || msg.includes("network") ||
    msg.includes("fetch")
  ) return "server_busy";
  return msg || "Something went wrong. Please try again.";
};
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { PortfolioData } from "@/lib/mockData";
import { subscribeSiteSettings, SiteSettings, trackPortfolioGeneration } from "@/lib/firebase";

const GeneratePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({ portfolioEnabled: true, recruiterEnabled: true });

  useEffect(() => {
    const unsub = subscribeSiteSettings(setSiteSettings);
    return unsub;
  }, []);
  const [githubUrl, setGithubUrl] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
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
        const fe = friendlyError(e);
        setGithubError(fe === "server_busy"
          ? "__busy__"
          : fe);
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
      // Track for admin dashboard
      trackPortfolioGeneration({
        name: finalData.name || "",
        email: finalData.email || "",
        phone: finalData.phone || "",
        currentOccupation: finalData.currentOccupation || "",
        resumeName: resumeFile?.name || "No resume",
        theme: selectedTheme || "",
        timestamp: new Date().toISOString(),
      });
      navigate(`/preview/${selectedTheme}`);
    } catch (e: any) {
      const fe = friendlyError(e);
      toast({
        title: fe === "server_busy" ? "⏳ Server Busy" : "Error",
        description: fe === "server_busy"
          ? "Our servers are temporarily overloaded. Please wait a moment and try again."
          : fe,
        variant: "destructive"
      });
    } finally { setIsProcessing(false); setStatus(""); }
  };

  if (!selectedTheme) return null;

  // Maintenance gate
  if (!siteSettings.portfolioEnabled) {
    return (
      <div className="min-h-screen bg-[#0b1f3a] text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <div className="text-7xl mb-6">🛠️</div>
            <h1 className="font-display text-3xl font-bold text-white mb-4">
              Under Maintenance
            </h1>
            <p className="text-[#b8c7e0] font-body text-lg mb-8 leading-relaxed">
              Portfolio generation is temporarily unavailable.<br />
              We're working hard to improve things — check back soon! ✨
            </p>
            <Button
              onClick={() => navigate("/")}
              className="rounded-full px-8 bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black font-bold"
            >
              ← Back to Home
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

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
              githubError === "__busy__" ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl"
                >
                  <ServerCrash className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-400 font-semibold text-sm font-display">Server Busy</p>
                    <p className="text-amber-300/70 text-xs font-body mt-0.5">Our servers are temporarily overloaded. Please wait a moment and try again.</p>
                    <button
                      onClick={() => { setGithubError(""); setGithubData(null); }}
                      className="text-amber-400/60 text-xs mt-1.5 hover:text-amber-400 transition-colors font-body"
                    >
                      Retry ↻
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-red-400 font-body">
                  <AlertCircle className="w-4 h-4" /> {githubError}
                </div>
              )
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
                  <span className="font-body text-xs mt-1 text-[#b8c7e0]/60">PDF only</span>
                </div>
              )}
              <input type="file" accept=".pdf" className="hidden" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
            </label>
          </div>

          {/* Data Privacy & Terms */}
          <label className={`flex items-start gap-3 cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 ${termsAccepted ? 'border-[#3fc4e7]/40 bg-[#3fc4e7]/5' : 'border-amber-500/40 bg-amber-500/5'}`}>
            <div className="flex-shrink-0 mt-0.5">
              <div
                onClick={() => setTermsAccepted(!termsAccepted)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${termsAccepted ? 'bg-[#3fc4e7] border-[#3fc4e7]' : 'bg-transparent border-amber-400'}`}
              >
                {termsAccepted && (
                  <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <p className={`text-xs font-semibold font-display ${termsAccepted ? 'text-[#3fc4e7]' : 'text-amber-400'}`}>
                {termsAccepted ? '✓ Agreed' : '⚠ Required — please agree to continue'}
              </p>
              <p className="text-xs text-[#b8c7e0] font-body leading-relaxed">
                By generating your portfolio, you agree that your data may be shared with{' '}
                <span className="text-white font-medium">third-party applications, hiring agencies, recruiters, education consultancies,</span>{' '}
                and career platforms for professional discovery and job opportunities.
              </p>
            </div>
          </label>

          {/* Submit */}
          <motion.div whileHover={{ scale: termsAccepted ? 1.02 : 1 }} whileTap={{ scale: termsAccepted ? 0.98 : 1 }}>
            <button
              type="submit"
              disabled={!githubData || isProcessing || githubFetching || !termsAccepted}
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
