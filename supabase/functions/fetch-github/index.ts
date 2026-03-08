import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { githubUrl } = await req.json();
    
    // Extract username from URL
    const match = githubUrl.match(/github\.com\/([^\/\?#]+)/);
    if (!match) {
      return new Response(JSON.stringify({ error: "Invalid GitHub URL" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const username = match[1];

    // Fetch GitHub profile
    const [profileRes, reposRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: { "Accept": "application/vnd.github.v3+json", "User-Agent": "PortfolioForge" },
      }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=stars&direction=desc`, {
        headers: { "Accept": "application/vnd.github.v3+json", "User-Agent": "PortfolioForge" },
      }),
      fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, {
        headers: { "Accept": "application/vnd.github.v3+json", "User-Agent": "PortfolioForge" },
      }),
    ]);

    if (!profileRes.ok) {
      return new Response(JSON.stringify({ error: `GitHub user not found: ${username}` }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const profile = await profileRes.json();
    const repos = await reposRes.json();
    const events = await eventsRes.json();

    // Calculate language stats
    const languageCounts: Record<string, number> = {};
    for (const repo of repos) {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + (repo.stargazers_count + 1);
      }
    }
    const totalLangScore = Object.values(languageCounts).reduce((a, b) => a + b, 0);
    const topLanguages = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, score]) => ({ name, percentage: Math.round((score / totalLangScore) * 100) }));

    // Calculate stats from events
    let pushCount = 0;
    let prCount = 0;
    const collaborations = new Set<string>();
    for (const event of events) {
      if (event.type === "PushEvent") pushCount++;
      if (event.type === "PullRequestEvent") prCount++;
      if (event.repo?.name && event.repo.name !== `${username}/${event.repo.name.split('/')[1]}`) {
        collaborations.add(event.repo.name);
      }
    }

    // Top projects (up to 6)
    const topProjects = repos
      .filter((r: any) => !r.fork)
      .slice(0, 6)
      .map((r: any) => ({
        name: r.name,
        description: r.description || "No description provided",
        tech: [r.language].filter(Boolean),
        stars: r.stargazers_count,
        link: r.html_url,
      }));

    // Days on GitHub
    const createdDate = new Date(profile.created_at);
    const daysOnGithub = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

    const result = {
      name: profile.name || username,
      title: profile.bio?.split('.')[0] || "Software Developer",
      bio: profile.bio || `Developer based in ${profile.location || "the world"}. Check out my work on GitHub!`,
      avatar: profile.avatar_url,
      email: profile.email || `${username}@github.com`,
      location: profile.location || "Earth",
      github: githubUrl,
      linkedin: "",
      website: profile.blog || "",
      skills: [...new Set(repos.filter((r: any) => r.language).map((r: any) => r.language))].slice(0, 10),
      projects: topProjects,
      experience: [],
      education: [],
      volunteering: [],
      githubStats: {
        totalCommits: profile.public_repos * 15, // estimate
        publicRepos: profile.public_repos,
        privateRepos: 0,
        followers: profile.followers,
        following: profile.following,
        pullRequests: prCount,
        pushes: pushCount,
        daysOnGithub,
        recentCollaborations: [...collaborations].slice(0, 5),
        aiGeneratedContent: 0,
        topLanguages,
        contributionStreak: 0,
      },
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("fetch-github error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
