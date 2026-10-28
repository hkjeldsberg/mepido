"use client"

import { useState } from "react"
import { ExternalLink, Pencil, Star, Trash2 } from "lucide-react"

import { ItemForm } from "@/components/item-form"
import { ItemImage } from "@/components/item-image"
import { Button, buttonVariants } from "@/components/ui/button"
import { formatPrice } from "@/lib/format"
import type { Item, ItemInput } from "@/lib/types"
import { cn } from "@/lib/utils"

type ItemDetailProps = {
  item: Item
  editing: boolean
  onEditingChange: (editing: boolean) => void
  onSave: (values: ItemInput) => void
  onDelete: () => void
  onToggleStar: () => void
}

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return null
  }
}

export function ItemDetail({ item, editing, onEditingChange, onSave, onDelete, onToggleStar }: ItemDetailProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const price = formatPrice(item.price_string)
  const shop = item.url ? hostname(item.url) : null

  return (
    <div className="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <div className="relative bg-muted/50 md:min-h-[32rem]">
        <ItemImage
          src={item.image_url}
          alt={item.title}
          fit="contain"
          className="h-72 w-full p-6 sm:h-96 md:absolute md:inset-0 md:h-full md:p-10"
        />
      </div>

      <div className="flex flex-col p-6 sm:p-8">
        {editing ? (
          <>
            <h2 className="mb-6 pr-10 text-3xl font-black">Rediger ønske</h2>
            <ItemForm
              initial={{
                title: item.title,
                description: item.description,
                price_string: item.price_string,
                url: item.url,
                image_url: item.image_url,
                is_starred: item.is_starred,
                quantity: item.quantity,
              }}
              submitLabel="Lagre"
              onSubmit={onSave}
              onCancel={() => onEditingChange(false)}
            />
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onToggleStar}
              aria-pressed={item.is_starred}
              className={cn(
                "mb-4 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                item.is_starred ? "bg-star/15 text-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <Star className={cn("size-3.5", item.is_starred && "fill-star text-star")} aria-hidden />
              {item.is_starred ? "Mest ønsket" : "Merk som mest ønsket"}
            </button>

            <h2 className="pr-10 text-3xl leading-tight font-black sm:text-4xl">{item.title}</h2>

            <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className={cn("text-2xl font-black tabular-nums", price ? "text-konfetti-blue" : "text-muted-foreground")}>
                {price ?? "Ingen pris oppgitt"}
              </span>
              {item.quantity > 1 && (
                <span className="text-sm text-muted-foreground">Ønsker meg {item.quantity} stk</span>
              )}
            </div>

            {item.description && (
              <p className="mt-6 leading-relaxed whitespace-pre-line text-foreground/80">{item.description}</p>
            )}

            <div className="mt-8 grid gap-3 md:mt-auto md:pt-8">
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ size: "lg", className: "h-12 w-full rounded-full text-base" })}
                >
                  Kjøp her
                  <ExternalLink data-icon="inline-end" />
                </a>
              )}
              {shop && <p className="text-center text-xs text-muted-foreground">{shop}</p>}

              <div className="flex gap-2">
                <Button variant="secondary" size="lg" className="h-10 flex-1 rounded-full" onClick={() => onEditingChange(true)}>
                  <Pencil data-icon="inline-start" />
                  Rediger
                </Button>
                {confirmDelete ? (
                  <Button variant="destructive" size="lg" className="h-10 flex-1 rounded-full" onClick={onDelete} autoFocus>
                    Bekreft sletting
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="lg"
                    className="h-10 flex-1 rounded-full text-destructive hover:text-destructive"
                    onClick={() => setConfirmDelete(true)}
                  >
                    <Trash2 data-icon="inline-start" />
                    Slett
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
