import Link from "next/link"
import { Gift } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="glass sticky top-0 z-40 border-x-0 border-t-0">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md text-[15px] font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="grid size-7 place-items-center rounded-lg bg-foreground text-background">
            <Gift className="size-4" />
          </span>
          Me Pido
        </Link>
      </div>
    </header>
  )
}
