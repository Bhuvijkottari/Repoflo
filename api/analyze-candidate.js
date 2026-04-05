const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${GEMINI_KEY}`;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!GEMINI_KEY) return res.status(500).json({ error: "AI service not configured" });

  try {
    const { portfolioData, requiredTechStack, experienceLevel } = req.body;
    if (!portfolioData) return res.status(400).json({ error: "No portfolio data provided" });

    const trimmed = {
      name: portfolioData.name, title: portfolioData.title, bio: portfolioData.bio,
      skills: portfolioData.skills?.slice(0, 15),
      experience: portfolioData.experience?.slice(0, 5),
      education: portfolioData.education?.slice(0, 3),
      projects: portfolioData.projects?.slice(0, 6).map((p) => ({
        name: p.name, description: p.description?.substring(0, 150),
        tech: p.tech?.slice(0, 6), stars: p.stars, isAiGenerated: p.isAiGenerated,
      })),
      githubStats: portfolioData.githubStats ? {
        totalCommits: portfolioData.githubStats.totalCommits,
        publicRepos: portfolioData.githubStats.publicRepos,
        followers: portfolioData.githubStats.followers,
        pullRequests: portfolioData.githubStats.pullRequests,
        contributionStreak: portfolioData.githubStats.contributionStreak,
        topLanguages: portfolioData.githubStats.topLanguages?.slice(0, 5),
        aiGeneratedContent: portfolioData.githubStats.aiGeneratedContent,
        daysOnGithub: portfolioData.githubStats.daysOnGithub,
      } : null,
      leetcodeStats: portfolioData.leetcodeStats,
    };

    const prompt = `You are a technical recruiter. Analyze this candidate and return compact JSON.

CANDIDATE: ${JSON.stringify(trimmed)}
${requiredTechStack?.length ? `REQUIRED TECH: ${requiredTechStack.join(", ")}` : ""}
${experienceLevel ? `REQUIRED LEVEL: ${experienceLevel}` : ""}

SCORING: overallScore 0-100. Verdict must match score:
<50=DO NOT CONSIDER, 50-60=MILD CHANCE, 60-70=MODERATE, 70-80=AVERAGE, 80-90=GOOD, 90-100=EXCEPTIONAL

Return ONLY compact JSON (short text fields, max 15 words each):
{"overallScore":number,"verdict":"string","atsScore":{"overall":number,"keywordScore":number,"formatScore":number,"experienceScore":number,"educationScore":number,"skillsScore":number,"suggestions":["tip1","tip2"]},"summary":"1-2 sentences","strengths":["s1","s2","s3"],"concerns":["c1","c2"],"githubInsights":{"activityLevel":"short","codeQuality":"short","consistency":"short","collaboration":"short"},"leetcodeInsights":{"problemSolvingLevel":"short","difficultyBalance":"short","contestPerformance":"short","summary":"short"},"technicalAssessment":{"primaryStack":"stack","experienceLevel":"Junior/Mid/Senior/Staff","specializations":["a1"]},"inferredProjectDescriptions":{},"hiringNotes":"2 sentence max"}`;

    const aiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 1500 },
      }),
    });

    if (!aiRes.ok) {
      const err = await aiRes.text();
      return res.status(503).json({ error: `AI error ${aiRes.status}: ${err.substring(0, 100)}` });
    }

    const aiData = await aiRes.json();
    let content = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let parsed;
    try { parsed = JSON.parse(content); }
    catch { return res.status(500).json({ error: "Failed to parse analysis" }); }

    return res.json(parsed);
  } catch (e) {
    return res.status(500).json({ error: e.message || "Unknown error" });
  }
}
