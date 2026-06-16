import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ArrowRight, BarChart3, Brain, FileText, Shield, CheckCircle2,
  XCircle, GitBranch, Zap, Users, Target, Clock, Star,
  TrendingUp, Search, AlertTriangle, ChevronRight, Loader2,
  Crown, Check, LogOut,
} from "lucide-react";
import {
  PACKAGES, signInWithGoogle, signOutUser, createRecruiterRequest,
  getRecruiterRequest, subscribeRecruiterRequest, RecruiterRequest,
  fetchRecruiterDrives, fetchCandidatesByRecruiter, deleteDrive, Drive,
} from "@/lib/firebase";
import { hashPassword } from "@/lib/password";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import logo from "@/favicon/IMG-20260403-WA0058.jpg";

// ── Recruiter-specific navbar ────────────────────────────────────────────────
const RecruiterNav = ({ user, onSignIn, onSignOut, signingIn, showCreateDrive, onCreateDrive }: {
  user: any;
  onSignIn: () => void;
  onSignOut: () => void;
  signingIn: boolean;
  showCreateDrive?: boolean;
  onCreateDrive?: () => void;
}) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b1f3a]/90 backdrop-blur-lg border-b border-[#3fc4e7]/15 px-6 py-3 flex items-center justify-between">
    <Link to="/" className="flex items-center gap-2">
      <img src={logo} alt="" className="h-8 w-8 rounded-full object-cover border border-[#3fc4e7]/30" />
      <span className="font-display font-bold text-white">Repoflo</span>
      <span className="text-[#3fc4e7]/60 text-xs font-body ml-1">for Recruiters</span>
    </Link>
    <div className="hidden md:flex items-center gap-6">
      {["#features","#pricing","#how-it-works"].map((href, i) => (
        <a key={href} href={href}
          onClick={e => { e.preventDefault(); document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }); }}
          className="text-[#b8c7e0] font-body text-sm hover:text-white transition-colors cursor-pointer">
          {["Features","Pricing","How it works"][i]}
        </a>
      ))}
    </div>
    <div className="flex items-center gap-2">
      {user ? (
        <div className="flex items-center gap-2">
          <Link
            to="/ethics-learning"
            className="text-sm font-semibold text-[#b8c7e0] border border-[#3fc4e7]/20 rounded-full px-3 py-2 hover:bg-[#3fc4e7]/10 hover:text-white transition-all"
          >
            Ethics Learning
          </Link>
          <Link
            to="/ai-vs-me"
            className="text-sm font-semibold text-[#b8c7e0] border border-[#3fc4e7]/20 rounded-full px-3 py-2 hover:bg-[#3fc4e7]/10 hover:text-white transition-all"
          >
            AI vs Me
          </Link>
          {showCreateDrive && onCreateDrive && (
            <Button
              size="sm"
              onClick={onCreateDrive}
              className="bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black font-bold rounded-full px-4 py-2 hover:opacity-90"
            >
              Create Drive
            </Button>
          )}
          <div className="flex items-center gap-2">
            {user.photoURL && <img src={user.photoURL} className="w-7 h-7 rounded-full" alt="" />}
            <span className="text-white text-sm font-semibold hidden sm:block">{user.displayName?.split(" ")[0]}</span>
            <button onClick={onSignOut} className="text-[#b8c7e0]/50 hover:text-white p-1.5 rounded-lg hover:bg-[#3fc4e7]/10 transition-all">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <Button size="sm" onClick={onSignIn} disabled={signingIn}
          className="bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black font-bold rounded-full px-5 hover:opacity-90">
          {signingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
        </Button>
      )}
    </div>
  </nav>
);

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: "easeOut", delay },
});

const RecruiterLandingPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // step: 'landing' → 'select-plan' → 'waiting'
  const [step, setStep] = useState<"landing" | "select-plan" | "waiting">("landing");
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [signInLoading, setSignInLoading] = useState(false);
  const [signInError, setSignInError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [request, setRequest] = useState<RecruiterRequest | null>(null);
  const [drives, setDrives] = useState<Drive[]>([]);
  const [driveCounts, setDriveCounts] = useState<Record<string, number>>({});
  const [loadingDrives, setLoadingDrives] = useState(false);
  const [activeDrive, setActiveDrive] = useState<Drive | null>(null);
  const [activeDriveAction, setActiveDriveAction] = useState<"analyze" | "results" | "delete" | null>(null);
  const [passwordAttempt, setPasswordAttempt] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);

  const isApprovedRecruiter = request?.status === "approved";

  // Subscribe to request status once signed in
  useEffect(() => {
    if (!user) { setRequest(null); return; }
    const unsub = subscribeRecruiterRequest(user.uid, (r) => {
      setRequest(r);
      if (r?.status === "pending") {
        setStep("waiting");
      }
    });
    return unsub;
  }, [user]);

  // On page load, if already signed in check existing request
  useEffect(() => {
    if (!user) return;
    getRecruiterRequest(user.uid).then(r => {
      if (!r) {
        setStep("landing");
        return;
      }
      if (r.status === "approved") {
        setStep("landing");
        return;
      }
      if (r.status === "pending") {
        setStep("waiting");
        return;
      }
      // rejected or other — keep landing and let user decide next
      setStep("landing");
    });
  }, [user]);

  // "Get Started" — sign in first, then decide next step
  const handleGetStarted = async () => {
    setSignInError("");
    setSignInLoading(true);
    try {
      const decideNextStep = async (authUser: any) => {
        const existing = await getRecruiterRequest(authUser.uid);
        if (existing?.status === "pending") {
          setStep("waiting");
          return;
        }
        if (!existing) {
          setStep("select-plan");
          return;
        }
        setStep("landing");
      };

      if (user) {
        await decideNextStep(user);
        return;
      }

      const signedInUser = await signInWithGoogle();
      if (!signedInUser) throw new Error("Sign-in cancelled.");
      await decideNextStep(signedInUser);
    } catch (err: any) {
      setSignInError(err.message || "Sign-in failed. Please try again.");
    } finally {
      setSignInLoading(false);
    }
  };

  const loadRecruiterDrives = async () => {
    if (!user?.email) return;
    setLoadingDrives(true);
    try {
      const loadedDrives = await fetchRecruiterDrives(user.email);
      setDrives(loadedDrives);
      const candidates = await fetchCandidatesByRecruiter(user.email);
      const counts = candidates.reduce((acc, candidate) => {
        if (candidate.driveId) {
          acc[candidate.driveId] = (acc[candidate.driveId] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);
      setDriveCounts(counts);
    } finally {
      setLoadingDrives(false);
    }
  };

  useEffect(() => {
    if (user && isApprovedRecruiter) {
      loadRecruiterDrives();
    }
  }, [user, isApprovedRecruiter]);

  const startDriveAction = (drive: Drive, action: "analyze" | "results" | "delete") => {
    setActiveDrive(drive);
    setActiveDriveAction(action);
    setPasswordAttempt("");
    setActionError("");
    setActionDialogOpen(true);
  };

  const performDriveAction = async () => {
    if (!activeDrive || !activeDriveAction) return;

    const requiresPassword = !!activeDrive.passwordHash;
    if (requiresPassword) {
      if (!/^[0-9]{4}$/.test(passwordAttempt)) {
        setActionError("Enter the 4-digit drive passcode.");
        return;
      }
      const hashed = await hashPassword(passwordAttempt);
      if (hashed !== activeDrive.passwordHash) {
        setActionError("Incorrect passcode. Please try again.");
        return;
      }
    }

    setActionLoading(true);
    try {
      const driveId = activeDrive.id;
      if (!driveId) throw new Error("Drive ID missing.");

      if (activeDriveAction === "analyze") {
        sessionStorage.setItem(`driveAuth:${driveId}`, "true");
        navigate(`/recruiter?driveId=${driveId}`);
      }

      if (activeDriveAction === "results") {
        sessionStorage.setItem(`driveAuth:${driveId}`, "true");
        navigate(`/recruiter/results/${driveId}`);
      }

      if (activeDriveAction === "delete") {
        await deleteDrive(driveId);
        await loadRecruiterDrives();
        toast({ title: "Drive deleted", description: "Drive and its candidates were removed." });
      }
      setActionDialogOpen(false);
    } catch (err: any) {
      setActionError(err.message || "Action failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitPlan = async () => {
    if (!user || !selectedPlan) return;
    setSubmitLoading(true);
    try {
      await createRecruiterRequest(user, selectedPlan);
      setStep("waiting");
    } catch (err: any) {
      setSignInError(err.message || "Failed to submit request.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    setStep("landing");
    setSelectedPlan("");
    setRequest(null);
    setDrives([]);
    setDriveCounts({});
  };

  // ── Select plan screen ──
  if (step === "select-plan" && user) {
    return (
      <div className="min-h-screen bg-[#0b1f3a] flex flex-col">
        <RecruiterNav user={user} onSignIn={handleGetStarted} onSignOut={handleSignOut} signingIn={signInLoading} />
        <div className="flex-1 flex items-center justify-center p-4 pt-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                {user.photoURL && <img src={user.photoURL} className="w-8 h-8 rounded-full" alt="" />}
                <span className="text-white font-semibold">Welcome, {user.displayName?.split(" ")[0]}!</span>
              </div>
              <h2 className="font-display text-3xl font-bold text-white mb-2">Choose your plan</h2>
              <p className="text-[#b8c7e0] font-body">Select a plan and submit your access request to the admin.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {PACKAGES.map((pkg) => {
                const isSelected = selectedPlan === pkg.id;
                return (
                  <div key={pkg.id} onClick={() => setSelectedPlan(pkg.id)}
                    className={`relative rounded-2xl border-2 p-5 cursor-pointer transition-all duration-200 ${isSelected ? "border-[#3fc4e7] bg-[#3fc4e7]/8 shadow-lg shadow-[#3fc4e7]/15" : "border-[#3fc4e7]/15 bg-[#132f52] hover:border-[#3fc4e7]/40"}`}>
                    {pkg.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black text-xs font-black px-3 py-0.5 rounded-full whitespace-nowrap">{pkg.badge}</div>}
                    {isSelected && <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#3fc4e7] flex items-center justify-center"><Check className="w-3 h-3 text-black" /></div>}
                    <h3 className="font-display font-bold text-white mb-1 text-sm">{pkg.name}</h3>
                    <div className="text-xl font-black text-[#3fc4e7]">₹{pkg.inr.toLocaleString()}<span className="text-[#b8c7e0] text-xs font-normal">/yr</span></div>
                    <div className="text-[#b8c7e0]/50 text-xs mb-2">${pkg.usd}</div>
                    <div className="text-[#b8c7e0] text-xs">{pkg.desc}</div>
                    <div className="text-[#b8c7e0]/40 text-xs mt-1">{pkg.limit === -1 ? "Unlimited" : `${pkg.limit} analyses/yr`}</div>
                  </div>
                );
              })}
            </div>
            {signInError && <p className="text-red-400 text-sm font-body text-center mb-4 flex items-center justify-center gap-1"><AlertTriangle className="w-4 h-4" />{signInError}</p>}
            <div className="text-center">
              <Button disabled={!selectedPlan || submitLoading} onClick={handleSubmitPlan}
                className="rounded-full px-12 py-6 text-base bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black font-bold shadow-lg hover:opacity-90 disabled:opacity-40">
                {submitLoading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" />Submitting...</> : <>Request Access <ArrowRight className="ml-2 w-5 h-5" /></>}
              </Button>
              <p className="text-[#b8c7e0]/40 text-xs mt-3 font-body">Admin approval required · 1 year access after approval</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Waiting for approval screen ──
  if (step === "waiting" || (user && request?.status === "pending")) {
    return (
      <div className="min-h-screen bg-[#0b1f3a] flex flex-col">
        <RecruiterNav user={user} onSignIn={handleGetStarted} onSignOut={handleSignOut} signingIn={signInLoading} />
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-[#132f52] border border-[#3fc4e7]/20 rounded-2xl p-10 text-center max-w-md w-full shadow-2xl">
            <div className="text-5xl mb-4 animate-bounce">⏳</div>
            <h2 className="font-display text-2xl font-bold text-white mb-2">Request Submitted!</h2>
            <p className="text-[#b8c7e0] font-body text-sm mb-6 leading-relaxed">
              Your access request is being reviewed. The admin will approve it shortly — this page updates automatically when approved.
            </p>
            <div className="bg-[#0b1f3a] rounded-xl p-4 text-left text-sm font-body space-y-2 border border-[#3fc4e7]/10 mb-6">
              {user && <div className="flex justify-between"><span className="text-[#b8c7e0]">Account</span><span className="text-white font-semibold">{user.email}</span></div>}
              {request && <>
                <div className="flex justify-between"><span className="text-[#b8c7e0]">Plan</span><span className="text-[#3fc4e7] font-bold">{request.packageName}</span></div>
                <div className="flex justify-between"><span className="text-[#b8c7e0]">Submitted</span><span className="text-white">{new Date(request.requestedAt).toLocaleDateString()}</span></div>
              </>}
              <div className="flex justify-between"><span className="text-[#b8c7e0]">Status</span><span className="text-amber-400 font-bold">⏳ Pending Review</span></div>
            </div>
            <div className="flex items-center justify-center gap-2 text-[#b8c7e0]/50 text-xs font-body mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Waiting for admin approval…
            </div>
            <p className="text-[#b8c7e0]/40 text-xs font-body">You can close this tab and come back — sign in again to check your status.</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1f3a] text-white overflow-x-hidden">
      <RecruiterNav
        user={user}
        onSignIn={handleGetStarted}
        onSignOut={handleSignOut}
        signingIn={signInLoading}
        showCreateDrive={!!user && isApprovedRecruiter}
        onCreateDrive={() => navigate("/create-drive")}
      />

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#132f52] via-[#0b1f3a] to-[#0b1f3a]" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#3fc4e7]/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#6366f1]/6 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-5xl relative">
          <motion.div {...fadeUp(0)} className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#3fc4e7]/10 text-[#69d2f1] px-4 py-1.5 rounded-full text-sm font-display font-semibold mb-6 border border-[#3fc4e7]/20">
              <Target className="w-4 h-4" /> Built for talent intelligence and developer hiring
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
              Find, assess, and hire
              <br />
              <span className="text-[#3fc4e7]">talent across roles</span>
              <br /> quickly and fairly.
            </h1>

            <p className="text-[#b8c7e0] font-body text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-6">
              Repoflo brings together portfolios, code samples, test results, and AI-assisted insights into a single recruiter workflow. Evaluate candidates for engineering, design, product, and other roles with consistent criteria.
            </p>

            <p className="text-[#b8c7e0]/60 text-sm max-w-2xl mx-auto mb-8">Data privacy: candidate data is stored securely and shared only with authorized members of your team.</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="rounded-full px-10 py-6 text-base bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black font-bold shadow-lg shadow-[#3fc4e7]/20 hover:opacity-90"
                onClick={handleGetStarted}
              >
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <a
                href="https://example.com/repoflo-documentation.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-[#3fc4e7]/30 bg-[#132f52]/80 px-6 py-3 text-sm font-semibold text-[#b8c7e0] hover:text-white transition-colors"
              >
                Read Documentation
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 mt-12 flex-wrap">
              {[["AI-Powered", Zap], ["Instant Reports", FileText], ["No Credit Card", Shield]].map(([label, Icon]: any) => (
                <div key={label as string} className="flex items-center gap-2 text-[#b8c7e0] text-sm font-body">
                  <Icon className="w-4 h-4 text-[#3fc4e7]" />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="border-y border-[#3fc4e7]/10 bg-[#132f52]/40 py-10 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              ["10×", "Faster candidate screening"],
              ["95%", "AI analysis accuracy"],
              ["🔒", "Secure Database"],
              ["< 60s", "Full candidate report"],
            ].map(([num, label]) => (
              <motion.div key={label} {...fadeUp(0.1)}>
                <div className="font-display text-3xl font-bold text-[#3fc4e7] mb-1">{num}</div>
                <div className="text-[#b8c7e0] font-body text-sm">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Traditional recruiting is <span className="text-red-400">broken</span>
            </h2>
            <p className="text-[#b8c7e0] font-body max-w-xl mx-auto">
              Hiring developers shouldn't mean drowning in resumes and hoping for the best.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: AlertTriangle,
                title: "Resumes lie",
                desc: "Anyone can claim 5 years of React experience. Real code tells a different story.",
                color: "text-red-400",
                bg: "bg-red-500/8",
                border: "border-red-500/15",
              },
              {
                icon: Clock,
                title: "Screening takes forever",
                desc: "Manual technical screening consumes weeks. By then, your best candidates have accepted other offers.",
                color: "text-amber-400",
                bg: "bg-amber-500/8",
                border: "border-amber-500/15",
              },
              {
                icon: Search,
                title: "No real code insight",
                desc: "LinkedIn profiles and ATS tools give you keywords — not actual coding ability or consistency.",
                color: "text-orange-400",
                bg: "bg-orange-500/8",
                border: "border-orange-500/15",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeUp(i * 0.1)}
                className={`rounded-2xl p-6 border ${item.bg} ${item.border}`}
              >
                <item.icon className={`w-7 h-7 ${item.color} mb-4`} />
                <h3 className="font-display font-bold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-[#b8c7e0] font-body text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-4 bg-[#132f52]/20">
        <div className="container mx-auto max-w-5xl">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#3fc4e7]/10 text-[#69d2f1] px-4 py-1.5 rounded-full text-sm font-display font-semibold mb-4 border border-[#3fc4e7]/20">
              <Zap className="w-4 h-4" /> Recruiter Features
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              AI-powered sourcing, screening,
              <br /> and candidate review for developer hiring
            </h2>
            <p className="text-[#b8c7e0] font-body max-w-xl mx-auto">
              From drive configuration to downloadable reports, Repoflo gives hiring teams one modern workflow for recruiting engineers.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: GitBranch,
                title: "Deep GitHub Analysis",
                desc: "Go beyond commit counts. See real coding patterns — consistency, collaboration, code quality, contribution streaks, top languages, and even AI-generated code detection.",
                badge: "Core Feature",
              },
              {
                icon: Brain,
                title: "AI Candidate Assessment",
                desc: "Get an instant hire / no-hire recommendation with an overall score (0-100), strengths, concerns, technical stack assessment, and experience level evaluation.",
                badge: "AI Powered",
              },
              {
                icon: BarChart3,
                title: "ATS Score Breakdown",
                desc: "Know exactly how a candidate performs across 5 ATS dimensions: keywords, format, experience relevance, education, and skills coverage — with actionable suggestions.",
                badge: "ATS Ready",
              },
              {
                icon: FileText,
                title: "Downloadable PDF Reports",
                desc: "Generate beautifully formatted, print-ready PDF reports to share with hiring committees. Every data point in one clean, professional document.",
                badge: "Shareable",
              },
              {
                icon: Target,
                title: "Tech Stack Matching",
                desc: "Input the tech stack your role requires. The AI re-analyzes the candidate specifically for your requirements and shows how well they match.",
                badge: "Role-Specific",
              },
              {
                icon: TrendingUp,
                title: "LeetCode & Problem Solving",
                desc: "Optional LeetCode integration shows problem-solving level, difficulty balance, and contest performance — critical for algorithm-heavy roles.",
                badge: "Optional",
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp(i * 0.08)}
                className="bg-[#132f52] border border-[#3fc4e7]/15 rounded-2xl p-6 hover:border-[#3fc4e7]/35 hover:shadow-lg hover:shadow-[#3fc4e7]/5 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#3fc4e7]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#3fc4e7]/20 transition-colors">
                    <f.icon className="w-6 h-6 text-[#3fc4e7]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-display font-bold text-white">{f.title}</h3>
                      <span className="text-[10px] font-semibold bg-[#3fc4e7]/10 text-[#69d2f1] px-2 py-0.5 rounded-full border border-[#3fc4e7]/20">
                        {f.badge}
                      </span>
                    </div>
                    <p className="text-[#b8c7e0] font-body text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              How we're{" "}
              <span className="text-[#3fc4e7]">different</span>
            </h2>
            <p className="text-[#b8c7e0] font-body max-w-lg mx-auto">
              Repoflo isn't another ATS or job board. It's a developer intelligence layer.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="border-b border-[#3fc4e7]/15">
                  <th className="text-left py-4 px-4 text-[#b8c7e0] font-semibold w-1/3">Feature</th>
                  <th className="py-4 px-4 text-center">
                    <div className="inline-flex flex-col items-center gap-1">
                      <span className="font-display font-bold text-[#3fc4e7] text-base">Repoflo</span>
                      <span className="text-[10px] text-[#3fc4e7]/60">Recruiter View</span>
                    </div>
                  </th>
                  <th className="py-4 px-4 text-center text-[#b8c7e0] font-semibold">Traditional ATS</th>
                  <th className="py-4 px-4 text-center text-[#b8c7e0] font-semibold">LinkedIn</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Real GitHub code analysis", true, false, false],
                  ["AI hire/no-hire verdict", true, false, false],
                  ["ATS score breakdown", true, true, false],
                  ["LeetCode insights", true, false, false],
                  ["Tech stack match scoring", true, false, false],
                  ["PDF candidate reports", true, true, false],
                  ["AI-generated code detection", true, false, false],
                  ["Instant analysis (< 60s)", true, false, false],
                  ["No setup / integrations needed", true, false, true],
                ].map(([label, repoflo, ats, linkedin]) => (
                  <tr key={label as string} className="border-b border-[#3fc4e7]/8 hover:bg-[#132f52]/30 transition-colors">
                    <td className="py-3.5 px-4 text-[#b8c7e0]">{label}</td>
                    <td className="py-3.5 px-4 text-center">
                      {repoflo
                        ? <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                        : <XCircle className="w-5 h-5 text-red-400/50 mx-auto" />}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {ats
                        ? <CheckCircle2 className="w-5 h-5 text-emerald-400/60 mx-auto" />
                        : <XCircle className="w-5 h-5 text-red-400/40 mx-auto" />}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {linkedin
                        ? <CheckCircle2 className="w-5 h-5 text-emerald-400/60 mx-auto" />
                        : <XCircle className="w-5 h-5 text-red-400/40 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-4 bg-[#132f52]/20">
        <div className="container mx-auto max-w-4xl">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              From GitHub to hire decision{" "}
              <span className="text-[#3fc4e7]">in 3 steps</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-gradient-to-r from-[#3fc4e7]/30 via-[#3fc4e7]/60 to-[#3fc4e7]/30" />

            {[
              {
                step: "01",
                icon: GitBranch,
                title: "Paste GitHub URL",
                desc: "Drop the candidate's GitHub profile URL. Optionally upload their resume for a complete picture.",
              },
              {
                step: "02",
                icon: Brain,
                title: "AI Analyzes Everything",
                desc: "In under 60 seconds, our AI reads their entire coding history, activity, languages, and profile.",
              },
              {
                step: "03",
                icon: FileText,
                title: "Get Your Report",
                desc: "Receive a full assessment with score, verdict, GitHub insights, ATS breakdown, and downloadable PDF.",
              },
            ].map((s, i) => (
              <motion.div key={s.step} {...fadeUp(i * 0.15)} className="text-center relative">
                <div className="w-20 h-20 rounded-2xl bg-[#132f52] border border-[#3fc4e7]/25 flex items-center justify-center mx-auto mb-5 relative">
                  <s.icon className="w-8 h-8 text-[#3fc4e7]" />
                  <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-[#3fc4e7] flex items-center justify-center">
                    <span className="text-black font-display font-black text-xs">{s.step.replace("0","")}</span>
                  </div>
                </div>
                <h3 className="font-display font-bold text-white text-lg mb-2">{s.title}</h3>
                <p className="text-[#b8c7e0] font-body text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS removed */}
      <section className="py-0 px-4" style={{display:'none'}}>
        <div className="container mx-auto max-w-5xl">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <h2 className="font-display text-3xl font-bold mb-3">
              Loved by recruiting teams
            </h2>
            <p className="text-[#b8c7e0] font-body">Real feedback from technical recruiters</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "We cut our technical screening time from 3 weeks to 3 days. The GitHub analysis alone is worth it.",
                name: "Priya M.",
                role: "Head of Engineering Hiring",
                stars: 5,
              },
              {
                quote: "Finally I can tell the difference between someone who padded their resume and someone who actually codes daily.",
                name: "James K.",
                role: "Technical Recruiter",
                stars: 5,
              },
              {
                quote: "The downloadable reports make it so easy to present candidates to my hiring committee without them needing to dig through GitHub themselves.",
                name: "Sofia L.",
                role: "Talent Acquisition Lead",
                stars: 5,
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                {...fadeUp(i * 0.1)}
                className="bg-[#132f52] border border-[#3fc4e7]/15 rounded-2xl p-6"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array(t.stars).fill(0).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-[#b8c7e0] font-body text-sm leading-relaxed mb-5 italic">"{t.quote}"</p>
                <div>
                  <div className="font-display font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-[#b8c7e0] font-body text-xs">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING PLANS ── */}
      <section id="pricing" className="py-24 px-4 bg-[#132f52]/20">
        <div className="container mx-auto max-w-5xl">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#3fc4e7]/10 text-[#69d2f1] px-4 py-1.5 rounded-full text-sm font-display font-semibold mb-4 border border-[#3fc4e7]/20">
              <Crown className="w-4 h-4" /> Choose Your Plan
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Simple, transparent <span className="text-[#3fc4e7]">pricing</span>
            </h2>
            <p className="text-[#b8c7e0] font-body max-w-md mx-auto">
              All plans include full AI analysis, reports & GitHub insights. Billed annually.
            </p>
          </motion.div>

          {isApprovedRecruiter && (
            <section className="py-14">
              <div className="container mx-auto max-w-5xl">
                <motion.div {...fadeUp()} className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-[#3fc4e7]/10 text-[#69d2f1] px-4 py-1.5 rounded-full text-sm font-display font-semibold mb-4 border border-[#3fc4e7]/20">
                    <Target className="w-4 h-4" /> Hiring Drives
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">Your active hiring drives</h2>
                  <p className="text-[#b8c7e0] font-body max-w-2xl mx-auto">
                    Manage your drive entries, analyze candidates, and review candidate results per drive.
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-4">
                  {drives.length > 0 ? (
                    drives.map((drive) => (
                      <motion.div
                        key={drive.id}
                        {...fadeUp(0.05)}
                        className="bg-[#132f52] border border-[#3fc4e7]/15 rounded-3xl p-6 shadow-lg shadow-[#3fc4e7]/10"
                      >
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div>
                            <p className="text-sm text-[#69d2f1] uppercase tracking-[0.2em] font-semibold mb-2">{drive.role}</p>
                            <h3 className="font-display text-2xl font-bold text-white">{drive.driveName}</h3>
                          </div>
                          <div className="text-right text-xs text-[#b8c7e0]">
                            <p>{drive.createdByName || "Recruiter"}</p>
                            <p>{drive.createdByPosition || "Role not set"}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {drive.selectedFields.map((field) => (
                            <span key={field} className="px-3 py-1 rounded-full bg-[#3fc4e7]/10 border border-[#3fc4e7]/20 text-[#69d2f1] text-xs font-semibold">
                              {field}
                            </span>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6 text-sm text-[#b8c7e0]">
                          <div className="rounded-2xl bg-[#0b1f3a] p-3 border border-[#3fc4e7]/10">
                            <p className="font-semibold text-white">Candidates</p>
                            <p>{driveCounts[drive.id!] ?? 0}</p>
                          </div>
                          <div className="rounded-2xl bg-[#0b1f3a] p-3 border border-[#3fc4e7]/10">
                            <p className="font-semibold text-white">Experience</p>
                            <p>{drive.experienceLevel || "Any"}</p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            className="w-full bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black font-bold"
                            onClick={() => startDriveAction(drive, "analyze")}
                          >
                            Analyze
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full text-[#69d2f1] border-[#3fc4e7]/30"
                            onClick={() => startDriveAction(drive, "results")}
                          >
                            View Candidate Results
                          </Button>
                        </div>
                        <div className="mt-3">
                          <Button
                            variant="ghost"
                            className="w-full text-red-400 border border-red-400/20 hover:bg-red-400/10"
                            onClick={() => startDriveAction(drive, "delete")}
                          >
                            Delete Drive
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="rounded-3xl border border-[#3fc4e7]/20 bg-[#132f52] p-8 text-center">
                      <p className="text-[#b8c7e0] mb-4">You don't have any drives yet.</p>
                      <Button
                        className="bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black font-bold"
                        onClick={() => navigate("/create-drive")}
                      >
                        Create your first drive
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {PACKAGES.map((pkg, i) => (
              <motion.div key={pkg.id} {...fadeUp(i * 0.08)}
                className="relative rounded-2xl border-2 border-[#3fc4e7]/15 bg-[#132f52] p-6 hover:border-[#3fc4e7]/40 transition-all duration-200">
                {pkg.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black text-xs font-black px-3 py-1 rounded-full whitespace-nowrap">
                    {pkg.badge}
                  </div>
                )}
                <h3 className="font-display font-bold text-white mb-1">{pkg.name}</h3>
                <div className="mb-1">
                  <span className="text-2xl font-black text-[#3fc4e7]">₹{pkg.inr.toLocaleString()}</span>
                  <span className="text-[#b8c7e0] text-xs font-body">/yr</span>
                </div>
                <div className="text-[#b8c7e0]/60 text-xs mb-3 font-body">${pkg.usd} USD</div>
                <div className="text-[#b8c7e0] text-sm font-body">{pkg.desc}</div>
                <div className="mt-3 text-xs text-[#b8c7e0]/50 font-body">
                  {pkg.limit === -1 ? "Unlimited analyses" : `${pkg.limit} analyses/year`}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA below plans */}
          <div className="text-center">
            {signInError && (
              <p className="text-red-400 text-sm font-body mb-3 flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {signInError}
              </p>
            )}
            <Button size="lg" disabled={signInLoading} onClick={handleGetStarted}
              className="rounded-full px-12 py-6 text-base bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black font-bold shadow-lg shadow-[#3fc4e7]/20 hover:opacity-90 disabled:opacity-40 transition-opacity">
              {signInLoading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" />Signing in…</> : <>Get Started <ArrowRight className="ml-2 w-5 h-5" /></>}
            </Button>
            <p className="text-[#b8c7e0]/50 font-body text-xs mt-3">Sign in with Google → choose plan → admin approval → 1 year access</p>
           
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="bg-[#132f52] border border-[#3fc4e7]/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {activeDriveAction === "delete" ? "Delete Drive" : "Verify Drive Passcode"}
            </DialogTitle>
            <DialogDescription className="text-[#b8c7e0] mt-2">
              {activeDrive?.passwordHash
                ? activeDriveAction === "delete"
                  ? "This drive is protected. Confirm deletion by entering the 4-digit passcode. All candidate data will be lost."
                  : "Enter the 4-digit passcode to access this drive."
                : activeDriveAction === "delete"
                  ? "This drive has no passcode. Confirm deletion to remove the drive and its candidates."
                  : "This drive has no passcode, so you may proceed without a passcode."
              }
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-[#0b1f3a] border border-[#3fc4e7]/20 p-4">
              <p className="text-sm text-[#b8c7e0]">Drive</p>
              <p className="text-white font-semibold">{activeDrive?.driveName || "Untitled Drive"}</p>
              <p className="text-xs text-[#69d2f1] mt-1">{activeDrive?.role || "No role"}</p>
            </div>

            {activeDrive?.passwordHash && (
              <div className="space-y-2">
                <Label className="text-white text-sm">Drive Passcode</Label>
                <Input
                  type="password"
                  maxLength={4}
                  value={passwordAttempt}
                  onChange={(e) => setPasswordAttempt(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="1234"
                  className="bg-[#0b1f3a] border-[#3fc4e7]/20 text-white"
                />
                <p className="text-[#b8c7e0] text-xs">
                  This code was set when the drive was created. It protects analyze, view, and delete actions.
                </p>
              </div>
            )}

            {actionError && <p className="text-red-400 text-sm">{actionError}</p>}
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black"
              onClick={performDriveAction}
              disabled={actionLoading}
            >
              {actionLoading ? "Working…" : activeDriveAction === "delete" ? "Delete" : "Continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="py-6 border-t border-[#3fc4e7]/15 bg-[#0b1f3a]">
        <div className="container mx-auto px-4 text-center space-y-1">
          <p className="text-sm text-[#b8c7e0]/40 font-body">
            © {new Date().getFullYear()} Repoflo · Recruiter Platform
          </p>
          <p className="text-xs text-[#b8c7e0]/30 font-body">
            Powered by <span className="font-semibold text-[#b8c7e0]/50">Torsecure Cyber LLP</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RecruiterLandingPage;
