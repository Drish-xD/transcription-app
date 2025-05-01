"use server";

import { folderService } from "@/lib/services/folder-service";
import { revalidatePath } from "next/cache";

export interface CreateFolderParams {
  userId: string;
  name: string;
  parentId?: string;
  type: 'folder' | 'workspace';
}

export async function createFolder(params: CreateFolderParams) {
  try {
    const folder = await folderService.createFolder(params);
    
    revalidatePath("/dashboard/folders");
    revalidatePath("/dashboard");
    
    return folder;
  } catch (error) {
    console.error("Error creating folder:", error);
    throw new Error("Failed to create folder");
  }
}

export async function renameFolder(id: string, name: string) {
  try {
    await folderService.renameFolder(id, name);
    
    revalidatePath(`/dashboard/folders/${id}`);
    revalidatePath("/dashboard/folders");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Error renaming folder:", error);
    throw new Error("Failed to rename folder");
  }
}

export async function deleteFolder(id: string) {
  try {
    await folderService.deleteFolder(id);
    
    revalidatePath("/dashboard/folders");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting folder:", error);
    throw new Error("Failed to delete folder");
  }
} 