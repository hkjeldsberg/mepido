"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { motion } from "motion/react"
import { GripVertical, Pencil, Star, Trash2 } from "lucide-react"

import { ItemImage } from "@/components/item-image"
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
import { formatPrice } from "@/lib/format"
import type { Item } from "@/lib/types"
import { cn } from "@/lib/utils"

type ItemCardProps = {
  item: Item
  /** Disable shared-layout morphing while a drag is in progress. */
  layoutEnabled: boolean
  pending: boolean
  onOpen: () => void
  onEdit: () => void
  onDelete: () => void
  onToggleStar: () => void
}

/** Hover-revealed on pointer devices, always visible on touch. */
const reveal =
  "opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100"

const actionButton =
  "glass grid size-9 place-items-center rounded-full text-foreground/80 shadow-sm transition hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"

export function ItemCard({ item, layoutEnabled, pending, onOpen, onEdit, onDelete, onToggleStar }: ItemCardProps) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled: pending,
  })
  const price = formatPrice(item.price_string)

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn("relative", isDragging && "z-20")}
    >
      <motion.div
        layoutId={layoutEnabled ? `item-${item.id}` : undefined}
        whileHover={isDragging ? undefined : { scale: 1.02, y: -2 }}
        style={{ borderRadius: 32 }}
        className={cn(
          "group relative flex h-full flex-col overflow-hidden bg-card shadow-soft ring-1 ring-foreground/5 transition-shadow hover:shadow-lift",
          isDragging && "shadow-float",
          pending && "pointer-events-none opacity-60"
        )}
      >
        <button
          type="button"
          onClick={onOpen}
          className="flex h-full flex-col text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset"
          style={{ borderRadius: 32 }}
        >
          <div className="relative aspect-square w-full overflow-hidden bg-muted">
            <ItemImage
              src={item.image_url}
              alt={item.title}
              className="size-full transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </div>
          <div className="flex flex-1 flex-col gap-1 p-4">
            <h3 className="line-clamp-2 leading-snug font-extrabold">{item.title}</h3>
            <div className="mt-auto flex items-center justify-between gap-2 pt-1">
              <span className="truncate font-black text-konfetti-blue tabular-nums">
                {price ?? <span className="text-sm font-semibold text-muted-foreground">Ingen pris</span>}
              </span>
              {item.quantity > 1 && (
                <span className="shrink-0 rounded-full bg-tile-pink px-2.5 py-0.5 text-xs font-bold text-tile-pink-fg tabular-nums">
                  {item.quantity} stk
                </span>
              )}
            </div>
          </div>
        </button>

        {/* Star: always visible when starred, otherwise hover-revealed. */}
        <button
          type="button"
          onClick={onToggleStar}
          aria-pressed={item.is_starred}
          aria-label={item.is_starred ? "Fjern fra mest ønsket" : "Merk som mest ønsket"}
          className={cn(actionButton, "absolute top-3 left-3", !item.is_starred && reveal)}
        >
          <Star className={cn("size-4", item.is_starred && "fill-star text-star")} />
        </button>

        <div className={cn("absolute top-3 right-3 flex gap-1.5", reveal)}>
          <button
            type="button"
            ref={setActivatorNodeRef}
            {...listeners}
            {...attributes}
            aria-label={`Flytt «${item.title}»`}
            className={cn(actionButton, "cursor-grab touch-none active:cursor-grabbing")}
          >
            <GripVertical className="size-4" />
          </button>
          <button type="button" onClick={onEdit} aria-label="Rediger" className={actionButton}>
            <Pencil className="size-4" />
          </button>
          <AlertDialog>
            <AlertDialogTrigger render={<button type="button" aria-label="Slett" className={actionButton} />}>
              <Trash2 className="size-4" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Slette ønsket?</AlertDialogTitle>
                <AlertDialogDescription>«{item.title}» fjernes fra listen.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Avbryt</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={onDelete}>
                  Slett
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </motion.div>
    </li>
  )
}
