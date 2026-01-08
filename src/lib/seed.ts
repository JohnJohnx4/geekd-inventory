import { db } from "./db";
import type { Category, InventoryItem } from "./types";
import { seedRows } from "./seedData";

export async function seedIfEmpty() {
  const count = await db.items.count();
  console.log("Seed check, item count:", count);
  if (count > 0) return;

  const now = Date.now();

  const items: InventoryItem[] = seedRows.map((row) => {
    const barQty = Math.max(0, Math.floor(row.barQty ?? 0));
    const storageQty = Math.max(0, Math.floor(row.storageQty ?? 0));

    const barMin = Math.max(0, Math.floor(row.barMin ?? 0));
    const backstockMin = Math.max(0, Math.floor(row.backstockMin ?? 0));

    let backstockMax = Math.max(0, Math.floor(row.backstockMax ?? 0));

    // 🔧 NORMALIZATION RULE
    if (backstockMax < backstockMin) {
      backstockMax = backstockMin;
    }

    const orderMultiple =
      row.orderMultiple && row.orderMultiple > 0
        ? Math.max(1, Math.floor(row.orderMultiple))
        : undefined;

    return {
      updatedAt: now,

      ...row,
      category: row.category as Category,
      barQty,
      storageQty,
      barMin,
      backstockMin,
      backstockMax,
      orderMultiple,
    };
  });

  await db.items.bulkAdd(items);
}
