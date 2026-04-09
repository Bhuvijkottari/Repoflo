import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, LogOut, ToggleLeft, ToggleRight, Users, FileText, Star,
  Trash2, CheckCircle2, XCircle, Clock, RefreshCw, Package,
  BarChart3, AlertTriangle, ChevronDown, ChevronUp, Eye,
  Loader2, Settings, MessageSquare, GitBranch, TrendingUp, Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  isAdminAuthenticated, adminLogout, getAuthenticatedAdminEmail, PRIMARY_ADMIN,
  getSiteSettings, updateSiteSettings, subscribeSiteSettings, SiteSettings,
  getAllRecruiterRequests, approveRecruiterRequest, rejectRecruiterRequest, RecruiterRequest,
  fetchFeedbacks, deleteFeedback,
  fetchPortfolioUsage, PortfolioUsageEntry,
  fetchGeminiUsageToday, GeminiUsageToday,
  getVisitorCount,
  PACKAGES, getAdminUsers, addAdminUser, removeAdminUser, AdminUser,
  fetchSupportTickets, resolveSupportTicket, deleteSupportTicket, SupportTicket,
} from "@/lib/firebase";
import logo from "@/favicon/IMG-20260403-WA0058.jpg";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ─── guard (localStorage + Firebase Auth double-check) ───────────────────────
const useAdminGuard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // First gate: custom session check
    if (!isAdminAuthenticated()) {
      navigate("/adminProtectedRoutes/auth/signin", { replace: true });
      return;
    }
    // Second gate: verify Firebase Auth is still active and matches
    const unsub = onAuthStateChanged(auth, (user) => {
      const sessionEmail = getAuthenticatedAdminEmail();
      if (!user || user.email?.toLowerCase() !== sessionEmail.toLowerCase()) {
        adminLogout();
        navigate("/adminProtectedRoutes/auth/signin", { replace: true });
      }
    });
    return unsub;
  }, [navigate]);
};

// ─── small primitives ────────────────────────────────────────────────────────
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-[#132f52] border border-[#3fc4e7]/15 rounded-2xl ${className}`}>{children}</div>
);

const SectionTitle = ({ icon: Icon, title, count }: { icon: any; title: string; count?: number }) => (
  <div className="flex items-center gap-3 px-6 py-4 border-b border-[#3fc4e7]/10">
    <div className="w-8 h-8 rounded-lg bg-[#3fc4e7]/10 flex items-center justify-center">
      <Icon className="w-4 h-4 text-[#3fc4e7]" />
    </div>
    <h2 className="font-display font-bold text-white">{title}</h2>
    {count !== undefined && (
      <span className="ml-auto bg-[#3fc4e7]/15 text-[#69d2f1] text-xs font-bold px-2.5 py-0.5 rounded-full">
        {count}
      </span>
    )}
  </div>
);

const statusBadge = (status: RecruiterRequest["status"]) => {
  if (status === "approved") return <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Approved</span>;
  if (status === "rejected") return <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">Rejected</span>;
  return <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">Pending</span>;
};

// ─── Portfolio summary row ────────────────────────────────────────────────────
const PortfolioSummaryRow = ({ p }: { p: PortfolioUsageEntry }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="font-body">
      {/* Header row — always visible */}
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#3fc4e7]/4 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#3fc4e7]/15 border border-[#3fc4e7]/30 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#3fc4e7]">
            {(p.name || "?")[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">{p.name || "—"}</p>
            <p className="text-[#b8c7e0]/60 text-xs truncate">{p.title || p.currentOccupation || "—"}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0 ml-4">
          <span className="hidden sm:block text-[#b8c7e0] text-xs">{p.email || "—"}</span>
          <span className="hidden md:block text-[#b8c7e0] text-xs">{p.phone || "—"}</span>
          <span className="text-[#3fc4e7] text-xs font-semibold capitalize px-2 py-0.5 bg-[#3fc4e7]/10 rounded-full">{p.theme}</span>
          <span className="text-[#b8c7e0]/50 text-xs">{p.timestamp ? new Date(p.timestamp).toLocaleDateString() : "—"}</span>
          <ChevronDown className={`w-4 h-4 text-[#b8c7e0]/50 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </div>

      {/* Expanded summary */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-2 bg-[#0b1f3a]/40 border-t border-[#3fc4e7]/8 space-y-4">

              {/* Bio + contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {p.bio && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-[#69d2f1] font-semibold uppercase tracking-wider mb-1">Bio</p>
                    <p className="text-[#b8c7e0] text-xs leading-relaxed">{p.bio}</p>
                  </div>
                )}
                {p.location && (
                  <div>
                    <p className="text-xs text-[#69d2f1] font-semibold uppercase tracking-wider mb-1">Location</p>
                    <p className="text-[#b8c7e0] text-xs">📍 {p.location}</p>
                  </div>
                )}
                {p.email && (
                  <div>
                    <p className="text-xs text-[#69d2f1] font-semibold uppercase tracking-wider mb-1">Email</p>
                    <a href={`mailto:${p.email}`} className="text-[#3fc4e7] text-xs hover:underline">✉ {p.email}</a>
                  </div>
                )}
                {p.phone && (
                  <div>
                    <p className="text-xs text-[#69d2f1] font-semibold uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-[#b8c7e0] text-xs">📞 {p.phone}</p>
                  </div>
                )}
                {p.github && (
                  <div>
                    <p className="text-xs text-[#69d2f1] font-semibold uppercase tracking-wider mb-1">GitHub</p>
                    <a href={p.github} target="_blank" rel="noreferrer" className="text-[#3fc4e7] text-xs hover:underline truncate block">{p.github}</a>
                  </div>
                )}
                {p.linkedin && (
                  <div>
                    <p className="text-xs text-[#69d2f1] font-semibold uppercase tracking-wider mb-1">LinkedIn</p>
                    <a href={p.linkedin} target="_blank" rel="noreferrer" className="text-[#3fc4e7] text-xs hover:underline truncate block">{p.linkedin}</a>
                  </div>
                )}
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Experience", value: p.experienceCount ?? 0, icon: "💼" },
                  { label: "Projects", value: p.projectsCount ?? 0, icon: "🚀" },
                  { label: "Education", value: p.educationCount ?? 0, icon: "🎓" },
                  { label: "Commits", value: p.totalCommits?.toLocaleString() ?? 0, icon: "⚡" },
                  { label: "Repos", value: p.publicRepos ?? 0, icon: "📁" },
                  { label: "Followers", value: p.followers ?? 0, icon: "👥" },
                ].map(s => (
                  <div key={s.label} className="bg-[#132f52] border border-[#3fc4e7]/15 rounded-xl px-4 py-2.5 text-center min-w-[80px]">
                    <p className="text-base">{s.icon}</p>
                    <p className="text-white font-bold text-sm">{s.value}</p>
                    <p className="text-[#b8c7e0]/60 text-xs">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Skills */}
              {p.skills && p.skills.length > 0 && (
                <div>
                  <p className="text-xs text-[#69d2f1] font-semibold uppercase tracking-wider mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.skills.map((s, i) => (
                      <span key={i} className="text-xs bg-[#3fc4e7]/10 text-[#69d2f1] border border-[#3fc4e7]/20 px-2.5 py-1 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Top languages */}
              {p.topLanguages && p.topLanguages.length > 0 && (
                <div>
                  <p className="text-xs text-[#69d2f1] font-semibold uppercase tracking-wider mb-2">Top Languages</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.topLanguages.map((l, i) => (
                      <span key={i} className="text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2.5 py-1 rounded-full">{l}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Resume + theme */}
              <div className="flex flex-wrap gap-4 pt-1 border-t border-[#3fc4e7]/8 text-xs text-[#b8c7e0]/60">
                <span>📄 {p.resumeName || "No resume"}</span>
                <span>🎨 Theme: <span className="text-[#3fc4e7] capitalize font-semibold">{p.theme}</span></span>
                <span>🕐 {p.timestamp ? new Date(p.timestamp).toLocaleString() : "—"}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── main dashboard ──────────────────────────────────────────────────────────
const AdminDashboardPage = () => {
  useAdminGuard();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview"|"recruiters"|"portfolio"|"feedback"|"settings">("overview");

  // Data
  const [settings, setSettings] = useState<SiteSettings>({ portfolioEnabled: true, recruiterEnabled: true });
  const [settingLoading, setSettingLoading] = useState<string>("");
  const [requests, setRequests] = useState<RecruiterRequest[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [portfolioUsage, setPortfolioUsage] = useState<PortfolioUsageEntry[]>([]);
  const [geminiUsage, setGeminiUsage] = useState<GeminiUsageToday>({ parseResume: 0, analyzeCandidate: 0, total: 0, remaining: 500, dailyLimit: 500 });
  const [loading, setLoading] = useState(true);
  const [approvePkg, setApprovePkg] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<string>("");
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [visitorCount, setVisitorCount] = useState(0);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [adminUserError, setAdminUserError] = useState("");
  const [adminUserLoading, setAdminUserLoading] = useState(false);
  const currentAdminEmail = getAuthenticatedAdminEmail();

  // Subscribe to settings live
  useEffect(() => {
    const unsub = subscribeSiteSettings(setSettings);
    return unsub;
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [reqs, fbs, usage, admins, tickets, gemini, visitors] = await Promise.all([
      getAllRecruiterRequests(),
      fetchFeedbacks(100),
      fetchPortfolioUsage(),
      getAdminUsers(),
      fetchSupportTickets(),
      fetchGeminiUsageToday(),
      getVisitorCount(),
    ]);
    setAdminUsers(admins);
    setSupportTickets(tickets);
    setRequests(reqs);
    setFeedbacks(fbs);
    setPortfolioUsage(usage);
    setGeminiUsage(gemini);
    setVisitorCount(visitors);
    // default approve package = their requested package
    const pkgMap: Record<string, string> = {};
    reqs.forEach((r) => { pkgMap[r.uid] = r.packageId; });
    setApprovePkg(pkgMap);
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const toggleSetting = async (key: keyof SiteSettings) => {
    setSettingLoading(key);
    await updateSiteSettings({ [key]: !settings[key] });
    setSettingLoading("");
  };

  const handleApprove = async (uid: string) => {
    setActionLoading(uid + "_approve");
    await approveRecruiterRequest(uid, approvePkg[uid] || "starter");
    await loadAll();
    setActionLoading("");
  };

  const handleReject = async (uid: string) => {
    setActionLoading(uid + "_reject");
    await rejectRecruiterRequest(uid);
    await loadAll();
    setActionLoading("");
  };

  const handleDeleteFeedback = async (id: string) => {
    setActionLoading("fb_" + id);
    await deleteFeedback(id);
    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    setActionLoading("");
  };

  const pending = requests.filter((r) => r.status === "pending");
  const approved = requests.filter((r) => r.status === "approved");

  const tabs = [
    { id: "overview",   label: "Overview",   icon: BarChart3 },
    { id: "recruiters", label: "Recruiters",  icon: Users, badge: pending.length },
    { id: "portfolio",  label: "Portfolio",   icon: GitBranch },
    { id: "feedback",   label: "Feedback",    icon: MessageSquare },
    { id: "support",    label: "Support",     icon: Headphones, badge: supportTickets.filter(t => t.status === "open").length },
    { id: "admins",     label: "Admins",      icon: Shield },
    { id: "settings",   label: "Settings",    icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-[#0b1f3a] text-white">

      {/* TOP NAV */}
      <header className="bg-[#132f52]/90 backdrop-blur-lg border-b border-[#3fc4e7]/15 px-3 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <img src={logo} alt="" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover border border-[#3fc4e7]/30 flex-shrink-0" />
          <div className="min-w-0">
            <span className="font-display font-bold text-white text-sm sm:text-base">Repoflo Admin</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-body">Live</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Site status pills — hidden on mobile */}
          <div className="hidden md:flex items-center gap-2">
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${settings.portfolioEnabled ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
              Portfolio {settings.portfolioEnabled ? "ON" : "OFF"}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${settings.recruiterEnabled ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
              Recruiter {settings.recruiterEnabled ? "ON" : "OFF"}
            </span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={loadAll}
            className="text-[#b8c7e0] hover:text-white hover:bg-[#3fc4e7]/10"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => { adminLogout(); navigate("/adminProtectedRoutes/auth/signin", { replace: true }); }}
            className="text-[#b8c7e0] hover:text-red-400 hover:bg-red-500/10 px-2 sm:px-3"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Logout</span>
          </Button>
        </div>
      </header>

      {/* TAB BAR */}
      <div className="bg-[#132f52]/50 border-b border-[#3fc4e7]/10 px-1 sm:px-4 flex gap-0 sm:gap-1 overflow-x-auto scrollbar-hide">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold font-body whitespace-nowrap border-b-2 transition-all flex-shrink-0 ${
              activeTab === t.id
                ? "border-[#3fc4e7] text-[#3fc4e7]"
                : "border-transparent text-[#b8c7e0] hover:text-white"
            }`}
          >
            <t.icon className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">{t.label}</span>
            {"badge" in t && t.badge > 0 && (
              <span className="bg-amber-500 text-black text-xs font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-6xl">

        {loading && activeTab !== "overview" ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-[#3fc4e7] animate-spin" />
          </div>
        ) : (

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >

            {/* ══ OVERVIEW ══ */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                  {[
                    { label: "Site Visitors", value: visitorCount.toLocaleString(), icon: Eye, color: "text-[#69d2f1]", bg: "bg-[#69d2f1]/10" },
                    { label: "Pending Requests", value: pending.length, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
                    { label: "Active Recruiters", value: approved.length, icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                    { label: "Portfolios Generated", value: portfolioUsage.length, icon: GitBranch, color: "text-[#3fc4e7]", bg: "bg-[#3fc4e7]/10" },
                    { label: "Total Feedbacks", value: feedbacks.length, icon: Star, color: "text-purple-400", bg: "bg-purple-500/10" },
                  ].map((s) => (
                    <Card key={s.label} className="p-5">
                      <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                        <s.icon className={`w-5 h-5 ${s.color}`} />
                      </div>
                      <div className={`text-2xl font-black ${s.color} mb-1`}>{s.value}</div>
                      <div className="text-[#b8c7e0] text-xs font-body">{s.label}</div>
                    </Card>
                  ))}
                </div>

                {/* Gemini AI Usage Today */}
                <Card>
                  <SectionTitle icon={BarChart3} title="AI Usage Today (Gemini Free Tier)" />
                  <div className="p-6 space-y-5">
                    {/* Progress bar */}
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-white font-bold text-2xl">{geminiUsage.total} <span className="text-sm font-normal text-[#b8c7e0]">AI calls used</span></span>
                        <span className={`text-sm font-semibold ${geminiUsage.remaining < 50 ? 'text-red-400' : geminiUsage.remaining < 150 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {geminiUsage.remaining} left today
                        </span>
                      </div>
                      <div className="h-4 w-full bg-[#0b1f3a] rounded-full overflow-hidden border border-[#3fc4e7]/10">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            geminiUsage.total / geminiUsage.dailyLimit > 0.8 ? 'bg-red-500' :
                            geminiUsage.total / geminiUsage.dailyLimit > 0.5 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, (geminiUsage.total / geminiUsage.dailyLimit) * 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-[#b8c7e0]/50 font-body mt-1">Resets every day at midnight · Free limit: {geminiUsage.dailyLimit} calls/day</p>
                    </div>
                    {/* Breakdown */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#0b1f3a] rounded-xl p-4 border border-[#3fc4e7]/10">
                        <p className="text-xs text-[#b8c7e0]/60 font-body mb-1">📄 Resumes read by AI</p>
                        <p className="text-2xl font-black text-[#3fc4e7]">{geminiUsage.parseResume}</p>
                        <p className="text-xs text-[#b8c7e0]/50 font-body mt-1">1 call per resume upload</p>
                      </div>
                      <div className="bg-[#0b1f3a] rounded-xl p-4 border border-[#3fc4e7]/10">
                        <p className="text-xs text-[#b8c7e0]/60 font-body mb-1">🔍 Recruiter analyses done</p>
                        <p className="text-2xl font-black text-purple-400">{geminiUsage.analyzeCandidate}</p>
                        <p className="text-xs text-[#b8c7e0]/50 font-body mt-1">1 call per analysis</p>
                      </div>
                    </div>
                    {/* Simple summary */}
                    <div className="bg-[#0b1f3a] rounded-xl p-4 border border-[#3fc4e7]/10 text-sm font-body text-[#b8c7e0] space-y-1">
                      <p>✅ You can still make approximately <span className="text-white font-semibold">{geminiUsage.remaining} more AI-powered actions</span> today</p>
                      <p>📊 That's roughly <span className="text-white font-semibold">{geminiUsage.remaining} portfolio resumes</span> or <span className="text-white font-semibold">{geminiUsage.remaining} recruiter analyses</span></p>
                    </div>
                  </div>
                </Card>

                {/* Site controls quick access */}
                <Card>
                  <SectionTitle icon={Settings} title="Site Controls" />
                  <div className="p-6 grid sm:grid-cols-2 gap-4">
                    {([
                      { key: "portfolioEnabled", label: "Portfolio Generation", desc: "Allow users to generate portfolios from GitHub & resume" },
                      { key: "recruiterEnabled", label: "Recruiter Portal", desc: "Allow recruiters to access candidate analysis tools" },
                    ] as const).map((ctrl) => (
                      <div key={ctrl.key} className="flex items-center justify-between bg-[#0b1f3a] rounded-xl p-4 border border-[#3fc4e7]/10">
                        <div>
                          <div className="font-semibold text-white text-sm mb-0.5">{ctrl.label}</div>
                          <div className="text-[#b8c7e0] text-xs font-body">{ctrl.desc}</div>
                        </div>
                        <button
                          onClick={() => toggleSetting(ctrl.key)}
                          disabled={settingLoading === ctrl.key}
                          className="ml-4 flex-shrink-0"
                        >
                          {settingLoading === ctrl.key ? (
                            <Loader2 className="w-8 h-8 text-[#3fc4e7] animate-spin" />
                          ) : settings[ctrl.key] ? (
                            <ToggleRight className="w-10 h-10 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer" />
                          ) : (
                            <ToggleLeft className="w-10 h-10 text-[#b8c7e0]/40 hover:text-[#b8c7e0] transition-colors cursor-pointer" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Pending requests preview */}
                {pending.length > 0 && (
                  <Card>
                    <SectionTitle icon={Clock} title="Pending Approvals" count={pending.length} />
                    <div className="p-4 space-y-2">
                      {pending.slice(0, 3).map((r) => (
                        <div key={r.uid} className="flex items-center justify-between bg-[#0b1f3a] rounded-xl p-3">
                          <div className="flex items-center gap-3">
                            {r.photoURL ? <img src={r.photoURL} className="w-8 h-8 rounded-full" alt="" /> : <div className="w-8 h-8 rounded-full bg-[#132f52] flex items-center justify-center text-[#3fc4e7] font-bold text-sm">{r.name?.[0]}</div>}
                            <div>
                              <div className="text-white text-sm font-semibold">{r.name}</div>
                              <div className="text-[#b8c7e0] text-xs">{r.packageName}</div>
                            </div>
                          </div>
                          <Button size="sm" onClick={() => setActiveTab("recruiters")} className="text-xs bg-[#3fc4e7]/10 text-[#69d2f1] border border-[#3fc4e7]/20 hover:bg-[#3fc4e7]/20">
                            Review
                          </Button>
                        </div>
                      ))}
                      {pending.length > 3 && (
                        <button onClick={() => setActiveTab("recruiters")} className="w-full text-center text-[#3fc4e7] text-sm py-1 hover:text-white transition-colors">
                          +{pending.length - 3} more pending →
                        </button>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* ══ RECRUITERS ══ */}
            {activeTab === "recruiters" && (
              <div className="space-y-6">

                {/* PENDING */}
                <Card>
                  <SectionTitle icon={Clock} title="Pending Requests" count={pending.length} />
                  {pending.length === 0 ? (
                    <div className="p-8 text-center text-[#b8c7e0] font-body text-sm">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                      No pending requests
                    </div>
                  ) : (
                    <div className="divide-y divide-[#3fc4e7]/8">
                      {pending.map((r) => (
                        <div key={r.uid} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            {r.photoURL ? <img src={r.photoURL} className="w-10 h-10 rounded-full" alt="" /> : <div className="w-10 h-10 rounded-full bg-[#0b1f3a] flex items-center justify-center text-[#3fc4e7] font-bold">{r.name?.[0]}</div>}
                            <div>
                              <div className="font-semibold text-white">{r.name}</div>
                              <div className="text-[#b8c7e0] text-sm font-body">{r.email}</div>
                              <div className="text-xs text-[#b8c7e0]/60 font-body mt-0.5">
                                Requested: {new Date(r.requestedAt).toLocaleDateString()} · Package: <strong className="text-[#3fc4e7]">{r.packageName}</strong>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Select
                              value={approvePkg[r.uid] || r.packageId}
                              onValueChange={(v) => setApprovePkg((prev) => ({ ...prev, [r.uid]: v }))}
                            >
                              <SelectTrigger className="h-8 w-40 text-xs bg-[#0b1f3a] border-[#3fc4e7]/20 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-[#132f52] border-[#3fc4e7]/20">
                                {PACKAGES.map((p) => (
                                  <SelectItem key={p.id} value={p.id} className="text-white text-xs hover:bg-[#3fc4e7]/10">
                                    {p.name} (₹{p.inr.toLocaleString()})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(r.uid)}
                              disabled={actionLoading === r.uid + "_approve"}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white h-8 text-xs"
                            >
                              {actionLoading === r.uid + "_approve" ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3 mr-1" />}
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleReject(r.uid)}
                              disabled={actionLoading === r.uid + "_reject"}
                              className="text-red-400 hover:bg-red-500/10 h-8 text-xs border border-red-500/20"
                            >
                              {actionLoading === r.uid + "_reject" ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3 mr-1" />}
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* APPROVED */}
                <Card>
                  <SectionTitle icon={Users} title="Active Recruiters" count={approved.length} />
                  {approved.length === 0 ? (
                    <div className="p-8 text-center text-[#b8c7e0] font-body text-sm">No approved recruiters yet</div>
                  ) : (
                    <div className="overflow-x-auto -mx-0">
                      <table className="w-full text-sm font-body min-w-[500px]">
                        <thead className="border-b border-[#3fc4e7]/10">
                          <tr className="text-[#b8c7e0] text-xs">
                            <th className="text-left px-5 py-3 font-semibold">Recruiter</th>
                            <th className="text-left px-5 py-3 font-semibold">Package</th>
                            <th className="text-left px-5 py-3 font-semibold">Usage</th>
                            <th className="text-left px-5 py-3 font-semibold">Expires</th>
                            <th className="text-left px-5 py-3 font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#3fc4e7]/6">
                          {approved.map((r) => {
                            const expired = r.expiresAt ? new Date(r.expiresAt) < new Date() : false;
                            const cap = r.packageLimit === -1 ? "∞" : r.packageLimit;
                            return (
                              <tr key={r.uid} className="hover:bg-[#3fc4e7]/4 transition-colors">
                                <td className="px-5 py-3">
                                  <div className="flex items-center gap-2">
                                    {r.photoURL ? <img src={r.photoURL} className="w-7 h-7 rounded-full" alt="" /> : <div className="w-7 h-7 rounded-full bg-[#0b1f3a] flex items-center justify-center text-[#3fc4e7] text-xs font-bold">{r.name?.[0]}</div>}
                                    <div>
                                      <div className="text-white font-medium text-xs">{r.name}</div>
                                      <div className="text-[#b8c7e0]/60 text-xs">{r.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-5 py-3 text-[#3fc4e7] font-semibold text-xs">{r.packageName}</td>
                                <td className="px-5 py-3 text-[#b8c7e0] text-xs">{r.usageCount || 0} / {cap}</td>
                                <td className="px-5 py-3 text-xs">
                                  <span className={expired ? "text-red-400" : "text-[#b8c7e0]"}>
                                    {r.expiresAt ? new Date(r.expiresAt).toLocaleDateString() : "—"}
                                    {expired && " (Expired)"}
                                  </span>
                                </td>
                                <td className="px-5 py-3">{statusBadge(r.status)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>

                {/* REJECTED */}
                {requests.filter(r => r.status === "rejected").length > 0 && (
                  <Card>
                    <SectionTitle icon={XCircle} title="Rejected Requests" count={requests.filter(r => r.status === "rejected").length} />
                    <div className="divide-y divide-[#3fc4e7]/6">
                      {requests.filter(r => r.status === "rejected").map(r => (
                        <div key={r.uid} className="px-5 py-3 flex items-center justify-between">
                          <div>
                            <div className="text-white text-sm">{r.name}</div>
                            <div className="text-[#b8c7e0]/60 text-xs">{r.email} · {r.packageName}</div>
                          </div>
                          <Button size="sm" onClick={() => handleApprove(r.uid)} className="text-xs bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600/30 h-7">
                            Approve now
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* ══ PORTFOLIO ══ */}
            {activeTab === "portfolio" && (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-3 gap-4">
                  <Card className="p-5 text-center">
                    <div className="text-3xl font-black text-[#3fc4e7] mb-1">{portfolioUsage.length}</div>
                    <div className="text-[#b8c7e0] text-sm font-body">Total Portfolios Generated</div>
                  </Card>
                  <Card className="p-5 text-center">
                    <div className="text-3xl font-black text-purple-400 mb-1">
                      {new Set(portfolioUsage.map(p => p.email).filter(Boolean)).size}
                    </div>
                    <div className="text-[#b8c7e0] text-sm font-body">Unique Users</div>
                  </Card>
                  <Card className="p-5 text-center">
                    <div className="text-3xl font-black text-amber-400 mb-1">
                      {portfolioUsage.filter(p => {
                        const d = new Date(p.timestamp);
                        const now = new Date();
                        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                      }).length}
                    </div>
                    <div className="text-[#b8c7e0] text-sm font-body">This Month</div>
                  </Card>
                </div>

                <Card>
                  <SectionTitle icon={GitBranch} title="Portfolio Generation Log" count={portfolioUsage.length} />
                  {portfolioUsage.length === 0 ? (
                    <div className="p-8 text-center text-[#b8c7e0] font-body text-sm">No portfolio generations recorded yet</div>
                  ) : (
                    <div className="divide-y divide-[#3fc4e7]/8">
                      {portfolioUsage.map((p, i) => (
                        <PortfolioSummaryRow key={p.id || i} p={p} />
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* ══ FEEDBACK ══ */}
            {activeTab === "feedback" && (
              <Card>
                <SectionTitle icon={MessageSquare} title="User Feedback" count={feedbacks.length} />
                {feedbacks.length === 0 ? (
                  <div className="p-8 text-center text-[#b8c7e0] font-body text-sm">No feedback yet</div>
                ) : (
                  <div className="divide-y divide-[#3fc4e7]/8">
                    {feedbacks.map((f: any) => (
                      <div key={f.id} className="p-5 flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-white text-sm">{f.name}</span>
                            <div className="flex gap-0.5">
                              {Array(f.rating || 0).fill(0).map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-[#b8c7e0] text-sm font-body leading-relaxed">{f.message}</p>
                          {f.created_at && (
                            <p className="text-[#b8c7e0]/40 text-xs mt-1">{new Date(f.created_at).toLocaleDateString()}</p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteFeedback(f.id)}
                          disabled={actionLoading === "fb_" + f.id}
                          className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10 flex-shrink-0 h-8 w-8 p-0"
                        >
                          {actionLoading === "fb_" + f.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* ══ SETTINGS ══ */}
            {/* ══ SUPPORT ══ */}
            {activeTab === "support" && (
              <div className="space-y-4">
                <Card>
                  <SectionTitle icon={Headphones} title="Support Tickets" count={supportTickets.length} />
                  {supportTickets.length === 0 ? (
                    <div className="p-8 text-center text-[#b8c7e0] font-body text-sm">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                      No support tickets yet
                    </div>
                  ) : (
                    <div className="divide-y divide-[#3fc4e7]/8">
                      {supportTickets.map((t) => (
                        <div key={t.id} className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="font-semibold text-white text-sm">{t.recruiterName}</span>
                                <span className="text-[#b8c7e0]/50 text-xs">{t.recruiterEmail}</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                  t.status === "open"
                                    ? "bg-amber-500/10 text-amber-400"
                                    : "bg-emerald-500/10 text-emerald-400"
                                }`}>
                                  {t.status === "open" ? "Open" : "Resolved"}
                                </span>
                              </div>
                              <p className="text-[#b8c7e0] text-sm font-body leading-relaxed mb-1">{t.message}</p>
                              <p className="text-[#b8c7e0]/40 text-xs">{new Date(t.createdAt).toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {t.status === "open" && (
                                <Button size="sm"
                                  onClick={async () => {
                                    setActionLoading("res_" + t.id);
                                    await resolveSupportTicket(t.id!);
                                    setSupportTickets(prev => prev.map(x => x.id === t.id ? { ...x, status: "resolved" } : x));
                                    setActionLoading("");
                                  }}
                                  disabled={actionLoading === "res_" + t.id}
                                  className="text-xs bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600/30 h-7"
                                >
                                  {actionLoading === "res_" + t.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3 mr-1" />}
                                  Resolve
                                </Button>
                              )}
                              <Button size="sm" variant="ghost"
                                onClick={async () => {
                                  setActionLoading("del_" + t.id);
                                  await deleteSupportTicket(t.id!);
                                  setSupportTickets(prev => prev.filter(x => x.id !== t.id));
                                  setActionLoading("");
                                }}
                                disabled={actionLoading === "del_" + t.id}
                                className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10 h-7 w-7 p-0"
                              >
                                {actionLoading === "del_" + t.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* ══ ADMINS ══ */}
            {activeTab === "admins" && (
              <div className="max-w-xl">
                <Card>
                  <SectionTitle icon={Shield} title="Admin Users" count={adminUsers.length} />
                  <div className="p-5 space-y-4">
                    <p className="text-[#b8c7e0] font-body text-sm">
                      All listed emails can sign in to this admin portal via Google Sign-In. The primary admin cannot be removed.
                    </p>

                    {/* Current admins */}
                    <div className="space-y-2">
                      {adminUsers.map((u) => (
                        <div key={u.email} className="flex items-center justify-between bg-[#0b1f3a] rounded-xl px-4 py-3 border border-[#3fc4e7]/10">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-white text-sm font-semibold">{u.email}</span>
                              {u.isPrimary && (
                                <span className="text-[10px] bg-[#3fc4e7]/15 text-[#69d2f1] px-2 py-0.5 rounded-full font-bold">Primary</span>
                              )}
                              {u.email === currentAdminEmail && !u.isPrimary && (
                                <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-bold">You</span>
                              )}
                            </div>
                            <div className="text-[#b8c7e0]/50 text-xs mt-0.5">
                              Added {new Date(u.addedAt).toLocaleDateString()}
                              {u.addedBy && u.addedBy !== "system" && ` by ${u.addedBy}`}
                            </div>
                          </div>
                          {!u.isPrimary && (
                            <button
                              onClick={async () => {
                                setActionLoading("rm_" + u.email);
                                try {
                                  await removeAdminUser(u.email);
                                  setAdminUsers(prev => prev.filter(a => a.email !== u.email));
                                } catch (err: any) { setAdminUserError(err.message); }
                                finally { setActionLoading(""); }
                              }}
                              disabled={actionLoading === "rm_" + u.email}
                              className="text-red-400/60 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
                            >
                              {actionLoading === "rm_" + u.email
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <Trash2 className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add new admin */}
                    <div className="border-t border-[#3fc4e7]/10 pt-4">
                      <p className="text-sm font-semibold text-white mb-3">Add New Admin</p>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={newAdminEmail}
                          onChange={(e) => { setNewAdminEmail(e.target.value); setAdminUserError(""); }}
                          placeholder="their@gmail.com"
                          className="flex-1 h-10 bg-[#0b1f3a] border border-[#3fc4e7]/20 rounded-xl px-3 text-sm text-white placeholder:text-[#b8c7e0]/30 focus:outline-none focus:border-[#3fc4e7]/50 font-body"
                        />
                        <Button
                          disabled={!newAdminEmail || adminUserLoading}
                          onClick={async () => {
                            setAdminUserError("");
                            setAdminUserLoading(true);
                            try {
                              await addAdminUser(newAdminEmail.trim(), currentAdminEmail);
                              const updated = await getAdminUsers();
                              setAdminUsers(updated);
                              setNewAdminEmail("");
                            } catch (err: any) { setAdminUserError(err.message); }
                            finally { setAdminUserLoading(false); }
                          }}
                          className="h-10 px-5 bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black font-bold rounded-xl text-sm hover:opacity-90"
                        >
                          {adminUserLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "+ Add Admin"}
                        </Button>
                      </div>
                      {adminUserError && (
                        <p className="text-red-400 text-xs mt-2 font-body flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> {adminUserError}
                        </p>
                      )}
                      <p className="text-[#b8c7e0]/40 text-xs mt-2 font-body">
                        The person must sign in using this exact Google account email.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <Card>
                  <SectionTitle icon={Settings} title="Site Controls" />
                  <div className="p-6 space-y-4">
                    {([
                      {
                        key: "portfolioEnabled" as const,
                        label: "Portfolio Generation",
                        desc: "When OFF — users see a 'Under Maintenance' message instead of the generate page",
                        onColor: "text-emerald-400",
                        offMsg: "Portfolio generation is currently DISABLED site-wide",
                      },
                      {
                        key: "recruiterEnabled" as const,
                        label: "Recruiter Portal",
                        desc: "When OFF — the recruiter portal shows a maintenance page. Existing sessions are paused.",
                        onColor: "text-emerald-400",
                        offMsg: "Recruiter portal is currently DISABLED site-wide",
                      },
                    ]).map((ctrl) => (
                      <div key={ctrl.key} className="bg-[#0b1f3a] rounded-xl border border-[#3fc4e7]/10 overflow-hidden">
                        <div className="flex items-center justify-between p-5">
                          <div>
                            <div className="font-semibold text-white mb-1">{ctrl.label}</div>
                            <div className="text-[#b8c7e0] text-sm font-body">{ctrl.desc}</div>
                          </div>
                          <div className="flex items-center gap-3 ml-4">
                            <span className={`text-sm font-bold ${settings[ctrl.key] ? "text-emerald-400" : "text-red-400"}`}>
                              {settings[ctrl.key] ? "ON" : "OFF"}
                            </span>
                            <button
                              onClick={() => toggleSetting(ctrl.key)}
                              disabled={settingLoading === ctrl.key}
                              className="focus:outline-none"
                            >
                              {settingLoading === ctrl.key ? (
                                <Loader2 className="w-10 h-10 text-[#3fc4e7] animate-spin" />
                              ) : settings[ctrl.key] ? (
                                <ToggleRight className="w-12 h-12 text-emerald-400 cursor-pointer hover:text-emerald-300 transition-colors" />
                              ) : (
                                <ToggleLeft className="w-12 h-12 text-[#b8c7e0]/30 cursor-pointer hover:text-[#b8c7e0] transition-colors" />
                              )}
                            </button>
                          </div>
                        </div>
                        {!settings[ctrl.key] && (
                          <div className="px-5 py-2 bg-red-500/10 border-t border-red-500/15 text-red-400 text-xs font-body flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" /> {ctrl.offMsg}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Packages reference */}
                <Card>
                  <SectionTitle icon={Package} title="Recruiter Packages" />
                  <div className="p-5 grid sm:grid-cols-2 gap-3">
                    {PACKAGES.map((p) => (
                      <div key={p.id} className="bg-[#0b1f3a] rounded-xl p-4 border border-[#3fc4e7]/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-white text-sm">{p.name}</span>
                          {p.badge && <span className="text-xs bg-[#3fc4e7]/15 text-[#69d2f1] px-2 py-0.5 rounded-full">{p.badge}</span>}
                        </div>
                        <div className="text-[#3fc4e7] font-black text-lg">₹{p.inr.toLocaleString()}<span className="text-xs text-[#b8c7e0] font-normal ml-1">/yr (${p.usd})</span></div>
                        <div className="text-[#b8c7e0] text-xs mt-1">{p.desc}</div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Admin Users */}
                <Card>
                  <SectionTitle icon={Shield} title="Admin Users" count={adminUsers.length} />
                  <div className="p-5 space-y-4">
                    <p className="text-[#b8c7e0] font-body text-xs">
                      All listed emails can sign in to this admin dashboard via Google. The primary admin cannot be removed.
                    </p>

                    {/* Current admins list */}
                    <div className="space-y-2">
                      {adminUsers.map((u) => (
                        <div key={u.email} className="flex items-center justify-between bg-[#0b1f3a] rounded-xl px-4 py-3 border border-[#3fc4e7]/10">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-white text-sm font-semibold">{u.email}</span>
                              {u.isPrimary && (
                                <span className="text-[10px] bg-[#3fc4e7]/15 text-[#69d2f1] px-2 py-0.5 rounded-full font-bold">Primary</span>
                              )}
                              {u.email === currentAdminEmail && !u.isPrimary && (
                                <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-bold">You</span>
                              )}
                            </div>
                            <div className="text-[#b8c7e0]/50 text-xs mt-0.5">
                              Added {new Date(u.addedAt).toLocaleDateString()}
                              {u.addedBy !== "system" && ` by ${u.addedBy}`}
                            </div>
                          </div>
                          {!u.isPrimary && (
                            <button
                              onClick={async () => {
                                setActionLoading("rm_" + u.email);
                                try {
                                  await removeAdminUser(u.email);
                                  setAdminUsers(prev => prev.filter(a => a.email !== u.email));
                                } catch (err: any) {
                                  setAdminUserError(err.message);
                                } finally { setActionLoading(""); }
                              }}
                              disabled={actionLoading === "rm_" + u.email}
                              className="text-red-400/60 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
                            >
                              {actionLoading === "rm_" + u.email
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <Trash2 className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add new admin */}
                    <div className="border-t border-[#3fc4e7]/10 pt-4">
                      <p className="text-xs font-semibold text-[#b8c7e0] mb-2">Add Admin User</p>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={newAdminEmail}
                          onChange={(e) => { setNewAdminEmail(e.target.value); setAdminUserError(""); }}
                          placeholder="email@example.com"
                          className="flex-1 h-9 bg-[#0b1f3a] border border-[#3fc4e7]/20 rounded-lg px-3 text-sm text-white placeholder:text-[#b8c7e0]/30 focus:outline-none focus:border-[#3fc4e7]/50 font-body"
                        />
                        <Button
                          size="sm"
                          disabled={!newAdminEmail || adminUserLoading}
                          onClick={async () => {
                            setAdminUserError("");
                            setAdminUserLoading(true);
                            try {
                              await addAdminUser(newAdminEmail.trim(), currentAdminEmail);
                              const updated = await getAdminUsers();
                              setAdminUsers(updated);
                              setNewAdminEmail("");
                            } catch (err: any) {
                              setAdminUserError(err.message);
                            } finally { setAdminUserLoading(false); }
                          }}
                          className="bg-[#3fc4e7]/15 text-[#69d2f1] border border-[#3fc4e7]/25 hover:bg-[#3fc4e7]/25 h-9 px-4 text-xs font-bold"
                        >
                          {adminUserLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "+ Add"}
                        </Button>
                      </div>
                      {adminUserError && (
                        <p className="text-red-400 text-xs mt-2 font-body">{adminUserError}</p>
                      )}
                    </div>

                    {/* Sign out */}
                    <div className="border-t border-[#3fc4e7]/10 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-white text-sm font-semibold">{currentAdminEmail}</div>
                          <div className="text-[#b8c7e0]/50 text-xs">Signed in · Session valid 8h</div>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { adminLogout(); navigate("/adminProtectedRoutes/auth/signin", { replace: true }); }}
                        className="text-red-400 hover:bg-red-500/10 border border-red-500/20 w-full"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
