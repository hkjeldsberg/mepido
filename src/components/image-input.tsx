"use client"

import { useId, useRef, useState } from "react"
import { ImagePlus, Link2, Loader2, Upload, X } from "lucide-react"

import { ItemImage } from "@/components/item-image"
import { Input } from "@/components/ui/input"
import { IMAGE_BUCKET, supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

const MAX_BYTES = 5 * 1024 * 1024
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]

type Mode = "upload" | "url"

type ImageInputProps = {
  value: string
  onChange: (url: string) => void
  onUploadingChange?: (uploading: boolean) => void
  label?: string
}

function isHttpUrl(s: string) {
  try {
    return ["http:", "https:"].includes(new URL(s).protocol)
  } catch {
    return false
  }
}

async function uploadImage(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const path = `${crypto.randomUUID()}.${ext}`
  const storage = supabase().storage.from(IMAGE_BUCKET)
  const { error } = await storage.upload(path, file, { contentType: file.type, cacheControl: "31536000" })
  if (error) throw error
  return storage.getPublicUrl(path).data.publicUrl
}

export function ImageInput({ value, onChange, onUploadingChange, label = "Bilde" }: ImageInputProps) {
  const id = useId()
  const fileRef = useRef<HTMLInputElement>(null)
  const [mode, setMode] = useState<Mode>("upload")
  const [draft, setDraft] = useState(value)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File | undefined) {
    if (!file) return
    setError(null)
    if (!ACCEPTED.includes(file.type)) return setError("Bruk JPG, PNG, WebP, GIF eller AVIF.")
    if (file.size > MAX_BYTES) return setError("Bildet er større enn 5 MB.")
    setUploading(true)
    onUploadingChange?.(true)
    try {
      onChange(await uploadImage(file))
    } catch {
      setError("Opplasting feilet. Prøv igjen.")
    } finally {
      setUploading(false)
      onUploadingChange?.(false)
    }
  }

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <span id={`${id}-label`} className="text-sm font-medium">
          {label}
        </span>
        <div role="tablist" aria-labelledby={`${id}-label`} className="flex rounded-full bg-muted p-0.5 text-xs">
          {(
            [
              ["upload", "Last opp", Upload],
              ["url", "Lenke", Link2],
            ] as const
          ).map(([m, text, Icon]) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => {
                setMode(m)
                if (m === "url") setDraft(value)
              }}
              className={cn(
                "flex items-center gap-1 rounded-full px-2.5 py-1 font-medium text-muted-foreground transition outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                mode === m && "bg-background text-foreground shadow-sm"
              )}
            >
              <Icon className="size-3" aria-hidden />
              {text}
            </button>
          ))}
        </div>
      </div>

      {mode === "url" ? (
        <>
          <Input
            type="url"
            inputMode="url"
            placeholder="https://…/bilde.jpg"
            aria-labelledby={`${id}-label`}
            value={draft}
            onChange={(e) => {
              // Commit live so the preview never shifts layout under a pending click.
              const v = e.target.value.trim()
              setDraft(e.target.value)
              onChange(isHttpUrl(v) ? v : "")
            }}
          />
          <div className="grid h-44 place-items-center overflow-hidden rounded-2xl border bg-muted/40 text-sm text-muted-foreground">
            {value ? (
              <ItemImage src={value} alt="Forhåndsvisning" fit="contain" className="size-full" />
            ) : (
              "Forhåndsvisning vises her"
            )}
          </div>
        </>
      ) : value ? (
        <div className="relative h-44 overflow-hidden rounded-2xl border bg-muted/40">
          <ItemImage src={value} alt="Forhåndsvisning" fit="contain" className="size-full" />
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Fjern bilde"
            className="glass absolute top-2 right-2 grid size-8 place-items-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            handleFile(e.dataTransfer.files[0])
          }}
          disabled={uploading}
          className={cn(
            "flex h-44 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed text-sm text-muted-foreground transition outline-none hover:border-foreground/30 hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50",
            dragOver && "border-foreground/40 bg-muted"
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="size-6 animate-spin" aria-hidden />
              Laster opp…
            </>
          ) : (
            <>
              <ImagePlus className="size-6" aria-hidden />
              <span>
                <span className="font-medium text-foreground">Velg bilde</span> eller dra det hit
              </span>
              <span className="text-xs">Maks 5 MB</span>
            </>
          )}
        </button>
      )}

      <input
        ref={fileRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          handleFile(e.target.files?.[0])
          e.target.value = ""
        }}
      />
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
