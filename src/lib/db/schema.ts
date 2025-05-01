import {
  AnyPgColumn,
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid
} from 'drizzle-orm/pg-core';

// Enums
export const folderTypeEnum = pgEnum('folder_type', ['folder', 'workspace']);
export const recordingTypeEnum = pgEnum('recording_type', ['audio', 'screen']);
export const transcriptionStatusEnum = pgEnum('transcription_status', [
  'pending',
  'processing',
  'completed',
  'failed',
]);

// Users Table
export const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  email: text().notNull().unique(),
  hasCompletedOnboarding: boolean().default(false),
  hasApiKey: boolean().default(false),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

// User API Keys Table
export const userApiKeys = pgTable('user_api_keys', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  provider: text().notNull().default('gemini'),
  apiKey: text().notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

// Folders Table
export const folders = pgTable('folders', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  parentId: uuid().references((): AnyPgColumn => folders.id, { onDelete: 'cascade' }),
  name: text().notNull(),
  type: folderTypeEnum().notNull().default('folder'),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

// Recordings Table
export const recordings = pgTable('recordings', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  folderId: uuid()
    .notNull()
    .references(() => folders.id, { onDelete: 'cascade' }),
  name: text().notNull(),
  type: recordingTypeEnum().notNull(),
  duration: integer(), // in seconds
  fileUrl: text().notNull(),
  thumbnailUrl: text(),
  metadata: jsonb(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

// Transcriptions Table
export const transcriptions = pgTable('transcriptions', {
  id: uuid().primaryKey().defaultRandom(),
  recordingId: uuid()
    .notNull()
    .references(() => recordings.id, { onDelete: 'cascade' }),
  content: text(),
  status: transcriptionStatusEnum().notNull().default('pending'),
  language: text(),
  metadata: jsonb(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

