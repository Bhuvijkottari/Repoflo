import formidable from "formidable";
import { readFileSync } from "fs";

export const config = { api: { bodyParser: false } };

const RESUME_KEYWORDS = ["experience","education","skills","projects","work history","certifications","summary","objective","employment","university","college","degree","bachelor","master"];
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${GEMINI_KEY}`;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!GEMINI_KEY) return res.status(500).json({ error: "AI service not configured" });

  try {
    const form = formidable({ maxFileSize: 20 * 1024 * 1024 });
    const [fields, files] = await form.parse(req);

    const file = Array.isArray(files.resume) ? files.resume[0] : files.resume;
    if (!file) return res.status(400).json({ error: "No resume file provided" });

    // githubData is optional — resume-only drives won't send it
    let parsedGithub = {};
    try {
      const gd = Array.isArray(fields.githubData) ? fields.githubData[0] : fields.githubData;
      parsedGithub = JSON.parse(gd || "{}");
    } catch {}

    // Whether GitHub data is actually present (for resume-only drives it won't be)
    const hasGithub = !!(parsedGithub && parsedGithub.githubStats);

    const fileBuffer = readFileSync(file.filepath);
    const fileName = (file.originalFilename || "").toLowerCase();
    let mimeType = file.mimetype || "application/pdf";
    if (fileName.endsWith(".pdf")) mimeType = "application/pdf";
    else if (fileName.endsWith(".txt")) mimeType = "text/plain";

    if (mimeType === "text/plain") {
      const text = fileBuffer.toString("utf8").toLowerCase();
      if (!RESUME_KEYWORDS.some((k) => text.includes(k)))
        return res.status(400).json({ error: "This doesn't appear to be a resume." });
    }

    const base64Content = fileBuffer.toString("base64");

    const textPrompt = `You are a resume parser that works for ALL industries — IT, Non-IT, business, healthcare, finance, law, marketing, operations, and any other field.

If this is NOT a resume at all, reply only: {"error":"not_a_resume","reason":"..."}

${hasGithub ? `GITHUB DATA (for cross-referencing): ${JSON.stringify(parsedGithub).substring(0, 2000)}` : ""}

Extract ALL information from the resume as-is. Do NOT assume a tech background.
For the "title" field, use whatever professional title the candidate holds (e.g. "Marketing Manager", "Financial Analyst", "Registered Nurse", "Software Engineer").
For "skills", extract the actual skills listed — these may be soft skills, tools, domain knowledge, not just programming languages.

Return ONLY valid JSON:
{
  "name": "Full Name",
  "title": "Their actual job title from resume",
  "bio": "1-2 sentence professional summary from resume",
  "email": "email if found",
  "phone": "phone if found",
  "location": "City, Country if found",
  "linkedin": "linkedin url if found",
  "website": "website if found",
  "skills": ["up to 15 skills — domain-appropriate, not just programming"],
  "experience": [{"company": "", "role": "", "period": "", "description": ""}],
  "education": [{"institution": "", "degree": "", "period": ""}],
  "volunteering": [{"org": "", "role": "", "period": "", "description": ""}],
  "projects": [{"name": "", "description": "", "tech": [], "stars": 0, "link": ""}]
}`;

    const aiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ inlineData: { mimeType, data: base64Content } }, { text: textPrompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
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
    catch { return res.status(500).json({ error: "Failed to parse resume data" }); }

    if (parsed.error === "not_a_resume")
      return res.status(400).json({ error: `Not a resume: ${parsed.reason}` });

    return res.json({
      // Identity — resume always wins; fall back to github only if github is enabled
      name: parsed.name || parsedGithub.name || "",
      title: parsed.title || (hasGithub ? parsedGithub.title : "") || "",
      bio: parsed.bio || (hasGithub ? parsedGithub.bio : "") || "",
      avatar: parsedGithub.avatar || "",
      email: parsed.email || parsedGithub.email || "",
      phone: parsed.phone || "",
      location: parsed.location || parsedGithub.location || "",
      github: parsedGithub.github || "",
      linkedin: parsed.linkedin || parsedGithub.linkedin || "",
      website: parsed.website || parsedGithub.website || "",
      // Skills — resume wins; github fallback only if github is enabled
      skills: parsed.skills?.length ? parsed.skills : (hasGithub ? parsedGithub.skills : []) || [],
      experience: parsed.experience?.length ? parsed.experience : (hasGithub ? parsedGithub.experience : []) || [],
      education: parsed.education?.length ? parsed.education : (hasGithub ? parsedGithub.education : []) || [],
      volunteering: parsed.volunteering?.length ? parsed.volunteering : [],
      // Projects — only pull from github if github is enabled
      projects: parsed.projects?.length ? parsed.projects : (hasGithub ? parsedGithub.projects : []) || [],
      githubStats: parsedGithub.githubStats || null,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Unknown error" });
  }
}