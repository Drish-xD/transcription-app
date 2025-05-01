import { betterAuth } from "@/lib/auth";
import { RegisterForm } from "better-auth-js/components";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const session = await betterAuth.getSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter your details below to create your account
          </p>
        </div>
        <div className="mt-8">
          <RegisterForm
            redirectUrl="/onboarding"
            registerOptions={{
              emailPasswordEnabled: true,
              socialProviders: ["google"],
              passkeysEnabled: true,
            }}
          />
          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
