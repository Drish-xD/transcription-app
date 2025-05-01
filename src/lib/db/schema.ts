import { relations, sql } from "drizzle-orm";
import {
  AnyPgColumn,
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
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
export const user = pgTable("user", {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().notNull(),
  image: text(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
  isAnonymous: boolean(),
});

export const session = pgTable("session", {
  id: text().primaryKey(),
  expiresAt: timestamp().notNull(),
  token: text().notNull().unique(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
  ipAddress: text(),
  userAgent: text(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text().primaryKey(),
  accountId: text().notNull(),
  providerId: text().notNull(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: timestamp(),
  refreshTokenExpiresAt: timestamp(),
  scope: text(),
  password: text(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const verification = pgTable("verification", {
  id: text().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// Folders Table
export const folders = pgTable("folders", {
  id: text()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  parentId: text().references((): AnyPgColumn => folders.id, {
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
  id: text()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  folderId: text()
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
  id: text()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  recordingId: text()
    .notNull()
    .unique()
    .references(() => recordings.id, { onDelete: "cascade" }),
  content: text(),
  status: transcriptionStatusEnum().notNull().default("pending"),
  language: text(),
  metadata: jsonb(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const usersRelations = relations(user, ({ many }) => ({
  folders: many(folders),
  recordings: many(recordings),
  sessions: many(session),
  accounts: many(account),
}));

export const foldersRelations = relations(folders, ({ one, many }) => ({
  user: one(user, {
    fields: [folders.userId],
    references: [user.id],
  }),
  parent: one(folders, {
    fields: [folders.parentId],
    references: [folders.id],
  }),
  children: many(folders),
  recordings: many(recordings),
}));

export const recordingsRelations = relations(recordings, ({ one, many }) => ({
  user: one(user, {
    fields: [recordings.userId],
    references: [user.id],
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
