"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { deleteFolder, renameFolder } from "./actions";

const folderEditFormSchema = z.object({
  name: z.string().min(1, "Folder name is required"),
});

type FolderEditFormValues = z.infer<typeof folderEditFormSchema>;

interface FolderEditFormProps {
  folderId: string;
  initialName: string;
}

export function FolderEditForm({ folderId, initialName }: FolderEditFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<FolderEditFormValues>({
    resolver: zodResolver(folderEditFormSchema),
    defaultValues: {
      name: initialName,
    },
  });

  async function onSubmit(data: FolderEditFormValues) {
    setIsLoading(true);
    
    try {
      await renameFolder(folderId, data.name);
      
      toast.success("Folder updated successfully");
      router.push(`/dashboard/folders/${folderId}`);
      router.refresh();
    } catch (error) {
      console.error("Failed to update folder:", error);
      toast.error("Failed to update folder. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this folder? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    
    try {
      await deleteFolder(folderId);
      
      toast.success("Folder deleted successfully");
      router.push("/dashboard/folders");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete folder:", error);
      toast.error("Failed to delete folder. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Folder Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter folder name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
      
      <div className="border-t pt-6">
        <h3 className="mb-4 text-lg font-medium">Danger Zone</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Deleting a folder will permanently remove it and all its contents. This action cannot be undone.
        </p>
        <Button 
          variant="destructive" 
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete Folder"}
        </Button>
      </div>
    </div>
  );
} 