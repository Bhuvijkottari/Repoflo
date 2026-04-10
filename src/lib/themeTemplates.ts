import type { PortfolioData } from "@/lib/mockData";
import { mockPortfolioData } from "@/lib/mockData";

const getPortfolioData = (): PortfolioData => {
  try {
    const stored = sessionStorage.getItem("portfolioData");
    if (stored) return JSON.parse(stored);
  } catch {}
  return mockPortfolioData;
};

// ─── Shared nav ────────────────────────────────────────────────────────────
const nav = (bg: string, text: string, accent: string, personName: string, links?: string[], data?: PortfolioData) => {
  const autoLinks = data ? [
    "About",
    data.skills.length > 0 ? "Skills" : null,
    data.experience.length > 0 ? "Experience" : null,
    data.projects.length > 0 ? "Projects" : null,
    data.education.length > 0 ? "Education" : null,
    "Contact",
  ].filter(Boolean) as string[] : (links || ["About", "Skills", "Experience", "Projects", "Education", "Contact"]);
  return `<style>
    @media(max-width:768px){.nav-links{display:none!important}}
    nav,nav *{box-sizing:border-box}
  </style>
  <nav style="position:sticky;top:0;z-index:100;background:${bg};padding:8px 20px;display:flex;align-items:center;justify-content:space-between;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);width:100%;box-sizing:border-box;border-bottom:1px solid ${accent}22">
    <a href="#about" style="font-weight:800;font-size:.95rem;color:${accent};text-decoration:none;letter-spacing:.5px">${personName.split(' ')[0]}</a>
    <div class="nav-links" style="display:flex;gap:4px;align-items:center">${autoLinks.map(l => `<a href="#${l.toLowerCase()}" onclick="event.preventDefault();document.getElementById('${l.toLowerCase()}')?.scrollIntoView({behavior:'smooth'})" style="color:${text};text-decoration:none;font-size:.78rem;padding:5px 10px;border-radius:6px;transition:all .2s" onmouseover="this.style.color='${accent}';this.style.background='${accent}18'" onmouseout="this.style.color='${text}';this.style.background='transparent'">${l}</a>`).join('')}</div>
  </nav>`;
};

// ─── Shared section generators ────────────────────────────────────────────
const skillsHtml = (d: PortfolioData, bg: string, color: string, border?: string) =>
  d.skills.map(s => `<span class="skill-tag" style="background:${bg};color:${color};padding:8px 18px;border-radius:30px;font-size:.88rem;display:inline-block;margin:4px;font-weight:500${border ? `;border:1px solid ${border}` : ''}">${s}</span>`).join('');

const expHtml = (d: PortfolioData, roleColor: string, companyColor: string, descColor: string) =>
  d.experience.length ? d.experience.map(e => `<div class="tilt-card reveal" style="margin-bottom:20px;padding:22px 24px;border-radius:14px;background:rgba(128,128,128,.04);border-left:3px solid ${companyColor}44"><div style="font-weight:700;font-size:1.05rem;color:${roleColor}">${e.role}</div><div style="color:${companyColor};font-size:.9rem;margin-top:2px;font-weight:500">${e.company}</div><div style="color:${descColor};font-size:.8rem;margin:3px 0 8px;opacity:.7">${e.period}</div><p style="color:${descColor};font-size:.92rem;line-height:1.7;margin:0">${e.description}</p></div>`).join('') : '';

const projectsHtml = (d: PortfolioData, cardBg: string, cardBorder: string, nameColor: string, descColor: string, tagBg: string, tagColor: string) =>
  d.projects.map(p => `<div class="project-card tilt-card reveal" style="background:${cardBg};border:1px solid ${cardBorder};border-radius:16px;padding:24px;margin-bottom:16px;cursor:default"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px"><div style="font-weight:700;font-size:1.05rem;color:${nameColor}">${p.link ? `<a href="${p.link}" target="_blank" style="color:${nameColor};text-decoration:none">${p.name}</a>` : p.name}</div>${p.stars ? `<span style="color:#f59e0b;font-size:.85rem;font-weight:600">★ ${p.stars}</span>` : ''}</div><p style="color:${descColor};font-size:.92rem;margin-bottom:14px;line-height:1.65">${p.description}</p><div style="display:flex;flex-wrap:wrap;gap:6px">${p.tech.map(t => `<span class="skill-tag" style="background:${tagBg};color:${tagColor};padding:4px 12px;border-radius:8px;font-size:.78rem;font-weight:500">${t}</span>`).join('')}</div>${p.link ? `<a href="${p.link}" target="_blank" style="display:inline-block;margin-top:12px;font-size:.82rem;color:${tagColor};font-weight:600;text-decoration:none;opacity:.8">View on GitHub →</a>` : ''}</div>`).join('');

const eduHtml = (d: PortfolioData, roleColor: string, instColor: string) =>
  d.education.length ? d.education.map(e => `<div class="tilt-card reveal" style="margin-bottom:20px;padding:20px 24px;border-radius:14px;background:rgba(128,128,128,.04)"><div style="font-weight:700;font-size:1.05rem;color:${roleColor}">${e.degree}</div><div style="color:${instColor};font-size:.92rem;margin-top:3px">${e.institution}</div><div style="color:${instColor};font-size:.8rem;margin-top:2px;opacity:.6">${e.period}</div></div>`).join('') : '';

// Gmail compose link helper
const gmailLink = (email: string) => `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const volHtml = (d: PortfolioData, roleColor: string, orgColor: string, descColor: string) =>
  d.volunteering.length ? d.volunteering.map(v => `<div class="tilt-card reveal" style="margin-bottom:20px;padding:20px 24px;border-radius:14px;background:rgba(128,128,128,.04)"><div style="font-weight:700;font-size:1.05rem;color:${roleColor}">${v.role}</div><div style="color:${orgColor};font-size:.92rem">${v.org}</div><div style="color:${orgColor};font-size:.8rem;opacity:.6">${v.period}</div><p style="color:${descColor};font-size:.92rem;margin-top:8px;line-height:1.7">${v.description}</p></div>`).join('') : '';

const githubActivityHtml = (d: PortfolioData, cardBg: string, cardBorder: string, accentColor: string, descColor: string) => {
  const s = d.githubStats;
  if (!s) return '';
  const langColors = ['#6366f1','#f59e0b','#10b981','#ef4444','#ec4899','#06b6d4'];
  const statIcons: Record<string,string> = {Commits:'⚡',Repos:'📁',Followers:'👥',PRs:'🔀',Streak:'🔥','On GitHub':'📅'};
  const stats: [string|number, string][] = [
    [s.totalCommits.toLocaleString(),'Commits'],
    [s.publicRepos,'Repos'],
    [s.followers.toLocaleString(),'Followers'],
    [s.pullRequests,'PRs'],
    [`${s.contributionStreak}d`,'Streak'],
    [`${Math.floor(s.daysOnGithub/365)}y ${s.daysOnGithub%365}d`,'On GitHub'],
  ];
  // Mini contribution heatmap (pseudo-random deterministic based on totalCommits)
  const heatCols = 26, heatRows = 7;
  const seed = s.totalCommits;
  const heatData = Array.from({length: heatCols * heatRows}, (_, i) => {
    const v = ((seed * 9301 + i * 49297 + 233) % 233280) / 233280;
    return v > 0.65 ? 3 : v > 0.45 ? 2 : v > 0.3 ? 1 : 0;
  });
  const heatIntensity = (level: number) => {
    if (level === 0) return 'opacity:.12';
    if (level === 1) return 'opacity:.35';
    if (level === 2) return 'opacity:.65';
    return 'opacity:1';
  };

  // SVG donut for top language
  const total = s.topLanguages.reduce((a,l) => a + l.percentage, 0) || 100;
  const radius = 15.9, circ = 2 * Math.PI * radius;
  let offset = 0;
  const donutSegments = s.topLanguages.map((l, i) => {
    const pct = (l.percentage / total) * 100;
    const dash = (pct / 100) * circ;
    const seg = `<circle cx="18" cy="18" r="${radius}" fill="none" stroke="${langColors[i]}" stroke-width="4" stroke-dasharray="${dash.toFixed(2)} ${(circ - dash).toFixed(2)}" stroke-dashoffset="${(circ * (1 - offset / 100)).toFixed(2)}" transform="rotate(-90 18 18)" style="transition:stroke-dasharray 1s ease"/>`;
    offset += pct;
    return seg;
  }).join('');

  return `<section id="github" style="margin:56px 0">
  <h2 class="reveal" style="color:${accentColor};font-size:1.35rem;font-weight:700;margin-bottom:24px;display:flex;align-items:center;gap:10px">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="${accentColor}"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
    GitHub Activity
  </h2>

  <!-- Stat cards grid -->
  <div class="stats-grid reveal" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-bottom:24px">
    ${stats.map(([v,l]) => `
    <div class="tilt-card" style="background:${cardBg};border:1px solid ${cardBorder};border-radius:12px;padding:14px 12px;text-align:center;position:relative;overflow:hidden">
      <div style="font-size:1.1rem;margin-bottom:4px">${statIcons[l]||'📊'}</div>
      <div class="animate-count" data-count="${typeof v==='number'?v:0}" style="font-size:1.3rem;font-weight:800;color:${accentColor};line-height:1">${v}</div>
      <div style="font-size:.62rem;color:${descColor};text-transform:uppercase;letter-spacing:1px;margin-top:4px">${l}</div>
    </div>`).join('')}
  </div>

  <!-- Language breakdown: donut + bars side by side -->
  ${s.topLanguages.length ? `
  <div class="reveal" style="background:${cardBg};border:1px solid ${cardBorder};border-radius:16px;padding:20px;margin-bottom:20px">
    <p style="font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:${accentColor};margin-bottom:16px">Top Languages</p>
    <div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap">
      <!-- SVG Donut -->
      <div style="flex-shrink:0">
        <svg width="80" height="80" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="${radius}" fill="none" stroke="${cardBorder}" stroke-width="4"/>
          ${donutSegments}
          <text x="18" y="21" text-anchor="middle" font-size="6" fill="${accentColor}" font-weight="bold">${s.topLanguages[0]?.percentage}%</text>
        </svg>
      </div>
      <!-- Language bars -->
      <div style="flex:1;min-width:160px">
        ${s.topLanguages.map((l,i) => `
        <div style="margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px">
            <span style="font-size:.78rem;font-weight:600;color:${descColor};display:flex;align-items:center;gap:6px">
              <span style="width:8px;height:8px;border-radius:50%;background:${langColors[i]};display:inline-block"></span>${l.name}
            </span>
            <span style="font-size:.72rem;color:${accentColor};font-weight:700">${l.percentage}%</span>
          </div>
          <div style="height:5px;background:rgba(128,128,128,.12);border-radius:3px;overflow:hidden">
            <div class="skill-bar-fill" style="--bar-width:${l.percentage}%;height:100%;background:linear-gradient(90deg,${langColors[i]},${langColors[i]}88);border-radius:3px;width:0"></div>
          </div>
        </div>`).join('')}
      </div>
    </div>
    <!-- Stacked bar -->
    <div style="display:flex;border-radius:6px;overflow:hidden;height:8px;margin-top:16px;gap:1px">
      ${s.topLanguages.map((l,i) => `<div style="width:${l.percentage}%;height:100%;background:${langColors[i]};border-radius:${i===0?'6px 0 0 6px':i===s.topLanguages.length-1?'0 6px 6px 0':'0'}"></div>`).join('')}
    </div>
  </div>` : ''}

  <!-- Contribution heatmap -->
  <div class="reveal" style="background:${cardBg};border:1px solid ${cardBorder};border-radius:16px;padding:20px;margin-bottom:20px;overflow-x:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <p style="font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:${accentColor}">Contribution Activity</p>
      <span style="font-size:.72rem;color:${descColor}">${s.totalCommits.toLocaleString()} total commits</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(${heatCols},1fr);gap:2px;min-width:300px">
      ${heatData.map(level => `<div style="aspect-ratio:1;border-radius:2px;background:${accentColor};${heatIntensity(level)}"></div>`).join('')}
    </div>
    <div style="display:flex;align-items:center;gap:6px;margin-top:10px;justify-content:flex-end">
      <span style="font-size:.62rem;color:${descColor}">Less</span>
      ${[0,1,2,3].map(l => `<div style="width:10px;height:10px;border-radius:2px;background:${accentColor};${heatIntensity(l)}"></div>`).join('')}
      <span style="font-size:.62rem;color:${descColor}">More</span>
    </div>
  </div>

  <!-- Streak + collaborations row -->
  <div style="display:flex;gap:12px;flex-wrap:wrap">
    ${s.contributionStreak > 0 ? `
    <div class="reveal" style="background:${cardBg};border:1px solid ${cardBorder};border-radius:12px;padding:14px 20px;display:inline-flex;align-items:center;gap:10px">
      <span style="font-size:1.4rem">🔥</span>
      <div>
        <div style="font-size:1.2rem;font-weight:800;color:${accentColor}">${s.contributionStreak} days</div>
        <div style="font-size:.65rem;text-transform:uppercase;letter-spacing:1px;color:${descColor}">Current Streak</div>
      </div>
    </div>` : ''}
    ${s.recentCollaborations.length ? `
    <div class="reveal" style="background:${cardBg};border:1px solid ${cardBorder};border-radius:12px;padding:14px 20px;flex:1;min-width:180px">
      <p style="font-size:.65rem;text-transform:uppercase;letter-spacing:1px;color:${descColor};margin-bottom:8px">Recent Collaborations</p>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        ${s.recentCollaborations.map(c => `<span style="font-size:.72rem;color:${accentColor};background:${accentColor}15;padding:3px 10px;border-radius:50px">${c}</span>`).join('')}
      </div>
    </div>` : ''}
  </div>
  </section>`;
};

const leetcodeHtml = (d: PortfolioData, cardBg: string, cardBorder: string, accentColor: string, descColor: string) => {
  const lc = d.leetcodeStats;
  if (!lc) return '';
  return `<section id="leetcode" style="margin:52px 0"><h2 style="color:${accentColor};font-size:1.35rem;font-weight:700;margin-bottom:20px">LeetCode</h2>
  <div class="stats-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:12px">
    ${[[lc.totalSolved,'Solved'],[lc.easySolved,'Easy'],[lc.mediumSolved,'Medium'],[lc.hardSolved,'Hard'],[lc.ranking?`#${lc.ranking.toLocaleString()}`:'N/A','Rank']].map(([v,l]) =>
    `<div class="tilt-card reveal" style="background:${cardBg};border:1px solid ${cardBorder};border-radius:12px;padding:16px;text-align:center"><div style="font-size:1.3rem;font-weight:800;color:${accentColor}">${v}</div><div style="font-size:.68rem;color:${descColor};text-transform:uppercase;letter-spacing:1px;margin-top:3px">${l}</div></div>`).join('')}
  </div></section>`;
};

const contactSection = (d: PortfolioData, _bg: string, textColor: string, accentColor: string) =>
  `<section id="contact" class="reveal" style="padding:64px 0;text-align:center"><h2 style="color:${accentColor};margin-bottom:12px;font-size:1.5rem;font-weight:700">Get In Touch</h2>
  <p style="color:${textColor};font-size:.95rem;margin-bottom:4px">Email: <a href="${gmailLink(d.email)}" style="color:${accentColor};text-decoration:none;font-weight:600">${d.email}</a></p>
  ${d.phone ? `<p style="color:${textColor};font-size:.95rem;margin-bottom:4px">📞 <a href="tel:${d.phone}" style="color:${accentColor};text-decoration:none;font-weight:600">${d.phone}</a></p>` : ''}
  <p style="color:${textColor};font-size:.95rem;margin-bottom:24px">📍 ${d.location}</p>
  <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
    ${d.github ? `<a href="${d.github}" target="_blank" style="color:#fff;background:${accentColor};text-decoration:none;padding:11px 28px;border-radius:50px;font-weight:700;font-size:.9rem;transition:transform .2s,box-shadow .2s" onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 24px ${accentColor}44'" onmouseout="this.style.transform='none';this.style.boxShadow='none'">GitHub</a>` : ''}
    ${d.linkedin ? `<a href="${d.linkedin}" target="_blank" style="color:${accentColor};border:2px solid ${accentColor};text-decoration:none;padding:9px 28px;border-radius:50px;font-weight:700;font-size:.9rem;transition:transform .2s" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='none'">LinkedIn</a>` : ''}
    ${d.website ? `<a href="${d.website}" target="_blank" style="color:${accentColor};border:2px solid ${accentColor};text-decoration:none;padding:9px 28px;border-radius:50px;font-weight:700;font-size:.9rem;transition:transform .2s" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='none'">Website</a>` : ''}
  </div></section>`;

// ─── Canvas helpers ───────────────────────────────────────────────────────
const starfieldCanvas = (starColor = 'rgba(255,255,255,', bgColor = 'rgba(10,15,30,0.6)') => `
<canvas id="cvs" style="position:fixed;inset:0;z-index:0;pointer-events:none;width:100%;height:100%"></canvas>
<script>
(function(){
  var c=document.getElementById('cvs');var ctx=c.getContext('2d');
  c.width=window.innerWidth;c.height=window.innerHeight;
  var stars=[];
  for(var i=0;i<220;i++)stars.push({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1.8+.3,s:Math.random()*.02+.005,a:Math.random()});
  function draw(){
    ctx.fillStyle='${bgColor}';ctx.fillRect(0,0,c.width,c.height);
    stars.forEach(function(s){
      s.a+=s.s;if(s.a>1||s.a<0)s.s*=-1;
      ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle='${starColor}'+s.a+')';ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
  window.addEventListener('resize',function(){c.width=window.innerWidth;c.height=window.innerHeight;});
})();
</script>`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const matrixCanvas = () => `
<canvas id="cvs" style="position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.18"></canvas>
<script>
(function(){
  var c=document.getElementById('cvs');var ctx=c.getContext('2d');
  c.width=window.innerWidth;c.height=window.innerHeight;
  var cols=Math.floor(c.width/16);var drops=[];
  for(var i=0;i<cols;i++)drops[i]=Math.random()*c.height/16;
  function draw(){
    ctx.fillStyle='rgba(30,30,46,.07)';ctx.fillRect(0,0,c.width,c.height);
    ctx.fillStyle='#a6e3a1';ctx.font='14px monospace';
    for(var i=0;i<drops.length;i++){
      var t=String.fromCharCode(0x30A0+Math.random()*96);
      ctx.fillText(t,i*16,drops[i]*16);
      if(drops[i]*16>c.height&&Math.random()>.975)drops[i]=0;
      drops[i]++;
    }
    requestAnimationFrame(draw);
  }
  draw();
})();
</script>`;

const petalCanvas = (color1='rgba(255,183,197,') => `
<canvas id="cvs" style="position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.6"></canvas>
<script>
(function(){
  var c=document.getElementById('cvs');var ctx=c.getContext('2d');
  c.width=window.innerWidth;c.height=window.innerHeight;
  var petals=[];
  for(var i=0;i<60;i++)petals.push({x:Math.random()*c.width,y:Math.random()*c.height-c.height,vx:Math.random()*.8-.4,vy:Math.random()*1+.5,a:Math.random()*Math.PI*2,va:Math.random()*.03-.015,s:Math.random()*10+6,op:Math.random()*.6+.3});
  function drawPetal(x,y,s,a,op){
    ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.globalAlpha=op;
    ctx.beginPath();ctx.ellipse(0,0,s,s/2,0,0,Math.PI*2);
    ctx.fillStyle='${color1}'+op+')';ctx.fill();
    ctx.restore();
  }
  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    petals.forEach(function(p){
      p.x+=p.vx;p.y+=p.vy;p.a+=p.va;
      if(p.y>c.height+20){p.y=-20;p.x=Math.random()*c.width;}
      drawPetal(p.x,p.y,p.s,p.a,p.op);
    });
    requestAnimationFrame(draw);
  }
  draw();
})();
</script>`;

const particleCanvas = (color='rgba(249,115,22,') => `
<canvas id="cvs" style="position:fixed;inset:0;z-index:0;pointer-events:none"></canvas>
<script>
(function(){
  var c=document.getElementById('cvs');var ctx=c.getContext('2d');
  c.width=window.innerWidth;c.height=window.innerHeight;
  var pts=[];
  for(var i=0;i<120;i++)pts.push({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*2+.5,a:Math.random()});
  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    pts.forEach(function(p){
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>c.width)p.vx*=-1;
      if(p.y<0||p.y>c.height)p.vy*=-1;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle='${color}'+p.a+')';ctx.fill();
    });
    pts.forEach(function(a,i){pts.slice(i+1).forEach(function(b){
      var d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<100){ctx.strokeStyle='${color}'+(1-d/100)*.15+')';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
    });});
    requestAnimationFrame(draw);
  }
  draw();
})();
</script>`;

const gridCanvas = (lineColor='rgba(0,255,255,', bgOpacity='.08') => `
<canvas id="cvs" style="position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.5"></canvas>
<script>
(function(){
  var c=document.getElementById('cvs');var ctx=c.getContext('2d');
  c.width=window.innerWidth;c.height=window.innerHeight;
  var t=0;
  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    t+=.004;
    var vanY=c.height*.55,cols=18,rows=12;
    for(var i=0;i<=cols;i++){
      var x=i*(c.width/cols);var nx=x+(Math.sin(t+i*.3)*.5);
      ctx.beginPath();ctx.moveTo(c.width/2,vanY);ctx.lineTo(nx,c.height);
      ctx.strokeStyle='${lineColor}'.15+')';ctx.lineWidth=.8;ctx.stroke();
    }
    for(var j=1;j<=rows;j++){
      var y=vanY+(c.height-vanY)*(j/rows);
      var wave=Math.sin(t*2+j*.5)*3;
      ctx.beginPath();ctx.moveTo(0,y+wave);ctx.lineTo(c.width,y+wave);
      ctx.strokeStyle='${lineColor}'+(j/rows*.3)+')';ctx.lineWidth=.6;ctx.stroke();
    }
    var grad=ctx.createLinearGradient(0,vanY-40,0,vanY+40);
    grad.addColorStop(0,'transparent');grad.addColorStop(.5,'${lineColor}${bgOpacity})');grad.addColorStop(1,'transparent');
    ctx.fillStyle=grad;ctx.fillRect(0,vanY-40,c.width,80);
    requestAnimationFrame(draw);
  }
  draw();
})();
</script>`;

// ─── Styles ───────────────────────────────────────────────────────────────
const responsiveStyles = `
@media(max-width:768px){
  /* ── Universal nav: hide links on mobile — sidebar hamburger takes over ── */
  .nav-links{display:none!important}
  .nav-hamburger{display:none!important} /* hide shared nav hamburger — universal sidebar replaces it */
  .nav-mobile-menu{display:none!important}
  /* Hide nav links in ALL custom themed headers */
  .bold-nav,
  .neon-nav>div:last-child,
  .f-nav nav,.ch-nav nav,.lv-nav nav,.co-nav nav,
  .ar-nav nav,.mo-nav nav,.sk-nav nav,.gr-nav nav,
  .em-nav nav,.rk-mission-nav nav,
  header>nav,
  header>div:last-child>nav,
  header [style*="display:flex"][style*="gap:24px"],
  header [style*="display:flex"][style*="gap:4px"],
  header [style*="display:flex"][style*="gap:2px"]{display:none!important}
  /* Make headers compact on mobile */
  header{padding:10px 16px!important}

  /* ── Force ALL split layouts to single column ── */
  /* Grid splits */
  [style*="grid-template-columns:1fr 380px"],
  [style*="grid-template-columns:1fr 360px"],
  [style*="grid-template-columns:280px 1fr"],
  [style*="grid-template-columns:300px 1fr"],
  .forest-hero-grid,.bold-hero,.hero-grid{grid-template-columns:1fr!important}
  /* Flex splits with fixed-width children */
  .ocean-split,.ch-split,.mo-split{flex-direction:column!important}
  .ocean-left,.ch-left,.mo-sidebar{width:100%!important;position:relative!important;height:auto!important;top:auto!important;max-height:none!important}
  .ocean-right,.ch-right,.mo-main{border-left:none!important}
  /* VS Code theme */
  .vsc-root{flex-direction:column!important;height:auto!important;overflow:visible!important}
  .vsc-activity{display:none!important}
  .vsc-sidebar{width:100%!important;height:auto!important;max-height:200px!important;border-right:none!important;border-bottom:1px solid #11111b!important}
  .vsc-editor{padding:16px!important}
  .vsc-main{overflow:visible!important}
  /* Any fixed-width sidebar */
  [style*="width:300px"][style*="flex-shrink:0"],
  [style*="width:360px"][style*="flex-shrink:0"],
  [style*="width:280px"][style*="flex-shrink:0"],
  [style*="width:220px"][style*="flex-shrink:0"]{width:100%!important;position:relative!important;height:auto!important}

  h1{font-size:1.7rem!important;word-break:break-word!important}
  h2{font-size:1.15rem!important}
  .stats-grid{grid-template-columns:repeat(2,1fr)!important;gap:8px!important}
  .hero-grid{grid-template-columns:1fr!important;text-align:center!important}
  .project-card{padding:16px!important}
  body>div>div{padding-left:16px!important;padding-right:16px!important}
  section{padding:32px 0!important}
  [style*="display:flex"][style*="gap"]{flex-wrap:wrap!important}
  [style*="grid-template-columns:repeat(3"]{grid-template-columns:1fr!important}
  [style*="grid-template-columns:repeat(4"]{grid-template-columns:repeat(2,1fr)!important}
  a[style*="padding:14px 36px"],a[style*="padding:14px 48px"],a[style*="padding:16px 48px"]{padding:12px 24px!important;font-size:.88rem!important}
  img[style*="border-radius:50%"]{max-width:100px!important;max-height:100px!important}
  .skill-tag{font-size:.78rem!important;padding:6px 12px!important}
  pre,code{overflow-x:auto!important;white-space:pre-wrap!important;word-break:break-word!important}
  p,div,span,a{word-break:break-word!important;overflow-wrap:break-word!important}
}
@media(max-width:480px){
  .stats-grid{grid-template-columns:1fr!important}
  h1{font-size:1.4rem!important}
  h2{font-size:1.05rem!important}
  body{font-size:14px!important}
  section{padding:24px 0!important}
  .project-card{padding:14px!important}
  [style*="display:flex"][style*="gap"]:not(nav *){flex-direction:column!important;align-items:stretch!important}
}`;

const baseStyle = `
*{margin:0;padding:0;box-sizing:border-box;scroll-behavior:smooth}img{max-width:100%}
/* Scroll reveal */
.reveal{opacity:0;transform:translateY(36px);transition:opacity .75s cubic-bezier(.16,1,.3,1),transform .75s cubic-bezier(.16,1,.3,1)}
.reveal.visible{opacity:1;transform:translateY(0)}
.reveal-left{opacity:0;transform:translateX(-36px);transition:opacity .75s cubic-bezier(.16,1,.3,1),transform .75s cubic-bezier(.16,1,.3,1)}
.reveal-left.visible{opacity:1;transform:translateX(0)}
.reveal-scale{opacity:0;transform:scale(.88);transition:opacity .7s ease,transform .7s cubic-bezier(.16,1,.3,1)}
.reveal-scale.visible{opacity:1;transform:scale(1)}
.stagger-1{transition-delay:.08s}.stagger-2{transition-delay:.16s}.stagger-3{transition-delay:.24s}.stagger-4{transition-delay:.32s}
/* Skill tags */
.skill-tag{transition:transform .2s,box-shadow .2s;cursor:default;display:inline-block}
.skill-tag:hover{transform:translateY(-3px) scale(1.06);box-shadow:0 6px 18px rgba(0,0,0,.14)}
/* 3D tilt cards */
.tilt-card{transform-style:preserve-3d;will-change:transform;transition:transform .15s ease,box-shadow .15s ease}
/* Project card hover shadow */
.project-card{transition:transform .4s cubic-bezier(.16,1,.3,1),box-shadow .4s ease}
/* Animated counter */
.animate-count{display:inline-block}
/* Typing cursor */
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.cursor::after{content:'|';animation:blink 1s step-end infinite;margin-left:1px}
/* Pulse avatar ring */
@keyframes pulse-ring{0%,100%{box-shadow:0 0 0 0 currentColor}50%{box-shadow:0 0 0 12px transparent}}
/* Float animation */
@keyframes float{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-14px) rotate(3deg)}}
/* Spin slow */
@keyframes spin-slow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
/* Glow pulse */
@keyframes glow-pulse{0%,100%{filter:drop-shadow(0 0 6px currentColor)}50%{filter:drop-shadow(0 0 18px currentColor)}}
/* Shimmer */
@keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
/* Glitch */
@keyframes glitch1{0%,100%{clip-path:inset(0 0 85% 0)}20%{clip-path:inset(30% 0 55% 0)}40%{clip-path:inset(60% 0 20% 0)}60%{clip-path:inset(10% 0 75% 0)}80%{clip-path:inset(50% 0 35% 0)}}
@keyframes glitch2{0%,100%{clip-path:inset(50% 0 30% 0);transform:translate(-2px,2px)}25%{clip-path:inset(15% 0 70% 0);transform:translate(2px,-1px)}75%{clip-path:inset(75% 0 10% 0);transform:translate(-1px,1px)}}
${responsiveStyles}`;

const scrollScript = `<script>
document.addEventListener('DOMContentLoaded',function(){
  // Reveal on scroll
  var allReveal=document.querySelectorAll('.reveal,.reveal-left,.reveal-scale');
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e,i){
      if(e.isIntersecting){setTimeout(function(){e.target.classList.add('visible');},i*70);obs.unobserve(e.target);}
    });
  },{threshold:.08,rootMargin:'0px 0px -40px 0px'});
  allReveal.forEach(function(el){obs.observe(el);});

  // Skill bars
  document.querySelectorAll('.skill-bar-fill').forEach(function(b){
    var bo=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');bo.unobserve(e.target);}});},{threshold:.5});
    bo.observe(b);
  });

  // Counter animation
  document.querySelectorAll('.animate-count').forEach(function(el){
    var target=parseInt(el.getAttribute('data-count')||'0');
    if(!target)return;
    var co=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){
      var c=0,step=Math.max(1,Math.floor(target/50));
      var timer=setInterval(function(){c=Math.min(c+step,target);el.textContent=c.toLocaleString();if(c>=target)clearInterval(timer);},25);
      co.unobserve(e.target);
    }});},{threshold:.5});
    co.observe(el);
  });

  // 3D tilt on cards
  document.querySelectorAll('.tilt-card').forEach(function(card){
    card.addEventListener('mousemove',function(e){
      var r=card.getBoundingClientRect();
      var x=(e.clientX-r.left)/r.width-.5;
      var y=(e.clientY-r.top)/r.height-.5;
      card.style.transform='perspective(700px) rotateY('+(x*14)+'deg) rotateX('+(-y*14)+'deg) translateZ(6px)';
      card.style.transition='none';
    });
    card.addEventListener('mouseleave',function(){
      card.style.transform='perspective(700px) rotateY(0) rotateX(0) translateZ(0)';
      card.style.transition='transform .5s ease';
    });
  });

  // Nav active state
  var sections=document.querySelectorAll('section[id]');
  window.addEventListener('scroll',function(){
    var cur='';
    sections.forEach(function(s){if(window.scrollY>=s.offsetTop-120)cur=s.id;});
    document.querySelectorAll('nav a[href^="#"]').forEach(function(l){
      l.style.opacity=l.getAttribute('href')==='#'+cur?'1':'.65';
    });
  },{passive:true});

  // ── Universal mobile hamburger sidebar ──
  if(window.innerWidth<768){
    // Collect all section IDs for nav links
    var secs=[];
    document.querySelectorAll('section[id]').forEach(function(s){
      var id=s.id.replace(/^(ch-|lv-|co-|ar-|mo-|sk-|gr-|em-|rk-|mn-|ss-|ry-)/,'');
      var label=id.charAt(0).toUpperCase()+id.slice(1);
      if(label&&secs.indexOf(label)===-1) secs.push({label:label,id:s.id});
    });
    if(secs.length>1){
      // Get header colors
      var hdr=document.querySelector('header,nav');
      var hdrBg=hdr?getComputedStyle(hdr).backgroundColor:'rgba(0,0,0,0.95)';
      var hdrCol=hdr?getComputedStyle(hdr).color:'#fff';

      // Create 3-line hamburger button
      var btn=document.createElement('button');
      btn.id='mob-ham';
      btn.innerHTML='<svg width="20" height="16" viewBox="0 0 20 16" fill="none"><rect width="20" height="2" rx="1" fill="white"/><rect y="7" width="20" height="2" rx="1" fill="white"/><rect y="14" width="20" height="2" rx="1" fill="white"/></svg>';
      btn.style.cssText='position:fixed;top:14px;right:14px;z-index:9999;background:rgba(0,0,0,0.7);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.12);color:#fff;width:44px;height:44px;border-radius:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 15px rgba(0,0,0,0.3);transition:transform 0.2s';
      btn.ontouchstart=function(){btn.style.transform='scale(0.9)';};
      btn.ontouchend=function(){btn.style.transform='scale(1)';};

      // Dark overlay
      var overlay=document.createElement('div');
      overlay.id='mob-overlay';
      overlay.style.cssText='position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,0.5);opacity:0;pointer-events:none;transition:opacity 0.3s ease';

      // Sidebar
      var sidebar=document.createElement('div');
      sidebar.id='mob-sidebar';
      sidebar.style.cssText='position:fixed;top:0;right:0;width:270px;height:100%;z-index:10000;background:rgba(8,8,18,0.98);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);transform:translateX(100%);transition:transform 0.3s cubic-bezier(0.4,0,0.2,1);padding:0;overflow-y:auto;border-left:1px solid rgba(255,255,255,0.08)';

      // Sidebar header
      var sideHdr=document.createElement('div');
      sideHdr.style.cssText='padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between';
      sideHdr.innerHTML='<span style="color:rgba(255,255,255,0.5);font-size:0.75rem;letter-spacing:2px;text-transform:uppercase;font-weight:600">Menu</span>';
      var closeBtn=document.createElement('button');
      closeBtn.innerHTML='<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>';
      closeBtn.style.cssText='background:rgba(255,255,255,0.08);border:none;color:#fff;width:32px;height:32px;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center';
      var closeSidebar=function(){sidebar.style.transform='translateX(100%)';overlay.style.opacity='0';overlay.style.pointerEvents='none';};
      closeBtn.onclick=closeSidebar;
      sideHdr.appendChild(closeBtn);
      sidebar.appendChild(sideHdr);

      // Nav links container
      var linksDiv=document.createElement('div');
      linksDiv.style.cssText='padding:8px 16px';
      secs.forEach(function(s){
        var a=document.createElement('a');
        a.href='#'+s.id;
        a.textContent=s.label;
        a.style.cssText='display:flex;align-items:center;color:rgba(255,255,255,0.65);text-decoration:none;font-size:0.95rem;font-weight:500;padding:14px 12px;border-radius:10px;margin-bottom:2px;transition:all 0.2s';
        a.ontouchstart=function(){this.style.background='rgba(255,255,255,0.06)';this.style.color='#fff';};
        a.ontouchend=function(){var el=this;setTimeout(function(){el.style.background='transparent';el.style.color='rgba(255,255,255,0.65)';},300);};
        a.onclick=function(e){e.preventDefault();closeSidebar();setTimeout(function(){document.getElementById(s.id)?.scrollIntoView({behavior:'smooth'});},300);};
        linksDiv.appendChild(a);
      });
      sidebar.appendChild(linksDiv);

      btn.onclick=function(e){
        e.stopPropagation();
        var isOpen=sidebar.style.transform==='translateX(0px)'||sidebar.style.transform==='translateX(0%)';
        if(isOpen){closeSidebar();}
        else{sidebar.style.transform='translateX(0)';overlay.style.opacity='1';overlay.style.pointerEvents='auto';}
      };
      overlay.onclick=closeSidebar;

      document.body.appendChild(overlay);
      document.body.appendChild(btn);
      document.body.appendChild(sidebar);
    }
  }
});
</script>`;

const mobileBanner = `<div style="display:none;background:linear-gradient(135deg,#0b1f3a,#132f52);color:#b8c7e0;text-align:center;padding:10px 16px;font-size:12px;font-family:system-ui,sans-serif;border-bottom:1px solid rgba(63,196,231,0.2)" id="mobile-banner">
  <span style="color:#69d2f1;font-weight:600">Tip:</span> View on a larger screen for better effects
  <button onclick="this.parentElement.style.display='none'" style="margin-left:12px;background:none;border:none;color:#69d2f1;font-size:16px;cursor:pointer;vertical-align:middle">&times;</button>
</div>
<script>if(window.innerWidth<768)document.getElementById('mobile-banner').style.display='block';</script>`;

const wrapTheme = (fontImport: string, fontFamily: string, body: string) =>
  `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${fontImport}<style>${baseStyle}body{font-family:${fontFamily};line-height:1.7;font-size:16px;overflow-x:hidden}</style></head><body>${mobileBanner}${body}${scrollScript}</body></html>`;

// ─── Theme definitions ────────────────────────────────────────────────────
export const getThemeHtml = (themeId: string, customData?: PortfolioData): string => {
  const d = customData || getPortfolioData();

  switch (themeId) {

    // ── RECRUITER (unchanged, business tool) ──────────────────────────────
    case "recruiter": {
      const s = d.githubStats || { totalCommits:0,publicRepos:0,privateRepos:0,followers:0,following:0,pullRequests:0,pushes:0,daysOnGithub:0,recentCollaborations:[],aiGeneratedContent:0,topLanguages:[],contributionStreak:0 };
      return wrapTheme('','\'Segoe UI\',system-ui,sans-serif',`
        <div style="background:#f8fafc;color:#1e293b;min-height:100vh">
        ${nav('rgba(255,255,255,.95)','#475569','#6366f1',d.name,['Overview','Languages','Experience','Projects','Skills'])}
        <div style="background:#fff;border-bottom:1px solid #e2e8f0;padding:28px 20px"><div style="max-width:900px;margin:0 auto;display:flex;align-items:center;gap:20px;flex-wrap:wrap">
          <div style="width:72px;height:72px;border-radius:50%;overflow:hidden;border:3px solid #6366f1"><img src="${d.avatar}" style="width:100%;height:100%;object-fit:cover"></div>
          <div><h1 style="font-size:1.75rem;font-weight:800">${d.name}</h1><p style="color:#64748b;font-size:1rem">${d.title} · ${d.location}</p></div></div></div>
        <div style="max-width:900px;margin:0 auto;padding:28px 20px">
          <h2 id="overview" style="font-size:1.3rem;font-weight:700;margin:28px 0 14px">GitHub Overview</h2>
          <div class="stats-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:32px">
            ${[[s.totalCommits.toLocaleString(),'Commits'],[s.publicRepos,'Public Repos'],[s.pullRequests,'Pull Requests'],[s.followers.toLocaleString(),'Followers'],[`${s.contributionStreak}d`,'Streak'],[`${Math.floor(s.daysOnGithub/365)}y`,'On GitHub'],[s.pushes.toLocaleString(),'Pushes'],[s.privateRepos,'Private']].map(([v,l])=>`<div class="tilt-card reveal" style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:18px;text-align:center"><div style="font-size:1.5rem;font-weight:800;color:#6366f1">${v}</div><div style="font-size:.7rem;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-top:3px">${l}</div></div>`).join('')}
          </div>
          <h2 id="languages" style="font-size:1.3rem;font-weight:700;margin:28px 0 14px">Languages</h2>
          ${s.topLanguages.length?`<div style="border-radius:10px;overflow:hidden;height:28px;margin-bottom:16px;display:flex">${s.topLanguages.map((l:any,i:number)=>`<div style="width:${l.percentage}%;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;color:#fff;background:${['#6366f1','#f59e0b','#10b981','#ef4444'][i]}">${l.name} ${l.percentage}%</div>`).join('')}</div>`:''}
          ${s.aiGeneratedContent>0?`<div style="background:#fef3c7;border:1px solid #fbbf24;border-radius:10px;padding:14px 18px;margin:14px 0;color:#92400e"><strong>⚠ AI Content Detected:</strong> ${s.aiGeneratedContent} repos may contain AI-generated code.</div>`:''}
          <h2 id="experience" style="font-size:1.3rem;font-weight:700;margin:28px 0 14px">Experience</h2>
          ${d.experience.map(e=>`<div class="tilt-card reveal" style="background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:22px;margin-bottom:12px"><div style="font-weight:700;font-size:1.05rem">${e.role}</div><div style="color:#6366f1">${e.company}</div><div style="color:#94a3b8;font-size:.85rem">${e.period}</div><p style="color:#64748b;margin-top:6px;line-height:1.7">${e.description}</p></div>`).join('')||'<p style="color:#64748b">No experience data.</p>'}
          <h2 id="projects" style="font-size:1.3rem;font-weight:700;margin:28px 0 14px">Projects</h2>
          ${d.projects.map(p=>`<div class="project-card tilt-card reveal" style="background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:22px;margin-bottom:12px"><div style="font-weight:700;font-size:1.05rem">${p.name} ${p.stars?`<span style="color:#f59e0b">★ ${p.stars}</span>`:''}</div><p style="color:#64748b;margin-top:6px;line-height:1.65">${p.description}</p><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px">${p.tech.map(t=>`<span style="background:#f1f5f9;border:1px solid #e2e8f0;padding:3px 10px;border-radius:6px;font-size:.8rem;color:#475569">${t}</span>`).join('')}</div></div>`).join('')}
          <h2 id="skills" style="font-size:1.3rem;font-weight:700;margin:28px 0 14px">Skills</h2>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:40px">${d.skills.map(s=>`<span class="skill-tag" style="background:#f1f5f9;border:1px solid #e2e8f0;padding:7px 16px;border-radius:8px;font-size:.9rem;color:#475569">${s}</span>`).join('')}</div>
        </div></div>`);
    }

    // ── MINIMAL ─ Fixed left sidebar + timeline layout ─────────────────────
    case "minimal":
      return wrapTheme(
        '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">',
        '\'Inter\',sans-serif',
        `<style>
          @media(max-width:768px){
            .sb-aside{position:static!important;width:100%!important;height:auto!important;flex-direction:row!important;flex-wrap:wrap!important;padding:20px!important;border-right:none!important;border-bottom:1px solid #e8e8e8!important}
            .sb-main{margin-left:0!important;max-width:100%!important}
            .sb-name{font-size:1.1rem!important}.sb-links{display:none!important}
          }
          .tl-dot{width:10px;height:10px;border-radius:50%;background:#111;position:absolute;left:-25px;top:6px;flex-shrink:0}
          .tl-line{position:absolute;left:calc(-25px + 4px);top:18px;bottom:-28px;width:2px;background:#eee}
          .sb-link{display:block;padding:8px 12px;border-radius:8px;color:#777;text-decoration:none;font-size:.82rem;font-weight:500;transition:all .2s;letter-spacing:.3px}
          .sb-link:hover,.sb-link.active{color:#111;background:#f0f0f0}
          @keyframes slide-in-left{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
          .sl{animation:slide-in-left .6s cubic-bezier(.16,1,.3,1) both}
          .sl-1{animation-delay:.05s}.sl-2{animation-delay:.1s}.sl-3{animation-delay:.15s}.sl-4{animation-delay:.2s}.sl-5{animation-delay:.25s}.sl-6{animation-delay:.3s}
        </style>
        <div style="display:flex;min-height:100vh;background:#fafafa;color:#111">

          <!-- SIDEBAR -->
          <aside class="sb-aside" style="position:fixed;left:0;top:0;width:256px;height:100vh;background:#fff;border-right:1px solid #ebebeb;display:flex;flex-direction:column;padding:36px 24px;z-index:50;overflow-y:auto">
            <div class="sl sl-1" style="display:flex;align-items:center;gap:12px;margin-bottom:32px">
              <div style="width:44px;height:44px;border-radius:50%;overflow:hidden;flex-shrink:0;border:2px solid #eee"><img src="${d.avatar}" style="width:100%;height:100%;object-fit:cover"></div>
              <div><div class="sb-name" style="font-weight:700;font-size:.95rem;line-height:1.2">${d.name}</div><div style="font-size:.75rem;color:#888;margin-top:1px">${d.title}</div></div>
            </div>
            <nav class="sb-links">
              ${(['about','skills','experience','projects','education','contact']).map((s,i)=>`<a class="sb-link sl sl-${i+1}" href="#${s}" onclick="event.preventDefault();document.getElementById('${s}')?.scrollIntoView({behavior:'smooth'})">${s.charAt(0).toUpperCase()+s.slice(1)}</a>`).join('')}
            </nav>
            <div class="sl sl-6" style="margin-top:auto;padding-top:24px;border-top:1px solid #eee;display:flex;gap:10px;flex-wrap:wrap">
              ${d.github?`<a href="${d.github}" target="_blank" style="font-size:.75rem;color:#888;text-decoration:none;padding:4px 10px;border:1px solid #eee;border-radius:6px;transition:all .2s" onmouseover="this.style.color='#111';this.style.borderColor='#111'" onmouseout="this.style.color='#888';this.style.borderColor='#eee'">GitHub</a>`:''}
              ${d.linkedin?`<a href="${d.linkedin}" target="_blank" style="font-size:.75rem;color:#888;text-decoration:none;padding:4px 10px;border:1px solid #eee;border-radius:6px;transition:all .2s" onmouseover="this.style.color='#111';this.style.borderColor='#111'" onmouseout="this.style.color='#888';this.style.borderColor='#eee'">LinkedIn</a>`:''}
              ${d.website?`<a href="${d.website}" target="_blank" style="font-size:.75rem;color:#888;text-decoration:none;padding:4px 10px;border:1px solid #eee;border-radius:6px;transition:all .2s" onmouseover="this.style.color='#111';this.style.borderColor='#111'" onmouseout="this.style.color='#888';this.style.borderColor='#eee'">Site</a>`:''}
            </div>
          </aside>

          <!-- MAIN -->
          <main class="sb-main" style="margin-left:256px;padding:60px 56px;max-width:760px;width:100%;min-height:100vh">

            <section id="about" style="margin-bottom:64px">
              <h1 style="font-size:2.8rem;font-weight:800;letter-spacing:-2px;line-height:1.05;margin-bottom:8px">${d.name}</h1>
              <p style="color:#555;font-size:1rem;margin-bottom:16px">${d.title} · ${d.location}</p>
              <p style="color:#777;font-size:.95rem;line-height:1.8;max-width:480px;border-left:3px solid #eee;padding-left:16px">${d.bio}</p>
            </section>

            ${d.skills.length?`
            <section id="skills" style="margin-bottom:60px">
              <p class="reveal" style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#bbb;margin-bottom:16px">Skills</p>
              <div class="reveal" style="display:flex;flex-wrap:wrap;gap:8px">
                ${d.skills.map((s,i)=>`<span class="skill-tag" style="background:#fff;border:1.5px solid #e8e8e8;color:#333;padding:6px 14px;border-radius:6px;font-size:.82rem;font-weight:500;animation:slide-in-left .5s ${i*.04}s both">${s}</span>`).join('')}
              </div>
            </section>`:''}

            ${d.experience.length?`
            <section id="experience" style="margin-bottom:60px">
              <p class="reveal" style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#bbb;margin-bottom:28px">Experience</p>
              <div style="padding-left:24px">
                ${d.experience.map((e,i)=>`
                <div class="reveal" style="position:relative;margin-bottom:36px;padding-bottom:${i<d.experience.length-1?'36':'0'}px">
                  <div class="tl-dot"></div>
                  ${i<d.experience.length-1?'<div class="tl-line"></div>':''}
                  <div style="font-size:.72rem;color:#bbb;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px">${e.period}</div>
                  <div style="font-weight:700;font-size:1rem;margin-bottom:2px">${e.role}</div>
                  <div style="color:#555;font-size:.88rem;margin-bottom:8px">${e.company}</div>
                  <p style="color:#777;font-size:.88rem;line-height:1.75">${e.description}</p>
                </div>`).join('')}
              </div>
            </section>`:''}

            ${d.projects.length?`
            <section id="projects" style="margin-bottom:60px">
              <p class="reveal" style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#bbb;margin-bottom:20px">Projects</p>
              <div style="display:flex;flex-direction:column;gap:0">
                ${d.projects.map((p,i)=>`
                <div class="reveal tilt-card" style="padding:20px 0;border-top:1px solid #eee;display:flex;align-items:flex-start;gap:20px;cursor:default">
                  <div style="flex-shrink:0;width:36px;height:36px;background:#f5f5f5;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.75rem;color:#bbb">${String(i+1).padStart(2,'0')}</div>
                  <div style="flex:1">
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
                      <span style="font-weight:700;font-size:.95rem">${p.link?`<a href="${p.link}" target="_blank" style="color:#111;text-decoration:none">${p.name}</a>`:p.name}</span>
                      ${p.stars?`<span style="font-size:.78rem;color:#f59e0b;font-weight:600">★ ${p.stars}</span>`:''}
                    </div>
                    <p style="color:#777;font-size:.85rem;line-height:1.65;margin-bottom:8px">${p.description}</p>
                    <div style="display:flex;flex-wrap:wrap;gap:4px">${p.tech.map(t=>`<span style="font-size:.72rem;color:#999;background:#f5f5f5;padding:2px 8px;border-radius:4px">${t}</span>`).join('')}</div>
                  </div>
                </div>`).join('')}
              </div>
            </section>`:''}

            ${githubActivityHtml(d,'#fff','#eee','#111','#777')}
            ${leetcodeHtml(d,'#fff','#eee','#111','#777')}

            ${d.education.length?`
            <section id="education" style="margin-bottom:60px">
              <p class="reveal" style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#bbb;margin-bottom:20px">Education</p>
              ${d.education.map(e=>`<div class="reveal" style="padding:16px 0;border-top:1px solid #eee"><div style="font-weight:700;font-size:.95rem">${e.degree}</div><div style="color:#555;font-size:.88rem">${e.institution}</div><div style="color:#bbb;font-size:.78rem;margin-top:2px">${e.period}</div></div>`).join('')}
            </section>`:''}

            <section id="contact" style="margin-bottom:40px;padding:28px;background:#fff;border:1px solid #eee;border-radius:12px" class="reveal">
              <p style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#bbb;margin-bottom:12px">Contact</p>
              <a href="${gmailLink(d.email)}" style="font-size:1.1rem;font-weight:600;color:#111;text-decoration:none;display:block;margin-bottom:4px">${d.email}</a>
              <p style="color:#888;font-size:.88rem">${d.location}</p>
            </section>
          </main>
        </div>
        <script>
        // Sidebar active link tracking
        var slinks=document.querySelectorAll('.sb-link');
        var secs=document.querySelectorAll('section[id]');
        window.addEventListener('scroll',function(){
          var cur='';
          secs.forEach(function(s){if(window.scrollY>=s.offsetTop-200)cur=s.id;});
          slinks.forEach(function(l){
            var active=l.getAttribute('href')==='#'+cur;
            l.style.color=active?'#111':'';
            l.style.background=active?'#f0f0f0':'';
          });
        },{passive:true});
        </script>`);

    // ── BOLD ─ Big-type full-screen hero, numbered sections, ticker skills ──
    case "bold":
      return wrapTheme(
        '<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Syne+Mono&display=swap" rel="stylesheet">',
        '\'Syne\',sans-serif',
        `<style>
          @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
          .ticker-track{display:flex;width:max-content;animation:ticker 22s linear infinite}
          .ticker-track:hover{animation-play-state:paused}
          .sec-num{font-family:'Syne Mono',monospace;font-size:7rem;font-weight:400;color:rgba(168,85,247,.07);line-height:1;position:absolute;top:-20px;left:-10px;pointer-events:none;user-select:none}
          .bold-proj{border:1px solid rgba(168,85,247,.18);border-radius:20px;padding:28px;transition:all .35s cubic-bezier(.16,1,.3,1)}
          .bold-proj:hover{border-color:rgba(168,85,247,.5);background:rgba(168,85,247,.06);transform:translateY(-4px)}
          @keyframes fade-up{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
          .fu{animation:fade-up .8s cubic-bezier(.16,1,.3,1) both}
          .fu-1{animation-delay:.1s}.fu-2{animation-delay:.25s}.fu-3{animation-delay:.4s}.fu-4{animation-delay:.55s}
        </style>
        <div style="background:#06030f;color:#fff;min-height:100vh">

          <style>
            @media(max-width:768px){
              .bold-header{padding:12px 16px!important}
              .bold-header .bold-nav{display:none!important}
              .bold-hero{grid-template-columns:1fr!important;padding:0 16px 40px!important;padding-top:80px!important;min-height:auto!important}
              .bold-hero h1{font-size:3rem!important;letter-spacing:-1px!important}
              .bold-avatar{width:200px!important;margin:0 auto!important}
              .bold-sec{padding:40px 16px!important}
            }
          </style>

          <!-- MINIMAL TOP BAR -->
          <header class="bold-header" style="position:fixed;top:0;left:0;right:0;z-index:100;padding:16px 40px;display:flex;align-items:center;justify-content:space-between;background:rgba(6,3,15,.8);backdrop-filter:blur(12px)">
            <span style="font-family:'Syne Mono',monospace;font-size:.85rem;color:rgba(255,255,255,.4);letter-spacing:2px">${d.name.split(' ').map(w=>w[0]).join('')}</span>
            <div class="bold-nav" style="display:flex;gap:24px">
              ${(['Skills','Experience','Projects','Contact']).map(s=>`<a href="#${s.toLowerCase()}" onclick="event.preventDefault();document.getElementById('${s.toLowerCase()}')?.scrollIntoView({behavior:'smooth'})" style="color:rgba(255,255,255,.4);text-decoration:none;font-size:.8rem;letter-spacing:1px;transition:color .2s" onmouseover="this.style.color='#c084fc'" onmouseout="this.style.color='rgba(255,255,255,.4)'">${s}</a>`).join('')}
            </div>
          </header>

          <!-- HERO: Big type + avatar split -->
          <section id="about" class="bold-hero hero-grid" style="min-height:100vh;display:grid;grid-template-columns:1fr 380px;align-items:flex-end;padding:0 40px 60px;padding-top:80px;position:relative;overflow:hidden;gap:40px">
            <div style="position:absolute;inset:0;background:radial-gradient(ellipse 60% 60% at 20% 60%,rgba(168,85,247,.08),transparent)"></div>
            <div style="position:relative;z-index:1;align-self:flex-end">
              <p class="fu fu-1" style="font-family:'Syne Mono',monospace;font-size:.75rem;color:rgba(168,85,247,.7);letter-spacing:4px;margin-bottom:20px">PORTFOLIO · ${new Date().getFullYear()}</p>
              <h1 class="fu fu-2" style="font-size:min(9vw,7rem);font-weight:800;line-height:.92;letter-spacing:-3px;margin-bottom:32px;background:linear-gradient(160deg,#fff 40%,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent">${d.name.split(' ').join('<br>')}</h1>
              <div class="fu fu-3" style="display:flex;align-items:center;gap:20px;flex-wrap:wrap">
                <span style="color:rgba(255,255,255,.5);font-size:.95rem">${d.title}</span>
                <span style="color:rgba(168,85,247,.4)">·</span>
                <span style="color:rgba(255,255,255,.3);font-size:.9rem">${d.location}</span>
              </div>
            </div>
            <div class="fu fu-4" style="align-self:flex-end;position:relative;z-index:1">
              <div style="width:100%;aspect-ratio:1;border-radius:24px;overflow:hidden;border:1px solid rgba(168,85,247,.25);box-shadow:0 40px 80px rgba(168,85,247,.15)"><img src="${d.avatar}" style="width:100%;height:100%;object-fit:cover"></div>
              <div style="margin-top:16px;padding:16px;background:rgba(168,85,247,.06);border:1px solid rgba(168,85,247,.12);border-radius:12px">
                <p style="font-size:.82rem;color:rgba(255,255,255,.5);line-height:1.7">${d.bio}</p>
              </div>
            </div>
          </section>

          <!-- SKILLS TICKER -->
          ${d.skills.length?`
          <section id="skills" style="border-top:1px solid rgba(168,85,247,.12);border-bottom:1px solid rgba(168,85,247,.12);padding:20px 0;overflow:hidden;position:relative">
            <div style="position:absolute;left:0;top:0;bottom:0;width:80px;background:linear-gradient(90deg,#06030f,transparent);z-index:2"></div>
            <div style="position:absolute;right:0;top:0;bottom:0;width:80px;background:linear-gradient(-90deg,#06030f,transparent);z-index:2"></div>
            <div class="ticker-track">
              ${[...d.skills,...d.skills].map(s=>`<span style="display:inline-block;padding:0 28px;font-size:.88rem;color:rgba(255,255,255,.45);white-space:nowrap;letter-spacing:1px">${s} <span style="color:rgba(168,85,247,.4);margin-left:28px">✦</span></span>`).join('')}
            </div>
          </section>`:''}

          <!-- NUMBERED SECTIONS -->
          ${d.experience.length?`
          <section id="experience" class="bold-sec" style="padding:80px 40px;border-bottom:1px solid rgba(168,85,247,.08)">
            <div style="max-width:960px;margin:0 auto">
              <div style="position:relative;margin-bottom:48px">
                <span class="sec-num">01</span>
                <p class="reveal" style="font-family:'Syne Mono',monospace;font-size:.7rem;letter-spacing:4px;color:rgba(168,85,247,.6);margin-bottom:8px">EXPERIENCE</p>
                <h2 class="reveal" style="font-size:2.5rem;font-weight:800;letter-spacing:-1.5px">Where I've worked</h2>
              </div>
              <div style="display:flex;flex-direction:column;gap:0">
                ${d.experience.map((e,i)=>`
                <div class="reveal" style="display:grid;grid-template-columns:140px 1fr;gap:32px;padding:32px 0;border-top:1px solid rgba(255,255,255,.06)${i===d.experience.length-1?';border-bottom:1px solid rgba(255,255,255,.06)':''}">
                  <div>
                    <div style="font-family:'Syne Mono',monospace;font-size:.72rem;color:rgba(255,255,255,.3);letter-spacing:1px">${e.period}</div>
                  </div>
                  <div>
                    <div style="font-weight:700;font-size:1.1rem;margin-bottom:3px">${e.role}</div>
                    <div style="color:#a855f7;font-size:.88rem;margin-bottom:10px">${e.company}</div>
                    <p style="color:rgba(255,255,255,.45);font-size:.88rem;line-height:1.75">${e.description}</p>
                  </div>
                </div>`).join('')}
              </div>
            </div>
          </section>`:''}

          ${d.projects.length?`
          <section id="projects" style="padding:80px 40px;border-bottom:1px solid rgba(168,85,247,.08)">
            <div style="max-width:960px;margin:0 auto">
              <div style="position:relative;margin-bottom:48px">
                <span class="sec-num">02</span>
                <p class="reveal" style="font-family:'Syne Mono',monospace;font-size:.7rem;letter-spacing:4px;color:rgba(168,85,247,.6);margin-bottom:8px">PROJECTS</p>
                <h2 class="reveal" style="font-size:2.5rem;font-weight:800;letter-spacing:-1.5px">Things I've built</h2>
              </div>
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px">
                ${d.projects.map(p=>`
                <div class="bold-proj reveal">
                  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px">
                    <span style="font-weight:700;font-size:1rem">${p.link?`<a href="${p.link}" target="_blank" style="color:#fff;text-decoration:none">${p.name}</a>`:p.name}</span>
                    ${p.stars?`<span style="font-size:.78rem;color:#f59e0b;font-weight:600;white-space:nowrap;margin-left:8px">★ ${p.stars}</span>`:''}
                  </div>
                  <p style="color:rgba(255,255,255,.4);font-size:.85rem;line-height:1.65;margin-bottom:14px">${p.description}</p>
                  <div style="display:flex;flex-wrap:wrap;gap:6px">${p.tech.map(t=>`<span style="font-size:.72rem;color:#c084fc;background:rgba(168,85,247,.1);padding:3px 10px;border-radius:6px">${t}</span>`).join('')}</div>
                </div>`).join('')}
              </div>
            </div>
          </section>`:''}

          ${githubActivityHtml(d,'rgba(255,255,255,.03)','rgba(168,85,247,.12)','#a855f7','rgba(255,255,255,.4)')}

          ${d.education.length?`
          <section id="education" style="padding:80px 40px;border-bottom:1px solid rgba(168,85,247,.08)">
            <div style="max-width:960px;margin:0 auto">
              <div style="position:relative;margin-bottom:40px">
                <span class="sec-num">03</span>
                <p class="reveal" style="font-family:'Syne Mono',monospace;font-size:.7rem;letter-spacing:4px;color:rgba(168,85,247,.6);margin-bottom:8px">EDUCATION</p>
              </div>
              ${d.education.map(e=>`<div class="reveal" style="padding:24px 0;border-top:1px solid rgba(255,255,255,.06)"><div style="font-weight:700;font-size:1.1rem">${e.degree}</div><div style="color:#a855f7;font-size:.9rem">${e.institution}</div><div style="color:rgba(255,255,255,.3);font-size:.78rem;font-family:'Syne Mono',monospace;margin-top:4px">${e.period}</div></div>`).join('')}
            </div>
          </section>`:''}

          <!-- CONTACT FULL-WIDTH -->
          <section id="contact" style="padding:100px 40px;text-align:center;position:relative;overflow:hidden">
            <div style="position:absolute;inset:0;background:radial-gradient(ellipse 50% 80% at 50% 50%,rgba(168,85,247,.06),transparent)"></div>
            <div style="position:relative;z-index:1">
              <p class="reveal" style="font-family:'Syne Mono',monospace;font-size:.7rem;letter-spacing:4px;color:rgba(168,85,247,.5);margin-bottom:16px">CONTACT</p>
              <h2 class="reveal" style="font-size:3rem;font-weight:800;letter-spacing:-2px;margin-bottom:32px">Let's build something.</h2>
              <a href="${gmailLink(d.email)}" class="reveal" style="display:inline-block;padding:16px 48px;background:linear-gradient(135deg,#a855f7,#6366f1);border-radius:50px;color:#fff;text-decoration:none;font-weight:700;font-size:1rem;transition:transform .2s,box-shadow .2s" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 20px 40px rgba(168,85,247,.35)'" onmouseout="this.style.transform='none';this.style.boxShadow='none'">${d.email}</a>
              <div style="display:flex;gap:16px;justify-content:center;margin-top:24px">
                ${d.github?`<a href="${d.github}" target="_blank" style="color:rgba(255,255,255,.35);text-decoration:none;font-size:.85rem;transition:color .2s" onmouseover="this.style.color='#a855f7'" onmouseout="this.style.color='rgba(255,255,255,.35)'">GitHub ↗</a>`:''}
                ${d.linkedin?`<a href="${d.linkedin}" target="_blank" style="color:rgba(255,255,255,.35);text-decoration:none;font-size:.85rem;transition:color .2s" onmouseover="this.style.color='#a855f7'" onmouseout="this.style.color='rgba(255,255,255,.35)'">LinkedIn ↗</a>`:''}
              </div>
            </div>
          </section>
        </div>`);

    // ── CREATIVE ─ Floating pill nav, bento grid, magazine editorial ────────
    case "creative":
      return wrapTheme(
        '<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400&family=Cabinet+Grotesk:wght@400;500;700;800&display=swap" rel="stylesheet">',
        '\'Cabinet Grotesk\',sans-serif',
        `<style>
          @keyframes blob{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}25%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%}50%{border-radius:50% 60% 30% 40%/40% 50% 70% 60%}75%{border-radius:60% 40% 60% 30%/30% 70% 40% 60%}}
          .blob{animation:blob 10s ease-in-out infinite}
          .pill-nav a{color:#1a0e00;text-decoration:none;font-size:.8rem;font-weight:700;padding:8px 16px;border-radius:50px;transition:all .2s}
          .pill-nav a:hover{background:#1a0e00;color:#fff}
          .bento-card{border-radius:20px;overflow:hidden;transition:transform .3s cubic-bezier(.16,1,.3,1)}
          .bento-card:hover{transform:scale(1.02)}
          @keyframes pop-in{from{opacity:0;transform:scale(.92) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
          .pop{animation:pop-in .7s cubic-bezier(.16,1,.3,1) both}
          .pop-1{animation-delay:.05s}.pop-2{animation-delay:.15s}.pop-3{animation-delay:.25s}.pop-4{animation-delay:.35s}
          .alt-row:nth-child(even) .alt-img{order:-1}
          @media(max-width:768px){.bento-grid{grid-template-columns:1fr!important}.pill-nav{left:16px!important;right:16px!important;transform:none!important;width:auto!important}}
        </style>
        <div style="background:#fdf8f0;color:#1a0e00;min-height:100vh;position:relative">

          <!-- FLOATING PILL NAV -->
          <nav class="pill-nav" style="position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:100;background:rgba(255,248,235,.92);backdrop-filter:blur(16px);border:1.5px solid rgba(232,97,0,.15);border-radius:50px;padding:6px;display:flex;align-items:center;gap:2px;box-shadow:0 8px 32px rgba(232,97,0,.12)">
            ${(['About','Skills','Work','Projects','Contact']).map(s=>`<a href="#${s.toLowerCase()}" onclick="event.preventDefault();document.getElementById('${s==='Work'?'experience':s.toLowerCase()}')?.scrollIntoView({behavior:'smooth',block:'start'})">${s}</a>`).join('')}
          </nav>

          <!-- HERO: full-bleed editorial -->
          <section id="about" style="min-height:100vh;display:grid;grid-template-columns:1fr 1fr;position:relative;overflow:hidden" class="hero-grid">
            <!-- LEFT: big display type -->
            <div style="padding:120px 48px 60px;display:flex;flex-direction:column;justify-content:flex-end;position:relative">
              <div style="position:absolute;top:40px;left:40px;width:120px;height:120px;background:linear-gradient(135deg,#fde68a,#fb923c);opacity:.4" class="blob"></div>
              <p class="pop pop-1" style="font-size:.7rem;letter-spacing:5px;text-transform:uppercase;color:#e86100;margin-bottom:20px;position:relative">Creative Portfolio</p>
              <h1 class="pop pop-2" style="font-family:'Fraunces',serif;font-size:min(6vw,5rem);font-weight:900;line-height:.95;letter-spacing:-2px;margin-bottom:24px;position:relative">${d.name.split(' ').join('<br>')}</h1>
              <div class="pop pop-3" style="display:inline-flex;align-items:center;gap:12px;background:#1a0e00;color:#fdf8f0;padding:12px 24px;border-radius:50px;width:fit-content">
                <span style="font-size:.88rem;font-weight:700">${d.title}</span>
              </div>
            </div>
            <!-- RIGHT: image + bio -->
            <div style="background:linear-gradient(160deg,#f97316,#ef4444,#db2777);position:relative;display:flex;flex-direction:column;justify-content:flex-end;padding:48px">
              <div style="position:absolute;top:40px;right:40px;width:160px;height:160px;background:rgba(255,255,255,.15);border-radius:50%"></div>
              <div class="pop pop-2" style="width:100px;height:100px;border-radius:20px;overflow:hidden;border:3px solid rgba(255,255,255,.5);margin-bottom:24px;transform:rotate(-4deg);box-shadow:0 20px 40px rgba(0,0,0,.2)"><img src="${d.avatar}" style="width:100%;height:100%;object-fit:cover"></div>
              <p class="pop pop-3" style="font-family:'Fraunces',serif;font-size:1.2rem;color:rgba(255,255,255,.9);line-height:1.7;font-style:italic">"${d.bio}"</p>
              <div class="pop pop-4" style="margin-top:20px;display:flex;gap:8px">
                ${d.github?`<a href="${d.github}" target="_blank" style="background:rgba(255,255,255,.2);color:#fff;text-decoration:none;padding:8px 16px;border-radius:50px;font-size:.8rem;font-weight:700;transition:background .2s" onmouseover="this.style.background='rgba(255,255,255,.35)'" onmouseout="this.style.background='rgba(255,255,255,.2)'">GitHub ↗</a>`:''}
                ${d.linkedin?`<a href="${d.linkedin}" target="_blank" style="background:rgba(255,255,255,.2);color:#fff;text-decoration:none;padding:8px 16px;border-radius:50px;font-size:.8rem;font-weight:700;transition:background .2s" onmouseover="this.style.background='rgba(255,255,255,.35)'" onmouseout="this.style.background='rgba(255,255,255,.2)'">LinkedIn ↗</a>`:''}
              </div>
            </div>
          </section>

          <!-- SKILLS: colored pill cloud -->
          ${d.skills.length?`
          <section id="skills" style="padding:80px 48px;background:#1a0e00">
            <div style="max-width:900px;margin:0 auto">
              <h2 class="reveal" style="font-family:'Fraunces',serif;font-size:3rem;font-weight:900;color:#fdf8f0;margin-bottom:40px;line-height:1">What I<br><em style="color:#f97316">know</em></h2>
              <div style="display:flex;flex-wrap:wrap;gap:12px">
                ${d.skills.map((s,i)=>{const colors=['#f97316','#ef4444','#ec4899','#a855f7','#3b82f6','#10b981'];const c=colors[i%colors.length];return `<span class="reveal skill-tag" style="background:${c}18;color:${c};border:1.5px solid ${c}44;padding:10px 22px;border-radius:50px;font-size:.9rem;font-weight:700">${s}</span>`;}).join('')}
              </div>
            </div>
          </section>`:''}

          <!-- EXPERIENCE: alternating editorial rows -->
          ${d.experience.length?`
          <section id="experience" style="padding:80px 48px;background:#fdf8f0">
            <div style="max-width:900px;margin:0 auto">
              <h2 class="reveal" style="font-family:'Fraunces',serif;font-size:3rem;font-weight:900;margin-bottom:56px;line-height:1">Work<br><em style="color:#e86100">history</em></h2>
              ${d.experience.map((e,i)=>`
              <div class="reveal" style="display:grid;grid-template-columns:${i%2===0?'1fr 2fr':'2fr 1fr'};gap:40px;padding:36px 0;border-top:2px solid #1a0e0012;align-items:start">
                <div style="${i%2!==0?'order:1':''}">
                  <div style="font-size:2.5rem;font-weight:900;color:rgba(26,14,0,.06);font-family:'Fraunces',serif;line-height:1;margin-bottom:8px">${String(i+1).padStart(2,'0')}</div>
                  <div style="font-size:.7rem;letter-spacing:3px;text-transform:uppercase;color:#e86100;margin-bottom:4px">${e.period}</div>
                  <div style="font-weight:800;font-size:1.1rem">${e.company}</div>
                </div>
                <div>
                  <div style="font-family:'Fraunces',serif;font-size:1.4rem;font-weight:700;margin-bottom:10px;line-height:1.2">${e.role}</div>
                  <p style="color:#78350f;font-size:.9rem;line-height:1.75">${e.description}</p>
                </div>
              </div>`).join('')}
            </div>
          </section>`:''}

          <!-- PROJECTS: bento grid -->
          ${d.projects.length?`
          <section id="projects" style="padding:80px 48px;background:#1a0e00">
            <div style="max-width:900px;margin:0 auto">
              <h2 class="reveal" style="font-family:'Fraunces',serif;font-size:3rem;font-weight:900;color:#fdf8f0;margin-bottom:40px;line-height:1">Selected<br><em style="color:#f97316">work</em></h2>
              <div class="bento-grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px">
                ${d.projects.map((p,i)=>`
                <div class="bento-card reveal" style="background:${i===0?'linear-gradient(135deg,#f97316,#ef4444)':'rgba(255,255,255,.05)'};border:1px solid rgba(255,255,255,.08);padding:28px;${i===0?'grid-column:span 2;':''}">
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
                    <span style="font-weight:800;font-size:1.05rem;color:${i===0?'#fff':'#fdf8f0'}">${p.link?`<a href="${p.link}" target="_blank" style="color:inherit;text-decoration:none">${p.name}</a>`:p.name}</span>
                    ${p.stars?`<span style="font-size:.8rem;color:#fbbf24;font-weight:700">★ ${p.stars}</span>`:''}
                  </div>
                  <p style="color:${i===0?'rgba(255,255,255,.8)':'rgba(253,248,240,.45)'};font-size:.88rem;line-height:1.65;margin-bottom:14px">${p.description}</p>
                  <div style="display:flex;flex-wrap:wrap;gap:6px">${p.tech.map(t=>`<span style="font-size:.72rem;padding:3px 10px;border-radius:6px;background:rgba(255,255,255,.12);color:${i===0?'rgba(255,255,255,.9)':'rgba(253,248,240,.5)'}">${t}</span>`).join('')}</div>
                </div>`).join('')}
              </div>
            </div>
          </section>`:''}

          ${githubActivityHtml(d,'rgba(255,255,255,.05)','rgba(249,115,22,.2)','#f97316','rgba(253,248,240,.5)')}

          <!-- CONTACT: warm full-width CTA -->
          <section id="contact" style="padding:100px 48px;background:linear-gradient(135deg,#fde68a,#fb923c,#f97316);text-align:center;position:relative;overflow:hidden">
            <div style="position:absolute;top:-60px;right:-60px;width:300px;height:300px;background:rgba(255,255,255,.15);border-radius:50%"></div>
            <h2 class="reveal" style="font-family:'Fraunces',serif;font-size:3.5rem;font-weight:900;color:#1a0e00;margin-bottom:16px;line-height:1">Let's create<br>together.</h2>
            <p class="reveal" style="color:#7c2d12;margin-bottom:32px;font-size:1rem">${d.location} · <a href="${gmailLink(d.email)}" style="color:#7c2d12;text-decoration:none;font-weight:600">${d.email}</a></p>
            <div class="reveal" style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
              <a href="${gmailLink(d.email)}" style="background:#1a0e00;color:#fdf8f0;text-decoration:none;padding:14px 36px;border-radius:50px;font-weight:800;font-size:.95rem;transition:transform .2s" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='none'">Email me ↗</a>
              ${d.github?`<a href="${d.github}" target="_blank" style="background:rgba(26,14,0,.1);color:#1a0e00;text-decoration:none;padding:14px 36px;border-radius:50px;font-weight:800;font-size:.95rem;border:2px solid rgba(26,14,0,.2)">GitHub ↗</a>`:''}
              ${d.linkedin?`<a href="${d.linkedin}" target="_blank" style="background:rgba(26,14,0,.1);color:#1a0e00;text-decoration:none;padding:14px 36px;border-radius:50px;font-weight:800;font-size:.95rem;border:2px solid rgba(26,14,0,.2)">LinkedIn ↗</a>`:''}
            </div>
          </section>
        </div>`);

    // ── DEVELOPER ─ Full VS Code IDE layout: activity bar + sidebar + editor ─
    case "developer":
      return wrapTheme(
        '<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">',
        '\'JetBrains Mono\',monospace',
        `<style>
          .vsc-root{display:flex;height:100vh;overflow:hidden;background:#1e1e2e}
          .vsc-activity{width:48px;background:#181825;display:flex;flex-direction:column;align-items:center;padding-top:8px;flex-shrink:0;border-right:1px solid #11111b}
          .vsc-act-icon{width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:8px;cursor:pointer;transition:background .15s;color:#585b70;font-size:1.1rem;margin-bottom:2px;position:relative}
          .vsc-act-icon:hover,.vsc-act-icon.active{color:#cdd6f4;background:#313244}
          .vsc-act-icon.active::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:2px;height:24px;background:#cba6f7;border-radius:0 2px 2px 0}
          .vsc-sidebar{width:220px;background:#181825;border-right:1px solid #11111b;display:flex;flex-direction:column;flex-shrink:0;overflow:hidden}
          .vsc-sidebar-title{padding:10px 16px;font-size:.68rem;letter-spacing:2px;text-transform:uppercase;color:#585b70;border-bottom:1px solid #11111b}
          .vsc-file{padding:7px 16px 7px 32px;font-size:.78rem;color:#a6adc8;cursor:pointer;transition:background .15s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;gap:8px}
          .vsc-file:hover{background:#313244;color:#cdd6f4}
          .vsc-file.active{background:#2d2d3e;color:#cdd6f4}
          .vsc-file-icon{opacity:.6;font-size:.85rem}
          .vsc-main{flex:1;display:flex;flex-direction:column;overflow:hidden}
          .vsc-tabs{background:#181825;display:flex;border-bottom:1px solid #11111b;overflow-x:auto;flex-shrink:0}
          .vsc-tab{padding:9px 18px;font-size:.75rem;color:#585b70;cursor:pointer;border-right:1px solid #11111b;white-space:nowrap;transition:all .15s;display:flex;align-items:center;gap:6px}
          .vsc-tab:hover{color:#a6adc8;background:#252540}
          .vsc-tab.active{color:#cdd6f4;background:#1e1e2e;border-top:1px solid #cba6f7;margin-top:-1px}
          .vsc-editor{flex:1;overflow-y:auto;padding:24px 32px;display:flex;gap:0}
          .vsc-line-nums{padding-right:20px;color:#3b3f5c;font-size:.78rem;line-height:2;text-align:right;user-select:none;min-width:36px;flex-shrink:0}
          .vsc-content{flex:1;font-size:.82rem;line-height:2;color:#cdd6f4}
          .vsc-statusbar{background:#181825;border-top:1px solid #11111b;padding:4px 16px;display:flex;align-items:center;gap:16px;font-size:.7rem;color:#585b70;flex-shrink:0}
          .kw{color:#cba6f7}.str{color:#a6e3a1}.prop{color:#89b4fa}.cmt{color:#585b70}.op{color:#89dceb}.fn{color:#f9e2af}.num{color:#fab387}
          .vsc-section{display:none}.vsc-section.active{display:block}
          @media(max-width:768px){.vsc-activity{display:none}.vsc-sidebar{width:160px}.vsc-editor{padding:16px}}
        </style>
        <div class="vsc-root">
          <!-- ACTIVITY BAR -->
          <div class="vsc-activity">
            ${[['📁','explorer'],['🔍','search'],['⚡','skills'],['💼','experience'],['🚀','projects'],['🎓','education']].map(([icon,id],i)=>`
            <div class="vsc-act-icon${i===0?' active':''}" onclick="setSection('${id}')" title="${id}" id="act-${id}">${icon}</div>`).join('')}
            <div style="flex:1"></div>
            <div style="width:36px;height:36px;border-radius:50%;overflow:hidden;margin:8px auto"><img src="${d.avatar}" style="width:100%;height:100%;object-fit:cover"></div>
          </div>

          <!-- SIDEBAR EXPLORER -->
          <div class="vsc-sidebar">
            <div class="vsc-sidebar-title">EXPLORER</div>
            <div style="padding:8px 0">
              <div style="padding:6px 12px;font-size:.72rem;color:#585b70;display:flex;align-items:center;gap:4px">▾ <span style="color:#a6adc8">portfolio</span></div>
              ${[['about.js','📄','explorer'],['skills.ts','⚡','skills'],['experience.md','💼','experience'],['projects.json','🚀','projects'],['education.txt','🎓','education'],['contact.sh','📬','contact']].map(([file,icon,id])=>`
              <div class="vsc-file${id==='explorer'?' active':''}" onclick="setSection('${id}')" id="file-${id}"><span class="vsc-file-icon">${icon}</span>${file}</div>`).join('')}
            </div>
          </div>

          <!-- MAIN EDITOR -->
          <div class="vsc-main">
            <!-- TABS -->
            <div class="vsc-tabs" id="tab-bar">
              ${[['about.js','explorer'],['skills.ts','skills'],['experience.md','experience'],['projects.json','projects'],['education.txt','education'],['contact.sh','contact']].map(([tab,id])=>`
              <div class="vsc-tab${id==='explorer'?' active':''}" onclick="setSection('${id}')" id="tab-${id}">
                <span style="width:8px;height:8px;border-radius:50%;background:${id==='explorer'?'#a6e3a1':'#585b70'};flex-shrink:0"></span>${tab}
              </div>`).join('')}
            </div>

            <!-- EDITOR CONTENT PANELS -->
            <div class="vsc-editor">
              <div class="vsc-line-nums" id="line-nums">
                ${Array.from({length:30},(_,i)=>i+1).join('<br>')}
              </div>
              <div class="vsc-content">

                <!-- ABOUT -->
                <div class="vsc-section active" id="sec-explorer">
                  <p><span class="cmt">// ${d.name} — portfolio</span></p>
                  <p>&nbsp;</p>
                  <p><span class="kw">const</span> <span class="fn">developer</span> <span class="op">=</span> {</p>
                  <p>&nbsp;&nbsp;<span class="prop">name</span>: <span class="str">"${d.name}"</span>,</p>
                  <p>&nbsp;&nbsp;<span class="prop">role</span>: <span class="str">"${d.title}"</span>,</p>
                  <p>&nbsp;&nbsp;<span class="prop">location</span>: <span class="str">"${d.location}"</span>,</p>
                  <p>&nbsp;&nbsp;<span class="prop">available</span>: <span class="num">true</span>,</p>
                  <p>};</p>
                  <p>&nbsp;</p>
                  <p><span class="cmt">/**</span></p>
                  <p><span class="cmt"> * ${d.bio}</span></p>
                  <p><span class="cmt"> */</span></p>
                  <p>&nbsp;</p>
                  <p><span class="kw">export default</span> <span class="fn">developer</span>;</p>
                  <p>&nbsp;</p>
                  <p><span class="cmt">// Contact</span></p>
                  <p><span class="kw">const</span> <span class="prop">email</span> <span class="op">=</span> <a href="${gmailLink(d.email)}" style="text-decoration:none"><span class="str">"${d.email}"</span></a>;</p>
                  ${d.github?`<p><span class="kw">const</span> <span class="prop">github</span> <span class="op">=</span> <a href="${d.github}" target="_blank" style="text-decoration:none"><span class="str">"${d.github}"</span></a>;</p>`:''}
                  ${d.linkedin?`<p><span class="kw">const</span> <span class="prop">linkedin</span> <span class="op">=</span> <a href="${d.linkedin}" target="_blank" style="text-decoration:none"><span class="str">"${d.linkedin}"</span></a>;</p>`:''}
                </div>

                <!-- SKILLS -->
                <div class="vsc-section" id="sec-skills">
                  <p><span class="cmt">// skills.ts — tech stack</span></p>
                  <p>&nbsp;</p>
                  <p><span class="kw">const</span> <span class="fn">skills</span>: <span class="prop">string</span>[] <span class="op">=</span> [</p>
                  ${d.skills.map(s=>`<p>&nbsp;&nbsp;<span class="str">"${s}"</span>,</p>`).join('')}
                  <p>];</p>
                  <p>&nbsp;</p>
                  <p><span class="cmt">// Render</span></p>
                  <p>&nbsp;</p>
                  <div style="display:flex;flex-wrap:wrap;gap:8px;padding:8px 0">
                    ${d.skills.map(s=>`<span class="skill-tag" style="background:#313244;color:#a6e3a1;padding:5px 14px;border-radius:6px;font-size:.78rem">${s}</span>`).join('')}
                  </div>
                </div>

                <!-- EXPERIENCE -->
                <div class="vsc-section" id="sec-experience">
                  <p><span class="cmt"># experience.md</span></p>
                  <p>&nbsp;</p>
                  ${d.experience.map((e)=>`
                  <div style="margin-bottom:28px;padding:16px;background:#181825;border-radius:10px;border-left:3px solid #cba6f7">
                    <p><span class="fn">${e.role}</span> <span class="op">@</span> <span class="str">${e.company}</span></p>
                    <p style="color:#585b70;font-size:.72rem;margin:4px 0">${e.period}</p>
                    <p style="color:#a6adc8;font-size:.82rem;line-height:1.7;margin-top:8px">${e.description}</p>
                  </div>`).join('')}
                </div>

                <!-- PROJECTS -->
                <div class="vsc-section" id="sec-projects">
                  <p><span class="cmt">// projects.json</span></p>
                  <p>&nbsp;</p>
                  <p>[</p>
                  ${d.projects.map((p,i)=>`
                  <div style="margin:8px 0 16px 16px;padding:16px;background:#181825;border-radius:10px;border:1px solid #313244;transition:border-color .2s" onmouseover="this.style.borderColor='#cba6f7'" onmouseout="this.style.borderColor='#313244'">
                    <p><span class="prop">"name"</span>: <span class="str">"${p.link?`<a href="${p.link}" target="_blank" style="color:#a6e3a1;text-decoration:none">${p.name}</a>`:p.name}"</span>${p.stars?` <span class="cmt">// ★ ${p.stars}</span>`:''}</p>
                    <p><span class="prop">"desc"</span>: <span class="str">"${p.description.slice(0,60)}..."</span></p>
                    <p><span class="prop">"stack"</span>: [<span class="str">${p.tech.map(t=>`"${t}"`).join(', ')}</span>]${i<d.projects.length-1?',':''}</p>
                  </div>`).join('')}
                  <p>]</p>
                </div>

                <!-- EDUCATION -->
                <div class="vsc-section" id="sec-education">
                  <p><span class="cmt"># education.txt</span></p>
                  <p>&nbsp;</p>
                  ${d.education.map(e=>`
                  <div style="margin-bottom:20px;padding:16px;background:#181825;border-radius:10px">
                    <p><span class="fn">${e.degree}</span></p>
                    <p><span class="str">${e.institution}</span></p>
                    <p style="color:#585b70;font-size:.72rem;margin-top:4px">${e.period}</p>
                  </div>`).join('')}
                  ${d.githubStats?`
                  <p>&nbsp;</p>
                  <p><span class="cmt">// GitHub stats</span></p>
                  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px">
                    ${[[d.githubStats.totalCommits.toLocaleString(),'commits'],[d.githubStats.publicRepos,'repos'],[d.githubStats.followers.toLocaleString(),'followers']].map(([v,l])=>`<div style="padding:12px;background:#181825;border-radius:8px;text-align:center"><div style="color:#cba6f7;font-weight:700">${v}</div><div style="color:#585b70;font-size:.68rem">${l}</div></div>`).join('')}
                  </div>`:''}
                </div>

                <!-- CONTACT -->
                <div class="vsc-section" id="sec-contact">
                  <p><span class="cmt">#!/bin/bash</span></p>
                  <p><span class="cmt"># contact.sh — reach out!</span></p>
                  <p>&nbsp;</p>
                  <p><span class="kw">echo</span> <span class="str">"Hello, ${d.name}!"</span></p>
                  <p>&nbsp;</p>
                  <p style="margin:16px 0"><a href="${gmailLink(d.email)}" style="display:inline-block;background:#cba6f7;color:#1e1e2e;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:.85rem">$ mail ${d.email}</a></p>
                  <p>&nbsp;</p>
                  ${d.github?`<p><span class="fn">open</span> <span class="str">"${d.github}"</span></p>`:''}
                  ${d.linkedin?`<p><span class="fn">open</span> <span class="str">"${d.linkedin}"</span></p>`:''}
                </div>

              </div>
            </div>

            <!-- STATUS BAR -->
            <div class="vsc-statusbar">
              <span style="background:#cba6f7;color:#1e1e2e;padding:0 10px;margin-left:-16px;font-weight:700"> main</span>
              <span>⚡ ${d.title}</span>
              <span style="margin-left:auto">${d.location}</span>
              <span>TypeScript</span>
              <span>UTF-8</span>
            </div>
          </div>
        </div>

        <script>
        function setSection(id){
          document.querySelectorAll('.vsc-section').forEach(function(el){el.classList.remove('active');});
          document.querySelectorAll('.vsc-tab').forEach(function(el){el.classList.remove('active');el.querySelector('span').style.background='#585b70';});
          document.querySelectorAll('.vsc-file').forEach(function(el){el.classList.remove('active');});
          document.querySelectorAll('.vsc-act-icon').forEach(function(el){el.classList.remove('active');});
          var sec=document.getElementById('sec-'+id);
          var tab=document.getElementById('tab-'+id);
          var file=document.getElementById('file-'+id);
          var act=document.getElementById('act-'+id);
          if(sec)sec.classList.add('active');
          if(tab){tab.classList.add('active');tab.querySelector('span').style.background='#a6e3a1';}
          if(file)file.classList.add('active');
          if(act)act.classList.add('active');
        }
        </script>`);

    // ── ELEGANT ─ Side-dot nav, full-width alternating sections, luxury mag ─
    case "elegant":
      return wrapTheme(
        '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet">',
        '\'Jost\',sans-serif',
        `<style>
          @keyframes orb-drift{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(20px,-15px) scale(1.05)}66%{transform:translate(-10px,20px) scale(.97)}}
          .drift{animation:orb-drift 12s ease-in-out infinite}
          .dot-nav-item{width:8px;height:8px;border-radius:50%;background:rgba(201,168,76,.3);cursor:pointer;transition:all .3s;position:relative}
          .dot-nav-item:hover,.dot-nav-item.active{background:#c9a84c;transform:scale(1.4)}
          .dot-nav-item::after{content:attr(data-label);position:absolute;right:20px;top:50%;transform:translateY(-50%);font-size:.65rem;letter-spacing:2px;text-transform:uppercase;color:#c9a84c;white-space:nowrap;opacity:0;transition:opacity .2s;font-family:'Jost',sans-serif}
          .dot-nav-item:hover::after{opacity:1}
          .eln-rule{width:60px;height:1px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);margin:0 auto 32px}
          @keyframes wipe-in{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
          .wipe{animation:wipe-in .9s cubic-bezier(.16,1,.3,1) both}
          .wipe-1{animation-delay:.1s}.wipe-2{animation-delay:.3s}.wipe-3{animation-delay:.5s}
          @media(max-width:768px){.dot-nav-fixed{display:none!important}.eln-two-col{grid-template-columns:1fr!important}}
        </style>
        <div style="background:#06050a;color:#e8e4df;min-height:100vh;overflow-x:hidden">

          <!-- SIDE DOT NAV (right edge, fixed) -->
          <nav class="dot-nav-fixed" style="position:fixed;right:28px;top:50%;transform:translateY(-50%);z-index:100;display:flex;flex-direction:column;gap:14px;align-items:center">
            ${[['about','About'],['skills','Skills'],['experience','Experience'],['projects','Projects'],['education','Education'],['contact','Contact']].map(([id,label],i)=>`
            <div class="dot-nav-item${i===0?' active':''}" data-label="${label}" id="dot-${id}" onclick="scrollToSection('${id}')"></div>`).join('')}
          </nav>

          <!-- HERO: full-viewport, pure typography, centered -->
          <section id="about" style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:60px 40px;position:relative;overflow:hidden">
            <!-- Drifting orbs -->
            <div class="drift" style="position:absolute;top:15%;left:12%;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(201,168,76,.05),transparent 70%);pointer-events:none"></div>
            <div class="drift" style="position:absolute;bottom:15%;right:10%;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(201,168,76,.04),transparent 70%);pointer-events:none;animation-delay:-5s"></div>

            <!-- Monogram -->
            <div class="wipe wipe-1" style="width:80px;height:80px;border:1px solid rgba(201,168,76,.3);border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:40px;position:relative">
              <img src="${d.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;opacity:.7">
              <div style="position:absolute;inset:-6px;border-radius:50%;border:1px solid rgba(201,168,76,.12)"></div>
            </div>

            <!-- Decorative rule top -->
            <div class="wipe wipe-1" style="display:flex;align-items:center;gap:20px;margin-bottom:28px">
              <div style="flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,.4))"></div>
              <span style="font-size:.6rem;letter-spacing:6px;color:rgba(201,168,76,.6);text-transform:uppercase">Portfolio</span>
              <div style="flex:1;height:1px;background:linear-gradient(-90deg,transparent,rgba(201,168,76,.4))"></div>
            </div>

            <h1 class="wipe wipe-2" style="font-family:'Cormorant Garamond',serif;font-size:min(7vw,5.5rem);font-weight:300;letter-spacing:8px;text-transform:uppercase;color:#e8e4df;line-height:1.2;margin-bottom:24px">${d.name}</h1>

            <div class="eln-rule wipe wipe-2"></div>

            <p class="wipe wipe-3" style="color:#c9a84c;font-size:.8rem;letter-spacing:5px;text-transform:uppercase;font-weight:400;margin-bottom:20px">${d.title}</p>
            <p class="wipe wipe-3" style="font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-style:italic;color:#5a554e;max-width:480px;line-height:2">"${d.bio}"</p>

            <!-- Scroll cue -->
            <div style="position:absolute;bottom:40px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;opacity:.35">
              <span style="font-size:.6rem;letter-spacing:3px;text-transform:uppercase;color:#c9a84c">Scroll</span>
              <div style="width:1px;height:40px;background:linear-gradient(180deg,#c9a84c,transparent)"></div>
            </div>
          </section>

          <!-- SKILLS: full-width dark strip -->
          ${d.skills.length?`
          <section id="skills" style="padding:100px 0;background:#0c0b0f;position:relative;overflow:hidden">
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(201,168,76,.03),transparent 70%);pointer-events:none"></div>
            <div style="max-width:900px;margin:0 auto;padding:0 60px;text-align:center;position:relative">
              <p class="reveal" style="font-size:.65rem;letter-spacing:5px;text-transform:uppercase;color:rgba(201,168,76,.5);margin-bottom:12px">Expertise</p>
              <div class="eln-rule reveal"></div>
              <h2 class="reveal" style="font-family:'Cormorant Garamond',serif;font-size:3rem;font-weight:300;letter-spacing:3px;text-transform:uppercase;color:#e8e4df;margin-bottom:48px">Skills</h2>
              <div class="reveal" style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center">
                ${d.skills.map(s=>`<span class="skill-tag" style="color:#e8d5a0;border:1px solid rgba(201,168,76,.4);padding:10px 26px;border-radius:3px;font-size:.9rem;letter-spacing:1px;text-transform:uppercase;background:rgba(201,168,76,.07);font-family:'Jost',sans-serif;font-weight:500;transition:all .3s" onmouseover="this.style.background='rgba(201,168,76,.16)';this.style.borderColor='rgba(201,168,76,.7)';this.style.color='#f5e6c0'" onmouseout="this.style.background='rgba(201,168,76,.07)';this.style.borderColor='rgba(201,168,76,.4)';this.style.color='#e8d5a0'">${s}</span>`).join('')}
              </div>
            </div>
          </section>`:''}

          <!-- EXPERIENCE: alternating two-column rows with large decor number -->
          ${d.experience.length?`
          <section id="experience" style="padding:100px 0">
            <div style="max-width:1000px;margin:0 auto;padding:0 60px">
              <div style="text-align:center;margin-bottom:72px">
                <p class="reveal" style="font-size:.65rem;letter-spacing:5px;text-transform:uppercase;color:rgba(201,168,76,.5);margin-bottom:12px">Career</p>
                <div class="eln-rule reveal"></div>
                <h2 class="reveal" style="font-family:'Cormorant Garamond',serif;font-size:3rem;font-weight:300;letter-spacing:3px;text-transform:uppercase;color:#e8e4df">Experience</h2>
              </div>
              ${d.experience.map((e,i)=>`
              <div class="reveal eln-two-col" style="display:grid;grid-template-columns:1fr 1fr;gap:0;border-top:1px solid rgba(201,168,76,.1);padding:56px 0;align-items:center">
                <div style="${i%2!==0?'order:1;text-align:right;':''}padding:0 40px 0 0;${i%2!==0?'padding:0 0 0 40px;':''}">
                  <span style="font-family:'Cormorant Garamond',serif;font-size:5rem;font-weight:300;color:rgba(201,168,76,.08);line-height:1;display:block">${String(i+1).padStart(2,'0')}</span>
                  <p style="font-size:.65rem;letter-spacing:4px;text-transform:uppercase;color:rgba(201,168,76,.4);margin:8px 0 6px">${e.period}</p>
                  <p style="color:#c9a84c;font-size:.9rem;font-weight:500">${e.company}</p>
                </div>
                <div style="${i%2!==0?'order:0;':''}border-left:${i%2===0?'1':'0'}px solid rgba(201,168,76,.12);border-right:${i%2!==0?'1':'0'}px solid rgba(201,168,76,.12);padding:0 ${i%2===0?'0 0 40':'40 0 0'}px">
                  <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.7rem;font-weight:400;color:#e8e4df;margin-bottom:12px;letter-spacing:1px">${e.role}</h3>
                  <p style="color:#a89e90;font-size:.92rem;line-height:1.9;font-family:'Jost',sans-serif;font-weight:300">${e.description}</p>
                </div>
              </div>`).join('')}
            </div>
          </section>`:''}

          <!-- PROJECTS: wide cards with number overlay -->
          ${d.projects.length?`
          <section id="projects" style="padding:100px 0;background:#0c0b0f">
            <div style="max-width:1000px;margin:0 auto;padding:0 60px">
              <div style="text-align:center;margin-bottom:72px">
                <p class="reveal" style="font-size:.65rem;letter-spacing:5px;text-transform:uppercase;color:rgba(201,168,76,.5);margin-bottom:12px">Works</p>
                <div class="eln-rule reveal"></div>
                <h2 class="reveal" style="font-family:'Cormorant Garamond',serif;font-size:3rem;font-weight:300;letter-spacing:3px;text-transform:uppercase;color:#e8e4df">Projects</h2>
              </div>
              ${d.projects.map((p,i)=>`
              <div class="reveal tilt-card" style="display:grid;grid-template-columns:80px 1fr;gap:32px;padding:40px;border:1px solid rgba(201,168,76,.1);border-radius:4px;margin-bottom:16px;background:rgba(201,168,76,.02);transition:background .3s,border-color .3s" onmouseover="this.style.background='rgba(201,168,76,.05)';this.style.borderColor='rgba(201,168,76,.3)'" onmouseout="this.style.background='rgba(201,168,76,.02)';this.style.borderColor='rgba(201,168,76,.1)'">
                <div style="font-family:'Cormorant Garamond',serif;font-size:3rem;font-weight:300;color:rgba(201,168,76,.2);line-height:1;align-self:flex-start">${String(i+1).padStart(2,'0')}</div>
                <div>
                  <div style="display:flex;align-items:center;gap:16px;margin-bottom:8px">
                    <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:400;color:#c9a84c;letter-spacing:1px">${p.link?`<a href="${p.link}" target="_blank" style="color:inherit;text-decoration:none">${p.name}</a>`:p.name}</h3>
                    ${p.stars?`<span style="font-size:.78rem;color:#5a554e">✦ ${p.stars}</span>`:''}
                  </div>
                  <p style="color:#5a554e;font-size:.88rem;line-height:1.85;margin-bottom:14px">${p.description}</p>
                  <div style="display:flex;flex-wrap:wrap;gap:8px">${p.tech.map(t=>`<span style="font-size:.7rem;letter-spacing:1.5px;text-transform:uppercase;color:rgba(201,168,76,.4);padding:3px 10px;border:1px solid rgba(201,168,76,.15);border-radius:2px">${t}</span>`).join('')}</div>
                </div>
              </div>`).join('')}
            </div>
          </section>`:''}

          ${githubActivityHtml(d,'rgba(201,168,76,.03)','rgba(201,168,76,.12)','#c9a84c','#5a554e')}

          <!-- EDUCATION -->
          ${d.education.length?`
          <section id="education" style="padding:100px 0">
            <div style="max-width:900px;margin:0 auto;padding:0 60px;text-align:center">
              <p class="reveal" style="font-size:.65rem;letter-spacing:5px;text-transform:uppercase;color:rgba(201,168,76,.5);margin-bottom:12px">Formation</p>
              <div class="eln-rule reveal"></div>
              <h2 class="reveal" style="font-family:'Cormorant Garamond',serif;font-size:3rem;font-weight:300;letter-spacing:3px;text-transform:uppercase;color:#e8e4df;margin-bottom:48px">Education</h2>
              ${d.education.map(e=>`
              <div class="reveal" style="padding:32px 40px;border:1px solid rgba(201,168,76,.1);border-radius:4px;display:inline-block;text-align:center;min-width:300px">
                <div style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:400;color:#e8e4df;margin-bottom:6px">${e.degree}</div>
                <div style="color:#c9a84c;font-size:.85rem;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px">${e.institution}</div>
                <div style="color:rgba(201,168,76,.3);font-size:.75rem;letter-spacing:2px">${e.period}</div>
              </div>`).join('')}
            </div>
          </section>`:''}

          <!-- CONTACT: centered full-width, minimal -->
          <section id="contact" style="padding:120px 40px;text-align:center;border-top:1px solid rgba(201,168,76,.08)">
            <p class="reveal" style="font-size:.65rem;letter-spacing:5px;text-transform:uppercase;color:rgba(201,168,76,.4);margin-bottom:12px">Contact</p>
            <div class="eln-rule reveal"></div>
            <h2 class="reveal" style="font-family:'Cormorant Garamond',serif;font-size:4rem;font-weight:300;letter-spacing:4px;text-transform:uppercase;color:#e8e4df;margin-bottom:40px">Say Hello.</h2>
            <a href="${gmailLink(d.email)}" class="reveal" style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-style:italic;color:#c9a84c;text-decoration:none;border-bottom:1px solid rgba(201,168,76,.3);padding-bottom:2px;transition:border-color .3s" onmouseover="this.style.borderColor='#c9a84c'" onmouseout="this.style.borderColor='rgba(201,168,76,.3)'">${d.email}</a>
            <div class="reveal" style="display:flex;gap:24px;justify-content:center;margin-top:32px">
              ${d.github?`<a href="${d.github}" target="_blank" style="font-size:.7rem;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,.4);text-decoration:none;transition:color .2s" onmouseover="this.style.color='#c9a84c'" onmouseout="this.style.color='rgba(201,168,76,.4)'">GitHub</a>`:''}
              ${d.linkedin?`<a href="${d.linkedin}" target="_blank" style="font-size:.7rem;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,.4);text-decoration:none;transition:color .2s" onmouseover="this.style.color='#c9a84c'" onmouseout="this.style.color='rgba(201,168,76,.4)'">LinkedIn</a>`:''}
              ${d.website?`<a href="${d.website}" target="_blank" style="font-size:.7rem;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,.4);text-decoration:none;transition:color .2s" onmouseover="this.style.color='#c9a84c'" onmouseout="this.style.color='rgba(201,168,76,.4)'">Website</a>`:''}
            </div>
          </section>
        </div>

        <script>
        function scrollToSection(id){document.getElementById(id)?.scrollIntoView({behavior:'smooth'});}
        // Dot nav active tracking
        var elnSecs=document.querySelectorAll('section[id]');
        var dots=document.querySelectorAll('.dot-nav-item');
        window.addEventListener('scroll',function(){
          var cur='';
          elnSecs.forEach(function(s){if(window.scrollY>=s.offsetTop-300)cur=s.id;});
          dots.forEach(function(d){
            var active=d.id==='dot-'+cur;
            d.style.background=active?'#c9a84c':'rgba(201,168,76,.3)';
            d.style.transform=active?'scale(1.4)':'scale(1)';
          });
        },{passive:true});
        </script>`);

    // ── NEON ─ Cyberpunk, animated perspective grid, glitch ───────────────
    // ── NEON ─ Cyberpunk scroll-snap, glitch, perspective grid ───────────────
    case "neon":
      return wrapTheme(
        '<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Share+Tech+Mono&display=swap" rel="stylesheet">',
        '\'Share Tech Mono\',monospace',
        `<style>
          html,body{scroll-snap-type:y mandatory;overflow-y:scroll;height:100%}
          .snap{scroll-snap-align:start;min-height:100vh}
          .glitch{position:relative}.glitch::before,.glitch::after{content:attr(data-text);position:absolute;top:0;left:0;right:0;pointer-events:none}
          .glitch::before{color:#f0f;animation:glitch1 4s infinite}
          .glitch::after{color:#0ff;animation:glitch2 4s .5s infinite}
          .scanline{pointer-events:none;position:fixed;inset:0;z-index:2;background:repeating-linear-gradient(0deg,rgba(0,255,255,.012) 0px,rgba(0,255,255,.012) 1px,transparent 1px,transparent 3px)}
          .neon-border{border:1px solid rgba(0,255,255,.2);transition:border-color .3s,box-shadow .3s}
          .neon-border:hover{border-color:rgba(0,255,255,.6);box-shadow:0 0 20px rgba(0,255,255,.1)}
          .neon-nav a{color:rgba(255,255,255,.45);text-decoration:none;font-size:.75rem;letter-spacing:2px;text-transform:uppercase;transition:color .2s}
          .neon-nav a:hover{color:#0ff}
          @media(max-width:768px){html,body{scroll-snap-type:none!important}h1{font-size:2rem!important}.snap{min-height:auto!important;padding:60px 20px!important}}
        </style>
        <div style="background:#040410;color:#e0e0ff;position:relative">
        <div class="scanline"></div>
        ${gridCanvas('rgba(0,255,255,','.06')}
        <header class="neon-nav" style="position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(4,4,16,.88);backdrop-filter:blur(12px);padding:14px 40px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(0,255,255,.1)">
          <span style="font-family:'Orbitron',sans-serif;font-size:.75rem;color:#0ff;letter-spacing:3px">${d.name.split(' ').map((w: string)=>w[0]).join('')}.EXE</span>
          <div style="display:flex;gap:20px;flex-wrap:wrap">${(['ABOUT','SKILLS','WORK','PROJECTS','CONTACT']).map(s=>`<a href="#${s.toLowerCase()}" onclick="event.preventDefault();document.getElementById('${s==='WORK'?'experience':s.toLowerCase()}')?.scrollIntoView({behavior:'smooth'})">${s}</a>`).join('')}</div>
        </header>
        <section id="about" class="snap" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:80px 28px;position:relative;overflow:hidden;z-index:3">
          <div style="width:110px;height:110px;border-radius:50%;overflow:hidden;margin:0 auto 28px;border:2px solid #0ff;box-shadow:0 0 20px rgba(0,255,255,.4),0 0 60px rgba(0,255,255,.15)"><img src="${d.avatar}" style="width:100%;height:100%;object-fit:cover"></div>
          <h1 class="glitch" data-text="${d.name}" style="font-family:'Orbitron',sans-serif;font-size:clamp(1.8rem,5vw,3.2rem);font-weight:900;color:#0ff;text-shadow:0 0 20px rgba(0,255,255,.6);margin-bottom:12px;letter-spacing:2px">${d.name}</h1>
          <p style="color:#f0f;font-size:.9rem;text-shadow:0 0 12px rgba(255,0,255,.5);letter-spacing:4px;font-family:'Orbitron',sans-serif;margin-bottom:16px">${d.title}</p>
          <p style="color:#555;max-width:480px;margin:0 auto;line-height:1.8;font-size:.88rem">${d.bio}</p>
          <div style="margin-top:28px;display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
            ${d.github?`<a href="${d.github}" target="_blank" style="border:1px solid rgba(0,255,255,.4);color:#0ff;padding:10px 24px;border-radius:4px;text-decoration:none;font-size:.8rem;letter-spacing:2px;transition:all .2s" onmouseover="this.style.background='rgba(0,255,255,.1)'" onmouseout="this.style.background='transparent'">GITHUB</a>`:''}
            ${d.linkedin?`<a href="${d.linkedin}" target="_blank" style="border:1px solid rgba(255,0,255,.4);color:#f0f;padding:10px 24px;border-radius:4px;text-decoration:none;font-size:.8rem;letter-spacing:2px;transition:all .2s" onmouseover="this.style.background='rgba(255,0,255,.1)'" onmouseout="this.style.background='transparent'">LINKEDIN</a>`:''}
          </div>
          <div style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);color:rgba(0,255,255,.3);font-size:.65rem;letter-spacing:3px;animation:float 2s ease-in-out infinite">▼ SCROLL</div>
        </section>
        ${d.skills.length?`<section id="skills" class="snap" style="padding:80px 40px;display:flex;flex-direction:column;justify-content:center;position:relative;z-index:3"><div style="max-width:900px;margin:0 auto;width:100%"><p style="font-family:'Orbitron',sans-serif;font-size:.65rem;letter-spacing:4px;color:rgba(0,255,255,.5);margin-bottom:8px">01 SKILLS.EXE</p><h2 style="font-family:'Orbitron',sans-serif;font-size:2rem;color:#0ff;margin-bottom:40px">Tech Stack</h2><div style="display:flex;flex-wrap:wrap;gap:10px">${d.skills.map((s:string)=>`<span class="skill-tag neon-border" style="color:#0ff;background:rgba(0,255,255,.05);padding:10px 20px;border-radius:4px;font-size:.82rem;letter-spacing:1px">${s}</span>`).join('')}</div></div></section>`:''}
        ${d.experience.length?`<section id="experience" class="snap" style="padding:80px 40px;display:flex;flex-direction:column;justify-content:center;position:relative;z-index:3"><div style="max-width:900px;margin:0 auto;width:100%"><p style="font-family:'Orbitron',sans-serif;font-size:.65rem;letter-spacing:4px;color:rgba(0,255,255,.5);margin-bottom:8px">02 WORK.LOG</p><h2 style="font-family:'Orbitron',sans-serif;font-size:2rem;color:#0ff;margin-bottom:40px">Experience</h2>${d.experience.map((e:{role:string,company:string,period:string,description:string})=>`<div class="neon-border reveal" style="border-radius:8px;padding:24px;margin-bottom:16px;background:rgba(0,255,255,.02)"><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:8px"><div><div style="color:#0ff;font-size:.95rem;font-weight:700;font-family:'Orbitron',sans-serif">${e.role}</div><div style="color:#f0f;font-size:.82rem;margin-top:2px">${e.company}</div></div><div style="color:rgba(0,255,255,.4);font-size:.72rem">${e.period}</div></div><p style="color:#666;font-size:.85rem;line-height:1.75">${e.description}</p></div>`).join('')}</div></section>`:''}
        ${d.projects.length?`<section id="projects" class="snap" style="padding:80px 40px;display:flex;flex-direction:column;justify-content:center;position:relative;z-index:3"><div style="max-width:900px;margin:0 auto;width:100%"><p style="font-family:'Orbitron',sans-serif;font-size:.65rem;letter-spacing:4px;color:rgba(0,255,255,.5);margin-bottom:8px">03 PROJECTS.DIR</p><h2 style="font-family:'Orbitron',sans-serif;font-size:2rem;color:#0ff;margin-bottom:40px">Projects</h2><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px">${d.projects.map((p:{name:string,description:string,tech:string[],stars:number,link:string})=>`<div class="neon-border tilt-card reveal" style="border-radius:8px;padding:22px;background:rgba(0,255,255,.02)"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#0ff;font-family:'Orbitron',sans-serif;font-size:.85rem">${p.link?`<a href="${p.link}" target="_blank" style="color:#0ff;text-decoration:none">${p.name}</a>`:p.name}</span>${p.stars?`<span style="color:#fbbf24;font-size:.8rem">★ ${p.stars}</span>`:''}</div><p style="color:#555;font-size:.8rem;line-height:1.65;margin-bottom:12px">${p.description}</p><div style="display:flex;flex-wrap:wrap;gap:6px">${p.tech.map((t:string)=>`<span style="font-size:.7rem;color:#f0f;background:rgba(255,0,255,.08);padding:3px 10px;border-radius:4px">${t}</span>`).join('')}</div></div>`).join('')}</div></div></section>`:''}
        <section id="contact" class="snap" style="padding:80px 40px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;position:relative;z-index:3">
          <p style="font-family:'Orbitron',sans-serif;font-size:.65rem;letter-spacing:4px;color:rgba(0,255,255,.5);margin-bottom:8px">04 CONTACT.SH</p>
          <h2 style="font-family:'Orbitron',sans-serif;font-size:2rem;color:#0ff;margin-bottom:12px">Initialize Contact</h2>
          ${githubActivityHtml(d,'rgba(0,255,255,.04)','rgba(0,255,255,.15)','#0ff','#555')}
          ${leetcodeHtml(d,'rgba(0,255,255,.04)','rgba(0,255,255,.15)','#0ff','#555')}
          <a href="${gmailLink(d.email)}" style="display:inline-block;margin-top:20px;border:1px solid #0ff;color:#0ff;padding:14px 40px;border-radius:4px;text-decoration:none;font-family:'Orbitron',sans-serif;font-size:.82rem;letter-spacing:3px;transition:all .2s" onmouseover="this.style.background='rgba(0,255,255,.1)';this.style.boxShadow='0 0 30px rgba(0,255,255,.2)'" onmouseout="this.style.background='transparent';this.style.boxShadow='none'">SEND MESSAGE</a>
        </section>
        </div>`);

    // ── OCEAN ─ Split-pane: sticky left bio + scrolling right content ─────────
    case "ocean":
      return wrapTheme(
        '<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">',
        '\'Nunito\',sans-serif',
        `<style>
          .ocean-split{display:flex;min-height:100vh}
          .ocean-left{width:300px;flex-shrink:0;position:sticky;top:0;height:100vh;overflow-y:auto;background:linear-gradient(180deg,#0284c7,#0369a1 50%,#075985);padding:36px 28px;display:flex;flex-direction:column}
          .ocean-right{flex:1;background:#f0f9ff;padding:48px 40px}
          .ocean-card{background:#fff;border:1px solid #e0f2fe;border-radius:14px;padding:22px;margin-bottom:14px;transition:transform .3s,box-shadow .3s}
          .ocean-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(2,132,199,.12)}
          .ocean-skill{background:rgba(255,255,255,.18);color:#fff;border-radius:50px;padding:6px 14px;font-size:.78rem;font-weight:700;display:inline-block;margin:3px;border:1.5px solid rgba(255,255,255,.35);transition:all .2s}
          .ocean-skill:hover{background:rgba(255,255,255,.28);border-color:rgba(255,255,255,.6)}
          @media(max-width:768px){.ocean-split{flex-direction:column}.ocean-left{width:100%!important;position:relative!important;height:auto!important;padding:28px 20px!important}.ocean-right{padding:28px 20px!important}}
        </style>
        <div class="ocean-split">
          <aside class="ocean-left">
            <div style="margin-bottom:28px">
              <div style="width:90px;height:90px;border-radius:50%;overflow:hidden;border:3px solid rgba(255,255,255,.6);box-shadow:0 0 0 6px rgba(255,255,255,.15);margin-bottom:16px"><img src="${d.avatar}" style="width:100%;height:100%;object-fit:cover"></div>
              <h1 style="font-size:1.3rem;font-weight:900;color:#fff;line-height:1.2;margin-bottom:4px">${d.name}</h1>
              <p style="color:rgba(255,255,255,.75);font-size:.82rem;margin-bottom:12px">${d.title}</p>
              <p style="color:rgba(255,255,255,.55);font-size:.78rem;line-height:1.7">${d.bio}</p>
            </div>
            <div style="margin-bottom:24px">
              <p style="font-size:.62rem;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,.4);margin-bottom:10px">Skills</p>
              <div style="display:flex;flex-wrap:wrap;gap:0">${d.skills.map((s:string)=>`<span class="ocean-skill">${s}</span>`).join('')}</div>
            </div>
            <div style="margin-top:auto;padding-top:20px;border-top:1px solid rgba(255,255,255,.15)">
              <p style="font-size:.62rem;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,.4);margin-bottom:10px">Connect</p>
              <p style="color:rgba(255,255,255,.6);font-size:.78rem;margin-bottom:6px">📧 <a href="${gmailLink(d.email)}" style="color:rgba(255,255,255,.85);text-decoration:none;font-weight:600">${d.email}</a></p>
              <p style="color:rgba(255,255,255,.6);font-size:.78rem;margin-bottom:12px">📍 ${d.location}</p>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                ${d.github?`<a href="${d.github}" target="_blank" style="color:#fff;background:rgba(255,255,255,.15);text-decoration:none;padding:6px 14px;border-radius:50px;font-size:.72rem;font-weight:700;border:1px solid rgba(255,255,255,.25)">GitHub</a>`:''}
                ${d.linkedin?`<a href="${d.linkedin}" target="_blank" style="color:#fff;background:rgba(255,255,255,.15);text-decoration:none;padding:6px 14px;border-radius:50px;font-size:.72rem;font-weight:700;border:1px solid rgba(255,255,255,.25)">LinkedIn</a>`:''}
              </div>
            </div>
          </aside>
          <main class="ocean-right">
            ${d.experience.length?`<section id="experience" style="margin-bottom:56px"><p style="font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:3px;color:#0284c7;margin-bottom:8px">Experience</p><h2 class="reveal" style="font-size:1.6rem;font-weight:900;color:#0c4a6e;margin-bottom:24px">Where I've worked</h2>${d.experience.map((e:{role:string,company:string,period:string,description:string})=>`<div class="ocean-card tilt-card reveal"><div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:6px"><div><div style="font-weight:800;font-size:1rem;color:#0c4a6e">${e.role}</div><div style="color:#0284c7;font-size:.88rem;font-weight:600">${e.company}</div></div><span style="font-size:.72rem;color:#7dd3fc;background:#e0f2fe;padding:3px 10px;border-radius:50px;white-space:nowrap">${e.period}</span></div><p style="color:#64748b;font-size:.88rem;line-height:1.75">${e.description}</p></div>`).join('')}</section>`:''}
            ${d.projects.length?`<section id="projects" style="margin-bottom:56px"><p style="font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:3px;color:#0284c7;margin-bottom:8px">Projects</p><h2 class="reveal" style="font-size:1.6rem;font-weight:900;color:#0c4a6e;margin-bottom:24px">Things I've built</h2><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px">${d.projects.map((p:{name:string,description:string,tech:string[],stars:number,link:string})=>`<div class="ocean-card tilt-card reveal"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-weight:800;color:#0c4a6e;font-size:.95rem">${p.link?`<a href="${p.link}" target="_blank" style="color:#0c4a6e;text-decoration:none">${p.name}</a>`:p.name}</span>${p.stars?`<span style="color:#f59e0b;font-size:.82rem;font-weight:700">★ ${p.stars}</span>`:''}</div><p style="color:#64748b;font-size:.85rem;line-height:1.65;margin-bottom:12px">${p.description}</p><div style="display:flex;flex-wrap:wrap;gap:5px">${p.tech.map((t:string)=>`<span style="font-size:.72rem;color:#0369a1;background:#e0f2fe;padding:3px 10px;border-radius:50px;font-weight:600">${t}</span>`).join('')}</div></div>`).join('')}</div></section>`:''}
            ${githubActivityHtml(d,'#fff','#e0f2fe','#0284c7','#64748b')}
            ${leetcodeHtml(d,'#fff','#e0f2fe','#0284c7','#64748b')}
            ${d.education.length?`<section id="education" style="margin-bottom:40px"><p style="font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:3px;color:#0284c7;margin-bottom:8px">Education</p>${d.education.map((e:{degree:string,institution:string,period:string})=>`<div class="ocean-card reveal"><div style="font-weight:800;color:#0c4a6e;font-size:1rem">${e.degree}</div><div style="color:#0284c7;font-size:.88rem">${e.institution}</div><div style="color:#7dd3fc;font-size:.78rem;margin-top:3px">${e.period}</div></div>`).join('')}</section>`:''}
          </main>
        </div>`);

    // ── SUNSET ─ Scroll-snap full-page warm gradient sections ─────────────────
    case "sunset":
      return wrapTheme(
        '<link href="https://fonts.googleapis.com/css2?family=Prata&family=Figtree:wght@400;500;600;700;800&display=swap" rel="stylesheet">',
        '\'Figtree\',sans-serif',
        `<style>
          html,body{scroll-snap-type:y mandatory;overflow-y:scroll;height:100%}
          .ssnap{scroll-snap-align:start;min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:80px 40px;position:relative;overflow:hidden}
          .ss-nav{position:fixed;right:24px;top:50%;transform:translateY(-50%);z-index:100;display:flex;flex-direction:column;gap:10px}
          .ss-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.3);cursor:pointer;transition:all .3s}
          .ss-dot.active,.ss-dot:hover{background:#fff;transform:scale(1.4)}
          .ss-card{background:rgba(255,255,255,.12);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.25);border-radius:16px;padding:22px;margin-bottom:14px;transition:transform .3s}
          .ss-card:hover{transform:translateY(-3px)}
          @media(max-width:768px){html,body{scroll-snap-type:none!important}.ssnap{padding:60px 20px!important;min-height:auto!important}.ss-nav{display:none!important}h1{font-size:2.2rem!important}}
        </style>
        <div style="color:#fff">
        <nav class="ss-nav" id="ss-nav">
          ${(['about','skills','experience','projects','github','contact']).map((id,i)=>`<div class="ss-dot${i===0?' active':''}" id="ssd-${id}" onclick="document.getElementById('ss-${id}')?.scrollIntoView({behavior:'smooth'})" title="${id}"></div>`).join('')}
        </nav>
        <section id="ss-about" class="ssnap" style="background:linear-gradient(160deg,#7c2d12,#c2410c,#db2777,#7c3aed);text-align:center">
          <div style="max-width:700px;margin:0 auto;position:relative;z-index:1">
            <div style="width:120px;height:120px;border-radius:50%;overflow:hidden;margin:0 auto 24px;border:3px solid rgba(255,255,255,.5);box-shadow:0 0 40px rgba(251,146,60,.3)"><img src="${d.avatar}" style="width:100%;height:100%;object-fit:cover"></div>
            <h1 style="font-family:'Prata',serif;font-size:clamp(2rem,6vw,3.8rem);font-weight:400;margin-bottom:12px;line-height:1.1">${d.name}</h1>
            <p style="color:rgba(255,255,255,.8);font-size:1.1rem;margin-bottom:16px">${d.title} · ${d.location}</p>
            <p style="color:rgba(255,255,255,.6);max-width:500px;margin:0 auto;line-height:1.8;font-size:.95rem">${d.bio}</p>
          </div>
          <div style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,.4);font-size:.7rem;letter-spacing:2px;animation:float 2s ease-in-out infinite">↓ scroll</div>
        </section>
        ${d.skills.length?`<section id="ss-skills" class="ssnap" style="background:linear-gradient(160deg,#431407,#9a3412,#c2410c)"><div style="max-width:900px;margin:0 auto;width:100%"><h2 style="font-family:'Prata',serif;font-size:clamp(1.8rem,4vw,3rem);font-weight:400;margin-bottom:36px">Skills &amp; Expertise</h2><div style="display:flex;flex-wrap:wrap;gap:10px">${d.skills.map((s:string)=>`<span class="skill-tag" style="background:rgba(255,255,255,.12);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.25);color:#fff;padding:10px 22px;border-radius:50px;font-size:.88rem;font-weight:600">${s}</span>`).join('')}</div></div></section>`:''}
        ${d.experience.length?`<section id="ss-experience" class="ssnap" style="background:linear-gradient(160deg,#4a044e,#7e22ce,#db2777)"><div style="max-width:900px;margin:0 auto;width:100%"><h2 style="font-family:'Prata',serif;font-size:clamp(1.8rem,4vw,3rem);font-weight:400;margin-bottom:36px">Experience</h2><div style="display:flex;flex-direction:column;gap:12px">${d.experience.map((e:{role:string,company:string,period:string,description:string})=>`<div class="ss-card tilt-card"><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;margin-bottom:6px"><div><div style="font-weight:800;font-size:1rem">${e.role}</div><div style="color:rgba(255,255,255,.7);font-size:.85rem">${e.company}</div></div><span style="font-size:.72rem;color:rgba(255,255,255,.5)">${e.period}</span></div><p style="color:rgba(255,255,255,.65);font-size:.85rem;line-height:1.7">${e.description}</p></div>`).join('')}</div></div></section>`:''}
        ${d.projects.length?`<section id="ss-projects" class="ssnap" style="background:linear-gradient(160deg,#0f172a,#1e1b4b,#7e22ce)"><div style="max-width:900px;margin:0 auto;width:100%"><h2 style="font-family:'Prata',serif;font-size:clamp(1.8rem,4vw,3rem);font-weight:400;margin-bottom:36px">Projects</h2><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px">${d.projects.map((p:{name:string,description:string,tech:string[],stars:number,link:string})=>`<div class="ss-card tilt-card"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-weight:800;font-size:.95rem">${p.link?`<a href="${p.link}" target="_blank" style="color:#fff;text-decoration:none">${p.name}</a>`:p.name}</span>${p.stars?`<span style="color:#fbbf24;font-size:.8rem">★ ${p.stars}</span>`:''}</div><p style="color:rgba(255,255,255,.55);font-size:.83rem;line-height:1.65;margin-bottom:10px">${p.description}</p><div style="display:flex;flex-wrap:wrap;gap:5px">${p.tech.map((t:string)=>`<span style="font-size:.7rem;color:rgba(255,255,255,.7);background:rgba(255,255,255,.1);padding:3px 9px;border-radius:50px">${t}</span>`).join('')}</div></div>`).join('')}</div></div></section>`:''}
        <section id="ss-github" class="ssnap" style="background:linear-gradient(160deg,#0f172a,#0c4a6e);padding:60px 40px;overflow-y:auto"><div style="max-width:900px;margin:0 auto;width:100%">${githubActivityHtml(d,'rgba(255,255,255,.06)','rgba(255,255,255,.15)','#38bdf8','rgba(255,255,255,.5)')}</div></section>
        <section id="ss-contact" class="ssnap" style="background:linear-gradient(160deg,#431407,#9a3412,#f97316);text-align:center">
          <h2 style="font-family:'Prata',serif;font-size:clamp(2rem,5vw,3.5rem);font-weight:400;margin-bottom:20px">Let's work together</h2>
          <p style="color:rgba(255,255,255,.7);margin-bottom:32px;font-size:1rem">${d.location}</p>
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
            <a href="${gmailLink(d.email)}" style="background:#fff;color:#c2410c;padding:14px 36px;border-radius:50px;text-decoration:none;font-weight:800;font-size:.95rem">${d.email}</a>
            ${d.github?`<a href="${d.github}" target="_blank" style="background:rgba(255,255,255,.15);color:#fff;border:2px solid rgba(255,255,255,.4);padding:12px 36px;border-radius:50px;text-decoration:none;font-weight:700;font-size:.95rem">GitHub ↗</a>`:''}
          </div>
          ${d.education.length?`<div style="margin-top:48px">${d.education.map((e:{degree:string,institution:string,period:string})=>`<p style="color:rgba(255,255,255,.6);font-size:.85rem"><strong style="color:#fff">${e.degree}</strong> · ${e.institution} · ${e.period}</p>`).join('')}</div>`:''}
        </section>
        </div>
        <script>
        var ssDots=document.querySelectorAll('.ss-dot');
        var ssSecs=document.querySelectorAll('.ssnap');
        window.addEventListener('scroll',function(){var cur='';ssSecs.forEach(function(s){if(window.scrollY>=s.offsetTop-window.innerHeight/2)cur=s.id.replace('ss-','');});ssDots.forEach(function(d){var a=d.id==='ssd-'+cur;d.style.background=a?'#fff':'rgba(255,255,255,.3)';d.style.transform=a?'scale(1.4)':'scale(1)';});},{passive:true});
        </script>`);

    // ── FOREST ─ Dark organic, left timeline, sliding cards ──────────────────
    case "forest":
      return wrapTheme(
        '<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Source+Sans+3:wght@300;400;500;600&display=swap" rel="stylesheet">',
        '\'Source Sans 3\',sans-serif',
        `<style>
          .f-nav{position:sticky;top:0;z-index:100;background:rgba(10,31,13,.92);backdrop-filter:blur(12px);padding:12px 32px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(52,211,153,.1)}
          .f-nav a{color:rgba(255,255,255,.45);text-decoration:none;font-size:.78rem;letter-spacing:1px;transition:color .2s;padding:6px 10px;border-radius:6px}
          .f-nav a:hover{color:#34d399;background:rgba(52,211,153,.08)}
          .f-tl-line{position:absolute;left:0;top:0;bottom:0;width:1px;background:linear-gradient(180deg,transparent,rgba(52,211,153,.3),transparent)}
          .f-tl-dot{position:absolute;left:-5px;top:8px;width:10px;height:10px;border-radius:50%;background:#34d399;box-shadow:0 0 8px rgba(52,211,153,.4)}
          .f-card{background:rgba(52,211,153,.05);border:1px solid rgba(52,211,153,.15);border-radius:14px;padding:22px;margin-bottom:14px;transition:all .3s}
          .f-card:hover{background:rgba(52,211,153,.08);border-color:rgba(52,211,153,.3);transform:translateX(6px)}
          .f-proj-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px}
          @media(max-width:768px){.f-nav nav{display:none}.f-proj-grid{grid-template-columns:1fr!important}h1{font-size:2rem!important}.forest-hero-grid{grid-template-columns:1fr!important}}
        </style>
        <div style="background:#0a1f0d;color:#d1fae5;min-height:100vh">
        <header class="f-nav">
          <span style="font-family:'Lora',serif;font-weight:700;color:#34d399;font-size:.95rem">${d.name.split(' ')[0]}</span>
          <nav style="display:flex;gap:4px">${(['About','Skills','Experience','Projects','Contact']).map(s=>`<a href="#${s.toLowerCase()}" onclick="event.preventDefault();document.getElementById('${s.toLowerCase()}')?.scrollIntoView({behavior:'smooth'})">${s}</a>`).join('')}</nav>
        </header>
        <section id="about" class="forest-hero-grid" style="display:grid;grid-template-columns:1fr 380px;gap:0;min-height:90vh;align-items:stretch">
          <div style="padding:80px 48px;display:flex;flex-direction:column;justify-content:center;border-right:1px solid rgba(52,211,153,.1);position:relative;overflow:hidden">
            <div style="position:absolute;inset:0;opacity:.04;background-image:radial-gradient(circle at 2px 2px,#34d399 1px,transparent 0);background-size:28px 28px"></div>
            <p style="font-size:.68rem;text-transform:uppercase;letter-spacing:4px;color:rgba(52,211,153,.5);margin-bottom:16px;position:relative">Portfolio</p>
            <h1 style="font-family:'Lora',serif;font-size:clamp(2.2rem,5vw,4rem);font-weight:700;color:#f0fdf4;line-height:1.1;margin-bottom:20px;position:relative">${d.name}</h1>
            <p style="color:#34d399;font-size:1rem;letter-spacing:1px;margin-bottom:16px;position:relative">${d.title}</p>
            <p style="color:#4ade80;font-size:.9rem;line-height:1.85;max-width:460px;position:relative;font-style:italic;opacity:.7">"${d.bio}"</p>
            <div style="display:flex;gap:10px;margin-top:28px;flex-wrap:wrap;position:relative">
              ${d.github?`<a href="${d.github}" target="_blank" style="background:#34d399;color:#0a1f0d;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:.85rem">GitHub</a>`:''}
              ${d.email?`<a href="${gmailLink(d.email)}" style="border:1px solid rgba(52,211,153,.3);color:#34d399;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:.85rem">Contact</a>`:''}
            </div>
          </div>
          <div style="background:linear-gradient(160deg,#064e3b,#065f46);display:flex;align-items:center;justify-content:center;padding:40px">
            <div>
              <div style="width:180px;height:180px;border-radius:50%;overflow:hidden;border:3px solid rgba(52,211,153,.4);box-shadow:0 0 40px rgba(52,211,153,.15);margin:0 auto 24px"><img src="${d.avatar}" style="width:100%;height:100%;object-fit:cover"></div>
              <div style="background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.2);border-radius:12px;padding:16px;text-align:center"><p style="font-size:.65rem;text-transform:uppercase;letter-spacing:2px;color:rgba(52,211,153,.5);margin-bottom:8px">Location</p><p style="color:#d1fae5;font-size:.88rem">${d.location}</p></div>
            </div>
          </div>
        </section>
        <div style="max-width:960px;margin:0 auto;padding:60px 40px">
          ${d.skills.length?`<section id="skills" style="margin-bottom:64px"><h2 class="reveal" style="font-family:'Lora',serif;color:#34d399;font-size:1.6rem;margin-bottom:28px">Skills 🌿</h2><div class="reveal" style="display:flex;flex-wrap:wrap;gap:8px">${d.skills.map((s:string)=>`<span class="skill-tag" style="background:rgba(52,211,153,.08);border:1.5px solid rgba(52,211,153,.2);color:#86efac;padding:8px 18px;border-radius:8px;font-size:.85rem;font-weight:500">${s}</span>`).join('')}</div></section>`:''}
          ${d.experience.length?`<section id="experience" style="margin-bottom:64px"><h2 class="reveal" style="font-family:'Lora',serif;color:#34d399;font-size:1.6rem;margin-bottom:32px">Experience</h2><div style="position:relative;padding-left:28px"><div class="f-tl-line"></div>${d.experience.map((e:{role:string,company:string,period:string,description:string})=>`<div class="f-card reveal" style="position:relative"><div class="f-tl-dot" style="left:-33px"></div><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;margin-bottom:6px"><div><div style="font-weight:700;font-size:1rem;color:#f0fdf4">${e.role}</div><div style="color:#34d399;font-size:.85rem;margin-top:1px">${e.company}</div></div><span style="font-size:.72rem;color:rgba(52,211,153,.5)">${e.period}</span></div><p style="color:#6ee7b7;font-size:.88rem;line-height:1.75">${e.description}</p></div>`).join('')}</div></section>`:''}
          ${d.projects.length?`<section id="projects" style="margin-bottom:64px"><h2 class="reveal" style="font-family:'Lora',serif;color:#34d399;font-size:1.6rem;margin-bottom:28px">Projects</h2><div class="f-proj-grid">${d.projects.map((p:{name:string,description:string,tech:string[],stars:number,link:string})=>`<div class="f-card tilt-card reveal"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-weight:700;color:#f0fdf4">${p.link?`<a href="${p.link}" target="_blank" style="color:#f0fdf4;text-decoration:none">${p.name}</a>`:p.name}</span>${p.stars?`<span style="color:#fbbf24;font-size:.8rem">★ ${p.stars}</span>`:''}</div><p style="color:#6ee7b7;font-size:.85rem;line-height:1.65;margin-bottom:12px">${p.description}</p><div style="display:flex;flex-wrap:wrap;gap:5px">${p.tech.map((t:string)=>`<span style="font-size:.72rem;color:#34d399;background:rgba(52,211,153,.08);padding:3px 10px;border-radius:6px">${t}</span>`).join('')}</div></div>`).join('')}</div></section>`:''}
          ${githubActivityHtml(d,'rgba(52,211,153,.05)','rgba(52,211,153,.15)','#34d399','#6ee7b7')}
          ${d.education.length?`<section id="education" style="margin-bottom:48px"><h2 class="reveal" style="font-family:'Lora',serif;color:#34d399;font-size:1.6rem;margin-bottom:20px">Education</h2>${d.education.map((e:{degree:string,institution:string,period:string})=>`<div class="f-card reveal"><div style="font-weight:700;color:#f0fdf4">${e.degree}</div><div style="color:#34d399;font-size:.88rem">${e.institution}</div><div style="color:rgba(52,211,153,.4);font-size:.78rem;margin-top:2px">${e.period}</div></div>`).join('')}</section>`:''}
          <section id="contact" class="reveal" style="text-align:center;padding:40px 0;border-top:1px solid rgba(52,211,153,.1)"><h2 style="font-family:'Lora',serif;color:#34d399;font-size:1.6rem;margin-bottom:16px">Get in Touch</h2><a href="${gmailLink(d.email)}" style="color:#34d399;font-size:1rem;text-decoration:none;border-bottom:1px solid rgba(52,211,153,.3)">${d.email}</a><p style="color:#6ee7b7;font-size:.88rem;margin-top:8px">${d.location}</p></section>
        </div></div>`);

    // ── CHERRY ─ Asymmetric two-col, petal canvas, dark crimson ──────────────
    case "cherry":
      return wrapTheme(
        '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">',
        '\'Lato\',sans-serif',
        `<style>
          .ch-nav{position:sticky;top:0;z-index:100;background:rgba(18,0,8,.9);backdrop-filter:blur(16px);padding:12px 32px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(244,63,94,.1)}
          .ch-nav a{color:rgba(255,255,255,.4);text-decoration:none;font-size:.78rem;transition:color .2s;padding:6px 10px}
          .ch-nav a:hover{color:#f43f5e}
          .ch-left{padding:60px 40px;position:sticky;top:60px;max-height:calc(100vh - 60px);overflow-y:auto}
          .ch-right{padding:60px 40px;border-left:1px solid rgba(244,63,94,.1)}
          .ch-card{background:rgba(244,63,94,.05);border:1px solid rgba(244,63,94,.14);border-radius:14px;padding:20px;margin-bottom:14px;transition:all .3s}
          .ch-card:hover{background:rgba(244,63,94,.09);border-color:rgba(244,63,94,.28)}
          .ch-tag{font-size:.72rem;color:#f43f5e;background:rgba(244,63,94,.1);padding:3px 10px;border-radius:6px;display:inline-block}
          @media(max-width:768px){.ch-split{flex-direction:column!important}.ch-left{position:relative!important;top:auto!important;max-height:none!important;padding:28px 20px!important}.ch-right{padding:28px 20px!important;border-left:none!important;border-top:1px solid rgba(244,63,94,.1)}}
        </style>
        <div style="background:#120008;color:#fecdd3;min-height:100vh;position:relative">
        ${petalCanvas('rgba(255,160,178,')}
        <div style="position:relative;z-index:1">
        <header class="ch-nav">
          <span style="font-family:'Playfair Display',serif;color:#f43f5e;font-weight:700">${d.name.split(' ')[0]}</span>
          <nav style="display:flex;gap:4px">${(['About','Skills','Work','Projects','Contact']).map(s=>`<a href="#ch-${s.toLowerCase()}" onclick="event.preventDefault();document.getElementById('ch-${s==='Work'?'experience':s.toLowerCase()}')?.scrollIntoView({behavior:'smooth'})">${s}</a>`).join('')}</nav>
        </header>
        <div class="ch-split" style="display:flex;max-width:1100px;margin:0 auto">
          <div class="ch-left" style="width:360px;flex-shrink:0">
            <div style="text-align:center;margin-bottom:32px">
              <div style="width:140px;height:140px;border-radius:50%;overflow:hidden;margin:0 auto 20px;border:3px solid rgba(244,63,94,.4);box-shadow:0 0 30px rgba(244,63,94,.2)"><img src="${d.avatar}" style="width:100%;height:100%;object-fit:cover"></div>
              <h1 style="font-family:'Playfair Display',serif;font-size:1.7rem;font-weight:700;color:#fff;margin-bottom:6px;line-height:1.2" id="ch-about">${d.name}</h1>
              <p style="color:#f43f5e;font-size:.85rem;letter-spacing:1.5px;text-transform:uppercase">${d.title}</p>
            </div>
            <p style="color:#9f7580;font-size:.88rem;line-height:1.8;margin-bottom:28px;font-style:italic;border-left:2px solid rgba(244,63,94,.3);padding-left:16px">${d.bio}</p>
            ${d.skills.length?`<div id="ch-skills"><p style="font-size:.65rem;text-transform:uppercase;letter-spacing:3px;color:rgba(244,63,94,.5);margin-bottom:12px">Skills 🌸</p><div style="display:flex;flex-wrap:wrap;gap:6px">${d.skills.map((s:string)=>`<span class="ch-tag skill-tag">${s}</span>`).join('')}</div></div>`:''}
            <div style="margin-top:28px;padding-top:20px;border-top:1px solid rgba(244,63,94,.1)">
              <p style="font-size:.65rem;text-transform:uppercase;letter-spacing:2px;color:rgba(244,63,94,.4);margin-bottom:10px">Contact</p>
              <a href="${gmailLink(d.email)}" style="color:#f43f5e;font-size:.85rem;display:block;margin-bottom:4px;text-decoration:none">${d.email}</a>
              <p style="color:#9f7580;font-size:.82rem">${d.location}</p>
              <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
                ${d.github?`<a href="${d.github}" target="_blank" style="color:#fda4af;background:rgba(244,63,94,.12);text-decoration:none;padding:5px 14px;border-radius:50px;font-size:.75rem;border:1px solid rgba(244,63,94,.2)">GitHub</a>`:''}
                ${d.linkedin?`<a href="${d.linkedin}" target="_blank" style="color:#fda4af;background:rgba(244,63,94,.12);text-decoration:none;padding:5px 14px;border-radius:50px;font-size:.75rem;border:1px solid rgba(244,63,94,.2)">LinkedIn</a>`:''}
              </div>
            </div>
          </div>
          <div class="ch-right" style="flex:1">
            ${d.experience.length?`<section id="ch-experience" style="margin-bottom:52px"><h2 class="reveal" style="font-family:'Playfair Display',serif;color:#f43f5e;font-size:1.5rem;margin-bottom:24px;font-style:italic">Experience</h2>${d.experience.map((e:{role:string,company:string,period:string,description:string})=>`<div class="ch-card tilt-card reveal"><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;margin-bottom:8px"><div><div style="font-weight:700;color:#fff">${e.role}</div><div style="color:#f43f5e;font-size:.85rem">${e.company}</div></div><span style="font-size:.72rem;color:rgba(244,63,94,.5)">${e.period}</span></div><p style="color:#9f7580;font-size:.87rem;line-height:1.75">${e.description}</p></div>`).join('')}</section>`:''}
            ${d.projects.length?`<section id="ch-projects" style="margin-bottom:52px"><h2 class="reveal" style="font-family:'Playfair Display',serif;color:#f43f5e;font-size:1.5rem;margin-bottom:24px;font-style:italic">Projects</h2>${d.projects.map((p:{name:string,description:string,tech:string[],stars:number,link:string})=>`<div class="ch-card tilt-card reveal"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-weight:700;color:#fecdd3">${p.link?`<a href="${p.link}" target="_blank" style="color:#fecdd3;text-decoration:none">${p.name}</a>`:p.name}</span>${p.stars?`<span style="color:#fbbf24;font-size:.8rem">★ ${p.stars}</span>`:''}</div><p style="color:#9f7580;font-size:.85rem;line-height:1.65;margin-bottom:10px">${p.description}</p><div style="display:flex;flex-wrap:wrap;gap:5px">${p.tech.map((t:string)=>`<span class="ch-tag" style="font-size:.7rem">${t}</span>`).join('')}</div></div>`).join('')}</section>`:''}
            ${githubActivityHtml(d,'rgba(244,63,94,.05)','rgba(244,63,94,.15)','#f43f5e','#9f7580')}
            ${leetcodeHtml(d,'rgba(244,63,94,.05)','rgba(244,63,94,.15)','#f43f5e','#9f7580')}
            ${d.education.length?`<section id="ch-education" style="margin-bottom:40px"><h2 class="reveal" style="font-family:'Playfair Display',serif;color:#f43f5e;font-size:1.5rem;margin-bottom:20px;font-style:italic">Education</h2>${d.education.map((e:{degree:string,institution:string,period:string})=>`<div class="ch-card reveal"><div style="font-weight:700;color:#fecdd3">${e.degree}</div><div style="color:#f43f5e;font-size:.88rem">${e.institution}</div><div style="color:rgba(244,63,94,.4);font-size:.78rem">${e.period}</div></div>`).join('')}</section>`:''}
          </div>
        </div>
        </div></div>`);

    // ── LAVENDER ─ Bento glass grid layout ───────────────────────────────────
    case "lavender":
      return wrapTheme(
        '<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet">',
        '\'Quicksand\',sans-serif',
        `<style>
          .lv-nav{position:sticky;top:0;z-index:100;background:rgba(237,233,254,.85);backdrop-filter:blur(20px);padding:12px 28px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(124,58,237,.1)}
          .lv-nav a{color:#5b21b6;text-decoration:none;font-size:.8rem;font-weight:600;padding:6px 12px;border-radius:8px;transition:all .2s}
          .lv-nav a:hover{background:rgba(124,58,237,.1)}
          .lv-glass{background:rgba(255,255,255,.55);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1.5px solid rgba(255,255,255,.8);border-radius:20px;box-shadow:0 8px 32px rgba(124,58,237,.06)}
          .lv-bento{display:grid;grid-template-columns:repeat(12,1fr);gap:14px;max-width:1040px;margin:0 auto;padding:32px 24px}
          @keyframes lv-float1{0%,100%{transform:translate(0,0)}50%{transform:translate(15px,-12px)}}
          @keyframes lv-float2{0%,100%{transform:translate(0,0)}50%{transform:translate(-10px,15px)}}
          .lv-orb1{animation:lv-float1 9s ease-in-out infinite}
          .lv-orb2{animation:lv-float2 12s ease-in-out infinite}
          @media(max-width:768px){.lv-bento{grid-template-columns:1fr!important;padding:16px!important}.lv-bento>div{grid-column:1/-1!important}}
        </style>
        <div style="background:linear-gradient(140deg,#ede9fe 0%,#ddd6fe 35%,#c4b5fd 65%,#a78bfa 100%);min-height:100vh;color:#2e1065;position:relative;overflow-x:hidden">
        <div class="lv-orb1" style="position:fixed;top:5%;left:5%;width:350px;height:350px;border-radius:50%;background:radial-gradient(circle,rgba(167,139,250,.2),transparent 70%);pointer-events:none;z-index:0"></div>
        <div class="lv-orb2" style="position:fixed;bottom:10%;right:5%;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,rgba(196,181,253,.25),transparent 70%);pointer-events:none;z-index:0"></div>
        <header class="lv-nav" style="position:relative;z-index:10">
          <span style="font-weight:800;color:#5b21b6;font-size:.95rem">${d.name.split(' ')[0]}</span>
          <nav style="display:flex;gap:2px">${(['About','Skills','Experience','Projects','Contact']).map(s=>`<a href="#lv-${s.toLowerCase()}">${s}</a>`).join('')}</nav>
        </header>
        <div class="lv-bento" style="position:relative;z-index:1;padding-top:20px">
          <div class="lv-glass reveal" id="lv-about" style="grid-column:span 8;padding:36px;display:flex;gap:28px;align-items:center;flex-wrap:wrap">
            <div style="width:100px;height:100px;border-radius:50%;overflow:hidden;flex-shrink:0;border:3px solid rgba(255,255,255,.7);box-shadow:0 12px 32px rgba(124,58,237,.15)"><img src="${d.avatar}" style="width:100%;height:100%;object-fit:cover"></div>
            <div style="flex:1"><h1 style="font-size:1.8rem;font-weight:800;color:#2e1065;margin-bottom:4px">${d.name}</h1><p style="color:#6d28d9;font-weight:700;margin-bottom:8px">${d.title}</p><p style="color:#4c1d95;font-size:.88rem;line-height:1.75">${d.bio}</p></div>
          </div>
          <div class="lv-glass reveal" style="grid-column:span 4;padding:28px;display:flex;flex-direction:column;gap:12px">
            <p style="font-size:.65rem;text-transform:uppercase;letter-spacing:3px;color:#7c3aed;font-weight:700">Quick Info</p>
            <div style="font-size:.88rem;color:#4c1d95;line-height:2"><p>📍 ${d.location}</p><p>📧 <a href="${gmailLink(d.email)}" style="color:#6d28d9;text-decoration:none">${d.email}</a></p>${d.github?`<p>🐙 <a href="${d.github}" target="_blank" style="color:#6d28d9;text-decoration:none">GitHub</a></p>`:''}</div>
          </div>
          ${d.skills.length?`<div class="lv-glass reveal" id="lv-skills" style="grid-column:span 5;padding:28px"><p style="font-size:.65rem;text-transform:uppercase;letter-spacing:3px;color:#7c3aed;font-weight:700;margin-bottom:14px">Skills ✨</p><div style="display:flex;flex-wrap:wrap;gap:6px">${d.skills.map((s:string)=>`<span class="skill-tag" style="background:rgba(124,58,237,.1);color:#5b21b6;border:1.5px solid rgba(124,58,237,.25);padding:5px 14px;border-radius:50px;font-size:.78rem;font-weight:600">${s}</span>`).join('')}</div></div>`:''}
          <div class="lv-glass reveal" style="grid-column:span ${d.skills.length?'7':'12'};padding:28px">${githubActivityHtml(d,'rgba(255,255,255,.4)','rgba(124,58,237,.2)','#7c3aed','#4c1d95')}</div>
          ${d.experience.length?`<div class="lv-glass reveal" id="lv-experience" style="grid-column:span 12;padding:28px"><p style="font-size:.65rem;text-transform:uppercase;letter-spacing:3px;color:#7c3aed;font-weight:700;margin-bottom:20px">Experience</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px">${d.experience.map((e:{role:string,company:string,period:string,description:string})=>`<div class="tilt-card" style="background:rgba(124,58,237,.06);border:1px solid rgba(124,58,237,.15);border-radius:12px;padding:18px;transition:all .3s" onmouseover="this.style.background='rgba(124,58,237,.12)'" onmouseout="this.style.background='rgba(124,58,237,.06)'"><div style="font-weight:700;color:#2e1065;margin-bottom:2px">${e.role}</div><div style="color:#7c3aed;font-size:.85rem;margin-bottom:4px">${e.company}</div><div style="color:rgba(124,58,237,.4);font-size:.72rem;margin-bottom:8px">${e.period}</div><p style="color:#4c1d95;font-size:.84rem;line-height:1.7">${e.description}</p></div>`).join('')}</div></div>`:''}
          ${d.projects.length?`<div class="lv-glass reveal" id="lv-projects" style="grid-column:span 12;padding:28px"><p style="font-size:.65rem;text-transform:uppercase;letter-spacing:3px;color:#7c3aed;font-weight:700;margin-bottom:20px">Projects</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px">${d.projects.map((p:{name:string,description:string,tech:string[],stars:number,link:string})=>`<div class="tilt-card" style="background:rgba(255,255,255,.4);border:1.5px solid rgba(255,255,255,.7);border-radius:14px;padding:20px"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-weight:700;color:#2e1065">${p.link?`<a href="${p.link}" target="_blank" style="color:#2e1065;text-decoration:none">${p.name}</a>`:p.name}</span>${p.stars?`<span style="color:#f59e0b;font-size:.8rem">★ ${p.stars}</span>`:''}</div><p style="color:#4c1d95;font-size:.84rem;line-height:1.65;margin-bottom:10px">${p.description}</p><div style="display:flex;flex-wrap:wrap;gap:5px">${p.tech.map((t:string)=>`<span style="font-size:.72rem;color:#6d28d9;background:rgba(124,58,237,.1);padding:3px 10px;border-radius:50px;font-weight:600">${t}</span>`).join('')}</div></div>`).join('')}</div></div>`:''}
          <div class="lv-glass reveal" id="lv-contact" style="grid-column:span 12;padding:36px;text-align:center">
            <h2 style="font-size:1.6rem;font-weight:800;color:#2e1065;margin-bottom:12px">Let's connect ✨</h2>
            <p style="color:#4c1d95;margin-bottom:24px"><a href="${gmailLink(d.email)}" style="color:#4c1d95;text-decoration:none;font-weight:600">${d.email}</a> · ${d.location}</p>
            <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
              <a href="${gmailLink(d.email)}" style="background:#7c3aed;color:#fff;text-decoration:none;padding:12px 32px;border-radius:50px;font-weight:700;transition:opacity .2s" onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">Email me</a>
              ${d.github?`<a href="${d.github}" target="_blank" style="background:rgba(124,58,237,.12);color:#5b21b6;border:2px solid rgba(124,58,237,.3);text-decoration:none;padding:10px 32px;border-radius:50px;font-weight:700">GitHub</a>`:''}
              ${d.linkedin?`<a href="${d.linkedin}" target="_blank" style="background:rgba(124,58,237,.12);color:#5b21b6;border:2px solid rgba(124,58,237,.3);text-decoration:none;padding:10px 32px;border-radius:50px;font-weight:700">LinkedIn</a>`:''}
            </div>
            ${d.education.length?`<div style="margin-top:28px;border-top:1px solid rgba(124,58,237,.1);padding-top:20px">${d.education.map((e:{degree:string,institution:string,period:string})=>`<p style="color:#5b21b6;font-size:.88rem"><strong>${e.degree}</strong> · ${e.institution} · <span style="opacity:.6">${e.period}</span></p>`).join('')}</div>`:''}
          </div>
        </div></div>`);

    // ── MIDNIGHT ─ Scroll-snap star journey sections ──────────────────────────
    case "midnight":
      return wrapTheme(
        '<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">',
        '\'Space Grotesk\',sans-serif',
        `<style>
          html,body{scroll-snap-type:y mandatory;overflow-y:scroll;height:100%}
          .mn-snap{scroll-snap-align:start;min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:80px 40px;position:relative;overflow:hidden}
          .mn-nav-dots{position:fixed;left:24px;top:50%;transform:translateY(-50%);z-index:100;display:flex;flex-direction:column;gap:10px;align-items:center}
          .mn-dot{width:7px;height:7px;border-radius:50%;background:rgba(96,165,250,.3);cursor:pointer;transition:all .3s}
          .mn-dot.active,.mn-dot:hover{background:#60a5fa;transform:scale(1.5)}
          .mn-card{background:rgba(96,165,250,.05);border:1px solid rgba(96,165,250,.15);border-radius:14px;padding:22px;margin-bottom:14px;transition:all .3s}
          .mn-card:hover{background:rgba(96,165,250,.09);border-color:rgba(96,165,250,.3)}
          @media(max-width:768px){html,body{scroll-snap-type:none!important}.mn-snap{padding:60px 20px!important;min-height:auto!important}.mn-nav-dots{display:none!important}h1{font-size:2rem!important}}
        </style>
        <div style="background:#020a18;color:#cbd5e1;position:relative">
        ${starfieldCanvas('rgba(200,220,255,','rgba(2,10,24,0.7)')}
        <nav class="mn-nav-dots" id="mn-dots">
          ${(['home','skills','experience','projects','github','contact']).map((id,i)=>`<div class="mn-dot${i===0?' active':''}" id="mnd-${id}" onclick="document.getElementById('mn-${id}')?.scrollIntoView({behavior:'smooth'})" title="${id}"></div>`).join('')}
        </nav>
        <section id="mn-home" class="mn-snap" style="text-align:center;z-index:1">
          <div style="max-width:700px;margin:0 auto;position:relative;z-index:1">
            <p style="font-family:'Space Mono',monospace;font-size:.7rem;letter-spacing:4px;color:rgba(96,165,250,.5);margin-bottom:20px">★ PORTFOLIO · ${new Date().getFullYear()}</p>
            <div style="width:120px;height:120px;border-radius:50%;overflow:hidden;margin:0 auto 24px;border:2px solid rgba(96,165,250,.4);box-shadow:0 0 0 8px rgba(96,165,250,.06),0 0 40px rgba(96,165,250,.15)"><img src="${d.avatar}" style="width:100%;height:100%;object-fit:cover"></div>
            <h1 style="font-family:'Space Mono',monospace;font-size:clamp(1.8rem,4vw,2.8rem);font-weight:700;color:#e2e8f0;margin-bottom:10px;letter-spacing:-1px">${d.name}</h1>
            <p style="color:#60a5fa;font-size:.9rem;letter-spacing:3px;text-transform:uppercase;margin-bottom:14px">${d.title}</p>
            <p style="color:#475569;max-width:460px;margin:0 auto;line-height:1.85;font-size:.92rem">${d.bio}</p>
            <div style="margin-top:28px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
              ${d.github?`<a href="${d.github}" target="_blank" style="border:1px solid rgba(96,165,250,.3);color:#93c5fd;padding:10px 24px;border-radius:8px;text-decoration:none;font-size:.82rem;transition:all .2s" onmouseover="this.style.borderColor='rgba(96,165,250,.7)';this.style.background='rgba(96,165,250,.08)'" onmouseout="this.style.borderColor='rgba(96,165,250,.3)';this.style.background='transparent'">GitHub</a>`:''}
              ${d.email?`<a href="${gmailLink(d.email)}" style="background:rgba(96,165,250,.15);color:#93c5fd;padding:10px 24px;border-radius:8px;text-decoration:none;font-size:.82rem;border:1px solid rgba(96,165,250,.2)">Contact</a>`:''}
            </div>
          </div>
          <div style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);color:rgba(96,165,250,.3);font-size:.65rem;letter-spacing:2px;animation:float 2s ease-in-out infinite">▼ next</div>
        </section>
        ${d.skills.length?`<section id="mn-skills" class="mn-snap" style="z-index:1"><div style="max-width:900px;margin:0 auto;width:100%"><p style="font-family:'Space Mono',monospace;font-size:.65rem;letter-spacing:4px;color:rgba(96,165,250,.4);margin-bottom:8px">// skills</p><h2 style="font-size:clamp(1.8rem,4vw,2.5rem);font-weight:700;color:#e2e8f0;margin-bottom:36px">Tech Stack</h2><div style="display:flex;flex-wrap:wrap;gap:10px">${d.skills.map((s:string)=>`<span class="skill-tag" style="background:rgba(96,165,250,.08);border:1.5px solid rgba(96,165,250,.2);color:#93c5fd;padding:10px 22px;border-radius:8px;font-size:.85rem;font-weight:500">${s}</span>`).join('')}</div></div></section>`:''}
        ${d.experience.length?`<section id="mn-experience" class="mn-snap" style="z-index:1"><div style="max-width:900px;margin:0 auto;width:100%"><p style="font-family:'Space Mono',monospace;font-size:.65rem;letter-spacing:4px;color:rgba(96,165,250,.4);margin-bottom:8px">// experience</p><h2 style="font-size:clamp(1.8rem,4vw,2.5rem);font-weight:700;color:#e2e8f0;margin-bottom:36px">Where I've worked</h2>${d.experience.map((e:{role:string,company:string,period:string,description:string})=>`<div class="mn-card tilt-card"><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;margin-bottom:8px"><div><div style="font-weight:700;color:#e2e8f0">${e.role}</div><div style="color:#60a5fa;font-size:.85rem">${e.company}</div></div><span style="font-family:'Space Mono',monospace;font-size:.7rem;color:#475569">${e.period}</span></div><p style="color:#64748b;font-size:.87rem;line-height:1.75">${e.description}</p></div>`).join('')}</div></section>`:''}
        ${d.projects.length?`<section id="mn-projects" class="mn-snap" style="z-index:1"><div style="max-width:900px;margin:0 auto;width:100%"><p style="font-family:'Space Mono',monospace;font-size:.65rem;letter-spacing:4px;color:rgba(96,165,250,.4);margin-bottom:8px">// projects</p><h2 style="font-size:clamp(1.8rem,4vw,2.5rem);font-weight:700;color:#e2e8f0;margin-bottom:36px">Built Things</h2><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px">${d.projects.map((p:{name:string,description:string,tech:string[],stars:number,link:string})=>`<div class="mn-card tilt-card"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-weight:700;color:#e2e8f0;font-size:.92rem">${p.link?`<a href="${p.link}" target="_blank" style="color:#e2e8f0;text-decoration:none">${p.name}</a>`:p.name}</span>${p.stars?`<span style="color:#fbbf24;font-size:.8rem">★ ${p.stars}</span>`:''}</div><p style="color:#64748b;font-size:.82rem;line-height:1.65;margin-bottom:10px">${p.description}</p><div style="display:flex;flex-wrap:wrap;gap:5px">${p.tech.map((t:string)=>`<span style="font-size:.7rem;color:#93c5fd;background:rgba(96,165,250,.08);padding:3px 10px;border-radius:6px">${t}</span>`).join('')}</div></div>`).join('')}</div></div></section>`:''}
        <section id="mn-github" class="mn-snap" style="z-index:1;overflow-y:auto"><div style="max-width:900px;margin:0 auto;width:100%">${githubActivityHtml(d,'rgba(96,165,250,.05)','rgba(96,165,250,.15)','#60a5fa','#64748b')}${leetcodeHtml(d,'rgba(96,165,250,.05)','rgba(96,165,250,.15)','#60a5fa','#64748b')}</div></section>
        <section id="mn-contact" class="mn-snap" style="text-align:center;z-index:1">
          <div style="max-width:600px;margin:0 auto">
            <p style="font-family:'Space Mono',monospace;font-size:.65rem;letter-spacing:4px;color:rgba(96,165,250,.4);margin-bottom:16px">// contact</p>
            <h2 style="font-size:clamp(2rem,5vw,3rem);font-weight:700;color:#e2e8f0;margin-bottom:24px;letter-spacing:-1px">Let's talk.</h2>
            <a href="${gmailLink(d.email)}" style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#60a5fa);color:#fff;padding:14px 40px;border-radius:50px;text-decoration:none;font-weight:700;font-size:.95rem;transition:transform .2s,box-shadow .2s" onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 12px 30px rgba(96,165,250,.3)'" onmouseout="this.style.transform='none';this.style.boxShadow='none'">${d.email}</a>
            <p style="color:#475569;margin-top:16px;font-size:.88rem">${d.location}</p>
            ${d.education.length?`<div style="margin-top:32px;border-top:1px solid rgba(96,165,250,.1);padding-top:20px">${d.education.map((e:{degree:string,institution:string,period:string})=>`<p style="color:#64748b;font-size:.85rem"><strong style="color:#93c5fd">${e.degree}</strong> · ${e.institution} · ${e.period}</p>`).join('')}</div>`:''}
          </div>
        </section>
        </div>
        <script>
        var mnDots=document.querySelectorAll('.mn-dot');var mnSecs=document.querySelectorAll('.mn-snap');
        window.addEventListener('scroll',function(){var cur='';mnSecs.forEach(function(s){if(window.scrollY>=s.offsetTop-window.innerHeight/2)cur=s.id.replace('mn-','');});mnDots.forEach(function(d){var a=d.id==='mnd-'+cur;d.style.background=a?'#60a5fa':'rgba(96,165,250,.3)';d.style.transform=a?'scale(1.5)':'scale(1)';});},{passive:true});
        </script>`);

    // ── CORAL ─ Bold tropical, horizontal project scroll, large stats ─────────
    case "coral":
      return wrapTheme(
        '<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">',
        '\'Outfit\',sans-serif',
        `<style>
          .co-nav{position:sticky;top:0;z-index:100;background:rgba(255,247,240,.95);backdrop-filter:blur(12px);padding:12px 32px;display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid #ffedd5}
          .co-nav a{color:#7c2d12;text-decoration:none;font-size:.82rem;font-weight:600;padding:6px 12px;border-radius:8px;transition:all .2s}
          .co-nav a:hover{background:#ffedd5;color:#c2410c}
          .co-stat{background:#fff;border:2px solid #ffedd5;border-radius:16px;padding:20px;text-align:center;transition:transform .3s,box-shadow .3s}
          .co-stat:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(234,88,12,.12)}
          .co-card{background:#fff;border-radius:16px;padding:24px;flex-shrink:0;width:280px;border:2px solid #ffedd5;transition:transform .3s}
          .co-card:hover{transform:translateY(-4px)}
          .co-hscroll{display:flex;gap:14px;overflow-x:auto;padding-bottom:12px;scroll-snap-type:x mandatory}
          .co-hscroll>*{scroll-snap-align:start}
          .co-hscroll::-webkit-scrollbar{height:4px}.co-hscroll::-webkit-scrollbar-track{background:#ffedd5;border-radius:2px}.co-hscroll::-webkit-scrollbar-thumb{background:#f97316;border-radius:2px}
          @media(max-width:768px){.co-nav nav{display:none}.co-stat-grid{grid-template-columns:repeat(2,1fr)!important}h1{font-size:2.2rem!important}}
        </style>
        <div style="background:#fff7f0;color:#431407;min-height:100vh">
        <header class="co-nav">
          <span style="font-weight:900;color:#ea580c;font-size:1rem">${d.name.split(' ')[0]}</span>
          <nav style="display:flex;gap:2px">${(['About','Skills','Experience','Projects','Contact']).map(s=>`<a href="#co-${s.toLowerCase()}">${s}</a>`).join('')}</nav>
        </header>
        <section id="co-about" style="background:linear-gradient(135deg,#ef4444,#f97316,#fbbf24);padding:80px 40px;position:relative;overflow:hidden">
          <div style="position:absolute;top:-50px;right:-50px;width:300px;height:300px;border-radius:50%;background:rgba(255,255,255,.1)"></div>
          <div style="max-width:900px;margin:0 auto;display:flex;align-items:center;gap:40px;flex-wrap:wrap;position:relative;z-index:1">
            <div>
              <p style="font-size:.72rem;text-transform:uppercase;letter-spacing:4px;color:rgba(255,255,255,.65);margin-bottom:12px">👋 Hello, I'm</p>
              <h1 style="font-size:clamp(2.5rem,6vw,4.5rem);font-weight:900;color:#fff;line-height:.95;letter-spacing:-2px;margin-bottom:16px">${d.name}</h1>
              <p style="color:rgba(255,255,255,.85);font-size:1.1rem;font-weight:600;margin-bottom:16px">${d.title}</p>
              <p style="color:rgba(255,255,255,.65);max-width:480px;line-height:1.8;font-size:.92rem">${d.bio}</p>
              <div style="display:flex;gap:10px;margin-top:24px;flex-wrap:wrap">
                ${d.github?`<a href="${d.github}" target="_blank" style="background:#fff;color:#c2410c;padding:11px 28px;border-radius:50px;text-decoration:none;font-weight:800;font-size:.88rem">GitHub ↗</a>`:''}
                ${d.email?`<a href="${gmailLink(d.email)}" style="background:rgba(255,255,255,.2);color:#fff;border:2px solid rgba(255,255,255,.4);padding:9px 28px;border-radius:50px;text-decoration:none;font-weight:700;font-size:.88rem">${d.email}</a>`:''}
              </div>
            </div>
            <div style="flex-shrink:0;width:140px;height:140px;border-radius:50%;overflow:hidden;border:4px solid rgba(255,255,255,.6);box-shadow:0 20px 40px rgba(0,0,0,.2);margin-left:auto"><img src="${d.avatar}" style="width:100%;height:100%;object-fit:cover"></div>
          </div>
        </section>
        ${d.githubStats?`<section style="background:#fff;border-bottom:2px solid #ffedd5;padding:24px 40px"><div class="co-stat-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;max-width:900px;margin:0 auto">${[[d.githubStats.totalCommits.toLocaleString(),'Commits','⚡'],[d.githubStats.publicRepos,'Repos','📁'],[d.githubStats.followers.toLocaleString(),'Followers','👥'],[d.githubStats.pullRequests,'PRs','🔀']].map(([v,l,i])=>`<div class="co-stat"><div style="font-size:1.2rem;margin-bottom:4px">${i}</div><div style="font-size:1.4rem;font-weight:900;color:#ea580c">${v}</div><div style="font-size:.65rem;color:#9a3412;text-transform:uppercase;letter-spacing:1px">${l}</div></div>`).join('')}</div></section>`:''}
        <div style="max-width:960px;margin:0 auto;padding:56px 40px">
          ${d.skills.length?`<section id="co-skills" style="margin-bottom:60px"><h2 class="reveal" style="font-size:1.6rem;font-weight:900;color:#431407;margin-bottom:20px">Skills</h2><div class="reveal" style="display:flex;flex-wrap:wrap;gap:8px">${d.skills.map((s:string)=>`<span class="skill-tag" style="background:#ffedd5;color:#9a3412;border:2px solid #fed7aa;padding:8px 18px;border-radius:8px;font-size:.85rem;font-weight:700">${s}</span>`).join('')}</div></section>`:''}
          ${d.experience.length?`<section id="co-experience" style="margin-bottom:60px"><h2 class="reveal" style="font-size:1.6rem;font-weight:900;color:#431407;margin-bottom:24px">Experience</h2>${d.experience.map((e:{role:string,company:string,period:string,description:string})=>`<div class="tilt-card reveal" style="background:#fff;border:2px solid #ffedd5;border-radius:16px;padding:22px;margin-bottom:14px;border-left:4px solid #ea580c"><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;margin-bottom:8px"><div><div style="font-weight:800;font-size:1rem;color:#431407">${e.role}</div><div style="color:#ea580c;font-size:.85rem;font-weight:600">${e.company}</div></div><span style="font-size:.72rem;color:#fed7aa;background:#ffedd5;padding:4px 12px;border-radius:50px;font-weight:600">${e.period}</span></div><p style="color:#7c2d12;font-size:.88rem;line-height:1.75">${e.description}</p></div>`).join('')}</section>`:''}
          ${d.projects.length?`<section id="co-projects" style="margin-bottom:60px"><h2 class="reveal" style="font-size:1.6rem;font-weight:900;color:#431407;margin-bottom:24px">Projects</h2><div class="co-hscroll reveal">${d.projects.map((p:{name:string,description:string,tech:string[],stars:number,link:string})=>`<div class="co-card"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-weight:800;color:#431407;font-size:.95rem">${p.link?`<a href="${p.link}" target="_blank" style="color:#431407;text-decoration:none">${p.name}</a>`:p.name}</span>${p.stars?`<span style="color:#f59e0b;font-size:.8rem;font-weight:700">★ ${p.stars}</span>`:''}</div><p style="color:#7c2d12;font-size:.82rem;line-height:1.65;margin-bottom:12px">${p.description}</p><div style="display:flex;flex-wrap:wrap;gap:5px">${p.tech.map((t:string)=>`<span style="font-size:.72rem;color:#c2410c;background:#ffedd5;padding:3px 10px;border-radius:6px;font-weight:600">${t}</span>`).join('')}</div></div>`).join('')}</div></section>`:''}
          ${githubActivityHtml(d,'#fff','#ffedd5','#ea580c','#7c2d12')}
          ${d.education.length?`<section id="co-education" style="margin-bottom:48px"><h2 class="reveal" style="font-size:1.6rem;font-weight:900;color:#431407;margin-bottom:20px">Education</h2>${d.education.map((e:{degree:string,institution:string,period:string})=>`<div class="tilt-card reveal" style="background:#fff;border:2px solid #ffedd5;border-radius:14px;padding:20px;margin-bottom:12px"><div style="font-weight:800;color:#431407">${e.degree}</div><div style="color:#ea580c;font-size:.88rem">${e.institution}</div><div style="color:#fed7aa;font-size:.78rem;margin-top:2px">${e.period}</div></div>`).join('')}</section>`:''}
          <section id="co-contact" class="reveal" style="text-align:center;padding:48px;background:linear-gradient(135deg,#ef4444,#f97316);border-radius:24px;margin-bottom:24px"><h2 style="font-size:2rem;font-weight:900;color:#fff;margin-bottom:12px">Ready to work together?</h2><a href="${gmailLink(d.email)}" style="display:inline-block;background:#fff;color:#c2410c;padding:14px 40px;border-radius:50px;text-decoration:none;font-weight:900;font-size:.95rem;transition:transform .2s" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='none'">${d.email}</a></section>
        </div></div>`);

    // ── ARCTIC ─ Ice-clean frosted glass, crystal geometric accents ───────────
    case "arctic":
      return wrapTheme(
        '<link href="https://fonts.googleapis.com/css2?family=Cabin:wght@400;500;600;700&display=swap" rel="stylesheet">',
        '\'Cabin\',sans-serif',
        `<style>
          .ar-nav{position:sticky;top:0;z-index:100;background:rgba(236,254,255,.88);backdrop-filter:blur(20px);padding:12px 32px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(6,182,212,.15)}
          .ar-nav a{color:#0e7490;text-decoration:none;font-size:.8rem;font-weight:600;padding:6px 12px;border-radius:8px;transition:all .2s}
          .ar-nav a:hover{background:rgba(6,182,212,.1)}
          .ar-frost{background:rgba(255,255,255,.6);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.8);border-radius:16px;box-shadow:0 4px 24px rgba(6,182,212,.06)}
          .ar-card{background:rgba(255,255,255,.5);border:1px solid rgba(6,182,212,.2);border-radius:14px;padding:20px;margin-bottom:12px;transition:all .3s;backdrop-filter:blur(8px)}
          .ar-card:hover{background:rgba(255,255,255,.75);box-shadow:0 8px 24px rgba(6,182,212,.12);transform:translateY(-2px)}
          @media(max-width:768px){.ar-nav nav{display:none}.ar-hero-grid{flex-direction:column!important}h1{font-size:2rem!important}}
        </style>
        <div style="background:linear-gradient(140deg,#ecfeff 0%,#cffafe 40%,#a5f3fc 70%,#67e8f9 100%);min-height:100vh;color:#0c4a6e;position:relative;overflow:hidden">
        <div style="position:absolute;top:5%;right:5%;font-size:8rem;opacity:.06;pointer-events:none">❄</div>
        <div style="position:absolute;top:40%;left:2%;font-size:5rem;opacity:.05;pointer-events:none">❄</div>
        <div style="position:absolute;bottom:20%;right:3%;font-size:6rem;opacity:.05;pointer-events:none">❄</div>
        <header class="ar-nav">
          <span style="font-weight:800;color:#0891b2;font-size:.95rem">❄ ${d.name.split(' ')[0]}</span>
          <nav style="display:flex;gap:2px">${(['About','Skills','Experience','Projects','Contact']).map(s=>`<a href="#ar-${s.toLowerCase()}">${s}</a>`).join('')}</nav>
        </header>
        <section id="ar-about" style="padding:80px 40px;max-width:1000px;margin:0 auto;position:relative">
          <div class="ar-hero-grid" style="display:flex;gap:40px;align-items:center;flex-wrap:wrap">
            <div class="ar-frost" style="flex-shrink:0;width:140px;height:140px;border-radius:50%;overflow:hidden;box-shadow:0 0 0 8px rgba(6,182,212,.1)"><img src="${d.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%"></div>
            <div style="flex:1">
              <p style="font-size:.68rem;text-transform:uppercase;letter-spacing:4px;color:#0891b2;margin-bottom:12px">Arctic Portfolio ❄️</p>
              <h1 style="font-size:clamp(2rem,5vw,3.5rem);font-weight:700;color:#0c4a6e;letter-spacing:-1.5px;line-height:1.1;margin-bottom:12px">${d.name}</h1>
              <p style="color:#0891b2;font-size:1rem;font-weight:600;margin-bottom:12px">${d.title}</p>
              <p style="color:#155e75;font-size:.9rem;line-height:1.8;max-width:460px">${d.bio}</p>
              <div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap">
                ${d.github?`<a href="${d.github}" target="_blank" style="background:#0891b2;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:.85rem">GitHub</a>`:''}
                ${d.email?`<a href="${gmailLink(d.email)}" style="border:2px solid #0891b2;color:#0891b2;padding:8px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:.85rem">${d.email}</a>`:''}
              </div>
            </div>
          </div>
        </section>
        <div style="max-width:960px;margin:0 auto;padding:0 40px 60px">
          ${d.skills.length?`<section id="ar-skills" style="margin-bottom:56px"><h2 class="reveal" style="font-size:1.4rem;font-weight:700;color:#0c4a6e;margin-bottom:20px">Skills ❄️</h2><div class="ar-frost reveal" style="padding:24px;display:flex;flex-wrap:wrap;gap:8px">${d.skills.map((s:string)=>`<span class="skill-tag" style="background:rgba(6,182,212,.12);color:#0369a1;border:1.5px solid rgba(6,182,212,.3);padding:8px 18px;border-radius:8px;font-size:.83rem;font-weight:600">${s}</span>`).join('')}</div></section>`:''}
          ${d.experience.length?`<section id="ar-experience" style="margin-bottom:56px"><h2 class="reveal" style="font-size:1.4rem;font-weight:700;color:#0c4a6e;margin-bottom:20px">Experience</h2>${d.experience.map((e:{role:string,company:string,period:string,description:string})=>`<div class="ar-card tilt-card reveal"><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;margin-bottom:8px"><div><div style="font-weight:700;color:#0c4a6e">${e.role}</div><div style="color:#0891b2;font-size:.85rem;font-weight:600">${e.company}</div></div><span style="font-size:.72rem;color:#7dd3fc;background:rgba(6,182,212,.1);padding:4px 12px;border-radius:50px">${e.period}</span></div><p style="color:#155e75;font-size:.87rem;line-height:1.75">${e.description}</p></div>`).join('')}</section>`:''}
          ${d.projects.length?`<section id="ar-projects" style="margin-bottom:56px"><h2 class="reveal" style="font-size:1.4rem;font-weight:700;color:#0c4a6e;margin-bottom:20px">Projects</h2><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px">${d.projects.map((p:{name:string,description:string,tech:string[],stars:number,link:string})=>`<div class="ar-frost tilt-card reveal"><div style="display:flex;justify-content:space-between;margin-bottom:8px;padding:18px 18px 0"><span style="font-weight:700;color:#0c4a6e">${p.link?`<a href="${p.link}" target="_blank" style="color:#0c4a6e;text-decoration:none">${p.name}</a>`:p.name}</span>${p.stars?`<span style="color:#f59e0b;font-size:.8rem">★ ${p.stars}</span>`:''}</div><p style="color:#155e75;font-size:.83rem;line-height:1.65;margin-bottom:12px;padding:0 18px">${p.description}</p><div style="display:flex;flex-wrap:wrap;gap:5px;padding:0 18px 18px">${p.tech.map((t:string)=>`<span style="font-size:.72rem;color:#0891b2;background:rgba(6,182,212,.1);padding:3px 10px;border-radius:6px;font-weight:600">${t}</span>`).join('')}</div></div>`).join('')}</div></section>`:''}
          ${githubActivityHtml(d,'rgba(255,255,255,.55)','rgba(6,182,212,.2)','#0891b2','#155e75')}
          ${d.education.length?`<section id="ar-education" style="margin-bottom:40px"><h2 class="reveal" style="font-size:1.4rem;font-weight:700;color:#0c4a6e;margin-bottom:16px">Education</h2>${d.education.map((e:{degree:string,institution:string,period:string})=>`<div class="ar-card reveal"><div style="font-weight:700;color:#0c4a6e">${e.degree}</div><div style="color:#0891b2;font-size:.88rem">${e.institution}</div><div style="color:#7dd3fc;font-size:.78rem;margin-top:2px">${e.period}</div></div>`).join('')}</section>`:''}
          <section id="ar-contact" class="ar-frost reveal" style="text-align:center;padding:40px;margin-bottom:24px"><h2 style="font-size:1.5rem;font-weight:700;color:#0c4a6e;margin-bottom:12px">Let's Connect ❄️</h2><a href="${gmailLink(d.email)}" style="display:inline-block;background:#0891b2;color:#fff;padding:12px 32px;border-radius:50px;text-decoration:none;font-weight:700;font-size:.9rem;transition:transform .2s" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">${d.email}</a><p style="color:#155e75;font-size:.85rem;margin-top:10px">${d.location}</p></section>
        </div></div>`);

    // ── MOCHA ─ Two-column cozy, fixed stats sidebar, warm coffee ────────────
    case "mocha":
      return wrapTheme(
        '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Source+Serif+4:wght@300;400;500&display=swap" rel="stylesheet">',
        '\'Source Serif 4\',serif',
        `<style>
          .mo-nav{position:sticky;top:0;z-index:100;background:rgba(21,16,12,.92);backdrop-filter:blur(12px);padding:12px 32px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(212,165,116,.1)}
          .mo-nav a{color:rgba(212,165,116,.55);text-decoration:none;font-size:.78rem;padding:6px 12px;border-radius:6px;transition:all .2s}
          .mo-nav a:hover{color:#d4a574;background:rgba(212,165,116,.08)}
          .mo-split{display:grid;grid-template-columns:280px 1fr;min-height:calc(100vh - 52px)}
          .mo-sidebar{background:#1c1410;border-right:1px solid rgba(212,165,116,.1);padding:36px 24px;position:sticky;top:52px;height:calc(100vh - 52px);overflow-y:auto}
          .mo-main{padding:48px 48px;background:#15100c;overflow-y:auto}
          .mo-stat{background:rgba(212,165,116,.06);border:1px solid rgba(212,165,116,.12);border-radius:10px;padding:14px;text-align:center;margin-bottom:10px}
          .mo-card{background:rgba(212,165,116,.05);border:1px solid rgba(212,165,116,.12);border-radius:12px;padding:20px;margin-bottom:14px;transition:all .3s}
          .mo-card:hover{border-color:rgba(212,165,116,.3);background:rgba(212,165,116,.09)}
          @media(max-width:768px){.mo-split{grid-template-columns:1fr!important}.mo-sidebar{position:relative!important;height:auto!important;top:0!important;padding:24px!important;border-right:none!important;border-bottom:1px solid rgba(212,165,116,.1)}.mo-main{padding:24px!important}}
        </style>
        <div style="background:#15100c;color:#e5d3c0;min-height:100vh">
        <header class="mo-nav">
          <span style="font-family:'Playfair Display',serif;font-style:italic;color:#d4a574">☕ ${d.name.split(' ')[0]}</span>
          <nav style="display:flex;gap:2px">${(['About','Skills','Experience','Projects','Contact']).map(s=>`<a href="#mo-${s.toLowerCase()}">${s}</a>`).join('')}</nav>
        </header>
        <div class="mo-split">
          <aside class="mo-sidebar">
            <div style="text-align:center;margin-bottom:28px">
              <div style="width:100px;height:100px;border-radius:50%;overflow:hidden;margin:0 auto 16px;border:2px solid rgba(212,165,116,.3);box-shadow:0 0 20px rgba(212,165,116,.08)"><img src="${d.avatar}" style="width:100%;height:100%;object-fit:cover"></div>
              <h2 style="font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:700;color:#f5e6d3;margin-bottom:4px">${d.name}</h2>
              <p style="color:#d4a574;font-size:.78rem;letter-spacing:1px">${d.title}</p>
            </div>
            ${d.githubStats?`<div style="margin-bottom:24px"><p style="font-size:.6rem;text-transform:uppercase;letter-spacing:2px;color:rgba(212,165,116,.4);margin-bottom:10px">Stats</p>${[[d.githubStats.totalCommits.toLocaleString(),'Commits'],[d.githubStats.publicRepos,'Repos'],[d.githubStats.followers,'Followers'],[`${d.githubStats.contributionStreak}d`,'Streak']].map(([v,l])=>`<div class="mo-stat"><div style="font-size:1.1rem;font-weight:700;color:#d4a574">${v}</div><div style="font-size:.62rem;color:rgba(212,165,116,.5);text-transform:uppercase;letter-spacing:1px;margin-top:2px">${l}</div></div>`).join('')}</div>`:''}
            ${d.skills.length?`<div id="mo-skills"><p style="font-size:.6rem;text-transform:uppercase;letter-spacing:2px;color:rgba(212,165,116,.4);margin-bottom:10px">Skills</p><div style="display:flex;flex-wrap:wrap;gap:5px">${d.skills.map((s:string)=>`<span class="skill-tag" style="font-size:.72rem;color:#d4a574;background:rgba(212,165,116,.08);border:1px solid rgba(212,165,116,.15);padding:4px 11px;border-radius:6px">${s}</span>`).join('')}</div></div>`:''}
            <div style="margin-top:24px;padding-top:20px;border-top:1px solid rgba(212,165,116,.1)">
              <p style="font-size:.6rem;text-transform:uppercase;letter-spacing:2px;color:rgba(212,165,116,.4);margin-bottom:8px">Contact</p>
              <a href="${gmailLink(d.email)}" style="color:#d4a574;font-size:.78rem;display:block;text-decoration:none;margin-bottom:4px;word-break:break-all">${d.email}</a>
              <p style="color:#8a6e5a;font-size:.75rem">${d.location}</p>
            </div>
          </aside>
          <main class="mo-main">
            <section id="mo-about" style="margin-bottom:52px">
              <h1 style="font-family:'Playfair Display',serif;font-size:2.4rem;font-weight:700;color:#f5e6d3;margin-bottom:12px;letter-spacing:-.5px">${d.name}</h1>
              <p style="color:#d4a574;font-size:1rem;margin-bottom:16px">${d.title} · ${d.location}</p>
              <p style="color:#8a6e5a;font-size:.95rem;line-height:1.9;max-width:500px;border-left:2px solid rgba(212,165,116,.25);padding-left:20px;font-style:italic">"${d.bio}"</p>
            </section>
            ${d.experience.length?`<section id="mo-experience" style="margin-bottom:52px"><h2 class="reveal" style="font-family:'Playfair Display',serif;color:#d4a574;font-size:1.5rem;margin-bottom:24px;font-style:italic">Experience</h2>${d.experience.map((e:{role:string,company:string,period:string,description:string})=>`<div class="mo-card tilt-card reveal"><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;margin-bottom:8px"><div><div style="font-weight:700;color:#f5e6d3">${e.role}</div><div style="color:#d4a574;font-size:.85rem">${e.company}</div></div><span style="font-size:.72rem;color:rgba(212,165,116,.4)">${e.period}</span></div><p style="color:#8a6e5a;font-size:.88rem;line-height:1.75">${e.description}</p></div>`).join('')}</section>`:''}
            ${d.projects.length?`<section id="mo-projects" style="margin-bottom:52px"><h2 class="reveal" style="font-family:'Playfair Display',serif;color:#d4a574;font-size:1.5rem;margin-bottom:24px;font-style:italic">Projects ☕</h2><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px">${d.projects.map((p:{name:string,description:string,tech:string[],stars:number,link:string})=>`<div class="mo-card tilt-card reveal"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-weight:700;color:#e5d3c0;font-size:.95rem">${p.link?`<a href="${p.link}" target="_blank" style="color:#e5d3c0;text-decoration:none">${p.name}</a>`:p.name}</span>${p.stars?`<span style="color:#fbbf24;font-size:.8rem">★ ${p.stars}</span>`:''}</div><p style="color:#8a6e5a;font-size:.83rem;line-height:1.65;margin-bottom:10px">${p.description}</p><div style="display:flex;flex-wrap:wrap;gap:5px">${p.tech.map((t:string)=>`<span style="font-size:.7rem;color:#d4a574;background:rgba(212,165,116,.08);padding:3px 10px;border-radius:6px">${t}</span>`).join('')}</div></div>`).join('')}</div></section>`:''}
            ${githubActivityHtml(d,'rgba(212,165,116,.06)','rgba(212,165,116,.15)','#d4a574','#8a6e5a')}
            ${d.education.length?`<section id="mo-education" style="margin-bottom:40px"><h2 class="reveal" style="font-family:'Playfair Display',serif;color:#d4a574;font-size:1.5rem;margin-bottom:20px;font-style:italic">Education</h2>${d.education.map((e:{degree:string,institution:string,period:string})=>`<div class="mo-card reveal"><div style="font-weight:700;color:#e5d3c0">${e.degree}</div><div style="color:#d4a574;font-size:.88rem">${e.institution}</div><div style="color:rgba(212,165,116,.4);font-size:.78rem">${e.period}</div></div>`).join('')}</section>`:''}
            <section id="mo-contact" class="reveal" style="padding:32px;background:rgba(212,165,116,.06);border:1px solid rgba(212,165,116,.12);border-radius:16px;text-align:center;margin-bottom:24px"><h2 style="font-family:'Playfair Display',serif;font-size:1.4rem;color:#d4a574;margin-bottom:12px;font-style:italic">Let's chat ☕</h2><a href="${gmailLink(d.email)}" style="color:#d4a574;font-size:.95rem;text-decoration:none;border-bottom:1px solid rgba(212,165,116,.3)">${d.email}</a></section>
          </main>
        </div></div>`);

    // ── SAKURA ─ Japanese zen, vertical accent, numbered sections ────────────
    case "sakura":
      return wrapTheme(
        '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">',
        '\'Noto Sans JP\',sans-serif',
        `<style>
          .sk-nav{position:sticky;top:0;z-index:100;background:rgba(255,248,251,.9);backdrop-filter:blur(16px);padding:12px 32px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(236,72,153,.1)}
          .sk-nav a{color:#9d4c7a;text-decoration:none;font-size:.78rem;font-weight:500;padding:6px 12px;border-radius:6px;transition:all .2s}
          .sk-nav a:hover{background:rgba(236,72,153,.08);color:#be185d}
          .sk-accent{position:fixed;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,transparent 5%,#ec4899 30%,#f43f5e 70%,transparent 95%);z-index:200}
          .sk-section-num{font-size:5rem;font-weight:700;color:rgba(236,72,153,.06);line-height:1;position:absolute;top:-10px;left:0;user-select:none}
          .sk-card{background:#fff;border:1px solid #fbcfe8;border-radius:12px;padding:20px;margin-bottom:12px;transition:all .3s}
          .sk-card:hover{box-shadow:0 6px 20px rgba(236,72,153,.1);border-color:rgba(236,72,153,.3)}
          .sk-tag{font-size:.72rem;color:#be185d;background:#fce7f3;padding:3px 11px;border-radius:6px;display:inline-block}
          @media(max-width:768px){.sk-accent{display:none}.sk-nav nav{display:none}h1{font-size:2rem!important}.sk-hero-grid{grid-template-columns:1fr!important}}
        </style>
        <div style="background:#fff8fb;color:#3d1c2f;min-height:100vh;padding-left:12px">
        <div class="sk-accent"></div>
        <header class="sk-nav">
          <span style="font-weight:700;color:#be185d;font-size:.9rem">🌸 ${d.name.split(' ')[0]}</span>
          <nav style="display:flex;gap:2px">${(['About','Skills','Experience','Projects','Contact']).map(s=>`<a href="#sk-${s.toLowerCase()}" onclick="event.preventDefault();document.getElementById('sk-${s.toLowerCase()}')?.scrollIntoView({behavior:'smooth'})">${s}</a>`).join('')}</nav>
        </header>
        <section id="sk-about" class="sk-hero-grid" style="display:grid;grid-template-columns:1fr 1fr;min-height:80vh;max-width:1100px;margin:0 auto">
          <div style="padding:80px 48px;display:flex;flex-direction:column;justify-content:center">
            <p style="font-size:.65rem;letter-spacing:5px;text-transform:uppercase;color:rgba(236,72,153,.5);margin-bottom:16px">スキルポートフォリオ</p>
            <h1 style="font-size:clamp(2rem,5vw,3.8rem);font-weight:700;color:#9d174d;line-height:1.1;margin-bottom:12px;letter-spacing:-.5px">${d.name}</h1>
            <p style="color:#be185d;font-size:.9rem;letter-spacing:2px;text-transform:uppercase;margin-bottom:20px">${d.title}</p>
            <p style="color:#9d4c7a;font-size:.92rem;line-height:1.9;max-width:420px;font-weight:300">${d.bio}</p>
            <div style="display:flex;gap:10px;margin-top:24px;flex-wrap:wrap">
              ${d.github?`<a href="${d.github}" target="_blank" style="background:#be185d;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:.85rem">GitHub ↗</a>`:''}
              ${d.email?`<a href="${gmailLink(d.email)}" style="border:2px solid #fbcfe8;color:#be185d;padding:8px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:.85rem">${d.email}</a>`:''}
            </div>
          </div>
          <div style="background:linear-gradient(160deg,#fce7f3,#fbcfe8,#f9a8d4);display:flex;align-items:center;justify-content:center;padding:48px;position:relative;overflow:hidden">
            <div style="position:absolute;top:-20px;right:-20px;font-size:8rem;opacity:.08">🌸</div>
            <div><div style="width:160px;height:160px;border-radius:50%;overflow:hidden;margin:0 auto 20px;border:3px solid rgba(236,72,153,.35);box-shadow:0 16px 40px rgba(236,72,153,.15)"><img src="${d.avatar}" style="width:100%;height:100%;object-fit:cover"></div><div style="text-align:center"><p style="font-size:.65rem;letter-spacing:3px;text-transform:uppercase;color:rgba(236,72,153,.5);margin-bottom:4px">Location</p><p style="color:#9d174d;font-weight:500;font-size:.9rem">${d.location}</p></div></div>
          </div>
        </section>
        <div style="max-width:900px;margin:0 auto;padding:60px 40px">
          ${d.skills.length?`<section id="sk-skills" style="margin-bottom:60px;position:relative;padding-top:20px"><div class="sk-section-num">01</div><h2 class="reveal" style="font-size:1.4rem;font-weight:700;color:#9d174d;margin-bottom:8px;position:relative">スキル · Skills 🌸</h2><div style="width:40px;height:2px;background:#ec4899;margin-bottom:24px"></div><div class="reveal" style="display:flex;flex-wrap:wrap;gap:8px">${d.skills.map((s:string)=>`<span class="sk-tag skill-tag">${s}</span>`).join('')}</div></section>`:''}
          ${d.experience.length?`<section id="sk-experience" style="margin-bottom:60px;position:relative;padding-top:20px"><div class="sk-section-num">02</div><h2 class="reveal" style="font-size:1.4rem;font-weight:700;color:#9d174d;margin-bottom:8px;position:relative">経験 · Experience</h2><div style="width:40px;height:2px;background:#ec4899;margin-bottom:24px"></div>${d.experience.map((e:{role:string,company:string,period:string,description:string})=>`<div class="sk-card tilt-card reveal"><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;margin-bottom:8px"><div><div style="font-weight:700;color:#3d1c2f">${e.role}</div><div style="color:#be185d;font-size:.85rem;font-weight:500">${e.company}</div></div><span style="font-size:.7rem;color:rgba(236,72,153,.5)">${e.period}</span></div><p style="color:#9d4c7a;font-size:.87rem;line-height:1.8;font-weight:300">${e.description}</p></div>`).join('')}</section>`:''}
          ${d.projects.length?`<section id="sk-projects" style="margin-bottom:60px;position:relative;padding-top:20px"><div class="sk-section-num">03</div><h2 class="reveal" style="font-size:1.4rem;font-weight:700;color:#9d174d;margin-bottom:8px;position:relative">プロジェクト · Projects</h2><div style="width:40px;height:2px;background:#ec4899;margin-bottom:24px"></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px">${d.projects.map((p:{name:string,description:string,tech:string[],stars:number,link:string})=>`<div class="sk-card tilt-card reveal"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-weight:700;color:#3d1c2f">${p.link?`<a href="${p.link}" target="_blank" style="color:#3d1c2f;text-decoration:none">${p.name}</a>`:p.name}</span>${p.stars?`<span style="color:#f59e0b;font-size:.8rem">★ ${p.stars}</span>`:''}</div><p style="color:#9d4c7a;font-size:.83rem;line-height:1.65;margin-bottom:10px;font-weight:300">${p.description}</p><div style="display:flex;flex-wrap:wrap;gap:5px">${p.tech.map((t:string)=>`<span class="sk-tag" style="font-size:.7rem">${t}</span>`).join('')}</div></div>`).join('')}</div></section>`:''}
          ${githubActivityHtml(d,'#fff','#fbcfe8','#be185d','#9d4c7a')}
          ${d.education.length?`<section id="sk-education" style="margin-bottom:48px;position:relative;padding-top:20px"><div class="sk-section-num">04</div><h2 class="reveal" style="font-size:1.4rem;font-weight:700;color:#9d174d;margin-bottom:8px;position:relative">学歴 · Education</h2><div style="width:40px;height:2px;background:#ec4899;margin-bottom:24px"></div>${d.education.map((e:{degree:string,institution:string,period:string})=>`<div class="sk-card reveal"><div style="font-weight:700;color:#3d1c2f">${e.degree}</div><div style="color:#be185d;font-size:.88rem">${e.institution}</div><div style="color:rgba(236,72,153,.4);font-size:.78rem;margin-top:2px">${e.period}</div></div>`).join('')}</section>`:''}
          <section id="sk-contact" class="reveal" style="text-align:center;padding:48px;background:linear-gradient(135deg,#fce7f3,#fbcfe8);border-radius:20px;margin-bottom:24px"><p style="font-size:2rem;margin-bottom:12px">🌸</p><h2 style="font-size:1.6rem;font-weight:700;color:#9d174d;margin-bottom:8px">Get in Touch</h2><p style="color:#be185d;font-size:.88rem;margin-bottom:20px">お気軽にご連絡ください</p><a href="${gmailLink(d.email)}" style="display:inline-block;background:#be185d;color:#fff;padding:12px 32px;border-radius:50px;text-decoration:none;font-weight:700;transition:transform .2s" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">${d.email}</a></section>
        </div></div>`);

    // ── GRAPHITE ─ Industrial full-width, monospace, sharp ───────────────────
    case "graphite":
      return wrapTheme(
        '<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">',
        '\'IBM Plex Sans\',sans-serif',
        `<style>
          .gr-nav{position:sticky;top:0;z-index:100;background:rgba(17,17,19,.96);backdrop-filter:blur(12px);padding:12px 40px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #27272a}
          .gr-nav a{color:#71717a;text-decoration:none;font-size:.78rem;padding:6px 10px;transition:color .2s;font-family:'IBM Plex Mono',monospace}
          .gr-nav a:hover{color:#e4e4e7}
          .gr-sec{padding:80px 40px;max-width:1000px;margin:0 auto}
          .gr-num{font-family:'IBM Plex Mono',monospace;font-size:4.5rem;font-weight:700;color:rgba(228,228,231,.05);line-height:1;position:absolute;top:-8px;left:0;user-select:none}
          .gr-divider{width:100%;height:1px;background:linear-gradient(90deg,transparent,#27272a,transparent);margin:0 0 56px}
          .gr-card{background:#1c1c1f;border:1px solid #27272a;border-radius:8px;padding:22px;margin-bottom:12px;transition:all .3s;position:relative;overflow:hidden}
          .gr-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:#e4e4e7;opacity:0;transition:opacity .3s}
          .gr-card:hover{border-color:#3f3f46}.gr-card:hover::before{opacity:1}
          @media(max-width:768px){.gr-nav nav{display:none}.gr-sec{padding:48px 20px!important}h1{font-size:2.2rem!important}.gr-hero-grid{flex-direction:column!important}}
        </style>
        <div style="background:#111113;color:#d4d4d8;min-height:100vh">
        <header class="gr-nav">
          <span style="font-family:'IBM Plex Mono',monospace;font-size:.82rem;color:#e4e4e7;letter-spacing:1px">${d.name.toUpperCase().split(' ').join('_')}</span>
          <nav style="display:flex;gap:2px">${(['about','skills','experience','projects','contact']).map(s=>`<a href="#gr-${s}" onclick="event.preventDefault();document.getElementById('gr-${s}')?.scrollIntoView({behavior:'smooth'})">${s}/</a>`).join('')}</nav>
        </header>
        <section id="gr-about" style="background:linear-gradient(160deg,#18181b,#1c1c1f);padding:80px 40px;border-bottom:1px solid #27272a">
          <div class="gr-hero-grid" style="display:flex;gap:40px;align-items:center;max-width:1000px;margin:0 auto;flex-wrap:wrap">
            <div style="flex:1">
              <p style="font-family:'IBM Plex Mono',monospace;font-size:.68rem;color:#52525b;letter-spacing:3px;margin-bottom:16px">// PORTFOLIO.ts</p>
              <h1 style="font-size:clamp(2.2rem,5vw,4rem);font-weight:700;color:#fafafa;letter-spacing:-2px;line-height:1;margin-bottom:16px">${d.name}</h1>
              <p style="color:#a1a1aa;font-size:1rem;font-family:'IBM Plex Mono',monospace;margin-bottom:16px">&gt; ${d.title}</p>
              <p style="color:#71717a;font-size:.9rem;line-height:1.8;max-width:460px;font-weight:300">${d.bio}</p>
              <div style="display:flex;gap:10px;margin-top:24px;flex-wrap:wrap">
                ${d.github?`<a href="${d.github}" target="_blank" style="background:#e4e4e7;color:#111113;padding:10px 24px;border-radius:4px;text-decoration:none;font-weight:700;font-size:.82rem;font-family:'IBM Plex Mono',monospace">git clone</a>`:''}
                ${d.email?`<a href="${gmailLink(d.email)}" style="border:1px solid #27272a;color:#a1a1aa;padding:10px 24px;border-radius:4px;text-decoration:none;font-size:.82rem;font-family:'IBM Plex Mono',monospace;transition:all .2s" onmouseover="this.style.borderColor='#e4e4e7';this.style.color='#e4e4e7'" onmouseout="this.style.borderColor='#27272a';this.style.color='#a1a1aa'">contact</a>`:''}
              </div>
            </div>
            <div style="flex-shrink:0;width:120px;height:120px;border-radius:6px;overflow:hidden;border:1px solid #3f3f46"><img src="${d.avatar}" style="width:100%;height:100%;object-fit:cover"></div>
          </div>
        </section>
        ${d.skills.length?`<section id="gr-skills" class="gr-sec" style="position:relative;padding-top:56px"><div class="gr-num">01</div><div class="gr-divider"></div><p style="font-family:'IBM Plex Mono',monospace;font-size:.65rem;letter-spacing:3px;color:#52525b;margin-bottom:8px;position:relative">SKILLS</p><h2 class="reveal" style="font-size:2rem;font-weight:700;color:#fafafa;margin-bottom:28px;letter-spacing:-1px;position:relative">Tech Stack</h2><div class="reveal" style="display:flex;flex-wrap:wrap;gap:8px">${d.skills.map((s:string)=>`<span class="skill-tag" style="background:#1c1c1f;border:1px solid #27272a;color:#d4d4d8;padding:8px 18px;border-radius:4px;font-family:'IBM Plex Mono',monospace;font-size:.78rem;transition:all .2s" onmouseover="this.style.borderColor='#e4e4e7';this.style.color='#fafafa'" onmouseout="this.style.borderColor='#27272a';this.style.color='#d4d4d8'">${s}</span>`).join('')}</div></section>`:''}
        ${d.experience.length?`<section id="gr-experience" class="gr-sec" style="position:relative;padding-top:56px"><div class="gr-num">02</div><div class="gr-divider"></div><p style="font-family:'IBM Plex Mono',monospace;font-size:.65rem;letter-spacing:3px;color:#52525b;margin-bottom:8px;position:relative">EXPERIENCE</p><h2 class="reveal" style="font-size:2rem;font-weight:700;color:#fafafa;margin-bottom:28px;letter-spacing:-1px;position:relative">Work History</h2>${d.experience.map((e:{role:string,company:string,period:string,description:string})=>`<div class="gr-card tilt-card reveal"><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;margin-bottom:8px"><div><div style="font-weight:700;color:#fafafa;font-size:.98rem">${e.role}</div><div style="color:#a1a1aa;font-size:.82rem;font-family:'IBM Plex Mono',monospace">${e.company}</div></div><span style="font-family:'IBM Plex Mono',monospace;font-size:.7rem;color:#52525b">${e.period}</span></div><p style="color:#71717a;font-size:.87rem;line-height:1.75;font-weight:300">${e.description}</p></div>`).join('')}</section>`:''}
        ${d.projects.length?`<section id="gr-projects" class="gr-sec" style="position:relative;padding-top:56px"><div class="gr-num">03</div><div class="gr-divider"></div><p style="font-family:'IBM Plex Mono',monospace;font-size:.65rem;letter-spacing:3px;color:#52525b;margin-bottom:8px;position:relative">PROJECTS</p><h2 class="reveal" style="font-size:2rem;font-weight:700;color:#fafafa;margin-bottom:28px;letter-spacing:-1px;position:relative">Built Things</h2><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px">${d.projects.map((p:{name:string,description:string,tech:string[],stars:number,link:string})=>`<div class="gr-card tilt-card reveal"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-weight:700;color:#fafafa;font-size:.92rem">${p.link?`<a href="${p.link}" target="_blank" style="color:#fafafa;text-decoration:none">${p.name}</a>`:p.name}</span>${p.stars?`<span style="color:#fbbf24;font-size:.8rem">★ ${p.stars}</span>`:''}</div><p style="color:#71717a;font-size:.82rem;line-height:1.65;margin-bottom:10px;font-weight:300">${p.description}</p><div style="display:flex;flex-wrap:wrap;gap:5px">${p.tech.map((t:string)=>`<span style="font-size:.7rem;color:#a1a1aa;background:#18181b;border:1px solid #27272a;padding:3px 10px;border-radius:4px;font-family:'IBM Plex Mono',monospace">${t}</span>`).join('')}</div></div>`).join('')}</div></section>`:''}
        <section class="gr-sec" style="position:relative;padding-top:56px"><div class="gr-divider"></div>${githubActivityHtml(d,'#1c1c1f','#3f3f46','#e4e4e7','#71717a')}${leetcodeHtml(d,'#1c1c1f','#3f3f46','#e4e4e7','#71717a')}</section>
        ${d.education.length?`<section class="gr-sec" style="padding-top:0"><p style="font-family:'IBM Plex Mono',monospace;font-size:.65rem;letter-spacing:3px;color:#52525b;margin-bottom:16px">EDUCATION</p>${d.education.map((e:{degree:string,institution:string,period:string})=>`<div class="gr-card reveal"><div style="font-weight:700;color:#fafafa">${e.degree}</div><div style="color:#a1a1aa;font-family:'IBM Plex Mono',monospace;font-size:.8rem">${e.institution}</div><div style="color:#52525b;font-family:'IBM Plex Mono',monospace;font-size:.72rem">${e.period}</div></div>`).join('')}</section>`:''}
        <section id="gr-contact" class="gr-sec" style="padding-top:0;padding-bottom:80px"><div class="gr-divider"></div><div class="reveal" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px;background:#1c1c1f;border:1px solid #27272a;border-radius:8px;padding:32px"><div><p style="font-family:'IBM Plex Mono',monospace;font-size:.65rem;color:#52525b;margin-bottom:8px">CONTACT</p><h2 style="font-size:1.5rem;font-weight:700;color:#fafafa;margin-bottom:4px">Let's build something.</h2><p style="color:#71717a;font-size:.85rem">${d.location}</p></div><a href="${gmailLink(d.email)}" style="background:#e4e4e7;color:#111113;padding:14px 32px;border-radius:4px;text-decoration:none;font-weight:700;font-size:.88rem;font-family:'IBM Plex Mono',monospace;white-space:nowrap">${d.email}</a></div></section>
        </div>`);

    // ── EMERALD ─ Luxury alternating wide sections ────────────────────────────
    case "emerald":
      return wrapTheme(
        '<link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">',
        '\'Open Sans\',sans-serif',
        `<style>
          .em-nav{position:sticky;top:0;z-index:100;background:rgba(2,26,10,.92);backdrop-filter:blur(12px);padding:12px 40px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(16,185,129,.1)}
          .em-nav a{color:rgba(16,185,129,.55);text-decoration:none;font-size:.78rem;font-weight:500;padding:6px 12px;border-radius:6px;transition:all .2s}
          .em-nav a:hover{color:#10b981;background:rgba(16,185,129,.08)}
          .em-sec{padding:80px 0}
          .em-inner{max-width:1000px;margin:0 auto;padding:0 40px}
          .em-alt-bg{background:#042d16}
          .em-card{background:rgba(16,185,129,.05);border:1px solid rgba(16,185,129,.15);border-radius:14px;padding:24px;transition:all .3s}
          .em-card:hover{background:rgba(16,185,129,.09);border-color:rgba(16,185,129,.3);transform:translateY(-3px)}
          .em-rule{width:48px;height:2px;background:linear-gradient(90deg,#10b981,#34d399);margin-bottom:24px}
          @media(max-width:768px){.em-nav nav{display:none}.em-inner{padding:0 20px!important}h1{font-size:2.2rem!important}.em-two-col{grid-template-columns:1fr!important}}
        </style>
        <div style="background:#021a0a;color:#bbf7d0;min-height:100vh">
        <header class="em-nav">
          <span style="font-family:'Merriweather',serif;font-style:italic;color:#10b981;font-size:.9rem">${d.name.split(' ')[0]}</span>
          <nav style="display:flex;gap:2px">${(['About','Skills','Experience','Projects','Contact']).map(s=>`<a href="#em-${s.toLowerCase()}">${s}</a>`).join('')}</nav>
        </header>
        <section id="em-about" style="background:linear-gradient(160deg,#022c16,#064e3b);padding:80px 0;border-bottom:1px solid rgba(16,185,129,.1)">
          <div class="em-inner em-two-col" style="display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center">
            <div>
              <p style="font-size:.65rem;text-transform:uppercase;letter-spacing:5px;color:rgba(16,185,129,.5);margin-bottom:16px">Portfolio 💎</p>
              <h1 style="font-family:'Merriweather',serif;font-size:clamp(2rem,5vw,3.5rem);font-weight:700;color:#f0fdf4;line-height:1.15;margin-bottom:16px">${d.name}</h1>
              <div class="em-rule"></div>
              <p style="color:#10b981;font-size:.95rem;letter-spacing:1px;margin-bottom:16px">${d.title}</p>
              <p style="color:#4ade80;font-size:.9rem;line-height:1.85;font-style:italic;opacity:.75">"${d.bio}"</p>
              <div style="display:flex;gap:10px;margin-top:24px;flex-wrap:wrap">
                ${d.github?`<a href="${d.github}" target="_blank" style="background:#10b981;color:#021a0a;padding:11px 28px;border-radius:8px;text-decoration:none;font-weight:800;font-size:.88rem">GitHub</a>`:''}
                ${d.email?`<a href="${gmailLink(d.email)}" style="border:2px solid rgba(16,185,129,.4);color:#10b981;padding:9px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:.88rem">${d.email}</a>`:''}
              </div>
            </div>
            <div style="text-align:center"><div style="width:160px;height:160px;border-radius:50%;overflow:hidden;margin:0 auto 24px;border:2px solid rgba(16,185,129,.4);box-shadow:0 0 0 8px rgba(16,185,129,.06)"><img src="${d.avatar}" style="width:100%;height:100%;object-fit:cover"></div><p style="color:rgba(16,185,129,.5);font-size:.72rem;letter-spacing:2px;text-transform:uppercase">${d.location}</p></div>
          </div>
        </section>
        ${d.skills.length?`<section id="em-skills" class="em-sec em-alt-bg"><div class="em-inner"><p class="reveal" style="font-size:.65rem;text-transform:uppercase;letter-spacing:4px;color:rgba(16,185,129,.4);margin-bottom:8px">Expertise</p><h2 class="reveal" style="font-family:'Merriweather',serif;font-size:2rem;color:#f0fdf4;margin-bottom:8px">Skills 💎</h2><div class="em-rule reveal"></div><div class="reveal" style="display:flex;flex-wrap:wrap;gap:10px">${d.skills.map((s:string)=>`<span class="skill-tag" style="background:rgba(16,185,129,.1);border:1.5px solid rgba(16,185,129,.25);color:#86efac;padding:9px 20px;border-radius:8px;font-size:.85rem;font-weight:600">${s}</span>`).join('')}</div></div></section>`:''}
        ${d.experience.length?`<section id="em-experience" class="em-sec"><div class="em-inner"><p class="reveal" style="font-size:.65rem;text-transform:uppercase;letter-spacing:4px;color:rgba(16,185,129,.4);margin-bottom:8px">Career</p><h2 class="reveal" style="font-family:'Merriweather',serif;font-size:2rem;color:#f0fdf4;margin-bottom:8px">Experience</h2><div class="em-rule reveal"></div>${d.experience.map((e:{role:string,company:string,period:string,description:string})=>`<div class="em-card tilt-card reveal" style="margin-bottom:16px"><div style="display:grid;grid-template-columns:1fr auto;gap:12px;margin-bottom:10px;align-items:start"><div><div style="font-weight:700;color:#f0fdf4;font-size:1rem">${e.role}</div><div style="color:#10b981;font-size:.85rem;font-weight:600">${e.company}</div></div><span style="font-size:.72rem;color:rgba(16,185,129,.45);text-align:right;white-space:nowrap">${e.period}</span></div><p style="color:#4ade80;font-size:.88rem;line-height:1.75;opacity:.75">${e.description}</p></div>`).join('')}</div></section>`:''}
        ${d.projects.length?`<section id="em-projects" class="em-sec em-alt-bg"><div class="em-inner"><p class="reveal" style="font-size:.65rem;text-transform:uppercase;letter-spacing:4px;color:rgba(16,185,129,.4);margin-bottom:8px">Works</p><h2 class="reveal" style="font-family:'Merriweather',serif;font-size:2rem;color:#f0fdf4;margin-bottom:8px">Projects</h2><div class="em-rule reveal"></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px">${d.projects.map((p:{name:string,description:string,tech:string[],stars:number,link:string})=>`<div class="em-card tilt-card reveal"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-weight:700;color:#f0fdf4;font-family:'Merriweather',serif">${p.link?`<a href="${p.link}" target="_blank" style="color:#f0fdf4;text-decoration:none">${p.name}</a>`:p.name}</span>${p.stars?`<span style="color:#fbbf24;font-size:.8rem">★ ${p.stars}</span>`:''}</div><p style="color:#4ade80;font-size:.85rem;line-height:1.65;margin-bottom:12px;opacity:.75">${p.description}</p><div style="display:flex;flex-wrap:wrap;gap:6px">${p.tech.map((t:string)=>`<span style="font-size:.72rem;color:#10b981;background:rgba(16,185,129,.1);padding:3px 10px;border-radius:6px;font-weight:600">${t}</span>`).join('')}</div></div>`).join('')}</div></div></section>`:''}
        <section class="em-sec"><div class="em-inner">${githubActivityHtml(d,'rgba(16,185,129,.05)','rgba(16,185,129,.18)','#10b981','#4ade80')}</div></section>
        ${d.education.length?`<section id="em-education" class="em-sec em-alt-bg"><div class="em-inner"><p class="reveal" style="font-size:.65rem;text-transform:uppercase;letter-spacing:4px;color:rgba(16,185,129,.4);margin-bottom:8px">Formation</p><h2 class="reveal" style="font-family:'Merriweather',serif;font-size:2rem;color:#f0fdf4;margin-bottom:8px">Education</h2><div class="em-rule reveal"></div>${d.education.map((e:{degree:string,institution:string,period:string})=>`<div class="em-card tilt-card reveal" style="margin-bottom:12px"><div style="font-family:'Merriweather',serif;font-weight:700;color:#f0fdf4">${e.degree}</div><div style="color:#10b981;font-size:.88rem">${e.institution}</div><div style="color:rgba(16,185,129,.4);font-size:.78rem;margin-top:2px">${e.period}</div></div>`).join('')}</div></section>`:''}
        <section id="em-contact" class="em-sec" style="text-align:center"><div class="em-inner"><div class="reveal" style="max-width:600px;margin:0 auto;padding:48px;background:rgba(16,185,129,.05);border:1px solid rgba(16,185,129,.15);border-radius:20px"><h2 style="font-family:'Merriweather',serif;font-size:2rem;color:#f0fdf4;margin-bottom:12px">Get In Touch</h2><p style="color:#4ade80;font-size:.9rem;margin-bottom:24px;opacity:.7">${d.email} · ${d.location}</p><div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><a href="${gmailLink(d.email)}" style="background:#10b981;color:#021a0a;padding:12px 32px;border-radius:50px;text-decoration:none;font-weight:800;font-size:.9rem">Email me</a>${d.github?`<a href="${d.github}" target="_blank" style="border:2px solid rgba(16,185,129,.3);color:#10b981;padding:10px 32px;border-radius:50px;text-decoration:none;font-weight:700;font-size:.9rem">GitHub</a>`:''}</div></div></div></section>
        </div>`);

    // ── ROYAL ─ Scroll-snap regal chambers with side dot nav ─────────────────
    case "royal":
      return wrapTheme(
        '<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Raleway:wght@300;400;500;600&display=swap" rel="stylesheet">',
        '\'Raleway\',sans-serif',
        `<style>
          html,body{scroll-snap-type:y mandatory;overflow-y:scroll;height:100%}
          .ry-snap{scroll-snap-align:start;min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:80px 48px;position:relative;overflow:hidden}
          .ry-dots{position:fixed;right:24px;top:50%;transform:translateY(-50%);z-index:100;display:flex;flex-direction:column;gap:12px}
          .ry-dot{width:8px;height:8px;border-radius:50%;background:rgba(129,140,248,.3);cursor:pointer;transition:all .3s}
          .ry-dot.active,.ry-dot:hover{background:#818cf8;transform:scale(1.5)}
          .ry-card{background:rgba(129,140,248,.06);border:1px solid rgba(129,140,248,.18);border-radius:12px;padding:22px;margin-bottom:12px;transition:all .3s}
          .ry-card:hover{background:rgba(129,140,248,.1);border-color:rgba(129,140,248,.35)}
          .ry-rule{display:flex;align-items:center;gap:16px;margin-bottom:32px}
          .ry-rule::before,.ry-rule::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(129,140,248,.3),transparent)}
          @media(max-width:768px){html,body{scroll-snap-type:none!important}.ry-snap{padding:60px 24px!important;min-height:auto!important}.ry-dots{display:none!important}h1{font-size:2rem!important}}
        </style>
        <div style="background:#0d0b1f;color:#c7d2fe;position:relative">
        <nav class="ry-dots" id="ry-dots">
          ${(['home','skills','experience','projects','github','contact']).map((id,i)=>`<div class="ry-dot${i===0?' active':''}" id="ryd-${id}" onclick="document.getElementById('ry-${id}')?.scrollIntoView({behavior:'smooth'})" title="${id}"></div>`).join('')}
        </nav>
        <section id="ry-home" class="ry-snap" style="background:linear-gradient(160deg,#1e1b4b,#312e81,#1e1b4b);text-align:center">
          <div style="max-width:700px;margin:0 auto;position:relative;z-index:1">
            <div style="font-size:2rem;margin-bottom:24px;opacity:.3">♔</div>
            <p style="font-family:'Cinzel',serif;font-size:.6rem;letter-spacing:6px;color:rgba(129,140,248,.5);margin-bottom:20px">ROYAL PORTFOLIO</p>
            <div class="ry-rule"><span style="font-family:'Cinzel',serif;font-size:.7rem;color:rgba(129,140,248,.4)">◆</span></div>
            <div style="width:120px;height:120px;border-radius:50%;overflow:hidden;margin:0 auto 24px;border:2px solid rgba(165,180,252,.4);box-shadow:0 0 0 8px rgba(129,140,248,.08)"><img src="${d.avatar}" style="width:100%;height:100%;object-fit:cover"></div>
            <h1 style="font-family:'Cinzel',serif;font-size:clamp(1.8rem,4vw,3rem);font-weight:700;color:#e0e7ff;margin-bottom:10px;letter-spacing:3px">${d.name}</h1>
            <p style="color:#818cf8;font-size:.85rem;letter-spacing:3px;text-transform:uppercase;margin-bottom:16px">${d.title}</p>
            <p style="color:#a5b4fc;max-width:440px;margin:0 auto;line-height:1.85;font-weight:300">${d.bio}</p>
          </div>
          <div style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);color:rgba(129,140,248,.3);font-size:.65rem;letter-spacing:2px">♦ scroll ♦</div>
        </section>
        ${d.skills.length?`<section id="ry-skills" class="ry-snap" style="background:linear-gradient(160deg,#0d0b1f,#1a1848)"><div style="max-width:900px;margin:0 auto;width:100%;text-align:center"><div class="ry-rule"><span style="font-family:'Cinzel',serif;font-size:.6rem;letter-spacing:4px;color:rgba(129,140,248,.4)">EXPERTISE</span></div><h2 style="font-family:'Cinzel',serif;font-size:2rem;color:#e0e7ff;margin-bottom:36px;letter-spacing:2px">Skills</h2><div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center">${d.skills.map((s:string)=>`<span class="skill-tag" style="background:rgba(129,140,248,.1);color:#a5b4fc;border:1.5px solid rgba(129,140,248,.2);padding:10px 22px;border-radius:8px;font-size:.85rem;font-weight:500">${s}</span>`).join('')}</div></div></section>`:''}
        ${d.experience.length?`<section id="ry-experience" class="ry-snap" style="background:linear-gradient(160deg,#1a1848,#312e81)"><div style="max-width:900px;margin:0 auto;width:100%"><div class="ry-rule"><span style="font-family:'Cinzel',serif;font-size:.6rem;letter-spacing:4px;color:rgba(129,140,248,.4)">CAREER</span></div><h2 style="font-family:'Cinzel',serif;font-size:2rem;color:#e0e7ff;margin-bottom:36px;letter-spacing:2px">Experience</h2>${d.experience.map((e:{role:string,company:string,period:string,description:string})=>`<div class="ry-card tilt-card"><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;margin-bottom:8px"><div><div style="font-weight:700;color:#e0e7ff">${e.role}</div><div style="color:#818cf8;font-size:.85rem">${e.company}</div></div><span style="font-size:.72rem;color:rgba(129,140,248,.4)">${e.period}</span></div><p style="color:#a5b4fc;font-size:.87rem;line-height:1.75">${e.description}</p></div>`).join('')}</div></section>`:''}
        ${d.projects.length?`<section id="ry-projects" class="ry-snap" style="background:linear-gradient(160deg,#312e81,#1e1b4b)"><div style="max-width:900px;margin:0 auto;width:100%"><div class="ry-rule"><span style="font-family:'Cinzel',serif;font-size:.6rem;letter-spacing:4px;color:rgba(129,140,248,.4)">WORKS</span></div><h2 style="font-family:'Cinzel',serif;font-size:2rem;color:#e0e7ff;margin-bottom:36px;letter-spacing:2px">Projects</h2><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px">${d.projects.map((p:{name:string,description:string,tech:string[],stars:number,link:string})=>`<div class="ry-card tilt-card"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-weight:700;color:#e0e7ff;font-size:.92rem">${p.link?`<a href="${p.link}" target="_blank" style="color:#e0e7ff;text-decoration:none">${p.name}</a>`:p.name}</span>${p.stars?`<span style="color:#fbbf24;font-size:.8rem">★ ${p.stars}</span>`:''}</div><p style="color:#a5b4fc;font-size:.82rem;line-height:1.65;margin-bottom:10px">${p.description}</p><div style="display:flex;flex-wrap:wrap;gap:5px">${p.tech.map((t:string)=>`<span style="font-size:.72rem;color:#a5b4fc;background:rgba(129,140,248,.1);padding:3px 10px;border-radius:6px">${t}</span>`).join('')}</div></div>`).join('')}</div></div></section>`:''}
        <section id="ry-github" class="ry-snap" style="background:linear-gradient(160deg,#0d0b1f,#1a1848);overflow-y:auto"><div style="max-width:900px;margin:0 auto;width:100%"><div class="ry-rule"><span style="font-family:'Cinzel',serif;font-size:.6rem;letter-spacing:4px;color:rgba(129,140,248,.4)">INSIGHTS</span></div>${githubActivityHtml(d,'rgba(129,140,248,.06)','rgba(129,140,248,.18)','#818cf8','#a5b4fc')}</div></section>
        <section id="ry-contact" class="ry-snap" style="background:linear-gradient(160deg,#1a1848,#312e81);text-align:center">
          <div style="max-width:600px;margin:0 auto">
            <div class="ry-rule"><span style="font-family:'Cinzel',serif;font-size:.6rem;letter-spacing:4px;color:rgba(129,140,248,.4)">CONTACT</span></div>
            <div style="font-size:1.5rem;margin-bottom:16px">♔</div>
            <h2 style="font-family:'Cinzel',serif;font-size:2.5rem;color:#e0e7ff;margin-bottom:20px;letter-spacing:3px">Say Hello.</h2>
            <a href="${gmailLink(d.email)}" style="display:inline-block;background:linear-gradient(135deg,#818cf8,#6366f1);color:#fff;padding:14px 40px;border-radius:50px;text-decoration:none;font-weight:700;font-size:.92rem;transition:transform .2s,box-shadow .2s" onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 12px 30px rgba(129,140,248,.3)'" onmouseout="this.style.transform='none';this.style.boxShadow='none'">${d.email}</a>
            <p style="color:#a5b4fc;margin-top:12px;font-size:.85rem">${d.location}</p>
            ${d.education.length?`<div style="margin-top:28px;border-top:1px solid rgba(129,140,248,.1);padding-top:20px">${d.education.map((e:{degree:string,institution:string,period:string})=>`<p style="color:#a5b4fc;font-size:.83rem"><strong style="color:#a5b4fc">${e.degree}</strong> · ${e.institution}</p>`).join('')}</div>`:''}
          </div>
        </section>
        </div>
        <script>
        var ryDots=document.querySelectorAll('.ry-dot');var rySecs=document.querySelectorAll('.ry-snap');
        window.addEventListener('scroll',function(){var cur='';rySecs.forEach(function(s){if(window.scrollY>=s.offsetTop-window.innerHeight/2)cur=s.id.replace('ry-','');});ryDots.forEach(function(d){var a=d.id==='ryd-'+cur;d.style.background=a?'#818cf8':'rgba(129,140,248,.3)';d.style.transform=a?'scale(1.5)':'scale(1)';});},{passive:true});
        </script>`);

    // ── ROCKET ─ Space scroll-snap mission control ────────────────────────────
    case "rocket":
      return wrapTheme(
        '<link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">',
        '\'Exo 2\',sans-serif',
        `<style>
          html,body{scroll-snap-type:y mandatory;overflow-y:scroll;height:100%}
          .rk-snap{scroll-snap-align:start;min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:80px 40px;position:relative;overflow:hidden}
          .rk-mission-nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(1,4,13,.88);backdrop-filter:blur(12px);padding:10px 40px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(249,115,22,.15)}
          .rk-mission-btn{color:rgba(249,115,22,.55);font-size:.72rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;cursor:pointer;padding:6px 12px;border-radius:4px;transition:all .2s;text-decoration:none}
          .rk-mission-btn:hover{color:#f97316;background:rgba(249,115,22,.08)}
          .rk-card{background:rgba(249,115,22,.05);border:1px solid rgba(249,115,22,.18);border-radius:10px;padding:20px;margin-bottom:12px;transition:all .3s}
          .rk-card:hover{background:rgba(249,115,22,.09);border-color:rgba(249,115,22,.35)}
          @media(max-width:768px){html,body{scroll-snap-type:none!important}.rk-snap{padding:60px 20px!important;min-height:auto!important}h1{font-size:2rem!important}.rk-mission-nav nav{display:none}}
        </style>
        <div style="background:#01040d;color:#cbd5e1;position:relative">
        ${starfieldCanvas('rgba(255,200,100,','rgba(1,4,13,0.75)')}
        ${particleCanvas('rgba(249,115,22,')}
        <header class="rk-mission-nav">
          <span style="font-size:.75rem;font-weight:700;color:#f97316;letter-spacing:3px">🚀 ${d.name.split(' ').map((w:string)=>w[0]).join('')} MISSION</span>
          <nav style="display:flex;gap:4px">${(['LAUNCH','SKILLS','MISSIONS','PROJECTS','SIGNAL']).map((s,i)=>{const ids=['home','skills','experience','projects','contact'];return `<a class="rk-mission-btn" href="#rk-${ids[i]}" onclick="event.preventDefault();document.getElementById('rk-${ids[i]}')?.scrollIntoView({behavior:'smooth'})">${s}</a>`;}).join('')}</nav>
        </header>
        <section id="rk-home" class="rk-snap" style="text-align:center;position:relative;z-index:2">
          <div style="max-width:700px;margin:0 auto">
            <div style="font-size:.7rem;font-weight:700;letter-spacing:5px;color:rgba(249,115,22,.5);margin-bottom:24px;text-transform:uppercase">Mission Control · ${new Date().getFullYear()}</div>
            <div style="width:120px;height:120px;border-radius:50%;overflow:hidden;margin:0 auto 24px;border:2px solid rgba(249,115,22,.5);box-shadow:0 0 20px rgba(249,115,22,.25),0 0 60px rgba(249,115,22,.08)"><img src="${d.avatar}" style="width:100%;height:100%;object-fit:cover"></div>
            <h1 style="font-size:clamp(2rem,5vw,3.5rem);font-weight:900;background:linear-gradient(135deg,#fff 30%,#f97316);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:10px;letter-spacing:-1px">${d.name}</h1>
            <p style="color:#f97316;font-size:.85rem;letter-spacing:4px;text-transform:uppercase;margin-bottom:16px">${d.title}</p>
            <p style="color:#475569;max-width:460px;margin:0 auto;line-height:1.85;font-size:.92rem">${d.bio}</p>
            <div style="display:flex;gap:12px;justify-content:center;margin-top:28px;flex-wrap:wrap">
              ${d.github?`<a href="${d.github}" target="_blank" style="border:1px solid rgba(249,115,22,.4);color:#f97316;padding:11px 28px;border-radius:8px;text-decoration:none;font-size:.85rem;font-weight:700;transition:all .2s" onmouseover="this.style.background='rgba(249,115,22,.1)'" onmouseout="this.style.background='transparent'">GitHub</a>`:''}
              ${d.email?`<a href="${gmailLink(d.email)}" style="background:rgba(249,115,22,.15);color:#fb923c;padding:11px 28px;border-radius:8px;text-decoration:none;font-size:.85rem;font-weight:700;border:1px solid rgba(249,115,22,.2)">${d.email}</a>`:''}
            </div>
          </div>
          <div style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);color:rgba(249,115,22,.3);font-size:.65rem;letter-spacing:2px;animation:float 2s ease-in-out infinite">▼ IGNITE</div>
        </section>
        ${d.skills.length?`<section id="rk-skills" class="rk-snap" style="position:relative;z-index:2"><div style="max-width:900px;margin:0 auto;width:100%"><p style="font-size:.65rem;letter-spacing:5px;color:rgba(249,115,22,.5);margin-bottom:8px;font-weight:700">T-MINUS: TECH STACK</p><h2 style="font-size:clamp(1.8rem,4vw,2.5rem);font-weight:900;color:#e2e8f0;margin-bottom:36px">Capabilities 🚀</h2><div style="display:flex;flex-wrap:wrap;gap:10px">${d.skills.map((s:string)=>`<span class="skill-tag" style="background:rgba(249,115,22,.08);border:1.5px solid rgba(249,115,22,.2);color:#fb923c;padding:10px 22px;border-radius:8px;font-size:.85rem;font-weight:600">${s}</span>`).join('')}</div></div></section>`:''}
        ${d.experience.length?`<section id="rk-experience" class="rk-snap" style="position:relative;z-index:2"><div style="max-width:900px;margin:0 auto;width:100%"><p style="font-size:.65rem;letter-spacing:5px;color:rgba(249,115,22,.5);margin-bottom:8px;font-weight:700">MISSION LOG</p><h2 style="font-size:clamp(1.8rem,4vw,2.5rem);font-weight:900;color:#e2e8f0;margin-bottom:36px">Experience</h2>${d.experience.map((e:{role:string,company:string,period:string,description:string})=>`<div class="rk-card tilt-card"><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;margin-bottom:8px"><div><div style="font-weight:700;color:#e2e8f0">${e.role}</div><div style="color:#f97316;font-size:.85rem;font-weight:600">${e.company}</div></div><span style="font-size:.7rem;color:rgba(249,115,22,.4)">${e.period}</span></div><p style="color:#64748b;font-size:.87rem;line-height:1.75">${e.description}</p></div>`).join('')}</div></section>`:''}
        ${d.projects.length?`<section id="rk-projects" class="rk-snap" style="position:relative;z-index:2"><div style="max-width:900px;margin:0 auto;width:100%"><p style="font-size:.65rem;letter-spacing:5px;color:rgba(249,115,22,.5);margin-bottom:8px;font-weight:700">PAYLOAD: LAUNCHES</p><h2 style="font-size:clamp(1.8rem,4vw,2.5rem);font-weight:900;color:#e2e8f0;margin-bottom:36px">Projects</h2><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px">${d.projects.map((p:{name:string,description:string,tech:string[],stars:number,link:string})=>`<div class="rk-card tilt-card"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-weight:700;color:#e2e8f0;font-size:.92rem">${p.link?`<a href="${p.link}" target="_blank" style="color:#e2e8f0;text-decoration:none">${p.name}</a>`:p.name}</span>${p.stars?`<span style="color:#fbbf24;font-size:.8rem">★ ${p.stars}</span>`:''}</div><p style="color:#64748b;font-size:.82rem;line-height:1.65;margin-bottom:10px">${p.description}</p><div style="display:flex;flex-wrap:wrap;gap:5px">${p.tech.map((t:string)=>`<span style="font-size:.7rem;color:#fb923c;background:rgba(249,115,22,.08);padding:3px 10px;border-radius:6px;font-weight:600">${t}</span>`).join('')}</div></div>`).join('')}</div></div></section>`:''}
        <section class="rk-snap" style="position:relative;z-index:2;overflow-y:auto"><div style="max-width:900px;margin:0 auto;width:100%">${githubActivityHtml(d,'rgba(249,115,22,.05)','rgba(249,115,22,.18)','#f97316','#64748b')}${leetcodeHtml(d,'rgba(249,115,22,.05)','rgba(249,115,22,.18)','#f97316','#64748b')}</div></section>
        <section id="rk-contact" class="rk-snap" style="text-align:center;position:relative;z-index:2">
          <div style="max-width:600px;margin:0 auto">
            <p style="font-size:.65rem;letter-spacing:5px;color:rgba(249,115,22,.5);margin-bottom:16px;font-weight:700">OPEN CHANNEL</p>
            <h2 style="font-size:clamp(2rem,5vw,3rem);font-weight:900;color:#e2e8f0;margin-bottom:8px;letter-spacing:-1px">Let's launch 🚀</h2>
            <p style="color:#475569;margin-bottom:28px;font-size:.9rem">${d.location}</p>
            <a href="${gmailLink(d.email)}" style="display:inline-block;background:linear-gradient(135deg,#f97316,#fb923c);color:#fff;padding:14px 40px;border-radius:8px;text-decoration:none;font-weight:800;font-size:.95rem;transition:transform .2s,box-shadow .2s" onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 12px 30px rgba(249,115,22,.3)'" onmouseout="this.style.transform='none';this.style.boxShadow='none'">${d.email}</a>
            <div style="display:flex;gap:12px;justify-content:center;margin-top:16px">
              ${d.github?`<a href="${d.github}" target="_blank" style="color:rgba(249,115,22,.5);text-decoration:none;font-size:.82rem;transition:color .2s" onmouseover="this.style.color='#f97316'" onmouseout="this.style.color='rgba(249,115,22,.5)'">GitHub ↗</a>`:''}
              ${d.linkedin?`<a href="${d.linkedin}" target="_blank" style="color:rgba(249,115,22,.5);text-decoration:none;font-size:.82rem;transition:color .2s" onmouseover="this.style.color='#f97316'" onmouseout="this.style.color='rgba(249,115,22,.5)'">LinkedIn ↗</a>`:''}
            </div>
            ${d.education.length?`<div style="margin-top:32px;border-top:1px solid rgba(249,115,22,.1);padding-top:20px">${d.education.map((e:{degree:string,institution:string,period:string})=>`<p style="color:#64748b;font-size:.83rem"><strong style="color:#fb923c">${e.degree}</strong> · ${e.institution}</p>`).join('')}</div>`:''}
          </div>
        </section>
        </div>`);

    default:
      return `<html><body style="background:#0b1f3a;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;text-align:center"><div><h2>Theme Not Found</h2><p style="color:#888;margin-top:8px">Theme "${themeId}" is not available.</p></div></body></html>`;
  }
};

