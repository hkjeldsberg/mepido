"use client"

import { useState } from "react"

import { ImageInput } from "@/components/image-input"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { WishlistInput } from "@/lib/types"

type WishlistFormProps = {
  initial?: WishlistInput
  submitLabel: string
  pending?: boolean
  onSubmit: (values: WishlistInput) => void
}

export function WishlistForm({
  initial = { title: "", description: null, cover_image_url: null },
  submitLabel,
  pending,
  onSubmit,
}: WishlistFormProps) {
  const [values, setValues] = useState(initial)
  const [uploading, setUploading] = useState(false)

  return (
    <form
      className="grid gap-5"
      onSubmit={(e) => {
        e.preventDefault()
        if (!values.title.trim()) return
        onSubmit({
          title: values.title.trim(),
          description: values.description?.trim() || null,
          cover_image_url: values.cover_image_url || null,
        })
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="list-title">Navn på listen</Label>
        <Input
          id="list-title"
          value={values.title}
          onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
          placeholder="F.eks. Jul 2026"
          maxLength={120}
          required
          autoFocus
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="list-desc">Beskrivelse</Label>
        <Textarea
          id="list-desc"
          value={values.description ?? ""}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
          placeholder="Valgfritt"
          rows={2}
          maxLength={500}
        />
      </div>
      <ImageInput
        label="Forsidebilde (valgfritt)"
        value={values.cover_image_url ?? ""}
        onChange={(url) => setValues((v) => ({ ...v, cover_image_url: url }))}
        onUploadingChange={setUploading}
      />
      <div className="flex justify-end">
        <Button type="submit" size="lg" className="px-5" disabled={pending || uploading || !values.title.trim()}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
