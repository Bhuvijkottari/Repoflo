import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Github, Upload, ArrowRight, FileText, CheckCircle2, AlertCircle,
  Loader2, Code2, Briefcase, Search, LogIn, LogOut, Shield,
} from "lucide-react";
import TechStackInput from "@/components/TechStackInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import PreviewPage from "./PreviewPage";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  signInWithGoogle, signOutUser, updateRecruiterUsage,
  checkRecruiterLimit, addRecruiterHistory, fetchRecruiterHistory,
  storeCandidateAnalysis,
} from "@/lib/firebase";
import type { PortfolioData } from "@/lib/mockData";

/* ── small helpers ───────────────────────────────────────────── */
const NavyCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-[#132f52] border border-[#3fc4e7]/20 rounded-2xl ${className}`}>
    {children}
  </div>
);

const FieldLabel = ({ icon: Icon, text, note }: { icon: any; text: string; note?: string }) => (
  <Label className="flex items-center gap-2 text-white font-semibold font-display mb-1">
    <Icon className="w-4 h-4 text-[#3fc4e7]" />
    {text}
    {note && <span className="text-[#b8c7e0] font-normal text-xs ml-1">{note}</span>}
  </Label>
);

const StatusRow = ({
  loading, error, success,
}: { loading?: React.ReactNode; error?: string; success?: React.ReactNode }) => (
  <>
    {loading && (
      <div className="flex items-center gap-2 text-sm text-[#b8c7e0]">
        <Loader2 className="w-4 h-4 animate-spin text-[#3fc4e7]" />
        {loading}
      </div>
    )}
    {error && (
      <div className="flex items-center gap-2 text-sm text-red-400">
        <AlertCircle className="w-4 h-4" /> {error}
      </div>
    )}
    {success}
  </>
);

/* ── main component ──────────────────────────────────────────── */
const RecruiterPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, recruiterProfile, loading, isRecruiter, isApprovedRecruiter } = useAuth();

  const [githubUrl, setGithubUrl] = useState("");
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [searchParams] = useSearchParams();
  const showPreview = searchParams.get("preview") === "1";
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [githubData, setGithubData] = useState<PortfolioData | null>(null);
  const [githubFetching, setGithubFetching] = useState(false);
  const [githubError, setGithubError] = useState("");
  const [leetcodeFetching, setLeetcodeFetching] = useState(false);
  const [leetcodeData, setLeetcodeData] = useState<any>(null);
  const [leetcodeError, setLeetcodeError] = useState("");
  const [requiredTechStack, setRequiredTechStack] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<string>("");
  const [historyEntries, setHistoryEntries] = useState<any[]>([]);

  const loadHistory = async () => {
    if (user?.email) {
      const h = await fetchRecruiterHistory(user.email);
      setHistoryEntries(h);
    }
  };

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

  useEffect(() => {
    if (!leetcodeUsername.trim()) { setLeetcodeData(null); setLeetcodeError(""); return; }
    const go = async () => {
      setLeetcodeFetching(true); setLeetcodeError("");
      try {
        const { data, error } = await supabase.functions.invoke("fetch-leetcode", { body: { username: leetcodeUsername } });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        setLeetcodeData(data);
      } catch (e: any) { setLeetcodeError(e.message); setLeetcodeData(null); }
      finally { setLeetcodeFetching(false); }
    };
    go();
  }, [leetcodeUsername]);

  useEffect(() => { if (user) loadHistory(); }, [user]);

  const handleSignIn = async () => {
    try { await signInWithGoogle(); }
    catch { toast({ title: "Sign in failed", description: "Failed to sign in with Google.", variant: "destructive" }); }
  };

  const handleSignOut = async () => {
    try { await signOutUser(); }
    catch { toast({ title: "Sign out failed", description: "Failed to sign out.", variant: "destructive" }); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !recruiterProfile) {
      toast({ title: "Authentication required", description: "Please sign in to continue.", variant: "destructive" });
      return;
    }
    if (!checkRecruiterLimit(recruiterProfile)) {
      toast({ title: "Usage limit reached", description: `You've reached your analysis limit.`, variant: "destructive" });
      return;
    }
    if (!githubData) return;
    setIsProcessing(true);
    try {
      let finalData: PortfolioData = { ...githubData };
      if (leetcodeData) finalData.leetcodeStats = leetcodeData;
      sessionStorage.setItem("recruiterPrefs", JSON.stringify({ requiredTechStack, experienceLevel }));

      if (resumeFile) {
        setStatus("AI is parsing your resume...");
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const formData = new FormData();
        formData.append("resume", resumeFile);
        formData.append("githubData", JSON.stringify(githubData));
        const response = await fetch(`${supabaseUrl}/functions/v1/parse-resume`, {
          method: "POST",
          headers: { Authorization: `Bearer ${supabaseKey}` },
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

      setStatus("Generating analysis...");
      sessionStorage.setItem("portfolioData", JSON.stringify(finalData));
      await updateRecruiterUsage(user.email!);

      const candidateId = await storeCandidateAnalysis({
        githubUsername: githubData.githubStats?.username || "",
        leetcodeUsername: leetcodeData?.username,
        name: githubData.name,
        portfolioData: finalData,
        analysis: null,
        recruiterEmail: user.email!,
      });
      sessionStorage.setItem("candidateId", candidateId);

      const historyId = await addRecruiterHistory(user.email!, {
        portfolioData: finalData,
        analysis: null,
        createdAt: new Date().toISOString(),
        candidateId,
      });
      sessionStorage.setItem("historyId", historyId);
      navigate(`/recruiter?preview=1`);
    } catch (e: any) {
      toast({ title: "Error processing data", description: e.message || "Something went wrong.", variant: "destructive" });
    } finally { setIsProcessing(false); setStatus(""); }
  };

  /* ── loading spinner ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1f3a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-9 h-9 animate-spin text-[#3fc4e7]" />
          <p className="text-[#b8c7e0] text-sm font-body">Loading...</p>
        </div>
      </div>
    );
  }

  if (showPreview) return <PreviewPage overrideThemeId="recruiter" />;

  /* ── sign-in gate ── */
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0b1f3a] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <NavyCard className="p-10 text-center shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-[#3fc4e7]/15 border border-[#3fc4e7]/30 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-[#3fc4e7]" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-3">Recruiter Access</h1>
            <p className="text-[#b8c7e0] font-body text-sm leading-relaxed mb-8">
              Sign in with your Google account to access the recruiter analysis dashboard.
            </p>
            <Button
              onClick={handleSignIn}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black hover:opacity-90 transition-opacity rounded-xl font-display"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign in with Google
            </Button>
            <div className="mt-8 pt-6 border-t border-white/10">

      <p className="text-sm text-gray-400 mb-3">
        Want deeper candidate insights?
      </p>

      <Button
        variant="outline"
        className="w-full border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
        onClick={() => navigate("/premium")}
      >
        Explore Premium Features
      </Button>

    </div>
          </NavyCard>
        </motion.div>
      </div>
    );
  }

  /* ── pending approval ── */
  if (!isApprovedRecruiter) {
    return (
      <div className="min-h-screen bg-[#0b1f3a] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <NavyCard className="p-10 text-center max-w-sm shadow-xl">
            <Shield className="w-14 h-14 text-[#b8c7e0] mx-auto mb-5" />
            <h1 className="font-display text-xl font-bold text-white mb-3">Access Pending Approval</h1>
            <p className="text-[#b8c7e0] text-sm font-body mb-6 leading-relaxed">
              Your recruiter account (<span className="text-[#69d2f1]">{user?.email}</span>) is pending approval. Please contact an administrator.
            </p>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="border-[#3fc4e7]/30 text-[#69d2f1] hover:bg-[#3fc4e7]/10 bg-transparent"
            >
              Sign Out
            </Button>
          </NavyCard>
        </motion.div>
      </div>
    );
  }

  /* ── main dashboard ── */
  return (
    <div className="min-h-screen bg-[#0b1f3a] text-white">

      {/* ── Sticky top nav ── */}
      <div className="sticky top-0 z-50 bg-[#0b1f3a]/95 backdrop-blur-sm border-b border-[#3fc4e7]/15">
        <div className="container mx-auto px-4 py-3.5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-lg font-bold text-white leading-tight">Recruiter Dashboard</h1>
              <p className="text-xs text-[#b8c7e0] font-body">
                Level {recruiterProfile.level} &nbsp;·&nbsp; {recruiterProfile.usageCount} analyses used
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">{user.displayName}</p>
                <p className="text-xs text-[#b8c7e0]">{user.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="border-[#3fc4e7]/30 text-[#69d2f1] hover:bg-[#3fc4e7]/10 bg-transparent"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-xl pt-10 pb-20">

        {/* ── History ── */}
        {historyEntries.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h2 className="font-display text-xl font-bold text-white mb-4">Previous Analyses</h2>
            <div className="space-y-2">
              {historyEntries.map((h, idx) => (
                <NavyCard key={idx} className="flex items-center justify-between p-4 hover:border-[#3fc4e7]/35 transition-colors">
                  <div>
                    <p className="font-semibold text-white text-sm font-display">
                      {h.portfolioData.name || "Unnamed"}
                    </p>
                    <p className="text-xs text-[#b8c7e0] font-body mt-0.5">
                      {new Date(h.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      sessionStorage.setItem("portfolioData", JSON.stringify(h.portfolioData));
                      navigate("/recruiter?preview=1");
                    }}
                    className="bg-[#3fc4e7]/15 text-[#69d2f1] border border-[#3fc4e7]/30 hover:bg-[#3fc4e7]/25 font-body text-xs"
                  >
                    View
                  </Button>
                </NavyCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Hero copy ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#3fc4e7]/10 text-[#69d2f1] px-4 py-1.5 rounded-full text-sm font-display font-semibold mb-4 border border-[#3fc4e7]/20">
            <Shield className="w-4 h-4" /> Candidate Analysis
          </div>
          <h1 className="font-display text-4xl font-bold text-white mb-3">Analyze Candidate</h1>
          <p className="text-[#b8c7e0] font-body text-base max-w-sm mx-auto leading-relaxed">
            Provide the candidate's GitHub profile, LeetCode username, and resume for AI-powered assessment.
          </p>
        </motion.div>

        {/* ── Form ── */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onSubmit={handleSubmit}
          className="space-y-7"
        >
          <NavyCard className="p-6 space-y-7">

            {/* GitHub URL */}
            <div className="space-y-2.5">
              <FieldLabel icon={Github} text="Candidate GitHub Profile URL" />
              <Input
                type="url"
                placeholder="https://github.com/candidateusername"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                required
                className="h-12 text-base bg-[#0b1f3a] border-[#3fc4e7]/20 text-white placeholder:text-[#b8c7e0]/50 focus:border-[#3fc4e7]/50 focus:ring-[#3fc4e7]/20"
              />
              <StatusRow
                loading={githubFetching && "Fetching candidate's GitHub profile..."}
                error={githubError}
                success={githubData && !githubFetching && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-3 bg-[#0b1f3a] border border-[#3fc4e7]/20 rounded-xl"
                  >
                    <img src={githubData.avatar} alt={githubData.name} className="w-11 h-11 rounded-full border-2 border-[#3fc4e7]/30" />
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-sm text-white truncate">{githubData.name}</p>
                      <p className="text-xs text-[#b8c7e0] font-body truncate">
                        {githubData.title} · {githubData.githubStats?.publicRepos || 0} repos · {githubData.skills.slice(0, 4).join(", ")}
                      </p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-[#3fc4e7] flex-shrink-0" />
                  </motion.div>
                )}
              />
            </div>

            {/* LeetCode */}
            <div className="space-y-2.5">
              <FieldLabel icon={Code2} text="Candidate LeetCode Username" note="(for coding assessment)" />
              <Input
                type="text"
                placeholder="candidate_leetcode_username"
                value={leetcodeUsername}
                onChange={(e) => setLeetcodeUsername(e.target.value)}
                className="h-12 text-base bg-[#0b1f3a] border-[#3fc4e7]/20 text-white placeholder:text-[#b8c7e0]/50 focus:border-[#3fc4e7]/50 focus:ring-[#3fc4e7]/20"
              />
              <StatusRow
                loading={leetcodeFetching && "Fetching LeetCode profile..."}
                error={leetcodeError}
                success={leetcodeData && !leetcodeFetching && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-3 bg-[#0b1f3a] border border-[#3fc4e7]/20 rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#3fc4e7]/15 border border-[#3fc4e7]/25 flex items-center justify-center flex-shrink-0">
                      <Code2 className="w-5 h-5 text-[#3fc4e7]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-sm text-white">{leetcodeData.username}</p>
                      <p className="text-xs text-[#b8c7e0] font-body">
                        {leetcodeData.totalSolved} solved · Easy {leetcodeData.easySolved} · Med {leetcodeData.mediumSolved} · Hard {leetcodeData.hardSolved}
                      </p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-[#3fc4e7] flex-shrink-0" />
                  </motion.div>
                )}
              />
            </div>

          </NavyCard>

          {/* Recruiter Preferences */}
          <NavyCard className="p-6 space-y-6">
            <p className="text-xs font-bold text-[#69d2f1] uppercase tracking-widest font-display">Role Requirements</p>

            {/* Tech Stack */}
            <div className="space-y-2.5">
              <FieldLabel icon={Search} text="Required Tech Stack" note="(optional — AI will compare)" />
              <TechStackInput selected={requiredTechStack} onChange={setRequiredTechStack} />
              {requiredTechStack.length > 0 && (
                <p className="text-xs text-[#b8c7e0] font-body">
                  {requiredTechStack.length} technolog{requiredTechStack.length === 1 ? "y" : "ies"} selected — AI will evaluate the candidate's match.
                </p>
              )}
            </div>

            {/* Experience Level */}
            <div className="space-y-2.5">
              <FieldLabel icon={Briefcase} text="Experience Level" note="(optional — hiring preference)" />
              <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                <SelectTrigger className="h-12 text-base bg-[#0b1f3a] border-[#3fc4e7]/20 text-white focus:border-[#3fc4e7]/50 data-[placeholder]:text-[#b8c7e0]/60">
                  <SelectValue placeholder="Any experience level" />
                </SelectTrigger>
                <SelectContent className="bg-[#132f52] border-[#3fc4e7]/20 text-white">
                  {[
                    ["any", "Any Level"],
                    ["intern", "Intern"],
                    ["fresher", "Fresher / Just Graduated"],
                    ["entry", "Entry Level (0-2 years)"],
                    ["mid", "Mid Level (2-5 years)"],
                    ["senior", "Senior (5-8 years)"],
                    ["staff", "Staff / Lead (8+ years)"],
                    ["principal", "Principal / Architect (10+ years)"],
                  ].map(([val, label]) => (
                    <SelectItem key={val} value={val} className="text-[#b8c7e0] hover:text-white focus:bg-[#3fc4e7]/15 focus:text-white">
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </NavyCard>

          {/* Resume Upload */}
          <NavyCard className="p-6">
            <FieldLabel icon={FileText} text="Candidate Resume" note="enriches experience & education" />
            <label className="mt-3 flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-[#3fc4e7]/25 rounded-xl cursor-pointer hover:border-[#3fc4e7]/50 hover:bg-[#3fc4e7]/5 transition-all duration-200">
              {resumeFile ? (
                <div className="flex items-center gap-2.5 text-white">
                  <CheckCircle2 className="w-5 h-5 text-[#3fc4e7]" />
                  <span className="font-body text-sm">{resumeFile.name}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-[#b8c7e0]">
                  <Upload className="w-8 h-8 mb-2 text-[#3fc4e7]/60" />
                  <span className="font-body text-sm">Click to upload candidate resume</span>
                  <span className="font-body text-xs mt-1 text-[#b8c7e0]/60">PDF, DOC, TXT up to 10MB</span>
                </div>
              )}
              <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
            </label>
          </NavyCard>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isProcessing || !githubData}
            className="w-full h-13 py-3.5 text-base font-bold rounded-xl bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black hover:opacity-90 transition-opacity shadow-lg disabled:opacity-40 font-display"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                {status || "Processing..."}
              </>
            ) : (
              <>
                <ArrowRight className="w-5 h-5 mr-2" />
                Generate Analysis Report
              </>
            )}
          </Button>
        </motion.form>
      </div>
    </div>
  );
};

export default RecruiterPage;
