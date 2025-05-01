import { FolderEditForm } from "@/components/folders/folder-edit-form";
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
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface EditFolderPageProps {
  params: {
    id: string;
  };
}

export default async function EditFolderPage({ params }: EditFolderPageProps) {
  const user = await getCurrentUser();

  // Get folder details
  const folder = await folderService.getFolder(params.id);

  if (!folder || folder.userId !== user.id) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href={`/dashboard/folders/${folder.id}`}>
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Edit Folder</h1>
      </div>

      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>Edit {folder.name}</CardTitle>
          <CardDescription>
            Update the folder&apos;s information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FolderEditForm folderId={folder.id} initialName={folder.name} />
        </CardContent>
      </Card>
    </div>
  );
}
