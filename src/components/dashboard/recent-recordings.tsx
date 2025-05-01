import { Button } from "@/components/ui/button";
import { recordings } from "@/lib/db/schema";
import { formatDistanceToNow } from "date-fns";
import { InferSelectModel } from "drizzle-orm";
import { ClockIcon, DownloadIcon, PlayIcon } from "lucide-react";
import Link from "next/link";

interface RecentRecordingsProps {
  recordings: InferSelectModel<typeof recordings>[];
}

export function RecentRecordings({ recordings }: RecentRecordingsProps) {
  // Format duration from seconds to MM:SS
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      {recordings.length > 0 ? (
        <div className="rounded-md border">
          <div className="divide-y">
            {recordings.map((recording) => (
              <div key={recording.id} className="flex items-center p-4">
                <div className="flex flex-1 items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <PlayIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Link
                      href={`/dashboard/recordings/${recording.id}`}
                      className="font-medium hover:underline"
                    >
                      {recording.name}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        {recording.type.charAt(0).toUpperCase() +
                          recording.type.slice(1)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" />
                        {formatDuration(recording.duration)}
                      </span>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(new Date(recording.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={recording.fileUrl} target="_blank" download>
                      <DownloadIcon className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-md border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">No recordings yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first recording to get started
          </p>
          <Link href="/dashboard/recordings/new">
            <Button className="mt-4">Create Recording</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
