import { eq } from "drizzle-orm";
import { db } from "../db";
import { userApiKeys, users } from "../db/schema";

export interface SaveApiKeyParams {
  userId: string;
  apiKey: string;
  provider?: string;
}

export const userService = {
  /**
   * Update user's onboarding status
   */
  async completeOnboarding(userId: string) {
    await db
      .update(users)
      .set({ hasCompletedOnboarding: true })
      .where(eq(users.id, userId));
  },

  /**
   * Save the user's API key
   */
  async saveApiKey({ userId, apiKey, provider = "gemini" }: SaveApiKeyParams) {
    // Check if user already has an API key for this provider
    const existingKey = await db
      .select()
      .from(userApiKeys)
      .where(eq(userApiKeys.userId, userId))
      .where(eq(userApiKeys.provider, provider));

    if (existingKey.length > 0) {
      // Update existing key
      await db
        .update(userApiKeys)
        .set({ apiKey })
        .where(eq(userApiKeys.id, existingKey[0].id));
    } else {
      // Insert new key
      await db.insert(userApiKeys).values({
        userId,
        apiKey,
        provider,
      });
    }

    // Update user hasApiKey flag
    await db.update(users).set({ hasApiKey: true }).where(eq(users.id, userId));
  },

  /**
   * Get the user's API key for a specific provider
   */
  async getApiKey(userId: string, provider = "gemini") {
    const result = await db
      .select({ apiKey: userApiKeys.apiKey })
      .from(userApiKeys)
      .where(eq(userApiKeys.userId, userId))
      .where(eq(userApiKeys.provider, provider));

    return result[0]?.apiKey;
  },

  /**
   * Remove the user's API key
   */
  async removeApiKey(userId: string, provider = "gemini") {
    await db
      .delete(userApiKeys)
      .where(eq(userApiKeys.userId, userId))
      .where(eq(userApiKeys.provider, provider));

    // Check if user has any API keys left
    const remainingKeys = await db
      .select()
      .from(userApiKeys)
      .where(eq(userApiKeys.userId, userId));

    if (remainingKeys.length === 0) {
      await db
        .update(users)
        .set({ hasApiKey: false })
        .where(eq(users.id, userId));
    }
  },
};
