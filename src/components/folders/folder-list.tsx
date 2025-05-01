import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { FolderIcon, MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";

interface Folder {
  id: string;
  name: string;
  type: 'folder' | 'workspace';
  createdAt: Date;
}

interface FolderListProps {
  folders: Folder[];
}

export function FolderList({ folders }: FolderListProps) {
  return (
    <div className="divide-y rounded-md border">
      {folders.map((folder) => (
        <FolderItem key={folder.id} folder={folder} />
      ))}
    </div>
  );
}

function FolderItem({ folder }: { folder: Folder }) {
  return (
    <div className="flex items-center justify-between p-4">
      <Link
        href={`/dashboard/folders/${folder.id}`}
        className="flex flex-1 items-center gap-3"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
          <FolderIcon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="font-medium">{folder.name}</div>
          <div className="text-xs text-muted-foreground">
            {folder.type.charAt(0).toUpperCase() + folder.type.slice(1)} •{" "}
            {formatDistanceToNow(new Date(folder.createdAt), { addSuffix: true })}
          </div>
        </div>
      </Link>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/folders/${folder.id}`}>
                Open
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/folders/${folder.id}/edit`}>
                Rename
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
} 