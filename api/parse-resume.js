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

    let parsedGithub = {};
    try {
      const gd = Array.isArray(fields.githubData) ? fields.githubData[0] : fields.githubData;
      parsedGithub = JSON.parse(gd || "{}");
    } catch {}

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

    const textPrompt = `You are a resume parser. If NOT a resume, reply: {"error":"not_a_resume","reason":"..."}

GITHUB DATA: ${JSON.stringify(parsedGithub).substring(0, 2000)}

Extract and return ONLY valid JSON:
{"name":"Full Name","title":"Title","bio":"1-2 sentence bio","email":"email","phone":"phone if found","location":"City","linkedin":"url","website":"url","skills":["up to 12"],"experience":[{"company":"","role":"","period":"","description":""}],"education":[{"institution":"","degree":"","period":""}],"volunteering":[{"org":"","role":"","period":"","description":""}],"projects":[{"name":"","description":"","tech":[],"stars":0,"link":""}]}`;

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

    const github = parsedGithub;
    if (parsed.name && github.name) {
      const clean = (s) => s.toLowerCase().replace(/[^a-z]/g, "");
      const gWords = (github.name + " " + (github.github || "")).split(/[\s\/]+/).map(clean).filter((w) => w.length >= 3);
      const rWords = parsed.name.split(/\s+/).map(clean).filter((w) => w.length >= 3);
      const match = gWords.some((gw) => rWords.some((rw) => gw === rw || gw.includes(rw) || rw.includes(gw)));
      if (!match)
        return res.status(400).json({ error: `Name mismatch: GitHub "${github.name}" vs resume "${parsed.name}". Please check they are the same person.` });
    }

    return res.json({
      name: parsed.name || github.name || "Developer",
      title: parsed.title || github.title || "Software Developer",
      bio: parsed.bio || github.bio || "",
      avatar: github.avatar || "",
      email: parsed.email || github.email || "",
      phone: parsed.phone || "",
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
    });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Unknown error" });
  }
}
