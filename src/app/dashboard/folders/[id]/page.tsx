import { RecentRecordings } from "@/components/dashboard/recent-recordings";
import { FolderList } from "@/components/folders/folder-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { folderService } from "@/lib/services/folder-service";
import { recordingService } from "@/lib/services/recording-service";
import { ChevronLeftIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface FolderPageProps {
  params: {
    id: string;
  };
}

export default async function FolderPage({ params }: FolderPageProps) {
  const user = await getCurrentUser();
  
  // Get folder details
  const folder = await folderService.getFolder(params.id);
  
  if (!folder || folder.userId !== user.id) {
    notFound();
  }
  
  // Get child folders and recordings
  const childFolders = await folderService.getChildFolders(folder.id);
  const recordings = await recordingService.getFolderRecordings(folder.id);
  
  // Get breadcrumb path
  const breadcrumbs = [
    { name: "Folders", href: "/dashboard/folders" },
    { name: folder.name, href: `/dashboard/folders/${folder.id}` },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/dashboard/folders">
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            {breadcrumbs.map((breadcrumb, index) => (
              <div key={breadcrumb.href} className="flex items-center">
                {index > 0 && <span className="mx-2 text-muted-foreground">/</span>}
                <Link
                  href={breadcrumb.href}
                  className={index === breadcrumbs.length - 1 ? "font-medium" : "text-muted-foreground hover:text-foreground"}
                >
                  {breadcrumb.name}
                </Link>
              </div>
            ))}
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{folder.name}</h1>
        </div>
      </div>
      
      <div className="flex items-center justify-end gap-2">
        <Link href={`/dashboard/folders/new?parentId=${folder.id}`}>
          <Button size="sm" variant="outline" className="h-9">
            <PlusIcon className="mr-2 h-4 w-4" />
            New Folder
          </Button>
        </Link>
        <Link href={`/dashboard/recordings/new?folderId=${folder.id}`}>
          <Button size="sm" className="h-9">
            <PlusIcon className="mr-2 h-4 w-4" />
            New Recording
          </Button>
        </Link>
      </div>
      
      {childFolders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Folders</CardTitle>
          </CardHeader>
          <CardContent>
            <FolderList folders={childFolders} />
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Recordings</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentRecordings recordings={recordings} />
        </CardContent>
      </Card>
    </div>
  );
} 