import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import type { InventoryItem } from "./types";
import { useMemo, useState } from "react";

export function useItems() {
  const items = useLiveQuery(
    () => db.items.orderBy("name").toArray(),
    [],
    [] as InventoryItem[]
  );

  const [category, setCategory] = useState<string>("All");
  const [itemType, setItemType] = useState<string>("All");
  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ["All", ...Array.from(set).sort()];
  }, [items]);

  const itemTypes = useMemo(() => {
    const set = new Set(items.map((i) => i.itemType));
    return ["All", "Uncategorized", ...Array.from(set).sort()];
  }, [items]);

  const visibleItems = useMemo(() => {
    console.log("items updated?", { category, itemType });
    return items.filter((i) => {
      console.log("filtering items?", i);
      // Category filter
      if (category !== "All" && i.category !== category) {
        return false;
      }
      console.log("filtering items: category ok");

      // Item type filter
      if (itemType !== "All") {
        if (itemType === "Uncategorized") {
          return i.itemType == null || i.itemType === "";
        }

        return i.itemType === itemType;
      }

      return true;
    });
  }, [items, category, itemType]);

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

  const setStockedAtBar = async (item: InventoryItem, stocked: boolean) => {
    await db.items.update(item.id, {
      stockAtBar: stocked,
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

  const removeFromStorage = async (item: InventoryItem, qty = 1) => {
    if (item.storageQty < qty) return;

    await db.items.update(item.id, {
      storageQty: item.storageQty + qty,
      updatedAt: Date.now(),
    });
  };

  const clearDatabase = async () => {
    await db.items.clear();
  };

  const updateItemTypeBulk = async (ids: string[], itemType: string) => {
    await db.transaction("rw", db.items, async () => {
      for (const id of ids) {
        await db.items.update(id, {
          itemType,
          updatedAt: Date.now(),
        });
      }
    });
  };

  return {
    items,
    visibleItems,
    categories,
    itemTypes,
    category,
    itemType,
    loading: items === undefined,
    setCategory,
    setItemType,
    updateItem,
    moveToBar,
    returnToStorage,
    setStockedAtBar,
    removeFromBar,
    removeFromStorage,
    clearDatabase,
    updateItemTypeBulk,
  };
}
