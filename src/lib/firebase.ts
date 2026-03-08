import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, doc, updateDoc, increment, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDY6HE1WNe0MO9ClUr93bW3D--mx3JviWY",
  authDomain: "project-x-57b50.firebaseapp.com",
  projectId: "project-x-57b50",
  storageBucket: "project-x-57b50.firebasestorage.app",
  messagingSenderId: "787056128835",
  appId: "1:787056128835:web:78b85b5562f0097e5535f6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

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
