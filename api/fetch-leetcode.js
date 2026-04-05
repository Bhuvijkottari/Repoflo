export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Username is required" });

    const query = `{
      matchedUser(username: "${username}") {
        username
        submitStatsGlobal { acSubmissionNum { difficulty count } }
        profile { ranking }
      }
      userContestRanking(username: "${username}") { attendedContestsCount rating }
    }`;

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", Referer: "https://leetcode.com", "User-Agent": "PortfolioForge/1.0" },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) return res.status(response.status).json({ error: `LeetCode API error: ${response.status}` });

    const data = await response.json();
    if (!data?.data?.matchedUser) return res.status(404).json({ error: `LeetCode user not found: ${username}` });

    const user = data.data.matchedUser;
    const contest = data.data.userContestRanking;
    const stats = user.submitStatsGlobal?.acSubmissionNum || [];
    const easySolved = stats.find((s) => s.difficulty === "Easy")?.count || 0;
    const mediumSolved = stats.find((s) => s.difficulty === "Medium")?.count || 0;
    const hardSolved = stats.find((s) => s.difficulty === "Hard")?.count || 0;
    const totalSolved = stats.find((s) => s.difficulty === "All")?.count || (easySolved + mediumSolved + hardSolved);

    return res.json({
      username: user.username, totalSolved, easySolved, mediumSolved, hardSolved,
      ranking: user.profile?.ranking || 0, acceptanceRate: 0,
      contestRating: Math.round(contest?.rating || 0), totalContests: contest?.attendedContestsCount || 0,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Unknown error" });
  }
}
