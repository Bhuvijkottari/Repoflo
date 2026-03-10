import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, doc, updateDoc, increment, getDoc, setDoc, onSnapshot, where } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";

const firebaseConfig = {
 apiKey: "AIzaSyAopfXqjPRlnwIDLyQMQiakD4AHN8jjjfk",
  authDomain: "repoflow-803c2.firebaseapp.com",
  projectId: "repoflow-803c2",
  storageBucket: "repoflow-803c2.firebasestorage.app",
  messagingSenderId: "954726402036",
  appId: "1:954726402036:web:96ecc0a632d76f67389ba1",
  measurementId: "G-3JPWWRPPLV"
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
const COUNTER_DOC = "site_stats/visitors";

export async function incrementVisitorCount(): Promise<number> {
  const ref = doc(db, "site_stats", "visitors");
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, { count: increment(1) });
      return (snap.data().count || 0) + 1;
    } else {
      await setDoc(ref, { count: 1 });
      return 1;
    }
  } catch {
    return 0;
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
}

export const addRecruiterHistory = async (email: string, entry: RecruiterHistoryEntry): Promise<void> => {
  try {
    const col = collection(db, "recruiters", email, "history");
    await addDoc(col, entry);
  } catch (error) {
    console.error("Error adding history entry:", error);
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
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as RecruiterHistoryEntry));
  } catch (error) {
    console.error("Error fetching history:", error);
    return [];
  }
};
