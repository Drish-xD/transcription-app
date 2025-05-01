import { eq } from 'drizzle-orm';
import { db } from '../db';
import { transcriptions } from '../db/schema';
import { userService } from './user-service';

export interface CreateTranscriptionParams {
  recordingId: string;
  userId: string;
}

export const transcriptionService = {
  /**
   * Create a new transcription job
   */
  async createTranscription({ recordingId, userId }: CreateTranscriptionParams) {
    // Check if a transcription already exists for this recording
    const existing = await db
      .select()
      .from(transcriptions)
      .where(eq(transcriptions.recordingId, recordingId));

    if (existing.length > 0) {
      return existing[0];
    }

    // Create a new transcription
    const [transcription] = await db
      .insert(transcriptions)
      .values({
        recordingId,
        status: 'pending',
      })
      .returning();

    // Enqueue the transcription job (simulated here)
    void this.processTranscription(transcription.id, userId);

    return transcription;
  },

  /**
   * Process the transcription using Gemini AI
   */
  async processTranscription(transcriptionId: string, userId: string) {
    try {
      // Update status to processing
      await db
        .update(transcriptions)
        .set({ status: 'processing' })
        .where(eq(transcriptions.id, transcriptionId));

      // Get the recording information
      const [transcription] = await db
        .select({
          id: transcriptions.id,
          recordingId: transcriptions.recordingId,
        })
        .from(transcriptions)
        .where(eq(transcriptions.id, transcriptionId));

      if (!transcription) {
        throw new Error('Transcription not found');
      }

      // Get the user's Gemini API key
      const apiKey = await userService.getApiKey(userId);
      
      if (!apiKey) {
        throw new Error('No API key found for user');
      }

      // In a real implementation, this would:
      // 1. Fetch the audio file from storage
      // 2. Convert it to a suitable format if needed
      // 3. Call the Gemini API with the audio
      // 4. Process the response
      
      // Simulating a successful transcription for now
      // In production, call the Gemini API here
      const transcribedText = "This is a simulated transcription. In production, this would be the actual transcribed text from Gemini AI.";
      
      // Update the transcription with the results
      await db
        .update(transcriptions)
        .set({
          content: transcribedText,
          status: 'completed',
          language: 'en', // In production, detect language from the response
          updatedAt: new Date(),
        })
        .where(eq(transcriptions.id, transcriptionId));
    } catch (error) {
      console.error('Transcription error:', error);
      
      // Update the transcription with error status
      await db
        .update(transcriptions)
        .set({
          status: 'failed',
          metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
          updatedAt: new Date(),
        })
        .where(eq(transcriptions.id, transcriptionId));
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
  },

  /**
   * Delete a transcription
   */
  async deleteTranscription(id: string) {
    await db.delete(transcriptions).where(eq(transcriptions.id, id));
  },
}; 