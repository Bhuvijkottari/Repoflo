import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { getThemeHtml } from "@/lib/themeTemplates";
import { injectEditor, stripEditor } from "@/lib/editorInjection";
import { Download, ArrowLeft, Smartphone, Monitor, Maximize, Pencil, Check, X, Trash2, Plus, Code, Loader2, FileText, Eye, Lock, ShieldCheck } from "lucide-react";
import type { PortfolioData } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateReportHtml, type CandidateAnalysis } from "@/lib/generateReport";
import RecruiterAnalysisPanel from "@/components/RecruiterAnalysisPanel";
import TechStackInput from "@/components/TechStackInput";
import { useIsMobile } from "@/hooks/use-mobile";

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

const PreviewPage = () => {
  const { themeId } = useParams<{ themeId: string }>();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<"desktop" | "mobile" | "fullscreen">("desktop");
  const [inlineEditing, setInlineEditing] = useState(false);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [editableHtml, setEditableHtml] = useState("");
  const [cleanHtml, setCleanHtml] = useState("");
  const [finalized, setFinalized] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Recruiter analysis state
  const [analysis, setAnalysis] = useState<CandidateAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [requiredTechStack, setRequiredTechStack] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<string>("");
  const [recruiterUnlocked, setRecruiterUnlocked] = useState(() => sessionStorage.getItem("recruiterUnlocked") === "true");
  const [recruiterPin, setRecruiterPin] = useState("");
  const RECRUITER_PASSWORD = "repoflow";

  const isRecruiter = themeId === "recruiter";

  const handleRecruiterLogin = () => {
    if (recruiterPin === RECRUITER_PASSWORD) {
      setRecruiterUnlocked(true);
      sessionStorage.setItem("recruiterUnlocked", "true");
      toast({ title: "Access Granted", description: "Welcome to the recruiter analysis panel." });
    } else {
      toast({ title: "Access Denied", description: "Incorrect password.", variant: "destructive" });
      setRecruiterPin("");
    }
  };

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

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === '__editor_update') {
        setCleanHtml(e.data.html);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  useEffect(() => {
    if (isRecruiter && portfolioData && !analysis && !isAnalyzing) {
      runAnalysis();
    }
  }, [isRecruiter, portfolioData]);

  const runAnalysis = async () => {
    if (!portfolioData) return;
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-candidate", {
        body: {
          portfolioData,
          requiredTechStack: requiredTechStack.length > 0 ? requiredTechStack : undefined,
          experienceLevel: experienceLevel || undefined,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setAnalysis(data as CandidateAnalysis);
    } catch (e: any) {
      toast({ title: "Analysis Failed", description: e.message || "Could not generate candidate analysis.", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadReport = () => {
    if (!portfolioData || !analysis) return;
    const reportHtml = generateReportHtml(portfolioData, analysis);
    const blob = new Blob([reportHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sanitizedName}-recruiter-report.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Report Downloaded", description: "Open the HTML file in any browser to view or print as PDF." });
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
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) updateField("avatar", ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => updateField("avatar", "");

  const personName = portfolioData?.name || "portfolio";
  const sanitizedName = personName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");

  const handleDownload = () => {
    const html = inlineEditing ? cleanHtml : editableHtml;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sanitizedName}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCode = () => {
    const html = inlineEditing ? cleanHtml : editableHtml;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sanitizedName}-source.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Source Code Downloaded", description: `Open "${sanitizedName}-source.html" in any code editor to customize further.` });
  };

  const handleFinalize = () => {
    if (inlineEditing) {
      setEditableHtml(cleanHtml);
      setInlineEditing(false);
    }
    setFinalized(true);
    const html = inlineEditing ? cleanHtml : editableHtml;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sanitizedName}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Portfolio Finalized", description: `Your edits have been saved and "${sanitizedName}.html" has been downloaded.` });
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
          <Button variant="secondary" size="sm" onClick={() => setViewMode("desktop")}>Exit Fullscreen</Button>
          <Button variant="default" size="sm" onClick={handleDownload}><Download className="w-4 h-4 mr-1" /> Download</Button>
        </div>
        <iframe srcDoc={editableHtml} className="w-full h-full border-0" title="Portfolio Preview" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
      
      <div className="pt-20 pb-16 container mx-auto px-4">
        {/* Top bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/themes"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Link>
            </Button>
            <h1 className="font-display text-lg sm:text-xl font-bold text-foreground">
              {portfolioData?.name || "Preview"} <span className="capitalize text-primary">{themeId}</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {!isRecruiter && (
              <>
                {!isMobile && (
                  <div className="flex bg-secondary rounded-lg p-1">
                    <button onClick={() => setViewMode("desktop")} className={`p-2 rounded-md transition-colors ${viewMode === "desktop" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}><Monitor className="w-4 h-4" /></button>
                    <button onClick={() => setViewMode("mobile")} className={`p-2 rounded-md transition-colors ${viewMode === "mobile" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}><Smartphone className="w-4 h-4" /></button>
                    <button onClick={() => setViewMode("fullscreen")} className="p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"><Maximize className="w-4 h-4" /></button>
                  </div>
                )}
                <Button variant={inlineEditing ? "default" : "outline"} size="sm" onClick={toggleInlineEditor}>
                  {inlineEditing ? <><Eye className="w-4 h-4 mr-1" /> Exit Edit</> : <><Pencil className="w-4 h-4 mr-1" /> Edit</>}
                </Button>
                {!isMobile && (
                  <Button variant="outline" size="sm" onClick={handleDownloadCode}>
                    <Code className="w-4 h-4 mr-1" /> Code
                  </Button>
                )}
                <Button variant="cta" size="sm" onClick={handleFinalize}>
                  <Check className="w-4 h-4 mr-1" /> {isMobile ? "Download" : "Finalize"}
                </Button>
              </>
            )}
            {isRecruiter && (
              <Button variant="outline" size="sm" onClick={handleDownloadReport} disabled={!analysis}>
                <FileText className="w-4 h-4 mr-1" /> Report
              </Button>
            )}
          </div>
        </motion.div>

        <div className="flex gap-4 justify-center">
          {/* Preview Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-5xl"
          >
            <div className={`bg-card rounded-2xl shadow-card-hover overflow-hidden transition-all duration-500 ${
              viewMode === "mobile" && !isMobile ? "w-[390px] h-[844px] mx-auto" : "w-full h-[80vh]"
            }`}>
              <div className="bg-secondary/50 px-4 py-2 flex items-center gap-2 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-accent/60" />
                  <div className="w-3 h-3 rounded-full bg-primary/40" />
                </div>
                <div className="flex-1 text-center text-xs text-muted-foreground font-body truncate">
                  {sanitizedName}.html {inlineEditing && <span className="text-primary font-semibold ml-1">Editing</span>}
                </div>
              </div>
              <iframe
                ref={iframeRef}
                srcDoc={inlineEditing ? injectEditor(editableHtml) : editableHtml}
                className="w-full border-0"
                style={{ height: "calc(100% - 36px)" }}
                title="Portfolio Preview"
              />
            </div>
          </motion.div>
        </div>

        {/* Recruiter Tech Stack Input & Analysis Panel */}
        {isRecruiter && portfolioData && (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 bg-card rounded-2xl border border-border p-6">
              <h4 className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5" /> Required Tech Stack (Optional)
              </h4>
              <p className="text-xs text-muted-foreground font-body mb-3">Add the tech stack your role requires. The analysis will show how well the candidate matches.</p>
              <TechStackInput selected={requiredTechStack} onChange={setRequiredTechStack} />
              {requiredTechStack.length > 0 && analysis && (
                <Button variant="outline" size="sm" className="mt-3" onClick={runAnalysis} disabled={isAnalyzing}>
                  {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                  Re-analyze with Tech Stack
                </Button>
              )}
            </motion.div>
            <RecruiterAnalysisPanel
              analysis={analysis}
              isAnalyzing={isAnalyzing}
              portfolioData={portfolioData}
              onReanalyze={runAnalysis}
              onDownloadReport={handleDownloadReport}
              requiredTechStack={requiredTechStack}
            />
          </>
        )}

        {/* Finalized banner */}
        {finalized && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-primary/10 border border-primary/20 rounded-xl p-4 text-center"
          >
            <p className="font-display font-semibold text-foreground">Portfolio Finalized</p>
            <p className="text-sm text-muted-foreground mt-1">Your file <code className="bg-secondary px-1.5 py-0.5 rounded text-xs">{sanitizedName}.html</code> has been downloaded.</p>
            <div className="flex gap-2 justify-center mt-3 flex-wrap">
              <Button variant="outline" size="sm" onClick={handleDownload}><Download className="w-4 h-4 mr-1" /> Download Again</Button>
              <Button variant="outline" size="sm" onClick={handleOpenInVSCode}><Code className="w-4 h-4 mr-1" /> Open in VS Code</Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PreviewPage;
