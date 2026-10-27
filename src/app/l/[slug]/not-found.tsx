import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="mx-auto grid max-w-md place-items-center gap-4 px-4 py-32 text-center">
      <h1 className="text-3xl font-semibold">Fant ikke listen</h1>
      <p className="text-muted-foreground">Lenken kan være feil, eller listen er slettet.</p>
      <Link href="/" className={buttonVariants({ size: "lg", className: "px-5" })}>
        Til forsiden
      </Link>
    </div>
  )
}
