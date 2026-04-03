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

export const downloadHtml = () => document.documentElement.outerHTML;

const scoreColor = (n: number) =>
  n >= 85 ? "#16a34a" : n >= 70 ? "#2563eb" : n >= 55 ? "#d97706" : "#dc2626";

const scoreBg = (n: number) =>
  n >= 85 ? "#f0fdf4" : n >= 70 ? "#eff6ff" : n >= 55 ? "#fffbeb" : "#fef2f2";

const scoreBorder = (n: number) =>
  n >= 85 ? "#bbf7d0" : n >= 70 ? "#bfdbfe" : n >= 55 ? "#fde68a" : "#fecaca";

const verdictLabel = (n: number) =>
  n >= 85 ? "Strong Hire" : n >= 70 ? "Hire" : n >= 55 ? "Consider" : "Pass";

const langColors = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#ec4899", "#06b6d4"];

export function generateReportHtml(data: PortfolioData, analysis: CandidateAnalysis): string {
  const s = data.githubStats;
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  const score = analysis.overallScore;
  const color = scoreColor(score);
  const bg = scoreBg(score);
  const border = scoreBorder(score);

  // SVG donut for overall score
  const r = 38, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  // Language bar
  const langBar = s?.topLanguages?.length
    ? `<div style="display:flex;border-radius:4px;overflow:hidden;height:10px;margin-bottom:8px">
        ${s.topLanguages.map((l, i) => `<div style="width:${l.percentage}%;background:${langColors[i]};height:100%"></div>`).join("")}
       </div>
       <div style="display:flex;flex-wrap:wrap;gap:8px">
         ${s.topLanguages.map((l, i) => `
           <span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;color:#475569">
             <span style="width:8px;height:8px;border-radius:50%;background:${langColors[i]};display:inline-block"></span>
             ${l.name} <strong>${l.percentage}%</strong>
           </span>`).join("")}
       </div>`
    : `<p style="color:#94a3b8;font-size:12px">No language data</p>`;

  // ATS score bars
  const atsBars = analysis.atsScore
    ? [
        ["Keywords", analysis.atsScore.keywordScore],
        ["Format", analysis.atsScore.formatScore],
        ["Experience", analysis.atsScore.experienceScore],
        ["Education", analysis.atsScore.educationScore],
        ["Skills", analysis.atsScore.skillsScore],
      ].map(([label, val]) => {
        const c = (val as number) >= 75 ? "#16a34a" : (val as number) >= 50 ? "#d97706" : "#dc2626";
        return `
        <div style="margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">
            <span style="color:#475569">${label}</span>
            <strong style="color:${c}">${val}%</strong>
          </div>
          <div style="height:6px;background:#e2e8f0;border-radius:3px;overflow:hidden">
            <div style="width:${val}%;height:100%;background:${c};border-radius:3px"></div>
          </div>
        </div>`;
      }).join("")
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Candidate Report – ${data.name}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  @page { size: A4; margin: 18mm 16mm; }
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    font-size: 13px;
    line-height: 1.55;
    color: #1e293b;
    background: #fff;
  }
  /* Print watermark */
  @media print {
    .no-print { display: none !important; }
  }
  .page { max-width: 780px; margin: 0 auto; padding: 24px; }

  /* ─── TOP HEADER BAND ─── */
  .report-header {
    background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
    border-radius: 12px;
    padding: 28px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 24px;
    color: #fff;
  }
  .report-header h1 { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 4px; }
  .report-header .sub { font-size: 13px; color: #94a3b8; margin-bottom: 2px; }
  .report-header .date { font-size: 11px; color: #64748b; margin-top: 8px; }
  .score-ring { flex-shrink: 0; text-align: center; }

  /* ─── VERDICT BADGE ─── */
  .verdict-badge {
    display: inline-block;
    padding: 5px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: #fff;
    margin-top: 8px;
  }

  /* ─── SECTION TITLE ─── */
  .sec-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #64748b;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 6px;
    margin-bottom: 14px;
    margin-top: 24px;
  }
  .sec-title:first-child { margin-top: 0; }

  /* ─── TWO-COL GRID ─── */
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }

  /* ─── STAT CARD ─── */
  .stat-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 14px 16px;
    text-align: center;
  }
  .stat-card .val { font-size: 20px; font-weight: 800; color: #1e293b; line-height: 1.2; }
  .stat-card .lbl { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-top: 2px; }

  /* ─── INFO CARD ─── */
  .info-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 14px 16px;
  }
  .info-card .card-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 4px; }
  .info-card .card-val { font-size: 13px; font-weight: 600; color: #1e293b; }

  /* ─── INSIGHT ROWS ─── */
  .insight-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 7px 0;
    border-bottom: 1px solid #f1f5f9;
    font-size: 12px;
  }
  .insight-row:last-child { border-bottom: none; }
  .insight-row .lbl { color: #64748b; }
  .insight-row .val { font-weight: 600; color: #1e293b; }

  /* ─── STRENGTHS / CONCERNS ─── */
  .strength-item { display: flex; align-items: flex-start; gap: 6px; margin-bottom: 6px; font-size: 12px; color: #166534; }
  .strength-item::before { content: "✓"; font-weight: 700; color: #16a34a; flex-shrink: 0; margin-top: 1px; }
  .concern-item { display: flex; align-items: flex-start; gap: 6px; margin-bottom: 6px; font-size: 12px; color: #991b1b; }
  .concern-item::before { content: "⚠"; flex-shrink: 0; margin-top: 1px; }

  /* ─── SKILL TAG ─── */
  .tag {
    display: inline-block;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    padding: 3px 10px;
    border-radius: 5px;
    font-size: 11px;
    color: #475569;
    margin: 2px;
  }

  /* ─── EXPERIENCE ROW ─── */
  .exp-row { padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
  .exp-row:last-child { border-bottom: none; }
  .exp-role { font-weight: 700; font-size: 13px; color: #1e293b; }
  .exp-meta { font-size: 11px; color: #64748b; margin-top: 1px; }
  .exp-desc { font-size: 12px; color: #475569; margin-top: 4px; line-height: 1.5; }

  /* ─── PROJECT ROW ─── */
  .proj-row { padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
  .proj-row:last-child { border-bottom: none; }

  /* ─── SCORE OVERVIEW BAND ─── */
  .score-band {
    background: ${bg};
    border: 1px solid ${border};
    border-radius: 10px;
    padding: 16px 20px;
    margin-bottom: 24px;
  }

  /* ─── SUMMARY BOX ─── */
  .summary-box {
    background: #f8fafc;
    border-left: 3px solid ${color};
    border-radius: 0 8px 8px 0;
    padding: 12px 16px;
    font-size: 12px;
    color: #334155;
    line-height: 1.65;
  }

  /* ─── NOTES BOX ─── */
  .notes-box {
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: 8px;
    padding: 14px 16px;
    font-size: 12px;
    color: #78350f;
    line-height: 1.65;
  }

  /* ─── FOOTER ─── */
  .report-footer {
    margin-top: 32px;
    padding-top: 16px;
    border-top: 2px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .report-footer .brand { font-size: 14px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }
  .report-footer .meta { font-size: 10px; color: #94a3b8; text-align: right; }

  /* ─── PAGE BREAK HINTS ─── */
  .no-break { page-break-inside: avoid; break-inside: avoid; }
</style>
</head>
<body>
<div class="page">

  <!-- ══ HEADER BAND ══ -->
  <div class="report-header no-break">
    <div style="flex:1">
      <h1>${data.name}</h1>
      <div class="sub">${data.title}${data.location ? ` · ${data.location}` : ""}</div>
      ${data.email ? `<div class="sub">${data.email}</div>` : ""}
      <div class="date">Assessment generated: ${date}</div>
      <div class="verdict-badge" style="background:${color}">${verdictLabel(score)} · ${score}/100</div>
    </div>
    <div class="score-ring">
      <svg width="96" height="96" style="transform:rotate(-90deg)">
        <circle cx="48" cy="48" r="${r}" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="8"/>
        <circle cx="48" cy="48" r="${r}" fill="none" stroke="${color}" stroke-width="8"
          stroke-linecap="round"
          stroke-dasharray="${circ.toFixed(1)}"
          stroke-dashoffset="${offset.toFixed(1)}"/>
      </svg>
      <div style="position:relative;margin-top:-68px;text-align:center;font-size:22px;font-weight:900;color:#fff;line-height:1">${score}</div>
      <div style="margin-top:38px;font-size:10px;color:#94a3b8;text-align:center;letter-spacing:1px">SCORE</div>
    </div>
  </div>

  <!-- ══ SUMMARY ══ -->
  <div class="no-break">
    <div class="sec-title">Executive Summary</div>
    <div class="summary-box">${analysis.summary}</div>
  </div>

  <!-- ══ EXPERIENCE LEVEL MATCH ══ -->
  ${analysis.experienceLevelMatch ? `
  <div class="no-break">
    <div class="sec-title">Experience Level Assessment</div>
    <div style="background:${analysis.experienceLevelMatch.isMatch ? "#f0fdf4" : "#fef2f2"};border:1px solid ${analysis.experienceLevelMatch.isMatch ? "#bbf7d0" : "#fecaca"};border-radius:8px;padding:14px 16px;font-size:12px;color:#1e293b">
      <div style="display:flex;gap:24px;margin-bottom:8px">
        <span><strong>Required:</strong> ${analysis.experienceLevelMatch.required}</span>
        <span><strong>Assessed:</strong> ${analysis.experienceLevelMatch.assessed}</span>
        <span style="color:${analysis.experienceLevelMatch.isMatch ? "#16a34a" : "#dc2626"};font-weight:700">${analysis.experienceLevelMatch.isMatch ? "✓ Match" : "✗ Mismatch"}</span>
      </div>
      <p style="color:#475569;line-height:1.6">${analysis.experienceLevelMatch.explanation}</p>
    </div>
  </div>` : ""}

  <!-- ══ STRENGTHS & CONCERNS ══ -->
  <div class="two-col no-break">
    <div>
      <div class="sec-title">Strengths</div>
      ${analysis.strengths.map(s => `<div class="strength-item">${s}</div>`).join("") || `<p style="color:#94a3b8;font-size:12px">None identified.</p>`}
    </div>
    <div>
      <div class="sec-title">Concerns</div>
      ${analysis.concerns.map(c => `<div class="concern-item">${c}</div>`).join("") || `<p style="color:#94a3b8;font-size:12px">None identified.</p>`}
    </div>
  </div>

  <!-- ══ TECHNICAL ASSESSMENT ══ -->
  <div class="no-break">
    <div class="sec-title">Technical Assessment</div>
    <div class="two-col">
      <div class="info-card">
        <div class="card-label">Primary Stack</div>
        <div class="card-val">${analysis.technicalAssessment.primaryStack}</div>
      </div>
      <div class="info-card">
        <div class="card-label">Experience Level</div>
        <div class="card-val">${analysis.technicalAssessment.experienceLevel}</div>
      </div>
    </div>
    ${analysis.technicalAssessment.specializations?.length ? `
    <div style="margin-top:10px">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;margin-bottom:6px">Specializations</div>
      <div>${analysis.technicalAssessment.specializations.map(s => `<span class="tag">${s}</span>`).join("")}</div>
    </div>` : ""}
  </div>

  <!-- ══ GITHUB INSIGHTS ══ -->
  <div class="no-break">
    <div class="sec-title">GitHub Insights</div>
    <div class="two-col" style="margin-bottom:${s ? "14px" : "0"}">
      <div class="info-card">
        <div class="insight-row"><span class="lbl">Activity Level</span><span class="val">${analysis.githubInsights.activityLevel}</span></div>
        <div class="insight-row"><span class="lbl">Code Quality</span><span class="val">${analysis.githubInsights.codeQuality}</span></div>
      </div>
      <div class="info-card">
        <div class="insight-row"><span class="lbl">Consistency</span><span class="val">${analysis.githubInsights.consistency}</span></div>
        <div class="insight-row"><span class="lbl">Collaboration</span><span class="val">${analysis.githubInsights.collaboration}</span></div>
      </div>
    </div>
    ${s ? `
    <!-- GitHub stats row -->
    <div class="three-col" style="margin-bottom:12px">
      <div class="stat-card"><div class="val">${s.totalCommits.toLocaleString()}</div><div class="lbl">Commits</div></div>
      <div class="stat-card"><div class="val">${s.publicRepos}</div><div class="lbl">Public Repos</div></div>
      <div class="stat-card"><div class="val">${s.followers.toLocaleString()}</div><div class="lbl">Followers</div></div>
    </div>
    <div class="three-col" style="margin-bottom:14px">
      <div class="stat-card"><div class="val">${s.pullRequests}</div><div class="lbl">Pull Requests</div></div>
      <div class="stat-card"><div class="val">${s.contributionStreak}d</div><div class="lbl">Streak</div></div>
      <div class="stat-card"><div class="val">${Math.floor(s.daysOnGithub / 365)}y ${s.daysOnGithub % 365}d</div><div class="lbl">On GitHub</div></div>
    </div>
    ${s.topLanguages?.length ? `
    <div class="info-card">
      <div class="card-label" style="margin-bottom:8px">Top Languages</div>
      ${langBar}
    </div>` : ""}
    ${s.recentCollaborations?.length ? `
    <div style="margin-top:10px;font-size:12px;color:#475569">
      <strong>Recent Collaborations:</strong> ${s.recentCollaborations.join(" · ")}
    </div>` : ""}
    ${s.aiGeneratedContent > 0 ? `
    <div style="background:#fef3c7;border:1px solid #fbbf24;border-radius:6px;padding:10px 14px;margin-top:10px;font-size:12px;color:#92400e">
      <strong>⚠ AI Content Detected:</strong> ${s.aiGeneratedContent} repo(s) may contain AI-generated code patterns.
    </div>` : ""}` : `<p style="color:#94a3b8;font-size:12px">No GitHub data available.</p>`}
  </div>

  <!-- ══ ATS SCORE ══ -->
  ${analysis.atsScore ? `
  <div class="no-break">
    <div class="sec-title">ATS Score Breakdown — ${analysis.atsScore.overall}% Overall</div>
    <div class="two-col">
      <div>${atsBars}</div>
      <div>
        ${analysis.atsScore.suggestions?.length ? `
        <div class="card-label" style="margin-bottom:6px">Improvement Suggestions</div>
        ${analysis.atsScore.suggestions.map(sg => `<div class="concern-item">${sg}</div>`).join("")}` : ""}
      </div>
    </div>
  </div>` : ""}

  <!-- ══ LEETCODE ══ -->
  ${analysis.leetcodeInsights ? `
  <div class="no-break">
    <div class="sec-title">LeetCode Insights</div>
    <div class="two-col">
      <div class="info-card">
        <div class="insight-row"><span class="lbl">Problem Solving</span><span class="val">${analysis.leetcodeInsights.problemSolvingLevel}</span></div>
        <div class="insight-row"><span class="lbl">Difficulty Balance</span><span class="val">${analysis.leetcodeInsights.difficultyBalance}</span></div>
      </div>
      <div class="info-card">
        <div class="insight-row"><span class="lbl">Contest Performance</span><span class="val">${analysis.leetcodeInsights.contestPerformance}</span></div>
      </div>
    </div>
    ${analysis.leetcodeInsights.summary ? `<div style="margin-top:10px" class="summary-box">${analysis.leetcodeInsights.summary}</div>` : ""}
  </div>` : ""}

  <!-- ══ SKILLS ══ -->
  ${data.skills.length ? `
  <div class="no-break">
    <div class="sec-title">Skills</div>
    <div>${data.skills.map(sk => `<span class="tag">${sk}</span>`).join("")}</div>
  </div>` : ""}

  <!-- ══ EXPERIENCE ══ -->
  ${data.experience.length ? `
  <div class="no-break">
    <div class="sec-title">Work Experience</div>
    ${data.experience.map(e => `
    <div class="exp-row">
      <div class="exp-role">${e.role}</div>
      <div class="exp-meta">${e.company}${e.period ? ` · ${e.period}` : ""}</div>
      <div class="exp-desc">${e.description}</div>
    </div>`).join("")}
  </div>` : ""}

  <!-- ══ PROJECTS ══ -->
  ${data.projects.length ? `
  <div class="no-break">
    <div class="sec-title">Projects</div>
    ${data.projects.map(p => `
    <div class="proj-row">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <strong style="font-size:13px">${p.name}</strong>
        ${p.stars ? `<span style="font-size:11px;color:#d97706">★ ${p.stars} stars</span>` : ""}
      </div>
      <div style="font-size:12px;color:#475569;margin:3px 0">${p.description}</div>
      <div>${p.tech.map(t => `<span class="tag">${t}</span>`).join("")}</div>
    </div>`).join("")}
  </div>` : ""}

  <!-- ══ EDUCATION ══ -->
  ${data.education.length ? `
  <div class="no-break">
    <div class="sec-title">Education</div>
    ${data.education.map(e => `
    <div class="exp-row">
      <div class="exp-role">${e.degree}</div>
      <div class="exp-meta">${e.institution}${e.period ? ` · ${e.period}` : ""}</div>
    </div>`).join("")}
  </div>` : ""}

  <!-- ══ HIRING NOTES ══ -->
  <div class="no-break">
    <div class="sec-title">Recruiter Notes</div>
    <div class="notes-box">${analysis.hiringNotes}</div>
  </div>

  <!-- ══ FOOTER ══ -->
  <div class="report-footer no-break">
    <div>
      <div class="brand">REPOFLO</div>
      <div style="font-size:10px;color:#94a3b8;margin-top:2px">Powered by Devora Technologies</div>
    </div>
    <div class="meta">
      <div>Generated: ${date}</div>
      <div style="margin-top:2px">This report is AI-assisted and should supplement human evaluation.</div>
    </div>
  </div>

</div>
</body>
</html>`;
}
