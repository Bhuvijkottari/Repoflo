import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { fetchCandidatesByDrive, fetchDriveById, type CandidateData, type Drive } from "@/lib/firebase";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

const NavyCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-[#132f52] border border-[#3fc4e7]/20 rounded-3xl ${className}`}>
    {children}
  </div>
);

const RecruiterResultsPage = () => {
  const { driveId } = useParams<{ driveId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [drive, setDrive] = useState<Drive | null>(null);
  const [candidates, setCandidates] = useState<CandidateData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"date" | "score">("date");
  const [topFilter, setTopFilter] = useState<"all" | "top3" | "top5">("all");

  useEffect(() => {
    if (!user?.email || !driveId) return;

    const loadDriveAndCandidates = async () => {
      setIsLoading(true);
      try {
        const [driveData, driveCandidates] = await Promise.all([
          fetchDriveById(driveId),
          fetchCandidatesByDrive(user.email, driveId),
        ]);

        setDrive(driveData);
        setCandidates(driveCandidates);
      } catch (error: any) {
        toast({ title: "Load failed", description: error?.message || "Could not load candidate results.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    loadDriveAndCandidates();
  }, [user?.email, driveId, toast]);

  const sortedCandidates = useMemo(() => {
    return [...candidates].sort((a, b) => {
      if (sortBy === "score") {
        const aScore = a.analysis?.overallScore ?? -1;
        const bScore = b.analysis?.overallScore ?? -1;
        return bScore - aScore;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [candidates, sortBy]);

  const topScore = useMemo(() => {
    return sortedCandidates.reduce((max, candidate) => {
      const score = candidate.analysis?.overallScore;
      return score != null ? Math.max(max, score) : max;
    }, -1);
  }, [sortedCandidates]);

  const visibleCandidates = useMemo(() => {
    if (topFilter === "top3") return sortedCandidates.slice(0, 3);
    if (topFilter === "top5") return sortedCandidates.slice(0, 5);
    return sortedCandidates;
  }, [sortedCandidates, topFilter]);

  const openCandidate = (candidate: CandidateData) => {
    sessionStorage.setItem("portfolioData", JSON.stringify(candidate.portfolioData));
    sessionStorage.setItem("candidateId", candidate.id || "");
    if (candidate.analysis && Object.keys(candidate.analysis).length > 0) {
      sessionStorage.setItem("cachedAnalysis", JSON.stringify(candidate.analysis));
    } else {
      sessionStorage.removeItem("cachedAnalysis");
    }
    sessionStorage.setItem(
      "driveContext",
      JSON.stringify({
        driveId: driveId || "",
        requiredTechStack: candidate.requiredTechStack || [],
        experienceLevel: candidate.experienceLevel || "",
        selectedFields: candidate.selectedFields || [],
      })
    );
    if (driveId) {
      sessionStorage.setItem("recruiterDriveId", driveId);
    }
    navigate("/recruiter?preview=1");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1f3a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 rounded-full border-4 border-[#3fc4e7]/25 border-t-[#3fc4e7] animate-spin" />
          <p className="text-[#b8c7e0] text-sm font-body">Loading recruiter data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07101f] text-white pb-24">
      <div className="container mx-auto px-4 pt-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#69d2f1] font-semibold">Drive Candidate Results</p>
            <h1 className="font-display text-4xl font-bold mt-3">{drive?.driveName || "Candidate Results"}</h1>
            <p className="text-[#b8c7e0] max-w-2xl mt-3 text-sm">
              {drive ? `Showing candidates analyzed for the ${drive.role} drive. Sort by score or date, and narrow down to the top performers.` : "Select a drive to view its candidate results."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => navigate("/for-recruiters")}>Back to drives</Button>
            <Button onClick={() => navigate(`/recruiter?driveId=${driveId}`)} className="bg-gradient-to-r from-[#3fc4e7] to-[#69d2f1] text-black">
              Analyze new candidate
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div>
            <NavyCard className="p-6 mb-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-[#69d2f1] uppercase font-semibold tracking-[0.25em]">Results</p>
                  <p className="mt-2 text-sm text-[#b8c7e0]">{candidates.length} candidate{candidates.length === 1 ? "" : "s"} found</p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <Button
                    variant={sortBy === "date" ? "secondary" : "outline"}
                    className="h-12"
                    onClick={() => setSortBy("date")}
                  >
                    Newest
                  </Button>
                  <Button
                    variant={sortBy === "score" ? "secondary" : "outline"}
                    className="h-12"
                    onClick={() => setSortBy("score")}
                  >
                    Top score
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {(["all", "top3", "top5"] as const).map((filter) => (
                  <Button
                    key={filter}
                    variant={topFilter === filter ? "secondary" : "outline"}
                    className="h-10"
                    onClick={() => setTopFilter(filter)}
                  >
                    {filter === "all" ? "All" : filter === "top3" ? "Top 3" : "Top 5"}
                  </Button>
                ))}
              </div>
            </NavyCard>

            {isLoading ? (
              <NavyCard className="p-6 text-center">
                <p className="text-[#b8c7e0]">Loading candidates…</p>
              </NavyCard>
            ) : visibleCandidates.length === 0 ? (
              <NavyCard className="p-6 text-center">
                <p className="text-[#b8c7e0]">No candidates found for this drive yet.</p>
              </NavyCard>
            ) : (
              <div className="space-y-4">
                {visibleCandidates.map((candidate) => {
                  const score = candidate.analysis?.overallScore;
                  const scoreClass = score != null
                    ? score >= 80
                      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
                      : score >= 60
                        ? "text-sky-300 bg-sky-500/10 border-sky-500/25"
                        : "text-amber-300 bg-amber-500/10 border-amber-500/25"
                    : "text-[#b8c7e0] bg-[#1c324f] border-[#3fc4e7]/10";

                  return (
                    <NavyCard key={candidate.id} className="p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <div>
                            <p className="text-white font-semibold text-lg truncate">{candidate.name || candidate.githubUsername || "Unnamed Candidate"}</p>
                            <p className="text-sm text-[#b8c7e0] truncate">{candidate.githubUsername ? `@${candidate.githubUsername}` : "No GitHub provided"}</p>
                          </div>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${scoreClass}`}>
                            {score != null ? `${score}/100` : "No score"}
                          </span>
                          {score === topScore && score != null && (
                            <span className="text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-400/20 px-2 py-1">
                              Top performer
                            </span>
                          )}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#b8c7e0]">
                          <span>{new Date(candidate.createdAt).toLocaleString()}</span>
                          {candidate.leetcodeUsername && <span>LeetCode: {candidate.leetcodeUsername}</span>}
                          {candidate.linkedinUrl && <span>LinkedIn</span>}
                          {candidate.instagramUrl && <span>Instagram</span>}
                          {candidate.aptitudeScore != null && <span>Aptitude: {candidate.aptitudeScore}</span>}
                          {candidate.technicalScore != null && <span>Technical: {candidate.technicalScore}</span>}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 items-center">
                        <Button
                          className="h-11 bg-[#3fc4e7]/15 text-[#69d2f1] border-[#3fc4e7]/30"
                          onClick={() => openCandidate(candidate)}
                        >
                          View report
                        </Button>
                        <div className="text-right text-xs text-[#b8c7e0]">
                          <p>Status</p>
                          <p>{candidate.analysis ? "Analyzed" : "Pending"}</p>
                        </div>
                      </div>
                    </NavyCard>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <NavyCard className="p-6">
              <p className="font-semibold text-white">Drive summary</p>
              <div className="mt-4 space-y-3 text-sm text-[#b8c7e0]">
                <div className="flex justify-between gap-2"><span>Drive name</span><span>{drive?.driveName || "-"}</span></div>
                <div className="flex justify-between gap-2"><span>Role</span><span>{drive?.role || "-"}</span></div>
                <div className="flex justify-between gap-2"><span>Required tech</span><span>{drive?.requiredTechStack?.join(", ") || "Any"}</span></div>
                <div className="flex justify-between gap-2"><span>Experience</span><span>{drive?.experienceLevel || "Any"}</span></div>
                <div className="flex justify-between gap-2"><span>Fields</span><span>{drive?.selectedFields?.join(", ") || "None"}</span></div>
              </div>
            </NavyCard>

            <NavyCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#69d2f1] uppercase tracking-[0.25em] font-semibold">Quick tips</p>
                  <p className="text-[#b8c7e0] text-sm mt-2">Use the top score sort and top results filter to review the strongest candidate matches first.</p>
                </div>
                <div className="text-[#3fc4e7]">
                  {sortBy === "score" ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>
            </NavyCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterResultsPage;
