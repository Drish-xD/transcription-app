import { RecordingForm } from "@/components/recordings/recording-form";
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

export default async function NewRecordingPage() {
  const user = await getCurrentUser();

  // Get all folders for the user
  const folders = await folderService.getRootFolders(user.id);

  // If the user has no folders, create a default workspace
  let defaultFolderId: string;

  if (folders.length === 0) {
    const defaultFolder = await folderService.createDefaultWorkspace(user.id);
    defaultFolderId = defaultFolder.id;
  } else {
    defaultFolderId = folders[0].id;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/dashboard">
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">New Recording</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Screen Recording</CardTitle>
            <CardDescription>
              Record your screen with audio narration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecordingForm
              userId={user.id}
              folderId={defaultFolderId}
              recordingType="screen"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audio Recording</CardTitle>
            <CardDescription>
              Record audio only from your microphone
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecordingForm
              userId={user.id}
              folderId={defaultFolderId}
              recordingType="audio"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
