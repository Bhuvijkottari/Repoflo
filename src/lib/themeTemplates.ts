import type { PortfolioData } from "@/lib/mockData";
import { mockPortfolioData } from "@/lib/mockData";

// Get portfolio data from session or fall back to mock
const getPortfolioData = (): PortfolioData => {
  try {
    const stored = sessionStorage.getItem("portfolioData");
    if (stored) return JSON.parse(stored);
  } catch {}
  return mockPortfolioData;
};

// Shared navbar generator for all themes - with functional smooth scroll JS
const nav = (bg: string, text: string, accent: string, personName: string, links: string[] = ["About", "Skills", "Experience", "Projects", "Education", "Contact"]) =>
  `<nav style="position:sticky;top:0;z-index:100;background:${bg};padding:12px 24px;display:flex;align-items:center;justify-content:space-between;backdrop-filter:blur(12px)">
    <a href="#about" style="font-weight:700;font-size:1.1rem;color:${accent};text-decoration:none;cursor:pointer">${personName.split(' ')[0]}</a>
    <div style="display:flex;gap:16px">${links.map(l => `<a href="#${l.toLowerCase()}" onclick="event.preventDefault();document.getElementById('${l.toLowerCase()}')?.scrollIntoView({behavior:'smooth',block:'start'})" style="color:${text};text-decoration:none;font-size:.85rem;cursor:pointer;transition:color .2s" onmouseover="this.style.color='${accent}'" onmouseout="this.style.color='${text}'">${l}</a>`).join('')}</div>
  </nav>`;

// Shared sections generator
const skillsHtml = (d: PortfolioData, bg: string, color: string, border?: string) =>
  d.skills.map(s => `<span style="background:${bg};color:${color};padding:6px 14px;border-radius:20px;font-size:.85rem;display:inline-block;margin:3px${border ? `;border:1px solid ${border}` : ''}">${s}</span>`).join('');

const expHtml = (d: PortfolioData, roleColor: string, companyColor: string, descColor: string) =>
  d.experience.length ? d.experience.map(e => `<div style="margin-bottom:24px"><div style="font-weight:600;font-size:1.05rem;color:${roleColor}">${e.role}</div><div style="color:${companyColor}">${e.company}</div><div style="color:#999;font-size:.85rem">${e.period}</div><p style="color:${descColor};font-size:.9rem;margin-top:4px">${e.description}</p></div>`).join('') : `<p style="color:${descColor};font-size:.9rem">No experience data available. Add a resume to include this section.</p>`;

const projectsHtml = (d: PortfolioData, cardBg: string, cardBorder: string, nameColor: string, descColor: string, tagBg: string, tagColor: string) =>
  d.projects.map(p => `<div style="background:${cardBg};border:1px solid ${cardBorder};border-radius:12px;padding:20px;margin-bottom:12px"><div style="font-weight:600;color:${nameColor};margin-bottom:4px">${p.link ? `<a href="${p.link}" target="_blank" style="color:${nameColor};text-decoration:none">${p.name}</a>` : p.name} ${p.stars ? `<span style="color:#f59e0b;font-size:.85rem">★ ${p.stars}</span>` : ''}</div><p style="color:${descColor};font-size:.9rem;margin-bottom:8px">${p.description}</p><div>${p.tech.map(t => `<span style="display:inline-block;background:${tagBg};color:${tagColor};padding:2px 8px;border-radius:4px;font-size:.75rem;margin:2px">${t}</span>`).join('')}</div>${p.link ? `<a href="${p.link}" target="_blank" style="display:inline-block;margin-top:8px;font-size:.8rem;color:${tagColor};text-decoration:none">View on GitHub →</a>` : ''}</div>`).join('');

const eduHtml = (d: PortfolioData, roleColor: string, instColor: string) =>
  d.education.length ? d.education.map(e => `<div style="margin-bottom:20px"><div style="font-weight:600;color:${roleColor}">${e.degree}</div><div style="color:${instColor}">${e.institution}</div><div style="color:#999;font-size:.85rem">${e.period}</div></div>`).join('') : `<p style="color:${instColor};font-size:.9rem">No education data available.</p>`;

const volHtml = (d: PortfolioData, roleColor: string, orgColor: string, descColor: string) =>
  d.volunteering.length ? d.volunteering.map(v => `<div style="margin-bottom:20px"><div style="font-weight:600;color:${roleColor}">${v.role}</div><div style="color:${orgColor}">${v.org}</div><div style="color:#999;font-size:.85rem">${v.period}</div><p style="color:${descColor};font-size:.9rem;margin-top:4px">${v.description}</p></div>`).join('') : '';

const githubActivityHtml = (d: PortfolioData, cardBg: string, cardBorder: string, accentColor: string, descColor: string) => {
  const s = d.githubStats;
  if (!s) return '';
  return `<section id="github" style="margin:48px 0"><h2 style="color:${accentColor};font-size:1.4rem;font-weight:600;margin-bottom:20px">GitHub Activity</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:20px">
    ${[[s.totalCommits.toLocaleString(),'Commits'],[s.publicRepos,'Repos'],[s.followers.toLocaleString(),'Followers'],[s.pullRequests,'PRs'],
      [`${Math.floor(s.daysOnGithub/365)}y ${s.daysOnGithub%365}d`,'On GitHub']].map(([v,l]) =>
      `<div style="background:${cardBg};border:1px solid ${cardBorder};border-radius:10px;padding:14px;text-align:center"><div style="font-size:1.3rem;font-weight:700;color:${accentColor}">${v}</div><div style="font-size:.7rem;color:${descColor};text-transform:uppercase;letter-spacing:1px;margin-top:2px">${l}</div></div>`).join('')}
  </div>
  ${s.topLanguages.length ? `<div style="display:flex;border-radius:8px;overflow:hidden;height:22px;margin-bottom:16px">${s.topLanguages.map((l,i) => `<div style="width:${l.percentage}%;height:100%;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:600;color:#fff;background:${['#6366f1','#f59e0b','#10b981','#ef4444'][i]}">${l.name} ${l.percentage}%</div>`).join('')}</div>` : ''}
  ${s.recentCollaborations.length ? `<p style="font-size:.85rem;color:${descColor};margin-top:8px">Recent collaborations: ${s.recentCollaborations.join(', ')}</p>` : ''}
  </section>`;
};

const contactSection = (d: PortfolioData, bg: string, textColor: string, accentColor: string) =>
  `<section id="contact" style="padding:48px 0;text-align:center"><h2 style="color:${accentColor};margin-bottom:16px">Contact</h2>
  <p style="color:${textColor}">Email: ${d.email}</p><p style="color:${textColor}">Location: ${d.location}</p>
  <div style="margin-top:16px;display:flex;gap:12px;justify-content:center">
    ${d.github ? `<a href="${d.github}" style="color:${accentColor};text-decoration:none" target="_blank">GitHub</a>` : ''}
    ${d.linkedin ? `<a href="${d.linkedin}" style="color:${accentColor};text-decoration:none" target="_blank">LinkedIn</a>` : ''}
    ${d.website ? `<a href="${d.website}" style="color:${accentColor};text-decoration:none" target="_blank">Website</a>` : ''}
  </div></section>`;

const baseStyle = `*{margin:0;padding:0;box-sizing:border-box;scroll-behavior:smooth}img{max-width:100%}a{transition:opacity .2s}a:hover{opacity:.8}`;

const wrapTheme = (fontImport: string, fontFamily: string, body: string) =>
  `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${fontImport}<style>${baseStyle}body{font-family:${fontFamily};line-height:1.6}</style></head><body>${body}</body></html>`;

export const getThemeHtml = (themeId: string, customData?: PortfolioData): string => {
  const d = customData || getPortfolioData();

  switch (themeId) {
    case "recruiter": {
      const s = d.githubStats || { totalCommits: 0, publicRepos: 0, privateRepos: 0, followers: 0, following: 0, pullRequests: 0, pushes: 0, daysOnGithub: 0, recentCollaborations: [], aiGeneratedContent: 0, topLanguages: [], contributionStreak: 0 };
      return wrapTheme('', "'Segoe UI',system-ui,sans-serif", `
        <div style="background:#f8fafc;color:#1e293b;min-height:100vh">
        ${nav('rgba(255,255,255,.9)', '#475569', '#6366f1', d.name, ['Overview', 'Languages', 'Experience', 'Projects', 'Skills'])}
        <div style="background:#fff;border-bottom:1px solid #e2e8f0;padding:24px"><div style="max-width:900px;margin:0 auto;display:flex;align-items:center;gap:20px">
          <div style="width:64px;height:64px;border-radius:50%;overflow:hidden;flex-shrink:0"><img src="${d.avatar}" style="width:100%;height:100%"></div>
          <div><h1 style="font-size:1.5rem;font-weight:700">${d.name}</h1><p style="color:#64748b">${d.title} · ${d.location}</p></div></div></div>
        <div style="max-width:900px;margin:0 auto;padding:24px">
          <h2 id="overview" style="font-size:1.2rem;font-weight:700;margin:28px 0 12px">GitHub Overview</h2>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:32px">
            ${[
              [s.totalCommits.toLocaleString(), 'Total Commits'],
              [s.publicRepos, 'Public Repos'],
              [s.privateRepos, 'Private Repos'],
              [s.pullRequests, 'Pull Requests'],
              [s.pushes.toLocaleString(), 'Pushes'],
              [s.followers.toLocaleString(), 'Followers'],
              [`${Math.floor(s.daysOnGithub/365)}y ${s.daysOnGithub%365}d`, 'On GitHub'],
              [`${s.contributionStreak}d`, 'Streak'],
            ].map(([v,l]) => `<div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:16px;text-align:center"><div style="font-size:1.5rem;font-weight:700;color:#6366f1">${v}</div><div style="font-size:.75rem;color:#64748b;text-transform:uppercase;letter-spacing:1px">${l}</div></div>`).join('')}
          </div>
          <h2 id="languages" style="font-size:1.2rem;font-weight:700;margin:28px 0 12px">Top Languages</h2>
          ${s.topLanguages.length ? `<div style="display:flex;border-radius:8px;overflow:hidden;height:24px;margin:8px 0">${s.topLanguages.map((l:any,i:number) => `<div style="width:${l.percentage}%;height:100%;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:600;color:#fff;background:${['#6366f1','#f59e0b','#10b981','#ef4444'][i]}">${l.name} ${l.percentage}%</div>`).join('')}</div>` : '<p style="color:#64748b">No language data</p>'}
          ${s.aiGeneratedContent > 0 ? `<div style="background:#fef3c7;border:1px solid #fbbf24;border-radius:8px;padding:12px 16px;margin:12px 0;font-size:.9rem;color:#92400e"><strong>AI-Generated Content Detected:</strong> ${s.aiGeneratedContent} repositories contain potential AI-generated code patterns.</div>` : ''}
          ${s.recentCollaborations.length ? `<h2 style="font-size:1.2rem;font-weight:700;margin:28px 0 12px">Recent Collaborations</h2>${s.recentCollaborations.map((c:string) => `<div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;margin:6px 0;font-size:.9rem">${c}</div>`).join('')}` : ''}
          <h2 id="experience" style="font-size:1.2rem;font-weight:700;margin:28px 0 12px">Experience</h2>
          ${d.experience.map(e => `<div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:16px"><div style="font-weight:600">${e.role}</div><div style="color:#6366f1">${e.company}</div><div style="color:#94a3b8;font-size:.85rem">${e.period}</div><p style="color:#64748b;font-size:.9rem;margin-top:4px">${e.description}</p></div>`).join('') || '<p style="color:#64748b">No experience data. Upload a resume to add this.</p>'}
          <h2 style="font-size:1.2rem;font-weight:700;margin:28px 0 12px">Education</h2>
          ${d.education.map(e => `<div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:16px"><div style="font-weight:600">${e.degree}</div><div style="color:#6366f1">${e.institution}</div><div style="color:#94a3b8;font-size:.85rem">${e.period}</div></div>`).join('') || '<p style="color:#64748b">No education data.</p>'}
          <h2 id="projects" style="font-size:1.2rem;font-weight:700;margin:28px 0 12px">Projects</h2>
          ${d.projects.map(p => `<div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:16px"><div style="font-weight:600">${p.name} ${p.stars ? `<span style="color:#f59e0b">★ ${p.stars}</span>` : ''}</div><p style="color:#64748b;font-size:.85rem">${p.description}</p><div style="margin-top:8px">${p.tech.map(t => `<span style="display:inline-block;background:#f1f5f9;border:1px solid #e2e8f0;padding:4px 10px;border-radius:6px;font-size:.8rem;margin:2px;color:#475569">${t}</span>`).join('')}</div></div>`).join('')}
          <h2 id="skills" style="font-size:1.2rem;font-weight:700;margin:28px 0 12px">Skills</h2>
          <div style="margin-bottom:24px">${d.skills.map(s => `<span style="display:inline-block;background:#f1f5f9;border:1px solid #e2e8f0;padding:4px 10px;border-radius:6px;font-size:.8rem;margin:2px;color:#475569">${s}</span>`).join('')}</div>
        </div></div>`);
    }

    case "minimal":
      return wrapTheme('<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">', "'Inter',sans-serif", `
        <div style="background:#fafafa;color:#1a1a1a;min-height:100vh">
        ${nav('rgba(250,250,250,.9)', '#666', '#1a1a1a', d.name)}
        <div style="max-width:720px;margin:0 auto;padding:40px 24px">
          <div id="about" style="text-align:center;padding:60px 0 40px"><div style="width:120px;height:120px;border-radius:50%;margin:0 auto 20px;overflow:hidden"><img src="${d.avatar}" style="width:100%;height:100%"></div>
            <h1 style="font-size:2.5rem;font-weight:700;margin-bottom:8px">${d.name}</h1><p style="color:#666;font-size:1.1rem;margin-bottom:12px">${d.title}</p><p style="color:#888;max-width:500px;margin:0 auto">${d.bio}</p></div>
          <section id="skills" style="margin:48px 0"><h2 style="font-size:1.4rem;font-weight:600;margin-bottom:20px;padding-bottom:8px;border-bottom:2px solid #eee">Skills</h2><div>${skillsHtml(d, '#f0f0f0', '#333')}</div></section>
          <section id="experience" style="margin:48px 0"><h2 style="font-size:1.4rem;font-weight:600;margin-bottom:20px;padding-bottom:8px;border-bottom:2px solid #eee">Experience</h2>${expHtml(d, '#1a1a1a', '#666', '#666')}</section>
          <section id="projects" style="margin:48px 0"><h2 style="font-size:1.4rem;font-weight:600;margin-bottom:20px;padding-bottom:8px;border-bottom:2px solid #eee">Projects</h2>${projectsHtml(d, '#fff', '#eee', '#1a1a1a', '#666', '#f5f5f5', '#888')}</section>
          ${githubActivityHtml(d, '#fff', '#eee', '#1a1a1a', '#666')}
          <section id="education" style="margin:48px 0"><h2 style="font-size:1.4rem;font-weight:600;margin-bottom:20px;padding-bottom:8px;border-bottom:2px solid #eee">Education</h2>${eduHtml(d, '#1a1a1a', '#666')}</section>
          ${d.volunteering.length ? `<section id="volunteering" style="margin:48px 0"><h2 style="font-size:1.4rem;font-weight:600;margin-bottom:20px;padding-bottom:8px;border-bottom:2px solid #eee">Volunteering</h2>${volHtml(d, '#1a1a1a', '#666', '#666')}</section>` : ''}
          ${contactSection(d, '#fafafa', '#666', '#1a1a1a')}
        </div></div>`);

    case "bold":
      return wrapTheme('', "'Segoe UI',system-ui,sans-serif", `
        <div style="background:#0a0a0a;color:#fff;min-height:100vh">
        ${nav('rgba(10,10,10,.9)', '#999', '#a855f7', d.name)}
        <div id="about" style="min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(135deg,#0a0a0a 0%,#1a0a2e 50%,#0a1628 100%);padding:40px 24px">
          <div><div style="width:130px;height:130px;border-radius:50%;overflow:hidden;margin:0 auto 24px;border:3px solid #a855f7"><img src="${d.avatar}" style="width:100%;height:100%"></div>
            <h1 style="font-size:3.5rem;font-weight:800;background:linear-gradient(135deg,#a855f7,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:12px">${d.name}</h1>
            <p style="color:#c084fc;font-size:1.2rem;margin-bottom:8px">${d.title}</p><p style="color:#999;max-width:500px;margin:0 auto">${d.bio}</p></div>
        </div>
        <div style="max-width:800px;margin:0 auto;padding:40px 24px">
          <section id="skills" style="margin:60px 0"><h2 style="font-size:1.8rem;font-weight:700;margin-bottom:24px;background:linear-gradient(135deg,#a855f7,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Skills</h2><div>${skillsHtml(d, 'rgba(168,85,247,.15)', '#c084fc', 'rgba(168,85,247,.3)')}</div></section>
          <section id="experience" style="margin:60px 0"><h2 style="font-size:1.8rem;font-weight:700;margin-bottom:24px;background:linear-gradient(135deg,#a855f7,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Experience</h2>${expHtml(d, '#fff', '#a855f7', '#999')}</section>
          <section id="projects" style="margin:60px 0"><h2 style="font-size:1.8rem;font-weight:700;margin-bottom:24px;background:linear-gradient(135deg,#a855f7,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Projects</h2>${projectsHtml(d, 'rgba(255,255,255,.05)', 'rgba(255,255,255,.1)', '#fff', '#999', 'rgba(59,130,246,.15)', '#60a5fa')}</section>
          ${githubActivityHtml(d, 'rgba(255,255,255,.05)', 'rgba(255,255,255,.1)', '#a855f7', '#999')}
          <section id="education" style="margin:60px 0"><h2 style="font-size:1.8rem;font-weight:700;margin-bottom:24px;background:linear-gradient(135deg,#a855f7,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Education</h2>${eduHtml(d, '#fff', '#a855f7')}</section>
          ${contactSection(d, '#0a0a0a', '#999', '#a855f7')}
        </div></div>`);

    case "creative":
      return wrapTheme('', "Georgia,'Times New Roman',serif", `
        <div style="background:#fef7ed;color:#2d1b00;min-height:100vh">
        ${nav('rgba(254,247,237,.9)', '#92400e', '#f97316', d.name)}
        <div id="about" style="background:linear-gradient(135deg,#fbbf24,#f97316);padding:80px 24px;text-align:center;color:#fff">
          <div style="width:110px;height:110px;border-radius:50%;border:4px solid #fff;overflow:hidden;margin:0 auto 20px"><img src="${d.avatar}" style="width:100%;height:100%"></div>
          <h1 style="font-size:3rem;font-weight:700;margin-bottom:8px">${d.name}</h1><p style="opacity:.9;font-size:1.1rem">${d.title}</p></div>
        <div style="max-width:760px;margin:0 auto;padding:40px 24px">
          <p style="font-size:1.1rem;text-align:center;color:#666;margin:32px 0">${d.bio}</p>
          <section id="skills" style="margin:48px 0"><h2 style="font-size:1.6rem;font-weight:700;color:#92400e;margin-bottom:20px;font-style:italic">~ Skills ~</h2><div>${skillsHtml(d, '#fde68a', '#92400e')}</div></section>
          <section id="experience" style="margin:48px 0"><h2 style="font-size:1.6rem;font-weight:700;color:#92400e;margin-bottom:20px;font-style:italic">~ Experience ~</h2>${expHtml(d, '#2d1b00', '#d97706', '#666')}</section>
          <section id="projects" style="margin:48px 0"><h2 style="font-size:1.6rem;font-weight:700;color:#92400e;margin-bottom:20px;font-style:italic">~ Projects ~</h2>${projectsHtml(d, '#fff', '#fed7aa', '#2d1b00', '#666', '#fff7ed', '#ea580c')}</section>
          ${githubActivityHtml(d, '#fff', '#fed7aa', '#92400e', '#666')}
          <section id="education" style="margin:48px 0"><h2 style="font-size:1.6rem;font-weight:700;color:#92400e;margin-bottom:20px;font-style:italic">~ Education ~</h2>${eduHtml(d, '#2d1b00', '#d97706')}</section>
          ${contactSection(d, '#fef7ed', '#666', '#f97316')}
        </div></div>`);

    case "developer":
      return wrapTheme('', "'Courier New',monospace", `
        <div style="background:#1e1e2e;color:#cdd6f4;min-height:100vh">
        ${nav('rgba(30,30,46,.95)', '#a6adc8', '#cba6f7', d.name, ['About', 'Skills', 'Experience', 'Projects'])}
        <div style="max-width:800px;margin:0 auto;padding:40px 24px">
          <div id="about" style="background:#11111b;border:1px solid #313244;border-radius:12px;overflow:hidden;margin-bottom:32px">
            <div style="background:#181825;padding:8px 16px;display:flex;gap:6px;align-items:center"><span style="width:12px;height:12px;border-radius:50%;background:#f38ba8;display:inline-block"></span><span style="width:12px;height:12px;border-radius:50%;background:#f9e2af;display:inline-block"></span><span style="width:12px;height:12px;border-radius:50%;background:#a6e3a1;display:inline-block"></span><span style="color:#585b70;margin-left:8px;font-size:.8rem">portfolio.js</span></div>
            <div style="padding:24px"><p><span style="color:#585b70">// Welcome to my portfolio</span></p><p><span style="color:#cba6f7">const</span> <span style="color:#f9e2af">developer</span> = {</p><p>&nbsp;&nbsp;name: <span style="color:#a6e3a1">"${d.name}"</span>,</p><p>&nbsp;&nbsp;role: <span style="color:#a6e3a1">"${d.title}"</span>,</p><p>&nbsp;&nbsp;location: <span style="color:#a6e3a1">"${d.location}"</span></p><p>};</p></div>
          </div>
          <div style="text-align:center;margin:32px 0"><div style="width:100px;height:100px;border-radius:50%;overflow:hidden;margin:0 auto;border:2px solid #cba6f7"><img src="${d.avatar}" style="width:100%;height:100%"></div></div>
          <p style="text-align:center;color:#a6adc8;margin-bottom:32px">${d.bio}</p>
          <h2 id="skills" style="color:#89b4fa;font-size:1.3rem;margin:32px 0 16px;padding-bottom:4px;border-bottom:1px solid #313244">$ skills --list</h2><div>${skillsHtml(d, '#313244', '#a6e3a1')}</div>
          <h2 id="experience" style="color:#89b4fa;font-size:1.3rem;margin:32px 0 16px;padding-bottom:4px;border-bottom:1px solid #313244">$ experience --all</h2>${expHtml(d, '#f9e2af', '#cba6f7', '#a6adc8')}
          <h2 id="projects" style="color:#89b4fa;font-size:1.3rem;margin:32px 0 16px;padding-bottom:4px;border-bottom:1px solid #313244">$ projects --show</h2>${projectsHtml(d, '#181825', '#313244', '#f9e2af', '#a6adc8', '#1e1e2e', '#89b4fa')}
          ${githubActivityHtml(d, '#181825', '#313244', '#89b4fa', '#a6adc8')}
          <h2 style="color:#89b4fa;font-size:1.3rem;margin:32px 0 16px;padding-bottom:4px;border-bottom:1px solid #313244">$ education</h2>${eduHtml(d, '#f9e2af', '#cba6f7')}
          ${contactSection(d, '#1e1e2e', '#a6adc8', '#cba6f7')}
        </div></div>`);

    case "elegant":
      return wrapTheme('', "'Garamond','Georgia',serif", `
        <div style="background:#0c0c0c;color:#e8e4df;min-height:100vh">
        ${nav('rgba(12,12,12,.9)', '#8a8078', '#d4a574', d.name)}
        <div id="about" style="min-height:80vh;display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(180deg,#0c0c0c 0%,#1a1714 100%);border-bottom:1px solid #2a2520;padding:40px">
          <div><div style="width:140px;height:140px;border-radius:50%;border:2px solid #d4a574;overflow:hidden;margin:0 auto 28px"><img src="${d.avatar}" style="width:100%;height:100%"></div>
            <h1 style="font-size:3.5rem;font-weight:400;letter-spacing:4px;text-transform:uppercase;margin-bottom:12px;color:#d4a574">${d.name}</h1>
            <p style="color:#8a8078;font-size:1.1rem;letter-spacing:2px">${d.title}</p><p style="margin-top:16px;color:#5a554e;max-width:400px;margin-left:auto;margin-right:auto">${d.bio}</p></div>
        </div>
        <div style="max-width:800px;margin:0 auto;padding:60px 24px">
          <section id="skills" style="margin:60px 0;text-align:center"><h2 style="font-size:1.2rem;text-transform:uppercase;letter-spacing:3px;color:#d4a574;margin-bottom:24px">Expertise</h2><div style="width:40px;height:1px;background:#d4a574;margin:0 auto 24px"></div><div style="text-align:center">${skillsHtml(d, 'transparent', '#d4a574', '#3a3530')}</div></section>
          <section id="experience" style="margin:60px 0;text-align:center"><h2 style="font-size:1.2rem;text-transform:uppercase;letter-spacing:3px;color:#d4a574;margin-bottom:24px">Experience</h2><div style="width:40px;height:1px;background:#d4a574;margin:0 auto 24px"></div>${expHtml(d, '#e8e4df', '#d4a574', '#8a8078')}</section>
          <section id="projects" style="margin:60px 0;text-align:center"><h2 style="font-size:1.2rem;text-transform:uppercase;letter-spacing:3px;color:#d4a574;margin-bottom:24px">Projects</h2><div style="width:40px;height:1px;background:#d4a574;margin:0 auto 24px"></div>${projectsHtml(d, 'transparent', '#2a2520', '#d4a574', '#8a8078', '#1a1714', '#d4a574')}</section>
          ${githubActivityHtml(d, 'transparent', '#2a2520', '#d4a574', '#8a8078')}
          <section id="education" style="margin:60px 0;text-align:center"><h2 style="font-size:1.2rem;text-transform:uppercase;letter-spacing:3px;color:#d4a574;margin-bottom:24px">Education</h2><div style="width:40px;height:1px;background:#d4a574;margin:0 auto 24px"></div>${eduHtml(d, '#e8e4df', '#d4a574')}</section>
          ${contactSection(d, '#0c0c0c', '#8a8078', '#d4a574')}
        </div></div>`);

    case "neon":
      return wrapTheme('<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet">', "'Rajdhani',sans-serif", `
        <div style="background:#0a0a1a;color:#e0e0ff;min-height:100vh">
        ${nav('rgba(10,10,26,.95)', '#888', '#0ff', d.name)}
        <div id="about" style="text-align:center;padding:100px 24px;background:radial-gradient(ellipse at center,rgba(0,255,255,.05) 0%,transparent 70%)">
          <div style="width:120px;height:120px;border-radius:50%;overflow:hidden;margin:0 auto 24px;border:3px solid #0ff;box-shadow:0 0 30px rgba(0,255,255,.3)"><img src="${d.avatar}" style="width:100%;height:100%"></div>
          <h1 style="font-family:'Orbitron',sans-serif;font-size:3rem;font-weight:900;color:#0ff;text-shadow:0 0 20px rgba(0,255,255,.5);margin-bottom:8px">${d.name}</h1>
          <p style="color:#f0f;font-size:1.1rem;text-shadow:0 0 10px rgba(255,0,255,.3)">${d.title}</p><p style="color:#888;margin-top:12px;max-width:500px;margin-left:auto;margin-right:auto">${d.bio}</p></div>
        <div style="max-width:800px;margin:0 auto;padding:40px 24px">
          <section id="skills" style="margin:48px 0"><h2 style="font-family:'Orbitron',sans-serif;color:#0ff;font-size:1.3rem;margin-bottom:20px;text-shadow:0 0 10px rgba(0,255,255,.3)">SKILLS</h2><div>${skillsHtml(d, 'rgba(0,255,255,.1)', '#0ff', 'rgba(0,255,255,.3)')}</div></section>
          <section id="experience" style="margin:48px 0"><h2 style="font-family:'Orbitron',sans-serif;color:#0ff;font-size:1.3rem;margin-bottom:20px">EXPERIENCE</h2>${expHtml(d, '#e0e0ff', '#f0f', '#888')}</section>
          <section id="projects" style="margin:48px 0"><h2 style="font-family:'Orbitron',sans-serif;color:#0ff;font-size:1.3rem;margin-bottom:20px">PROJECTS</h2>${projectsHtml(d, 'rgba(0,255,255,.05)', 'rgba(0,255,255,.15)', '#0ff', '#888', 'rgba(255,0,255,.1)', '#f0f')}</section>
          ${githubActivityHtml(d, 'rgba(0,255,255,.05)', 'rgba(0,255,255,.15)', '#0ff', '#888')}
          <section id="education" style="margin:48px 0"><h2 style="font-family:'Orbitron',sans-serif;color:#0ff;font-size:1.3rem;margin-bottom:20px">EDUCATION</h2>${eduHtml(d, '#e0e0ff', '#f0f')}</section>
          ${contactSection(d, '#0a0a1a', '#888', '#0ff')}
        </div></div>`);

    case "ocean":
      return wrapTheme('<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">', "'Nunito',sans-serif", `
        <div style="background:#f0f9ff;color:#0c4a6e;min-height:100vh">
        ${nav('rgba(240,249,255,.9)', '#0369a1', '#0284c7', d.name)}
        <div id="about" style="background:linear-gradient(135deg,#0284c7,#14b8a6);padding:80px 24px;text-align:center;color:#fff">
          <div style="width:120px;height:120px;border-radius:50%;border:4px solid #fff;overflow:hidden;margin:0 auto 20px"><img src="${d.avatar}" style="width:100%;height:100%"></div>
          <h1 style="font-size:2.8rem;font-weight:800;margin-bottom:8px">${d.name}</h1><p style="opacity:.9;font-size:1.1rem">${d.title}</p><p style="opacity:.8;margin-top:8px;max-width:400px;margin-left:auto;margin-right:auto">${d.bio}</p></div>
        <div style="max-width:760px;margin:0 auto;padding:40px 24px">
          <section id="skills" style="margin:48px 0"><h2 style="color:#0284c7;font-size:1.4rem;font-weight:700;margin-bottom:20px">Skills</h2><div>${skillsHtml(d, '#e0f2fe', '#0369a1')}</div></section>
          <section id="experience" style="margin:48px 0"><h2 style="color:#0284c7;font-size:1.4rem;font-weight:700;margin-bottom:20px">Experience</h2>${expHtml(d, '#0c4a6e', '#0284c7', '#64748b')}</section>
          <section id="projects" style="margin:48px 0"><h2 style="color:#0284c7;font-size:1.4rem;font-weight:700;margin-bottom:20px">Projects</h2>${projectsHtml(d, '#fff', '#e0f2fe', '#0c4a6e', '#64748b', '#f0f9ff', '#0369a1')}</section>
          ${githubActivityHtml(d, '#fff', '#e0f2fe', '#0284c7', '#64748b')}
          <section id="education" style="margin:48px 0"><h2 style="color:#0284c7;font-size:1.4rem;font-weight:700;margin-bottom:20px">Education</h2>${eduHtml(d, '#0c4a6e', '#0284c7')}</section>
          ${contactSection(d, '#f0f9ff', '#64748b', '#0284c7')}
        </div></div>`);

    case "sunset":
      return wrapTheme('<link href="https://fonts.googleapis.com/css2?family=Prata&family=Work+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">', "'Work Sans',sans-serif", `
        <div style="background:#fff5f5;color:#1a1a2e;min-height:100vh">
        ${nav('rgba(255,245,245,.9)', '#9f1239', '#e11d48', d.name)}
        <div id="about" style="background:linear-gradient(135deg,#fb923c,#f43f5e);padding:80px 24px;text-align:center;color:#fff">
          <div style="width:120px;height:120px;border-radius:50%;border:4px solid rgba(255,255,255,.5);overflow:hidden;margin:0 auto 20px"><img src="${d.avatar}" style="width:100%;height:100%"></div>
          <h1 style="font-family:'Prata',serif;font-size:3rem;font-weight:400;margin-bottom:8px">${d.name}</h1><p style="opacity:.9">${d.title}</p></div>
        <div style="max-width:760px;margin:0 auto;padding:40px 24px">
          <p style="text-align:center;color:#666;margin:24px 0">${d.bio}</p>
          <section id="skills" style="margin:48px 0"><h2 style="color:#e11d48;font-size:1.4rem;margin-bottom:20px">Skills</h2><div>${skillsHtml(d, '#ffe4e6', '#9f1239')}</div></section>
          <section id="experience" style="margin:48px 0"><h2 style="color:#e11d48;font-size:1.4rem;margin-bottom:20px">Experience</h2>${expHtml(d, '#1a1a2e', '#e11d48', '#666')}</section>
          <section id="projects" style="margin:48px 0"><h2 style="color:#e11d48;font-size:1.4rem;margin-bottom:20px">Projects</h2>${projectsHtml(d, '#fff', '#ffe4e6', '#1a1a2e', '#666', '#fff1f2', '#e11d48')}</section>
          ${githubActivityHtml(d, '#fff', '#ffe4e6', '#e11d48', '#666')}
          <section id="education" style="margin:48px 0"><h2 style="color:#e11d48;font-size:1.4rem;margin-bottom:20px">Education</h2>${eduHtml(d, '#1a1a2e', '#e11d48')}</section>
          ${contactSection(d, '#fff5f5', '#666', '#e11d48')}
        </div></div>`);

    case "forest":
      return wrapTheme('<link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap" rel="stylesheet">', "'Lora',serif", `
        <div style="background:#f0fdf4;color:#14532d;min-height:100vh">
        ${nav('rgba(240,253,244,.9)', '#166534', '#16a34a', d.name)}
        <div id="about" style="background:linear-gradient(135deg,#16a34a,#065f46);padding:80px 24px;text-align:center;color:#fff">
          <div style="width:120px;height:120px;border-radius:50%;border:4px solid rgba(255,255,255,.4);overflow:hidden;margin:0 auto 20px"><img src="${d.avatar}" style="width:100%;height:100%"></div>
          <h1 style="font-size:2.8rem;font-weight:700;margin-bottom:8px">${d.name}</h1><p style="opacity:.9">${d.title}</p></div>
        <div style="max-width:760px;margin:0 auto;padding:40px 24px">
          <p style="text-align:center;color:#666;margin:24px 0">${d.bio}</p>
          <section id="skills" style="margin:48px 0"><h2 style="color:#16a34a;font-size:1.4rem;margin-bottom:20px">Skills</h2><div>${skillsHtml(d, '#dcfce7', '#166534')}</div></section>
          <section id="experience" style="margin:48px 0"><h2 style="color:#16a34a;font-size:1.4rem;margin-bottom:20px">Experience</h2>${expHtml(d, '#14532d', '#16a34a', '#666')}</section>
          <section id="projects" style="margin:48px 0"><h2 style="color:#16a34a;font-size:1.4rem;margin-bottom:20px">Projects</h2>${projectsHtml(d, '#fff', '#dcfce7', '#14532d', '#666', '#f0fdf4', '#166534')}</section>
          <section id="education" style="margin:48px 0"><h2 style="color:#16a34a;font-size:1.4rem;margin-bottom:20px">Education</h2>${eduHtml(d, '#14532d', '#16a34a')}</section>
          ${contactSection(d, '#f0fdf4', '#666', '#16a34a')}
        </div></div>`);

    // Remaining themes use a factory pattern for brevity
    default:
      return generateGenericTheme(themeId, d);
  }
};

function generateGenericTheme(themeId: string, d: PortfolioData): string {
  const themeConfigs: Record<string, { bg: string; text: string; accent: string; headerGrad: string; font: string; fontImport: string; skillBg: string; skillColor: string; cardBg: string; cardBorder: string; tagBg: string; tagColor: string }> = {
    cherry: { bg: '#1a0a0e', text: '#fecdd3', accent: '#f43f5e', headerGrad: 'radial-gradient(ellipse at center,rgba(244,63,94,.1) 0%,transparent 70%)', font: "'Segoe UI',sans-serif", fontImport: '', skillBg: 'rgba(244,63,94,.15)', skillColor: '#fda4af', cardBg: 'rgba(244,63,94,.05)', cardBorder: 'rgba(244,63,94,.15)', tagBg: 'rgba(244,63,94,.1)', tagColor: '#f43f5e' },
    lavender: { bg: '#faf5ff', text: '#3b0764', accent: '#8b5cf6', headerGrad: 'linear-gradient(135deg,#8b5cf6,#a855f7)', font: "'Quicksand',sans-serif", fontImport: '<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet">', skillBg: '#ede9fe', skillColor: '#6d28d9', cardBg: '#fff', cardBorder: '#ede9fe', tagBg: '#faf5ff', tagColor: '#7c3aed' },
    midnight: { bg: '#0f172a', text: '#cbd5e1', accent: '#60a5fa', headerGrad: 'linear-gradient(180deg,#0f172a,#1e293b)', font: "'Space Mono',monospace", fontImport: '<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">', skillBg: 'rgba(96,165,250,.1)', skillColor: '#93c5fd', cardBg: 'rgba(96,165,250,.05)', cardBorder: 'rgba(96,165,250,.15)', tagBg: 'rgba(96,165,250,.1)', tagColor: '#93c5fd' },
    coral: { bg: '#fff7ed', text: '#431407', accent: '#ea580c', headerGrad: 'linear-gradient(135deg,#ef4444,#f97316)', font: "'Outfit',sans-serif", fontImport: '<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">', skillBg: '#ffedd5', skillColor: '#c2410c', cardBg: '#fff', cardBorder: '#ffedd5', tagBg: '#fff7ed', tagColor: '#c2410c' },
    arctic: { bg: '#f0f9ff', text: '#0c4a6e', accent: '#06b6d4', headerGrad: 'linear-gradient(135deg,#67e8f9,#38bdf8)', font: "'Cabin',sans-serif", fontImport: '<link href="https://fonts.googleapis.com/css2?family=Cabin:wght@400;500;600;700&display=swap" rel="stylesheet">', skillBg: '#ecfeff', skillColor: '#155e75', cardBg: '#fff', cardBorder: '#ecfeff', tagBg: '#f0f9ff', tagColor: '#0891b2' },
    mocha: { bg: '#1c1410', text: '#d4c5b0', accent: '#d4a574', headerGrad: 'linear-gradient(180deg,#1c1410,#2a1f17)', font: "'Source Sans 3',sans-serif", fontImport: '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+3:wght@400;500;600&display=swap" rel="stylesheet">', skillBg: 'rgba(212,165,116,.1)', skillColor: '#d4a574', cardBg: 'rgba(212,165,116,.05)', cardBorder: 'rgba(212,165,116,.15)', tagBg: 'rgba(212,165,116,.1)', tagColor: '#d4a574' },
    sakura: { bg: '#fff1f2', text: '#4a1d2e', accent: '#ec4899', headerGrad: 'linear-gradient(135deg,#f9a8d4,#f472b6)', font: "'Noto Sans JP',sans-serif", fontImport: '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">', skillBg: '#fce7f3', skillColor: '#be185d', cardBg: '#fff', cardBorder: '#fce7f3', tagBg: '#fff1f2', tagColor: '#db2777' },
    graphite: { bg: '#18181b', text: '#d4d4d8', accent: '#e4e4e7', headerGrad: 'linear-gradient(180deg,#18181b,#27272a)', font: "'IBM Plex Sans',sans-serif", fontImport: '<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">', skillBg: '#27272a', skillColor: '#d4d4d8', cardBg: '#27272a', cardBorder: '#3f3f46', tagBg: '#18181b', tagColor: '#a1a1aa' },
    emerald: { bg: '#052e16', text: '#bbf7d0', accent: '#10b981', headerGrad: 'radial-gradient(ellipse at center,rgba(16,185,129,.1) 0%,transparent 70%)', font: "'Open Sans',sans-serif", fontImport: '<link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">', skillBg: 'rgba(16,185,129,.15)', skillColor: '#86efac', cardBg: 'rgba(16,185,129,.05)', cardBorder: 'rgba(16,185,129,.15)', tagBg: 'rgba(16,185,129,.1)', tagColor: '#10b981' },
    royal: { bg: '#1e1b4b', text: '#c7d2fe', accent: '#818cf8', headerGrad: 'linear-gradient(180deg,#1e1b4b,#312e81)', font: "'Raleway',sans-serif", fontImport: '<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:wght@400;500;600&display=swap" rel="stylesheet">', skillBg: 'rgba(129,140,248,.1)', skillColor: '#a5b4fc', cardBg: 'rgba(129,140,248,.05)', cardBorder: 'rgba(129,140,248,.15)', tagBg: 'rgba(129,140,248,.1)', tagColor: '#a5b4fc' },
    rocket: { bg: '#020617', text: '#cbd5e1', accent: '#f97316', headerGrad: 'none', font: "'Exo 2',sans-serif", fontImport: '<link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800&display=swap" rel="stylesheet">', skillBg: 'rgba(249,115,22,.1)', skillColor: '#fb923c', cardBg: 'rgba(249,115,22,.05)', cardBorder: 'rgba(249,115,22,.15)', tagBg: 'rgba(249,115,22,.1)', tagColor: '#fb923c' },
  };

  const cfg = themeConfigs[themeId];
  if (!cfg) return "<html><body><p>Theme not found</p></body></html>";

  const isDark = ['cherry', 'midnight', 'mocha', 'graphite', 'emerald', 'royal', 'rocket'].includes(themeId);
  const descColor = isDark ? '#888' : '#666';
  const headerTextColor = isDark ? cfg.text : '#fff';
  const headerIsGradient = cfg.headerGrad.includes('linear-gradient') || cfg.headerGrad.includes('radial-gradient');

  return wrapTheme(cfg.fontImport, cfg.font, `
    <div style="background:${cfg.bg};color:${cfg.text};min-height:100vh${themeId === 'rocket' ? ";background-image:radial-gradient(1px 1px at 20px 30px,#334155,transparent),radial-gradient(1px 1px at 40px 70px,#475569,transparent),radial-gradient(1px 1px at 80px 40px,#334155,transparent);background-size:300px 150px" : ''}">
    ${nav(isDark ? `rgba(${hexToRgb(cfg.bg)},.95)` : `rgba(${hexToRgb(cfg.bg)},.9)`, isDark ? '#888' : cfg.text, cfg.accent, d.name)}
    <div id="about" style="text-align:center;padding:100px 24px;${headerIsGradient ? `background:${cfg.headerGrad}` : ''}${!isDark && headerIsGradient ? ';color:#fff' : ''}">
      <div style="width:120px;height:120px;border-radius:50%;overflow:hidden;margin:0 auto 24px;border:3px solid ${cfg.accent}${isDark ? `;box-shadow:0 0 30px ${cfg.accent}33` : ''}"><img src="${d.avatar}" style="width:100%;height:100%"></div>
      <h1 style="font-size:2.8rem;font-weight:700;color:${!isDark && headerIsGradient ? '#fff' : cfg.accent};margin-bottom:8px">${d.name}</h1>
      <p style="color:${!isDark && headerIsGradient ? 'rgba(255,255,255,.9)' : cfg.accent};font-size:1.1rem">${d.title}</p>
      <p style="color:${!isDark && headerIsGradient ? 'rgba(255,255,255,.7)' : descColor};margin-top:12px;max-width:500px;margin-left:auto;margin-right:auto">${d.bio}</p>
    </div>
    <div style="max-width:800px;margin:0 auto;padding:40px 24px">
      <section id="skills" style="margin:48px 0"><h2 style="color:${cfg.accent};font-size:1.3rem;margin-bottom:20px">Skills</h2><div>${skillsHtml(d, cfg.skillBg, cfg.skillColor, cfg.cardBorder)}</div></section>
      <section id="experience" style="margin:48px 0"><h2 style="color:${cfg.accent};font-size:1.3rem;margin-bottom:20px">Experience</h2>${expHtml(d, cfg.text, cfg.accent, descColor)}</section>
      <section id="projects" style="margin:48px 0"><h2 style="color:${cfg.accent};font-size:1.3rem;margin-bottom:20px">Projects</h2>${projectsHtml(d, cfg.cardBg, cfg.cardBorder, cfg.text, descColor, cfg.tagBg, cfg.tagColor)}</section>
      <section id="education" style="margin:48px 0"><h2 style="color:${cfg.accent};font-size:1.3rem;margin-bottom:20px">Education</h2>${eduHtml(d, cfg.text, cfg.accent)}</section>
      ${contactSection(d, cfg.bg, descColor, cfg.accent)}
    </div></div>`);
}

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}
