import { RecordingsDataTable } from "@/components/recordings/recordings-data-table";
import { RecordingsHeader } from "@/components/recordings/recordings-header";
import { getCurrentUser } from "@/lib/auth/actions";
import { db } from "@/lib/db";
import { recordings } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export default async function RecordingsPage() {
  const user = await getCurrentUser();

  // Fetch recordings for the current user sorted by createdAt in descending order
  const recordingsList = await db
    .select()
    .from(recordings)
    .where(eq(recordings.userId, user.id))
    .orderBy(desc(recordings.createdAt));

  return (
    <div className="container space-y-8 py-8">
      <RecordingsHeader />
      <RecordingsDataTable recordings={recordingsList} />
    </div>
  );
}
