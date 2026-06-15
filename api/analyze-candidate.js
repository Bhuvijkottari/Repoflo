const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${GEMINI_KEY}`;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!GEMINI_KEY) return res.status(500).json({ error: "AI service not configured" });

  try {
    const {
      portfolioData,
      requiredTechStack,
      experienceLevel,
      selectedFields = [],
    } = req.body;

    if (!portfolioData) return res.status(400).json({ error: "No portfolio data provided" });

    const showGithub = selectedFields.includes("github");
    const showLeetcode = selectedFields.includes("leetcode");
    const showResume = selectedFields.includes("resume");

    // Build trimmed data only for enabled fields
    const trimmed = {
      name: portfolioData.name,
      title: portfolioData.title,
      bio: portfolioData.bio,
      skills: portfolioData.skills?.slice(0, 15),

      ...(showResume ? {
        experience: portfolioData.experience?.slice(0, 5),
        education: portfolioData.education?.slice(0, 3),
      } : {}),

      ...(showGithub ? {
        projects: portfolioData.projects?.slice(0, 6).map((p) => ({
          name: p.name,
          description: p.description?.substring(0, 150),
          tech: p.tech?.slice(0, 6),
          stars: p.stars,
          isAiGenerated: p.isAiGenerated,
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
      } : {}),

      ...(showLeetcode ? { leetcodeStats: portfolioData.leetcodeStats } : {}),
    };

    const enabledSources = [
      showGithub && "GitHub",
      showResume && "Resume",
      showLeetcode && "LeetCode",
    ].filter(Boolean).join(", ");

    // Detect if this is a non-IT / domain-agnostic analysis
    const isResumeOnly = showResume && !showGithub && !showLeetcode;

    const prompt = `
You are an expert recruiter${isResumeOnly ? " specializing in ALL industries including non-IT, business, healthcare, finance, law, marketing, operations, and more" : " specializing in technical hiring"}.

Analyze the candidate using ONLY these enabled sources: ${enabledSources}

CANDIDATE DATA:
${JSON.stringify(trimmed)}

${requiredTechStack?.length ? `REQUIRED SKILLS/TECH STACK: ${requiredTechStack.join(", ")}` : ""}
${experienceLevel ? `REQUIRED EXPERIENCE LEVEL: ${experienceLevel}` : ""}

STRICT RULES:
- Only evaluate data from the ENABLED SOURCES listed above.
- DO NOT penalize missing sources that were not enabled.
- ${showGithub ? "Evaluate GitHub activity, code quality, consistency, and collaboration." : "Do NOT mention GitHub. Set githubInsights to null."}
- ${showLeetcode ? "Evaluate LeetCode problem solving performance." : "Do NOT mention LeetCode. Set leetcodeInsights to null."}
- ${showResume ? "Evaluate resume: experience, education, skills, ATS compatibility." : "Do NOT generate ATS score. Set atsScore to null."}
- ${isResumeOnly ? "This may be a NON-IT candidate. Do not assume a tech background. Evaluate based on the candidate's actual domain — their role, industry, experience, and education. The primaryStack field should reflect their domain/tools (e.g. 'Marketing & Analytics', 'Finance & Excel', 'Operations Management') not programming languages." : ""}
- overallScore must reflect ONLY the enabled sources.
- Be honest and specific in strengths and concerns.

SCORING:
overallScore = 0–100

Verdict:
0–49 = DO NOT CONSIDER
50–60 = MILD CHANCE
61–70 = MODERATE
71–80 = AVERAGE
81–90 = GOOD
91–100 = EXCEPTIONAL

Return ONLY valid JSON (no markdown, no backticks):

{
  "overallScore": number,
  "verdict": "string",
  "summary": "2–3 sentences covering candidate fit",
  "strengths": ["s1","s2","s3"],
  "concerns": ["c1","c2"],
  "githubInsights": ${showGithub ? `{
    "activityLevel": "short",
    "codeQuality": "short",
    "consistency": "short",
    "collaboration": "short"
  }` : "null"},
  "leetcodeInsights": ${showLeetcode ? `{
    "problemSolvingLevel": "short",
    "difficultyBalance": "short",
    "contestPerformance": "short",
    "summary": "short"
  }` : "null"},
  "atsScore": ${showResume ? `{
    "overall": number,
    "keywordScore": number,
    "formatScore": number,
    "experienceScore": number,
    "educationScore": number,
    "skillsScore": number,
    "suggestions": ["tip1","tip2"]
  }` : "null"},
  "technicalAssessment": {
    "primaryStack": "${isResumeOnly ? "candidate domain/tools" : "tech stack"}",
    "experienceLevel": "Junior/Mid/Senior/Staff or equivalent",
    "specializations": ["a1"]
  },
  "inferredProjectDescriptions": {},
  "hiringNotes": "2 sentences max — actionable recruiter recommendation"
}
`;

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