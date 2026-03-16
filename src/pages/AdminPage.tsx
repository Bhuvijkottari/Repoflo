import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, CheckCircle, XCircle, LogOut, Users, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  signInWithGoogle,
  getPendingRecruiters,
  getApprovedRecruiters,
  approveRecruiter,
  rejectRecruiter,
  createRecruiter,
  updateRecruiter,
  updateRecruiterEmail,
  deleteRecruiter,
  RecruiterProfile,
} from "@/lib/firebase";
import { signOutUser } from "@/lib/firebase";

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [pendingRecruiters, setPendingRecruiters] = useState<RecruiterProfile[]>([]);
  const [approvedRecruiters, setApprovedRecruiters] = useState<RecruiterProfile[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<Record<string, string>>({});
  const [editedEmails, setEditedEmails] = useState<Record<string, string>>({});
  const [newRecruiterEmail, setNewRecruiterEmail] = useState("");
  const [newRecruiterLevel, setNewRecruiterLevel] = useState("1");
  const [loadingRecruiters, setLoadingRecruiters] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      setLoadingRecruiters(false);
      return;
    }
    if (user) {
      loadRecruiters();
    }
  }, [user, loading]);

  const handleAdminSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Admin login failed:', err);
      setError('Failed to sign in.');
    }
  };

  const loadRecruiters = async () => {
    setLoadingRecruiters(true);
    try {
      const [pending, approved] = await Promise.all([getPendingRecruiters(), getApprovedRecruiters()]);
      setPendingRecruiters(pending);
      setApprovedRecruiters(approved);
      const levelMap: Record<string, string> = {};
      [...pending, ...approved].forEach((r) => {
        levelMap[r.email] = String(r.level || 1);
      });
      setSelectedLevels(levelMap);
      const emailMap: Record<string, string> = {};
      approved.forEach((r) => {
        emailMap[r.email] = r.email;
      });
      setEditedEmails(emailMap);
    } catch (error) {
      console.error('Error loading recruiters:', error);
      setError('Could not load recruiters.');
    } finally {
      setLoadingRecruiters(false);
    }
  };

  const handleApprove = async (email: string) => {
    if (!user?.email) return;
    const levelString = selectedLevels[email] || '1';
    try {
      await approveRecruiter(email, parseInt(levelString) as 1 | 2 | 3, user.email);
      await loadRecruiters();
    } catch (err) {
      console.error('Error approving recruiter:', err);
      setError('Could not approve recruiter.');
    }
  };

  const handleReject = async (email: string) => {
    if (!user?.email) return;
    try {
      await rejectRecruiter(email, user.email);
      await loadRecruiters();
    } catch (err) {
      console.error('Error rejecting recruiter:', err);
      setError('Could not reject recruiter.');
    }
  };

  const handleAddRecruiter = async () => {
    if (!user?.email) return;
    const email = newRecruiterEmail.trim().toLowerCase();
    if (!email) {
      setError('Please enter an email.');
      return;
    }
    try {
      await createRecruiter(email, parseInt(newRecruiterLevel) as 1 | 2 | 3, 'approved');
      setNewRecruiterEmail('');
      setNewRecruiterLevel('1');
      await loadRecruiters();
    } catch (err) {
      console.error('Error adding recruiter:', err);
      setError('Could not add recruiter.');
    }
  };

  const handleUpdateRecruiter = async (oldEmail: string) => {
    if (!user?.email) return;
    const targetEmail = editedEmails[oldEmail]?.trim().toLowerCase() || oldEmail;
    const level = parseInt(selectedLevels[oldEmail] || selectedLevels[targetEmail] || '1') as 1 | 2 | 3;
    try {
      if (targetEmail !== oldEmail) {
        await updateRecruiterEmail(oldEmail, targetEmail);
      }
      await updateRecruiter(targetEmail, { level });
      await loadRecruiters();
    } catch (err) {
      console.error('Error updating recruiter:', err);
      setError('Could not update recruiter.');
    }
  };

  const handleDeleteRecruiter = async (email: string) => {
    if (!user?.email) return;
    try {
      await deleteRecruiter(email);
      await loadRecruiters();
    } catch (err) {
      console.error('Error deleting recruiter:', err);
      setError('Could not delete recruiter.');
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
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-200">Loading...</p>
        </div>
      </div>
    );
  }

  const isAdmin =
    user?.email === 'skanda0402@gmail.com' ||
    user?.email === 'cadithya110@gmail.com' ||
    user?.email === 'bhuvijkottari@gmail.com';

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 rounded-xl border border-slate-700 bg-slate-900/80">
          <Shield className="w-16 h-16 text-cyan-300 mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-slate-100 mb-4">Admin Login</h1>
          <p className="text-slate-300 mb-6">Sign in with your admin Google account to access the dashboard.</p>
          <Button className="w-full" onClick={handleAdminSignIn}>
            <LogIn className="w-4 h-4 mr-2" /> Sign in with Google
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 rounded-xl border border-slate-700 bg-slate-900/80">
          <Shield className="w-16 h-16 text-cyan-300 mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-slate-100 mb-4">Admin Access Required</h1>
          <p className="text-slate-300 mb-6">
            You don't have administrator privileges to access this page.
          </p>
          <Button onClick={() => navigate('/recruiter')}>Back to Recruiter Portal</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-xl font-bold text-slate-100">Admin Dashboard</h1>
              <p className="text-sm text-slate-300">Manage recruiter approvals</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-100">{user?.displayName}</p>
                <p className="text-xs text-slate-300">{user?.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive">{error}</div>
        )}

        <Card className="bg-slate-900/80 border border-slate-700 text-slate-100">
          <CardHeader>
            <CardTitle className="text-slate-100">Add Active Recruiter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Input
                value={newRecruiterEmail}
                onChange={(e) => setNewRecruiterEmail(e.target.value)}
                placeholder="recruiter@example.com"
                className="w-full md:w-2/4"
              />
              <div className="w-32">
                <Select value={newRecruiterLevel} onValueChange={(value) => setNewRecruiterLevel(value)}>
                  <SelectTrigger className="w-full bg-slate-800 text-slate-100 border border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Level 1</SelectItem>
                    <SelectItem value="2">Level 2</SelectItem>
                    <SelectItem value="3">Level 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddRecruiter}>Add Recruiter</Button>
            </div>
          </CardContent>
        </Card>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-cyan-300" />
            <h2 className="font-display text-2xl font-bold text-slate-100">Pending Recruiter Approvals</h2>
          </div>

          {pendingRecruiters.length === 0 ? (
            <Card className="bg-slate-900/80 border border-slate-700 text-slate-100">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="w-12 h-12 text-emerald-400 mb-4" />
                <h3 className="font-display text-lg font-semibold text-slate-100 mb-2">All Caught Up!</h3>
                <p className="text-slate-300 text-center">
                  No pending recruiter approvals at this time.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingRecruiters.map((recruiter) => (
                <Card key={recruiter.email} className="bg-slate-900 border border-slate-700 text-slate-100">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{recruiter.email}</CardTitle>
                        <p className="text-sm text-slate-300">
                          Applied: {new Date(recruiter.lastUsed).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3 items-end">
                      <div>
                        <label className="text-sm font-medium text-slate-100 mb-1 inline-block">Assign Level</label>
                        <Select
                          value={selectedLevels[recruiter.email] ?? '1'}
                          onValueChange={(value) =>
                            setSelectedLevels((prev) => ({ ...prev, [recruiter.email]: value }))
                          }
                        >
                          <SelectTrigger className="w-32 bg-slate-800 text-slate-100 border border-slate-600">
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
                        <Button variant="default" size="sm" onClick={() => handleApprove(recruiter.email)}>
                          <CheckCircle className="w-4 h-4 mr-1" /> Approve
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleReject(recruiter.email)}>
                          <XCircle className="w-4 h-4 mr-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-primary" />
            <h2 className="font-display text-2xl font-bold text-slate-100">Active Recruiters</h2>
          </div>

          {approvedRecruiters.length === 0 ? (
            <Card className="bg-slate-900 border border-slate-700 text-slate-100">
              <CardContent className="py-6 text-center">
                <p className="text-slate-300">No active recruiters yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {approvedRecruiters.map((recruiter) => {
                const currentEmail = recruiter.email;
                return (
                  <Card key={currentEmail} className="bg-slate-900 border border-slate-700 text-slate-100">
                    <CardContent className="grid grid-cols-1 gap-2 md:grid-cols-2 md:items-end">
                      <div className="space-y-1 p-5">
                        <p className="text-xs text-slate-300">Email</p>
                        <Input
                          value={editedEmails[currentEmail] ?? currentEmail}
                          onChange={(e) =>
                            setEditedEmails((prev) => ({ ...prev, [currentEmail]: e.target.value }))
                          }
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-300">Level</p>
                        <Select
                          value={selectedLevels[currentEmail] ?? String(recruiter.level)}
                          onValueChange={(value) =>
                            setSelectedLevels((prev) => ({ ...prev, [currentEmail]: value }))
                          }
                        >
                          <SelectTrigger className="w-full md:w-40 bg-slate-800 text-slate-100 border border-slate-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Level 1</SelectItem>
                            <SelectItem value="2">Level 2</SelectItem>
                            <SelectItem value="3">Level 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2 md:col-span-2">
                        <Button variant="default" size="sm" onClick={() => handleUpdateRecruiter(currentEmail)}>
                          Save
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteRecruiter(currentEmail)}>
                          Delete
                        </Button>
                        <Badge variant="secondary" className="ml-auto">
                          {recruiter.usageCount ?? 0} uses
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPage;
