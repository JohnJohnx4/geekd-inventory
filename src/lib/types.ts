export type Category = "Concessions" | "Cleaning" | "Work Supplies";
export type StorageLocation =
  | "Under Bar"
  | "Bathroom Cabinet"
  | "Bar Cabinet"
  | "Register Cabinet";

export type InventoryItem = {
  id: string;
  name: string;
  category: Category;
  itemType?: string;

  barQty: number;
  storageQty: number;

  barMin: number; // “low at bar”
  backstockMin: number; // minimum total desired
  backstockMax: number; // target total desired

  orderUnit?: string;
  orderMultiple?: number;
  vendor?: string;

  // NEW (optional) so we keep your sheet data
  fridgeSpace?: number; // capacity / facing count
  stockAtBar?: boolean; // TRUE/FALSE from your sheet
  expiration?: string; // keep as string for now
  storageLocation?: string; // e.g. "115"
  notes?: string;

  updatedAt: number;
};
