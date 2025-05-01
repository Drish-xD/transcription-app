import { createPartFromUri, createUserContent } from "@google/genai";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ai } from "../ai";
import { db } from "../db";
import { recordings, transcriptions } from "../db/schema";

export const transcriptionService = {
  /**
   * Create a new transcription job
   */
  async createTranscription(recordingId: string) {
    // Check if a transcription already exists for this recording
    const existing = await db
      .select()
      .from(transcriptions)
      .where(eq(transcriptions.recordingId, recordingId));

    if (existing.length > 0) {
      const status = existing[0].status;
      if (status === "completed") {
        return existing[0];
      } else if (status !== "failed") {
        return existing[0];
      }
    }

    // Create a new transcription
    const [transcription] = await db
      .insert(transcriptions)
      .values({
        recordingId,
        status: "pending",
      })
      .onConflictDoUpdate({
        target: transcriptions.recordingId,
        set: {
          status: "pending",
          content: null,
          updatedAt: new Date(),
        },
      })
      .returning();

    // Enqueue the transcription job (simulated here)
    void this.processTranscription(transcription.id);

    return transcription;
  },

  /**
   * Process the transcription using Gemini AI
   */
  async processTranscription(transcriptionId: string) {
    try {
      // Update status to processing
      await db
        .update(transcriptions)
        .set({ status: "processing" })
        .where(eq(transcriptions.id, transcriptionId));

      // Get the recording information
      const [transcriptionWithRecording] = await db
        .select({
          transcription: transcriptions,
          recording: recordings,
        })
        .from(transcriptions)
        .innerJoin(recordings, eq(transcriptions.recordingId, recordings.id))
        .where(eq(transcriptions.id, transcriptionId));

      if (!transcriptionWithRecording) {
        throw new Error("Transcription or recording not found");
      }

      const { recording } = transcriptionWithRecording;

      // Fetch the audio file using fileUrl
      const response = await fetch(recording.fileUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch audio file from fileUrl");
      }

      const audioBlob = await response.blob();
      // Convert Blob to File object for upload
      const mimeType = recording.metadata?.mimeType || "audio/mp3";
      const file = new File([audioBlob], recording.name, {
        type: mimeType,
      });

      // Upload the audio file to Gemini
      const uploadedFile = await ai.files.upload({
        file,
        config: { mimeType },
      });

      if (!uploadedFile?.uri) {
        throw new Error("Failed to upload file to Gemini");
      }

      // Generate transcription using Gemini
      const transcriptionResponse = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: createUserContent([
          createPartFromUri(uploadedFile.uri, mimeType),
          "Generate a detailed transcript of this audio, preserving all spoken content accurately.",
        ]),
      });

      if (!transcriptionResponse.text) {
        throw new Error("Failed to generate transcription");
      }

      const transcribedText = transcriptionResponse.text;

      // Update transcription status and content in database
      await db
        .update(transcriptions)
        .set({
          content: transcribedText,
          status: "completed",
          updatedAt: new Date(),
        })
        .where(eq(transcriptions.id, transcriptionId));

      return { success: true, transcription: transcribedText };
    } catch (error) {
      console.error("Transcription error:", error);

      // Update the transcription with error status
      await db
        .update(transcriptions)
        .set({
          status: "failed",
          metadata: {
            error: error instanceof Error ? error.message : "Unknown error",
          },
          updatedAt: new Date(),
        })
        .where(eq(transcriptions.id, transcriptionId));

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  /**
   * Get a transcription by ID
   */
  async getTranscription(id: string) {
    const [transcription] = await db
      .select()
      .from(transcriptions)
      .where(eq(transcriptions.id, id));

    return transcription;
  },

  /**
   * Get a transcription by recording ID
   */
  async getTranscriptionByRecording(recordingId: string) {
    const [transcription] = await db
      .select()
      .from(transcriptions)
      .where(eq(transcriptions.recordingId, recordingId));

    return transcription;
  },

  /**
   * Update transcription content
   */
  async updateTranscriptionContent(id: string, content: string) {
    await db
      .update(transcriptions)
      .set({ content, updatedAt: new Date() })
      .where(eq(transcriptions.id, id));

    revalidatePath(`/dashboard/recordings/${id}`);
  },

  /**
   * Delete a transcription
   */
  async deleteTranscription(id: string) {
    await db.delete(transcriptions).where(eq(transcriptions.id, id));

    revalidatePath(`/dashboard/recordings/${id}`);
  },
};
