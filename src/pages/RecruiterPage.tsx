import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Github, Upload, ArrowRight, FileText, CheckCircle2, AlertCircle,
  Loader2, Code2, Briefcase, Search, LogIn, LogOut, Shield,
  MessageCircle, X, Send, Zap,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PreviewPage from "./PreviewPage";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  signInWithGoogle, signOutUser, updateRecruiterUsage, incrementRecruiterRequestUsage,
  checkRecruiterLimit, addRecruiterHistory, fetchRecruiterHistory,
  storeCandidateAnalysis, findExistingCandidate, subscribeRecruiterRequest, RecruiterRequest,
  submitSupportTicket, subscribeSiteSettings, SiteSettings
} from "@/lib/firebase";
import { fetchRecruiterDrives } from "@/lib/firebase";
import { sanitizeSupportMessage, sanitizeEmail, sanitizeText } from "@/lib/sanitize";
import TechStackInput from "@/components/TechStackInput";
import type { PortfolioData } from "@/lib/mockData";
import { fetchDriveById } from "@/lib/firebase";
import type { Drive } from "@/lib/firebase";

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

/** Extract GitHub username from a URL string */
const extractGithubUser = (url: string) =>
  url?.match(/github\.com\/([^\/\?#\s]+)/i)?.[1]?.toLowerCase() || "";

const isValidGithubUrl = (url: string) =>
  /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_-]+(?:\/(?=(?:[?#]|$))(?:[?#].*)?)?$/i.test(url.trim());

const isValidLinkedinUrl = (url: string) =>
  /^https?:\/\/(www\.)?linkedin\.com\/(in|pub|profile)\/.+/i.test(url.trim());

const isValidInstagramUrl = (url: string) =>
  /^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._-]+(?:\/?(?:[?#].*)?)?$/i.test(url.trim());

const isValidWebsiteUrl = (url: string) =>
  /^https?:\/\/.+\..+/i.test(url.trim());

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
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({ portfolioEnabled: true, recruiterEnabled: true });
  const [drives, setDrives] = useState<Drive[]>([]);
const [selectedDrive, setSelectedDrive] = useState<Drive | null>(null);
const [selectedFields, setSelectedFields] = useState<string[]>([]);
const [selectedDriveId, setSelectedDriveId] = useState<string>("");

  useEffect(() => {
  const loadDrives = async () => {
    if (!user?.email) return;
    const data = await fetchRecruiterDrives(user.email);
    setDrives(data);
  };

  loadDrives();
}, [user]);
  useEffect(() => {
    const unsub = subscribeSiteSettings(setSiteSettings);
    return unsub;
  }, []);

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
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [instagramContent, setInstagramContent] = useState<any>(null);
  const [websiteContent, setWebsiteContent] = useState<any>(null);
  const [instagramFetching, setInstagramFetching] = useState(false);
  const [websiteFetching, setWebsiteFetching] = useState(false);
  const [instagramError, setInstagramError] = useState("");
  const [websiteError, setWebsiteError] = useState("");
  const [aptitudeScore, setAptitudeScore] = useState<number | string>("");
  const [technicalScore, setTechnicalScore] = useState<number | string>("");
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [searchParams] = useSearchParams();
  const driveId = searchParams.get("driveId");
  const showPreview = searchParams.get("preview") === "1";
  const needsLinkedin = selectedDrive?.selectedFields.includes("linkedin");
  const needsInstagram = selectedDrive?.selectedFields.includes("instagram");
  const needsWebsite = selectedDrive?.selectedFields.includes("website");
  const needsAptitude = selectedDrive?.selectedFields.includes("aptitudeScore");
  const needsTechnical = selectedDrive?.selectedFields.includes("technicalScore");
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

  const [debouncedGithubUrl, setDebouncedGithubUrl] = useState("");
  const [debouncedLeetcode, setDebouncedLeetcode] = useState("");

  const githubValid = !selectedDrive?.selectedFields.includes("github") || Boolean(githubData);
  const resumeValid = !selectedDrive?.selectedFields.includes("resume") || Boolean(resumeFile);
  const leetcodeValid = !selectedDrive?.selectedFields.includes("leetcode") || Boolean(leetcodeData);
  const linkedinValid = !selectedDrive?.selectedFields.includes("linkedin") || isValidLinkedinUrl(linkedinUrl);
  const instagramValid = !selectedDrive?.selectedFields.includes("instagram") || isValidInstagramUrl(instagramUrl);
  const websiteValid = !selectedDrive?.selectedFields.includes("website") || isValidWebsiteUrl(websiteUrl);
  const aptitudeValid = !selectedDrive?.selectedFields.includes("aptitudeScore") || (aptitudeScore !== "" && !isNaN(Number(aptitudeScore)));
  const technicalValid = !selectedDrive?.selectedFields.includes("technicalScore") || (technicalScore !== "" && !isNaN(Number(technicalScore)));
  const isFormValid = Boolean(selectedDrive) && githubValid && resumeValid && leetcodeValid && linkedinValid && instagramValid && websiteValid && aptitudeValid && technicalValid;

/* ── GitHub Debounce ── */
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedGithubUrl(githubUrl);
  }, 1000);

  return () => clearTimeout(timer);
}, [githubUrl]);

useEffect(() => {
  if (!debouncedGithubUrl.trim() || !isValidGithubUrl(debouncedGithubUrl)) {
    setGithubData(null);
    setGithubError(debouncedGithubUrl.trim() ? "Enter a valid GitHub profile URL." : "");
    return;
  }

  const parseApiJson = async (res: Response) => {
    const text = await res.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return { error: text.trim() || `Invalid JSON response (${res.status})` };
    }
  };

  const fetchGithub = async () => {
    setGithubFetching(true);
    setGithubError("");

    try {
      const res = await fetch("/api/fetch-github", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ githubUrl: debouncedGithubUrl.trim() }) });
      const data = await parseApiJson(res);
      if (!res.ok) throw new Error(data?.error || `GitHub API error: ${res.status}`);
      if (data?.error) throw new Error(data.error);

      setGithubData(data);
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
      const res = await fetch("/api/fetch-leetcode", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: debouncedLeetcode }) });
      const data = await parseApiJson(res);
      if (!res.ok) throw new Error(data?.error || `LeetCode API error: ${res.status}`);
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

/* ── Instagram fetch (debounced) ── */
useEffect(() => {
  if (!instagramUrl.trim() || !isValidInstagramUrl(instagramUrl) || !selectedDrive?.selectedFields.includes("instagram")) {
    setInstagramContent(null);
    setInstagramError("");
    return;
  }
  const timer = setTimeout(async () => {
    setInstagramFetching(true);
    setInstagramError("");
    try {
      const res = await fetch("/api/fetch-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: instagramUrl.trim(), type: "instagram" }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed to fetch Instagram");
      setInstagramContent(data);
    } catch (e: any) {
      setInstagramError("Could not load Instagram profile — AI will analyze URL only.");
      setInstagramContent({ url: instagramUrl.trim(), type: "instagram", fallback: true });
    } finally {
      setInstagramFetching(false);
    }
  }, 1200);
  return () => clearTimeout(timer);
}, [instagramUrl, selectedDrive]);

/* ── Website fetch (debounced) ── */
useEffect(() => {
  if (!websiteUrl.trim() || !isValidWebsiteUrl(websiteUrl) || !selectedDrive?.selectedFields.includes("website")) {
    setWebsiteContent(null);
    setWebsiteError("");
    return;
  }
  const timer = setTimeout(async () => {
    setWebsiteFetching(true);
    setWebsiteError("");
    try {
      const res = await fetch("/api/fetch-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: websiteUrl.trim(), type: "website" }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed to fetch website");
      setWebsiteContent(data);
    } catch (e: any) {
      setWebsiteError("Could not load website — AI will analyze URL only.");
      setWebsiteContent({ url: websiteUrl.trim(), type: "website", fallback: true });
    } finally {
      setWebsiteFetching(false);
    }
  }, 1200);
  return () => clearTimeout(timer);
}, [websiteUrl, selectedDrive]);

  const [historySortBy, setHistorySortBy] = useState<"date" | "score">("date");

  useEffect(() => {
    if (!showPreview) {
      sessionStorage.removeItem("candidateId");
      sessionStorage.removeItem("historyId");
      sessionStorage.removeItem("cachedAnalysis");
      sessionStorage.removeItem("savedAnalysis");
      sessionStorage.removeItem("driveContext");
      sessionStorage.removeItem("recruiterDriveId");
    }
  }, [showPreview]);

  const loadHistory = async () => {
    if (user?.email) {
      const h = await fetchRecruiterHistory(user.email);
      // Exclude drive-specific history entries from the top 'Previous Analyses' list
      // Only include entries where driveId is null/undefined/empty string
      setHistoryEntries(h.filter((entry: any) => !entry.driveId || String(entry.driveId).trim() === ""));
    }
  };

  const sortedHistory = [...historyEntries].sort((a, b) => {
    if (historySortBy === "score") {
      const sa = a.analysis?.overallScore ?? -1;
      const sb = b.analysis?.overallScore ?? -1;
      return sb - sa;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  
   

  useEffect(() => { if (user) loadHistory(); }, [user]);
  useEffect(() => {
  if (!driveId) return;

  const loadDrive = async () => {
    const data = await fetchDriveById(driveId);

    if (!data) return;

    setSelectedDrive(data);
    setSelectedDriveId(data.id!);
    setSelectedFields(data.selectedFields || []);

    setRequiredTechStack(
      data.requiredTechStack || []
    );

    setExperienceLevel(
      data.experienceLevel || ""
    );
  };

  loadDrive();
}, [driveId]);
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
    // Use recruiterRequest for limit check (new system); fall back to old profile
    const usageCount = recruiterRequest?.usageCount ?? recruiterProfile?.usageCount ?? 0;
    const packageLimit = recruiterRequest?.packageLimit ?? recruiterProfile?.packageLimit ?? 25;
    if (packageLimit !== -1 && usageCount >= packageLimit) {
      toast({ title: "Usage limit reached", description: `You've reached your analysis limit of ${packageLimit}.`, variant: "destructive" });
      return;
    }
    if (!selectedDrive) {
  toast({
    title: "Select a drive",
    description: "Please select a hiring drive first.",
    variant: "destructive",
  });
  return;
}
    const needsGithub = selectedDrive.selectedFields.includes("github");
    const needsResume = selectedDrive.selectedFields.includes("resume");
    const needsLeetcode = selectedDrive.selectedFields.includes("leetcode");
    const needsLinkedin = selectedDrive.selectedFields.includes("linkedin");
    const needsInstagram = selectedDrive.selectedFields.includes("instagram");
    const needsAptitude = selectedDrive.selectedFields.includes("aptitudeScore");
    const needsTechnical = selectedDrive.selectedFields.includes("technicalScore");

    if (needsGithub && !githubData) {
      toast({ title: "GitHub required", description: "Please enter a valid GitHub URL and wait for it to load.", variant: "destructive" });
      return;
    }
    if (needsLinkedin && !linkedinUrl.trim()) {
      toast({ title: "LinkedIn required", description: "Please enter the candidate's LinkedIn profile URL.", variant: "destructive" });
      return;
    }
    if (needsInstagram && !instagramUrl.trim()) {
      toast({ title: "Instagram required", description: "Please enter the candidate's Instagram profile URL.", variant: "destructive" });
      return;
    }
    if (needsWebsite && !websiteUrl.trim()) {
      toast({ title: "Portfolio Website required", description: "Please enter the candidate's portfolio website URL.", variant: "destructive" });
      return;
    }
    if (needsAptitude && (aptitudeScore === "" || isNaN(Number(aptitudeScore)) || Number(aptitudeScore) < 0 || Number(aptitudeScore) > 100)) {
      toast({ title: "Aptitude score required", description: "Enter a score between 0 and 100.", variant: "destructive" });
      return;
    }
    if (needsTechnical && (technicalScore === "" || isNaN(Number(technicalScore)) || Number(technicalScore) < 0 || Number(technicalScore) > 100)) {
      toast({ title: "Technical score required", description: "Enter a score between 0 and 100.", variant: "destructive" });
      return;
    }
    if (needsResume && !resumeFile) {
      toast({ title: "Resume required", description: "Please upload the candidate's resume.", variant: "destructive" });
      return;
    }
    if (needsLeetcode && !leetcodeData) {
      toast({ title: "LeetCode required", description: "Please enter a valid LeetCode username and wait for it to load.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    try {
      const driveContext = selectedDrive;
      const needsLinkedin = selectedDrive.selectedFields.includes("linkedin");
      const needsInstagram = selectedDrive.selectedFields.includes("instagram");
      const needsWebsite = selectedDrive.selectedFields.includes("website");
      const needsAptitude = selectedDrive.selectedFields.includes("aptitudeScore");
      const needsTechnical = selectedDrive.selectedFields.includes("technicalScore");

      // Build finalData only from fields the drive requires
      let finalData: PortfolioData = needsGithub
        ? { ...githubData! }
        : ({} as PortfolioData); // if no github, start empty

      if (needsLeetcode && leetcodeData) {
        finalData = { ...finalData, leetcodeStats: leetcodeData };
      } else {
        finalData = { ...finalData, leetcodeStats: null };
      }

      if (needsLinkedin) {
        finalData = { ...finalData, linkedin: linkedinUrl.trim() };
      }
      if (needsInstagram) {
        finalData = {
          ...finalData,
          instagram: instagramUrl.trim(),
          instagramContent: instagramContent || null,
        };
      }
      if (needsWebsite) {
        finalData = {
          ...finalData,
          website: websiteUrl.trim(),
          websiteContent: websiteContent || null,
        };
      }
      if (needsAptitude) {
        finalData = { ...finalData, aptitudeScore: Number(aptitudeScore) };
      }
      if (needsTechnical) {
        finalData = { ...finalData, technicalScore: Number(technicalScore) };
      }

      if (!finalData.name) {
        finalData = { ...finalData, name: "Candidate" } as PortfolioData;
      }

      sessionStorage.setItem(
        "recruiterPrefs",
        JSON.stringify({
          requiredTechStack:
            driveContext?.requiredTechStack || requiredTechStack,

          experienceLevel:
            driveContext?.experienceLevel || experienceLevel,

          selectedFields:
            driveContext?.selectedFields || [],
        })
      );
      const githubUser = needsGithub ? extractGithubUser(githubUrl) : "";
      const githubName = needsGithub ? (githubData?.name || "").trim() : "";
      const leetcodeUser = needsLeetcode ? (leetcodeData?.username?.trim() || "") : "";

      if (needsResume && resumeFile) {
        setStatus("Reading resume and extracting data...");
        const formData = new FormData();
        formData.append("resume", resumeFile);
        if (githubData) formData.append("githubData", JSON.stringify(githubData));
        const response = await fetch("/api/parse-resume", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          const errData = await response.json().catch(() => ({ error: "Failed to parse resume" }));
          throw new Error(errData.error || `Resume parsing failed (${response.status})`);
        }
        const data = await response.json();
        if (data?.error) throw new Error(data.error);
        finalData = {
          ...finalData,
          ...data,
          avatar: data.avatar || githubData?.avatar,
          githubStats: githubData?.githubStats,
          leetcodeStats: finalData.leetcodeStats,
        };

        // ── NAME VALIDATION ──────────────────────────────────────────
        const resumeName: string = (data.name || "").trim();
        const githubUser: string = extractGithubUser(githubUrl);

        if (resumeName && githubName) {
          // frontend resume/GitHub name matching validation removed
        }

        if (resumeName && leetcodeUser) {
          // frontend resume/LeetCode name matching validation removed
        }

        // 2. If resume contains a GitHub URL, it must match the one entered
        const resumeGithub: string = (data.github || "").trim();
        if (resumeGithub) {
          const resumeGhUser = extractGithubUser(resumeGithub);
          const enteredGhUser = extractGithubUser(githubUrl);
          if (resumeGhUser && enteredGhUser && resumeGhUser !== enteredGhUser) {
            setIsProcessing(false);
            setStatus("");
            // frontend GitHub URL matching validation removed
          }
        }
        // ── END VALIDATION ───────────────────────────────────────────
      }

      setStatus("Looking up previous analyses...");
      sessionStorage.setItem("portfolioData", JSON.stringify(finalData));
      sessionStorage.setItem(
  "driveContext",
  JSON.stringify({
    ...driveContext,
    driveId: selectedDrive?.id,
  })
);
      if (selectedDrive?.id) {
        sessionStorage.setItem("recruiterDriveId", selectedDrive.id);
      }

      // ── Check if this candidate was already analyzed with same inputs ──
      const ghUsername = needsGithub ? extractGithubUser(githubUrl) : `resume-${Date.now()}`;
      const existingCandidate = await findExistingCandidate(
        ghUsername,
        user.email!,
        selectedDrive?.id,
        needsLeetcode ? leetcodeData?.username : undefined,
        selectedDrive?.requiredTechStack || [],
        selectedDrive?.experienceLevel || "",
        selectedDrive?.selectedFields || [],
        needsLinkedin ? linkedinUrl.trim() : undefined,
        needsAptitude ? Number(aptitudeScore) : undefined,
        needsTechnical ? Number(technicalScore) : undefined,
        needsInstagram ? instagramUrl.trim() : undefined
      );

      if (existingCandidate?.analysis) {
        // Use cached result — no Gemini call needed, no usage counted
        sessionStorage.setItem("candidateId", existingCandidate.id || "");
        // Update portfolioData with cached analysis for PreviewPage
        sessionStorage.setItem("portfolioData", JSON.stringify({
          ...finalData,
          ...existingCandidate.portfolioData,
          avatar: finalData.avatar || existingCandidate.portfolioData?.avatar,
          githubStats: finalData.githubStats,
          leetcodeStats: finalData.leetcodeStats,
        }));
        sessionStorage.setItem("cachedAnalysis", JSON.stringify(existingCandidate.analysis));
        navigate(`/recruiter?preview=1`);
        return;
      }

      // ── No cached result — run fresh analysis ──
      setStatus("Running AI-powered candidate analysis...");
      // Track usage in parallel — don't block analysis if tracking fails
      Promise.all([
        updateRecruiterUsage(user.email!).catch((e) => console.warn("Usage tracking failed:", e)),
        incrementRecruiterRequestUsage(user.uid).catch((e) => console.warn("Request usage tracking failed:", e)),
      ]);

      // Firestore does not accept undefined — replace all undefined with null
      const sanitizeForFirestore = (obj: any): any => {
        if (obj === undefined) return null;
        if (obj === null || typeof obj !== "object") return obj;
        if (Array.isArray(obj)) return obj.map(sanitizeForFirestore);
        return Object.fromEntries(
          Object.entries(obj).map(([k, v]) => [k, sanitizeForFirestore(v)])
        );
      };

      const sanitizedPortfolioData = sanitizeForFirestore(finalData);

      const candidateId = await storeCandidateAnalysis({
        driveId: selectedDrive?.id,
        driveName: selectedDrive?.driveName,

        githubUsername: ghUsername,
        ...(selectedDrive?.selectedFields?.includes("leetcode") && leetcodeData?.username
          ? { leetcodeUsername: leetcodeData.username }
          : {}),
        ...(needsLinkedin ? { linkedinUrl: linkedinUrl.trim() } : {}),
        ...(needsInstagram ? { instagramUrl: instagramUrl.trim() } : {}),
        ...(needsAptitude ? { aptitudeScore: Number(aptitudeScore) } : {}),
        ...(needsTechnical ? { technicalScore: Number(technicalScore) } : {}),

        name: finalData.name || githubData?.name || "Candidate",
        email: finalData.email || "",

        portfolioData: sanitizedPortfolioData,

        analysis: null,

        recruiterEmail: user.email!,

        requiredTechStack:
          selectedDrive?.requiredTechStack || [],

        experienceLevel:
          selectedDrive?.experienceLevel || "",

        selectedFields:
          selectedDrive?.selectedFields || [],
      });
      sessionStorage.setItem("candidateId", candidateId);
      sessionStorage.removeItem("cachedAnalysis");

      const historyId = await addRecruiterHistory(user.email!, {
        portfolioData: sanitizedPortfolioData,
        analysis: null,
        createdAt: new Date().toISOString(),
        candidateId,
        driveId: selectedDrive?.id || null,
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

  /* ── recruiter portal maintenance gate ── */
  if (!siteSettings.recruiterEnabled) {
    return (
      <div className="min-h-screen bg-[#0b1f3a] text-white flex flex-col items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="text-7xl mb-6">🛠️</div>
          <h1 className="font-display text-3xl font-bold text-white mb-4">Under Maintenance</h1>
          <p className="text-[#b8c7e0] font-body text-lg mb-8 leading-relaxed">
            The recruiter portal is temporarily unavailable. We're working hard to improve things — check back soon!
          </p>
          <Button onClick={() => navigate("/")} className="rounded-full px-8 bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black font-bold">
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

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
        

        {/* ── Hero copy ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#3fc4e7]/10 text-[#69d2f1] px-4 py-1.5 rounded-full text-sm font-display font-semibold mb-4 border border-[#3fc4e7]/20">
            <Shield className="w-4 h-4" /> Candidate Analysis
          </div>
          <h1 className="font-display text-4xl font-bold text-white mb-3">Analyze Candidate</h1>
          <p className="text-[#b8c7e0] font-body text-base max-w-sm mx-auto leading-relaxed">
           Submit candidate information according to the selected hiring drive requirements.
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
          <div className="space-y-2.5">
  <FieldLabel icon={Briefcase} text="Select Hiring Drive" />

  <Select
    value={selectedDriveId}
    onValueChange={(id) => {
      const drive = drives.find(d => d.id === id) || null;
      setSelectedDrive(drive);
      setSelectedDriveId(id);

      if (drive) {
        setRequiredTechStack(drive.requiredTechStack);
        setExperienceLevel(drive.experienceLevel);
         setSelectedFields(drive.selectedFields || []);
      }
    }}
  >
    <SelectTrigger className="h-12 bg-[#0b1f3a] border-[#3fc4e7]/20">
      <SelectValue placeholder="Choose a drive" />
    </SelectTrigger>

    <SelectContent className="bg-[#132f52] text-white">
      {drives.map((d) => (
        <SelectItem key={d.id} value={d.id!}>
          {d.driveName} ({d.role})
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
          <NavyCard className="p-6 space-y-7">
            {!selectedDrive && (
              <div className="rounded-2xl border border-[#3fc4e7]/20 bg-[#0b1f3a]/80 p-6 text-center text-[#b8c7e0]">
                Select a hiring drive above to show only the candidate details required for that drive.
              </div>
            )}

            {selectedDrive?.selectedFields.includes("github") && (
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
                  loading={
                    githubFetching &&
                    "Fetching candidate's GitHub profile..."
                  }
                  error={githubError}
                  success={
                    githubData &&
                    !githubFetching && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 p-3 bg-[#0b1f3a] border border-[#3fc4e7]/20 rounded-xl"
                      >
                        <img
                          src={githubData.avatar}
                          alt={githubData.name}
                          className="w-11 h-11 rounded-full border-2 border-[#3fc4e7]/30"
                        />

                        <div className="flex-1 min-w-0">
                          <p className="font-display font-semibold text-sm text-white truncate">
                            {githubData.name}
                          </p>

                          <p className="text-xs text-[#b8c7e0] font-body truncate">
                            {githubData.title} · {githubData.githubStats?.publicRepos || 0} repos · {githubData.skills
                              .slice(0, 4)
                              .join(", ")}
                          </p>
                        </div>

                        <CheckCircle2 className="w-5 h-5 text-[#3fc4e7] flex-shrink-0" />
                      </motion.div>
                    )
                  }
                />
              </div>
            )}

            {/* LeetCode */}
            {/* LeetCode */}
{selectedDrive?.selectedFields.includes("leetcode") && (
  <div className="space-y-2.5">
    <FieldLabel
      icon={Code2}
      text="Candidate LeetCode Username"
      note="(for coding assessment)"
    />

    <Input
      type="text"
      placeholder="candidate_leetcode_username"
      value={leetcodeUsername}
      onChange={(e) =>
        setLeetcodeUsername(e.target.value)
      }
      className="h-12 text-base bg-[#0b1f3a] border-[#3fc4e7]/20 text-white placeholder:text-[#b8c7e0]/50 focus:border-[#3fc4e7]/50 focus:ring-[#3fc4e7]/20"
    />

    <StatusRow
      loading={
        leetcodeFetching &&
        "Fetching LeetCode profile..."
      }
      error={leetcodeError}
      success={
        leetcodeData &&
        !leetcodeFetching && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-3 bg-[#0b1f3a] border border-[#3fc4e7]/20 rounded-xl"
          >
            <div className="w-10 h-10 rounded-full bg-[#3fc4e7]/15 border border-[#3fc4e7]/25 flex items-center justify-center flex-shrink-0">
              <Code2 className="w-5 h-5 text-[#3fc4e7]" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-sm text-white">
                {leetcodeData.username}
              </p>

              <p className="text-xs text-[#b8c7e0] font-body">
                {leetcodeData.totalSolved} solved ·
                Easy {leetcodeData.easySolved} ·
                Med {leetcodeData.mediumSolved} ·
                Hard {leetcodeData.hardSolved}
              </p>
            </div>

            <CheckCircle2 className="w-5 h-5 text-[#3fc4e7] flex-shrink-0" />
          </motion.div>
        )
      }
    />
  </div>
)}

{selectedDrive?.selectedFields.includes("linkedin") && (
  <div className="space-y-2.5">
    <FieldLabel icon={Briefcase} text="Candidate LinkedIn URL" note="(URL-based analysis)" />
    <Input
      type="url"
      placeholder="https://linkedin.com/in/candidate"
      value={linkedinUrl}
      onChange={(e) => setLinkedinUrl(e.target.value)}
      className="h-12 text-base bg-[#0b1f3a] border-[#3fc4e7]/20 text-white placeholder:text-[#b8c7e0]/50 focus:border-[#3fc4e7]/50 focus:ring-[#3fc4e7]/20"
    />
    <StatusRow
      loading={selectedDrive?.selectedFields.includes("linkedin") && !linkedinUrl.trim() ? false : undefined}
      error={linkedinUrl && !/^https?:\/\/(www\.)?linkedin\.com\/.+/i.test(linkedinUrl.trim()) ? "Enter a valid LinkedIn URL" : undefined}
      success={
        linkedinUrl.trim() && /^https?:\/\/(www\.)?linkedin\.com\/.+/i.test(linkedinUrl.trim()) && (
          <span className="text-sm text-emerald-400">LinkedIn URL ready for AI analysis</span>
        )
      }
    />
  </div>
)}

{selectedDrive?.selectedFields.includes("instagram") && (
  <div className="space-y-2.5">
    <FieldLabel icon={Briefcase} text="Candidate Instagram URL" note="(public profile)" />
    <Input
      type="url"
      placeholder="https://instagram.com/candidate"
      value={instagramUrl}
      onChange={(e) => setInstagramUrl(e.target.value)}
      className="h-12 text-base bg-[#0b1f3a] border-[#3fc4e7]/20 text-white placeholder:text-[#b8c7e0]/50 focus:border-[#3fc4e7]/50 focus:ring-[#3fc4e7]/20"
    />
    <StatusRow
      loading={instagramFetching && "Loading Instagram profile..."}
      error={
        (instagramUrl && !isValidInstagramUrl(instagramUrl) ? "Enter a valid Instagram URL" : undefined) ||
        (instagramError || undefined)
      }
      success={
        instagramContent && !instagramFetching && !instagramError && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-[#0b1f3a] border border-[#3fc4e7]/20 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-[#3fc4e7] flex-shrink-0" />
            <span className="text-sm text-white">
              {instagramContent.instagramData?.name || instagramContent.instagramData?.username || "Profile"} — content loaded for AI analysis
            </span>
          </motion.div>
        )
      }
    />
  </div>
)}
      {selectedDrive?.selectedFields.includes("website") && (
        <div className="space-y-2.5">
          <FieldLabel icon={Briefcase} text="Candidate Portfolio Website" note="(content will be fetched)" />
          <Input
            type="url"
            placeholder="https://candidate-portfolio.com"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className="h-12 text-base bg-[#0b1f3a] border-[#3fc4e7]/20 text-white placeholder:text-[#b8c7e0]/50 focus:border-[#3fc4e7]/50 focus:ring-[#3fc4e7]/20"
          />
          <StatusRow
            loading={websiteFetching && "Loading portfolio website..."}
            error={
              (websiteUrl && !isValidWebsiteUrl(websiteUrl) ? "Enter a valid website URL" : undefined) ||
              (websiteError || undefined)
            }
            success={
              websiteContent && !websiteFetching && !websiteError && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-[#0b1f3a] border border-[#3fc4e7]/20 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-[#3fc4e7] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{websiteContent.title || "Portfolio loaded"}</p>
                    {websiteContent.websiteData?.metaDescription && (
                      <p className="text-xs text-[#b8c7e0] truncate">{websiteContent.websiteData.metaDescription}</p>
                    )}
                  </div>
                </motion.div>
              )
            }
          />
        </div>
      )}
    

      {selectedDrive?.selectedFields.includes("technicalScore") && (
        <div className="space-y-2.5">
          <Label className="text-white mb-2 block">Technical Test Score (0-100)</Label>
          <Input
            type="number"
            min={0}
            max={100}
            placeholder="91"
            value={technicalScore}
            onChange={(e) => setTechnicalScore(e.target.value === "" ? "" : Number(e.target.value))}
            className="h-12 text-base bg-[#0b1f3a] border-[#3fc4e7]/20 text-white placeholder:text-[#b8c7e0]/50 focus:border-[#3fc4e7]/50 focus:ring-[#3fc4e7]/20"
          />
        </div>
      )}
      {selectedDrive?.selectedFields.includes("aptitudeScore") && (
        <div className="space-y-2.5">
          <Label className="text-white mb-2 block">Aptitude Test Score (0-100)</Label>
          <Input
            type="number"
            min={0}
            max={100}
            placeholder="91"
            value={aptitudeScore}
            onChange={(e) => setAptitudeScore(e.target.value === "" ? "" : Number(e.target.value))}
            className="h-12 text-base bg-[#0b1f3a] border-[#3fc4e7]/20 text-white placeholder:text-[#b8c7e0]/50 focus:border-[#3fc4e7]/50 focus:ring-[#3fc4e7]/20"
          />
        </div>
      )}


          </NavyCard>

          {/* Drive Requirements */}
<NavyCard className="p-6 space-y-6">
  <p className="text-xs font-bold text-[#69d2f1] uppercase tracking-widest font-display">
    Drive Requirements
  </p>

  <div className="space-y-2.5">
    <FieldLabel icon={Code2} text="Required Tech Stack" />

    <div className="flex flex-wrap gap-2">
      {selectedDrive?.requiredTechStack?.length ? (
        selectedDrive.requiredTechStack.map((tech) => (
          <span
            key={tech}
            className="px-3 py-1 rounded-full bg-[#3fc4e7]/10 border border-[#3fc4e7]/20 text-[#69d2f1] text-sm"
          >
            {tech}
          </span>
        ))
      ) : (
        <p className="text-[#b8c7e0] text-sm">
          No tech stack requirement
        </p>
      )}
    </div>
  </div>

  <div className="space-y-2.5">
    <FieldLabel icon={Briefcase} text="Experience Level" />

    <div className="h-12 px-4 flex items-center rounded-xl bg-[#0b1f3a] border border-[#3fc4e7]/20 text-white">
      {selectedDrive?.experienceLevel || "Any"}
    </div>
  </div>
</NavyCard>

          {/* Resume Upload */}
          {/* Resume Upload */}
{(!selectedDrive || selectedDrive.selectedFields.includes("resume")) && (
  <NavyCard className="p-6">
    <FieldLabel
      icon={FileText}
      text="Candidate Resume"
      note="required"
    />

    <label
      className={`mt-3 flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
        resumeFile
          ? "border-[#3fc4e7]/60 bg-[#3fc4e7]/5"
          : "border-red-400/40 hover:border-[#3fc4e7]/50 hover:bg-[#3fc4e7]/5"
      }`}
    >
      {resumeFile ? (
        <div className="flex items-center gap-2.5 text-white">
          <CheckCircle2 className="w-5 h-5 text-[#3fc4e7]" />
          <span className="font-body text-sm">
            {resumeFile.name}
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center text-[#b8c7e0]">
          <Upload className="w-8 h-8 mb-2 text-red-400/70" />

          <span className="font-body text-sm">
            Upload candidate resume{" "}
            <span className="text-red-400 font-semibold">
              *
            </span>
          </span>

          <span className="font-body text-xs mt-1 text-[#b8c7e0]/60">
            PDF only — required for analysis
          </span>
        </div>
      )}

      <input
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) =>
          setResumeFile(
            e.target.files?.[0] || null
          )
        }
      />
    </label>
  </NavyCard>
)}


          {/* Submit */}
          {isProcessing ? (
            <div className="w-full rounded-xl bg-[#0b1f3a] border border-[#3fc4e7]/25 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#3fc4e7]/15 flex items-center justify-center flex-shrink-0">
                  <Loader2 className="w-4 h-4 animate-spin text-[#3fc4e7]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-display font-semibold">{status || "Processing..."}</p>
                  <p className="text-[#b8c7e0]/60 text-xs font-body mt-0.5">This may take a few seconds</p>
                </div>
              </div>
              <div className="h-1.5 w-full bg-[#132f52] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] rounded-full"
                  initial={{ width: "5%" }}
                  animate={{ width: status.includes("Looking up") ? "20%" : status.includes("Reading") ? "50%" : status.includes("Running") ? "75%" : "90%" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          ) : (
            <Button
              type="submit"
              disabled={!isFormValid}
              className="w-full h-13 py-3.5 text-base font-bold rounded-xl bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black hover:opacity-90 transition-opacity shadow-lg disabled:opacity-40 font-display"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Generate Analysis Report
            </Button>
          )}
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
