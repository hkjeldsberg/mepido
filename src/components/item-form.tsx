"use client"

import { useState } from "react"
import { Minus, Plus, Star } from "lucide-react"

import { ImageInput } from "@/components/image-input"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ItemInput } from "@/lib/types"
import { cn } from "@/lib/utils"

export const EMPTY_ITEM: ItemInput = {
  title: "",
  description: null,
  price_string: null,
  url: null,
  image_url: "",
  is_starred: false,
  quantity: 1,
}

type ItemFormProps = {
  initial?: ItemInput
  submitLabel: string
  onSubmit: (values: ItemInput) => void
  onCancel?: () => void
}

export function ItemForm({ initial = EMPTY_ITEM, submitLabel, onSubmit, onCancel }: ItemFormProps) {
  const [values, setValues] = useState<ItemInput>(initial)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = <K extends keyof ItemInput>(key: K, value: ItemInput[K]) =>
    setValues((v) => ({ ...v, [key]: value }))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!values.title.trim()) return setError("Gi ønsket en tittel.")
    if (!values.image_url) return setError("Legg til et bilde – last opp eller lim inn en lenke.")
    setError(null)
    onSubmit({
      ...values,
      title: values.title.trim(),
      description: values.description?.trim() || null,
      price_string: values.price_string?.trim() || null,
      url: values.url?.trim() || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5" noValidate>
      <ImageInput value={values.image_url} onChange={(url) => set("image_url", url)} onUploadingChange={setUploading} />

      <div className="grid gap-2">
        <Label htmlFor="item-title">Tittel</Label>
        <Input
          id="item-title"
          value={values.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="F.eks. Moccamaster kaffetrakter"
          maxLength={200}
          required
          autoFocus
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div className="grid gap-2">
          <Label htmlFor="item-price">Pris</Label>
          <Input
            id="item-price"
            value={values.price_string ?? ""}
            onChange={(e) => set("price_string", e.target.value)}
            placeholder="1299 eller 500 - 800 kr"
            maxLength={60}
          />
        </div>
        <div className="grid gap-2">
          <Label id="item-qty-label">Antall</Label>
          <div className="flex h-8 items-center rounded-lg border" role="group" aria-labelledby="item-qty-label">
            <button
              type="button"
              aria-label="Færre"
              onClick={() => set("quantity", Math.max(1, values.quantity - 1))}
              disabled={values.quantity <= 1}
              className="grid h-full w-8 place-items-center text-muted-foreground transition hover:text-foreground disabled:opacity-40"
            >
              <Minus className="size-3.5" />
            </button>
            <output aria-live="polite" className="w-8 text-center text-sm tabular-nums">
              {values.quantity}
            </output>
            <button
              type="button"
              aria-label="Flere"
              onClick={() => set("quantity", Math.min(99, values.quantity + 1))}
              disabled={values.quantity >= 99}
              className="grid h-full w-8 place-items-center text-muted-foreground transition hover:text-foreground disabled:opacity-40"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="item-url">Kjøpslenke</Label>
        <Input
          id="item-url"
          type="url"
          inputMode="url"
          value={values.url ?? ""}
          onChange={(e) => set("url", e.target.value)}
          placeholder="https://butikk.no/produkt"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="item-desc">Beskrivelse og notater</Label>
        <Textarea
          id="item-desc"
          value={values.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Farge, størrelse, modell …"
          rows={3}
          maxLength={4000}
        />
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={values.is_starred}
        onClick={() => set("is_starred", !values.is_starred)}
        className={cn(
          "flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          values.is_starred ? "border-star/50 bg-star/10" : "hover:bg-muted/60"
        )}
      >
        <Star
          className={cn("size-5 transition", values.is_starred ? "fill-star text-star" : "text-muted-foreground")}
          aria-hidden
        />
        <span className="grid">
          <span className="text-sm font-medium">Mest ønsket</span>
          <span className="text-xs text-muted-foreground">Vises øverst i listen</span>
        </span>
      </button>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" size="lg" className="h-10 rounded-full px-5 font-bold" onClick={onCancel}>
            Avbryt
          </Button>
        )}
        <Button type="submit" size="lg" disabled={uploading} className="h-10 rounded-full px-6 font-bold">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
