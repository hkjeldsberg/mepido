import { Suspense } from "react"
import Link from "next/link"

import { GridSkeleton } from "@/components/grid-skeleton"
import { Konfetti } from "@/components/konfetti"
import { WishlistGrid } from "@/components/wishlist-grid"
import { getWishlists } from "@/lib/data"

export default function Home() {
  return (
    <>
      <header className="relative isolate">
        <Konfetti />
        <div className="mx-auto max-w-7xl px-5 pt-10 pb-10 sm:px-8 sm:pt-16 sm:pb-14">
          <Link
            href="/"
            className="rounded-md text-xl font-black tracking-tight text-konfetti-blue outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:text-2xl"
          >
            me pido!
          </Link>
          <h1 className="mt-8 text-[3.25rem] leading-[0.95] font-black sm:mt-12 sm:text-8xl">
            Mine
            <br />
            Ønskelister
          </h1>
        </div>
      </header>

      <section aria-label="Ønskelister" className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
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
