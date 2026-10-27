import { Suspense } from "react"

import { GridSkeleton } from "@/components/grid-skeleton"
import { WishlistGrid } from "@/components/wishlist-grid"
import { getWishlists } from "@/lib/data"

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] [mask-image:linear-gradient(to_bottom,black_45%,transparent)]"
      >
        <div className="absolute -top-32 left-[8%] size-[28rem] rounded-full bg-rose-300/30 blur-3xl dark:bg-rose-500/15" />
        <div className="absolute -top-20 right-[6%] size-[30rem] rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-500/10" />
        <div className="absolute top-24 left-1/2 size-[24rem] -translate-x-1/2 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-500/10" />
      </div>

      <section aria-labelledby="page-title" className="mx-auto max-w-7xl px-4 pt-12 pb-24 sm:px-8 sm:pt-20">
        <h1 id="page-title" className="sr-only">
          Mine Ønskelister
        </h1>
        <Suspense fallback={<GridSkeleton />}>
          <Wishlists />
        </Suspense>
      </section>
    </div>
  )
}

async function Wishlists() {
  const lists = await getWishlists()
  return <WishlistGrid lists={lists} />
}
