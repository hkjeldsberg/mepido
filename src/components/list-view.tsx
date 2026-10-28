"use client"

import { useId, useOptimistic, useState, useTransition } from "react"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { motion } from "motion/react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { createItem, deleteItem, reorderItems, setItemStarred, updateItem } from "@/app/actions"
import { GlassModal } from "@/components/glass-modal"
import { ItemCard } from "@/components/item-card"
import { ItemDetail } from "@/components/item-detail"
import { ItemForm } from "@/components/item-form"
import { Konfetti } from "@/components/konfetti"
import { ListHeader } from "@/components/list-header"
import { sortItems } from "@/lib/items"
import type { ActionResult, Item, ItemInput, WishlistWithItems } from "@/lib/types"

type OptimisticAction =
  | { type: "add"; item: Item }
  | { type: "update"; id: string; values: Partial<ItemInput> }
  | { type: "delete"; id: string }
  | { type: "reorder"; ids: string[] }

function reduce(items: Item[], action: OptimisticAction): Item[] {
  switch (action.type) {
    case "add":
      return sortItems([...items, action.item])
    case "update":
      return sortItems(items.map((i) => (i.id === action.id ? { ...i, ...action.values } : i)))
    case "delete":
      return items.filter((i) => i.id !== action.id)
    case "reorder": {
      const pos = new Map(action.ids.map((id, index) => [id, index]))
      return sortItems(items.map((i) => ({ ...i, position: pos.get(i.id) ?? i.position })))
    }
  }
}

const isTemp = (id: string) => id.startsWith("temp-")

export function ListView({ list }: { list: WishlistWithItems }) {
  const dndId = useId()
  const [items, dispatch] = useOptimistic(list.items, reduce)
  const [, startTransition] = useTransition()
  // `selected` outlives `detailOpen` so the modal can morph back into its card on close.
  const [selected, setSelected] = useState<{ id: string; editing: boolean } | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [adding, setAdding] = useState(false)
  const [dragging, setDragging] = useState(false)

  const selectedItem = selected ? items.find((i) => i.id === selected.id) : undefined

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  /** Applies an optimistic change, runs the server action, reports failure. */
  function mutate(action: OptimisticAction, run: () => Promise<ActionResult<unknown>>) {
    startTransition(async () => {
      dispatch(action)
      const res = await run()
      if (!res.ok) toast.error(res.error)
    })
  }

  function add(values: ItemInput) {
    setAdding(false)
    const now = new Date().toISOString()
    const temp: Item = {
      ...values,
      id: `temp-${crypto.randomUUID()}`,
      wishlist_id: list.id,
      position: Math.max(-1, ...items.map((i) => i.position)) + 1,
      created_at: now,
      updated_at: now,
    }
    mutate({ type: "add", item: temp }, () => createItem(list.id, values))
  }

  function save(id: string, values: ItemInput) {
    setSelected({ id, editing: false })
    mutate({ type: "update", id, values }, () => updateItem(id, values))
  }

  function open(id: string, editing: boolean) {
    setSelected({ id, editing })
    setDetailOpen(true)
  }

  function remove(id: string) {
    setDetailOpen(false)
    mutate({ type: "delete", id }, () => deleteItem(id))
  }

  function toggleStar(item: Item) {
    const starred = !item.is_starred
    mutate({ type: "update", id: item.id, values: { is_starred: starred } }, () => setItemStarred(item.id, starred))
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setDragging(false)
    if (!over || active.id === over.id) return
    const from = items.findIndex((i) => i.id === active.id)
    const to = items.findIndex((i) => i.id === over.id)
    if (from < 0 || to < 0) return
    if (items[from].is_starred !== items[to].is_starred) {
      toast("Mest ønsket ligger alltid øverst", { description: "Fjern stjernen for å flytte ønsket ned." })
      return
    }
    const ids = arrayMove(items, from, to)
      .filter((i) => !isTemp(i.id))
      .map((i) => i.id)
    mutate({ type: "reorder", ids }, () => reorderItems(list.id, ids))
  }

  return (
    <div className="relative isolate">
      <Konfetti variant="corner" className="bottom-auto h-96" />
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <ListHeader list={list} itemCount={items.length} />

        <DndContext
          id={dndId}
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={() => setDragging(true)}
          onDragCancel={() => setDragging(false)}
          onDragEnd={handleDragEnd}
          accessibility={{
            screenReaderInstructions: {
              draggable: "Trykk mellomrom for å løfte ønsket. Bruk piltastene for å flytte, mellomrom for å slippe, Escape for å avbryte.",
            },
          }}
        >
          <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
            <ul className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  layoutEnabled={!dragging}
                  pending={isTemp(item.id)}
                  onOpen={() => open(item.id, false)}
                  onEdit={() => open(item.id, true)}
                  onDelete={() => remove(item.id)}
                  onToggleStar={() => toggleStar(item)}
                />
              ))}
              <li>
                <motion.button
                  type="button"
                  layoutId="add-item"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => setAdding(true)}
                  style={{ borderRadius: 32 }}
                  className="group flex h-full min-h-64 w-full flex-col items-center justify-center gap-3 border-2 border-dashed border-foreground/10 font-bold text-muted-foreground transition-colors outline-none hover:border-konfetti-blue/40 hover:text-konfetti-blue focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <span className="grid size-12 place-items-center rounded-full bg-konfetti-blue/10 text-konfetti-blue transition group-hover:bg-konfetti-blue group-hover:text-white">
                    <Plus className="size-5" strokeWidth={2.75} />
                  </span>
                  <span>Legg til ønske</span>
                </motion.button>
              </li>
            </ul>
          </SortableContext>
        </DndContext>

        <GlassModal open={adding} onClose={() => setAdding(false)} layoutId="add-item" label="Nytt ønske">
          <div className="p-6 sm:p-8">
            <h2 className="mb-6 text-3xl font-black">Nytt ønske</h2>
            <ItemForm submitLabel="Legg til" onSubmit={add} onCancel={() => setAdding(false)} />
          </div>
        </GlassModal>

        <GlassModal
          open={detailOpen && !!selectedItem}
          onClose={() => setDetailOpen(false)}
          layoutId={selectedItem ? `item-${selectedItem.id}` : undefined}
          label={selectedItem?.title ?? "Ønske"}
          className="sm:max-w-5xl"
        >
          {selectedItem && (
            <ItemDetail
              key={selectedItem.id}
              item={selectedItem}
              editing={selected?.editing ?? false}
              onEditingChange={(editing) => setSelected({ id: selectedItem.id, editing })}
              onSave={(values) => save(selectedItem.id, values)}
              onDelete={() => remove(selectedItem.id)}
              onToggleStar={() => toggleStar(selectedItem)}
            />
          )}
        </GlassModal>
      </div>
    </div>
  )
}
