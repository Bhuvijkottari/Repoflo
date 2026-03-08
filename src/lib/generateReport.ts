import type { PortfolioData } from "./mockData";

export interface CandidateAnalysis {
  overallScore: number;
  verdict: string;
  summary: string;
  strengths: string[];
  concerns: string[];
  githubInsights: {
    activityLevel: string;
    codeQuality: string;
    consistency: string;
    collaboration: string;
  };
  technicalAssessment: {
    primaryStack: string;
    experienceLevel: string;
    specializations: string[];
  };
  hiringNotes: string;
  atsScore?: {
    overall: number;
    keywordScore: number;
    formatScore: number;
    experienceScore: number;
    educationScore: number;
    skillsScore: number;
    suggestions: string[];
  };
  leetcodeInsights?: {
    problemSolvingLevel: string;
    difficultyBalance: string;
    contestPerformance: string;
    summary: string;
  } | null;
  inferredProjectDescriptions?: Record<string, string>;
  experienceLevelMatch?: {
    required: string;
    assessed: string;
    isMatch: boolean;
    explanation: string;
  };
}

const verdictColor = (score: number) => {
  if (score >= 90) return "#16a34a";
  if (score >= 80) return "#22c55e";
  if (score >= 70) return "#2563eb";
  if (score >= 60) return "#f59e0b";
  if (score >= 50) return "#d97706";
  return "#dc2626";
};

export function generateReportHtml(data: PortfolioData, analysis: CandidateAnalysis): string {
  const s = data.githubStats;
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Candidate Report - ${data.name}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',system-ui,sans-serif;color:#1e293b;background:#fff;line-height:1.6;padding:40px}
.container{max-width:800px;margin:0 auto}
.header{border-bottom:3px solid #1e293b;padding-bottom:24px;margin-bottom:32px}
.header h1{font-size:1.8rem;font-weight:700;margin-bottom:4px}
.header p{color:#64748b;font-size:.9rem}
.badge{display:inline-block;padding:6px 16px;border-radius:6px;color:#fff;font-weight:700;font-size:.85rem;letter-spacing:1px}
.score-bar{height:8px;border-radius:4px;background:#e2e8f0;margin:8px 0}
.score-fill{height:100%;border-radius:4px}
.section{margin-bottom:28px}
.section h2{font-size:1.1rem;font-weight:700;color:#1e293b;margin-bottom:12px;padding-bottom:6px;border-bottom:1px solid #e2e8f0;text-transform:uppercase;letter-spacing:1px;font-size:.85rem}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px}
.card .label{font-size:.75rem;color:#64748b;text-transform:uppercase;letter-spacing:1px}
.card .value{font-size:1.3rem;font-weight:700;color:#1e293b}
.insight-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9}
.insight-label{font-weight:600;font-size:.9rem}
.insight-value{color:#64748b;font-size:.9rem;text-align:right;max-width:60%}
.tag{display:inline-block;background:#f1f5f9;border:1px solid #e2e8f0;padding:3px 10px;border-radius:4px;font-size:.8rem;margin:2px;color:#475569}
.strength{color:#16a34a;font-size:.9rem;margin:4px 0}
.concern{color:#dc2626;font-size:.9rem;margin:4px 0}
.footer{margin-top:40px;padding-top:20px;border-top:2px solid #e2e8f0;text-align:center;color:#94a3b8;font-size:.8rem}
@media print{body{padding:20px}@page{margin:1cm}}
</style></head><body>
<div class="container">
  <div class="header">
    <div style="display:flex;justify-content:space-between;align-items:flex-start">
      <div>
        <h1>Candidate Assessment Report</h1>
        <p>${data.name} | ${data.title} | ${data.location}</p>
        <p>Generated: ${date}</p>
      </div>
      <div style="text-align:right">
        <span class="badge" style="background:${verdictColor(analysis.overallScore)}">${analysis.verdict}</span>
        <div style="margin-top:8px;font-size:.85rem;color:#64748b">Score: ${analysis.overallScore}/100</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Executive Summary</h2>
    <p style="font-size:.95rem;color:#334155">${analysis.summary}</p>
    <div style="margin-top:12px">
      <div style="display:flex;justify-content:space-between;font-size:.85rem;margin-bottom:4px">
        <span>Overall Score</span><span style="font-weight:700">${analysis.overallScore}/100</span>
      </div>
      <div class="score-bar"><div class="score-fill" style="width:${analysis.overallScore}%;background:${verdictColor(analysis.overallScore)}"></div></div>
    </div>
  </div>

  <div class="section">
    <h2>GitHub Analytics</h2>
    <div class="grid">
      ${s ? `
      <div class="card"><div class="label">Total Commits</div><div class="value">${s.totalCommits.toLocaleString()}</div></div>
      <div class="card"><div class="label">Public Repos</div><div class="value">${s.publicRepos}</div></div>
      <div class="card"><div class="label">Followers</div><div class="value">${s.followers.toLocaleString()}</div></div>
      <div class="card"><div class="label">Contribution Streak</div><div class="value">${s.contributionStreak}d</div></div>
      ` : '<div class="card"><div class="label">GitHub data not available</div></div>'}
    </div>
    ${s?.topLanguages?.length ? `
    <div style="margin-top:12px">
      <div style="font-size:.85rem;font-weight:600;margin-bottom:6px">Top Languages</div>
      <div style="display:flex;border-radius:6px;overflow:hidden;height:20px">
        ${s.topLanguages.map((l, i) => `<div style="width:${l.percentage}%;background:${["#6366f1","#f59e0b","#10b981","#ef4444"][i]};display:flex;align-items:center;justify-content:center;font-size:.7rem;color:#fff;font-weight:600">${l.name} ${l.percentage}%</div>`).join("")}
      </div>
    </div>` : ""}
  </div>

  <div class="section">
    <h2>GitHub Insights</h2>
    <div class="insight-row"><span class="insight-label">Activity Level</span><span class="insight-value">${analysis.githubInsights.activityLevel}</span></div>
    <div class="insight-row"><span class="insight-label">Code Quality</span><span class="insight-value">${analysis.githubInsights.codeQuality}</span></div>
    <div class="insight-row"><span class="insight-label">Consistency</span><span class="insight-value">${analysis.githubInsights.consistency}</span></div>
    <div class="insight-row"><span class="insight-label">Collaboration</span><span class="insight-value">${analysis.githubInsights.collaboration}</span></div>
  </div>

  <div class="section">
    <h2>Technical Assessment</h2>
    <div class="insight-row"><span class="insight-label">Primary Stack</span><span class="insight-value">${analysis.technicalAssessment.primaryStack}</span></div>
    <div class="insight-row"><span class="insight-label">Experience Level</span><span class="insight-value">${analysis.technicalAssessment.experienceLevel}</span></div>
    <div style="margin-top:8px;font-size:.85rem;font-weight:600">Specializations</div>
    <div style="margin-top:4px">${analysis.technicalAssessment.specializations.map(s => `<span class="tag">${s}</span>`).join("")}</div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
    <div class="section">
      <h2>Key Strengths</h2>
      ${analysis.strengths.map(s => `<div class="strength">+ ${s}</div>`).join("")}
    </div>
    <div class="section">
      <h2>Concerns</h2>
      ${analysis.concerns.map(c => `<div class="concern">- ${c}</div>`).join("")}
    </div>
  </div>

  <div class="section">
    <h2>Skills</h2>
    <div>${data.skills.map(s => `<span class="tag">${s}</span>`).join("")}</div>
  </div>

  ${data.experience.length ? `
  <div class="section">
    <h2>Experience</h2>
    ${data.experience.map(e => `<div style="margin-bottom:12px"><div style="font-weight:600">${e.role}</div><div style="color:#6366f1;font-size:.9rem">${e.company} | ${e.period}</div><p style="color:#64748b;font-size:.85rem;margin-top:2px">${e.description}</p></div>`).join("")}
  </div>` : ""}

  ${data.education.length ? `
  <div class="section">
    <h2>Education</h2>
    ${data.education.map(e => `<div style="margin-bottom:8px"><div style="font-weight:600">${e.degree}</div><div style="color:#64748b;font-size:.9rem">${e.institution} | ${e.period}</div></div>`).join("")}
  </div>` : ""}

  <div class="section">
    <h2>Hiring Manager Notes</h2>
    <p style="font-size:.9rem;color:#334155;background:#f8fafc;padding:16px;border-radius:8px;border:1px solid #e2e8f0">${analysis.hiringNotes}</p>
  </div>

  <div class="footer">
    <div style="margin-bottom:12px;opacity:0.15;text-align:center;font-size:2.5rem;font-weight:900;letter-spacing:4px;color:#1e293b">REPOFLOW</div>
    <p>Generated by Repoflow Recruiter Analysis | ${date}</p>
    <p>This report is generated by AI and should be used as a supplementary tool alongside traditional evaluation methods.</p>
  </div>
</div></body></html>`;
}
