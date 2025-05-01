import { betterAuth } from "@/lib/auth";
import { LoginForm } from "better-auth-js/components";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await betterAuth.getSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign in to your account</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter your email below to sign in to your account
          </p>
        </div>
        <div className="mt-8">
          <LoginForm
            redirectUrl="/dashboard"
            loginOptions={{
              emailPasswordEnabled: true,
              socialProviders: ["google"],
              passkeysEnabled: true,
            }}
          />
          <div className="mt-6 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-primary">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
