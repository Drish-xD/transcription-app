"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { recordings } from "@/lib/db/schema";
import { formatDistanceToNow } from "date-fns";
import { InferSelectModel } from "drizzle-orm";
import { MoreHorizontal, Play, Trash } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

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

  const handlePlay = useCallback((recording: Recording) => {
    // Implement play functionality
    console.log("Play recording:", recording);
  }, []);

  const handleDelete = useCallback((recording: Recording) => {
    // Implement delete functionality
    console.log("Delete recording:", recording);
  }, []);

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

  return (
    <div className="space-y-8 animate-in fade-in-50">
      {sortedDates.map((date) => (
        <div key={date} className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            {formatDistanceToNow(new Date(date), { addSuffix: true })}
          </h3>
          <div className="divide-y divide-border rounded-md border">
            {groupedRecordings[date].map((recording) => (
              <div
                key={recording.id}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePlay(recording)}
                  >
                    <Play className="h-4 w-4" />
                    <span className="sr-only">Play</span>
                  </Button>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {recording.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {recording.metadata?.mimeType}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(recording)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
