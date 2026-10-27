"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { Gift, Plus } from "lucide-react"
import { toast } from "sonner"

import { createWishlist } from "@/app/actions"
import { GlassModal } from "@/components/glass-modal"
import { ItemImage } from "@/components/item-image"
import { WishlistForm } from "@/components/wishlist-form"
import { pluralItems } from "@/lib/format"
import type { WishlistSummary } from "@/lib/types"

const hover = { scale: 1.025, y: -2 }
const tap = { scale: 0.985 }

export function WishlistGrid({ lists }: { lists: WishlistSummary[] }) {
  const router = useRouter()
  const [creating, setCreating] = useState(false)
  const [pending, startTransition] = useTransition()

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
        <li>
          <motion.button
            type="button"
            layoutId="new-wishlist"
            whileHover={hover}
            whileTap={tap}
            onClick={() => setCreating(true)}
            className="group flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-foreground/10 text-muted-foreground transition-colors outline-none hover:border-foreground/25 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span className="grid size-12 place-items-center rounded-full bg-foreground/5 transition group-hover:bg-foreground group-hover:text-background">
              <Plus className="size-5" />
            </span>
            <span className="font-medium">Ny liste</span>
          </motion.button>
        </li>

        {lists.map((list) => (
          <li key={list.id}>
            <motion.div whileHover={hover} whileTap={tap} className="h-full">
              <Link
                href={`/l/${list.slug}`}
                className="flex aspect-[4/5] h-full flex-col overflow-hidden rounded-3xl bg-card shadow-soft transition-shadow outline-none hover:shadow-lift focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <ListCover list={list} />
                <div className="grid gap-0.5 p-4">
                  <h2 className="truncate text-base font-semibold sm:text-lg">{list.title}</h2>
                  <p className="text-sm text-muted-foreground">{pluralItems(list.item_count)}</p>
                </div>
              </Link>
            </motion.div>
          </li>
        ))}
      </ul>

      {lists.length === 0 && (
        <p className="mt-8 text-center text-muted-foreground">Ingen lister ennå. Start med din første!</p>
      )}

      <GlassModal open={creating} onClose={() => setCreating(false)} layoutId="new-wishlist" label="Ny ønskeliste">
        <div className="p-6 sm:p-8">
          <h2 className="mb-6 text-2xl font-semibold">Ny ønskeliste</h2>
          <WishlistForm
            submitLabel={pending ? "Oppretter…" : "Opprett liste"}
            pending={pending}
            onSubmit={(values) =>
              startTransition(async () => {
                const res = await createWishlist(values)
                if (!res.ok) return void toast.error(res.error)
                // Close first: the route stays mounted (hidden) for back navigation.
                setCreating(false)
                router.push(`/l/${res.data}`)
              })
            }
          />
        </div>
      </GlassModal>
    </>
  )
}

function ListCover({ list }: { list: WishlistSummary }) {
  if (list.cover_image_url) {
    return <ItemImage src={list.cover_image_url} alt="" className="min-h-0 w-full flex-1" />
  }
  const images = list.preview_images
  if (images.length === 0) {
    return (
      <div className="grid min-h-0 flex-1 place-items-center bg-gradient-to-br from-rose-100 via-amber-50 to-sky-100 dark:from-rose-950/40 dark:via-neutral-900 dark:to-sky-950/40">
        <Gift className="size-10 text-foreground/20" aria-hidden />
      </div>
    )
  }
  if (images.length < 4) {
    return <ItemImage src={images[0]} alt="" className="min-h-0 w-full flex-1" />
  }
  return (
    <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-px bg-border">
      {images.map((src, i) => (
        <ItemImage key={i} src={src} alt="" className="size-full min-h-0" />
      ))}
    </div>
  )
}
