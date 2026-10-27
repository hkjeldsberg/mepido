"use server"

import { refresh } from "next/cache"

import { supabase } from "@/lib/supabase"
import type { ActionResult, Item, ItemInput, WishlistInput } from "@/lib/types"

// --- validation ------------------------------------------------------------

class InputError extends Error {}

function text(value: unknown, field: string, max: number, required = false) {
  const s = typeof value === "string" ? value.trim() : ""
  if (required && !s) throw new InputError(`${field} må fylles ut`)
  if (s.length > max) throw new InputError(`${field} er for lang (maks ${max} tegn)`)
  return s || null
}

function httpUrl(value: unknown, field: string, required = false) {
  const s = text(value, field, 2048, required)
  if (!s) return null
  try {
    const u = new URL(s)
    if (u.protocol === "http:" || u.protocol === "https:") return u.toString()
  } catch {}
  throw new InputError(`${field} må være en gyldig lenke (https://…)`)
}

function parseItem(input: ItemInput) {
  const quantity = Math.trunc(Number(input.quantity))
  if (!Number.isFinite(quantity) || quantity < 1 || quantity > 99) {
    throw new InputError("Antall må være mellom 1 og 99")
  }
  return {
    title: text(input.title, "Tittel", 200, true)!,
    description: text(input.description, "Beskrivelse", 4000),
    price_string: text(input.price_string, "Pris", 60),
    url: httpUrl(input.url, "Kjøpslenke"),
    image_url: httpUrl(input.image_url, "Bilde", true)!,
    is_starred: Boolean(input.is_starred),
    quantity,
  }
}

function parseWishlist(input: WishlistInput) {
  return {
    title: text(input.title, "Navn", 120, true)!,
    description: text(input.description, "Beskrivelse", 500),
    cover_image_url: httpUrl(input.cover_image_url, "Forsidebilde"),
  }
}

/** Runs a mutation, maps errors to Norwegian messages, refreshes the router. */
async function run<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    const data = await fn()
    refresh()
    return { ok: true, data }
  } catch (e) {
    if (e instanceof InputError) return { ok: false, error: e.message }
    console.error(e)
    return { ok: false, error: "Noe gikk galt. Prøv igjen." }
  }
}

function check<T>(res: { data: T; error: { message: string } | null }): NonNullable<T> {
  if (res.error) throw new Error(res.error.message)
  return res.data as NonNullable<T>
}

function slugify(title: string) {
  const base = title
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
  const suffix = crypto.randomUUID().slice(0, 6)
  return base ? `${base}-${suffix}` : suffix
}

// --- wishlists ---------------------------------------------------------------

export async function createWishlist(input: WishlistInput) {
  return run(async () => {
    const values = parseWishlist(input)
    const row = check(
      await supabase()
        .from("wishlists")
        .insert({ ...values, slug: slugify(values.title) })
        .select("slug")
        .single()
    )
    return row.slug as string
  })
}

export async function updateWishlist(id: string, input: WishlistInput) {
  return run(async () => {
    check(await supabase().from("wishlists").update(parseWishlist(input)).eq("id", id))
    return undefined
  })
}

export async function deleteWishlist(id: string) {
  return run(async () => {
    check(await supabase().from("wishlists").delete().eq("id", id))
    return undefined
  })
}

// --- items -------------------------------------------------------------------

export async function createItem(wishlistId: string, input: ItemInput) {
  return run(async () => {
    const values = parseItem(input)
    const last = check(
      await supabase()
        .from("items")
        .select("position")
        .eq("wishlist_id", wishlistId)
        .order("position", { ascending: false })
        .limit(1)
    )
    const position = (last[0]?.position ?? -1) + 1
    return check(
      await supabase()
        .from("items")
        .insert({ ...values, wishlist_id: wishlistId, position })
        .select()
        .single()
    ) as Item
  })
}

export async function updateItem(id: string, input: ItemInput) {
  return run(async () => {
    check(await supabase().from("items").update(parseItem(input)).eq("id", id))
    return undefined
  })
}

export async function setItemStarred(id: string, starred: boolean) {
  return run(async () => {
    check(await supabase().from("items").update({ is_starred: starred }).eq("id", id))
    return undefined
  })
}

export async function deleteItem(id: string) {
  return run(async () => {
    check(await supabase().from("items").delete().eq("id", id))
    return undefined
  })
}

/** Persists manual order: `ids[i]` gets position `i`. */
export async function reorderItems(wishlistId: string, ids: string[]) {
  return run(async () => {
    const db = supabase()
    const results = await Promise.all(
      ids.map((id, position) =>
        db.from("items").update({ position }).eq("id", id).eq("wishlist_id", wishlistId)
      )
    )
    results.forEach(check)
    return undefined
  })
}
