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

export const downloadHtml = () => {
  return document.documentElement.outerHTML;
};

export function generateReportHtml(data: PortfolioData, analysis: CandidateAnalysis): string {
  const s = data.githubStats;
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Candidate Report - ${data.name}</title>

<style>
*{margin:0;padding:0;box-sizing:border-box}

@page { margin: 20mm; }

body{
  font-family:'Segoe UI',system-ui,sans-serif;
  color:#1e293b;
  background:#fff;
  line-height:1.6;
}

.container{
  max-width:800px;
  margin:auto;
  padding:20px;
}

/* HEADER + FOOTER */
.header-bar{
  position:fixed;
  top:-10mm;
  left:0;
  right:0;
  text-align:center;
  font-size:12px;
  color:#64748b;
}

.footer-bar{
  position:fixed;
  bottom:-10mm;
  left:0;
  right:0;
  text-align:center;
  font-size:12px;
  color:#94a3b8;
}

/* WATERMARK */
.watermark{
  position:fixed;
  top:45%;
  left:50%;
  transform:translate(-50%,-50%) rotate(-30deg);
  font-size:80px;
  color:rgba(0,0,0,0.04);
  font-weight:bold;
  z-index:0;
}

/* CONTENT */
.header{
  border-bottom:3px solid #1e293b;
  padding-bottom:24px;
  margin-bottom:32px;
}

.header h1{
  font-size:1.8rem;
  font-weight:700;
}

.badge{
  display:inline-block;
  padding:6px 16px;
  border-radius:6px;
  color:#fff;
  font-weight:700;
}

.section{
  margin-bottom:28px;
  page-break-inside:avoid;
  break-inside:avoid;
}

.section h2{
  font-size:.85rem;
  font-weight:700;
  margin-bottom:12px;
  border-bottom:1px solid #e2e8f0;
  padding-bottom:6px;
  text-transform:uppercase;
}

.grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:12px;
}

.card{
  background:#f8fafc;
  border:1px solid #e2e8f0;
  border-radius:8px;
  padding:14px;
  page-break-inside:avoid;
}

.insight-row{
  display:flex;
  justify-content:space-between;
  padding:8px 0;
  border-bottom:1px solid #f1f5f9;
}

.tag{
  display:inline-block;
  background:#f1f5f9;
  border:1px solid #e2e8f0;
  padding:3px 10px;
  border-radius:4px;
  font-size:.8rem;
  margin:2px;
}

.strength{color:#16a34a;margin:4px 0}
.concern{color:#dc2626;margin:4px 0}

.score-bar{
  height:8px;
  background:#e2e8f0;
  border-radius:4px;
  margin-top:4px;
}

.score-fill{
  height:100%;
  border-radius:4px;
}

.footer{
  margin-top:40px;
  padding-top:20px;
  border-top:2px solid #e2e8f0;
  text-align:center;
  font-size:.85rem;
  color:#64748b;
}
</style>
</head>

<body>

<div class="header-bar">
  Repoflo Recruiter Report
</div>

<div class="footer-bar">
  Generated on ${date} | Confidential Candidate Evaluation
</div>

<div class="watermark">REPOFLO</div>

<div class="container">

  <!-- HEADER -->
  <div class="header">
    <div style="display:flex;justify-content:space-between">
      <div>
        <h1>Candidate Assessment Report</h1>
        <p>${data.name} | ${data.title} | ${data.location}</p>
        <p>Generated: ${date}</p>
      </div>
      <div>
        <span class="badge" style="background:${verdictColor(analysis.overallScore)}">
          ${analysis.verdict}
        </span>
        <div>Score: ${analysis.overallScore}/100</div>
      </div>
    </div>
  </div>

  <!-- SUMMARY -->
  <div class="section">
    <h2>Executive Summary</h2>
    <p>${analysis.summary}</p>
    <div style="margin-top:12px">
  <div style="display:flex;justify-content:space-between;font-size:.85rem;margin-bottom:4px">
    <span>Overall Score</span>
    <span style="font-weight:700">${analysis.overallScore}/100</span>
  </div>

  <div class="score-bar">
    <div class="score-fill" 
      style="width:${analysis.overallScore}%;background:${verdictColor(analysis.overallScore)}">
    </div>
  </div>
</div>

  <!-- GITHUB -->
  <div class="section">
    <h2>GitHub Analytics</h2>
    <div class="grid">
      ${s ? `
      <div class="card">Commits: ${s.totalCommits}</div>
      <div class="card">Repos: ${s.publicRepos}</div>
      <div class="card">Followers: ${s.followers}</div>
      <div class="card">Streak: ${s.contributionStreak}</div>
      ` : "No data"}
    </div>
  </div>

 <div class="section">
  <h2>Technical Assessment</h2>

  <div style="margin-bottom:10px">
    <strong>Primary Stack</strong>
    <p style="margin-top:4px">
      ${analysis.technicalAssessment.primaryStack}
    </p>
  </div>

  <div style="margin-bottom:10px">
    <strong>Experience Level</strong>
    <p style="margin-top:4px">
      ${analysis.technicalAssessment.experienceLevel}
    </p>
  </div>
</div>

  <!-- ATS -->
  ${analysis.atsScore ? `
  <div class="section">
    <h2>ATS Score Breakdown</h2>
    ${[
      ["Keywords Match", analysis.atsScore.keywordScore],
      ["Format & Structure", analysis.atsScore.formatScore],
      ["Experience Relevance", analysis.atsScore.experienceScore],
      ["Education", analysis.atsScore.educationScore],
      ["Skills Coverage", analysis.atsScore.skillsScore],
    ].map(([label, val]) => `
      <div style="margin-bottom:10px">
        <div class="insight-row"><span>${label}</span><span>${val}%</span></div>
        <div class="score-bar"><div class="score-fill" style="width:${val}%;background:#22c55e"></div></div>
      </div>
    `).join("")}

    ${analysis.atsScore.suggestions?.length
      ? `<div style="margin-top:10px">
          ${analysis.atsScore.suggestions.map(s => `<div class="concern">• ${s}</div>`).join("")}
         </div>`
      : ""}
  </div>
  ` : ""}

  <!-- STRENGTHS -->
  <div class="section">
    <h2>Strengths</h2>
    ${analysis.strengths.map(s => `<div class="strength">+ ${s}</div>`).join("")}
  </div>

  <!-- CONCERNS -->
  <div class="section">
    <h2>Concerns</h2>
    ${analysis.concerns.map(c => `<div class="concern">- ${c}</div>`).join("")}
  </div>

  <!-- SKILLS -->
  <div class="section">
    <h2>Skills</h2>
    ${data.skills.map(s => `<span class="tag">${s}</span>`).join("")}
  </div>

  <!-- EXPERIENCE -->
  ${data.experience.length ? `
  <div class="section">
    <h2>Experience</h2>
    ${data.experience.map(e => `
      <div style="margin-bottom:10px">
        <strong>${e.role}</strong><br/>
        ${e.company} | ${e.period}
        <p>${e.description}</p>
      </div>
    `).join("")}
  </div>` : ""}

  <!-- NOTES -->
  <div class="section">
    <h2>Hiring Manager Notes</h2>
    <p>${analysis.hiringNotes}</p>
  </div>

  <!-- FINAL FOOTER -->
  <div class="footer">
    <div style="margin-bottom:10px;opacity:0.15;font-size:2rem;font-weight:900">REPOFLO</div>
    <p><strong>Generated by Repoflo Recruiter Analysis</strong> | ${date}</p>
    <p style="margin-top:6px;font-size:.75rem;color:#94a3b8">
      This report is generated by AI and should be used as a supplementary tool alongside traditional evaluation methods.
    </p>
  </div>

</div>
</body>
</html>`;
}
