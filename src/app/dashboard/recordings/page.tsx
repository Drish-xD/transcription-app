import { RecordingsDataTable } from "@/components/recordings/recordings-data-table";
import { RecordingsHeader } from "@/components/recordings/recordings-header";
import { db } from "@/lib/db";
import { recordings } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export default async function RecordingsPage() {
  // Fetch recordings sorted by createdAt in descending order
  const recordingsList = await db
    .select()
    .from(recordings)
    .orderBy(desc(recordings.createdAt));

  return (
    <div className="container space-y-8 py-8">
      <RecordingsHeader />
      <RecordingsDataTable recordings={recordingsList} />
    </div>
  );
}
