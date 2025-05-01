import { RecentRecordings } from "@/components/dashboard/recent-recordings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { folderService } from "@/lib/services/folder-service";
import { recordingService } from "@/lib/services/recording-service";
import { FolderIcon, MicIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  // Get recent recordings
  const recentRecordings = await recordingService.getRecentRecordings(user.id);
  
  // Get root folders
  const rootFolders = await folderService.getRootFolders(user.id);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/recordings/new">
            <Button size="sm" className="h-9">
              <PlusIcon className="mr-2 h-4 w-4" />
              New Recording
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recordings</CardTitle>
            <MicIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentRecordings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Folders</CardTitle>
            <FolderIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rootFolders.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Recordings</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentRecordings recordings={recentRecordings} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Workspaces</CardTitle>
            <Link href="/dashboard/folders/new">
              <Button variant="ghost" size="sm" className="gap-1">
                <PlusIcon className="h-4 w-4" />
                New
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {rootFolders.length > 0 ? (
              <div className="space-y-2">
                {rootFolders.map((folder) => (
                  <Link 
                    key={folder.id} 
                    href={`/dashboard/folders/${folder.id}`}
                    className="flex items-center gap-2 rounded-md p-2 hover:bg-accent"
                  >
                    <FolderIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{folder.name}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                <p>No workspaces or folders yet</p>
                <Link href="/dashboard/folders/new">
                  <Button variant="link" size="sm" className="mt-2">
                    Create your first folder
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 