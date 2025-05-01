"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createFolder } from "./actions";

const folderFormSchema = z.object({
  name: z.string().min(1, "Folder name is required"),
  parentId: z.string().optional(),
  type: z.enum(["folder", "workspace"]),
});

type FolderFormValues = z.infer<typeof folderFormSchema>;

interface Folder {
  id: string;
  name: string;
  type: 'folder' | 'workspace';
  createdAt: Date;
}

interface FolderFormProps {
  userId: string;
  folders: Folder[];
}

export function FolderForm({ userId, folders }: FolderFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FolderFormValues>({
    resolver: zodResolver(folderFormSchema),
    defaultValues: {
      name: "",
      type: "folder",
    },
  });

  async function onSubmit(data: FolderFormValues) {
    setIsLoading(true);
    
    try {
      const folder = await createFolder({
        userId,
        name: data.name,
        parentId: data.parentId || undefined,
        type: data.type,
      });
      
      toast.success("Folder created successfully");
      router.push(`/dashboard/folders/${folder.id}`);
      router.refresh();
    } catch (error) {
      console.error("Failed to create folder:", error);
      toast.error("Failed to create folder. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
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
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="folder">Folder</SelectItem>
                  <SelectItem value="workspace">Workspace</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Workspaces are top-level containers, while folders can be nested inside workspaces or other folders.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {folders.length > 0 && (
          <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Folder (Optional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a parent folder" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {folders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Leave empty to create at the root level
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Folder"}
        </Button>
      </form>
    </Form>
  );
} 