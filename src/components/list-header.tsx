"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { deleteWishlist, updateWishlist } from "@/app/actions"
import { GlassModal } from "@/components/glass-modal"
import { ShareButton } from "@/components/share-button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { WishlistForm } from "@/components/wishlist-form"
import { pluralItems } from "@/lib/format"
import type { Wishlist } from "@/lib/types"

export function ListHeader({ list, itemCount }: { list: Wishlist; itemCount: number }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [pending, startTransition] = useTransition()

  return (
    <header className="mb-10 flex flex-col gap-6 sm:mb-14 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <Link
          href="/"
          className="mb-3 inline-flex items-center gap-1 rounded-md text-sm text-muted-foreground transition outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ChevronLeft className="size-4" />
          Mine Ønskelister
        </Link>
        <h1 className="text-4xl font-semibold break-words sm:text-6xl">{list.title}</h1>
        {list.description && (
          <p className="mt-3 max-w-2xl text-lg whitespace-pre-line text-muted-foreground">{list.description}</p>
        )}
        <p className="mt-3 text-sm text-muted-foreground">{pluralItems(itemCount)}</p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="ghost"
          size="icon-lg"
          className="size-10 rounded-full"
          aria-label="Rediger liste"
          onClick={() => setEditing(true)}
        >
          <Pencil />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button variant="ghost" size="icon-lg" className="size-10 rounded-full" aria-label="Slett liste" />
            }
          >
            <Trash2 />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Slette «{list.title}»?</AlertDialogTitle>
              <AlertDialogDescription>
                Listen og alle ønskene i den slettes for godt. Dette kan ikke angres.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Avbryt</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    const res = await deleteWishlist(list.id)
                    if (!res.ok) return void toast.error(res.error)
                    toast.success("Listen er slettet")
                    router.replace("/")
                  })
                }
              >
                Slett liste
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <ShareButton />
      </div>

      <GlassModal open={editing} onClose={() => setEditing(false)} label="Rediger liste">
        <div className="p-6 sm:p-8">
          <h2 className="mb-6 text-2xl font-semibold">Rediger liste</h2>
          <WishlistForm
            initial={{ title: list.title, description: list.description, cover_image_url: list.cover_image_url }}
            submitLabel={pending ? "Lagrer…" : "Lagre"}
            pending={pending}
            onSubmit={(values) =>
              startTransition(async () => {
                const res = await updateWishlist(list.id, values)
                if (!res.ok) return void toast.error(res.error)
                setEditing(false)
              })
            }
          />
        </div>
      </GlassModal>
    </header>
  )
}
