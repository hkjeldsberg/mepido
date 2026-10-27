const nok = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 })

/**
 * Plain integers ("1299", "1 299") render as "1 299 kr". Anything else
 * ("500 - 800 kr", "ca. 300") is shown verbatim.
 */
export function formatPrice(price: string | null | undefined) {
  const raw = price?.trim()
  if (!raw) return null
  const digits = raw.replace(/[\s ]/g, "")
  if (/^\d+$/.test(digits)) return `${nok.format(Number(digits))} kr`
  return raw
}

export function pluralItems(n: number) {
  return n === 1 ? "1 ønske" : `${n} ønsker`
}
