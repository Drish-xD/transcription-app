import { relations } from "drizzle-orm";
import { folders, recordings, transcriptions, userApiKeys, users } from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  folders: many(folders),
  recordings: many(recordings),
  apiKeys: many(userApiKeys),
}));

export const foldersRelations = relations(folders, ({ one, many }) => ({
  user: one(users, {
    fields: [folders.userId],
    references: [users.id],
  }),
  parent: one(folders, {
    fields: [folders.parentId],
    references: [folders.id],
  }),
  children: many(folders),
  recordings: many(recordings),
}));

export const recordingsRelations = relations(recordings, ({ one, many }) => ({
  user: one(users, {
    fields: [recordings.userId],
    references: [users.id],
  }),
  folder: one(folders, {
    fields: [recordings.folderId],
    references: [folders.id],
  }),
  transcription: many(transcriptions),
}));

export const transcriptionsRelations = relations(transcriptions, ({ one }) => ({
  recording: one(recordings, {
    fields: [transcriptions.recordingId],
    references: [recordings.id],
  }),
})); 