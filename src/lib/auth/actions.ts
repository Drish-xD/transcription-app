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

// Sign in with email/password
export async function signIn(email: string, password: string) {
  try {
    return await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
  } catch (error) {
    console.error("Sign in failed:", error);
    throw error;
  }
}

// Sign up with email/password
export async function signUp(email: string, password: string, name: string) {
  try {
    return await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });
  } catch (error) {
    console.error("Sign Up failed:", error);
    throw error;
  }
}

// Sign up with email/password
export async function signInAnonymous() {
  try {
    return await auth.api.signInAnonymous();
  } catch (error) {
    console.error("Sign Up failed:", error);
    throw error;
  }
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
