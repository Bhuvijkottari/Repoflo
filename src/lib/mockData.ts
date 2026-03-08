export interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  email: string;
  location: string;
  github: string;
  linkedin: string;
  website: string;
  skills: string[];
  experience: { company: string; role: string; period: string; description: string }[];
  education: { institution: string; degree: string; period: string }[];
  volunteering: { org: string; role: string; period: string; description: string }[];
  projects: { name: string; description: string; tech: string[]; stars: number; link: string }[];
  githubStats?: {
    totalCommits: number;
    publicRepos: number;
    privateRepos: number;
    followers: number;
    following: number;
    pullRequests: number;
    pushes: number;
    daysOnGithub: number;
    recentCollaborations: string[];
    aiGeneratedContent: number;
    topLanguages: { name: string; percentage: number }[];
    contributionStreak: number;
  } | null;
  leetcodeStats?: {
    username: string;
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    ranking: number;
    acceptanceRate: number;
    contestRating: number;
    totalContests: number;
    recentSubmissions: string[];
  } | null;
}

export const mockPortfolioData: PortfolioData = {
  name: "Alex Johnson",
  title: "Full Stack Developer",
  bio: "Passionate developer with 4+ years of experience building scalable web applications. Open source contributor and tech blogger.",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  email: "alex@example.com",
  location: "San Francisco, CA",
  github: "https://github.com/alexjohnson",
  linkedin: "https://linkedin.com/in/alexjohnson",
  website: "https://alexjohnson.dev",
  skills: ["React", "TypeScript", "Node.js", "Python", "PostgreSQL", "Docker", "AWS", "GraphQL", "Tailwind CSS", "Next.js"],
  experience: [
    { company: "TechCorp Inc.", role: "Senior Frontend Developer", period: "2023 - Present", description: "Leading frontend architecture for a SaaS platform serving 50K+ users." },
    { company: "StartupXYZ", role: "Full Stack Developer", period: "2021 - 2023", description: "Built core features including real-time collaboration and payment integration." },
    { company: "WebAgency", role: "Junior Developer", period: "2020 - 2021", description: "Developed responsive websites and e-commerce solutions for clients." },
  ],
  education: [{ institution: "Stanford University", degree: "B.S. Computer Science", period: "2016 - 2020" }],
  projects: [
    { name: "TaskFlow", description: "A real-time project management tool with Kanban boards and team collaboration.", tech: ["React", "Node.js", "Socket.io", "MongoDB"], stars: 234, link: "https://github.com/alexjohnson/taskflow" },
    { name: "CodeSnap", description: "Beautiful code screenshot generator with syntax highlighting and themes.", tech: ["TypeScript", "Canvas API", "Prism.js"], stars: 567, link: "https://github.com/alexjohnson/codesnap" },
    { name: "WeatherCast", description: "AI-powered weather forecasting app with interactive maps.", tech: ["Python", "FastAPI", "React", "TensorFlow"], stars: 128, link: "https://github.com/alexjohnson/weathercast" },
    { name: "DevBlog", description: "Markdown-powered blog platform with MDX support and analytics.", tech: ["Next.js", "MDX", "Vercel"], stars: 89, link: "https://github.com/alexjohnson/devblog" },
  ],
  volunteering: [{ org: "Code for Good", role: "Lead Mentor", period: "2022 - Present", description: "Mentoring underrepresented students in web development." }],
  githubStats: {
    totalCommits: 2847, publicRepos: 42, privateRepos: 15, followers: 1200, following: 180,
    pullRequests: 312, pushes: 1560, daysOnGithub: 1825,
    recentCollaborations: ["open-source/react-toolkit", "team/enterprise-dashboard", "contrib/design-system"],
    aiGeneratedContent: 3,
    topLanguages: [{ name: "TypeScript", percentage: 45 }, { name: "Python", percentage: 25 }, { name: "JavaScript", percentage: 20 }, { name: "Go", percentage: 10 }],
    contributionStreak: 47,
  },
  leetcodeStats: null,
};
