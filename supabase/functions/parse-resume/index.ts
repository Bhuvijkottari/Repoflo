import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESUME_KEYWORDS = [
  "education", "experience", "skills", "projects", "work", "employment",
  "objective", "summary", "certifications", "achievements", "awards",
  "professional", "qualification", "internship", "training", "references",
  "academic", "university", "college", "degree", "bachelor", "master",
  "responsibilities", "accomplishments", "volunteer", "coursework",
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File;
    const githubData = formData.get("githubData") as string;

    if (!file) {
      return new Response(JSON.stringify({ error: "No resume file provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const fileBytes = new Uint8Array(await file.arrayBuffer());
    const base64Content = base64Encode(fileBytes);

    const fileName = file.name.toLowerCase();
    let mimeType = "application/octet-stream";
    if (fileName.endsWith(".pdf")) mimeType = "application/pdf";
    else if (fileName.endsWith(".doc")) mimeType = "application/msword";
    else if (fileName.endsWith(".docx")) mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    else if (fileName.endsWith(".txt")) mimeType = "text/plain";

    // For text files, validate content directly
    if (mimeType === "text/plain") {
      const textContent = new TextDecoder().decode(fileBytes).toLowerCase();
      const matchCount = RESUME_KEYWORDS.filter(k => textContent.includes(k)).length;
      if (matchCount < 2) {
        return new Response(JSON.stringify({ 
          error: "The uploaded file does not appear to be a resume. Please upload a file containing sections like Education, Experience, Skills, or Projects." 
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    let parsedGithub = {};
    try {
      parsedGithub = githubData ? JSON.parse(githubData) : {};
    } catch {}

    const textPrompt = `You are a resume parser. First, determine if this document is actually a resume/CV.

STEP 1 - VALIDATION:
Check if the document contains typical resume sections such as: Education, Experience, Skills, Projects, Work History, Certifications, Summary, Objective, etc.
If this is NOT a resume (e.g., it's a receipt, invoice, random document, article, etc.), respond with ONLY this JSON:
{"error": "not_a_resume", "reason": "Brief explanation of what the document appears to be"}

STEP 2 - If it IS a resume, extract structured information and merge with GitHub data.

GITHUB DATA (merge with resume data, prefer resume for experience/education, prefer github for projects/skills):
${JSON.stringify(parsedGithub).substring(0, 3000)}

Return a JSON object with these exact fields:
{
  "name": "Full Name",
  "title": "Professional Title",
  "bio": "Short professional bio (1-2 sentences)",
  "email": "email@example.com",
  "location": "City, State",
  "linkedin": "linkedin url if found",
  "website": "personal website if found",
  "skills": ["skill1", "skill2", ...up to 12 skills],
  "experience": [{"company": "Company", "role": "Role Title", "period": "2020 - 2023", "description": "Brief description"}],
  "education": [{"institution": "University", "degree": "Degree Name", "period": "2016 - 2020"}],
  "volunteering": [{"org": "Organization", "role": "Role", "period": "2020 - Present", "description": "Brief description"}],
  "projects": [{"name": "Project", "description": "Description", "tech": ["Tech1"], "stars": 0, "link": "url"}]
}

IMPORTANT: Return ONLY valid JSON, no markdown, no explanation.`;

    const messages = [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64Content}`,
            },
          },
          {
            type: "text",
            text: textPrompt,
          },
        ],
      },
    ];

    console.log("Sending multimodal request to AI with file type:", mimeType, "size:", fileBytes.length);

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI processing failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    let content = aiData.choices?.[0]?.message?.content || "";
    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    console.log("AI response content (first 500 chars):", content.substring(0, 500));

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Failed to parse resume data" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if AI determined it's not a resume
    if (parsed.error === "not_a_resume") {
      return new Response(JSON.stringify({ 
        error: `The uploaded file does not appear to be a resume. ${parsed.reason || "Please upload a valid resume document containing sections like Education, Experience, Skills, or Projects."}` 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const github = parsedGithub as any;

    // Name matching validation: check if GitHub name and resume name share at least one word
    const githubName = (github.name || "").toLowerCase().trim();
    const resumeName = (parsed.name || "").toLowerCase().trim();
    if (githubName && resumeName) {
      const githubWords = githubName.split(/\s+/).filter((w: string) => w.length > 1);
      const resumeWords = resumeName.split(/\s+/).filter((w: string) => w.length > 1);
      const hasMatch = githubWords.some((gw: string) => resumeWords.some((rw: string) => gw === rw || gw.includes(rw) || rw.includes(gw)));
      if (!hasMatch) {
        return new Response(JSON.stringify({ 
          error: `Name mismatch detected. GitHub profile name "${github.name}" does not match resume name "${parsed.name}". Please ensure the resume belongs to the same person as the GitHub profile.`
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const result = {
      name: parsed.name || github.name || "Developer",
      title: parsed.title || github.title || "Software Developer",
      bio: parsed.bio || github.bio || "",
      avatar: github.avatar || "",
      email: parsed.email || github.email || "",
      location: parsed.location || github.location || "",
      github: github.github || "",
      linkedin: parsed.linkedin || github.linkedin || "",
      website: parsed.website || github.website || "",
      skills: parsed.skills?.length ? parsed.skills : github.skills || [],
      experience: parsed.experience?.length ? parsed.experience : github.experience || [],
      education: parsed.education?.length ? parsed.education : github.education || [],
      volunteering: parsed.volunteering?.length ? parsed.volunteering : github.volunteering || [],
      projects: parsed.projects?.length ? parsed.projects : github.projects || [],
      githubStats: github.githubStats || null,
    };

    console.log("Result experience count:", result.experience.length, "education count:", result.education.length);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("parse-resume error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
