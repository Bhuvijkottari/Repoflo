const fetch = require("node-fetch");
const cheerio = require("cheerio");

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { url, type } = req.body;
  if (!url) return res.status(400).json({ error: "URL required" });

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        // Pretend to be a real browser so sites don't block us
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to fetch page (${response.status})`,
        blocked: response.status === 403 || response.status === 401,
      });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove script, style, nav, footer — we only want content
    $("script, style, nav, footer, header, noscript, iframe, svg, [aria-hidden='true']").remove();

    // Extract meaningful text
    const title = $("title").text().trim();
    const metaDesc = $("meta[name='description']").attr("content") || "";
    const ogTitle = $("meta[property='og:title']").attr("content") || "";
    const ogDesc = $("meta[property='og:description']").attr("content") || "";

    // Get body text, collapse whitespace
    const bodyText = $("body").text()
      .replace(/\s+/g, " ")
      .replace(/\n+/g, " ")
      .trim()
      .slice(0, 4000); // Limit to 4000 chars to not overflow Gemini

    // For Instagram — try to get username and bio from meta tags
    // Instagram renders client-side so we mainly get meta tags
    let instagramData = null;
    if (type === "instagram") {
      const username = url.match(/instagram\.com\/([A-Za-z0-9._-]+)/)?.[1] || "";
      const bio = ogDesc || metaDesc || "";
      const name = ogTitle?.replace(" • Instagram", "").replace(" (@", " (").split("(")?.[0]?.trim() || "";
      instagramData = { username, name, bio, title: ogTitle };
    }

    // For website — extract structured content
    let websiteData = null;
    if (type === "website") {
      const headings = [];
      $("h1, h2, h3").each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 2 && text.length < 200) headings.push(text);
      });

      const paragraphs = [];
      $("p").each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 30) paragraphs.push(text.slice(0, 300));
      });

      websiteData = {
        title,
        metaDescription: metaDesc || ogDesc,
        headings: headings.slice(0, 10),
        content: paragraphs.slice(0, 8).join(" | "),
        fullText: bodyText,
      };
    }

    return res.json({
      success: true,
      type,
      url,
      title,
      metaDescription: metaDesc || ogDesc,
      bodyText,
      instagramData,
      websiteData,
    });

  } catch (e: any) {
    if (e.name === "AbortError") {
      return res.status(408).json({ error: "Page took too long to load (timeout)" });
    }
    return res.status(500).json({ error: e.message || "Failed to fetch URL" });
  }
}