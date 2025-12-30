import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import type { InventoryItem } from "./types";

export function useItems() {
  const items = useLiveQuery(
    () => db.items.orderBy("name").toArray(),
    [],
    [] as InventoryItem[]
  );

  return {
    items,
    loading: items === undefined,
  };
}
