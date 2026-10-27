import { createClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function create(url: string, key: string) {
  return createClient(url, key, {
    db: { schema: "mepido" },
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

let client: ReturnType<typeof create> | null = null

/**
 * Shared anon client bound to the `mepido` schema. No auth in v1, so one
 * client works on server and in the browser (storage uploads).
 */
export function supabase() {
  if (!url || !key) {
    throw new Error(
      "Mangler NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY i .env.local"
    )
  }
  client ??= create(url, key)
  return client
}

export const IMAGE_BUCKET = "item-images"
