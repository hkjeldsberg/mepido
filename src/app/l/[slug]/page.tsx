import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { GridSkeleton } from "@/components/grid-skeleton"
import { ListView } from "@/components/list-view"
import { getWishlist } from "@/lib/data"

export async function generateMetadata({ params }: PageProps<"/l/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const list = await getWishlist(slug)
  return list ? { title: list.title, description: list.description ?? "En ønskeliste på Me Pido" } : {}
}

export default function WishlistPage({ params }: PageProps<"/l/[slug]">) {
  return (
    <Suspense fallback={<ListSkeleton />}>
      <Wishlist params={params} />
    </Suspense>
  )
}

async function Wishlist({ params }: Pick<PageProps<"/l/[slug]">, "params">) {
  const { slug } = await params
  const list = await getWishlist(slug)
  if (!list) notFound()
  return <ListView list={list} />
}

function ListSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
      <div className="mb-10 grid gap-3">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-12 w-72 animate-pulse rounded-lg bg-muted" />
      </div>
      <GridSkeleton count={8} />
    </div>
  )
}
