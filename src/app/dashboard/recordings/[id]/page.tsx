import { TranscriptionViewer } from "@/components/recordings/transcription-viewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/actions";
import { recordingService } from "@/lib/services/recording-service";
import { transcriptionService } from "@/lib/services/transcription-service";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeftIcon, DownloadIcon, FileTextIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface RecordingPageProps {
  params: {
    id: string;
  };
}

export default async function RecordingPage({ params }: RecordingPageProps) {
  const user = await getCurrentUser();

  // Get recording details
  const recording = await recordingService.getRecording(params.id);

  if (!recording || recording.userId !== user.id) {
    notFound();
  }

  // Get transcription if it exists
  const transcription = await transcriptionService.getTranscriptionByRecording(
    recording.id,
  );

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/dashboard">
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-xl font-bold md:text-2xl">{recording.name}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recording</CardTitle>
            </CardHeader>
            <CardContent>
              {recording.type === "screen" ? (
                <video
                  src={recording.fileUrl}
                  controls
                  className="aspect-video w-full rounded-md"
                  poster={recording.thumbnailUrl || undefined}
                />
              ) : (
                <audio src={recording.fileUrl} controls className="w-full" />
              )}

              <div className="mt-4 grid gap-2 text-sm md:grid-cols-2">
                <div>
                  <p className="font-medium">Type</p>
                  <p className="text-muted-foreground">
                    {recording.type.charAt(0).toUpperCase() +
                      recording.type.slice(1)}{" "}
                    Recording
                  </p>
                </div>
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-muted-foreground">
                    {formatDuration(recording.duration)}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-muted-foreground">
                    {formatDistanceToNow(new Date(recording.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Actions</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-1 h-8"
                      asChild
                    >
                      <Link href={recording.fileUrl} target="_blank" download>
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        Download
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileTextIcon className="h-5 w-5" />
                Transcription
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transcription ? (
                <TranscriptionViewer transcription={transcription} />
              ) : (
                <div className="flex h-[300px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                  <h3 className="text-lg font-medium">No transcription yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Transcription is being processed and will be available soon
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
