import { Suspense } from "react"

import { GridSkeleton } from "@/components/grid-skeleton"
import { WishlistGrid } from "@/components/wishlist-grid"
import { getWishlists } from "@/lib/data"

export default function Home() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
          <div className="absolute -top-32 left-[8%] size-[28rem] rounded-full bg-rose-300/30 blur-3xl dark:bg-rose-500/15" />
          <div className="absolute -top-20 right-[6%] size-[30rem] rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-500/10" />
          <div className="absolute top-24 left-1/2 size-[24rem] -translate-x-1/2 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-500/10" />
        </div>
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-8 sm:pt-24 sm:pb-16">
          <p className="text-sm font-medium text-muted-foreground">Me Pido</p>
          <h1 className="mt-2 text-5xl font-semibold sm:text-7xl">Mine Ønskelister</h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground sm:text-xl">
            Samle ønskene dine på ett sted, og del dem med dem som trenger et hint.
          </p>
        </div>
      </section>

      <section aria-label="Ønskelister" className="mx-auto max-w-7xl px-4 pb-24 sm:px-8">
        <Suspense fallback={<GridSkeleton />}>
          <Wishlists />
        </Suspense>
      </section>
    </>
  )
}

async function Wishlists() {
  const lists = await getWishlists()
  return <WishlistGrid lists={lists} />
}
