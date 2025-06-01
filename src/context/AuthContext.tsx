import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  getCurrentUser,
  updateUserPremiumStatus,
  createOrUpdateUser,
} from "../lib/auth";
import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: () => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  upgradeUser: (userId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
  login: () => {},
  logout: () => {},
  refreshUser: async () => {},
  upgradeUser: async () => false,
});

// Create the hook as a named export to be compatible with Fast Refresh
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get Clerk authentication state
  const { isLoaded: clerkLoaded, userId, isSignedIn } = useClerkAuth();
  const { user: clerkUser } = useUser();

  // Sync Clerk user with Supabase
  const syncUserWithSupabase = async () => {
    if (!clerkUser || !userId) return null;

    try {
      // Get user data from Clerk
      const email = clerkUser.primaryEmailAddress?.emailAddress || "";
      const firstName = clerkUser.firstName || "";
      const lastName = clerkUser.lastName || "";
      const profileImageUrl = clerkUser.imageUrl || "";

      // Create or update user in Supabase
      const result = await createOrUpdateUser({
        userId,
        email,
        firstName,
        lastName,
        profileImageUrl,
      });

      console.log("User synced with Supabase:", result);
      return result;
    } catch (err) {
      console.error("Failed to sync user with Supabase:", err);
      return null;
    }
  };

  const refreshUser = async () => {
    try {
      setIsLoading(true);
      if (isSignedIn && userId) {
        const userData = await getCurrentUser();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (err) {
      setError("Failed to refresh user data");
      console.error(err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Wait for Clerk to load
    if (!clerkLoaded) {
      return;
    }

    // If user is signed in, sync with Supabase and get user data
    if (isSignedIn && clerkUser) {
      const handleUserSync = async () => {
        try {
          setIsLoading(true);
          // First sync the user data with Supabase
          await syncUserWithSupabase();

          // Then refresh the user data from Supabase
          await refreshUser();

          // Check for pending actions after successful login
          checkPendingActions();
        } catch (err) {
          console.error("Error syncing user data:", err);
          setIsLoading(false);
        }
      };

      handleUserSync();
    } else {
      setUser(null);
      setIsLoading(false);
    }
  }, [clerkLoaded, isSignedIn, clerkUser, userId]); // Re-run when Clerk auth state changes

  // Check for pending actions after login
  const checkPendingActions = () => {
    // Check for pending form data
    const pendingData = sessionStorage.getItem("pendingFormData");
    if (pendingData) {
      // Clear the pending data
      sessionStorage.removeItem("pendingFormData");
      // The form will handle this in its own useEffect
    }

    // Check for pending upgrade request
    const pendingUpgrade = sessionStorage.getItem("pendingUpgrade");
    if (pendingUpgrade) {
      sessionStorage.removeItem("pendingUpgrade");
      // Redirect to pricing page
      window.location.href = "/pricing";
    }

    // Check for pending startup idea
    const pendingIdea = sessionStorage.getItem("pendingStartupIdea");
    if (pendingIdea && user) {
      // The ResultsDisplay component will handle this in its own useEffect
    }

    // Check for pending tab change
    const pendingTabChange = sessionStorage.getItem("pendingTabChange");
    if (pendingTabChange) {
      sessionStorage.removeItem("pendingTabChange");
      // The tab change will be handled when the user returns to the results page
    }
  };

  const login = () => {
    // Redirect to Clerk sign-in page
    window.location.href = "/sign-in";
  };

  const logout = () => {
    // Redirect to Clerk sign-out page
    window.location.href = "/sign-out";
  };

  const upgradeUser = async (userId: string): Promise<boolean> => {
    try {
      const success = await updateUserPremiumStatus(userId, true);
      if (success) {
        await refreshUser();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to upgrade user:", err);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isLoading || !clerkLoaded,
        error,
        login,
        logout,
        refreshUser,
        upgradeUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
