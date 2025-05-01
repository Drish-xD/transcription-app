"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function RecordingsHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Create query string
  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      }

      return newSearchParams.toString();
    },
    [searchParams],
  );

  // Update search params
  const updateSearchParams = useCallback(
    (params: Record<string, string | null>) => {
      const queryString = createQueryString(params);
      router.push(`${pathname}?${queryString}`);
    },
    [createQueryString, pathname, router],
  );

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center space-x-2">
        <h2 className="text-2xl font-bold tracking-tight">Recordings</h2>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:space-x-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search recordings..."
            className="w-[250px]"
            value={searchParams?.get("search") || ""}
            onChange={(e) =>
              updateSearchParams({ search: e.target.value || null })
            }
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="type">Type</Label>
          <Select
            value={searchParams?.get("type") || "*"}
            onValueChange={(value) =>
              updateSearchParams({ type: value === "*" ? null : value })
            }
          >
            <SelectTrigger id="type" className="w-[180px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="*">All</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
