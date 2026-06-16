import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const {
      portfolioData,
      requiredTechStack,
      experienceLevel,
      selectedFields = [],
    } = await req.json();

    if (!portfolioData) {
      return new Response(JSON.stringify({ error: "No portfolio data provided" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const showGithub = Array.isArray(selectedFields) && selectedFields.includes("github");
    const showResume = Array.isArray(selectedFields) && selectedFields.includes("resume");
    const showLinkedin = Array.isArray(selectedFields) && selectedFields.includes("linkedin");
    const showInstagram = Array.isArray(selectedFields) && selectedFields.includes("instagram");
    const showWebsite = Array.isArray(selectedFields) && selectedFields.includes("website");
    const showLeetcode = Array.isArray(selectedFields) && selectedFields.includes("leetcode");
    const showAptitude = Array.isArray(selectedFields) && selectedFields.includes("aptitudeScore");
    const showTechnical = Array.isArray(selectedFields) && selectedFields.includes("technicalScore");

    const enabledSources = [
      showGithub && "GitHub",
      showResume && "Resume",
      showLinkedin && "LinkedIn",
      showInstagram && "Instagram",
      showWebsite && "Portfolio Website",
      showLeetcode && "LeetCode",
      showAptitude && "Aptitude Score",
      showTechnical && "Technical Test Score",
    ].filter(Boolean).join(", ");

    const prompt = `You are an expert technical recruiter, hiring manager, and ATS (Applicant Tracking System) analyst. Analyze this candidate's profile thoroughly and provide a hiring recommendation along with an ATS score.

CANDIDATE DATA:
${JSON.stringify(portfolioData, null, 2).substring(0, 10000)}

Analyze the candidate using only enabled data sources: ${enabledSources}.

Analyze the candidate based on:
1. GitHub activity (commits, repos, languages, contribution patterns, collaboration)
2. Technical skills breadth and depth
3. Work experience relevance and progression
4. Education background
5. Project quality and impact (stars, descriptions, technologies used)
6. Overall profile completeness
7. LinkedIn signal and profile quality if a LinkedIn URL is provided
8. Portfolio website quality, UX, and technology fit if a website URL is provided
9. Aptitude and technical test scores if available
10. LeetCode performance (if available): problem-solving skills, difficulty distribution, contest participation
11. ATS Resume Analysis: evaluate the resume/profile content against typical ATS criteria including keyword density, section completeness, formatting, skills match, experience clarity
${requiredTechStack?.length ? `12. Required Tech Stack Match: The hiring team requires these technologies: ${requiredTechStack.join(", ")}. Evaluate how well the candidate's skills, projects, and experience align with these requirements. Include a "techStackMatch" field in your response with matched/missing arrays and a brief assessment.` : ""}
${experienceLevel ? `13. Experience Level Requirement: The recruiter is looking for "${experienceLevel}" level candidates. Evaluate whether this candidate fits the "${experienceLevel}" level based on their work history, project complexity, GitHub activity duration, and overall career progression. Factor this heavily into your recommendation. If the candidate doesn't match the required experience level, this should significantly impact your recommendation. Include an "experienceLevelMatch" field in your response with: { "required": "${experienceLevel}", "assessed": "the level you assess the candidate at", "isMatch": true/false, "explanation": "brief explanation" }.` : ""}

IMPORTANT for projects: If a project has "No description provided" as its description, infer what the project likely does based on its name, tech stack, and any other available context. Provide a brief inferred description.

STRICT RULES:
- Only evaluate data from the enabled sources listed above.
- DO NOT penalize missing sources that were not enabled.
- ${showGithub ? "Evaluate GitHub activity, code quality, consistency, and collaboration." : "Do NOT mention GitHub. Set githubInsights to null."}
- ${showLinkedin ? "Evaluate LinkedIn signal and profile quality. Provide a dedicated linkedinInsights section with profileStrength, activityLevel, roleAlignment, and a summary based on the available LinkedIn data." : "Do NOT mention LinkedIn. Set linkedinInsights to null."}
- ${showInstagram ? "If Instagram is enabled, evaluate the professional presence or public signal from the Instagram profile URL and return instagramInsights." : "Do NOT mention Instagram. Set instagramInsights to null."}
- ${showWebsite ? "If portfolio website is enabled, evaluate the website's presentation, technology choices, UX, and alignment with the candidate's role, and return websiteInsights." : "Do NOT mention website. Set websiteInsights to null."}
- ${showLeetcode ? "Evaluate LeetCode problem solving performance." : "Do NOT mention LeetCode. Set leetcodeInsights to null."}
- ${showAptitude || showTechnical ? "Evaluate the candidate's aptitude and/or technical test scores and provide a dedicated testScoreInsights section with detailed analysis and comparison." : "Do NOT mention test scores. Set testScoreInsights to null."}
- ${showResume ? "Evaluate resume: experience, education, skills, ATS compatibility." : "Do NOT generate ATS score. Set atsScore to null."}
- overallScore must reflect ONLY the enabled sources.
- atsScore.overall must be a separate resume/ATS fit score and should not simply copy overallScore.
- Be honest and specific in strengths and concerns.

SCORING SYSTEM (CRITICAL):
Calculate a single "overallScore" from 0 to 100 that holistically weighs ALL available data:
- GitHub activity, repos, contributions, languages, collaboration (weighted heavily)
- ATS resume analysis (keywords, format, experience clarity, education, skills)
- LeetCode performance (if available): total solved, difficulty distribution, contest rating
- LinkedIn profile signal and activity if available
- Portfolio website quality and presentation if available
- Aptitude and technical test scores if available
- Tech stack match against recruiter requirements (if provided)
- Experience level match against recruiter requirements (if provided)
- Project quality, originality, and impact
- Education and work experience

The verdict is derived STRICTLY from the overallScore:
- Below 50: "DO NOT CONSIDER" — weak candidate
- 50-60: "MILD CHANCE" — some potential but significant gaps
- 60-70: "MODERATE" — decent but not standout
- 70-80: "AVERAGE" — solid candidate worth interviewing  
- 80-90: "GOOD" — strong candidate, recommended
- 90-100: "EXCEPTIONAL" — outstanding, prioritize hiring

Return a JSON object with these EXACT fields:
{
  "overallScore": number 0-100 (this is THE key metric),
  "verdict": one of "DO NOT CONSIDER" | "MILD CHANCE" | "MODERATE" | "AVERAGE" | "GOOD" | "EXCEPTIONAL" (must match the score thresholds above),
  "atsScore": {
    "overall": number 0-100,
    "keywordScore": number 0-100,
    "formatScore": number 0-100,
    "experienceScore": number 0-100,
    "educationScore": number 0-100,
    "skillsScore": number 0-100,
    "suggestions": ["improvement1", "improvement2", "improvement3"]
  },
  "summary": "2-3 sentence executive summary of the candidate",
  "strengths": ["strength1", "strength2", "strength3", "strength4"],
  "concerns": ["concern1", "concern2"],
  "githubInsights": {
    "activityLevel": "High/Medium/Low with brief explanation",
    "codeQuality": "Assessment based on repo descriptions and tech choices",
    "consistency": "Assessment of contribution patterns",
    "collaboration": "Assessment of collaboration indicators"
  },
  "linkedinInsights": {
    "profileStrength": "assessment of LinkedIn profile completeness and professionalism if URL provided, or N/A if not provided",
    "activityLevel": "assessment of recent activity and engagement signals, or N/A if not provided",
    "roleAlignment": "how well the LinkedIn profile aligns with the target role, or N/A if not provided",
    "summary": "one-line summary of professional presence or N/A"
  },
  "instagramInsights": {
    "profileQuality": "short",
    "engagementLevel": "short",
    "professionalPresence": "short",
    "summary": "short"
  },
  "websiteInsights": {
    "websiteQuality": "short",
    "technologyUse": "short",
    "userExperience": "short",
    "summary": "short"
  },
  "testScoreInsights": {
    "aptitudeAnalysis": "detailed analysis of aptitude score if provided (e.g. 'Score of 85 shows strong analytical ability' or 'Low score of 32 suggests quantitative reasoning gaps'), or N/A if not provided",
    "technicalAnalysis": "detailed analysis of technical test score if provided, or N/A if not provided",
    "scoreComparison": "how test scores compare to GitHub/LeetCode signals if both available, or N/A"
  },
  "inferredProjectDescriptions": {
    "projectName": "inferred description for projects with no description"
  },
  "hiringNotes": "Detailed paragraph for the hiring manager with actionable insights"
}

IMPORTANT: Return ONLY valid JSON. No markdown. No explanation. Be objective and evidence-based. If LeetCode data is not available, set leetcodeInsights to null.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    let content = aiData.choices?.[0]?.message?.content || "";
    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      console.error("Failed to parse AI analysis:", content.substring(0, 500));
      return new Response(JSON.stringify({ error: "Failed to parse analysis" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-candidate error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
