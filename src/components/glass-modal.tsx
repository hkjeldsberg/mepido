"use client"

import { useEffect, useRef, useSyncExternalStore } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "motion/react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

const subscribeNoop = () => () => {}

/** Open modals, innermost last: only the top one handles Escape and Tab. */
const modalStack: object[] = []

type GlassModalProps = {
  open: boolean
  onClose: () => void
  /** Shared-layout id: the panel morphs from the element with the same id. */
  layoutId?: string
  label: string
  className?: string
  children: React.ReactNode
}

export function GlassModal({ open, onClose, layoutId, label, className, children }: GlassModalProps) {
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false)
  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <ModalBody onClose={onClose} layoutId={layoutId} label={label} className={className}>
          {children}
        </ModalBody>
      )}
    </AnimatePresence>,
    document.body
  )
}

function ModalBody({ onClose, layoutId, label, className, children }: Omit<GlassModalProps, "open">) {
  const panelRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    const token = {}
    modalStack.push(token)
    const previouslyFocused = document.activeElement as HTMLElement | null
    const panel = panelRef.current
    // Respect a child's autoFocus; otherwise focus the panel itself.
    if (!panel?.contains(document.activeElement)) panel?.focus({ preventScroll: true })

    const { overflow } = document.body.style
    document.body.style.overflow = "hidden"

    function onKeyDown(e: KeyboardEvent) {
      if (modalStack.at(-1) !== token) return
      if (e.key === "Escape") {
        e.stopPropagation()
        onCloseRef.current()
        return
      }
      if (e.key !== "Tab" || !panel) return
      const nodes = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)]
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      modalStack.splice(modalStack.indexOf(token), 1)
      document.body.style.overflow = overflow
      previouslyFocused?.focus({ preventScroll: true })
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <motion.div
        className="absolute inset-0 bg-black/25 backdrop-blur-sm dark:bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        aria-hidden
      />
      <motion.div
        ref={panelRef}
        layoutId={layoutId}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={cn(
          "glass-strong relative z-10 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl shadow-float outline-none sm:max-h-[88dvh] sm:max-w-lg sm:rounded-3xl",
          className
        )}
        style={{ borderRadius: 32 }}
        initial={layoutId ? undefined : { opacity: 0, y: 24, scale: 0.97 }}
        animate={layoutId ? undefined : { opacity: 1, y: 0, scale: 1 }}
        exit={layoutId ? { opacity: 0, transition: { duration: 0.15 } } : { opacity: 0, y: 16, scale: 0.98 }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Lukk"
          className="glass absolute top-3 right-3 z-20 grid size-9 place-items-center rounded-full text-foreground/70 transition hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <X className="size-4" />
        </button>
        <div className="overflow-y-auto overscroll-contain">{children}</div>
      </motion.div>
    </div>
  )
}
