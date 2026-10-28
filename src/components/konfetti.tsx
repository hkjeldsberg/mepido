"use client"

import { motion, type TargetAndTransition } from "motion/react"

import { cn } from "@/lib/utils"

type Piece = {
  className: string
  drift: TargetAndTransition
  duration: number
}

// Positions are relative to the container; drift is a slow mirrored loop.
// `hero` frames the big front-page heading, `corner` stays clear of list headers.
const LAYOUTS: Record<"hero" | "corner", Piece[]> = {
  hero: [
    {
      className: "-top-24 -right-24 size-56 rounded-full bg-konfetti-yellow sm:-top-28 sm:-right-16 sm:size-80",
      drift: { y: [0, 10, 0], rotate: [0, 4, 0] },
      duration: 9,
    },
    {
      className: "top-24 right-[38%] size-5 rounded-full bg-konfetti-sky sm:top-16 sm:right-[30%] sm:size-6",
      drift: { y: [0, -8, 0], x: [0, 4, 0] },
      duration: 6,
    },
    {
      className: "top-44 right-[12%] size-10 rounded-[10px] bg-konfetti-pink sm:top-40 sm:right-[22%] sm:size-12",
      drift: { y: [0, 8, 0], rotate: [20, 32, 20] },
      duration: 7,
    },
    {
      className: "hidden top-8 right-[48%] size-3 rounded-full bg-konfetti-green md:block",
      drift: { y: [0, 6, 0] },
      duration: 5,
    },
    {
      className: "hidden top-56 right-[40%] size-4 rounded-[4px] bg-konfetti-yellow md:block",
      drift: { y: [0, -6, 0], rotate: [45, 60, 45] },
      duration: 8,
    },
  ],
  corner: [
    {
      className: "-top-20 -right-16 size-40 rounded-full bg-konfetti-yellow sm:-top-28 sm:-right-20 sm:size-72",
      drift: { y: [0, 8, 0], rotate: [0, 4, 0] },
      duration: 9,
    },
    {
      className: "top-4 right-36 size-3.5 rounded-full bg-konfetti-sky sm:top-10 sm:right-80 sm:size-5",
      drift: { y: [0, -6, 0], x: [0, 3, 0] },
      duration: 6,
    },
    {
      className: "top-10 right-6 size-7 rounded-[8px] bg-konfetti-pink sm:top-36 sm:right-6 sm:size-10",
      drift: { y: [0, 6, 0], rotate: [20, 32, 20] },
      duration: 7,
    },
    {
      className: "hidden top-20 right-[26rem] size-3 rounded-full bg-konfetti-green md:block",
      drift: { y: [0, 5, 0] },
      duration: 5,
    },
    {
      className: "hidden top-32 right-72 size-3.5 rounded-[4px] bg-konfetti-yellow md:block",
      drift: { y: [0, -5, 0], rotate: [45, 60, 45] },
      duration: 8,
    },
  ],
}

export function Konfetti({ variant = "hero", className }: { variant?: "hero" | "corner"; className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      {LAYOUTS[variant].map((piece, i) => (
        <motion.span
          key={i}
          className={cn("absolute block", piece.className)}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1, ...piece.drift }}
          transition={{
            opacity: { duration: 0.5, delay: i * 0.06 },
            scale: { type: "spring", stiffness: 260, damping: 18, delay: i * 0.06 },
            default: { duration: piece.duration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
          }}
        />
      ))}
    </div>
  )
}
