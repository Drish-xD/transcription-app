import { ApiKeyForm } from "@/components/onboarding/api-key-form";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const user = await getCurrentUser();

  if (user.hasCompletedOnboarding) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Set up your Gemini API key</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter your Gemini API key to enable transcription capabilities
          </p>
        </div>
        <div className="mt-8">
          <ApiKeyForm userId={user.id} />
        </div>
      </div>
    </div>
  );
}
