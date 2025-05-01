"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { MicIcon, MonitorIcon, StopCircleIcon, TimerIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { saveRecording } from "./actions";

const recordingFormSchema = z.object({
  name: z.string().min(1, "Recording name is required"),
});

type RecordingFormValues = z.infer<typeof recordingFormSchema>;

interface RecordingFormProps {
  userId: string;
  folderId: string;
  recordingType: "screen" | "audio";
}

export function RecordingForm({
  userId,
  folderId,
  recordingType,
}: RecordingFormProps) {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const form = useForm<RecordingFormValues>({
    resolver: zodResolver(recordingFormSchema),
    defaultValues: {
      name: `New ${recordingType === "screen" ? "Screen" : "Audio"} Recording`,
    },
  });

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Timer effect to update duration when recording
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isRecording) {
      // Store start time when recording begins
      startTimeRef.current = Date.now();

      // Update duration every second
      intervalId = setInterval(() => {
        const elapsedSeconds = Math.floor(
          (Date.now() - startTimeRef.current) / 1000,
        );
        setDuration(elapsedSeconds);
      }, 1000);

      timerRef.current = intervalId;
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Clean up on unmount or when recording state changes
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }

      // Also stop recording if component unmounts while recording
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      mediaChunksRef.current = [];
      let stream: MediaStream;

      if (recordingType === "screen") {
        // Start screen recording with audio
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        // Combine the streams
        const tracks = [
          ...screenStream.getTracks(),
          ...audioStream.getTracks(),
        ];
        stream = new MediaStream(tracks);
      } else {
        // Start audio recording
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      }

      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          mediaChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }

        const blob = new Blob(mediaChunksRef.current, {
          type: recordingType === "screen" ? "video/webm" : "audio/webm",
        });

        setRecordingBlob(blob);
        setIsRecording(false);

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      // Start recording
      mediaRecorder.start(1000);
      mediaRecorderRef.current = mediaRecorder;

      setDuration(0);
      setIsRecording(true);

      toast.success("Recording started");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to start recording");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  async function onSubmit(data: RecordingFormValues) {
    if (!recordingBlob) {
      toast.error("You need to record something first");
      return;
    }

    try {
      // Create a File object from the Blob
      const file = new File(
        [recordingBlob],
        `${data.name}.${recordingType === "screen" ? "webm" : "webm"}`,
        {
          type: recordingType === "screen" ? "video/webm" : "audio/webm",
        },
      );

      await saveRecording({
        userId,
        folderId,
        name: data.name,
        type: recordingType,
        file,
        duration,
      });

      toast.success("Recording saved successfully");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Failed to save recording:", error);
      toast.error("Failed to save recording. Please try again.");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        {recordingBlob ? (
          <div className="w-full rounded-md border bg-muted p-4 text-center">
            <div className="mb-2 text-sm font-medium">Recording Complete</div>
            <div className="text-xs text-muted-foreground">
              Duration: {formatTime(duration)}
            </div>
          </div>
        ) : isRecording ? (
          <div className="flex w-full flex-col items-center gap-4 rounded-md border p-8">
            <div className="flex items-center gap-2 animate-pulse">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="font-medium">Recording</span>
            </div>
            <div className="flex items-center text-2xl font-bold">
              <TimerIcon className="mr-2 h-5 w-5" />
              {formatTime(duration)}
            </div>
            <Button onClick={stopRecording} variant="outline" className="gap-2">
              <StopCircleIcon className="h-4 w-4" />
              Stop Recording
            </Button>
          </div>
        ) : (
          <Button
            onClick={startRecording}
            className="h-24 w-full gap-2 text-lg"
            size="lg"
          >
            {recordingType === "screen" ? (
              <MonitorIcon className="h-6 w-6" />
            ) : (
              <MicIcon className="h-6 w-6" />
            )}
            Start {recordingType === "screen" ? "Screen" : "Audio"} Recording
          </Button>
        )}
      </div>

      {recordingBlob && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recording Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter recording name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Save Recording
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setRecordingBlob(null);
                  setDuration(0);
                }}
              >
                Discard
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
