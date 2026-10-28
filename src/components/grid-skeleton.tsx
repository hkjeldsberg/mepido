export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div aria-busy="true" aria-label="Laster" className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-[2rem] bg-card shadow-soft">
          <div className="aspect-square animate-pulse bg-muted" />
          <div className="grid gap-2 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}
