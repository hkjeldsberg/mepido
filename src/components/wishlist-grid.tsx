"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { createWishlist } from "@/app/actions"
import { GlassModal } from "@/components/glass-modal"
import { ItemImage } from "@/components/item-image"
import { WishlistForm } from "@/components/wishlist-form"
import { pluralItems } from "@/lib/format"
import type { WishlistSummary } from "@/lib/types"
import { cn } from "@/lib/utils"

const hover = { scale: 1.02, y: -3 }
const tap = { scale: 0.98 }

const TONES = [
  { tile: "bg-tile-pink text-tile-pink-fg", avatar: "bg-konfetti-pink text-white" },
  { tile: "bg-tile-green text-tile-green-fg", avatar: "bg-konfetti-green text-white" },
  { tile: "bg-tile-yellow text-tile-yellow-fg", avatar: "bg-konfetti-yellow text-tile-yellow-fg" },
  { tile: "bg-tile-lilac text-tile-lilac-fg", avatar: "bg-konfetti-blue text-white" },
] as const

/** Stable colour per list, so tiles don't reshuffle when lists are added. */
function toneFor(id: string) {
  let hash = 0
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) | 0
  return TONES[Math.abs(hash) % TONES.length]
}

const tileBase =
  "relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] p-5 outline-none transition-shadow focus-visible:ring-3 focus-visible:ring-ring/50 sm:p-6"

export function WishlistGrid({ lists }: { lists: WishlistSummary[] }) {
  const router = useRouter()
  const [creating, setCreating] = useState(false)
  const [pending, startTransition] = useTransition()
  const [featured, ...rest] = lists

  return (
    <>
      <ul className="grid auto-rows-[10.5rem] grid-cols-2 gap-4 sm:auto-rows-[13rem] sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {featured && (
          <li className="col-span-2">
            <motion.div whileHover={hover} whileTap={tap} className="h-full">
              <FeaturedTile list={featured} />
            </motion.div>
          </li>
        )}

        {rest.map((list) => (
          <li key={list.id}>
            <motion.div whileHover={hover} whileTap={tap} className="h-full">
              <ListTile list={list} />
            </motion.div>
          </li>
        ))}

        <li>
          <motion.button
            type="button"
            layoutId="new-wishlist"
            whileHover={hover}
            whileTap={tap}
            onClick={() => setCreating(true)}
            style={{ borderRadius: 32 }}
            className="group flex size-full flex-col items-center justify-center gap-3 border-2 border-dashed border-foreground/10 font-bold text-muted-foreground transition-colors outline-none hover:border-konfetti-blue/40 hover:text-konfetti-blue focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span className="grid size-12 place-items-center rounded-full bg-konfetti-blue/10 text-konfetti-blue transition group-hover:bg-konfetti-blue group-hover:text-white">
              <Plus className="size-5" strokeWidth={2.75} />
            </span>
            Ny liste
          </motion.button>
        </li>
      </ul>

      {lists.length === 0 && (
        <p className="mt-8 text-center font-semibold text-muted-foreground">Ingen lister ennå. Start med din første!</p>
      )}

      <GlassModal open={creating} onClose={() => setCreating(false)} layoutId="new-wishlist" label="Ny ønskeliste">
        <div className="p-6 sm:p-8">
          <h2 className="mb-6 text-3xl font-black">Ny ønskeliste</h2>
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

function FeaturedTile({ list }: { list: WishlistSummary }) {
  const previews = list.cover_image_url ? [list.cover_image_url] : list.preview_images

  return (
    <Link
      href={`/l/${list.slug}`}
      className={cn(tileBase, "bg-konfetti-blue text-white shadow-blue hover:shadow-lift")}
    >
      {previews.length > 0 ? (
        <div className="flex -space-x-3">
          {previews.slice(0, 4).map((src, i) => (
            <ItemImage
              key={i}
              src={src}
              alt=""
              className="size-11 rounded-full bg-white/20 ring-3 ring-konfetti-blue sm:size-12"
            />
          ))}
        </div>
      ) : (
        <span className="w-fit rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold">Ny liste</span>
      )}

      <div className="flex items-end justify-between gap-4">
        <h2 className="line-clamp-2 text-2xl leading-tight font-black sm:text-4xl">{list.title}</h2>
        <p className="flex shrink-0 items-baseline gap-1.5 font-bold">
          <span className="text-5xl leading-none font-black tabular-nums sm:text-7xl">{list.item_count}</span>
          <span className="sm:text-lg">{list.item_count === 1 ? "ønske" : "ønsker"}</span>
        </p>
      </div>
    </Link>
  )
}

function ListTile({ list }: { list: WishlistSummary }) {
  const tone = toneFor(list.id)

  return (
    <Link href={`/l/${list.slug}`} className={cn(tileBase, tone.tile, "hover:shadow-lift")}>
      {list.cover_image_url ? (
        <ItemImage src={list.cover_image_url} alt="" className="size-11 rounded-full sm:size-12" />
      ) : (
        <span
          aria-hidden
          className={cn("grid size-11 place-items-center rounded-full text-lg font-black sm:size-12", tone.avatar)}
        >
          {list.title.trim().charAt(0).toUpperCase()}
        </span>
      )}
      <div>
        <h2 className="line-clamp-2 text-lg leading-tight font-black sm:text-xl">{list.title}</h2>
        <p className="mt-0.5 font-bold opacity-80">{pluralItems(list.item_count)}</p>
      </div>
    </Link>
  )
}
