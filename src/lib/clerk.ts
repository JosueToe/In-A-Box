// Clerk API functions for user management
import { corsHeaders } from "../supabase/functions/_shared/cors";

// Create a new user in Clerk via Pica Passthrough
export async function createClerkUser(userData: {
  first_name?: string;
  last_name?: string;
  email_address: string[];
  password?: string;
  public_metadata?: Record<string, any>;
}) {
  try {
    const response = await fetch(
      "https://api.picaos.com/v1/passthrough/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-pica-secret": import.meta.env.PICA_SECRET_KEY || "",
          "x-pica-connection-key":
            import.meta.env.PICA_CLERK_CONNECTION_KEY || "",
          "x-pica-action-id":
            "conn_mod_def::GCT_4OlUshg::VU_wKTJ7RbCaeYvjHd4Izw",
        },
        body: JSON.stringify(userData),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create user: ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating Clerk user:", error);
    throw error;
  }
}

// Get user details from Clerk via Pica Passthrough
export async function getClerkUser(userId: string) {
  try {
    const response = await fetch(
      `https://api.picaos.com/v1/passthrough/users/${userId}`,
      {
        method: "GET",
        headers: {
          "x-pica-secret": import.meta.env.PICA_SECRET_KEY || "",
          "x-pica-connection-key":
            import.meta.env.PICA_CLERK_CONNECTION_KEY || "",
          "x-pica-action-id":
            "conn_mod_def::GCT_31Q-7fo::pym2V-IETdaZ-7BJwSQTSA",
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to get user: ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting Clerk user:", error);
    throw error;
  }
}
