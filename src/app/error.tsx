"use client"

import { Button } from "@/components/ui/button"

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="mx-auto grid max-w-md place-items-center gap-4 px-4 py-32 text-center">
      <h1 className="text-3xl font-semibold">Noe gikk galt</h1>
      <p className="text-muted-foreground">
        {process.env.NODE_ENV === "development" ? error.message : "Vi fikk ikke hentet ønskelistene. Prøv igjen."}
      </p>
      <Button size="lg" className="px-5" onClick={() => retry()}>
        Prøv igjen
      </Button>
    </div>
  )
}
