import { readFileSync } from "node:fs"
import { join } from "node:path"
import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

// Read once at module scope so the icon is prerendered at build time.
const svg = readFileSync(join(process.cwd(), "src/app/icon.svg"), "utf8").replaceAll('rx="15"', 'rx="0"')
const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`

/** Renders `icon.svg` full-bleed: iOS applies its own corner mask. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <img src={src} width={size.width} height={size.height} alt="" />
    ),
    size
  )
}
