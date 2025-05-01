import { FolderList } from "@/components/folders/folder-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/actions";
import { folderService } from "@/lib/services/folder-service";
import { FolderIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function FoldersPage() {
  const user = await getCurrentUser();

  // Get root folders
  const rootFolders = await folderService.getRootFolders(user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Folders</h1>
        <Link href="/dashboard/folders/new">
          <Button size="sm" className="h-9">
            <PlusIcon className="mr-2 h-4 w-4" />
            New Folder
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Folders</CardTitle>
          <CardDescription>
            Organize your recordings into folders
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rootFolders.length > 0 ? (
            <FolderList folders={rootFolders} />
          ) : (
            <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed">
              <FolderIcon className="mb-4 h-10 w-10 text-muted-foreground" />
              <h3 className="text-lg font-medium">No folders yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Create a folder to organize your recordings
              </p>
              <Link href="/dashboard/folders/new">
                <Button className="mt-4">Create Folder</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
