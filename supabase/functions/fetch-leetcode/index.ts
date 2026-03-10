import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    let username: string | undefined;

    if (req.method === "GET") {
      // support query param for easier testing
      const url = new URL(req.url);
      username = url.searchParams.get("username") || undefined;
    } else {
      try {
        const body = await req.json();
        username = body.username;
      } catch {
        // ignore JSON parse error, will handle below
      }
    }

    if (!username) {
      return new Response(JSON.stringify({ error: "Username is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const query = `{
      matchedUser(username: "${username}") {
        username
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
        profile {
          ranking
          reputation
        }
        contestBadge {
          name
        }
      }
      userContestRanking(username: "${username}") {
        attendedContestsCount
        rating
      }
      recentAcSubmissionList(username: "${username}", limit: 5) {
        title
        titleSlug
        timestamp
      }
    }`;

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer": "https://leetcode.com",
        "User-Agent": "PortfolioForge/1.0",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("LeetCode API error:", response.status, text);
      return new Response(JSON.stringify({ error: `LeetCode API error: ${response.status}` }), {
        status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    
    if (!data?.data?.matchedUser) {
      return new Response(JSON.stringify({ error: `LeetCode user not found: ${username}` }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const user = data.data.matchedUser;
    const contest = data.data.userContestRanking;
    const recentSubs = data.data.recentAcSubmissionList || [];
    const stats = user.submitStatsGlobal?.acSubmissionNum || [];

    const easySolved = stats.find((s: any) => s.difficulty === "Easy")?.count || 0;
    const mediumSolved = stats.find((s: any) => s.difficulty === "Medium")?.count || 0;
    const hardSolved = stats.find((s: any) => s.difficulty === "Hard")?.count || 0;
    const totalSolved = stats.find((s: any) => s.difficulty === "All")?.count || (easySolved + mediumSolved + hardSolved);

    const result = {
      username: user.username,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      ranking: user.profile?.ranking || 0,
      acceptanceRate: 0,
      contestRating: Math.round(contest?.rating || 0),
      totalContests: contest?.attendedContestsCount || 0,
      recentSubmissions: recentSubs.map((s: any) => s.title),
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("fetch-leetcode error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
