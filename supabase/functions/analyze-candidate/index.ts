import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { portfolioData, requiredTechStack, experienceLevel } = await req.json();
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

    const prompt = `You are an expert technical recruiter, hiring manager, and ATS (Applicant Tracking System) analyst. Analyze this candidate's profile thoroughly and provide a hiring recommendation along with an ATS score.

CANDIDATE DATA:
${JSON.stringify(portfolioData, null, 2).substring(0, 10000)}

Analyze the candidate based on:
1. GitHub activity (commits, repos, languages, contribution patterns, collaboration)
2. Technical skills breadth and depth
3. Work experience relevance and progression
4. Education background
5. Project quality and impact (stars, descriptions, technologies used)
6. Overall profile completeness
7. LeetCode performance (if available): problem-solving skills, difficulty distribution, contest participation
8. ATS Resume Analysis: evaluate the resume/profile content against typical ATS criteria including keyword density, section completeness, formatting, skills match, experience clarity
${requiredTechStack?.length ? `9. Required Tech Stack Match: The hiring team requires these technologies: ${requiredTechStack.join(", ")}. Evaluate how well the candidate's skills, projects, and experience align with these requirements. Include a "techStackMatch" field in your response with matched/missing arrays and a brief assessment.` : ""}
${experienceLevel ? `10. Experience Level Requirement: The recruiter is looking for "${experienceLevel}" level candidates. Evaluate whether this candidate fits the "${experienceLevel}" level based on their work history, project complexity, GitHub activity duration, and overall career progression. Factor this heavily into your recommendation. If the candidate doesn't match the required experience level, this should significantly impact your recommendation. Include an "experienceLevelMatch" field in your response with: { "required": "${experienceLevel}", "assessed": "the level you assess the candidate at", "isMatch": true/false, "explanation": "brief explanation" }.` : ""}

IMPORTANT for projects: If a project has "No description provided" as its description, infer what the project likely does based on its name, tech stack, and any other available context. Provide a brief inferred description.

Return a JSON object with these EXACT fields:
{
  "recommendation": "STRONG_HIRE" or "HIRE" or "CONSIDER" or "PASS",
  "confidence": number 0-100,
  "overallScore": number 0-100,
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
  "leetcodeInsights": {
    "problemSolvingLevel": "Strong/Moderate/Beginner based on solve count and difficulty distribution",
    "difficultyBalance": "Assessment of easy/medium/hard ratio",
    "contestPerformance": "Assessment if contest data available",
    "summary": "One-line summary of competitive programming ability"
  },
  "technicalAssessment": {
    "primaryStack": "Their main technology stack",
    "experienceLevel": "Junior/Mid/Senior/Staff based on evidence",
    "specializations": ["area1", "area2"]
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
