"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { transcriptions } from "@/lib/db/schema";
import { InferSelectModel } from "drizzle-orm";
import {
  CopyIcon,
  DownloadIcon,
  PencilIcon,
  SaveIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updateTranscriptionContent } from "./actions";
interface TranscriptionViewerProps {
  transcription: InferSelectModel<typeof transcriptions>;
}

export function TranscriptionViewer({
  transcription,
}: TranscriptionViewerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(transcription.content || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleCopy = () => {
    if (!transcription.content) return;

    navigator.clipboard.writeText(transcription.content);
    toast.success("Transcription copied to clipboard");
  };

  const handleDownload = () => {
    if (!transcription.content) return;

    const blob = new Blob([transcription.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcription-${transcription.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await updateTranscriptionContent({
        id: transcription.id,
        content,
      });

      toast.success("Transcription updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update transcription:", error);
      toast.error("Failed to update transcription");
    } finally {
      setIsSaving(false);
    }
  };

  if (
    transcription.status === "pending" ||
    transcription.status === "processing"
  ) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center">
        <Spinner className="mb-4 h-8 w-8" />
        <h3 className="font-medium">Processing transcription</h3>
        <p className="text-sm text-muted-foreground">
          This may take a few minutes
        </p>
      </div>
    );
  }

  if (transcription.status === "failed") {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center">
        <div className="mb-4 rounded-full bg-destructive/10 p-3 text-destructive">
          <XIcon className="h-6 w-6" />
        </div>
        <h3 className="font-medium">Transcription failed</h3>
        <p className="text-sm text-muted-foreground">
          There was an error processing this transcription
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {transcription.language || "en"}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {transcription.status}
          </Badge>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!transcription.content}
              >
                <CopyIcon className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                disabled={!transcription.content}
              >
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                disabled={!transcription.content}
              >
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setContent(transcription.content || "");
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Spinner className="mr-2 h-4 w-4" />
                ) : (
                  <SaveIcon className="mr-2 h-4 w-4" />
                )}
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[300px]"
          placeholder="Enter transcription content..."
        />
      ) : (
        <div className="rounded-md border p-4">
          <p className="whitespace-pre-wrap">
            {transcription.content || "No content available"}
          </p>
        </div>
      )}
    </div>
  );
}
