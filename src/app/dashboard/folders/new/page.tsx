import { FolderForm } from "@/components/folders/folder-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { folderService } from "@/lib/services/folder-service";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

export default async function NewFolderPage() {
  const user = await getCurrentUser();

  // Get all folders for the parent dropdown
  const folders = await folderService.getRootFolders(user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/dashboard/folders">
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">New Folder</h1>
      </div>

      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>Create a new folder</CardTitle>
          <CardDescription>
            Create a new folder to organize your recordings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FolderForm userId={user.id} folders={folders} />
        </CardContent>
      </Card>
    </div>
  );
}
