"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { requestTranscription } from "./actions";

interface TranscriptionRequestButtonProps {
  recordingId: string;
}

export function TranscriptionRequestButton({
  recordingId,
}: TranscriptionRequestButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRequest = () => {
    setError(null);
    startTransition(async () => {
      const result = await requestTranscription(recordingId);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || "Failed to request transcription");
      }
    });
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <Button onClick={handleRequest} disabled={isPending} variant="outline">
        {isPending ? "Requesting..." : "Transcribe"}
      </Button>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
