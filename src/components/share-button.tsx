"use client"

import { Share } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export function ShareButton() {
  async function share() {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Lenke kopiert", { description: "Del den med dem som skal handle." })
    } catch {
      toast("Kopier lenken", { description: url })
    }
  }

  return (
    <Button size="lg" onClick={share} className="h-10 rounded-full px-5 shadow-soft">
      <Share data-icon="inline-start" />
      Del liste
    </Button>
  )
}
