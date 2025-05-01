import { relations } from "drizzle-orm";
import {
  AnyPgColumn,
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// Enums
export const folderTypeEnum = pgEnum("folder_type", ["folder", "workspace"]);
export const recordingTypeEnum = pgEnum("recording_type", ["audio", "screen"]);
export const transcriptionStatusEnum = pgEnum("transcription_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

// Users Table
export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  email: text().notNull().unique(),
  hasCompletedOnboarding: boolean().default(false),
  hasApiKey: boolean().default(false),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// User API Keys Table
export const userApiKeys = pgTable("user_api_keys", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  provider: text().notNull().default("gemini"),
  apiKey: text().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// Folders Table
export const folders = pgTable("folders", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  parentId: uuid().references((): AnyPgColumn => folders.id, {
    onDelete: "cascade",
  }),
  name: text().notNull(),
  type: folderTypeEnum().notNull().default("folder"),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export interface RecordingMetadata {
  mimeType: string;
  duration?: number;
  width?: number;
  height?: number;
  frameRate?: number;
}

// Recordings Table
export const recordings = pgTable("recordings", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  folderId: uuid()
    .notNull()
    .references(() => folders.id, { onDelete: "cascade" }),
  name: text().notNull(),
  type: recordingTypeEnum().notNull(),
  duration: integer().notNull().default(0),
  fileUrl: text().notNull(),
  thumbnailUrl: text(),
  metadata: jsonb().notNull().$type<RecordingMetadata | null>(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// Transcriptions Table
export const transcriptions = pgTable("transcriptions", {
  id: uuid().primaryKey().defaultRandom(),
  recordingId: uuid()
    .notNull()
    .references(() => recordings.id, { onDelete: "cascade" }),
  content: text(),
  status: transcriptionStatusEnum().notNull().default("pending"),
  language: text(),
  metadata: jsonb(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  folders: many(folders),
  recordings: many(recordings),
  apiKeys: many(userApiKeys),
}));

export const userApiKeysRelations = relations(userApiKeys, ({ one }) => ({
  user: one(users, {
    fields: [userApiKeys.userId],
    references: [users.id],
  }),
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
  transcriptions: many(transcriptions),
}));

export const transcriptionsRelations = relations(transcriptions, ({ one }) => ({
  recording: one(recordings, {
    fields: [transcriptions.recordingId],
    references: [recordings.id],
  }),
}));
