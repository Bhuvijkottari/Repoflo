import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { getThemeHtml } from "@/lib/themeTemplates";
import { injectEditor, stripEditor } from "@/lib/editorInjection";
import { Download, ArrowLeft, Smartphone, Monitor, Maximize, ImagePlus, Pencil, Check, X, Trash2, Plus, Code, Loader2, FileText, Eye, Edit3 } from "lucide-react";
import type { PortfolioData } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateReportHtml, type CandidateAnalysis } from "@/lib/generateReport";

const PreviewPage = () => {
  const { themeId } = useParams<{ themeId: string }>();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"desktop" | "mobile" | "fullscreen">("desktop");
  const [showEditor, setShowEditor] = useState(false);
  const [inlineEditing, setInlineEditing] = useState(false);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [editableHtml, setEditableHtml] = useState("");
  const [cleanHtml, setCleanHtml] = useState(""); // HTML without editor artifacts
  const [finalized, setFinalized] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Recruiter analysis state
  const [analysis, setAnalysis] = useState<CandidateAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const isRecruiter = themeId === "recruiter";

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("portfolioData");
      if (stored) setPortfolioData(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    if (portfolioData) {
      const html = getThemeHtml(themeId || "minimal", portfolioData);
      setEditableHtml(html);
      setCleanHtml(html);
    }
  }, [themeId, portfolioData]);

  // Listen for postMessage from inline editor
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === '__editor_update') {
        setCleanHtml(e.data.html);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // Auto-trigger analysis for recruiter theme
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
        body: { portfolioData },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setAnalysis(data as CandidateAnalysis);
    } catch (e: any) {
      toast({
        title: "Analysis Failed",
        description: e.message || "Could not generate candidate analysis.",
        variant: "destructive",
      });
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
    toast({
      title: "Report Downloaded",
      description: "Open the HTML file in any browser to view or print as PDF.",
    });
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
    toast({
      title: "Source Code Downloaded",
      description: `Open "${sanitizedName}-source.html" in any code editor to customize further.`,
    });
  };

  const handleFinalize = () => {
    if (inlineEditing) {
      // Apply inline edits back to the main HTML
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
    toast({
      title: "Portfolio Finalized",
      description: `Your edits have been saved and "${sanitizedName}.html" has been downloaded.`,
    });
  };

  const toggleInlineEditor = () => {
    if (!inlineEditing) {
      // Enter inline editing mode
      setInlineEditing(true);
      setShowEditor(false); // hide panel editor
    } else {
      // Exit inline editing, apply changes
      setEditableHtml(cleanHtml);
      setInlineEditing(false);
      toast({
        title: "Edits Applied",
        description: "Your inline changes have been saved to the preview.",
      });
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

  const badgeColor = (rec: string) => {
    switch (rec) {
      case "STRONG_HIRE": return "bg-green-600 text-white";
      case "HIRE": return "bg-blue-600 text-white";
      case "CONSIDER": return "bg-amber-500 text-white";
      case "PASS": return "bg-red-600 text-white";
      default: return "bg-muted text-foreground";
    }
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
      
      <div className="pt-24 pb-16 container mx-auto px-4">
        {/* Top bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/themes"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Link>
            </Button>
            <h1 className="font-display text-xl font-bold text-foreground">
              {portfolioData?.name || "Preview"} — <span className="capitalize text-primary">{themeId}</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex bg-secondary rounded-lg p-1">
              <button onClick={() => setViewMode("desktop")} className={`p-2 rounded-md transition-colors ${viewMode === "desktop" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}><Monitor className="w-4 h-4" /></button>
              <button onClick={() => setViewMode("mobile")} className={`p-2 rounded-md transition-colors ${viewMode === "mobile" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}><Smartphone className="w-4 h-4" /></button>
              <button onClick={() => setViewMode("fullscreen")} className="p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"><Maximize className="w-4 h-4" /></button>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowEditor(!showEditor)}>
              <Pencil className="w-4 h-4 mr-1" /> {showEditor ? "Hide Editor" : "Edit Content"}
            </Button>
            {isRecruiter && (
              <Button variant="outline" size="sm" onClick={handleDownloadReport} disabled={!analysis}>
                <FileText className="w-4 h-4 mr-1" /> Download Report
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleOpenInVSCode}>
              <Code className="w-4 h-4 mr-1" /> VS Code
            </Button>
            <Button variant="cta" size="sm" onClick={handleFinalize}>
              <Check className="w-4 h-4 mr-1" /> Finalize & Download
            </Button>
          </div>
        </motion.div>

        <div className={`flex gap-4 ${showEditor ? '' : 'justify-center'}`}>
          {/* Visual Editor Panel */}
          {showEditor && portfolioData && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-[400px] flex-shrink-0 overflow-y-auto max-h-[80vh] bg-card rounded-2xl border border-border p-5 space-y-6"
            >
              <h3 className="font-display font-bold text-foreground text-lg">Edit Your Portfolio</h3>

              {/* Photo */}
              <div className="space-y-2">
                <Label className="font-display font-semibold text-sm text-foreground">Profile Photo</Label>
                <div className="flex items-center gap-3">
                  {portfolioData.avatar ? (
                    <img src={portfolioData.avatar} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-border" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                      <ImagePlus className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <Button variant="outline" size="sm" onClick={() => photoInputRef.current?.click()}>
                      <ImagePlus className="w-4 h-4 mr-1" /> {portfolioData.avatar ? "Change" : "Upload"} Photo
                    </Button>
                    {portfolioData.avatar && (
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={removePhoto}>
                        <Trash2 className="w-3 h-3 mr-1" /> Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Full Name</Label>
                  <Input value={portfolioData.name} onChange={(e) => updateField("name", e.target.value)} className="h-9 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Title</Label>
                  <Input value={portfolioData.title} onChange={(e) => updateField("title", e.target.value)} className="h-9 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Bio</Label>
                  <textarea value={portfolioData.bio} onChange={(e) => updateField("bio", e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <Input value={portfolioData.email} onChange={(e) => updateField("email", e.target.value)} className="h-9 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Location</Label>
                    <Input value={portfolioData.location} onChange={(e) => updateField("location", e.target.value)} className="h-9 text-sm" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">LinkedIn URL</Label>
                  <Input value={portfolioData.linkedin} onChange={(e) => updateField("linkedin", e.target.value)} className="h-9 text-sm" placeholder="https://linkedin.com/in/..." />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Website</Label>
                  <Input value={portfolioData.website} onChange={(e) => updateField("website", e.target.value)} className="h-9 text-sm" placeholder="https://yoursite.com" />
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <Label className="font-display font-semibold text-sm text-foreground">Skills</Label>
                <div className="flex flex-wrap gap-1.5">
                  {portfolioData.skills.map((skill, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-secondary text-foreground px-2.5 py-1 rounded-full text-xs font-medium">
                      {skill}
                      <button onClick={() => removeSkill(i)} className="hover:text-destructive"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add skill" className="h-8 text-xs flex-1" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} />
                  <Button variant="outline" size="sm" onClick={addSkill} className="h-8 px-2"><Plus className="w-3 h-3" /></Button>
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-display font-semibold text-sm text-foreground">Experience</Label>
                  <Button variant="ghost" size="sm" onClick={addExperience} className="h-7 text-xs"><Plus className="w-3 h-3 mr-1" /> Add</Button>
                </div>
                {portfolioData.experience.map((exp, i) => (
                  <div key={i} className="bg-secondary/50 rounded-lg p-3 space-y-2 relative">
                    <button onClick={() => removeExperience(i)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
                    <Input value={exp.role} onChange={(e) => updateExperience(i, "role", e.target.value)} placeholder="Role" className="h-8 text-xs" />
                    <Input value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} placeholder="Company" className="h-8 text-xs" />
                    <Input value={exp.period} onChange={(e) => updateExperience(i, "period", e.target.value)} placeholder="2020 - 2024" className="h-8 text-xs" />
                    <textarea value={exp.description} onChange={(e) => updateExperience(i, "description", e.target.value)} placeholder="Description" className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs resize-none h-14 focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                ))}
              </div>

              {/* Education */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-display font-semibold text-sm text-foreground">Education</Label>
                  <Button variant="ghost" size="sm" onClick={addEducation} className="h-7 text-xs"><Plus className="w-3 h-3 mr-1" /> Add</Button>
                </div>
                {portfolioData.education.map((edu, i) => (
                  <div key={i} className="bg-secondary/50 rounded-lg p-3 space-y-2 relative">
                    <button onClick={() => removeEducation(i)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
                    <Input value={edu.degree} onChange={(e) => updateEducation(i, "degree", e.target.value)} placeholder="Degree" className="h-8 text-xs" />
                    <Input value={edu.institution} onChange={(e) => updateEducation(i, "institution", e.target.value)} placeholder="Institution" className="h-8 text-xs" />
                    <Input value={edu.period} onChange={(e) => updateEducation(i, "period", e.target.value)} placeholder="2016 - 2020" className="h-8 text-xs" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Preview Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={showEditor ? "flex-1 min-w-0" : "w-full max-w-5xl"}
          >
            <div className={`bg-card rounded-2xl shadow-card-hover overflow-hidden transition-all duration-500 ${
              viewMode === "mobile" ? "w-[390px] h-[844px] mx-auto" : "w-full h-[80vh]"
            }`}>
              <div className="bg-secondary/50 px-4 py-2 flex items-center gap-2 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-accent/60" />
                  <div className="w-3 h-3 rounded-full bg-primary/40" />
                </div>
                <div className="flex-1 text-center text-xs text-muted-foreground font-body">
                  {sanitizedName}.html
                </div>
              </div>
              <iframe
                srcDoc={editableHtml}
                className="w-full border-0"
                style={{ height: "calc(100% - 36px)" }}
                title="Portfolio Preview"
              />
            </div>
          </motion.div>
        </div>

        {/* Recruiter Analysis Panel */}
        {isRecruiter && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-card rounded-2xl border border-border p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg text-foreground">AI Candidate Analysis</h3>
              {analysis && (
                <Button variant="outline" size="sm" onClick={runAnalysis} disabled={isAnalyzing}>
                  {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                  Re-analyze
                </Button>
              )}
            </div>

            {isAnalyzing && !analysis && (
              <div className="flex items-center justify-center py-12 gap-3 text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="font-body">Analyzing candidate profile with AI...</span>
              </div>
            )}

            {analysis && (
              <div className="space-y-6">
                {/* Top row: recommendation + score */}
                <div className="flex flex-wrap gap-6 items-start">
                  <div>
                    <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">Recommendation</span>
                    <div className="mt-1">
                      <span className={`inline-block px-4 py-2 rounded-lg font-display font-bold text-sm ${badgeColor(analysis.recommendation)}`}>
                        {analysis.recommendation.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">Confidence</span>
                    <div className="mt-1 font-display text-2xl font-bold text-foreground">{analysis.confidence}%</div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">Overall Score</span>
                    <div className="mt-1 font-display text-2xl font-bold text-foreground">{analysis.overallScore}/100</div>
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">Executive Summary</span>
                  <p className="mt-1 text-sm text-foreground font-body leading-relaxed">{analysis.summary}</p>
                </div>

                {/* Strengths & Concerns */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">Key Strengths</span>
                    <ul className="mt-2 space-y-1.5">
                      {analysis.strengths?.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm font-body text-foreground">
                          <span className="text-green-600 mt-0.5 font-bold">+</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">Concerns</span>
                    <ul className="mt-2 space-y-1.5">
                      {analysis.concerns?.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm font-body text-foreground">
                          <span className="text-red-600 mt-0.5 font-bold">-</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* GitHub Insights */}
                <div>
                  <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">GitHub Insights</span>
                  <div className="grid md:grid-cols-2 gap-3 mt-2">
                    {analysis.githubInsights && Object.entries(analysis.githubInsights).map(([key, val]) => (
                      <div key={key} className="bg-secondary/50 rounded-lg p-3">
                        <span className="text-xs font-display font-semibold text-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <p className="text-xs text-muted-foreground mt-1 font-body">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hiring Notes */}
                <div>
                  <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">Hiring Manager Notes</span>
                  <p className="mt-1 text-sm text-foreground font-body leading-relaxed bg-secondary/30 rounded-lg p-4">{analysis.hiringNotes}</p>
                </div>

                <div className="pt-2">
                  <Button variant="cta" onClick={handleDownloadReport}>
                    <Download className="w-4 h-4 mr-2" /> Download Full Report
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
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
            <div className="flex gap-2 justify-center mt-3">
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
