import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Loader2, Bot, GitFork, Star, AlertTriangle, TrendingUp, Award, Brain, Target, Zap, Shield, BookOpen, Code2 } from "lucide-react";
import type { CandidateAnalysis } from "@/lib/generateReport";
import type { PortfolioData } from "@/lib/mockData";

interface Props {
  analysis: CandidateAnalysis | null;
  isAnalyzing: boolean;
  portfolioData: PortfolioData;
  onReanalyze: () => void;
  onDownloadReport: () => void;
  requiredTechStack?: string[];
}

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const CircularGauge = ({ value, size = 100, strokeWidth = 8, color, label }: { value: number; size?: number; strokeWidth?: number; color: string; label: string }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--secondary))" strokeWidth={strokeWidth} />
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
          <span className="font-display text-lg font-bold text-foreground">{value}</span>
        </div>
      </div>
      <span className="text-[11px] text-muted-foreground font-body text-center leading-tight">{label}</span>
    </div>
  );
};

const ScoreBar = ({ label, value, icon: Icon }: { label: string; value: number; icon: any }) => {
  const color = value >= 75 ? "bg-green-500" : value >= 50 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-muted-foreground font-body">
          <Icon className="w-3.5 h-3.5" /> {label}
        </span>
        <span className="font-display font-bold text-foreground">{value}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />
      </div>
    </div>
  );
};

const LeetCodeDonut = ({ easy, medium, hard }: { easy: number; medium: number; hard: number }) => {
  const total = easy + medium + hard;
  if (total === 0) return null;
  const easyPct = (easy / total) * 100;
  const medPct = (medium / total) * 100;
  const hardPct = (hard / total) * 100;

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-[120px] h-[120px]">
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
          <span className="font-display text-xl font-bold text-foreground">{total}</span>
          <span className="text-[9px] text-muted-foreground">solved</span>
        </div>
      </div>
      <div className="space-y-2">
        {[
          { label: "Easy", count: easy, color: "bg-green-500", pct: easyPct },
          { label: "Medium", count: medium, color: "bg-amber-500", pct: medPct },
          { label: "Hard", count: hard, color: "bg-red-500", pct: hardPct },
        ].map(d => (
          <div key={d.label} className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${d.color}`} />
            <div className="w-14 text-xs font-body text-muted-foreground">{d.label}</div>
            <span className="font-display font-bold text-sm text-foreground">{d.count}</span>
            <span className="text-[10px] text-muted-foreground">({d.pct.toFixed(0)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
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

const recEmoji = (rec: string) => {
  switch (rec) {
    case "STRONG_HIRE": return "🟢";
    case "HIRE": return "🔵";
    case "CONSIDER": return "🟡";
    case "PASS": return "🔴";
    default: return "⚪";
  }
};

const RecruiterAnalysisPanel = ({ analysis, isAnalyzing, portfolioData, onReanalyze, onDownloadReport, requiredTechStack = [] }: Props) => {
  const d = portfolioData;
  const s = d.githubStats;
  const lc = d.leetcodeStats;

  return (
    <div className="mt-6 space-y-6">
      {/* Header */}
      <motion.div {...fadeInUp} className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-lg text-foreground">AI Candidate Analysis</h3>
          </div>
          {analysis && (
            <Button variant="outline" size="sm" onClick={onReanalyze} disabled={isAnalyzing}>
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              Re-analyze
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground font-body">Powered by AI — comprehensive evaluation with graphical insights</p>
      </motion.div>

      {isAnalyzing && !analysis && (
        <motion.div {...fadeInUp} className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground bg-card rounded-2xl border border-border">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <div className="text-center">
            <p className="font-display font-semibold text-foreground">Analyzing candidate profile...</p>
            <p className="text-xs text-muted-foreground mt-1 font-body">GitHub activity, ATS compatibility, LeetCode performance, and project authenticity</p>
          </div>
        </motion.div>
      )}

      {analysis && (
        <>
          {/* Recommendation + Overall Scores Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.1 }}
              className="bg-card rounded-2xl border border-border p-6 flex flex-col items-center justify-center text-center">
              <span className="text-3xl mb-2">{recEmoji(analysis.recommendation)}</span>
              <span className={`inline-block px-5 py-2.5 rounded-xl font-display font-bold text-base ${badgeColor(analysis.recommendation)}`}>
                {analysis.recommendation.replace("_", " ")}
              </span>
              <span className="text-xs text-muted-foreground mt-3 font-body">Confidence: <strong className="text-foreground">{analysis.confidence}%</strong></span>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.15 }}
              className="bg-card rounded-2xl border border-border p-6 flex flex-col items-center justify-center">
              <CircularGauge value={analysis.overallScore} size={110} strokeWidth={10} color="hsl(var(--primary))" label="Overall Score" />
            </motion.div>

            {analysis.atsScore && (
              <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }}
                className="bg-card rounded-2xl border border-border p-6 flex flex-col items-center justify-center">
                <CircularGauge
                  value={analysis.atsScore.overall} size={110} strokeWidth={10}
                  color={analysis.atsScore.overall >= 70 ? "#22c55e" : analysis.atsScore.overall >= 50 ? "#f59e0b" : "#ef4444"}
                  label="ATS Resume Score"
                />
              </motion.div>
            )}
          </div>

          {/* Tech Stack Match */}
          {requiredTechStack.length > 0 && (
            <motion.div {...fadeInUp} className="bg-card rounded-2xl border border-border p-6">
              <h4 className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" /> Tech Stack Match
              </h4>
              {(() => {
                const candidateSkills = d.skills.map(s => s.toLowerCase());
                const candidateLangs = s?.topLanguages?.map(l => l.name.toLowerCase()) || [];
                const projectTechs = d.projects.flatMap(p => p.tech.map(t => t.toLowerCase()));
                const allCandidate = new Set([...candidateSkills, ...candidateLangs, ...projectTechs]);
                const matched = requiredTechStack.filter(t => allCandidate.has(t.toLowerCase()));
                const missing = requiredTechStack.filter(t => !allCandidate.has(t.toLowerCase()));
                const matchPct = Math.round((matched.length / requiredTechStack.length) * 100);
                const color = matchPct >= 75 ? "#22c55e" : matchPct >= 50 ? "#f59e0b" : "#ef4444";

                return (
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <CircularGauge value={matchPct} size={90} strokeWidth={8} color={color} label="Match Rate" />
                      <div className="flex-1">
                        <p className="text-sm font-display font-bold text-foreground">{matched.length}/{requiredTechStack.length} technologies matched</p>
                        <p className="text-xs text-muted-foreground font-body mt-1">
                          {matchPct >= 75 ? "Strong match for this role's requirements." : matchPct >= 50 ? "Partial match — some gaps to discuss." : "Significant gaps in required technologies."}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] font-display font-semibold text-green-600 uppercase tracking-wider">Matched</span>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {matched.length > 0 ? matched.map(t => (
                            <Badge key={t} className="text-[10px] bg-green-500/15 text-green-700 border-green-400/30 font-body">{t}</Badge>
                          )) : <span className="text-xs text-muted-foreground font-body">None</span>}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-display font-semibold text-red-500 uppercase tracking-wider">Missing</span>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {missing.length > 0 ? missing.map(t => (
                            <Badge key={t} variant="outline" className="text-[10px] border-red-400/30 text-red-600 bg-red-500/10 font-body">{t}</Badge>
                          )) : <span className="text-xs text-muted-foreground font-body">None — full match!</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* Executive Summary */}
          <motion.div {...fadeInUp} className="bg-card rounded-2xl border border-border p-6">
            <h4 className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> Executive Summary
            </h4>
            <p className="text-sm text-foreground font-body leading-relaxed">{analysis.summary}</p>
          </motion.div>

          {/* ATS Score Breakdown */}
          {analysis.atsScore && (
            <motion.div {...fadeInUp} className="bg-card rounded-2xl border border-border p-6">
              <h4 className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> ATS Resume Score Breakdown
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                <ScoreBar label="Keywords Match" value={analysis.atsScore.keywordScore} icon={Zap} />
                <ScoreBar label="Format & Structure" value={analysis.atsScore.formatScore} icon={BookOpen} />
                <ScoreBar label="Experience Relevance" value={analysis.atsScore.experienceScore} icon={TrendingUp} />
                <ScoreBar label="Education" value={analysis.atsScore.educationScore} icon={Award} />
                <ScoreBar label="Skills Coverage" value={analysis.atsScore.skillsScore} icon={Code2} />
              </div>
              {analysis.atsScore.suggestions?.length > 0 && (
                <div className="mt-5 bg-accent/10 rounded-xl p-4">
                  <span className="text-xs font-display font-semibold text-foreground flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-accent" /> ATS Improvement Tips
                  </span>
                  <ul className="space-y-1.5">
                    {analysis.atsScore.suggestions.map((s: string, i: number) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2 font-body">
                        <span className="text-accent mt-0.5 font-bold">→</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}

          {/* LeetCode Analysis */}
          {(analysis.leetcodeInsights || lc) && (
            <motion.div {...fadeInUp} className="bg-card rounded-2xl border border-border p-6">
              <h4 className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" /> LeetCode Performance Analysis
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {lc && lc.totalSolved > 0 && (
                  <LeetCodeDonut easy={lc.easySolved} medium={lc.mediumSolved} hard={lc.hardSolved} />
                )}
                {lc && (
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Ranking", value: lc.ranking ? `#${lc.ranking.toLocaleString()}` : "N/A", icon: Award },
                      { label: "Contest Rating", value: lc.contestRating || "N/A", icon: TrendingUp },
                      { label: "Contests", value: lc.totalContests, icon: Target },
                      { label: "Total Solved", value: lc.totalSolved, icon: Zap },
                    ].map(item => (
                      <div key={item.label} className="bg-secondary/50 rounded-xl p-3 text-center">
                        <item.icon className="w-4 h-4 mx-auto text-primary mb-1" />
                        <div className="font-display text-lg font-bold text-foreground">{item.value}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {analysis.leetcodeInsights && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                  {Object.entries(analysis.leetcodeInsights).map(([key, val]) => (
                    <div key={key} className="bg-secondary/30 rounded-xl p-3 border border-border/50">
                      <span className="text-[10px] font-display font-semibold text-foreground uppercase tracking-wider">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1 font-body leading-relaxed">{val as string}</p>
                    </div>
                  ))}
                </div>
              )}
              {!lc && !analysis.leetcodeInsights && (
                <p className="text-xs text-muted-foreground font-body">No LeetCode data available. Add a LeetCode username to include this analysis.</p>
              )}
            </motion.div>
          )}

          {/* Strengths & Concerns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div {...fadeInUp} className="bg-card rounded-2xl border border-border p-6">
              <h4 className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-green-600" /> Key Strengths
              </h4>
              <ul className="space-y-2">
                {analysis.strengths?.map((s, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -5 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="flex items-start gap-2.5 text-sm font-body text-foreground bg-green-500/5 rounded-lg p-2.5">
                    <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-xs font-bold">✓</span>
                    </span>
                    {s}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div {...fadeInUp} className="bg-card rounded-2xl border border-border p-6">
              <h4 className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500" /> Concerns
              </h4>
              <ul className="space-y-2">
                {analysis.concerns?.map((c, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: 5 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="flex items-start gap-2.5 text-sm font-body text-foreground bg-red-500/5 rounded-lg p-2.5">
                    <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-500 text-xs font-bold">!</span>
                    </span>
                    {c}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* GitHub Insights */}
          <motion.div {...fadeInUp} className="bg-card rounded-2xl border border-border p-6">
            <h4 className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <GitFork className="w-3.5 h-3.5" /> GitHub Insights
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {analysis.githubInsights && Object.entries(analysis.githubInsights).map(([key, val]) => (
                <div key={key} className="bg-secondary/40 rounded-xl p-4 border border-border/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                  <span className="text-[10px] font-display font-semibold text-foreground uppercase tracking-wider">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1.5 font-body leading-relaxed">{val}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Projects with AI/Copied Detection */}
          <motion.div {...fadeInUp} className="bg-card rounded-2xl border border-border p-6">
            <h4 className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" /> Project Authenticity Analysis
            </h4>
            <div className="space-y-3">
              {d.projects.map((p, i) => {
                const isAiGenerated = analysis.inferredProjectDescriptions?.[p.name];
                const noDesc = p.description === "No description provided" || !p.description;
                const lowStars = p.stars <= 0;
                const hasCommonTemplate = p.name.toLowerCase().includes("todo") || p.name.toLowerCase().includes("calculator") || p.name.toLowerCase().includes("weather");
                const suspiciousFlags: string[] = [];
                if (noDesc) suspiciousFlags.push("No description");
                if (hasCommonTemplate) suspiciousFlags.push("Common template");
                if (lowStars && d.projects.length > 3) suspiciousFlags.push("No stars");

                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="bg-secondary/30 rounded-xl p-4 border border-border/50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-display font-semibold text-sm text-foreground">{p.name}</span>
                          {p.stars > 0 && (
                            <span className="flex items-center gap-0.5 text-xs text-amber-500 font-body">
                              <Star className="w-3 h-3" /> {p.stars}
                            </span>
                          )}
                          {suspiciousFlags.length > 0 && (
                            <Badge variant="outline" className="text-[10px] border-amber-400/50 text-amber-600 bg-amber-500/10">
                              <AlertTriangle className="w-2.5 h-2.5 mr-0.5" /> Review
                            </Badge>
                          )}
                          {isAiGenerated && (
                            <Badge variant="outline" className="text-[10px] border-blue-400/50 text-blue-600 bg-blue-500/10">
                              <Bot className="w-2.5 h-2.5 mr-0.5" /> Nova Inferred Desc
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 font-body">
                          {isAiGenerated ? (isAiGenerated as string) : p.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {p.tech.map(t => (
                            <span key={t} className="text-[10px] bg-secondary px-2 py-0.5 rounded-md text-muted-foreground font-body">{t}</span>
                          ))}
                        </div>
                        {suspiciousFlags.length > 0 && (
                          <div className="flex gap-1.5 mt-2">
                            {suspiciousFlags.map(f => (
                              <span key={f} className="text-[9px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded font-body">{f}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            {s && s.aiGeneratedContent > 0 && (
              <div className="mt-4 bg-amber-500/10 border border-amber-400/30 rounded-xl p-4 flex items-start gap-3">
                <Bot className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-display font-semibold text-amber-700">Nova Detected Generated Content</span>
                  <p className="text-xs text-amber-600/80 mt-0.5 font-body">
                    {s.aiGeneratedContent} {s.aiGeneratedContent === 1 ? "repository contains" : "repositories contain"} potential auto-generated code patterns. Consider verifying originality during technical interviews.
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Technical Assessment */}
          <motion.div {...fadeInUp} className="bg-card rounded-2xl border border-border p-6">
            <h4 className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Technical Assessment
            </h4>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="bg-primary/10 rounded-xl px-4 py-3 text-center">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Primary Stack</div>
                <div className="font-display font-bold text-sm text-foreground">{analysis.technicalAssessment.primaryStack}</div>
              </div>
              <div className="bg-primary/10 rounded-xl px-4 py-3 text-center">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Experience Level</div>
                <div className="font-display font-bold text-sm text-foreground">{analysis.technicalAssessment.experienceLevel}</div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {analysis.technicalAssessment.specializations.map(s => (
                  <Badge key={s} className="text-xs font-body">{s}</Badge>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Hiring Notes */}
          <motion.div {...fadeInUp} className="bg-card rounded-2xl border border-border p-6">
            <h4 className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Hiring Manager Notes
            </h4>
            <p className="text-sm text-foreground font-body leading-relaxed bg-secondary/30 rounded-xl p-4">{analysis.hiringNotes}</p>
          </motion.div>

          {/* Download Report CTA */}
          <motion.div {...fadeInUp} className="flex justify-center pt-2 pb-4">
            <Button variant="cta" size="lg" onClick={onDownloadReport} className="rounded-full px-8">
              <Download className="w-5 h-5 mr-2" /> Download Full Report
            </Button>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default RecruiterAnalysisPanel;
