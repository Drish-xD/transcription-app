import { desc, eq } from "drizzle-orm";
import { db, supabaseClient } from "../db";
import {
  recordings,
  recordingTypeEnum,
  type RecordingMetadata,
} from "../db/schema";

export interface CreateRecordingParams {
  name: string;
  userId: string;
  folderId: string;
  type: (typeof recordingTypeEnum.enumValues)[number];
  file: File;
  duration?: number;
  metadata?: RecordingMetadata;
}

export interface UpdateRecordingParams {
  id: string;
  name?: string;
  folderId?: string;
}

export const recordingService = {
  /**
   * Create a new recording
   */
  async createRecording({
    name,
    userId,
    folderId,
    type,
    file,
    duration,
    metadata,
  }: CreateRecordingParams) {
    // Upload file to Supabase storage
    const fileName = `${userId}/${Date.now()}-${file.name}`;
    const { error: fileError } = await supabaseClient.storage
      .from("recordings")
      .upload(fileName, file);

    if (fileError) {
      throw new Error(`Failed to upload recording: ${fileError.message}`);
    }

    // Get the full URL with the correct path
    const {
      data: { publicUrl },
    } = supabaseClient.storage.from("recordings").getPublicUrl(fileName);

    // Generate thumbnail for video recordings (if applicable)
    let thumbnailUrl: string | undefined;
    if (type === "screen") {
      try {
        // Upload thumbnail logic would go here
        // For now, we're just setting a placeholder
        thumbnailUrl = undefined;
      } catch (error) {
        console.error("Failed to generate thumbnail:", error);
      }
    }

    // Create recording record in database
    const [recording] = await db
      .insert(recordings)
      .values({
        name: name,
        userId: userId,
        folderId: folderId,
        type: type,
        fileUrl: publicUrl,
        thumbnailUrl,
        duration,
        metadata: metadata || null,
      })
      .returning();

    return recording;
  },

  /**
   * Get recordings for a specific folder
   */
  async getFolderRecordings(folderId: string) {
    return db.query.recordings.findMany({
      where: (recordings) => eq(recordings.folderId, folderId),
      orderBy: ({ createdAt }, { asc }) => [asc(createdAt)],
    });
  },

  /**
   * Get a specific recording by ID
   */
  async getRecording(id: string) {
    const [recording] = await db
      .select()
      .from(recordings)
      .where(eq(recordings.id, id));
    return recording;
  },

  /**
   * Get recent recordings for a user
   */
  async getRecentRecordings(userId: string, limit = 5) {
    return db
      .select()
      .from(recordings)
      .where(eq(recordings.userId, userId))
      .orderBy(desc(recordings.createdAt))
      .limit(limit);
  },

  /**
   * Update a recording
   */
  async updateRecording({ id, name, folderId }: UpdateRecordingParams) {
    const updates: Partial<typeof recordings.$inferInsert> = {};

    if (name) updates.name = name;
    if (folderId) updates.folderId = folderId;

    await db.update(recordings).set(updates).where(eq(recordings.id, id));
  },

  /**
   * Delete a recording
   */
  async deleteRecording(id: string) {
    const [recording] = await db
      .select({ fileUrl: recordings.fileUrl })
      .from(recordings)
      .where(eq(recordings.id, id));

    if (recording) {
      // Extract the path from the URL
      const filePath = recording.fileUrl.split("/").pop();

      if (filePath) {
        // Delete file from storage
        await supabaseClient.storage.from("recordings").remove([filePath]);
      }

      // Delete record from database
      await db.delete(recordings).where(eq(recordings.id, id));
    }
  },
};
