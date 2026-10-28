import type { Metadata, Viewport } from "next"
import { Nunito } from "next/font/google"

import { Providers } from "@/components/providers"
import "./globals.css"

const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: { default: "Me Pido", template: "%s · Me Pido" },
  description: "Lag, del og hold styr på ønskelister.",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#12121a" },
  ],
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nb" className={`${nunito.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <Providers>
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
