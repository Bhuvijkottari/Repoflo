export interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  email: string;
  phone?: string;
  currentOccupation?: string;
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
    aiDetectedRepos?: string[];
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
    aiDetectedRepos: ["portfolio-clone", "todo-app", "ai-dashboard"],
    topLanguages: [{ name: "TypeScript", percentage: 45 }, { name: "Python", percentage: 25 }, { name: "JavaScript", percentage: 20 }, { name: "Go", percentage: 10 }],
    contributionStreak: 47,
  },
  leetcodeStats: null,
};

// Rich dummy data for theme previews
export const dummyPreviewData: PortfolioData = {
  name: "Alex Rivera",
  title: "Full Stack Engineer",
  bio: "Passionate engineer with 5+ years building scalable products. I love clean code, great UX, and shipping things that matter. Open source contributor and occasional tech blogger.",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlexRivera",
  email: "alex@example.dev",
  location: "San Francisco, CA",
  github: "https://github.com/alexrivera",
  linkedin: "https://linkedin.com/in/alexrivera",
  website: "https://alexrivera.dev",
  skills: ["TypeScript", "React", "Node.js", "Python", "PostgreSQL", "Docker", "AWS", "GraphQL", "Next.js", "Tailwind CSS", "Redis", "Kubernetes"],
  experience: [
    { company: "Stripe", role: "Senior Software Engineer", period: "2022 - Present", description: "Leading the developer experience team, building APIs used by 500K+ developers worldwide. Improved SDK performance by 40% and reduced integration time by half." },
    { company: "Vercel", role: "Software Engineer", period: "2020 - 2022", description: "Built core features for the edge network platform serving 10B+ requests/month. Contributed to open-source Next.js codebase with 10+ merged PRs." },
    { company: "Startup Lab", role: "Frontend Engineer", period: "2019 - 2020", description: "Developed responsive web applications for 8 client projects. Established the component library adopted by the entire team." },
  ],
  education: [
    { institution: "UC Berkeley", degree: "B.S. Electrical Engineering & CS", period: "2015 - 2019" },
  ],
  projects: [
    { name: "OpenFlow", description: "A real-time collaborative code editor supporting 20+ languages with sub-100ms sync. Used by 3,000+ developers in beta.", tech: ["React", "WebSockets", "Node.js", "Redis"], stars: 1240, link: "#" },
    { name: "Prism UI", description: "Accessible component library for React with full TypeScript support, dark mode, and 60+ components. 8K+ weekly npm downloads.", tech: ["TypeScript", "React", "Storybook", "CSS"], stars: 892, link: "#" },
    { name: "DataPulse", description: "AI-powered analytics dashboard that auto-generates insights from your database. Connects to Postgres, MySQL, and BigQuery.", tech: ["Python", "FastAPI", "React", "OpenAI"], stars: 534, link: "#" },
    { name: "DevPod", description: "Instant cloud development environments that spin up in under 5 seconds. Built on Docker and Kubernetes.", tech: ["Go", "Docker", "K8s", "TypeScript"], stars: 310, link: "#" },
  ],
  volunteering: [
    { org: "Code for America", role: "Technical Lead Volunteer", period: "2021 - Present", description: "Leading a team of 6 engineers building tools to improve access to public benefits for low-income families." },
  ],
  githubStats: {
    totalCommits: 3241, publicRepos: 48, privateRepos: 12, followers: 2100, following: 340,
    pullRequests: 428, pushes: 1820, daysOnGithub: 2190,
    recentCollaborations: ["vercel/next.js", "stripe/stripe-node", "tailwindlabs/tailwindcss"],
    aiGeneratedContent: 1,
    aiDetectedRepos: ["demo-app"],
    topLanguages: [{ name: "TypeScript", percentage: 48 }, { name: "Python", percentage: 28 }, { name: "Go", percentage: 14 }, { name: "Rust", percentage: 10 }],
    contributionStreak: 63,
  },
  leetcodeStats: null,
};
