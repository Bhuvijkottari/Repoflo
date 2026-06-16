import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, doc, updateDoc, increment, getDoc, setDoc, onSnapshot, where, deleteDoc, runTransaction } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Feedback functions
export async function submitFeedback(name: string, rating: number, message: string) {
  return addDoc(collection(db, "feedbacks"), {
    name,
    rating,
    message,
    created_at: new Date().toISOString(),
  });
}

export async function fetchFeedbacks(maxItems = 20) {
  const q = query(collection(db, "feedbacks"), orderBy("created_at", "desc"), limit(maxItems));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Array<{
    id: string;
    name: string;
    rating: number;
    message: string;
    created_at: string;
  }>;
}

// Real-time feedback listener
export function subscribeFeedbacks(
  maxItems: number,
  callback: (feedbacks: Array<{ id: string; name: string; rating: number; message: string; created_at: string }>) => void
) {
  const q = query(collection(db, "feedbacks"), orderBy("created_at", "desc"), limit(maxItems));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Array<{
      id: string;
      name: string;
      rating: number;
      message: string;
      created_at: string;
    }>;
    callback(data);
  });
}

// Visitor counter functions

export async function incrementVisitorCount(): Promise<number> {
  const ref = doc(db, "site_stats", "visitors");
  try {
    // Atomic transaction: read current count, increment, return new value
    const newCount = await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(ref);
      const current = snap.exists() ? (snap.data().count || 0) : 0;
      const updated = current + 1;
      transaction.set(ref, { count: updated }, { merge: true });
      return updated;
    });
    return newCount;
  } catch (err) {
    console.warn("Visitor counter transaction error:", err);
    // Fallback: try non-transactional increment
    try {
      await setDoc(ref, { count: increment(1) }, { merge: true });
      const snap = await getDoc(ref);
      return snap.exists() ? (snap.data().count || 1) : 1;
    } catch {
      return 0;
    }
  }
}

export async function getVisitorCount(): Promise<number> {
  try {
    const ref = doc(db, "site_stats", "visitors");
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data().count || 0) : 0;
  } catch {
    return 0;
  }
}

// Auth functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error("Error signing in with Google:", error);
    if (error.code === 'auth/configuration-not-found') {
      throw new Error('Google Sign-In is not configured in Firebase. Please enable it in the Firebase Console.');
    }
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Recruiter functions
export interface RecruiterProfile {
  email: string;
  level: 1 | 2 | 3;
  usageCount: number;
  lastUsed: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
}

export const getRecruiterProfile = async (email: string): Promise<RecruiterProfile | null> => {
  try {
    const ref = doc(db, "recruiters", email);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data() as RecruiterProfile;
    }
    return null;
  } catch (error) {
    console.error("Error getting recruiter profile:", error);
    return null;
  }
};

export const createRecruiterProfile = async (email: string): Promise<RecruiterProfile> => {
  const profile: RecruiterProfile = {
    email,
    level: 1, // Default level
    usageCount: 0,
    lastUsed: new Date().toISOString(),
    status: 'pending', // Require approval
  };
  try {
    await setDoc(doc(db, "recruiters", email), profile);
    return profile;
  } catch (error) {
    console.error("Error creating recruiter profile:", error);
    throw error;
  }
};

export const approveRecruiter = async (email: string, level: 1 | 2 | 3, adminEmail: string): Promise<void> => {
  try {
    const ref = doc(db, "recruiters", email);
    await updateDoc(ref, {
      status: 'approved',
      level,
      approvedBy: adminEmail,
      approvedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error approving recruiter:", error);
    throw error;
  }
};

export const rejectRecruiter = async (email: string, adminEmail: string): Promise<void> => {
  try {
    const ref = doc(db, "recruiters", email);
    await updateDoc(ref, {
      status: 'rejected',
      approvedBy: adminEmail,
      approvedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error rejecting recruiter:", error);
    throw error;
  }
};

export const createRecruiter = async (email: string, level: 1 | 2 | 3, status: 'pending' | 'approved' = 'approved'): Promise<RecruiterProfile> => {
  const profile: RecruiterProfile = {
    email,
    level,
    usageCount: 0,
    lastUsed: new Date().toISOString(),
    status,
    approvedBy: status === 'approved' ? 'admin' : undefined,
    approvedAt: status === 'approved' ? new Date().toISOString() : undefined,
  };
  try {
    await setDoc(doc(db, 'recruiters', email), profile);
    return profile;
  } catch (error) {
    console.error('Error creating recruiter:', error);
    throw error;
  }
};

export const updateRecruiter = async (email: string, updates: Partial<RecruiterProfile>): Promise<void> => {
  try {
    const ref = doc(db, 'recruiters', email);
    await updateDoc(ref, updates);
  } catch (error) {
    console.error('Error updating recruiter:', error);
    throw error;
  }
};

export const updateRecruiterEmail = async (oldEmail: string, newEmail: string): Promise<void> => {
  try {
    const oldRef = doc(db, 'recruiters', oldEmail);
    const oldSnap = await getDoc(oldRef);
    if (!oldSnap.exists()) {
      throw new Error('Recruiter not found');
    }
    const data = oldSnap.data() as RecruiterProfile;
    if (newEmail === oldEmail) {
      return;
    }
    const newRef = doc(db, 'recruiters', newEmail);
    const newSnap = await getDoc(newRef);
    if (newSnap.exists()) {
      throw new Error('A recruiter with that email already exists');
    }
    await setDoc(newRef, { ...data, email: newEmail });
    await updateDoc(oldRef, { status: 'deleted' });
    await deleteDoc(oldRef);
  } catch (error) {
    console.error('Error updating recruiter email:', error);
    throw error;
  }
};

export const deleteRecruiter = async (email: string): Promise<void> => {
  try {
    const ref = doc(db, 'recruiters', email);
    await deleteDoc(ref);
  } catch (error) {
    console.error('Error deleting recruiter:', error);
    throw error;
  }
};

export const getPendingRecruiters = async (): Promise<RecruiterProfile[]> => {
  try {
    const q = query(collection(db, "recruiters"), where("status", "==", "pending"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data() } as RecruiterProfile));
  } catch (error) {
    console.error("Error getting pending recruiters:", error);
    return [];
  }
};

export const getApprovedRecruiters = async (): Promise<RecruiterProfile[]> => {
  try {
    const q = query(collection(db, "recruiters"), where("status", "==", "approved"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data() } as RecruiterProfile));
  } catch (error) {
    console.error("Error getting approved recruiters:", error);
    return [];
  }
};

export const updateRecruiterUsage = async (email: string): Promise<void> => {
  try {
    const ref = doc(db, "recruiters", email);
    await updateDoc(ref, {
      usageCount: increment(1),
      lastUsed: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating recruiter usage:", error);
    throw error;
  }
};

/** Increments usageCount in the recruiter_requests document (used for dashboard display) */
export const incrementRecruiterRequestUsage = async (uid: string): Promise<void> => {
  try {
    await updateDoc(doc(db, "recruiter_requests", uid), {
      usageCount: increment(1),
    });
  } catch (error) {
    console.error("Error incrementing recruiter request usage:", error);
  }
};

export const checkRecruiterLimit = (profile: RecruiterProfile): boolean => {
  const limits = {
    1: 10, // Level 1: 10 uses
    2: 50, // Level 2: 50 uses
    3: 200, // Level 3: 200 uses
  };
  return profile.usageCount < limits[profile.level];
};

// History functions
export interface RecruiterHistoryEntry {
  portfolioData: any;
  analysis: any;
  createdAt: string;
  candidateId?: string;
  driveId?: string;
}

export const addRecruiterHistory = async (email: string, entry: RecruiterHistoryEntry): Promise<string> => {
  try {
    const col = collection(db, "recruiters", email, "history");
    const docRef = await addDoc(col, entry);
    return docRef.id;
  } catch (error) {
    console.error("Error adding history entry:", error);
    throw error;
  }
};

export const updateRecruiterHistoryAnalysis = async (email: string, historyId: string, analysis: any): Promise<void> => {
  try {
    const ref = doc(db, "recruiters", email, "history", historyId);
    await updateDoc(ref, { analysis });
  } catch (error) {
    console.error("Error updating history analysis:", error);
    throw error;
  }
};

export const fetchRecruiterHistory = async (email: string): Promise<RecruiterHistoryEntry[]> => {
  try {
    const q = query(
      collection(db, "recruiters", email, "history"),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as unknown)) as RecruiterHistoryEntry[];
  } catch (error) {
    console.error("Error fetching history:", error);
    return [];
  }
};

// Candidate functions
export interface CandidateData {
  id?: string;
  driveId?: string;
  driveName?: string;
  githubUsername: string;
  leetcodeUsername?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  aptitudeScore?: number;
  technicalScore?: number;
  selectedFields?: string[];
  name: string;
  email?: string;
  portfolioData: any;
  analysis: any;
  htmlReport?: string;
  recruiterEmail: string;
  requiredTechStack?: string[];
  experienceLevel?: string;
  createdAt: string;
  updatedAt: string;
}

export const storeCandidateAnalysis = async (candidate: Omit<CandidateData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const candidateData: CandidateData = {
      ...candidate,
      githubUsername: (candidate.githubUsername || "").toLowerCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, "candidates"), candidateData);
    return docRef.id;
  } catch (error) {
    console.error("Error storing candidate analysis:", error);
    throw error;
  }
};

export const updateCandidateAnalysis = async (candidateId: string, analysis: any, htmlReport?: string): Promise<void> => {
  try {
    const ref = doc(db, "candidates", candidateId);
    const updateData: any = {
      analysis,
      updatedAt: new Date().toISOString(),
    };
    if (htmlReport) {
      updateData.htmlReport = htmlReport;
    }
    await updateDoc(ref, updateData);
  } catch (error) {
    console.error("Error updating candidate analysis:", error);
    throw error;
  }
};

export const fetchCandidateById = async (candidateId: string): Promise<CandidateData | null> => {
  try {
    const ref = doc(db, "candidates", candidateId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as CandidateData;
    }
    return null;
  } catch (error) {
    console.error("Error fetching candidate:", error);
    return null;
  }
};

export const fetchCandidatesByRecruiter = async (recruiterEmail: string): Promise<CandidateData[]> => {
  try {
    const q = query(
      collection(db, "candidates"),
      where("recruiterEmail", "==", recruiterEmail),
      orderBy("createdAt", "desc"),
      limit(100)
    );
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CandidateData));
  } catch (error) {
    console.error("Error fetching candidates by recruiter:", error);
    return [];
  }
};

/**
 * Find an existing candidate by GitHub username and optional LeetCode username.
 * Returns the latest matching candidate or null.
 * If leetcodeUsername is provided and differs from stored, returns null (new fields = re-analyze).
 * If requiredTechStack or experienceLevel differ from stored, returns null (new prefs = re-analyze).
 */
export const findExistingCandidate = async (
  githubUsername: string,
  recruiterEmail: string,
  driveId?: string,
  leetcodeUsername?: string,
  requiredTechStack?: string[],
  experienceLevel?: string,
  selectedFields?: string[],
  linkedinUrl?: string,
  aptitudeScore?: number,
  technicalScore?: number,
  instagramUrl?: string,
): Promise<CandidateData | null> => {
  try {
    if (!githubUsername || !driveId) return null;
    const q = query(
      collection(db, "candidates"),
      where("githubUsername", "==", githubUsername.toLowerCase()),
      where("recruiterEmail", "==", recruiterEmail),
      where("driveId", "==", driveId),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const candidate = { id: snap.docs[0].id, ...snap.docs[0].data() } as CandidateData;

    // If the candidate has no analysis yet, treat as not found
    if (!candidate.analysis) return null;

    // If LeetCode was added or changed, must re-analyze
    const storedLeetcode = (candidate.leetcodeUsername || "").toLowerCase().trim();
    const newLeetcode = (leetcodeUsername || "").toLowerCase().trim();
    if (newLeetcode !== storedLeetcode) return null;

    // If recruiter preferences changed, must re-analyze
    const storedTech = (candidate as any).requiredTechStack || [];
    const storedLevel = (candidate as any).experienceLevel || "";
    const newTech = requiredTechStack || [];
    const newLevel = experienceLevel || "";
    if (JSON.stringify(storedTech.sort()) !== JSON.stringify([...newTech].sort())) return null;
    if (storedLevel !== newLevel) return null;

    // Check if selectedFields match
    const storedFields = (candidate as any).selectedFields || [];
    const newFields = selectedFields || [];
    if (JSON.stringify(storedFields.sort()) !== JSON.stringify([...newFields].sort())) return null;

    // Check if LinkedIn URL matches
    const storedLinkedin = (candidate.linkedinUrl || "").trim().toLowerCase();
    const newLinkedin = (linkedinUrl || "").trim().toLowerCase();
    if (newLinkedin !== storedLinkedin) return null;

    // Check if Instagram URL matches
    const storedInstagram = (candidate.instagramUrl || "").trim().toLowerCase();
    const newInstagram = (instagramUrl || "").trim().toLowerCase();
    if (newInstagram !== storedInstagram) return null;

    // Check if test scores match
    if (candidate.aptitudeScore !== aptitudeScore) return null;
    if (candidate.technicalScore !== technicalScore) return null;

    return candidate;
  } catch (error) {
    console.error("Error finding existing candidate:", error);
    return null;
  }
};

export const fetchCandidatesByDrive = async (recruiterEmail: string, driveId: string): Promise<CandidateData[]> => {
  try {
    const q = query(
      collection(db, "candidates"),
      where("recruiterEmail", "==", recruiterEmail),
      where("driveId", "==", driveId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CandidateData));
  } catch (error) {
    console.error("Error fetching candidates by drive:", error);
    return [];
  }
};

export const fetchAllCandidates = async (limitCount = 100): Promise<CandidateData[]> => {
  try {
    const q = query(
      collection(db, "candidates"),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CandidateData));
  } catch (error) {
    console.error("Error fetching all candidates:", error);
    return [];
  }
};

// ─── ADMIN USERS (Firestore-managed, primary always included) ───────────────
export const PRIMARY_ADMIN = "bhuvijkottari@gmail.com";
export const SECONDARY_ADMIN = "cadithya110@gmail.com";
export const DEFAULT_ADMIN_EMAILS = [PRIMARY_ADMIN, SECONDARY_ADMIN];

export interface AdminUser {
  email: string;
  addedAt: string;
  addedBy: string;
  isPrimary: boolean;
}

/** Returns full list of allowed admin emails (always includes primary and secondary admins) */
export const getAdminUsers = async (): Promise<AdminUser[]> => {
  try {
    const snap = await getDoc(doc(db, "admin_settings", "admin_users"));
    const list: AdminUser[] = snap.exists() ? (snap.data().users || []) : [];
    // Ensure default admins are always present
    for (const email of DEFAULT_ADMIN_EMAILS) {
      if (!list.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
        list.unshift({ email, addedAt: new Date().toISOString(), addedBy: "system", isPrimary: email === PRIMARY_ADMIN });
      }
    }
    return list;
  } catch {
    return DEFAULT_ADMIN_EMAILS.map((email) => ({
      email,
      addedAt: new Date().toISOString(),
      addedBy: "system",
      isPrimary: email === PRIMARY_ADMIN,
    }));
  }
};

export const addAdminUser = async (email: string, addedBy: string): Promise<void> => {
  const current = await getAdminUsers();
  if (current.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("This email is already an admin.");
  }
  const updated = [...current, { email: email.toLowerCase(), addedAt: new Date().toISOString(), addedBy, isPrimary: false }];
  await setDoc(doc(db, "admin_settings", "admin_users"), { users: updated }, { merge: true });
};

export const removeAdminUser = async (email: string): Promise<void> => {
  if (email === PRIMARY_ADMIN) throw new Error("Cannot remove the primary admin.");
  const current = await getAdminUsers();
  const updated = current.filter(u => u.email !== email);
  await setDoc(doc(db, "admin_settings", "admin_users"), { users: updated }, { merge: true });
};

// ─── ADMIN AUTH (Google Sign-In, checked against Firestore list) ─────────────
export const signInAdminWithGoogle = async (): Promise<User> => {
  const result = await signInWithPopup(auth, googleProvider);
  const email = result.user.email?.toLowerCase() || "";

  // Always allow primary admin without Firestore check (bootstrap)
  if (email !== PRIMARY_ADMIN) {
    const admins = await getAdminUsers();
    const allowed = admins.map(a => a.email.toLowerCase());
    if (!allowed.includes(email)) {
      await signOut(auth);
      throw new Error(`Access denied. ${email} is not authorised as an admin.`);
    }
  }

  localStorage.setItem("adminAuth", JSON.stringify({ email, ts: Date.now() }));
  return result.user;
};

// kept for route compatibility
export const verifyAdminEmailLink = async (): Promise<User | null> => null;
export const sendAdminLoginLink = async (_email: string): Promise<void> => {};

export const isAdminAuthenticated = (): boolean => {
  try {
    const raw = localStorage.getItem("adminAuth");
    if (!raw) return false;
    const { email, ts } = JSON.parse(raw);
    const EIGHT_HOURS = 8 * 60 * 60 * 1000;
    return !!email && Date.now() - ts < EIGHT_HOURS;
  } catch { return false; }
};

export const getAuthenticatedAdminEmail = (): string => {
  try {
    const raw = localStorage.getItem("adminAuth");
    if (!raw) return "";
    return JSON.parse(raw).email || "";
  } catch { return ""; }
};

export const adminLogout = () => {
  localStorage.removeItem("adminAuth");
  signOut(auth).catch(() => {});
};

// ─── SITE SETTINGS ──────────────────────────────────────────────────────────
export interface SiteSettings {
  portfolioEnabled: boolean;
  recruiterEnabled: boolean;
}

export const getSiteSettings = async (): Promise<SiteSettings> => {
  try {
    const snap = await getDoc(doc(db, "admin_settings", "config"));
    if (snap.exists()) return snap.data() as SiteSettings;
    return { portfolioEnabled: true, recruiterEnabled: true };
  } catch { return { portfolioEnabled: true, recruiterEnabled: true }; }
};

export const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
  await setDoc(doc(db, "admin_settings", "config"), settings, { merge: true });
};

export const subscribeSiteSettings = (cb: (s: SiteSettings) => void) =>
  onSnapshot(doc(db, "admin_settings", "config"), (snap) => {
    cb(snap.exists() ? (snap.data() as SiteSettings) : { portfolioEnabled: true, recruiterEnabled: true });
  });

// ─── PACKAGES ───────────────────────────────────────────────────────────────
export const PACKAGES = [
  { id: "enterprise_lite", name: "Enterprise Lite", inr: 25000, usd: 269.82, limit: -1,  desc: "Unlimited candidate analysis", badge: "Best Value" },
  { id: "professional",    name: "Professional",    inr: 15000, usd: 161.89, limit: 100, desc: "Up to 100 analyses per year",   badge: "Popular" },
  { id: "growth",          name: "Growth",          inr: 6000,  usd: 64.76,  limit: 50,  desc: "Up to 50 analyses per year",    badge: "" },
  { id: "starter",         name: "Starter",         inr: 3000,  usd: 32.38,  limit: 25,  desc: "Up to 25 analyses per year",    badge: "" },
] as const;

// ─── RECRUITER REQUESTS ──────────────────────────────────────────────────────
export interface RecruiterRequest {
  uid: string;
  email: string;
  name: string;
  photoURL: string;
  packageId: string;
  packageName: string;
  packageLimit: number;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  approvedAt?: string;
  expiresAt?: string;
  usageCount: number;
}

export const createRecruiterRequest = async (
  user: User, packageId: string
): Promise<void> => {
  const pkg = PACKAGES.find((p) => p.id === packageId)!;
  const existing = await getDoc(doc(db, "recruiter_requests", user.uid));
  if (existing.exists() && existing.data().status === "approved") return;
  await setDoc(doc(db, "recruiter_requests", user.uid), {
    uid: user.uid,
    email: user.email,
    name: user.displayName || user.email,
    photoURL: user.photoURL || "",
    packageId: pkg.id,
    packageName: pkg.name,
    packageLimit: pkg.limit,
    status: "pending",
    requestedAt: new Date().toISOString(),
    usageCount: 0,
  } satisfies RecruiterRequest);
};

export const getRecruiterRequest = async (uid: string): Promise<RecruiterRequest | null> => {
  const snap = await getDoc(doc(db, "recruiter_requests", uid));
  return snap.exists() ? (snap.data() as RecruiterRequest) : null;
};

export const subscribeRecruiterRequest = (uid: string, cb: (r: RecruiterRequest | null) => void) =>
  onSnapshot(doc(db, "recruiter_requests", uid), (snap) =>
    cb(snap.exists() ? (snap.data() as RecruiterRequest) : null)
  );

export const getAllRecruiterRequests = async (): Promise<RecruiterRequest[]> => {
  try {
    const snap = await getDocs(query(collection(db, "recruiter_requests"), orderBy("requestedAt", "desc")));
    return snap.docs.map((d) => d.data() as RecruiterRequest);
  } catch { return []; }
};

export const approveRecruiterRequest = async (uid: string, packageId: string): Promise<void> => {
  const pkg = PACKAGES.find((p) => p.id === packageId)!;
  const now = new Date();
  const expires = new Date(now);
  expires.setFullYear(expires.getFullYear() + 1);

  // Update new system
  await updateDoc(doc(db, "recruiter_requests", uid), {
    status: "approved",
    packageId: pkg.id,
    packageName: pkg.name,
    packageLimit: pkg.limit,
    approvedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
  });

  // Sync old recruiters collection so checkRecruiterLimit works
  const reqSnap = await getDoc(doc(db, "recruiter_requests", uid));
  if (!reqSnap.exists()) return;
  const email = reqSnap.data()?.email;
  if (email) {
    const level = pkg.limit === -1 ? 3 : pkg.limit === 100 ? 3 : pkg.limit === 50 ? 2 : 1;
    await setDoc(doc(db, "recruiters", email), {
      email,
      level,
      usageCount: 0,
      lastUsed: now.toISOString(),
      status: "approved",
      approvedAt: now.toISOString(),
      packageId: pkg.id,
      packageName: pkg.name,
      packageLimit: pkg.limit,
    }, { merge: true });
  }
};

export const rejectRecruiterRequest = async (uid: string): Promise<void> => {
  await updateDoc(doc(db, "recruiter_requests", uid), { status: "rejected" });
};
export interface Drive {
  id?: string;

  recruiterEmail: string;

  driveName: string;

  role: string;

  createdByName?: string;

  createdByPosition?: string;

  selectedFields: string[];

  requiredTechStack: string[];

  experienceLevel: string;

  passwordHash?: string;

  status: "active" | "closed";

  createdAt: string;
}
export const createDrive = async (
  drive: Omit<Drive, "id" | "createdAt">
): Promise<string> => {
  const docRef = await addDoc(
    collection(db, "drives"),
    {
      ...drive,
      createdAt: new Date().toISOString(),
    }
  );

  return docRef.id;
};

export const deleteDrive = async (
  driveId: string
) => {
  const candidatesQuery = query(
    collection(db, "candidates"),
    where("driveId", "==", driveId)
  );
  const candidateSnap = await getDocs(candidatesQuery);
  const deletePromises = candidateSnap.docs.map((docItem) => deleteDoc(doc(db, "candidates", docItem.id)));
  await Promise.all(deletePromises);
  await deleteDoc(doc(db, "drives", driveId));
};
export const fetchRecruiterDrives = async (
  recruiterEmail: string
): Promise<Drive[]> => {
  try {
    // Composite index required: recruiterEmail (ASC) + createdAt (DESC)
    // Create it in Firebase Console → Firestore → Indexes if drives don't load
    const q = query(
      collection(db, "drives"),
      where("recruiterEmail", "==", recruiterEmail),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Drive[];
  } catch (error: any) {
    // If composite index is missing, fall back to unordered fetch
    if (error?.code === "failed-precondition" || error?.message?.includes("index")) {
      console.warn("Drives index not ready yet — fetching without sort order");
      try {
        const fallbackQ = query(
          collection(db, "drives"),
          where("recruiterEmail", "==", recruiterEmail)
        );
        const fallbackSnap = await getDocs(fallbackQ);
        const results = fallbackSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Drive[];
        // Sort client-side while index builds
        return results.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } catch (fallbackErr) {
        console.error("Fallback fetch also failed:", fallbackErr);
        return [];
      }
    }
    console.error(error);
    return [];
  }
};
export const fetchDriveById = async (
  driveId: string
): Promise<Drive | null> => {
  try {
    const snap = await getDoc(
      doc(db, "drives", driveId)
    );

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data(),
    } as Drive;
  } catch {
    return null;
  }
};
export const updateDrive = async (
  driveId: string,
  updates: Partial<Drive>
) => {
  await updateDoc(doc(db, "drives", driveId), updates);
};


// ─── PORTFOLIO USAGE TRACKING ────────────────────────────────────────────────
export interface PortfolioUsageEntry {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  currentOccupation?: string;
  resumeName: string;
  theme: string;
  timestamp: string;
  // Summary fields
  bio?: string;
  location?: string;
  title?: string;
  github?: string;
  linkedin?: string;
  skills?: string[];
  experienceCount?: number;
  projectsCount?: number;
  educationCount?: number;
  totalCommits?: number;
  publicRepos?: number;
  followers?: number;
  topLanguages?: string[];
}

export const trackPortfolioGeneration = async (entry: Omit<PortfolioUsageEntry, "id">) => {
  try {
    await addDoc(collection(db, "portfolio_usage"), entry);
  } catch { /* silent */ }
};

export const fetchPortfolioUsage = async (): Promise<PortfolioUsageEntry[]> => {
  try {
    const snap = await getDocs(query(collection(db, "portfolio_usage"), orderBy("timestamp", "desc"), limit(200)));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PortfolioUsageEntry));
  } catch { return []; }
};

// ─── GEMINI USAGE TRACKING ───────────────────────────────────────────────────
export type GeminiCallType = "parse-resume" | "analyze-candidate";

export const trackGeminiCall = async (type: GeminiCallType) => {
  try {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    await addDoc(collection(db, "gemini_usage"), {
      type,
      date: today,
      timestamp: new Date().toISOString(),
    });
  } catch { /* silent */ }
};

export interface GeminiUsageToday {
  parseResume: number;
  analyzeCandidate: number;
  total: number;
  remaining: number;
  dailyLimit: number;
}

export const fetchGeminiUsageToday = async (): Promise<GeminiUsageToday> => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const snap = await getDocs(
      query(collection(db, "gemini_usage"), where("date", "==", today))
    );
    const docs = snap.docs.map((d) => d.data());
    const parseResume = docs.filter((d) => d.type === "parse-resume").length;
    const analyzeCandidate = docs.filter((d) => d.type === "analyze-candidate").length;
    const total = docs.length;
    const dailyLimit = 500;
    return { parseResume, analyzeCandidate, total, remaining: Math.max(0, dailyLimit - total), dailyLimit };
  } catch {
    return { parseResume: 0, analyzeCandidate: 0, total: 0, remaining: 500, dailyLimit: 500 };
  }
};

// ─── FEEDBACK DELETE (admin) ─────────────────────────────────────────────────
export const deleteFeedback = async (id: string) => {
  await deleteDoc(doc(db, "feedbacks", id));
};

// ─── SUPPORT TICKETS ─────────────────────────────────────────────────────────
export interface SupportTicket {
  id?: string;
  recruiterEmail: string;
  recruiterName: string;
  message: string;
  createdAt: string;
  status: "open" | "resolved";
}

export const submitSupportTicket = async (
  ticket: Omit<SupportTicket, "id">
): Promise<void> => {
  await addDoc(collection(db, "support_tickets"), ticket);
};

export const fetchSupportTickets = async (): Promise<SupportTicket[]> => {
  try {
    const snap = await getDocs(
      query(collection(db, "support_tickets"), orderBy("createdAt", "desc"), limit(200))
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SupportTicket));
  } catch { return []; }
};

export const resolveSupportTicket = async (id: string): Promise<void> => {
  await updateDoc(doc(db, "support_tickets", id), { status: "resolved" });
};

export const deleteSupportTicket = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "support_tickets", id));
};