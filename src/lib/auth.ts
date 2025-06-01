import { createClient } from "@supabase/supabase-js";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  isPremium: boolean;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    // Get the current user from Clerk
    const { userId, isSignedIn } = useClerkAuth();

    if (!userId || !isSignedIn) {
      console.log("No userId found in Clerk auth or user not signed in");
      return null;
    }

    // Get user data from Supabase
    const { data, error } = await supabase.functions.invoke(
      "supabase-functions-get_user",
      {
        body: { userId },
      },
    );

    if (error) {
      console.error("Error getting user:", error);
      return null;
    }

    if (!data) {
      console.error("No data returned from get_user function");
      return null;
    }

    if (data.error) {
      console.error("Error in user data:", data.error);
      return null;
    }

    // Format user data
    return {
      id: userId, // Use the userId from Clerk as the primary ID
      email: data.email_addresses?.[0]?.email_address || "",
      firstName: data.first_name || "",
      lastName: data.last_name || "",
      profileImageUrl: data.profile_image_url || "",
      isPremium: data.is_premium === true || false,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

// Create or update user in Supabase
export async function createOrUpdateUser(userData: {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}) {
  try {
    // Add default isPremium=false if not provided
    const userDataWithDefaults = {
      ...userData,
      isPremium: false, // Default to free plan
    };

    const { data, error } = await supabase.functions.invoke(
      "supabase-functions-create_or_update_user",
      {
        body: userDataWithDefaults,
      },
    );

    if (error || !data || !data.success) {
      console.error("Error creating/updating user:", error || data?.error);
      return null;
    }

    return data.data?.[0] || null;
  } catch (error) {
    console.error("Error creating/updating user:", error);
    return null;
  }
}

export async function updateUserPremiumStatus(
  userId: string,
  isPremium: boolean,
): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "supabase-functions-update_user_premium_status",
      {
        body: { userId, isPremium },
      },
    );

    if (error || !data || !data.success) {
      console.error(
        "Error updating user premium status:",
        error || data?.error,
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error updating user premium status:", error);
    return false;
  }
}

export async function verifyStripeSession(
  userId: string,
  sessionId: string,
): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "supabase-functions-update_user_premium_status",
      {
        body: { userId, sessionId },
      },
    );

    if (error || !data || !data.success) {
      console.error("Error verifying Stripe session:", error || data?.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error verifying Stripe session:", error);
    return false;
  }
}

export async function saveStartupIdea(ideaData: {
  userId: string;
  problem: string;
  audience: string;
  solution: string;
  names?: string[];
  pitch?: string;
  pitchDeck?: Record<string, string>;
  viralPosts?: string;
}) {
  try {
    const { data, error } = await supabase.functions.invoke(
      "supabase-functions-save_startup_idea",
      {
        body: ideaData,
      },
    );

    if (error || !data || !data.success) {
      console.error("Error saving startup idea:", error || data?.error);
      return null;
    }

    return data.data?.[0] || null;
  } catch (error) {
    console.error("Error saving startup idea:", error);
    return null;
  }
}

export async function getUserStartupIdeas(userId: string) {
  try {
    const { data, error } = await supabase.functions.invoke(
      "supabase-functions-get_user_startup_ideas",
      {
        body: { userId },
      },
    );

    if (error || !data || !data.success) {
      console.error("Error getting user startup ideas:", error || data?.error);
      return [];
    }

    return data.data || [];
  } catch (error) {
    console.error("Error getting user startup ideas:", error);
    return [];
  }
}

export async function deleteStartupIdea(userId: string, ideaId: string) {
  try {
    const { data, error } = await supabase.functions.invoke(
      "supabase-functions-delete_startup_idea",
      {
        body: { userId, ideaId },
      },
    );

    if (error || !data || !data.success) {
      console.error("Error deleting startup idea:", error || data?.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting startup idea:", error);
    return false;
  }
}
