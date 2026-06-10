import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download, Loader2, Bot, GitFork, Star, AlertTriangle, TrendingUp,
  Award, Brain, Target, Zap, Shield, BookOpen, Code2, Briefcase,
  CheckCircle2, XCircle, ChevronRight,
} from "lucide-react";
import type { CandidateAnalysis } from "@/lib/generateReport";
import type { PortfolioData } from "@/lib/mockData";

interface Props {
  analysis: CandidateAnalysis | null;
  isAnalyzing: boolean;
  portfolioData: PortfolioData;
  onReanalyze: () => void;
  onDownloadReport: () => void;
  onDownloadPDF: () => void;
  onGenerateReport: () => void;
  requiredTechStack?: string[];
}

/* ── Animation preset ──────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-30px" },
  transition: { duration: 0.5, ease: "easeOut", delay },
});

/* ── Card shell ────────────────────────────────────────── */
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-card border border-border rounded-2xl overflow-hidden ${className}`}>
    {children}
  </div>
);

/* ── Card header band ──────────────────────────────────── */
const CardHeader = ({
  icon: Icon, title, subtitle,
}: { icon: any; title: string; subtitle?: string }) => (
  <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/30">
    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
      <Icon className="w-4.5 h-4.5 text-primary" />
    </div>
    <div>
      <p className="text-base font-semibold text-foreground tracking-wide">{title}</p>
      {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

/* ── Circular gauge ────────────────────────────────────── */
const CircularGauge = ({
  value, size = 120, strokeWidth = 10, color, label,
}: { value: number; size?: number; strokeWidth?: number; color: string; label: string }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke="hsl(var(--secondary))" strokeWidth={strokeWidth} />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-bold text-2xl text-foreground">{value}</span>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground text-center">{label}</span>
    </div>
  );
};

/* ── Progress bar row ──────────────────────────────────── */
const ScoreBar = ({ label, value, icon: Icon }: { label: string; value: number; icon: any }) => {
  const barColor = value >= 75 ? "bg-emerald-500" : value >= 50 ? "bg-amber-500" : "bg-red-500";
  const textColor = value >= 75 ? "text-emerald-600" : value >= 50 ? "text-amber-600" : "text-red-500";
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-base text-muted-foreground font-medium">
          <Icon className="w-4 h-4" /> {label}
        </span>
        <span className={`text-base font-bold ${textColor}`}>{value}%</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

/* ── LeetCode donut ────────────────────────────────────── */
const LeetCodeDonut = ({ easy, medium, hard }: { easy: number; medium: number; hard: number }) => {
  const total = easy + medium + hard;
  if (total === 0) return null;
  const easyPct = (easy / total) * 100;
  const medPct = (medium / total) * 100;
  const hardPct = (hard / total) * 100;
  return (
    <div className="flex items-center gap-8">
      <div className="relative w-[120px] h-[120px] flex-shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(var(--secondary))" strokeWidth="3.5" />
          <motion.circle cx="18" cy="18" r="14" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round"
            strokeDasharray={`${easyPct * 0.88} ${88 - easyPct * 0.88}`} strokeDashoffset="0"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} />
          <motion.circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round"
            strokeDasharray={`${medPct * 0.88} ${88 - medPct * 0.88}`} strokeDashoffset={`${-easyPct * 0.88}`}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }} />
          <motion.circle cx="18" cy="18" r="14" fill="none" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round"
            strokeDasharray={`${hardPct * 0.88} ${88 - hardPct * 0.88}`} strokeDashoffset={`${-(easyPct + medPct) * 0.88}`}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-bold text-xl text-foreground">{total}</span>
          <span className="text-xs text-muted-foreground">solved</span>
        </div>
      </div>
      <div className="space-y-3 flex-1">
        {[
          { label: "Easy", count: easy, dot: "bg-emerald-500", pct: easyPct },
          { label: "Medium", count: medium, dot: "bg-amber-500", pct: medPct },
          { label: "Hard", count: hard, dot: "bg-red-500", pct: hardPct },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${item.dot}`} />
            <span className="text-base text-muted-foreground w-16 font-medium">{item.label}</span>
            <span className="font-bold text-base text-foreground">{item.count}</span>
            <span className="text-sm text-muted-foreground ml-auto">{item.pct.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Verdict helpers ───────────────────────────────────── */
const verdictBg = (score: number) => {
  if (score >= 90) return "bg-emerald-600";
  if (score >= 80) return "bg-emerald-500";
  if (score >= 70) return "bg-blue-600";
  if (score >= 60) return "bg-amber-500";
  if (score >= 50) return "bg-orange-500";
  return "bg-red-600";
};

/* ── Stat pill ─────────────────────────────────────────── */
const StatPill = ({ icon: Icon, label, value }: { icon: any; label: string; value: any }) => (
  <div className="flex flex-col items-center gap-1 bg-secondary/60 rounded-xl px-5 py-4 flex-1 min-w-[90px]">
    <Icon className="w-4 h-4 text-primary mb-0.5" />
    <span className="font-bold text-lg text-foreground">{value}</span>
    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide text-center">{label}</span>
  </div>
);

/* ════════════════════════════════════════════════════════ */
const RecruiterAnalysisPanel = ({
  analysis, isAnalyzing, portfolioData, onReanalyze,onGenerateReport,onDownloadReport,onDownloadPDF, requiredTechStack = [],
}: Props) => {
  const d = portfolioData;
  const s = d.githubStats;
  const lc = d.leetcodeStats;

  return (
    <div className="mt-8 space-y-5">

      {/* ══ HEADER ══════════════════════════════════════════ */}
      <motion.div {...fadeUp(0)}>
        <Card>
          <div className="flex items-center justify-between px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">AI Candidate Analysis</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Comprehensive AI-powered evaluation with graphical insights
                </p>
              </div>
            </div>
            {isAnalyzing && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                Analysing…
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* ══ LOADING ═════════════════════════════════════════ */}
      {isAnalyzing && !analysis && (
        <motion.div {...fadeUp(0.1)}>
          <Card>
            <div className="flex flex-col items-center justify-center py-20 gap-5">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <div className="text-center space-y-1">
                <p className="font-semibold text-lg text-foreground">Analyzing candidate profile…</p>
                <p className="text-sm text-muted-foreground">
                  GitHub activity · ATS compatibility · LeetCode performance · Project authenticity
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {analysis && (
        <>
          {/* ══ VERDICT + SCORE GAUGES ══════════════════════════ */}
          <motion.div {...fadeUp(0.05)}>
            <Card>
              <CardHeader icon={Target} title="Overall Recommendation" />
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">

                {/* Verdict */}
                <div className="flex flex-col items-center justify-center gap-4 p-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${verdictBg(analysis.overallScore)}`}>
                    {analysis.overallScore >= 80 ? "🌟" : analysis.overallScore >= 60 ? "👍" : "⚠️"}
                  </div>
                  <div className="text-center space-y-1.5">
                    <p className={`inline-block px-5 py-2 rounded-xl font-bold text-base text-white ${verdictBg(analysis.overallScore)}`}>
                      {analysis.verdict}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Score: <strong className="text-foreground">{analysis.overallScore}/100</strong>
                    </p>
                  </div>
                </div>

                {/* Overall gauge */}
                <div className="flex items-center justify-center p-8">
                  <CircularGauge value={analysis.overallScore} size={130} strokeWidth={12}
                    color="hsl(var(--primary))" label="Overall Score" />
                </div>

                {/* ATS gauge */}
                {analysis.atsScore ? (
                  <div className="flex items-center justify-center p-8">
                    <CircularGauge
                      value={analysis.atsScore.overall} size={130} strokeWidth={12}
                      color={analysis.atsScore.overall >= 70 ? "#22c55e" : analysis.atsScore.overall >= 50 ? "#f59e0b" : "#ef4444"}
                      label="ATS Resume Score"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-8 text-sm text-muted-foreground">
                    No ATS data
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* ══ EXECUTIVE SUMMARY ═══════════════════════════════ */}
          <motion.div {...fadeUp(0.08)}>
            <Card>
              <CardHeader icon={BookOpen} title="Executive Summary" />
              <div className="px-6 py-5">
                <p className="text-base text-foreground leading-relaxed">{analysis.summary}</p>
              </div>
            </Card>
          </motion.div>

          {/* ══ STRENGTHS + CONCERNS ════════════════════════════ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <motion.div {...fadeUp(0.1)}>
              <Card className="h-full">
                <CardHeader icon={TrendingUp} title="Key Strengths" />
                <ul className="px-6 py-5 space-y-3">
                  {analysis.strengths?.map((str, i) => (
                    <motion.li key={i}
                      initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.3 }}
                      className="flex items-start gap-3 text-sm text-foreground"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-base leading-relaxed">{str}</span>
                    </motion.li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            <motion.div {...fadeUp(0.12)}>
              <Card className="h-full">
                <CardHeader icon={AlertTriangle} title="Concerns" />
                <ul className="px-6 py-5 space-y-3">
                  {analysis.concerns?.map((c, i) => (
                    <motion.li key={i}
                      initial={{ opacity: 0, x: 8 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.3 }}
                      className="flex items-start gap-3 text-sm text-foreground"
                    >
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-base leading-relaxed">{c}</span>
                    </motion.li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          </div>

          {/* ══ TECH STACK MATCH ════════════════════════════════ */}
          {requiredTechStack.length > 0 && (
            <motion.div {...fadeUp(0.1)}>
              <Card>
                <CardHeader icon={Target} title="Tech Stack Match" subtitle="Required vs. candidate skills" />
                <div className="px-6 py-5">
                  {(() => {
                    const candidateSkills = d.skills.map((sk) => sk.toLowerCase());
                    const candidateLangs = s?.topLanguages?.map((l) => l.name.toLowerCase()) || [];
                    const projectTechs = d.projects.flatMap((p) => p.tech.map((t) => t.toLowerCase()));
                    const allCandidate = new Set([...candidateSkills, ...candidateLangs, ...projectTechs]);
                    const matched = requiredTechStack.filter((t) => allCandidate.has(t.toLowerCase()));
                    const missing = requiredTechStack.filter((t) => !allCandidate.has(t.toLowerCase()));
                    const matchPct = Math.round((matched.length / requiredTechStack.length) * 100);
                    const gaugeColor = matchPct >= 75 ? "#22c55e" : matchPct >= 50 ? "#f59e0b" : "#ef4444";
                    return (
                      <div className="space-y-5">
                        <div className="flex items-center gap-6">
                          <CircularGauge value={matchPct} size={96} strokeWidth={9} color={gaugeColor} label="Match Rate" />
                          <div className="flex-1 space-y-1">
                            <p className="font-semibold text-base text-foreground">
                              {matched.length} of {requiredTechStack.length} technologies matched
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {matchPct >= 75 ? "Strong match for this role." : matchPct >= 50 ? "Partial match — some gaps to address." : "Significant skill gaps detected."}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">✓ Matched</p>
                            <div className="flex flex-wrap gap-1.5">
                              {matched.length > 0 ? matched.map((t) => (
                                <Badge key={t} className="text-sm bg-emerald-500/10 text-emerald-700 border border-emerald-400/30 px-3 py-1">{t}</Badge>
                              )) : <span className="text-base text-muted-foreground">None matched</span>}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-red-500 uppercase tracking-wider">✗ Missing</p>
                            <div className="flex flex-wrap gap-1.5">
                              {missing.length > 0 ? missing.map((t) => (
                                <Badge key={t} variant="outline" className="text-sm border-red-400/30 text-red-600 bg-red-500/10 px-3 py-1">{t}</Badge>
                              )) : <span className="text-base text-muted-foreground">None — full match! 🎉</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </Card>
            </motion.div>
          )}

          {/* ══ EXPERIENCE LEVEL MATCH ══════════════════════════ */}
          {analysis.experienceLevelMatch && (
            <motion.div {...fadeUp(0.1)}>
              <Card>
                <CardHeader icon={Briefcase} title="Experience Level Match" />
                <div className="px-6 py-5 flex items-start gap-5">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${analysis.experienceLevelMatch.isMatch ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                    {analysis.experienceLevelMatch.isMatch ? "✅" : "⚠️"}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge className={`text-sm px-3 py-1 ${analysis.experienceLevelMatch.isMatch ? "bg-emerald-500/10 text-emerald-700 border-emerald-400/30" : "bg-red-500/10 text-red-600 border-red-400/30"}`}>
                        Required: {analysis.experienceLevelMatch.required}
                      </Badge>
                      <Badge variant="outline" className="text-sm px-3 py-1">
                        Assessed: {analysis.experienceLevelMatch.assessed}
                      </Badge>
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed">{analysis.experienceLevelMatch.explanation}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* ══ ATS SCORE BREAKDOWN ═════════════════════════════ */}
          {analysis.atsScore && (
            <motion.div {...fadeUp(0.1)}>
              <Card>
                <CardHeader icon={Shield} title="ATS Resume Score Breakdown" subtitle="Applicant tracking system compatibility" />
                <div className="px-6 py-5 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
                    <ScoreBar label="Keywords Match" value={analysis.atsScore.keywordScore} icon={Zap} />
                    <ScoreBar label="Format & Structure" value={analysis.atsScore.formatScore} icon={BookOpen} />
                    <ScoreBar label="Experience Relevance" value={analysis.atsScore.experienceScore} icon={TrendingUp} />
                    <ScoreBar label="Education" value={analysis.atsScore.educationScore} icon={Award} />
                    <ScoreBar label="Skills Coverage" value={analysis.atsScore.skillsScore} icon={Code2} />
                  </div>
                  {analysis.atsScore.suggestions?.length > 0 && (
                    <div className="bg-amber-500/5 border border-amber-400/20 rounded-xl p-4 space-y-3">
                      <p className="text-base font-semibold text-foreground flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" /> Improvement Tips
                      </p>
                      <ul className="space-y-2">
                        {analysis.atsScore.suggestions.map((tip: string, i: number) => (
                          <li key={i} className="flex items-start gap-2.5 text-base text-muted-foreground">
                            <ChevronRight className="w-4 h-4 text-amber-500 flex-shrink-0 mt-1" />
                            <span className="leading-relaxed">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* ══ LEETCODE PERFORMANCE ════════════════════════════ */}
          {(analysis.leetcodeInsights || lc) && (
            <motion.div {...fadeUp(0.1)}>
              <Card>
                <CardHeader icon={Code2} title="LeetCode Performance" subtitle="Problem-solving track record" />
                <div className="px-6 py-5 space-y-6">
                  {lc && (
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                      {lc.totalSolved > 0 && (
                        <LeetCodeDonut easy={lc.easySolved} medium={lc.mediumSolved} hard={lc.hardSolved} />
                      )}
                      <div className="flex flex-wrap gap-3 flex-1">
                        <StatPill icon={Award} label="Ranking" value={lc.ranking ? `#${lc.ranking.toLocaleString()}` : "N/A"} />
                        <StatPill icon={TrendingUp} label="Contest Rating" value={lc.contestRating || "N/A"} />
                        <StatPill icon={Target} label="Contests" value={lc.totalContests} />
                        <StatPill icon={Zap} label="Total Solved" value={lc.totalSolved} />
                      </div>
                    </div>
                  )}
                  {analysis.leetcodeInsights && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-border">
                      {Object.entries(analysis.leetcodeInsights).map(([key, val]) => (
                        <div key={key} className="bg-secondary/30 rounded-xl p-4 space-y-1.5">
                          <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </p>
                          <p className="text-base text-muted-foreground leading-relaxed">{val as string}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {!lc && !analysis.leetcodeInsights && (
                    <p className="text-sm text-muted-foreground">No LeetCode data available.</p>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* ══ GITHUB INSIGHTS ═════════════════════════════════ */}
          <motion.div {...fadeUp(0.1)}>
            <Card>
              <CardHeader icon={GitFork} title="GitHub Insights" subtitle="Activity & contribution patterns" />
              <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {analysis.githubInsights && Object.entries(analysis.githubInsights).map(([key, val]) => (
                  <div key={key} className="bg-secondary/30 rounded-xl p-4 space-y-1.5 border border-border/40 hover:border-border transition-colors">
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p className="text-base text-muted-foreground leading-relaxed">{val}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* ══ PROJECT AUTHENTICITY ════════════════════════════ */}
          <motion.div {...fadeUp(0.1)}>
            <Card>
              <CardHeader icon={Code2} title="Project Authenticity" subtitle="AI-generated code & originality signals" />
              <div className="px-6 py-5 space-y-3">
                {d.projects.map((p, i) => {
                  const isAiGenerated = analysis.inferredProjectDescriptions?.[p.name];
                  const isAiBuilt = (p as any).isAiGenerated || s?.aiDetectedRepos?.includes(p.name);
                  const noDesc = p.description === "No description provided" || !p.description;
                  const hasCommonTemplate = ["todo", "calculator", "weather"].some((kw) => p.name.toLowerCase().includes(kw));
                  const lowStars = p.stars <= 0 && d.projects.length > 3;
                  const flags: string[] = [];
                  if (noDesc) flags.push("No description");
                  if (hasCommonTemplate) flags.push("Common template");
                  if (lowStars) flags.push("No stars");

                  return (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.04, duration: 0.3 }}
                      className={`rounded-xl border p-4 space-y-2.5 transition-all ${
                        isAiBuilt
                          ? "bg-red-500/5 border-red-400/40 ring-1 ring-red-400/20"
                          : "bg-secondary/20 border-border/50"
                      }`}
                    >
                      {/* Title row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-semibold text-base ${isAiBuilt ? "text-red-600" : "text-foreground"}`}>
                          {p.name}
                        </span>
                        {p.stars > 0 && (
                          <span className="flex items-center gap-1 text-sm text-amber-500">
                            <Star className="w-3.5 h-3.5" /> {p.stars}
                          </span>
                        )}
                        {p.link && (
                          <a href={p.link} target="_blank" rel="noopener noreferrer"
                            className="ml-auto flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 bg-primary/8 border border-primary/20 hover:border-primary/50 px-2.5 py-1 rounded-lg transition-all">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                            </svg>
                            Inspect
                          </a>
                        )}
                        {isAiBuilt && (
                          <Badge className="text-xs bg-red-600 text-white border-0 px-2.5 py-1">
                            <Bot className="w-3 h-3 mr-1" /> AI-Built
                          </Badge>
                        )}
                        {!isAiBuilt && flags.length > 0 && (
                          <Badge variant="outline" className="text-xs border-amber-400/40 text-amber-600 bg-amber-500/8 px-2.5 py-1">
                            <AlertTriangle className="w-3 h-3 mr-1" /> Review
                          </Badge>
                        )}
                        {isAiGenerated && !isAiBuilt && (
                          <Badge variant="outline" className="text-xs border-blue-400/40 text-blue-600 bg-blue-500/8 px-2.5 py-1">
                            <Bot className="w-3 h-3 mr-1" /> AI-Inferred Desc
                          </Badge>
                        )}
                      </div>
                      {isAiBuilt && (
                        <p className="text-sm text-red-500 font-medium flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                          Appears built with AI tools (Lovable, Bolt, Cursor, etc.)
                        </p>
                      )}
                      <p className="text-base text-muted-foreground leading-relaxed">
                        {isAiGenerated ? (isAiGenerated as string) : p.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {p.tech.map((t) => (
                          <span key={t} className="text-sm bg-background border border-border/60 px-2.5 py-1 rounded-md text-muted-foreground">
                            {t}
                          </span>
                        ))}
                      </div>
                      {!isAiBuilt && flags.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {flags.map((f) => (
                            <span key={f} className="text-sm bg-amber-500/8 text-amber-600 border border-amber-400/20 px-2.5 py-1 rounded-md font-medium">
                              {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {s && s.aiGeneratedContent > 0 && (
                  <div className="mt-2 bg-red-500/5 border border-red-400/30 rounded-xl p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="font-semibold text-red-600 text-base">⚠️ AI-Built Repositories Detected</p>
                      <p className="text-base text-red-600/80 leading-relaxed">
                        <strong>{s.aiGeneratedContent}</strong> {s.aiGeneratedContent === 1 ? "repository" : "repositories"} appear built with AI coding tools. These may not reflect actual coding ability.{" "}
                        <strong>Verify during technical interviews.</strong>
                      </p>
                      {s.aiDetectedRepos?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {s.aiDetectedRepos.map((repo: string) => (
                            <Badge key={repo} className="text-sm bg-red-600 text-white border-0 px-3 py-1">{repo}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* ══ TECHNICAL ASSESSMENT ════════════════════════════ */}
          <motion.div {...fadeUp(0.1)}>
            <Card>
              <CardHeader icon={Zap} title="Technical Assessment" />
              <div className="px-6 py-5 space-y-4">
                <div className="flex flex-wrap gap-4">
                  <div className="bg-secondary/50 rounded-xl px-5 py-4 space-y-1">
                    <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium">Primary Stack</p>
                    <p className="font-bold text-lg text-foreground">{analysis.technicalAssessment.primaryStack}</p>
                  </div>
                  <div className="bg-secondary/50 rounded-xl px-5 py-4 space-y-1">
                    <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium">Experience Level</p>
                    <p className="font-bold text-lg text-foreground">{analysis.technicalAssessment.experienceLevel}</p>
                  </div>
                </div>
                {analysis.technicalAssessment.specializations.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium">Specializations</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.technicalAssessment.specializations.map((sp) => (
                        <Badge key={sp} className="text-sm px-3 py-1">{sp}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* ══ HIRING MANAGER NOTES ════════════════════════════ */}
          <motion.div {...fadeUp(0.1)}>
            <Card>
              <CardHeader icon={BookOpen} title="Hiring Manager Notes" />
              <div className="px-6 py-5">
                <p className="text-base text-foreground leading-relaxed">{analysis.hiringNotes}</p>
              </div>
            </Card>
          </motion.div>

          {/* ══ DOWNLOAD CTA ════════════════════════════════════ */}
          <motion.div {...fadeUp(0.1)} className="flex justify-center py-4">
            <div className="flex gap-3">
              <Button onClick={onDownloadReport} className="bg-white text-black hover:bg-gray-100 font-semibold">
                <Download className="w-4 h-4 mr-1.5" /> Download HTML
              </Button>
              <Button onClick={onDownloadPDF} className="bg-white text-black hover:bg-gray-100 font-semibold">
                <Download className="w-4 h-4 mr-1.5" /> Download PDF
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default RecruiterAnalysisPanel;
