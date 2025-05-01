import { getCurrentUser } from "@/lib/auth/actions";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard | Transcription App",
  description: "Manage your transcriptions",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Welcome back!</h2>
        <div className="mb-4 flex items-center space-x-4">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-md border border-border bg-background p-4">
            <h3 className="font-medium">Quick Actions</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link
                  href="/dashboard/recordings/new"
                  className="text-primary hover:underline"
                >
                  New Recording
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/folders"
                  className="text-primary hover:underline"
                >
                  Manage Folders
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
