import { Skeleton } from "@/components/ui/skeleton";

export default function ConnectionsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-surface p-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-4 h-10 w-24" />
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-surface p-6">
        <Skeleton className="h-6 w-48" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
