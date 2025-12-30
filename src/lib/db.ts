import Dexie, { type Table } from "dexie";
import type { InventoryItem } from "./types";

export class AppDB extends Dexie {
  items!: Table<InventoryItem, string>;

  constructor() {
    super("tcg_inventory_local");
    this.version(1).stores({
      items: "id, category, name, updatedAt",
    });
  }
}

export const db = new AppDB();
