import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange, getRecruiterProfile, createRecruiterProfile, RecruiterProfile } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  recruiterProfile: RecruiterProfile | null;
  loading: boolean;
  isRecruiter: boolean;
  isApprovedRecruiter: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [recruiterProfile, setRecruiterProfile] = useState<RecruiterProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Check if user is a recruiter
        let profile = await getRecruiterProfile(firebaseUser.email!);
        if (!profile) {
          // Create profile if it doesn't exist
          profile = await createRecruiterProfile(firebaseUser.email!);
        }
        setRecruiterProfile(profile);
      } else {
        setRecruiterProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    // This will be implemented in components that need it
    throw new Error('signIn should be called from a component with access to signInWithGoogle');
  };

  const signOut = async () => {
    // This will be implemented in components that need it
    throw new Error('signOut should be called from a component with access to signOutUser');
  };

  const value: AuthContextType = {
    user,
    recruiterProfile,
    loading,
    isRecruiter: !!recruiterProfile,
    isApprovedRecruiter: recruiterProfile?.status === 'approved',
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};