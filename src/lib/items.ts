import type { Item } from "@/lib/types"

/** Starred first, then manual order. */
export function sortItems<T extends Pick<Item, "is_starred" | "position">>(items: T[]) {
  return [...items].sort(
    (a, b) => Number(b.is_starred) - Number(a.is_starred) || a.position - b.position
  )
}
