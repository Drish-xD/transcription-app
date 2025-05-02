"use client";

import { Button } from "@/components/ui/button";
import { recordings } from "@/lib/db/schema";
import { formatDistanceToNow } from "date-fns";
import { InferSelectModel } from "drizzle-orm";
import { ClockIcon, DownloadIcon, PlayIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

type Recording = InferSelectModel<typeof recordings>;

interface RecordingsDataTableProps {
  recordings: Recording[];
}

export function RecordingsDataTable({ recordings }: RecordingsDataTableProps) {
  const searchParams = useSearchParams();

  // Filter recordings based on search and type
  const filteredRecordings = useMemo(() => {
    let filtered = [...recordings];
    const search = searchParams?.get("search")?.toLowerCase();
    const type = searchParams?.get("type");

    if (search) {
      filtered = filtered.filter((recording) =>
        recording.name.toLowerCase().includes(search),
      );
    }

    if (type) {
      filtered = filtered.filter((recording) =>
        recording.metadata?.mimeType?.startsWith(type),
      );
    }

    return filtered;
  }, [recordings, searchParams]);

  // Group recordings by date
  const groupedRecordings = useMemo(() => {
    const groups = filteredRecordings.reduce(
      (acc, recording) => {
        const date = new Date(recording.createdAt).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(recording);
        return acc;
      },
      {} as Record<string, Recording[]>,
    );

    // Sort recordings within each group by createdAt
    Object.values(groups).forEach((group) => {
      group.sort(
        (a: Recording, b: Recording) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    });

    return groups;
  }, [filteredRecordings]);

  // Sort dates in descending order
  const sortedDates = useMemo(() => {
    return Object.keys(groupedRecordings).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime(),
    );
  }, [groupedRecordings]);

  if (filteredRecordings.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold">No recordings found</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            {searchParams?.toString()
              ? "Try adjusting your search filters"
              : "You haven't recorded anything yet"}
          </p>
        </div>
      </div>
    );
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in-50">
      {sortedDates.map((date) => (
        <div key={date} className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            {formatDistanceToNow(new Date(date), { addSuffix: true })}
          </h3>
          <div className="divide-y divide-border rounded-md border">
            {groupedRecordings[date].map((recording) => (
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
      ))}
    </div>
  );
}
