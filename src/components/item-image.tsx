"use client"

import { useState } from "react"
import { ImageOff } from "lucide-react"

import { cn } from "@/lib/utils"

type ItemImageProps = {
  src: string | null | undefined
  alt: string
  /** `cover` crops to fill (grid thumbnails), `contain` shows the whole image. */
  fit?: "cover" | "contain"
  className?: string
}

/**
 * Arbitrary user-supplied URLs, so a plain <img> (no next/image domain
 * allowlist) with a graceful fallback when the link is dead.
 */
export function ItemImage({ src, alt, fit = "cover", className }: ItemImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const failed = !src || failedSrc === src

  if (failed) {
    return (
      <div className={cn("grid place-items-center bg-muted text-muted-foreground", className)}>
        <ImageOff className="size-6 opacity-60" aria-hidden />
        <span className="sr-only">{alt}</span>
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => setFailedSrc(src)}
      className={cn(fit === "cover" ? "object-cover" : "object-contain", className)}
    />
  )
}
