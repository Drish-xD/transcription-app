"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from ".";

// Helper function to get the current user
export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return session.user;
}

// Sign out
export async function signOut() {
  try {
    return await auth.api.signOut({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Sign out failed:", error);
    throw error;
  }
}
