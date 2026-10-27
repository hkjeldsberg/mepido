export type Wishlist = {
  id: string
  slug: string
  title: string
  description: string | null
  cover_image_url: string | null
  created_at: string
  updated_at: string
}

export type Item = {
  id: string
  wishlist_id: string
  title: string
  description: string | null
  price_string: string | null
  url: string | null
  image_url: string
  is_starred: boolean
  quantity: number
  position: number
  created_at: string
  updated_at: string
}

export type WishlistSummary = Wishlist & {
  item_count: number
  preview_images: string[]
}

export type WishlistWithItems = Wishlist & { items: Item[] }

/** Editable item fields, shared by create/update forms and actions. */
export type ItemInput = {
  title: string
  description: string | null
  price_string: string | null
  url: string | null
  image_url: string
  is_starred: boolean
  quantity: number
}

export type WishlistInput = {
  title: string
  description: string | null
  cover_image_url: string | null
}

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string }
