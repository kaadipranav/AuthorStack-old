export default function Loading() {
  return (
    <div className="container space-y-6 py-16">
      <div className="space-y-3">
        <div className="h-4 w-24 animate-pulse rounded bg-glass" />
        <div className="h-10 w-2/3 animate-pulse rounded bg-glass" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-glass" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-32 animate-pulse rounded-xl border bg-glass/50" />
        ))}
      </div>
    </div>
  );
}

