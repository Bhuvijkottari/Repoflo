import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { getThemeHtml } from "@/lib/themeTemplates";
import { injectEditor, stripEditor } from "@/lib/editorInjection";
import { Download, ArrowLeft, Smartphone, Monitor, Maximize, Pencil, Check, X, Trash2, Plus, Code, Loader2, FileText, Eye, Camera, Undo2 } from "lucide-react";
import type { PortfolioData } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { downloadHtml, generateReportHtml, type CandidateAnalysis } from "@/lib/generateReport";
import RecruiterAnalysisPanel from "@/components/RecruiterAnalysisPanel";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { storeCandidateAnalysis, updateCandidateAnalysis, updateRecruiterHistoryAnalysis, trackGeminiCall } from "@/lib/firebase";
import html2pdf from "html2pdf.js";

interface AtsScore {
  overall: number;
  keywordScore: number;
  formatScore: number;
  experienceScore: number;
  educationScore: number;
  skillsScore: number;
  suggestions: string[];
}

interface LeetcodeInsights {
  problemSolvingLevel: string;
  difficultyBalance: string;
  contestPerformance: string;
  summary: string;
}

interface PreviewPageProps {
  overrideThemeId?: string;
}

const PreviewPage: React.FC<PreviewPageProps> = ({ overrideThemeId }) => {
  const params = useParams<{ themeId: string }>();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const themeId = overrideThemeId || params.themeId || "";
  const [viewMode, setViewMode] = useState<"desktop" | "mobile" | "fullscreen">("desktop");
  const [hideNavbar, setHideNavbar] = useState(false);
  const [inlineEditing, setInlineEditing] = useState(false);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [editableHtml, setEditableHtml] = useState("");
  const [cleanHtml, setCleanHtml] = useState("");
  const [finalized, setFinalized] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [previousAvatar, setPreviousAvatar] = useState<string | null>(null);

  // Recruiter analysis state
  const [analysis, setAnalysis] = useState<CandidateAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [requiredTechStack, setRequiredTechStack] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<string>("");
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [historyId, setHistoryId] = useState<string | null>(null);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const isRecruiter = themeId === "recruiter";

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("portfolioData");
      if (stored) setPortfolioData(JSON.parse(stored));
      // Load recruiter preferences
      const prefs = sessionStorage.getItem("recruiterPrefs");
      if (prefs) {
        const parsed = JSON.parse(prefs);
        if (parsed.requiredTechStack?.length) setRequiredTechStack(parsed.requiredTechStack);
        if (parsed.experienceLevel) setExperienceLevel(parsed.experienceLevel);
        if (parsed.selectedFields?.length) setSelectedFields(parsed.selectedFields);
      }
      // Load candidate ID for updating analysis
      const storedCandidateId = sessionStorage.getItem("candidateId");
      if (storedCandidateId) setCandidateId(storedCandidateId);
      // Load history ID for updating analysis
      const storedHistoryId = sessionStorage.getItem("historyId");
      if (storedHistoryId) setHistoryId(storedHistoryId);
      // Restore saved analysis (from history "View" button) — skip re-running
      const savedAnalysis = sessionStorage.getItem("savedAnalysis");
      if (savedAnalysis) {
        setAnalysis(JSON.parse(savedAnalysis));
        sessionStorage.removeItem("savedAnalysis");
      }
      // Restore cached analysis (from findExistingCandidate) — skip re-running
      const cachedAnalysis = sessionStorage.getItem("cachedAnalysis");
      if (cachedAnalysis) {
        setAnalysis(JSON.parse(cachedAnalysis));
        sessionStorage.removeItem("cachedAnalysis");
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (portfolioData) {
      const html = getThemeHtml(themeId || "minimal", portfolioData);
      setEditableHtml(html);
      setCleanHtml(html);
    }
  }, [themeId, portfolioData]);

  // hide navbar when override tells us to (recruiter dashboard)
  useEffect(() => {
    if (overrideThemeId === "recruiter") {
      setHideNavbar(true);
    }
  }, [overrideThemeId]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === '__editor_update') {
        setCleanHtml(e.data.html);
      }
      // Click on avatar inside iframe triggers photo upload
      if (e.data?.type === '__avatar_click') {
        photoInputRef.current?.click();
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  useEffect(() => {
    // Skip auto-analysis if a saved analysis was restored from history
    if (isRecruiter && portfolioData && !analysis && !isAnalyzing) {
      // Small delay to let the savedAnalysis useEffect run first
      const t = setTimeout(() => {
        setAnalysis(prev => {
          if (!prev) runAnalysis();
          return prev;
        });
      }, 50);
      return () => clearTimeout(t);
    }
  }, [isRecruiter, portfolioData]);

  const runAnalysis = async () => {
    if (!portfolioData) return;
    setIsAnalyzing(true);
    try {
      // FIX 1: driveContext must be declared BEFORE the fetch call, not inside it
      const driveContext = JSON.parse(
        sessionStorage.getItem("driveContext") || "{}"
      );

      const res = await fetch("/api/analyze-candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          portfolioData,
          requiredTechStack:
            driveContext.requiredTechStack?.length > 0
              ? driveContext.requiredTechStack
              : undefined,
          experienceLevel:
            driveContext.experienceLevel || undefined,
          selectedFields:
            driveContext.selectedFields || [],
        }),
      });
      const data = await res.json();
      if (data?.error) throw new Error(data.error);
      setAnalysis(data as CandidateAnalysis);
      trackGeminiCall("analyze-candidate");

      // Generate HTML report
      const reportHtml = generateReportHtml(portfolioData, data as CandidateAnalysis, selectedFields);

      // Store/update candidate analysis in database
      if (candidateId && user?.email) {
        await updateCandidateAnalysis(candidateId, data, reportHtml);
      }

      // Update history entry with analysis
      if (historyId && user?.email) {
        await updateRecruiterHistoryAnalysis(user.email, historyId, data);
      }
    } catch (e: any) {
      toast({ title: "Analysis Failed", description: e.message || "Could not generate candidate analysis.", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadReport = () => {
    // FIX 2: use portfolioData?.name, not undefined `sanitizedName` (declared later)
    const name = (portfolioData?.name || "report").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
    const html = "<!DOCTYPE html>\n" + document.documentElement.outerHTML;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}-full-ui.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 150);
    toast({ title: "Downloaded", description: "Report HTML downloaded" });
  };

  const handleGenerateReport = () => {
    if (!portfolioData || !analysis) return;
    // FIX 3: same — sanitizedName not yet in scope here, compute locally
    const name = (portfolioData?.name || "report").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
    const reportHtml = generateReportHtml(portfolioData, analysis, selectedFields);
    const element = document.createElement("div");
    element.innerHTML = reportHtml;
    html2pdf().from(element).set({
      filename: `${name}-report.pdf`,
      margin: 10,
      html2canvas: {
        scale: 2,
        useCORS: true,
      },
      jsPDF: {
        format: "a4",
        orientation: "portrait",
      },
    }).save();
  };

  const handleDownloadPDF = () => {
    if (!portfolioData || !analysis) return;
    const reportHtml = generateReportHtml(portfolioData, analysis, selectedFields);
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast({ title: "Popup Blocked", description: "Please allow popups for this site to download the PDF.", variant: "destructive" });
      return;
    }
    printWindow.document.open();
    printWindow.document.write(reportHtml);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    };
  };

  const updateField = (field: keyof PortfolioData, value: any) => {
    if (!portfolioData) return;
    const updated = { ...portfolioData, [field]: value };
    setPortfolioData(updated);
    sessionStorage.setItem("portfolioData", JSON.stringify(updated));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Save current avatar for undo
    if (portfolioData?.avatar) setPreviousAvatar(portfolioData.avatar);
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (!ev.target?.result) return;
      const img = new Image();
      img.onload = () => {
        // Auto-crop to square (center crop)
        const size = Math.min(img.width, img.height);
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext("2d")!;
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        ctx.drawImage(img, sx, sy, size, size, 0, 0, 400, 400);
        updateField("avatar", canvas.toDataURL("image/jpeg", 0.9));
      };
      img.src = ev.target.result as string;
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const undoPhoto = () => {
    if (previousAvatar) {
      updateField("avatar", previousAvatar);
      setPreviousAvatar(null);
      toast({ title: "Photo Restored", description: "Previous photo has been restored." });
    }
  };

  const removePhoto = () => {
    if (portfolioData?.avatar) setPreviousAvatar(portfolioData.avatar);
    updateField("avatar", "");
  };

  const personName = portfolioData?.name || "portfolio";
  const sanitizedName = personName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");

  // Always get the latest HTML (edited or original)
  const getFinalHtml = () => inlineEditing ? cleanHtml : editableHtml;

  const triggerDownload = (content: string, filename: string, type = "text/html") => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 150);
  };

  const handleDownload = () => {
    triggerDownload(getFinalHtml(), `${sanitizedName}.html`);
  };

  const handleDownloadCode = () => {
    triggerDownload(getFinalHtml(), `${sanitizedName}-source.txt`, "text/plain");
    toast({ title: "Source Code Downloaded", description: `Open "${sanitizedName}-source.txt" in any text editor to copy the code.` });
  };

  const handleFinalize = () => {
    // Capture edited HTML BEFORE clearing state
    const finalHtml = getFinalHtml();
    // Persist the edited version so all future downloads use it
    setEditableHtml(finalHtml);
    setCleanHtml(finalHtml);
    setInlineEditing(false);
    setFinalized(true);
    triggerDownload(finalHtml, `${sanitizedName}-source.txt`, "text/plain");
    toast({ title: "Portfolio Finalized! 🎉", description: `"${sanitizedName}-source.txt" downloaded — open in any text editor to copy the code.` });
  };

  const toggleInlineEditor = () => {
    if (!inlineEditing) {
      setInlineEditing(true);
    } else {
      setEditableHtml(cleanHtml);
      setInlineEditing(false);
      toast({ title: "Edits Applied", description: "Your changes have been saved to the preview." });
    }
  };

  const handleOpenInVSCode = () => {
    handleDownloadCode();
  };

  const addExperience = () => {
    if (!portfolioData) return;
    updateField("experience", [...portfolioData.experience, { company: "Company", role: "Role", period: "2024 - Present", description: "Description" }]);
  };
  const removeExperience = (i: number) => {
    if (!portfolioData) return;
    updateField("experience", portfolioData.experience.filter((_, idx) => idx !== i));
  };
  const updateExperience = (i: number, field: string, value: string) => {
    if (!portfolioData) return;
    const updated = [...portfolioData.experience];
    (updated[i] as any)[field] = value;
    updateField("experience", updated);
  };

  const addEducation = () => {
    if (!portfolioData) return;
    updateField("education", [...portfolioData.education, { institution: "University", degree: "Degree", period: "2020 - 2024" }]);
  };
  const removeEducation = (i: number) => {
    if (!portfolioData) return;
    updateField("education", portfolioData.education.filter((_, idx) => idx !== i));
  };
  const updateEducation = (i: number, field: string, value: string) => {
    if (!portfolioData) return;
    const updated = [...portfolioData.education];
    (updated[i] as any)[field] = value;
    updateField("education", updated);
  };

  const [newSkill, setNewSkill] = useState("");
  const addSkill = () => {
    if (!portfolioData || !newSkill.trim()) return;
    updateField("skills", [...portfolioData.skills, newSkill.trim()]);
    setNewSkill("");
  };
  const removeSkill = (i: number) => {
    if (!portfolioData) return;
    updateField("skills", portfolioData.skills.filter((_, idx) => idx !== i));
  };

  if (viewMode === "fullscreen") {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button size="sm" onClick={() => setViewMode("desktop")} className="bg-[#132f52] text-[#b8c7e0] border border-[#3fc4e7]/40 hover:bg-[#3fc4e7]/15 hover:text-white font-semibold">Exit Fullscreen</Button>
          <Button size="sm" onClick={handleDownload} className="bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black font-bold hover:opacity-90"><Download className="w-4 h-4 mr-1" /> Download</Button>
        </div>
        <iframe srcDoc={editableHtml} className="w-full h-full border-0" title="Portfolio Preview" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {!hideNavbar && <Navbar />}
      <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
      
      <div className="pt-16 sm:pt-20 pb-4 sm:pb-16 container mx-auto px-1 sm:px-4">
        {/* Top bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              size="sm"
              className="bg-white text-black hover:bg-gray-100 font-semibold"
              asChild
            >
              <Link to={isRecruiter ? "/recruiter" : "/themes"}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Link>
            </Button>
            <h1 className="font-display text-lg sm:text-xl font-bold text-white">
              {portfolioData?.name || "Preview"}
              {!isRecruiter && <span className="capitalize text-[#3fc4e7] ml-2">{themeId}</span>}
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {!isRecruiter && (
              <>
                <Button
                  size="sm"
                  onClick={handleDownloadCode}
                  className="bg-[#132f52] text-[#b8c7e0] border border-[#3fc4e7]/30 hover:bg-[#3fc4e7]/12 hover:text-white hover:border-[#3fc4e7]/60 font-semibold"
                >
                  <Code className="w-4 h-4 mr-1" /> Code
                </Button>
                {!isMobile && (
                  <div className="flex bg-[#132f52] border border-[#3fc4e7]/20 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("desktop")}
                      className={`p-2 rounded-md transition-colors ${viewMode === "desktop" ? "bg-[#3fc4e7]/20 text-[#3fc4e7]" : "text-[#b8c7e0] hover:text-white"}`}
                    ><Monitor className="w-4 h-4" /></button>
                    <button
                      onClick={() => setViewMode("mobile")}
                      className={`p-2 rounded-md transition-colors ${viewMode === "mobile" ? "bg-[#3fc4e7]/20 text-[#3fc4e7]" : "text-[#b8c7e0] hover:text-white"}`}
                    ><Smartphone className="w-4 h-4" /></button>
                    <button
                      onClick={() => setViewMode("fullscreen")}
                      className="p-2 rounded-md text-[#b8c7e0] hover:text-white transition-colors"
                    ><Maximize className="w-4 h-4" /></button>
                  </div>
                )}
                {previousAvatar && (
                  <Button
                    size="sm"
                    onClick={undoPhoto}
                    className="bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 font-semibold"
                  >
                    <Undo2 className="w-4 h-4 mr-1" /> Undo
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={toggleInlineEditor}
                  className={inlineEditing
                    ? "bg-[#3fc4e7] text-black hover:bg-[#69d2f1] font-semibold"
                    : "bg-[#132f52] text-[#69d2f1] border border-[#3fc4e7]/40 hover:bg-[#3fc4e7]/15 hover:border-[#3fc4e7]/70 hover:text-white font-semibold"
                  }
                >
                  {inlineEditing ? <><Eye className="w-4 h-4 mr-1" /> Exit Edit</> : <><Pencil className="w-4 h-4 mr-1" /> Edit</>}
                </Button>
                <Button
                  size="sm"
                  onClick={handleFinalize}
                  className="bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black font-bold hover:opacity-90 shadow-lg shadow-[#3fc4e7]/20"
                >
                  <Check className="w-4 h-4 mr-1" /> {isMobile ? "Download" : "Finalize"}
                </Button>
              </>
            )}
            {isRecruiter && (
              <Button
                size="sm"
                onClick={handleDownloadReport}
                disabled={!analysis}
                className="bg-white text-black hover:bg-gray-100 font-semibold disabled:opacity-40"
              >
                <FileText className="w-4 h-4 mr-1" /> Download Report
              </Button>
            )}
          </div>
        </motion.div>

        {/* Portfolio preview — non-recruiter only */}
        {!isRecruiter && (
          <div className="flex gap-4 justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-5xl"
            >
              <div className={`bg-card overflow-hidden transition-all duration-500 ${
                viewMode === "mobile" && !isMobile
                  ? "w-[390px] h-[844px] mx-auto rounded-2xl shadow-card-hover"
                  : isMobile
                    ? "w-full h-[82vh] rounded-xl"
                    : "w-full h-[80vh] rounded-2xl shadow-card-hover"
              }`}>
                {/* Browser chrome — hide on phone for max space */}
                {!isMobile && (
                  <div className="bg-secondary/50 px-4 py-2 flex items-center gap-2 border-b border-border">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-destructive/60" />
                      <div className="w-3 h-3 rounded-full bg-accent/60" />
                      <div className="w-3 h-3 rounded-full bg-primary/40" />
                    </div>
                    <div className="flex-1 text-center text-xs text-muted-foreground font-body truncate">
                      {inlineEditing && <span className="text-primary font-semibold ml-1">Editing</span>}
                    </div>
                  </div>
                )}
                <iframe
                  ref={iframeRef}
                  srcDoc={inlineEditing ? injectEditor(editableHtml) : editableHtml}
                  className="w-full border-0"
                  style={{ height: isMobile ? "100%" : "calc(100% - 36px)" }}
                  title="Portfolio Preview"
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* Recruiter — single scrollable page: tech stack filter + analysis */}
        {isRecruiter && portfolioData && (
          <>
            {/* Optional tech stack filter */}
            <RecruiterAnalysisPanel
              analysis={analysis}
              isAnalyzing={isAnalyzing}
              portfolioData={portfolioData}
              onReanalyze={runAnalysis}
              onDownloadReport={handleDownloadReport}
              onDownloadPDF={handleDownloadPDF}
              onGenerateReport={handleGenerateReport}
              requiredTechStack={requiredTechStack}
              selectedFields={selectedFields}
            />
          </>
        )}

        {/* Finalized banner */}
        {finalized && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-[#132f52] border border-[#3fc4e7]/25 rounded-xl p-5 text-center"
          >
            <p className="font-display font-semibold text-white text-lg">Portfolio Finalized 🎉</p>
            <p className="text-sm text-[#b8c7e0] mt-1">
              <code className="bg-[#0b1f3a] px-2 py-0.5 rounded text-xs text-[#69d2f1]">{sanitizedName}-source.txt</code>
              {" "}downloaded with all your edits.
            </p>
            <div className="flex gap-3 justify-center mt-4 flex-wrap">
              <Button size="sm" onClick={handleDownloadCode}
                className="bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black font-bold hover:opacity-90">
                <Code className="w-4 h-4 mr-1" /> Download Source Code
              </Button>
            </div>
            <p className="text-xs text-[#b8c7e0]/40 mt-2 font-body">Both files include all your edits</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PreviewPage;
