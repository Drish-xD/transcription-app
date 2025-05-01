"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";
import { FolderIcon, HomeIcon, LogOutIcon, MicIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
}

export function Sidebar({ open }: { open?: boolean }) {
  const pathname = usePathname();

  function SidebarItem({ href, icon, title }: SidebarItemProps) {
    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
          pathname === href
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground",
        )}
      >
        {icon}
        <span>{title}</span>
      </Link>
    );
  }

  return (
    <aside
      className={cn(
        "hidden h-full md:w-64 border-r bg-card md:block",
        open && "block",
      )}
    >
      <div className="flex h-full flex-col px-3 py-4">
        <div className="mb-6 px-2">
          <h2 className="text-lg font-semibold">Transcription App</h2>
        </div>
        <nav className="space-y-1">
          <SidebarItem
            href="/dashboard"
            icon={<HomeIcon className="h-4 w-4" />}
            title="Dashboard"
          />
          <SidebarItem
            href="/dashboard/recordings"
            icon={<MicIcon className="h-4 w-4" />}
            title="Recordings"
          />
          <SidebarItem
            href="/dashboard/folders"
            icon={<FolderIcon className="h-4 w-4" />}
            title="Folders"
          />
        </nav>
        <div className="mt-auto space-y-1">
          <form
            action={async () => {
              await signOut();
              toast.success("Logged out successfully");
            }}
          >
            <Button
              variant="ghost"
              className="w-full justify-start px-3"
              type="submit"
            >
              <LogOutIcon className="mr-3 h-4 w-4" />
              <span>Log out</span>
            </Button>
          </form>
        </div>
      </div>
    </aside>
  );
}
