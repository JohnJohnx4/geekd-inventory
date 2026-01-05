import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import type { InventoryItem } from "./types";

export function useItems() {
  const items = useLiveQuery(
    () => db.items.orderBy("name").toArray(),
    [],
    [] as InventoryItem[]
  );

  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    await db.items.update(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  };

  const moveToBar = async (item: InventoryItem, qty = 1) => {
    if (item.storageQty < qty) return;

    await db.items.update(item.id, {
      barQty: item.barQty + qty,
      storageQty: item.storageQty - qty,
      updatedAt: Date.now(),
    });
  };

  const returnToStorage = async (item: InventoryItem, qty = 1) => {
    if (item.barQty < qty) return;

    await db.items.update(item.id, {
      barQty: item.barQty - qty,
      storageQty: item.storageQty + qty,
      updatedAt: Date.now(),
    });
  };

  const removeFromBar = async (item: InventoryItem, qty = 1) => {
    if (item.barQty < qty) return;

    await db.items.update(item.id, {
      barQty: item.barQty - qty,
      updatedAt: Date.now(),
    });
  };

  return {
    items,
    loading: items === undefined,
    updateItem,
    moveToBar,
    returnToStorage,
    removeFromBar,
  };
}
