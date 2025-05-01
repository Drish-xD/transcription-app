import { db } from "@/lib/db";
import { folders, folderTypeEnum } from "@/lib/db/schema";
import { and, eq, isNull } from "drizzle-orm";

export interface CreateFolderParams {
  name: string;
  userId: string;
  parentId?: string;
  type?: (typeof folderTypeEnum.enumValues)[number];
}

export const folderService = {
  /**
   * Create a new folder or workspace
   */
  async createFolder({
    name,
    userId,
    parentId,
    type = "folder",
  }: CreateFolderParams) {
    const [folder] = await db
      .insert(folders)
      .values({
        name,
        userId,
        parentId,
        type,
      })
      .returning();

    return folder;
  },

  /**
   * Get root folders for a user (no parent)
   */
  async getRootFolders(userId: string) {
    return db
      .select()
      .from(folders)
      .where(and(eq(folders.userId, userId), isNull(folders.parentId)))
      .orderBy(folders.name);
  },

  /**
   * Get a specific folder by ID
   */
  async getFolder(id: string) {
    const [folder] = await db.select().from(folders).where(eq(folders.id, id));
    return folder;
  },

  /**
   * Get child folders for a parent folder
   */
  async getChildFolders(parentId: string) {
    return db
      .select()
      .from(folders)
      .where(eq(folders.parentId, parentId))
      .orderBy(folders.name);
  },

  /**
   * Rename a folder
   */
  async renameFolder(id: string, name: string) {
    await db.update(folders).set({ name }).where(eq(folders.id, id));
  },

  /**
   * Move a folder to a new parent
   */
  async moveFolder(id: string, parentId: string | null) {
    await db.update(folders).set({ parentId }).where(eq(folders.id, id));
  },

  /**
   * Delete a folder
   */
  async deleteFolder(id: string) {
    await db.delete(folders).where(eq(folders.id, id));
  },

  /**
   * Create default workspace for new user
   */
  async createDefaultWorkspace(userId: string) {
    return this.createFolder({
      name: "My Workspace",
      userId,
      type: "workspace",
    });
  },
};
