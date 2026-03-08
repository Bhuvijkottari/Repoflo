import { mockPortfolioData } from "@/lib/mockData";

const d = mockPortfolioData;

export const getThemeHtml = (themeId: string): string => {
  switch (themeId) {
    case "minimal":
      return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',system-ui,sans-serif;background:#fafafa;color:#1a1a1a;line-height:1.6}
.container{max-width:720px;margin:0 auto;padding:40px 24px}
.header{text-align:center;padding:60px 0 40px}.avatar{width:120px;height:120px;border-radius:50%;margin:0 auto 20px;background:#e0e0e0;overflow:hidden}
.avatar img{width:100%;height:100%}h1{font-size:2.5rem;font-weight:700;margin-bottom:8px}
.subtitle{color:#666;font-size:1.1rem;margin-bottom:12px}.bio{color:#888;max-width:500px;margin:0 auto}
section{margin:48px 0}h2{font-size:1.4rem;font-weight:600;margin-bottom:20px;padding-bottom:8px;border-bottom:2px solid #eee}
.skills{display:flex;flex-wrap:wrap;gap:8px}.skill{background:#f0f0f0;padding:6px 14px;border-radius:20px;font-size:.85rem}
.exp-item{margin-bottom:24px}.exp-role{font-weight:600;font-size:1.05rem}.exp-company{color:#666}.exp-period{color:#999;font-size:.85rem}
.project-grid{display:grid;grid-template-columns:1fr;gap:16px}
.project-card{border:1px solid #eee;border-radius:12px;padding:20px}
.project-name{font-weight:600;margin-bottom:4px}.project-desc{color:#666;font-size:.9rem;margin-bottom:8px}
.project-tech{display:flex;flex-wrap:wrap;gap:6px}.tech-tag{background:#f5f5f5;padding:2px 8px;border-radius:4px;font-size:.75rem;color:#888}
.stars{color:#f59e0b;font-size:.85rem}
</style></head><body>
<div class="container">
<div class="header"><div class="avatar"><img src="${d.avatar}" alt="${d.name}"></div>
<h1>${d.name}</h1><p class="subtitle">${d.title}</p><p class="bio">${d.bio}</p></div>
<section><h2>Skills</h2><div class="skills">${d.skills.map(s=>`<span class="skill">${s}</span>`).join('')}</div></section>
<section><h2>Experience</h2>${d.experience.map(e=>`<div class="exp-item"><div class="exp-role">${e.role}</div><div class="exp-company">${e.company}</div><div class="exp-period">${e.period}</div><p style="color:#666;font-size:.9rem;margin-top:4px">${e.description}</p></div>`).join('')}</section>
<section><h2>Projects</h2><div class="project-grid">${d.projects.map(p=>`<div class="project-card"><div class="project-name">${p.name} <span class="stars">★ ${p.stars}</span></div><p class="project-desc">${p.description}</p><div class="project-tech">${p.tech.map(t=>`<span class="tech-tag">${t}</span>`).join('')}</div></div>`).join('')}</div></section>
<section><h2>Education</h2>${d.education.map(e=>`<div class="exp-item"><div class="exp-role">${e.degree}</div><div class="exp-company">${e.institution}</div><div class="exp-period">${e.period}</div></div>`).join('')}</section>
<section><h2>Volunteering</h2>${d.volunteering.map(v=>`<div class="exp-item"><div class="exp-role">${v.role}</div><div class="exp-company">${v.org}</div><div class="exp-period">${v.period}</div><p style="color:#666;font-size:.9rem;margin-top:4px">${v.description}</p></div>`).join('')}</section>
</div></body></html>`;

    case "bold":
      return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',system-ui,sans-serif;background:#0a0a0a;color:#fff;line-height:1.6}
.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(135deg,#0a0a0a 0%,#1a0a2e 50%,#0a1628 100%);padding:40px 24px}
.hero h1{font-size:3.5rem;font-weight:800;background:linear-gradient(135deg,#a855f7,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:12px}
.hero p{color:#999;font-size:1.1rem;max-width:500px;margin:0 auto}
.container{max-width:800px;margin:0 auto;padding:40px 24px}section{margin:60px 0}
h2{font-size:1.8rem;font-weight:700;margin-bottom:24px;background:linear-gradient(135deg,#a855f7,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.skills{display:flex;flex-wrap:wrap;gap:10px}.skill{background:rgba(168,85,247,.15);border:1px solid rgba(168,85,247,.3);color:#c084fc;padding:8px 16px;border-radius:8px;font-size:.85rem}
.exp-item{border-left:2px solid #a855f7;padding-left:20px;margin-bottom:28px}.exp-role{font-weight:700;font-size:1.1rem}.exp-company{color:#a855f7}.exp-period{color:#666;font-size:.85rem}
.project-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.project-card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:24px;transition:transform .2s}
.project-card:hover{transform:translateY(-4px)}
.project-name{font-weight:700;font-size:1.05rem;margin-bottom:6px}.project-desc{color:#999;font-size:.85rem;margin-bottom:10px}
.tech-tag{display:inline-block;background:rgba(59,130,246,.15);color:#60a5fa;padding:2px 8px;border-radius:4px;font-size:.75rem;margin:2px}
.stars{color:#f59e0b;font-size:.8rem}
@media(max-width:640px){.hero h1{font-size:2.2rem}.project-grid{grid-template-columns:1fr}}
</style></head><body>
<div class="hero"><div><div style="width:130px;height:130px;border-radius:50%;overflow:hidden;margin:0 auto 24px;border:3px solid #a855f7"><img src="${d.avatar}" style="width:100%;height:100%"></div>
<h1>${d.name}</h1><p style="color:#c084fc;font-size:1.2rem;margin-bottom:8px">${d.title}</p><p>${d.bio}</p></div></div>
<div class="container">
<section><h2>Skills</h2><div class="skills">${d.skills.map(s=>`<span class="skill">${s}</span>`).join('')}</div></section>
<section><h2>Experience</h2>${d.experience.map(e=>`<div class="exp-item"><div class="exp-role">${e.role}</div><div class="exp-company">${e.company}</div><div class="exp-period">${e.period}</div><p style="color:#999;font-size:.9rem;margin-top:4px">${e.description}</p></div>`).join('')}</section>
<section><h2>Projects</h2><div class="project-grid">${d.projects.map(p=>`<div class="project-card"><div class="project-name">${p.name} <span class="stars">★ ${p.stars}</span></div><p class="project-desc">${p.description}</p><div>${p.tech.map(t=>`<span class="tech-tag">${t}</span>`).join('')}</div></div>`).join('')}</div></section>
<section><h2>Education</h2>${d.education.map(e=>`<div class="exp-item"><div class="exp-role">${e.degree}</div><div class="exp-company">${e.institution}</div><div class="exp-period">${e.period}</div></div>`).join('')}</section>
<section><h2>Volunteering</h2>${d.volunteering.map(v=>`<div class="exp-item"><div class="exp-role">${v.role}</div><div class="exp-company">${v.org}</div><div class="exp-period">${v.period}</div><p style="color:#999;font-size:.9rem;margin-top:4px">${v.description}</p></div>`).join('')}</section>
</div></body></html>`;

    case "creative":
      return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,'Times New Roman',serif;background:#fef7ed;color:#2d1b00;line-height:1.7}
.header{background:linear-gradient(135deg,#fbbf24,#f97316);padding:80px 24px;text-align:center;color:#fff}
.header h1{font-size:3rem;font-weight:700;margin-bottom:8px}.header p{opacity:.9;font-size:1.1rem}
.avatar{width:110px;height:110px;border-radius:50%;border:4px solid #fff;overflow:hidden;margin:0 auto 20px}
.avatar img{width:100%;height:100%}
.container{max-width:760px;margin:0 auto;padding:40px 24px}section{margin:48px 0}
h2{font-size:1.6rem;font-weight:700;color:#92400e;margin-bottom:20px;font-style:italic}
.skills{display:flex;flex-wrap:wrap;gap:8px}.skill{background:#fde68a;color:#92400e;padding:6px 14px;border-radius:24px;font-size:.85rem;font-weight:600}
.exp-item{background:#fff;border-radius:16px;padding:24px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,.06)}
.exp-role{font-weight:700;font-size:1.05rem}.exp-company{color:#d97706}.exp-period{color:#999;font-size:.85rem}
.project-card{background:#fff;border-radius:16px;padding:24px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,.06);border-left:4px solid #f97316}
.project-name{font-weight:700;margin-bottom:4px}.project-desc{color:#666;font-size:.9rem;margin-bottom:8px}
.tech-tag{display:inline-block;background:#fff7ed;color:#ea580c;padding:2px 8px;border-radius:4px;font-size:.75rem;margin:2px;border:1px solid #fed7aa}
</style></head><body>
<div class="header"><div class="avatar"><img src="${d.avatar}"></div><h1>${d.name}</h1><p>${d.title}</p></div>
<div class="container">
<p style="font-size:1.1rem;text-align:center;color:#666;margin:32px 0">${d.bio}</p>
<section><h2>~ Skills ~</h2><div class="skills">${d.skills.map(s=>`<span class="skill">${s}</span>`).join('')}</div></section>
<section><h2>~ Experience ~</h2>${d.experience.map(e=>`<div class="exp-item"><div class="exp-role">${e.role}</div><div class="exp-company">${e.company}</div><div class="exp-period">${e.period}</div><p style="color:#666;font-size:.9rem;margin-top:4px">${e.description}</p></div>`).join('')}</section>
<section><h2>~ Projects ~</h2>${d.projects.map(p=>`<div class="project-card"><div class="project-name">${p.name}</div><p class="project-desc">${p.description}</p><div>${p.tech.map(t=>`<span class="tech-tag">${t}</span>`).join('')}</div></div>`).join('')}</section>
<section><h2>~ Education ~</h2>${d.education.map(e=>`<div class="exp-item"><div class="exp-role">${e.degree}</div><div class="exp-company">${e.institution}</div><div class="exp-period">${e.period}</div></div>`).join('')}</section>
<section><h2>~ Volunteering ~</h2>${d.volunteering.map(v=>`<div class="exp-item"><div class="exp-role">${v.role}</div><div class="exp-company">${v.org}</div><div class="exp-period">${v.period}</div><p style="color:#666;font-size:.9rem;margin-top:4px">${v.description}</p></div>`).join('')}</section>
</div></body></html>`;

    case "developer":
      return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Courier New',monospace;background:#1e1e2e;color:#cdd6f4;line-height:1.6}
.terminal{background:#11111b;border:1px solid #313244;border-radius:12px;margin:20px;overflow:hidden}
.terminal-bar{background:#181825;padding:8px 16px;display:flex;gap:6px;align-items:center}
.dot{width:12px;height:12px;border-radius:50%}.dot-r{background:#f38ba8}.dot-y{background:#f9e2af}.dot-g{background:#a6e3a1}
.terminal-body{padding:24px}
.prompt{color:#89b4fa}.comment{color:#585b70}.string{color:#a6e3a1}.keyword{color:#cba6f7}.func{color:#f9e2af}
.container{max-width:800px;margin:0 auto;padding:40px 24px}
h1{color:#cba6f7;font-size:2rem;margin-bottom:8px}h2{color:#89b4fa;font-size:1.3rem;margin:32px 0 16px;padding-bottom:4px;border-bottom:1px solid #313244}
.skills{display:flex;flex-wrap:wrap;gap:8px}.skill{background:#313244;color:#a6e3a1;padding:4px 12px;border-radius:4px;font-size:.8rem}
.exp-item{margin-bottom:20px;padding-left:16px;border-left:2px solid #cba6f7}
.exp-role{color:#f9e2af;font-weight:700}.exp-company{color:#cba6f7}.exp-period{color:#585b70;font-size:.85rem}
.project-card{background:#181825;border:1px solid #313244;border-radius:8px;padding:16px;margin-bottom:12px}
.project-name{color:#f9e2af;font-weight:700}.project-desc{color:#a6adc8;font-size:.85rem;margin:4px 0 8px}
.tech-tag{display:inline-block;background:#1e1e2e;color:#89b4fa;padding:2px 8px;border:1px solid #313244;border-radius:4px;font-size:.7rem;margin:2px}
</style></head><body>
<div class="container">
<div class="terminal"><div class="terminal-bar"><span class="dot dot-r"></span><span class="dot dot-y"></span><span class="dot dot-g"></span><span style="color:#585b70;margin-left:8px;font-size:.8rem">portfolio.js</span></div>
<div class="terminal-body">
<p><span class="comment">// Welcome to my portfolio</span></p>
<p><span class="keyword">const</span> <span class="func">developer</span> = {</p>
<p>&nbsp;&nbsp;name: <span class="string">"${d.name}"</span>,</p>
<p>&nbsp;&nbsp;role: <span class="string">"${d.title}"</span>,</p>
<p>&nbsp;&nbsp;location: <span class="string">"${d.location}"</span></p>
<p>};</p>
</div></div>
<div style="text-align:center;margin:32px 0"><div style="width:100px;height:100px;border-radius:50%;overflow:hidden;margin:0 auto;border:2px solid #cba6f7"><img src="${d.avatar}" style="width:100%;height:100%"></div></div>
<p style="text-align:center;color:#a6adc8;margin-bottom:32px">${d.bio}</p>
<h2>$ skills --list</h2><div class="skills">${d.skills.map(s=>`<span class="skill">${s}</span>`).join('')}</div>
<h2>$ experience --all</h2>${d.experience.map(e=>`<div class="exp-item"><div class="exp-role">${e.role}</div><div class="exp-company">${e.company}</div><div class="exp-period">${e.period}</div><p style="color:#a6adc8;font-size:.85rem;margin-top:4px">${e.description}</p></div>`).join('')}
<h2>$ projects --show</h2>${d.projects.map(p=>`<div class="project-card"><div class="project-name">${p.name} <span style="color:#f9e2af;font-size:.8rem">★ ${p.stars}</span></div><p class="project-desc">${p.description}</p><div>${p.tech.map(t=>`<span class="tech-tag">${t}</span>`).join('')}</div></div>`).join('')}
<h2>$ education</h2>${d.education.map(e=>`<div class="exp-item"><div class="exp-role">${e.degree}</div><div class="exp-company">${e.institution}</div><div class="exp-period">${e.period}</div></div>`).join('')}
<h2>$ volunteering</h2>${d.volunteering.map(v=>`<div class="exp-item"><div class="exp-role">${v.role}</div><div class="exp-company">${v.org}</div><div class="exp-period">${v.period}</div><p style="color:#a6adc8;font-size:.85rem;margin-top:4px">${v.description}</p></div>`).join('')}
</div></body></html>`;

    case "elegant":
      return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Garamond','Georgia',serif;background:#0c0c0c;color:#e8e4df;line-height:1.7}
.hero{min-height:80vh;display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(180deg,#0c0c0c 0%,#1a1714 100%);border-bottom:1px solid #2a2520;padding:40px}
.hero h1{font-size:3.5rem;font-weight:400;letter-spacing:4px;text-transform:uppercase;margin-bottom:12px;color:#d4a574}
.hero p{color:#8a8078;font-size:1.1rem;letter-spacing:2px}
.avatar{width:140px;height:140px;border-radius:50%;border:2px solid #d4a574;overflow:hidden;margin:0 auto 28px}
.avatar img{width:100%;height:100%}
.container{max-width:800px;margin:0 auto;padding:60px 24px}section{margin:60px 0}
h2{font-size:1.2rem;text-transform:uppercase;letter-spacing:3px;color:#d4a574;margin-bottom:24px;text-align:center}
.divider{width:40px;height:1px;background:#d4a574;margin:0 auto 24px}
.skills{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}.skill{border:1px solid #3a3530;color:#d4a574;padding:6px 16px;border-radius:2px;font-size:.8rem;letter-spacing:1px}
.exp-item{margin-bottom:28px;text-align:center}.exp-role{font-size:1.1rem;color:#e8e4df}.exp-company{color:#d4a574;font-style:italic}.exp-period{color:#5a554e;font-size:.85rem}
.project-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.project-card{border:1px solid #2a2520;padding:24px;text-align:center;transition:border-color .3s}
.project-card:hover{border-color:#d4a574}
.project-name{color:#d4a574;font-size:1rem;letter-spacing:1px;margin-bottom:6px}.project-desc{color:#8a8078;font-size:.85rem}
@media(max-width:640px){.hero h1{font-size:2rem}.project-grid{grid-template-columns:1fr}}
</style></head><body>
<div class="hero"><div><div class="avatar"><img src="${d.avatar}"></div><h1>${d.name}</h1><p>${d.title}</p><p style="margin-top:16px;color:#5a554e;max-width:400px;margin-left:auto;margin-right:auto">${d.bio}</p></div></div>
<div class="container">
<section><h2>Expertise</h2><div class="divider"></div><div class="skills">${d.skills.map(s=>`<span class="skill">${s}</span>`).join('')}</div></section>
<section><h2>Experience</h2><div class="divider"></div>${d.experience.map(e=>`<div class="exp-item"><div class="exp-role">${e.role}</div><div class="exp-company">${e.company}</div><div class="exp-period">${e.period}</div><p style="color:#8a8078;font-size:.85rem;margin-top:4px;max-width:500px;margin-left:auto;margin-right:auto">${e.description}</p></div>`).join('')}</section>
<section><h2>Projects</h2><div class="divider"></div><div class="project-grid">${d.projects.map(p=>`<div class="project-card"><div class="project-name">${p.name}</div><p class="project-desc">${p.description}</p></div>`).join('')}</div></section>
<section><h2>Education</h2><div class="divider"></div>${d.education.map(e=>`<div class="exp-item"><div class="exp-role">${e.degree}</div><div class="exp-company">${e.institution}</div><div class="exp-period">${e.period}</div></div>`).join('')}</section>
</div></body></html>`;

    case "recruiter":
      const s = d.githubStats;
      return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',system-ui,sans-serif;background:#f8fafc;color:#1e293b;line-height:1.6}
.header{background:#fff;border-bottom:1px solid #e2e8f0;padding:24px}
.header-inner{max-width:900px;margin:0 auto;display:flex;align-items:center;gap:20px}
.avatar{width:64px;height:64px;border-radius:50%;overflow:hidden;flex-shrink:0}.avatar img{width:100%;height:100%}
h1{font-size:1.5rem;font-weight:700}
.container{max-width:900px;margin:0 auto;padding:24px}
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:32px}
.stat-card{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:16px;text-align:center}
.stat-value{font-size:1.5rem;font-weight:700;color:#6366f1}.stat-label{font-size:.75rem;color:#64748b;text-transform:uppercase;letter-spacing:1px}
h2{font-size:1.2rem;font-weight:700;margin:28px 0 12px;color:#1e293b}
.warn{background:#fef3c7;border:1px solid #fbbf24;border-radius:8px;padding:12px 16px;margin:12px 0;font-size:.9rem;color:#92400e}
.info{background:#eff6ff;border:1px solid #93c5fd;border-radius:8px;padding:12px 16px;margin:12px 0;font-size:.9rem;color:#1e40af}
.lang-bar{display:flex;border-radius:8px;overflow:hidden;height:24px;margin:8px 0}
.lang-seg{height:100%;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:600;color:#fff}
.collab{background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;margin:6px 0;font-size:.9rem}
.section-card{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:16px}
.exp-role{font-weight:600}.exp-company{color:#6366f1}.exp-period{color:#94a3b8;font-size:.85rem}
.project-name{font-weight:600}.project-desc{color:#64748b;font-size:.85rem}
.badge{display:inline-block;background:#f1f5f9;border:1px solid #e2e8f0;padding:4px 10px;border-radius:6px;font-size:.8rem;margin:2px;color:#475569}
@media(max-width:640px){.stats-grid{grid-template-columns:repeat(2,1fr)}.header-inner{flex-direction:column;text-align:center}}
</style></head><body>
<div class="header"><div class="header-inner"><div class="avatar"><img src="${d.avatar}"></div><div><h1>${d.name}</h1><p style="color:#64748b">${d.title} · ${d.location}</p></div></div></div>
<div class="container">
<h2>📊 GitHub Overview</h2>
<div class="stats-grid">
<div class="stat-card"><div class="stat-value">${s.totalCommits.toLocaleString()}</div><div class="stat-label">Total Commits</div></div>
<div class="stat-card"><div class="stat-value">${s.publicRepos}</div><div class="stat-label">Public Repos</div></div>
<div class="stat-card"><div class="stat-value">${s.privateRepos}</div><div class="stat-label">Private Repos</div></div>
<div class="stat-card"><div class="stat-value">${s.pullRequests}</div><div class="stat-label">Pull Requests</div></div>
<div class="stat-card"><div class="stat-value">${s.pushes.toLocaleString()}</div><div class="stat-label">Pushes</div></div>
<div class="stat-card"><div class="stat-value">${s.followers.toLocaleString()}</div><div class="stat-label">Followers</div></div>
<div class="stat-card"><div class="stat-value">${Math.floor(s.daysOnGithub/365)}y ${s.daysOnGithub%365}d</div><div class="stat-label">On GitHub</div></div>
<div class="stat-card"><div class="stat-value">${s.contributionStreak}d</div><div class="stat-label">Streak</div></div>
</div>

<h2>🔤 Top Languages</h2>
<div class="lang-bar">${s.topLanguages.map((l,i)=>`<div class="lang-seg" style="width:${l.percentage}%;background:${['#6366f1','#f59e0b','#10b981','#ef4444'][i]}">${l.name} ${l.percentage}%</div>`).join('')}</div>

${s.aiGeneratedContent > 0 ? `<div class="warn">⚠️ <strong>AI-Generated Content Detected:</strong> ${s.aiGeneratedContent} repositories contain potential AI-generated code patterns.</div>` : ''}

<h2>🤝 Recent Collaborations</h2>
${s.recentCollaborations.map(c=>`<div class="collab">📁 ${c}</div>`).join('')}

<h2>💼 Experience</h2>
${d.experience.map(e=>`<div class="section-card"><div class="exp-role">${e.role}</div><div class="exp-company">${e.company}</div><div class="exp-period">${e.period}</div><p style="color:#64748b;font-size:.9rem;margin-top:4px">${e.description}</p></div>`).join('')}

<h2>🎓 Education</h2>
${d.education.map(e=>`<div class="section-card"><div class="exp-role">${e.degree}</div><div class="exp-company">${e.institution}</div><div class="exp-period">${e.period}</div></div>`).join('')}

<h2>🛠️ Projects</h2>
${d.projects.map(p=>`<div class="section-card"><div class="project-name">${p.name} <span style="color:#f59e0b">★ ${p.stars}</span></div><p class="project-desc">${p.description}</p><div style="margin-top:8px">${p.tech.map(t=>`<span class="badge">${t}</span>`).join('')}</div></div>`).join('')}

<h2>🔧 Skills</h2>
<div style="margin-bottom:24px">${d.skills.map(s=>`<span class="badge">${s}</span>`).join('')}</div>
</div></body></html>`;

    default:
      return "<html><body><p>Theme not found</p></body></html>";
  }
};
