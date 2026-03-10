import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, CheckCircle, XCircle, LogOut, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getPendingRecruiters, approveRecruiter, rejectRecruiter, RecruiterProfile } from "@/lib/firebase";
import { signOutUser } from "@/lib/firebase";

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [pendingRecruiters, setPendingRecruiters] = useState<RecruiterProfile[]>([]);
  const [loadingRecruiters, setLoadingRecruiters] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/recruiter');
      return;
    }
    loadPendingRecruiters();
  }, [user, loading, navigate]);

  const loadPendingRecruiters = async () => {
    try {
      const recruiters = await getPendingRecruiters();
      setPendingRecruiters(recruiters);
    } catch (error) {
      console.error('Error loading pending recruiters:', error);
    } finally {
      setLoadingRecruiters(false);
    }
  };

  const handleApprove = async (email: string, level: string) => {
    if (!user?.email) return;
    try {
      await approveRecruiter(email, parseInt(level) as 1 | 2 | 3, user.email);
      await loadPendingRecruiters();
    } catch (error) {
      console.error('Error approving recruiter:', error);
    }
  };

  const handleReject = async (email: string) => {
    if (!user?.email) return;
    try {
      await rejectRecruiter(email, user.email);
      await loadPendingRecruiters();
    } catch (error) {
      console.error('Error rejecting recruiter:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading || loadingRecruiters) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is admin (you can modify this logic)
  const isAdmin = user?.email === 'skanda0402@gmail.com'; // Replace with your admin email

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">Admin Access Required</h1>
          <p className="text-muted-foreground mb-6">
            You don't have administrator privileges to access this page.
          </p>
          <Button onClick={() => navigate('/recruiter')}>
            Back to Recruiter Portal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Manage recruiter approvals
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user.displayName}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-primary" />
            <h2 className="font-display text-2xl font-bold text-foreground">Pending Recruiter Approvals</h2>
          </div>
          <p className="text-muted-foreground">
            Review and approve recruiter access requests.
          </p>
        </motion.div>

        {pendingRecruiters.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground text-center">
                No pending recruiter approvals at this time.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingRecruiters.map((recruiter) => (
              <motion.div
                key={recruiter.email}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{recruiter.email}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Applied: {new Date(recruiter.lastUsed).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Assign Level:
                        </label>
                        <Select defaultValue="1">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Level 1 (10 uses)</SelectItem>
                            <SelectItem value="2">Level 2 (50 uses)</SelectItem>
                            <SelectItem value="3">Level 3 (200 uses)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={(e) => {
                            const select = e.currentTarget.parentElement?.previousElementSibling?.querySelector('select');
                            const level = select?.value || '1';
                            handleApprove(recruiter.email, level);
                          }}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleReject(recruiter.email)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;