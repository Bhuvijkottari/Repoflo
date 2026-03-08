import { mockPortfolioData } from "@/lib/mockData";

const d = mockPortfolioData;

// Shared navbar generator for all themes
const nav = (bg: string, text: string, accent: string, links: string[] = ["About", "Skills", "Experience", "Projects", "Education", "Contact"]) =>
  `<nav style="position:sticky;top:0;z-index:100;background:${bg};padding:12px 24px;display:flex;align-items:center;justify-content:space-between;backdrop-filter:blur(12px)">
    <span style="font-weight:700;font-size:1.1rem;color:${accent}">${d.name.split(' ')[0]}</span>
    <div style="display:flex;gap:16px">${links.map(l => `<a href="#${l.toLowerCase()}" style="color:${text};text-decoration:none;font-size:.85rem;transition:color .2s" onmouseover="this.style.color='${accent}'" onmouseout="this.style.color='${text}'">${l}</a>`).join('')}</div>
  </nav>`;

// Shared sections generator
const skillsHtml = (bg: string, color: string, border?: string) =>
  d.skills.map(s => `<span style="background:${bg};color:${color};padding:6px 14px;border-radius:20px;font-size:.85rem;display:inline-block;margin:3px${border ? `;border:1px solid ${border}` : ''}">${s}</span>`).join('');

const expHtml = (roleColor: string, companyColor: string, descColor: string) =>
  d.experience.map(e => `<div style="margin-bottom:24px"><div style="font-weight:600;font-size:1.05rem;color:${roleColor}">${e.role}</div><div style="color:${companyColor}">${e.company}</div><div style="color:#999;font-size:.85rem">${e.period}</div><p style="color:${descColor};font-size:.9rem;margin-top:4px">${e.description}</p></div>`).join('');

const projectsHtml = (cardBg: string, cardBorder: string, nameColor: string, descColor: string, tagBg: string, tagColor: string) =>
  d.projects.map(p => `<div style="background:${cardBg};border:1px solid ${cardBorder};border-radius:12px;padding:20px;margin-bottom:12px"><div style="font-weight:600;color:${nameColor};margin-bottom:4px">${p.name} <span style="color:#f59e0b;font-size:.85rem">★ ${p.stars}</span></div><p style="color:${descColor};font-size:.9rem;margin-bottom:8px">${p.description}</p><div>${p.tech.map(t => `<span style="display:inline-block;background:${tagBg};color:${tagColor};padding:2px 8px;border-radius:4px;font-size:.75rem;margin:2px">${t}</span>`).join('')}</div></div>`).join('');

const eduHtml = (roleColor: string, instColor: string) =>
  d.education.map(e => `<div style="margin-bottom:20px"><div style="font-weight:600;color:${roleColor}">${e.degree}</div><div style="color:${instColor}">${e.institution}</div><div style="color:#999;font-size:.85rem">${e.period}</div></div>`).join('');

const volHtml = (roleColor: string, orgColor: string, descColor: string) =>
  d.volunteering.map(v => `<div style="margin-bottom:20px"><div style="font-weight:600;color:${roleColor}">${v.role}</div><div style="color:${orgColor}">${v.org}</div><div style="color:#999;font-size:.85rem">${v.period}</div><p style="color:${descColor};font-size:.9rem;margin-top:4px">${v.description}</p></div>`).join('');

const contactSection = (bg: string, textColor: string, accentColor: string) =>
  `<section id="contact" style="padding:48px 0;text-align:center"><h2 style="color:${accentColor};margin-bottom:16px">Contact</h2>
  <p style="color:${textColor}">📧 ${d.email}</p><p style="color:${textColor}">📍 ${d.location}</p>
  <div style="margin-top:16px;display:flex;gap:12px;justify-content:center">
    <a href="${d.github}" style="color:${accentColor};text-decoration:none" target="_blank">GitHub</a>
    <a href="${d.linkedin}" style="color:${accentColor};text-decoration:none" target="_blank">LinkedIn</a>
    <a href="${d.website}" style="color:${accentColor};text-decoration:none" target="_blank">Website</a>
  </div></section>`;

const baseStyle = `*{margin:0;padding:0;box-sizing:border-box;scroll-behavior:smooth}img{max-width:100%}a{transition:opacity .2s}a:hover{opacity:.8}`;

const wrapTheme = (fontImport: string, fontFamily: string, body: string) =>
  `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${fontImport}<style>${baseStyle}body{font-family:${fontFamily};line-height:1.6}</style></head><body>${body}</body></html>`;

export const getThemeHtml = (themeId: string): string => {
  switch (themeId) {
    case "recruiter": {
      const s = d.githubStats;
      return wrapTheme('', "'Segoe UI',system-ui,sans-serif", `
        <div style="background:#f8fafc;color:#1e293b;min-height:100vh">
        ${nav('rgba(255,255,255,.9)', '#475569', '#6366f1', ['Overview', 'Languages', 'Experience', 'Projects', 'Skills'])}
        <div style="background:#fff;border-bottom:1px solid #e2e8f0;padding:24px"><div style="max-width:900px;margin:0 auto;display:flex;align-items:center;gap:20px">
          <div style="width:64px;height:64px;border-radius:50%;overflow:hidden;flex-shrink:0"><img src="${d.avatar}" style="width:100%;height:100%"></div>
          <div><h1 style="font-size:1.5rem;font-weight:700">${d.name}</h1><p style="color:#64748b">${d.title} · ${d.location}</p></div></div></div>
        <div style="max-width:900px;margin:0 auto;padding:24px">
          <h2 id="overview" style="font-size:1.2rem;font-weight:700;margin:28px 0 12px">📊 GitHub Overview</h2>
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
          <h2 id="languages" style="font-size:1.2rem;font-weight:700;margin:28px 0 12px">🔤 Top Languages</h2>
          <div style="display:flex;border-radius:8px;overflow:hidden;height:24px;margin:8px 0">${s.topLanguages.map((l:any,i:number) => `<div style="width:${l.percentage}%;height:100%;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:600;color:#fff;background:${['#6366f1','#f59e0b','#10b981','#ef4444'][i]}">${l.name} ${l.percentage}%</div>`).join('')}</div>
          ${s.aiGeneratedContent > 0 ? `<div style="background:#fef3c7;border:1px solid #fbbf24;border-radius:8px;padding:12px 16px;margin:12px 0;font-size:.9rem;color:#92400e">⚠️ <strong>AI-Generated Content Detected:</strong> ${s.aiGeneratedContent} repositories contain potential AI-generated code patterns.</div>` : ''}
          <h2 style="font-size:1.2rem;font-weight:700;margin:28px 0 12px">🤝 Recent Collaborations</h2>
          ${s.recentCollaborations.map((c:string) => `<div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;margin:6px 0;font-size:.9rem">📁 ${c}</div>`).join('')}
          <h2 id="experience" style="font-size:1.2rem;font-weight:700;margin:28px 0 12px">💼 Experience</h2>
          ${d.experience.map(e => `<div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:16px"><div style="font-weight:600">${e.role}</div><div style="color:#6366f1">${e.company}</div><div style="color:#94a3b8;font-size:.85rem">${e.period}</div><p style="color:#64748b;font-size:.9rem;margin-top:4px">${e.description}</p></div>`).join('')}
          <h2 style="font-size:1.2rem;font-weight:700;margin:28px 0 12px">🎓 Education</h2>
          ${d.education.map(e => `<div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:16px"><div style="font-weight:600">${e.degree}</div><div style="color:#6366f1">${e.institution}</div><div style="color:#94a3b8;font-size:.85rem">${e.period}</div></div>`).join('')}
          <h2 id="projects" style="font-size:1.2rem;font-weight:700;margin:28px 0 12px">🛠️ Projects</h2>
          ${d.projects.map(p => `<div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:16px"><div style="font-weight:600">${p.name} <span style="color:#f59e0b">★ ${p.stars}</span></div><p style="color:#64748b;font-size:.85rem">${p.description}</p><div style="margin-top:8px">${p.tech.map(t => `<span style="display:inline-block;background:#f1f5f9;border:1px solid #e2e8f0;padding:4px 10px;border-radius:6px;font-size:.8rem;margin:2px;color:#475569">${t}</span>`).join('')}</div></div>`).join('')}
          <h2 id="skills" style="font-size:1.2rem;font-weight:700;margin:28px 0 12px">🔧 Skills</h2>
          <div style="margin-bottom:24px">${d.skills.map(s => `<span style="display:inline-block;background:#f1f5f9;border:1px solid #e2e8f0;padding:4px 10px;border-radius:6px;font-size:.8rem;margin:2px;color:#475569">${s}</span>`).join('')}</div>
        </div></div>`);
    }

    case "minimal":
      return wrapTheme('<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">', "'Inter',sans-serif", `
        <div style="background:#fafafa;color:#1a1a1a;min-height:100vh">
        ${nav('rgba(250,250,250,.9)', '#666', '#1a1a1a')}
        <div style="max-width:720px;margin:0 auto;padding:40px 24px">
          <div id="about" style="text-align:center;padding:60px 0 40px"><div style="width:120px;height:120px;border-radius:50%;margin:0 auto 20px;overflow:hidden"><img src="${d.avatar}" style="width:100%;height:100%"></div>
            <h1 style="font-size:2.5rem;font-weight:700;margin-bottom:8px">${d.name}</h1><p style="color:#666;font-size:1.1rem;margin-bottom:12px">${d.title}</p><p style="color:#888;max-width:500px;margin:0 auto">${d.bio}</p></div>
          <section id="skills" style="margin:48px 0"><h2 style="font-size:1.4rem;font-weight:600;margin-bottom:20px;padding-bottom:8px;border-bottom:2px solid #eee">Skills</h2><div>${skillsHtml('#f0f0f0', '#333')}</div></section>
          <section id="experience" style="margin:48px 0"><h2 style="font-size:1.4rem;font-weight:600;margin-bottom:20px;padding-bottom:8px;border-bottom:2px solid #eee">Experience</h2>${expHtml('#1a1a1a', '#666', '#666')}</section>
          <section id="projects" style="margin:48px 0"><h2 style="font-size:1.4rem;font-weight:600;margin-bottom:20px;padding-bottom:8px;border-bottom:2px solid #eee">Projects</h2>${projectsHtml('#fff', '#eee', '#1a1a1a', '#666', '#f5f5f5', '#888')}</section>
          <section id="education" style="margin:48px 0"><h2 style="font-size:1.4rem;font-weight:600;margin-bottom:20px;padding-bottom:8px;border-bottom:2px solid #eee">Education</h2>${eduHtml('#1a1a1a', '#666')}</section>
          <section id="volunteering" style="margin:48px 0"><h2 style="font-size:1.4rem;font-weight:600;margin-bottom:20px;padding-bottom:8px;border-bottom:2px solid #eee">Volunteering</h2>${volHtml('#1a1a1a', '#666', '#666')}</section>
          ${contactSection('#fafafa', '#666', '#1a1a1a')}
        </div></div>`);

    case "bold":
      return wrapTheme('', "'Segoe UI',system-ui,sans-serif", `
        <div style="background:#0a0a0a;color:#fff;min-height:100vh">
        ${nav('rgba(10,10,10,.9)', '#999', '#a855f7')}
        <div id="about" style="min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(135deg,#0a0a0a 0%,#1a0a2e 50%,#0a1628 100%);padding:40px 24px">
          <div><div style="width:130px;height:130px;border-radius:50%;overflow:hidden;margin:0 auto 24px;border:3px solid #a855f7"><img src="${d.avatar}" style="width:100%;height:100%"></div>
            <h1 style="font-size:3.5rem;font-weight:800;background:linear-gradient(135deg,#a855f7,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:12px">${d.name}</h1>
            <p style="color:#c084fc;font-size:1.2rem;margin-bottom:8px">${d.title}</p><p style="color:#999;max-width:500px;margin:0 auto">${d.bio}</p></div>
        </div>
        <div style="max-width:800px;margin:0 auto;padding:40px 24px">
          <section id="skills" style="margin:60px 0"><h2 style="font-size:1.8rem;font-weight:700;margin-bottom:24px;background:linear-gradient(135deg,#a855f7,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Skills</h2><div>${skillsHtml('rgba(168,85,247,.15)', '#c084fc', 'rgba(168,85,247,.3)')}</div></section>
          <section id="experience" style="margin:60px 0"><h2 style="font-size:1.8rem;font-weight:700;margin-bottom:24px;background:linear-gradient(135deg,#a855f7,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Experience</h2>${expHtml('#fff', '#a855f7', '#999')}</section>
          <section id="projects" style="margin:60px 0"><h2 style="font-size:1.8rem;font-weight:700;margin-bottom:24px;background:linear-gradient(135deg,#a855f7,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Projects</h2>${projectsHtml('rgba(255,255,255,.05)', 'rgba(255,255,255,.1)', '#fff', '#999', 'rgba(59,130,246,.15)', '#60a5fa')}</section>
          <section id="education" style="margin:60px 0"><h2 style="font-size:1.8rem;font-weight:700;margin-bottom:24px;background:linear-gradient(135deg,#a855f7,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Education</h2>${eduHtml('#fff', '#a855f7')}</section>
          ${contactSection('#0a0a0a', '#999', '#a855f7')}
        </div></div>`);

    case "creative":
      return wrapTheme('', "Georgia,'Times New Roman',serif", `
        <div style="background:#fef7ed;color:#2d1b00;min-height:100vh">
        ${nav('rgba(254,247,237,.9)', '#92400e', '#f97316')}
        <div id="about" style="background:linear-gradient(135deg,#fbbf24,#f97316);padding:80px 24px;text-align:center;color:#fff">
          <div style="width:110px;height:110px;border-radius:50%;border:4px solid #fff;overflow:hidden;margin:0 auto 20px"><img src="${d.avatar}" style="width:100%;height:100%"></div>
          <h1 style="font-size:3rem;font-weight:700;margin-bottom:8px">${d.name}</h1><p style="opacity:.9;font-size:1.1rem">${d.title}</p></div>
        <div style="max-width:760px;margin:0 auto;padding:40px 24px">
          <p style="font-size:1.1rem;text-align:center;color:#666;margin:32px 0">${d.bio}</p>
          <section id="skills" style="margin:48px 0"><h2 style="font-size:1.6rem;font-weight:700;color:#92400e;margin-bottom:20px;font-style:italic">~ Skills ~</h2><div>${skillsHtml('#fde68a', '#92400e')}</div></section>
          <section id="experience" style="margin:48px 0"><h2 style="font-size:1.6rem;font-weight:700;color:#92400e;margin-bottom:20px;font-style:italic">~ Experience ~</h2>${expHtml('#2d1b00', '#d97706', '#666')}</section>
          <section id="projects" style="margin:48px 0"><h2 style="font-size:1.6rem;font-weight:700;color:#92400e;margin-bottom:20px;font-style:italic">~ Projects ~</h2>${projectsHtml('#fff', '#fed7aa', '#2d1b00', '#666', '#fff7ed', '#ea580c')}</section>
          <section id="education" style="margin:48px 0"><h2 style="font-size:1.6rem;font-weight:700;color:#92400e;margin-bottom:20px;font-style:italic">~ Education ~</h2>${eduHtml('#2d1b00', '#d97706')}</section>
          ${contactSection('#fef7ed', '#666', '#f97316')}
        </div></div>`);

    case "developer":
      return wrapTheme('', "'Courier New',monospace", `
        <div style="background:#1e1e2e;color:#cdd6f4;min-height:100vh">
        ${nav('rgba(30,30,46,.95)', '#a6adc8', '#cba6f7', ['About', 'Skills', 'Experience', 'Projects'])}
        <div style="max-width:800px;margin:0 auto;padding:40px 24px">
          <div id="about" style="background:#11111b;border:1px solid #313244;border-radius:12px;overflow:hidden;margin-bottom:32px">
            <div style="background:#181825;padding:8px 16px;display:flex;gap:6px;align-items:center"><span style="width:12px;height:12px;border-radius:50%;background:#f38ba8;display:inline-block"></span><span style="width:12px;height:12px;border-radius:50%;background:#f9e2af;display:inline-block"></span><span style="width:12px;height:12px;border-radius:50%;background:#a6e3a1;display:inline-block"></span><span style="color:#585b70;margin-left:8px;font-size:.8rem">portfolio.js</span></div>
            <div style="padding:24px"><p><span style="color:#585b70">// Welcome to my portfolio</span></p><p><span style="color:#cba6f7">const</span> <span style="color:#f9e2af">developer</span> = {</p><p>&nbsp;&nbsp;name: <span style="color:#a6e3a1">"${d.name}"</span>,</p><p>&nbsp;&nbsp;role: <span style="color:#a6e3a1">"${d.title}"</span>,</p><p>&nbsp;&nbsp;location: <span style="color:#a6e3a1">"${d.location}"</span></p><p>};</p></div>
          </div>
          <div style="text-align:center;margin:32px 0"><div style="width:100px;height:100px;border-radius:50%;overflow:hidden;margin:0 auto;border:2px solid #cba6f7"><img src="${d.avatar}" style="width:100%;height:100%"></div></div>
          <p style="text-align:center;color:#a6adc8;margin-bottom:32px">${d.bio}</p>
          <h2 id="skills" style="color:#89b4fa;font-size:1.3rem;margin:32px 0 16px;padding-bottom:4px;border-bottom:1px solid #313244">$ skills --list</h2><div>${skillsHtml('#313244', '#a6e3a1')}</div>
          <h2 id="experience" style="color:#89b4fa;font-size:1.3rem;margin:32px 0 16px;padding-bottom:4px;border-bottom:1px solid #313244">$ experience --all</h2>${expHtml('#f9e2af', '#cba6f7', '#a6adc8')}
          <h2 id="projects" style="color:#89b4fa;font-size:1.3rem;margin:32px 0 16px;padding-bottom:4px;border-bottom:1px solid #313244">$ projects --show</h2>${projectsHtml('#181825', '#313244', '#f9e2af', '#a6adc8', '#1e1e2e', '#89b4fa')}
          <h2 style="color:#89b4fa;font-size:1.3rem;margin:32px 0 16px;padding-bottom:4px;border-bottom:1px solid #313244">$ education</h2>${eduHtml('#f9e2af', '#cba6f7')}
          ${contactSection('#1e1e2e', '#a6adc8', '#cba6f7')}
        </div></div>`);

    case "elegant":
      return wrapTheme('', "'Garamond','Georgia',serif", `
        <div style="background:#0c0c0c;color:#e8e4df;min-height:100vh">
        ${nav('rgba(12,12,12,.9)', '#8a8078', '#d4a574')}
        <div id="about" style="min-height:80vh;display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(180deg,#0c0c0c 0%,#1a1714 100%);border-bottom:1px solid #2a2520;padding:40px">
          <div><div style="width:140px;height:140px;border-radius:50%;border:2px solid #d4a574;overflow:hidden;margin:0 auto 28px"><img src="${d.avatar}" style="width:100%;height:100%"></div>
            <h1 style="font-size:3.5rem;font-weight:400;letter-spacing:4px;text-transform:uppercase;margin-bottom:12px;color:#d4a574">${d.name}</h1>
            <p style="color:#8a8078;font-size:1.1rem;letter-spacing:2px">${d.title}</p><p style="margin-top:16px;color:#5a554e;max-width:400px;margin-left:auto;margin-right:auto">${d.bio}</p></div>
        </div>
        <div style="max-width:800px;margin:0 auto;padding:60px 24px">
          <section id="skills" style="margin:60px 0;text-align:center"><h2 style="font-size:1.2rem;text-transform:uppercase;letter-spacing:3px;color:#d4a574;margin-bottom:24px">Expertise</h2><div style="width:40px;height:1px;background:#d4a574;margin:0 auto 24px"></div><div style="text-align:center">${skillsHtml('transparent', '#d4a574', '#3a3530')}</div></section>
          <section id="experience" style="margin:60px 0;text-align:center"><h2 style="font-size:1.2rem;text-transform:uppercase;letter-spacing:3px;color:#d4a574;margin-bottom:24px">Experience</h2><div style="width:40px;height:1px;background:#d4a574;margin:0 auto 24px"></div>${expHtml('#e8e4df', '#d4a574', '#8a8078')}</section>
          <section id="projects" style="margin:60px 0;text-align:center"><h2 style="font-size:1.2rem;text-transform:uppercase;letter-spacing:3px;color:#d4a574;margin-bottom:24px">Projects</h2><div style="width:40px;height:1px;background:#d4a574;margin:0 auto 24px"></div>${projectsHtml('transparent', '#2a2520', '#d4a574', '#8a8078', '#1a1714', '#d4a574')}</section>
          <section id="education" style="margin:60px 0;text-align:center"><h2 style="font-size:1.2rem;text-transform:uppercase;letter-spacing:3px;color:#d4a574;margin-bottom:24px">Education</h2><div style="width:40px;height:1px;background:#d4a574;margin:0 auto 24px"></div>${eduHtml('#e8e4df', '#d4a574')}</section>
          ${contactSection('#0c0c0c', '#8a8078', '#d4a574')}
        </div></div>`);

    case "neon":
      return wrapTheme('<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet">', "'Rajdhani',sans-serif", `
        <div style="background:#0a0a1a;color:#e0e0ff;min-height:100vh">
        ${nav('rgba(10,10,26,.95)', '#888', '#0ff')}
        <div id="about" style="text-align:center;padding:100px 24px;background:radial-gradient(ellipse at center,rgba(0,255,255,.05) 0%,transparent 70%)">
          <div style="width:120px;height:120px;border-radius:50%;overflow:hidden;margin:0 auto 24px;border:3px solid #0ff;box-shadow:0 0 30px rgba(0,255,255,.3)"><img src="${d.avatar}" style="width:100%;height:100%"></div>
          <h1 style="font-family:'Orbitron',sans-serif;font-size:3rem;font-weight:900;color:#0ff;text-shadow:0 0 20px rgba(0,255,255,.5);margin-bottom:8px">${d.name}</h1>
          <p style="color:#f0f;font-size:1.1rem;text-shadow:0 0 10px rgba(255,0,255,.3)">${d.title}</p><p style="color:#888;margin-top:12px;max-width:500px;margin-left:auto;margin-right:auto">${d.bio}</p></div>
        <div style="max-width:800px;margin:0 auto;padding:40px 24px">
          <section id="skills" style="margin:48px 0"><h2 style="font-family:'Orbitron',sans-serif;color:#0ff;font-size:1.3rem;margin-bottom:20px;text-shadow:0 0 10px rgba(0,255,255,.3)">SKILLS</h2><div>${skillsHtml('rgba(0,255,255,.1)', '#0ff', 'rgba(0,255,255,.3)')}</div></section>
          <section id="experience" style="margin:48px 0"><h2 style="font-family:'Orbitron',sans-serif;color:#0ff;font-size:1.3rem;margin-bottom:20px">EXPERIENCE</h2>${expHtml('#e0e0ff', '#f0f', '#888')}</section>
          <section id="projects" style="margin:48px 0"><h2 style="font-family:'Orbitron',sans-serif;color:#0ff;font-size:1.3rem;margin-bottom:20px">PROJECTS</h2>${projectsHtml('rgba(0,255,255,.05)', 'rgba(0,255,255,.15)', '#0ff', '#888', 'rgba(255,0,255,.1)', '#f0f')}</section>
          <section id="education" style="margin:48px 0"><h2 style="font-family:'Orbitron',sans-serif;color:#0ff;font-size:1.3rem;margin-bottom:20px">EDUCATION</h2>${eduHtml('#e0e0ff', '#f0f')}</section>
          ${contactSection('#0a0a1a', '#888', '#0ff')}
        </div></div>`);

    case "ocean":
      return wrapTheme('<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">', "'Nunito',sans-serif", `
        <div style="background:#f0f9ff;color:#0c4a6e;min-height:100vh">
        ${nav('rgba(240,249,255,.9)', '#0369a1', '#0284c7')}
        <div id="about" style="background:linear-gradient(135deg,#0284c7,#14b8a6);padding:80px 24px;text-align:center;color:#fff">
          <div style="width:120px;height:120px;border-radius:50%;border:4px solid #fff;overflow:hidden;margin:0 auto 20px"><img src="${d.avatar}" style="width:100%;height:100%"></div>
          <h1 style="font-size:2.8rem;font-weight:800;margin-bottom:8px">${d.name}</h1><p style="opacity:.9;font-size:1.1rem">${d.title}</p><p style="opacity:.8;margin-top:8px;max-width:400px;margin-left:auto;margin-right:auto">${d.bio}</p></div>
        <div style="max-width:760px;margin:0 auto;padding:40px 24px">
          <section id="skills" style="margin:48px 0"><h2 style="color:#0284c7;font-size:1.4rem;font-weight:700;margin-bottom:20px">Skills</h2><div>${skillsHtml('#e0f2fe', '#0369a1')}</div></section>
          <section id="experience" style="margin:48px 0"><h2 style="color:#0284c7;font-size:1.4rem;font-weight:700;margin-bottom:20px">Experience</h2>${expHtml('#0c4a6e', '#0284c7', '#64748b')}</section>
          <section id="projects" style="margin:48px 0"><h2 style="color:#0284c7;font-size:1.4rem;font-weight:700;margin-bottom:20px">Projects</h2>${projectsHtml('#fff', '#e0f2fe', '#0c4a6e', '#64748b', '#f0f9ff', '#0369a1')}</section>
          <section id="education" style="margin:48px 0"><h2 style="color:#0284c7;font-size:1.4rem;font-weight:700;margin-bottom:20px">Education</h2>${eduHtml('#0c4a6e', '#0284c7')}</section>
          ${contactSection('#f0f9ff', '#64748b', '#0284c7')}
        </div></div>`);

    case "sunset":
      return wrapTheme('<link href="https://fonts.googleapis.com/css2?family=Prata&family=Work+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">', "'Work Sans',sans-serif", `
        <div style="background:#fff5f5;color:#1a1a2e;min-height:100vh">
        ${nav('rgba(255,245,245,.9)', '#9f1239', '#e11d48')}
        <div id="about" style="background:linear-gradient(135deg,#fb923c,#f43f5e);padding:80px 24px;text-align:center;color:#fff">
          <div style="width:120px;height:120px;border-radius:50%;border:4px solid rgba(255,255,255,.5);overflow:hidden;margin:0 auto 20px"><img src="${d.avatar}" style="width:100%;height:100%"></div>
          <h1 style="font-family:'Prata',serif;font-size:3rem;font-weight:400;margin-bottom:8px">${d.name}</h1><p style="opacity:.9">${d.title}</p></div>
        <div style="max-width:760px;margin:0 auto;padding:40px 24px">
          <p style="text-align:center;color:#666;margin:24px 0">${d.bio}</p>
          <section id="skills" style="margin:48px 0"><h2 style="color:#e11d48;font-size:1.4rem;margin-bottom:20px">Skills</h2><div>${skillsHtml('#ffe4e6', '#9f1239')}</div></section>
          <section id="experience" style="margin:48px 0"><h2 style="color:#e11d48;font-size:1.4rem;margin-bottom:20px">Experience</h2>${expHtml('#1a1a2e', '#e11d48', '#666')}</section>
          <section id="projects" style="margin:48px 0"><h2 style="color:#e11d48;font-size:1.4rem;margin-bottom:20px">Projects</h2>${projectsHtml('#fff', '#ffe4e6', '#1a1a2e', '#666', '#fff1f2', '#e11d48')}</section>
          <section id="education" style="margin:48px 0"><h2 style="color:#e11d48;font-size:1.4rem;margin-bottom:20px">Education</h2>${eduHtml('#1a1a2e', '#e11d48')}</section>
          ${contactSection('#fff5f5', '#666', '#e11d48')}
        </div></div>`);

    case "forest":
      return wrapTheme('<link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap" rel="stylesheet">', "'Lora',serif", `
        <div style="background:#f0fdf4;color:#14532d;min-height:100vh">
        ${nav('rgba(240,253,244,.9)', '#166534', '#16a34a')}
        <div id="about" style="background:linear-gradient(135deg,#16a34a,#065f46);padding:80px 24px;text-align:center;color:#fff">
          <div style="width:120px;height:120px;border-radius:50%;border:4px solid rgba(255,255,255,.4);overflow:hidden;margin:0 auto 20px"><img src="${d.avatar}" style="width:100%;height:100%"></div>
          <h1 style="font-size:2.8rem;font-weight:700;margin-bottom:8px">${d.name}</h1><p style="opacity:.9">${d.title}</p></div>
        <div style="max-width:760px;margin:0 auto;padding:40px 24px">
          <p style="text-align:center;color:#666;margin:24px 0">${d.bio}</p>
          <section id="skills" style="margin:48px 0"><h2 style="color:#16a34a;font-size:1.4rem;margin-bottom:20px">Skills</h2><div>${skillsHtml('#dcfce7', '#166534')}</div></section>
          <section id="experience" style="margin:48px 0"><h2 style="color:#16a34a;font-size:1.4rem;margin-bottom:20px">Experience</h2>${expHtml('#14532d', '#16a34a', '#666')}</section>
          <section id="projects" style="margin:48px 0"><h2 style="color:#16a34a;font-size:1.4rem;margin-bottom:20px">Projects</h2>${projectsHtml('#fff', '#dcfce7', '#14532d', '#666', '#f0fdf4', '#166534')}</section>
          <section id="education" style="margin:48px 0"><h2 style="color:#16a34a;font-size:1.4rem;margin-bottom:20px">Education</h2>${eduHtml('#14532d', '#16a34a')}</section>
          ${contactSection('#f0fdf4', '#666', '#16a34a')}
        </div></div>`);

    case "cherry":
      return wrapTheme('', "'Segoe UI',sans-serif", `
        <div style="background:#1a0a0e;color:#fecdd3;min-height:100vh">
        ${nav('rgba(26,10,14,.95)', '#fda4af', '#f43f5e')}
        <div id="about" style="text-align:center;padding:100px 24px;background:radial-gradient(ellipse at center,rgba(244,63,94,.1) 0%,transparent 70%)">
          <div style="width:120px;height:120px;border-radius:50%;overflow:hidden;margin:0 auto 24px;border:3px solid #f43f5e"><img src="${d.avatar}" style="width:100%;height:100%"></div>
          <h1 style="font-size:3rem;font-weight:800;color:#f43f5e;margin-bottom:8px">${d.name}</h1><p style="color:#fda4af">${d.title}</p><p style="color:#888;margin-top:12px;max-width:500px;margin-left:auto;margin-right:auto">${d.bio}</p></div>
        <div style="max-width:800px;margin:0 auto;padding:40px 24px">
          <section id="skills" style="margin:48px 0"><h2 style="color:#f43f5e;font-size:1.3rem;margin-bottom:20px">Skills</h2><div>${skillsHtml('rgba(244,63,94,.15)', '#fda4af', 'rgba(244,63,94,.3)')}</div></section>
          <section id="experience" style="margin:48px 0"><h2 style="color:#f43f5e;font-size:1.3rem;margin-bottom:20px">Experience</h2>${expHtml('#fecdd3', '#f43f5e', '#888')}</section>
          <section id="projects" style="margin:48px 0"><h2 style="color:#f43f5e;font-size:1.3rem;margin-bottom:20px">Projects</h2>${projectsHtml('rgba(244,63,94,.05)', 'rgba(244,63,94,.15)', '#fda4af', '#888', 'rgba(244,63,94,.1)', '#f43f5e')}</section>
          <section id="education" style="margin:48px 0"><h2 style="color:#f43f5e;font-size:1.3rem;margin-bottom:20px">Education</h2>${eduHtml('#fecdd3', '#f43f5e')}</section>
          ${contactSection('#1a0a0e', '#888', '#f43f5e')}
        </div></div>`);

    case "lavender":
      return wrapTheme('<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet">', "'Quicksand',sans-serif", `
        <div style="background:#faf5ff;color:#3b0764;min-height:100vh">
        ${nav('rgba(250,245,255,.9)', '#7c3aed', '#8b5cf6')}
        <div id="about" style="background:linear-gradient(135deg,#8b5cf6,#a855f7);padding:80px 24px;text-align:center;color:#fff">
          <div style="width:120px;height:120px;border-radius:50%;border:4px solid rgba(255,255,255,.4);overflow:hidden;margin:0 auto 20px"><img src="${d.avatar}" style="width:100%;height:100%"></div>
          <h1 style="font-size:2.8rem;font-weight:700;margin-bottom:8px">${d.name}</h1><p style="opacity:.9">${d.title}</p></div>
        <div style="max-width:760px;margin:0 auto;padding:40px 24px">
          <p style="text-align:center;color:#666;margin:24px 0">${d.bio}</p>
          <section id="skills" style="margin:48px 0"><h2 style="color:#8b5cf6;font-size:1.4rem;margin-bottom:20px">Skills</h2><div>${skillsHtml('#ede9fe', '#6d28d9')}</div></section>
          <section id="experience" style="margin:48px 0"><h2 style="color:#8b5cf6;font-size:1.4rem;margin-bottom:20px">Experience</h2>${expHtml('#3b0764', '#8b5cf6', '#666')}</section>
          <section id="projects" style="margin:48px 0"><h2 style="color:#8b5cf6;font-size:1.4rem;margin-bottom:20px">Projects</h2>${projectsHtml('#fff', '#ede9fe', '#3b0764', '#666', '#faf5ff', '#7c3aed')}</section>
          <section id="education" style="margin:48px 0"><h2 style="color:#8b5cf6;font-size:1.4rem;margin-bottom:20px">Education</h2>${eduHtml('#3b0764', '#8b5cf6')}</section>
          ${contactSection('#faf5ff', '#666', '#8b5cf6')}
        </div></div>`);

    case "midnight":
      return wrapTheme('<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">', "'Space Mono',monospace", `
        <div style="background:#0f172a;color:#cbd5e1;min-height:100vh">
        ${nav('rgba(15,23,42,.95)', '#94a3b8', '#60a5fa')}
        <div id="about" style="text-align:center;padding:100px 24px;background:linear-gradient(180deg,#0f172a,#1e293b)">
          <div style="width:120px;height:120px;border-radius:50%;overflow:hidden;margin:0 auto 24px;border:2px solid #60a5fa"><img src="${d.avatar}" style="width:100%;height:100%"></div>
          <h1 style="font-size:2.5rem;font-weight:700;color:#f8fafc;margin-bottom:8px">${d.name}</h1><p style="color:#60a5fa">${d.title}</p><p style="color:#64748b;margin-top:12px;max-width:500px;margin-left:auto;margin-right:auto">${d.bio}</p></div>
        <div style="max-width:800px;margin:0 auto;padding:40px 24px">
          <section id="skills" style="margin:48px 0"><h2 style="color:#60a5fa;font-size:1.3rem;margin-bottom:20px">Skills</h2><div>${skillsHtml('rgba(96,165,250,.1)', '#93c5fd', 'rgba(96,165,250,.3)')}</div></section>
          <section id="experience" style="margin:48px 0"><h2 style="color:#60a5fa;font-size:1.3rem;margin-bottom:20px">Experience</h2>${expHtml('#f8fafc', '#60a5fa', '#94a3b8')}</section>
          <section id="projects" style="margin:48px 0"><h2 style="color:#60a5fa;font-size:1.3rem;margin-bottom:20px">Projects</h2>${projectsHtml('rgba(96,165,250,.05)', 'rgba(96,165,250,.15)', '#f8fafc', '#94a3b8', 'rgba(96,165,250,.1)', '#93c5fd')}</section>
          <section id="education" style="margin:48px 0"><h2 style="color:#60a5fa;font-size:1.3rem;margin-bottom:20px">Education</h2>${eduHtml('#f8fafc', '#60a5fa')}</section>
          ${contactSection('#0f172a', '#94a3b8', '#60a5fa')}
        </div></div>`);

    case "coral":
      return wrapTheme('<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">', "'Outfit',sans-serif", `
        <div style="background:#fff7ed;color:#431407;min-height:100vh">
        ${nav('rgba(255,247,237,.9)', '#c2410c', '#ea580c')}
        <div id="about" style="background:linear-gradient(135deg,#ef4444,#f97316);padding:80px 24px;text-align:center;color:#fff">
          <div style="width:120px;height:120px;border-radius:50%;border:4px solid rgba(255,255,255,.4);overflow:hidden;margin:0 auto 20px"><img src="${d.avatar}" style="width:100%;height:100%"></div>
          <h1 style="font-size:2.8rem;font-weight:700;margin-bottom:8px">${d.name}</h1><p style="opacity:.9">${d.title}</p></div>
        <div style="max-width:760px;margin:0 auto;padding:40px 24px">
          <p style="text-align:center;color:#666;margin:24px 0">${d.bio}</p>
          <section id="skills" style="margin:48px 0"><h2 style="color:#ea580c;font-size:1.4rem;margin-bottom:20px">Skills</h2><div>${skillsHtml('#ffedd5', '#c2410c')}</div></section>
          <section id="experience" style="margin:48px 0"><h2 style="color:#ea580c;font-size:1.4rem;margin-bottom:20px">Experience</h2>${expHtml('#431407', '#ea580c', '#666')}</section>
          <section id="projects" style="margin:48px 0"><h2 style="color:#ea580c;font-size:1.4rem;margin-bottom:20px">Projects</h2>${projectsHtml('#fff', '#ffedd5', '#431407', '#666', '#fff7ed', '#c2410c')}</section>
          <section id="education" style="margin:48px 0"><h2 style="color:#ea580c;font-size:1.4rem;margin-bottom:20px">Education</h2>${eduHtml('#431407', '#ea580c')}</section>
          ${contactSection('#fff7ed', '#666', '#ea580c')}
        </div></div>`);

    case "arctic":
      return wrapTheme('<link href="https://fonts.googleapis.com/css2?family=Cabin:wght@400;500;600;700&display=swap" rel="stylesheet">', "'Cabin',sans-serif", `
        <div style="background:#f0f9ff;color:#0c4a6e;min-height:100vh">
        ${nav('rgba(240,249,255,.85)', '#0369a1', '#06b6d4')}
        <div id="about" style="background:linear-gradient(135deg,#67e8f9,#38bdf8);padding:80px 24px;text-align:center;color:#0c4a6e">
          <div style="width:120px;height:120px;border-radius:50%;border:4px solid #fff;overflow:hidden;margin:0 auto 20px;box-shadow:0 4px 20px rgba(0,0,0,.1)"><img src="${d.avatar}" style="width:100%;height:100%"></div>
          <h1 style="font-size:2.8rem;font-weight:700;margin-bottom:8px;color:#0c4a6e">${d.name}</h1><p style="color:#155e75">${d.title}</p></div>
        <div style="max-width:760px;margin:0 auto;padding:40px 24px">
          <p style="text-align:center;color:#64748b;margin:24px 0">${d.bio}</p>
          <section id="skills" style="margin:48px 0"><h2 style="color:#06b6d4;font-size:1.4rem;margin-bottom:20px">Skills</h2><div>${skillsHtml('#ecfeff', '#155e75')}</div></section>
          <section id="experience" style="margin:48px 0"><h2 style="color:#06b6d4;font-size:1.4rem;margin-bottom:20px">Experience</h2>${expHtml('#0c4a6e', '#06b6d4', '#64748b')}</section>
          <section id="projects" style="margin:48px 0"><h2 style="color:#06b6d4;font-size:1.4rem;margin-bottom:20px">Projects</h2>${projectsHtml('#fff', '#ecfeff', '#0c4a6e', '#64748b', '#f0f9ff', '#0891b2')}</section>
          <section id="education" style="margin:48px 0"><h2 style="color:#06b6d4;font-size:1.4rem;margin-bottom:20px">Education</h2>${eduHtml('#0c4a6e', '#06b6d4')}</section>
          ${contactSection('#f0f9ff', '#64748b', '#06b6d4')}
        </div></div>`);

    case "mocha":
      return wrapTheme('<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+3:wght@400;500;600&display=swap" rel="stylesheet">', "'Source Sans 3',sans-serif", `
        <div style="background:#1c1410;color:#d4c5b0;min-height:100vh">
        ${nav('rgba(28,20,16,.95)', '#a18c78', '#d4a574')}
        <div id="about" style="text-align:center;padding:100px 24px;background:linear-gradient(180deg,#1c1410,#2a1f17)">
          <div style="width:120px;height:120px;border-radius:50%;overflow:hidden;margin:0 auto 24px;border:2px solid #d4a574"><img src="${d.avatar}" style="width:100%;height:100%"></div>
          <h1 style="font-family:'Playfair Display',serif;font-size:3rem;font-weight:700;color:#d4a574;margin-bottom:8px">${d.name}</h1><p style="color:#a18c78">${d.title}</p><p style="color:#7a6b5d;margin-top:12px;max-width:500px;margin-left:auto;margin-right:auto">${d.bio}</p></div>
        <div style="max-width:800px;margin:0 auto;padding:40px 24px">
          <section id="skills" style="margin:48px 0"><h2 style="font-family:'Playfair Display',serif;color:#d4a574;font-size:1.3rem;margin-bottom:20px">Skills</h2><div>${skillsHtml('rgba(212,165,116,.1)', '#d4a574', 'rgba(212,165,116,.3)')}</div></section>
          <section id="experience" style="margin:48px 0"><h2 style="font-family:'Playfair Display',serif;color:#d4a574;font-size:1.3rem;margin-bottom:20px">Experience</h2>${expHtml('#d4c5b0', '#d4a574', '#7a6b5d')}</section>
          <section id="projects" style="margin:48px 0"><h2 style="font-family:'Playfair Display',serif;color:#d4a574;font-size:1.3rem;margin-bottom:20px">Projects</h2>${projectsHtml('rgba(212,165,116,.05)', 'rgba(212,165,116,.15)', '#d4c5b0', '#7a6b5d', 'rgba(212,165,116,.1)', '#d4a574')}</section>
          <section id="education" style="margin:48px 0"><h2 style="font-family:'Playfair Display',serif;color:#d4a574;font-size:1.3rem;margin-bottom:20px">Education</h2>${eduHtml('#d4c5b0', '#d4a574')}</section>
          ${contactSection('#1c1410', '#7a6b5d', '#d4a574')}
        </div></div>`);

    case "sakura":
      return wrapTheme('<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">', "'Noto Sans JP',sans-serif", `
        <div style="background:#fff1f2;color:#4a1d2e;min-height:100vh">
        ${nav('rgba(255,241,242,.9)', '#be185d', '#ec4899')}
        <div id="about" style="background:linear-gradient(135deg,#f9a8d4,#f472b6);padding:80px 24px;text-align:center;color:#fff">
          <div style="width:120px;height:120px;border-radius:50%;border:4px solid rgba(255,255,255,.5);overflow:hidden;margin:0 auto 20px"><img src="${d.avatar}" style="width:100%;height:100%"></div>
          <h1 style="font-size:2.8rem;font-weight:700;margin-bottom:8px">${d.name}</h1><p style="opacity:.9">${d.title}</p></div>
        <div style="max-width:760px;margin:0 auto;padding:40px 24px">
          <p style="text-align:center;color:#9d174d;margin:24px 0">${d.bio}</p>
          <section id="skills" style="margin:48px 0"><h2 style="color:#ec4899;font-size:1.4rem;margin-bottom:20px">Skills</h2><div>${skillsHtml('#fce7f3', '#be185d')}</div></section>
          <section id="experience" style="margin:48px 0"><h2 style="color:#ec4899;font-size:1.4rem;margin-bottom:20px">Experience</h2>${expHtml('#4a1d2e', '#ec4899', '#9d174d')}</section>
          <section id="projects" style="margin:48px 0"><h2 style="color:#ec4899;font-size:1.4rem;margin-bottom:20px">Projects</h2>${projectsHtml('#fff', '#fce7f3', '#4a1d2e', '#9d174d', '#fff1f2', '#db2777')}</section>
          <section id="education" style="margin:48px 0"><h2 style="color:#ec4899;font-size:1.4rem;margin-bottom:20px">Education</h2>${eduHtml('#4a1d2e', '#ec4899')}</section>
          ${contactSection('#fff1f2', '#9d174d', '#ec4899')}
        </div></div>`);

    case "graphite":
      return wrapTheme('<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">', "'IBM Plex Sans',sans-serif", `
        <div style="background:#18181b;color:#d4d4d8;min-height:100vh">
        ${nav('rgba(24,24,27,.95)', '#a1a1aa', '#e4e4e7')}
        <div id="about" style="text-align:center;padding:100px 24px;background:linear-gradient(180deg,#18181b,#27272a)">
          <div style="width:120px;height:120px;border-radius:50%;overflow:hidden;margin:0 auto 24px;border:2px solid #52525b"><img src="${d.avatar}" style="width:100%;height:100%"></div>
          <h1 style="font-size:2.5rem;font-weight:700;color:#fafafa;margin-bottom:8px">${d.name}</h1><p style="color:#a1a1aa">${d.title}</p><p style="color:#71717a;margin-top:12px;max-width:500px;margin-left:auto;margin-right:auto">${d.bio}</p></div>
        <div style="max-width:800px;margin:0 auto;padding:40px 24px">
          <section id="skills" style="margin:48px 0"><h2 style="color:#e4e4e7;font-size:1.3rem;margin-bottom:20px">Skills</h2><div>${skillsHtml('#27272a', '#d4d4d8', '#3f3f46')}</div></section>
          <section id="experience" style="margin:48px 0"><h2 style="color:#e4e4e7;font-size:1.3rem;margin-bottom:20px">Experience</h2>${expHtml('#fafafa', '#a1a1aa', '#71717a')}</section>
          <section id="projects" style="margin:48px 0"><h2 style="color:#e4e4e7;font-size:1.3rem;margin-bottom:20px">Projects</h2>${projectsHtml('#27272a', '#3f3f46', '#fafafa', '#71717a', '#18181b', '#a1a1aa')}</section>
          <section id="education" style="margin:48px 0"><h2 style="color:#e4e4e7;font-size:1.3rem;margin-bottom:20px">Education</h2>${eduHtml('#fafafa', '#a1a1aa')}</section>
          ${contactSection('#18181b', '#71717a', '#e4e4e7')}
        </div></div>`);

    case "emerald":
      return wrapTheme('<link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">', "'Open Sans',sans-serif", `
        <div style="background:#052e16;color:#bbf7d0;min-height:100vh">
        ${nav('rgba(5,46,22,.95)', '#86efac', '#10b981')}
        <div id="about" style="text-align:center;padding:100px 24px;background:radial-gradient(ellipse at center,rgba(16,185,129,.1) 0%,transparent 70%)">
          <div style="width:120px;height:120px;border-radius:50%;overflow:hidden;margin:0 auto 24px;border:3px solid #10b981;box-shadow:0 0 30px rgba(16,185,129,.2)"><img src="${d.avatar}" style="width:100%;height:100%"></div>
          <h1 style="font-family:'Merriweather',serif;font-size:3rem;font-weight:700;color:#10b981;margin-bottom:8px">${d.name}</h1><p style="color:#86efac">${d.title}</p><p style="color:#6b7280;margin-top:12px;max-width:500px;margin-left:auto;margin-right:auto">${d.bio}</p></div>
        <div style="max-width:800px;margin:0 auto;padding:40px 24px">
          <section id="skills" style="margin:48px 0"><h2 style="font-family:'Merriweather',serif;color:#10b981;font-size:1.3rem;margin-bottom:20px">Skills</h2><div>${skillsHtml('rgba(16,185,129,.15)', '#86efac', 'rgba(16,185,129,.3)')}</div></section>
          <section id="experience" style="margin:48px 0"><h2 style="font-family:'Merriweather',serif;color:#10b981;font-size:1.3rem;margin-bottom:20px">Experience</h2>${expHtml('#bbf7d0', '#10b981', '#6b7280')}</section>
          <section id="projects" style="margin:48px 0"><h2 style="font-family:'Merriweather',serif;color:#10b981;font-size:1.3rem;margin-bottom:20px">Projects</h2>${projectsHtml('rgba(16,185,129,.05)', 'rgba(16,185,129,.15)', '#bbf7d0', '#6b7280', 'rgba(16,185,129,.1)', '#10b981')}</section>
          <section id="education" style="margin:48px 0"><h2 style="font-family:'Merriweather',serif;color:#10b981;font-size:1.3rem;margin-bottom:20px">Education</h2>${eduHtml('#bbf7d0', '#10b981')}</section>
          ${contactSection('#052e16', '#6b7280', '#10b981')}
        </div></div>`);

    case "royal":
      return wrapTheme('<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:wght@400;500;600&display=swap" rel="stylesheet">', "'Raleway',sans-serif", `
        <div style="background:#1e1b4b;color:#c7d2fe;min-height:100vh">
        ${nav('rgba(30,27,75,.95)', '#a5b4fc', '#818cf8')}
        <div id="about" style="text-align:center;padding:100px 24px;background:linear-gradient(180deg,#1e1b4b,#312e81)">
          <div style="width:130px;height:130px;border-radius:50%;overflow:hidden;margin:0 auto 24px;border:3px solid #818cf8;box-shadow:0 0 40px rgba(129,140,248,.2)"><img src="${d.avatar}" style="width:100%;height:100%"></div>
          <h1 style="font-family:'Cinzel',serif;font-size:3rem;font-weight:700;color:#a5b4fc;letter-spacing:2px;margin-bottom:8px">${d.name}</h1><p style="color:#818cf8;letter-spacing:1px">${d.title}</p><p style="color:#6366f1;margin-top:12px;max-width:500px;margin-left:auto;margin-right:auto">${d.bio}</p></div>
        <div style="max-width:800px;margin:0 auto;padding:40px 24px">
          <section id="skills" style="margin:48px 0"><h2 style="font-family:'Cinzel',serif;color:#a5b4fc;font-size:1.2rem;letter-spacing:2px;margin-bottom:20px">SKILLS</h2><div>${skillsHtml('rgba(129,140,248,.1)', '#a5b4fc', 'rgba(129,140,248,.3)')}</div></section>
          <section id="experience" style="margin:48px 0"><h2 style="font-family:'Cinzel',serif;color:#a5b4fc;font-size:1.2rem;letter-spacing:2px;margin-bottom:20px">EXPERIENCE</h2>${expHtml('#c7d2fe', '#818cf8', '#6366f1')}</section>
          <section id="projects" style="margin:48px 0"><h2 style="font-family:'Cinzel',serif;color:#a5b4fc;font-size:1.2rem;letter-spacing:2px;margin-bottom:20px">PROJECTS</h2>${projectsHtml('rgba(129,140,248,.05)', 'rgba(129,140,248,.15)', '#c7d2fe', '#6366f1', 'rgba(129,140,248,.1)', '#a5b4fc')}</section>
          <section id="education" style="margin:48px 0"><h2 style="font-family:'Cinzel',serif;color:#a5b4fc;font-size:1.2rem;letter-spacing:2px;margin-bottom:20px">EDUCATION</h2>${eduHtml('#c7d2fe', '#818cf8')}</section>
          ${contactSection('#1e1b4b', '#6366f1', '#818cf8')}
        </div></div>`);

    case "rocket":
      return wrapTheme('<link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800&display=swap" rel="stylesheet">', "'Exo 2',sans-serif", `
        <div style="background:#020617;color:#cbd5e1;min-height:100vh;background-image:radial-gradient(1px 1px at 20px 30px,#334155,transparent),radial-gradient(1px 1px at 40px 70px,#475569,transparent),radial-gradient(1px 1px at 80px 40px,#334155,transparent),radial-gradient(1px 1px at 150px 60px,#475569,transparent),radial-gradient(1px 1px at 200px 90px,#334155,transparent);background-size:300px 150px">
        ${nav('rgba(2,6,23,.95)', '#94a3b8', '#f97316')}
        <div id="about" style="text-align:center;padding:100px 24px">
          <div style="width:120px;height:120px;border-radius:50%;overflow:hidden;margin:0 auto 24px;border:3px solid #f97316;box-shadow:0 0 30px rgba(249,115,22,.2)"><img src="${d.avatar}" style="width:100%;height:100%"></div>
          <h1 style="font-size:3rem;font-weight:800;background:linear-gradient(135deg,#f97316,#fbbf24);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px">${d.name}</h1><p style="color:#f97316">${d.title}</p><p style="color:#64748b;margin-top:12px;max-width:500px;margin-left:auto;margin-right:auto">${d.bio}</p></div>
        <div style="max-width:800px;margin:0 auto;padding:40px 24px">
          <section id="skills" style="margin:48px 0"><h2 style="color:#f97316;font-size:1.3rem;font-weight:700;margin-bottom:20px">🚀 Skills</h2><div>${skillsHtml('rgba(249,115,22,.1)', '#fb923c', 'rgba(249,115,22,.3)')}</div></section>
          <section id="experience" style="margin:48px 0"><h2 style="color:#f97316;font-size:1.3rem;font-weight:700;margin-bottom:20px">🛰️ Experience</h2>${expHtml('#f8fafc', '#f97316', '#94a3b8')}</section>
          <section id="projects" style="margin:48px 0"><h2 style="color:#f97316;font-size:1.3rem;font-weight:700;margin-bottom:20px">🌟 Projects</h2>${projectsHtml('rgba(249,115,22,.05)', 'rgba(249,115,22,.15)', '#f8fafc', '#94a3b8', 'rgba(249,115,22,.1)', '#fb923c')}</section>
          <section id="education" style="margin:48px 0"><h2 style="color:#f97316;font-size:1.3rem;font-weight:700;margin-bottom:20px">🎓 Education</h2>${eduHtml('#f8fafc', '#f97316')}</section>
          ${contactSection('#020617', '#94a3b8', '#f97316')}
        </div></div>`);

    default:
      return "<html><body><p>Theme not found</p></body></html>";
  }
};
