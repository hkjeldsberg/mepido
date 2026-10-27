import "server-only"

import { sortItems } from "@/lib/items"
import { supabase } from "@/lib/supabase"
import type { Item, WishlistSummary, WishlistWithItems } from "@/lib/types"

export async function getWishlists(): Promise<WishlistSummary[]> {
  const { data, error } = await supabase()
    .from("wishlists")
    .select("*, items(image_url, position, is_starred)")
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)

  return data.map(({ items, ...list }) => {
    const sorted = sortItems(items as Item[])
    return {
      ...list,
      item_count: sorted.length,
      preview_images: sorted.slice(0, 4).map((i) => i.image_url),
    }
  })
}

export async function getWishlist(slug: string): Promise<WishlistWithItems | null> {
  const { data, error } = await supabase()
    .from("wishlists")
    .select("*, items(*)")
    .eq("slug", slug)
    .maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) return null
  return { ...data, items: sortItems(data.items) }
}
