import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Upload, ArrowRight, FileText, CheckCircle2, AlertCircle, Loader2, Code2, Briefcase, Search, Shield } from "lucide-react";
import TechStackInput from "@/components/TechStackInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import PreviewPage from "./PreviewPage";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { signInWithGoogle, signOutUser, updateRecruiterUsage, checkRecruiterLimit, addRecruiterHistory, fetchRecruiterHistory, storeCandidateAnalysis } from "@/lib/firebase";
import type { PortfolioData } from "@/lib/mockData";

const RecruiterPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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

  // Auto-fetch GitHub data when URL changes
  useEffect(() => {
    const match = githubUrl.match(/github\.com\/([^\/\?#]+)/);
    if (!match) {
      setGithubData(null);
      setGithubError("");
      return;
    }
    const timer = setTimeout(async () => {
      setGithubFetching(true);
      setGithubError("");
      try {
        const { data, error } = await supabase.functions.invoke("fetch-github", { body: { githubUrl } });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        setGithubData(data as PortfolioData);
      } catch (e: any) {
        setGithubError(e.message || "Failed to fetch GitHub data");
        setGithubData(null);
      } finally {
        setGithubFetching(false);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [githubUrl]);

  // Auto-fetch LeetCode data when username changes
  useEffect(() => {
    if (!leetcodeUsername.trim()) {
      setLeetcodeData(null);
      setLeetcodeError("");
      return;
    }
    const fetchLeetcode = async () => {
      setLeetcodeFetching(true);
      setLeetcodeError("");
      try {
        const { data, error } = await supabase.functions.invoke("fetch-leetcode", { body: { username: leetcodeUsername } });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        setLeetcodeData(data);
      } catch (e: any) {
        setLeetcodeError(e.message);
        setLeetcodeData(null);
      } finally {
        setLeetcodeFetching(false);
      }
    };
    fetchLeetcode();
  }, [leetcodeUsername]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!githubData) return;
    setIsProcessing(true);
    try {
      let finalData: PortfolioData = { ...githubData };

      // Attach LeetCode stats
      if (leetcodeData) {
        finalData.leetcodeStats = leetcodeData;
      }

      // Store recruiter preferences in session for PreviewPage
      sessionStorage.setItem("recruiterPrefs", JSON.stringify({
        requiredTechStack,
        experienceLevel,
      }));

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

      setStatus("Generating analysis...");
      sessionStorage.setItem("portfolioData", JSON.stringify(finalData));

      // Update usage count
      await updateRecruiterUsage(user.email!);

      // Store candidate data in database
      const candidateId = await storeCandidateAnalysis({
        githubUsername: githubData.githubStats?.username || '',
        leetcodeUsername: leetcodeData?.username,
        name: githubData.name,
        portfolioData: finalData,
        analysis: null, // will be updated when analysis is generated
        recruiterEmail: user.email!,
      });

      // Store candidate ID for later update
      sessionStorage.setItem("candidateId", candidateId);

      // persist history entry before preview
      const historyId = await addRecruiterHistory(user.email!, {
        portfolioData: finalData,
        analysis: null, // will fetch once preview loads
        createdAt: new Date().toISOString(),
        candidateId, // reference to the candidate document
      });

      // Store history ID for later update
      sessionStorage.setItem("historyId", historyId);

      // stay on recruiter route and show preview panel
      navigate(`/recruiter?preview=1`);
    } catch (e: any) {
      toast({ title: "Error processing data", description: e.message || "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
      setStatus("");
    }
  };

  // if preview flag set, render the preview page directly under /recruiter
  if (showPreview) {
    return <PreviewPage overrideThemeId="recruiter" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Recruiter Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                AI-powered candidate analysis
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 pb-16 container mx-auto px-4 max-w-xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-display font-semibold mb-4">
            <Shield className="w-4 h-4" /> Candidate Analysis
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-3">Analyze Candidate</h1>
          <p className="text-muted-foreground font-body">
            Provide candidate's GitHub profile, LeetCode username, and resume for AI-powered assessment.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-8 bg-card rounded-2xl p-8 shadow-card"
        >
          {/* GitHub URL */}
          <div className="space-y-3">
            <Label className="font-display font-semibold flex items-center gap-2 text-foreground">
              <Github className="w-5 h-5 text-primary" /> Candidate GitHub Profile URL
            </Label>
            <Input type="url" placeholder="https://github.com/candidateusername" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} required className="h-12 text-base" />
            {githubFetching && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Fetching candidate's GitHub profile...</div>
            )}
            {githubError && (
              <div className="flex items-center gap-2 text-sm text-destructive"><AlertCircle className="w-4 h-4" /> {githubError}</div>
            )}
            {githubData && !githubFetching && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                <img src={githubData.avatar} alt={githubData.name} className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-display font-semibold text-sm text-foreground">{githubData.name}</p>
                  <p className="text-xs text-muted-foreground">{githubData.title} · {githubData.githubStats?.publicRepos || 0} repos · {githubData.skills.slice(0, 4).join(", ")}</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />
              </motion.div>
            )}
          </div>

          {/* LeetCode Username */}
          <div className="space-y-3">
            <Label className="font-display font-semibold flex items-center gap-2 text-foreground">
              <Code2 className="w-5 h-5 text-accent" /> Candidate LeetCode Username
              <span className="text-muted-foreground font-normal text-xs ml-1">(for coding assessment)</span>
            </Label>
            <Input type="text" placeholder="candidate_leetcode_username" value={leetcodeUsername} onChange={(e) => setLeetcodeUsername(e.target.value)} className="h-12 text-base" />
            {leetcodeFetching && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Fetching LeetCode profile...</div>
            )}
            {leetcodeError && (
              <div className="flex items-center gap-2 text-sm text-destructive"><AlertCircle className="w-4 h-4" /> {leetcodeError}</div>
            )}
            {leetcodeData && !leetcodeFetching && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-3 bg-accent/10 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-display font-semibold text-sm text-foreground">{leetcodeData.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {leetcodeData.totalSolved} solved · Easy {leetcodeData.easySolved} · Med {leetcodeData.mediumSolved} · Hard {leetcodeData.hardSolved}
                  </p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-accent ml-auto" />
              </motion.div>
            )}
          </div>

          {/* Recruiter Preferences */}
          <div className="space-y-5">
            {/* Required Tech Stack */}
            <div className="space-y-3">
              <Label className="font-display font-semibold flex items-center gap-2 text-foreground">
                <Search className="w-5 h-5 text-primary" /> Required Tech Stack
                <span className="text-muted-foreground font-normal text-xs ml-1">(optional — AI will compare)</span>
              </Label>
              <TechStackInput selected={requiredTechStack} onChange={setRequiredTechStack} />
              {requiredTechStack.length > 0 && (
                <p className="text-xs text-muted-foreground font-body">
                  {requiredTechStack.length} technolog{requiredTechStack.length === 1 ? "y" : "ies"} selected — AI will evaluate the candidate's match.
                </p>
              )}
            </div>

            {/* Experience Level */}
            <div className="space-y-3">
              <Label className="font-display font-semibold flex items-center gap-2 text-foreground">
                <Briefcase className="w-5 h-5 text-primary" /> Experience Level
                <span className="text-muted-foreground font-normal text-xs ml-1">(optional — hiring preference)</span>
              </Label>
              <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Any experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Level</SelectItem>
                  <SelectItem value="intern">Intern</SelectItem>
                  <SelectItem value="fresher">Fresher / Just Graduated</SelectItem>
                  <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                  <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                  <SelectItem value="senior">Senior (5-8 years)</SelectItem>
                  <SelectItem value="staff">Staff / Lead (8+ years)</SelectItem>
                  <SelectItem value="principal">Principal / Architect (10+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Resume Upload */}
          <div className="space-y-3">
            <Label className="font-display font-semibold flex items-center gap-2 text-foreground">
              <FileText className="w-5 h-5 text-primary" /> Candidate Resume — <span className="text-muted-foreground font-normal text-xs">enriches experience & education</span>
            </Label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-secondary/30 transition-colors">
              {resumeFile ? (
                <div className="flex items-center gap-2 text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-body text-sm">{resumeFile.name}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-muted-foreground">
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="font-body text-sm">Click to upload candidate resume</span>
                  <span className="font-body text-xs mt-1">PDF, DOC, TXT up to 10MB</span>
                </div>
              )}
              <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
            </label>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isProcessing || !githubData}>
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
