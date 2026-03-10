# Memory: index.md
Updated: now

# PortfolioForge - Project Memory

## Credits
- Developed by **ADITHYA** and **THARUN K SHETTY**
- 20+ themes

## Key Decisions
- Navbar: "Generate Your Portfolio" button (no Login)
- Recruiter theme is first in themes list
- Feedback stored in localStorage (no backend yet)
- All themes have clickable navbars with smooth scroll JS
- Themes are single HTML+CSS+JS files with Three.js 3D backgrounds
- GitHub data auto-fetched when URL entered (edge function)
- Resume parsed with AI via raw fetch (NOT supabase.functions.invoke) because FormData doesn't work with invoke
- Portfolio data stored in sessionStorage between pages
- Visual editor (not code editor): side panel with form fields for name, title, bio, photo upload/remove, skills, experience, education
- Download filename uses person's name (sanitized), not theme name
- Finalize button downloads final version + shows confirmation
- Nav in themes uses onclick with scrollIntoView for smooth scroll
- Recruiter page has password lock (password: "repoflow"), stored in sessionStorage
- Three.js 3D wireframe shapes rendered in hero sections of all generated portfolios
- Nav fixed with max-width:100vw, overflow:hidden, smaller font/gap
