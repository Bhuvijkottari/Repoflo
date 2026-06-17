import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";


import { useAuth } from "@/contexts/AuthContext";

import {
  fetchRecruiterHistory,
  fetchRecruiterDrives,
} from "@/lib/firebase";
const NavyCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-[#132f52] border border-[#3fc4e7]/20 rounded-3xl ${className}`}
  >
    {children}
  </div>
);

export default function DriveCandidateResults() {
  const navigate = useNavigate();
  const { driveId } = useParams();
  const { user } = useAuth();

  const [drive, setDrive] = useState<any>(null);
  const [historyEntries, setHistoryEntries] = useState<any[]>([]);
  const [historySortBy, setHistorySortBy] = useState<"date" | "score">("date");

  useEffect(() => {
    loadDrive();
    loadHistory();
  }, [user, driveId]);

  const loadDrive = async () => {
    if (!user?.email || !driveId) return;

    const drives = await fetchRecruiterDrives(user.email);

    const selectedDrive = drives.find(
      (d: any) => d.id === driveId
    );

    setDrive(selectedDrive);
  };

  const loadHistory = async () => {
    if (!user?.email || !driveId) return;

    const history = await fetchRecruiterHistory(user.email);

console.log("Drive ID from URL:", driveId);

console.log("All History:", history);

history.forEach((h) => {
  console.log(
    "Candidate:",
    h.portfolioData?.name,
    "driveId:",
    h.driveId
  );
});

    const driveCandidates = history.filter(
      (entry: any) => entry.driveId === driveId
    );
    //const driveCandidates = history;
    //const driveCandidates = history.filter(
  //(entry: any) =>
   // !entry.driveId || entry.driveId === driveId
//);

    setHistoryEntries(driveCandidates);
  };

  const sortedHistory = [...historyEntries].sort((a, b) => {
    if (historySortBy === "score") {
      const sa = a.analysis?.overallScore ?? -1;
      const sb = b.analysis?.overallScore ?? -1;
      return sb - sa;
    }

    return (
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
    );
  });

  return (
    <div className="min-h-screen bg-[#081120] px-6 py-10">
      <div className="max-w-6xl mx-auto">

        <Button
          onClick={() => navigate(-1)}
          className="mb-6"
          variant="outline"
        >
          ← Back
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white font-display">
            {drive?.driveName || "Candidate Results"}
          </h1>

          <p className="text-[#69d2f1] mt-2">
            {drive?.role}
          </p>

          <p className="text-[#b8c7e0] mt-1">
            {historyEntries.length} Candidate Analyses
          </p>
        </div>

        {historyEntries.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Sort Controls */}

            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <h2 className="font-display text-xl font-bold text-white">
                Candidates
              </h2>

              <div className="flex items-center gap-2 bg-[#132f52] border border-[#3fc4e7]/20 rounded-lg p-1">
                <button
                  onClick={() => setHistorySortBy("date")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    historySortBy === "date"
                      ? "bg-[#3fc4e7]/20 text-[#3fc4e7]"
                      : "text-[#b8c7e0] hover:text-white"
                  }`}
                >
                  Latest
                </button>

                <button
                  onClick={() => setHistorySortBy("score")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    historySortBy === "score"
                      ? "bg-[#3fc4e7]/20 text-[#3fc4e7]"
                      : "text-[#b8c7e0] hover:text-white"
                  }`}
                >
                  Highest Score
                </button>
              </div>
            </div>

            {/* Candidate Cards */}

            <div className="space-y-2">
              {sortedHistory.map((h, idx) => {
                const score = h.analysis?.overallScore;
                const verdict = h.analysis?.verdict;

                const scoreColor =
                  score >= 80
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
                    : score >= 60
                    ? "text-amber-400 bg-amber-500/10 border-amber-500/25"
                    : score != null
                    ? "text-red-400 bg-red-500/10 border-red-500/25"
                    : "text-[#b8c7e0] bg-[#b8c7e0]/10 border-[#b8c7e0]/20";

                const hasLeetcode =
                  !!h.portfolioData?.leetcodeStats;

                const hasResume =
                  h.portfolioData?.experience?.length > 0 ||
                  h.portfolioData?.education?.length > 0;

                const hasTechStack =
                  h.analysis?.techStackMatch ||
                  h.analysis?.experienceLevelMatch;

                return (
                  <NavyCard
                    key={idx}
                    className="flex items-center justify-between p-4 hover:border-[#3fc4e7]/35 transition-colors gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-white text-sm truncate">
                          {h.portfolioData?.name || "Unnamed"}
                        </p>

                        <div className="flex items-center gap-1 flex-wrap">
                          {hasLeetcode && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/25">
                              + LeetCode
                            </span>
                          )}

                          {hasResume && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#3fc4e7]/15 text-[#69d2f1] border border-[#3fc4e7]/25">
                              + Resume
                            </span>
                          )}

                          {hasTechStack && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/25">
                              + Filters
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-[#b8c7e0] mt-0.5">
                        {new Date(h.createdAt).toLocaleString()}
                      </p>

                      {verdict && (
                        <p className="text-xs text-[#b8c7e0]/60 mt-0.5 truncate">
                          {verdict}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {score != null ? (
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${scoreColor}`}
                        >
                          {score}/100
                        </span>
                      ) : (
                        <span className="text-xs text-[#b8c7e0]/40">
                          No score
                        </span>
                      )}

                      <Button
                        size="sm"
                        onClick={() => {
                          sessionStorage.setItem(
                            "portfolioData",
                            JSON.stringify(h.portfolioData)
                          );

                          if (h.analysis) {
                            sessionStorage.setItem(
                              "savedAnalysis",
                              JSON.stringify(h.analysis)
                            );
                          }

                          navigate("/recruiter?preview=1");
                        }}
                        className="bg-[#3fc4e7]/15 text-[#69d2f1] border border-[#3fc4e7]/30 hover:bg-[#3fc4e7]/25"
                      >
                        View
                      </Button>
                    </div>
                  </NavyCard>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <NavyCard className="p-8 text-center">
            <h3 className="text-white text-xl font-bold mb-2">
              No Candidates Yet
            </h3>

            <p className="text-[#b8c7e0]">
              No candidate analyses found for this drive.
            </p>
          </NavyCard>
        )}
      </div>
    </div>
  );
}