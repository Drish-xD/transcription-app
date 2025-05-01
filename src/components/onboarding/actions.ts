"use server";

import { userService } from "@/lib/services/user-service";
import { revalidatePath } from "next/cache";

export interface SaveApiKeyParams {
  userId: string;
  apiKey: string;
}

export async function saveApiKey({ userId, apiKey }: SaveApiKeyParams) {
  try {
    await userService.saveApiKey({
      userId,
      apiKey,
    });
    
    // Mark user as having completed onboarding
    await userService.completeOnboarding(userId);
    
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Error saving API key:", error);
    throw new Error("Failed to save API key");
  }
} 