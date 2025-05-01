import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6 font-medium">
            <h1 className="text-xl font-bold">Transcription App</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center gap-6 px-4 py-24 text-center md:py-32">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Record and transcribe with ease
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
              Create screen recordings and audio recordings directly in your
              browser, and automatically transcribe them using advanced AI.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </section>
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v20" />
                  <path d="M2 10h20" />
                  <path d="m16 2-4 8-4-8" />
                  <path d="M8 22 12 14l4 8" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Browser-based recording</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Record your screen and audio directly in your browser without
                any software installation.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="m11.4 13.4 4.6 4.6" />
                  <path d="M5 19a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">AI-powered transcription</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Automatically transcribe your recordings with high accuracy
                using Gemini AI.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Organized content</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Keep your recordings and transcriptions organized with
                workspaces and folders.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Transcription App. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
