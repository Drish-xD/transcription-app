'use server';

import { recordingService } from "@/lib/services/recording-service";
import { transcriptionService } from "@/lib/services/transcription-service";
// import { revalidatePath } from "next/cache";

export interface SaveRecordingParams {
  userId: string;
  folderId: string;
  name: string;
  type: "screen" | "audio";
  file: File;
  duration: number;
}

export interface UpdateTranscriptionContentParams {
  id: string;
  content: string;
}

export async function saveRecording({
  userId,
  folderId,
  name,
  type,
  file,
  duration,
}: SaveRecordingParams) {
  try {
    // Step 1: Save the recording
    const recording = await recordingService.createRecording({
      name,
      userId,
      folderId,
      type,
      file,
      duration,
      metadata: {
        mimeType: file.type,
        duration: duration,
      },
    });

    // Step 2: Start the transcription process
    if (recording) {
      await transcriptionService.createTranscription(recording.id);
    }

    // revalidatePath("/dashboard");

    return { success: true, recordingId: recording.id };
  } catch (error) {
    console.error("Error saving recording:", error);
    throw new Error("Failed to save recording");
  }
}

export async function updateTranscriptionContent({
  id,
  content,
}: UpdateTranscriptionContentParams) {
  try {
    await transcriptionService.updateTranscriptionContent(id, content);

    // revalidatePath("/dashboard/recordings/[id]", "page");

    return { success: true };
  } catch (error) {
    console.error("Error updating transcription:", error);
    throw new Error("Failed to update transcription");
  }
}
