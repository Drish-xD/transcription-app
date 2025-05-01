import { BetterAuth } from 'better-auth-js';
import { createAdapter } from 'better-auth-js/adapters/drizzle';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from './db';
import { users } from './db/schema';

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error('BETTER_AUTH_SECRET is not defined');
}

if (!process.env.BETTER_AUTH_URL) {
  throw new Error('BETTER_AUTH_URL is not defined');
}

// Create Drizzle adapter for Better Auth
const adapter = createAdapter({
  db,
  entities: {
    users,
  },
});

// Initialize Better Auth
export const betterAuth = new BetterAuth({
  adapter,
  secret: process.env.BETTER_AUTH_SECRET,
  url: process.env.BETTER_AUTH_URL,
  cookies,
});

// Helper function to get the current user
export async function getCurrentUser() {
  const session = await betterAuth.getSession();
  
  if (!session?.user) {
    redirect('/login');
  }
  
  return session.user;
}

// Helper function to check if the user has completed onboarding
export async function requireApiKey() {
  const user = await getCurrentUser();
  
  if (!user.hasApiKey) {
    redirect('/settings/api-key');
  }
  
  return user;
} 