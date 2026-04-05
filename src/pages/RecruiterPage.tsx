import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Github, Upload, ArrowRight, FileText, CheckCircle2, AlertCircle,
  Loader2, Code2, Briefcase, Search, LogIn, LogOut, Shield,
  MessageCircle, X, Send,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import PreviewPage from "./PreviewPage";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  signInWithGoogle, signOutUser, updateRecruiterUsage, incrementRecruiterRequestUsage,
  checkRecruiterLimit, addRecruiterHistory, fetchRecruiterHistory,
  storeCandidateAnalysis, subscribeRecruiterRequest, RecruiterRequest,
  submitSupportTicket,
} from "@/lib/firebase";
import { sanitizeSupportMessage, sanitizeEmail, sanitizeText } from "@/lib/sanitize";
import TechStackInput from "@/components/TechStackInput";
import type { PortfolioData } from "@/lib/mockData";

/* ── friendly error messages ─────────────────────────────────── */
const friendlyError = (e: any): string => {
  const msg: string = e?.message || String(e) || "";
  if (msg.includes("503") || msg.includes("504") || msg.includes("timeout") ||
      msg.includes("overloaded") || msg.includes("busy") || msg.includes("rate limit") ||
      msg.includes("too many") || msg.includes("upstream") || msg.includes("gateway"))
    return "⏳ Server is busy right now. Please wait a moment and try again.";
  if (msg.includes("Failed to fetch") || msg.includes("NetworkError") || msg.includes("network"))
    return "🌐 Network error. Please check your connection and try again.";
  if (msg.includes("Function") || msg.includes("edge") || msg.includes("invoke"))
    return "⏳ Our servers are temporarily busy. Please try again in a few seconds.";
  return msg || "Something went wrong. Please try again.";
};

/* ── name validation ─────────────────────────────────────────── */
/** Returns true if at least one 3-char substring of `a` appears in `b` (case-insensitive) */
const shareAtLeast3Chars = (a: string, b: string): boolean => {
  if (!a || !b) return false;
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const ca = clean(a), cb = clean(b);
  if (ca.length < 3 || cb.length < 3) return false;
  for (let i = 0; i <= ca.length - 3; i++) {
    if (cb.includes(ca.slice(i, i + 3))) return true;
  }
  return false;
};

/** Extract GitHub username from a URL string */
const extractGithubUser = (url: string) =>
  url?.match(/github\.com\/([^\/\?#\s]+)/i)?.[1]?.toLowerCase() || "";

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
  const [recruiterRequest, setRecruiterRequest] = useState<RecruiterRequest | null>(null);
  const [requestLoading, setRequestLoading] = useState(true);
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportMsg, setSupportMsg] = useState("");
  const [supportSending, setSupportSending] = useState(false);
  const [supportSent, setSupportSent] = useState(false);

  // Subscribe to recruiter request status
  useEffect(() => {
    if (!user) { setRequestLoading(false); return; }
    const unsub = subscribeRecruiterRequest(user.uid, (r) => {
      setRecruiterRequest(r);
      setRequestLoading(false);
    });
    return unsub;
  }, [user]);

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
// ONLY the changed section is rewritten cleanly — rest of your file stays SAME

const [debouncedGithubUrl, setDebouncedGithubUrl] = useState("");
const [debouncedLeetcode, setDebouncedLeetcode] = useState("");
const [nameWarning, setNameWarning] = useState("");

/* ── GitHub Debounce ── */
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedGithubUrl(githubUrl);
  }, 1000);

  return () => clearTimeout(timer);
}, [githubUrl]);

useEffect(() => {
  const match = debouncedGithubUrl.match(/github\.com\/([^\/\?#]+)/);

  if (!debouncedGithubUrl || !match) {
    setGithubData(null);
    setGithubError("");
    return;
  }

  const fetchGithub = async () => {
    setGithubFetching(true);
    setGithubError("");

    try {
      const { data, error } = await supabase.functions.invoke("fetch-github", {
        body: { githubUrl: debouncedGithubUrl },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setGithubData(data);
      setNameWarning(""); // cleared — full cross-check happens on submit
    } catch (e: any) {
      setGithubError(friendlyError(e));
      setGithubData(null);
    } finally {
      setGithubFetching(false);
    }
  };

  fetchGithub();
}, [debouncedGithubUrl]);

/* ── LeetCode Debounce ── */
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedLeetcode(leetcodeUsername);
  }, 1000);

  return () => clearTimeout(timer);
}, [leetcodeUsername]);

useEffect(() => {
  if (!debouncedLeetcode.trim()) {
    setLeetcodeData(null);
    setLeetcodeError("");
    return;
  }

  const fetchLeetcode = async () => {
    setLeetcodeFetching(true);
    setLeetcodeError("");

    try {
      const { data, error } = await supabase.functions.invoke("fetch-leetcode", {
        body: { username: debouncedLeetcode },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setLeetcodeData(data);
    } catch (e: any) {
      setLeetcodeError(friendlyError(e));
      setLeetcodeData(null);
    } finally {
      setLeetcodeFetching(false);
    }
  };

  fetchLeetcode();
}, [debouncedLeetcode]);

  const loadHistory = async () => {
    if (user?.email) {
      const h = await fetchRecruiterHistory(user.email);
      setHistoryEntries(h);
    }
  };

  


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
      let finalData: PortfolioData = { ...githubData, leetcodeStats: leetcodeData ?? null };
      sessionStorage.setItem("recruiterPrefs", JSON.stringify({ requiredTechStack, experienceLevel }));

      // ── LeetCode name validation (optional field) ────────────────────────
      if (leetcodeData?.username) {
        const lcUser = leetcodeData.username.toLowerCase().replace(/[^a-z0-9]/g, "");
        const ghName = (githubData.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        const ghUser = extractGithubUser(githubUrl);
        const matchesName = shareAtLeast3Chars(lcUser, ghName);
        const matchesUser = shareAtLeast3Chars(lcUser, ghUser);
        if (!matchesName && !matchesUser) {
          setIsProcessing(false);
          setStatus("");
          setNameWarning(
            `LeetCode username "${leetcodeData.username}" doesn't match the GitHub profile "${githubData.name}" (@${ghUser}). They must share at least 3 consecutive characters — please verify this LeetCode account belongs to the same candidate.`
          );
          return;
        }
      }

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

        // ── NAME VALIDATION ──────────────────────────────────────────
        const resumeName: string = (data.name || "").trim();
        const githubName: string = (githubData.name || "").trim();
        const githubUser: string = extractGithubUser(githubUrl);

        // 1. Resume name must share ≥3 chars with GitHub display name OR username
        if (resumeName && githubName) {
          const nameMatchesDisplay = shareAtLeast3Chars(resumeName, githubName);
          const nameMatchesUsername = shareAtLeast3Chars(resumeName, githubUser);
          if (!nameMatchesDisplay && !nameMatchesUsername) {
            setIsProcessing(false);
            setStatus("");
            setNameWarning(
              `Name mismatch: Resume says "${resumeName}" but GitHub shows "${githubName}" (@${githubUser}). They must share at least 3 consecutive characters — please verify you've entered the correct candidate's GitHub profile.`
            );
            return;
          }
        }

        // 2. If resume contains a GitHub URL, it must match the one entered
        const resumeGithub: string = (data.github || "").trim();
        if (resumeGithub) {
          const resumeGhUser = extractGithubUser(resumeGithub);
          const enteredGhUser = extractGithubUser(githubUrl);
          if (resumeGhUser && enteredGhUser && resumeGhUser !== enteredGhUser) {
            setIsProcessing(false);
            setStatus("");
            setNameWarning(
              `GitHub mismatch: The resume lists GitHub as "@${resumeGhUser}" but you entered "@${enteredGhUser}". Please ensure the GitHub URL and resume belong to the same candidate.`
            );
            return;
          }
        }

        setNameWarning(""); // all checks passed
        // ── END VALIDATION ───────────────────────────────────────────
      }

      setStatus("Generating analysis...");
      sessionStorage.setItem("portfolioData", JSON.stringify(finalData));
      await updateRecruiterUsage(user.email!);
      await incrementRecruiterRequestUsage(user.uid);

      const candidateId = await storeCandidateAnalysis({
        githubUsername: githubData.githubStats?.username || "",
        ...(leetcodeData?.username ? { leetcodeUsername: leetcodeData.username } : {}),
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
      toast({ title: "Error processing data", description: friendlyError(e), variant: "destructive" });
    } finally { setIsProcessing(false); setStatus(""); }
  };

  /* ── loading spinner ── */
  if (loading || requestLoading) {
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

  /* ── not signed in → send to landing to sign in properly ── */
  if (!user) {
    navigate("/for-recruiters", { replace: true });
    return null;
  }

  /* ── signed in but no approved request → send to landing ── */
  if (!recruiterRequest || recruiterRequest.status === "rejected") {
    navigate("/for-recruiters", { replace: true });
    return null;
  }

  /* ── pending approval (from our new request system) ── */
  if (user && recruiterRequest?.status === "pending") {
    return (
      <div className="min-h-screen bg-[#0b1f3a] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <NavyCard className="p-10 text-center max-w-md shadow-xl">
            <div className="text-5xl mb-4">⏳</div>
            <h1 className="font-display text-2xl font-bold text-white mb-3">Waiting for Approval</h1>
            <p className="text-[#b8c7e0] text-sm font-body mb-6 leading-relaxed">
              Your <strong className="text-[#3fc4e7]">{recruiterRequest.packageName}</strong> plan request is under review. The admin will approve it shortly — this page updates automatically.
            </p>
            <div className="bg-[#0b1f3a] rounded-xl p-4 text-left text-sm font-body space-y-2 border border-[#3fc4e7]/10 mb-6">
              <div className="flex justify-between"><span className="text-[#b8c7e0]">Plan</span><span className="text-[#3fc4e7] font-bold">{recruiterRequest.packageName}</span></div>
              <div className="flex justify-between"><span className="text-[#b8c7e0]">Status</span><span className="text-amber-400 font-bold">Pending</span></div>
              <div className="flex justify-between"><span className="text-[#b8c7e0]">Requested</span><span className="text-white">{new Date(recruiterRequest.requestedAt).toLocaleDateString()}</span></div>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="border-[#3fc4e7]/30 text-[#69d2f1] hover:bg-[#3fc4e7]/10 bg-transparent w-full">
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
                <span className="text-[#3fc4e7] font-semibold">{recruiterRequest?.packageName ?? recruiterProfile?.packageName ?? "Starter"}</span>
                &nbsp;·&nbsp;
                {recruiterRequest?.usageCount ?? recruiterProfile?.usageCount ?? 0}
                {" / "}
                {(recruiterRequest?.packageLimit ?? recruiterProfile?.packageLimit) === -1
                  ? "∞"
                  : (recruiterRequest?.packageLimit ?? recruiterProfile?.packageLimit ?? 25)
                } analyses used
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

            {/* Required Tech Stack */}
            <div className="space-y-2.5">
              <FieldLabel icon={Code2} text="Required Tech Stack" note="(optional)" />
              <TechStackInput selected={requiredTechStack} onChange={setRequiredTechStack} />
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
            <FieldLabel icon={FileText} text="Candidate Resume" note="required" />
            <label className={`mt-3 flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${resumeFile ? "border-[#3fc4e7]/60 bg-[#3fc4e7]/5" : "border-red-400/40 hover:border-[#3fc4e7]/50 hover:bg-[#3fc4e7]/5"}`}>
              {resumeFile ? (
                <div className="flex items-center gap-2.5 text-white">
                  <CheckCircle2 className="w-5 h-5 text-[#3fc4e7]" />
                  <span className="font-body text-sm">{resumeFile.name}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-[#b8c7e0]">
                  <Upload className="w-8 h-8 mb-2 text-red-400/70" />
                  <span className="font-body text-sm">Upload candidate resume <span className="text-red-400 font-semibold">*</span></span>
                  <span className="font-body text-xs mt-1 text-[#b8c7e0]/60">PDF only — required for analysis</span>
                </div>
              )}
              <input type="file" accept=".pdf" className="hidden" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
            </label>
          </NavyCard>

          {/* Name mismatch warning */}
          {nameWarning && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl"
            >
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-400 font-semibold text-sm font-display mb-1">Identity Mismatch Detected</p>
                <p className="text-amber-300/80 text-xs font-body leading-relaxed">{nameWarning}</p>
                <button
                  type="button"
                  onClick={() => setNameWarning("")}
                  className="text-amber-400/60 text-xs mt-2 hover:text-amber-400 transition-colors font-body"
                >
                  Dismiss and try different inputs
                </button>
              </div>
            </motion.div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={isProcessing || !githubData || !resumeFile || !!nameWarning}
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

      {/* ── Support floating button ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

        {/* Support modal */}
        {supportOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            className="bg-[#132f52] border border-[#3fc4e7]/25 rounded-2xl shadow-2xl w-80 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#3fc4e7]/15 bg-[#0b1f3a]/60">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#3fc4e7]" />
                <span className="font-display font-semibold text-white text-sm">Customer Support</span>
              </div>
              <button onClick={() => { setSupportOpen(false); setSupportSent(false); setSupportMsg(""); }}
                className="text-[#b8c7e0]/50 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4">
              {supportSent ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                  <p className="text-white font-semibold text-sm mb-1">Message sent!</p>
                  <p className="text-[#b8c7e0] text-xs">Our team will get back to you soon.</p>
                  <button onClick={() => { setSupportSent(false); setSupportMsg(""); }}
                    className="mt-3 text-[#3fc4e7] text-xs hover:text-white transition-colors">
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-[#b8c7e0] text-xs font-body mb-3">
                    Describe your issue and we'll help you as soon as possible.
                  </p>
                  <textarea
                    value={supportMsg}
                    onChange={(e) => setSupportMsg(e.target.value)}
                    placeholder="Describe your issue..."
                    rows={4}
                    className="w-full bg-[#0b1f3a] border border-[#3fc4e7]/20 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-[#b8c7e0]/30 focus:outline-none focus:border-[#3fc4e7]/50 resize-none font-body"
                  />
                  <Button
                    disabled={!supportMsg.trim() || supportSending}
                    onClick={async () => {
                      if (!supportMsg.trim() || !user) return;
                      setSupportSending(true);
                      try {
                        await submitSupportTicket({
                          recruiterEmail: sanitizeEmail(user.email || ""),
                          recruiterName: sanitizeText(user.displayName || user.email || "", 100),
                          message: sanitizeSupportMessage(supportMsg),
                          createdAt: new Date().toISOString(),
                          status: "open",
                        });
                        setSupportSent(true);
                        setSupportMsg("");
                      } catch {
                        toast({ title: "Failed to send", description: "Please try again.", variant: "destructive" });
                      } finally {
                        setSupportSending(false);
                      }
                    }}
                    className="w-full mt-2 bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black font-bold rounded-xl text-sm h-9 hover:opacity-90"
                  >
                    {supportSending
                      ? <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />Sending…</>
                      : <><Send className="w-3.5 h-3.5 mr-1.5" />Send Message</>}
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Floating button */}
        <button
          onClick={() => setSupportOpen(!supportOpen)}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black flex items-center justify-center shadow-lg shadow-[#3fc4e7]/25 hover:scale-105 transition-transform"
        >
          {supportOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default RecruiterPage;
