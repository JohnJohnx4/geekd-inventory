import {
  Typography,
  Container,
  Stack,
  Paper,
  Chip,
  Button,
  Divider,
} from "@mui/material";

import { db } from "../../lib/db";
import type { InventoryItem } from "../../lib/types";
import FilterItems from "../../components/FilterItems";
import { useItems } from "../../lib/useItems";

function clampInt(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.floor(n));
}

export default function StockRoomPage() {
  const {
    visibleItems,
    categories,
    itemTypes,
    category,
    itemType,
    stockStatus,
    setCategory,
    setStockStatus,
    setItemType,
  } = useItems();

  async function updateItem(id: string, patch: Partial<InventoryItem>) {
    await db.items.update(id, { ...patch, updatedAt: Date.now() });
  }

  async function adjustStorage(item: InventoryItem, delta: number) {
    await updateItem(item.id, {
      storageQty: clampInt(item.storageQty + delta),
    });
  }

  return (
    <>
      <FilterItems
        categories={categories}
        itemTypes={itemTypes}
        category={category}
        itemType={itemType}
        setCategory={setCategory}
        setItemType={setItemType}
        stockStatus={stockStatus}
        setStockStatus={setStockStatus}
      />

      <Container maxWidth="sm" sx={{ py: 2 }}>
        <Stack spacing={1.5}>
          {visibleItems.map((item) => (
            <Paper key={item.id} variant="outlined" sx={{ p: 1.5 }}>
              <Stack spacing={1}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack spacing={0.25}>
                    <Typography fontWeight={800}>{item.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.category}
                    </Typography>
                    {/* <Typography variant="caption" color="text.secondary">
                      Storage: {item.storageQty}
                      {typeof item.fridgeSpace === "number"
                        ? ` • Fridge: ${item.fridgeSpace}`
                        : ""}
                    </Typography> */}
                  </Stack>

                  <Chip
                    size="small"
                    color={item.storageQty === 0 ? "error" : "success"}
                    label={item.storageQty === 0 ? "Out" : "In Stock"}
                  />
                </Stack>

                <Divider />

                {/* Inline storage adjustment controls */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    variant="outlined"
                    onClick={() => adjustStorage(item, -5)}
                  >
                    -5
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => adjustStorage(item, -1)}
                  >
                    -1
                  </Button>

                  <Paper
                    variant="outlined"
                    sx={{
                      flex: 1,
                      height: 48,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="h6" fontWeight={900}>
                      {item.storageQty}
                    </Typography>
                  </Paper>

                  <Button
                    variant="outlined"
                    onClick={() => adjustStorage(item, +1)}
                  >
                    +1
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => adjustStorage(item, +5)}
                  >
                    +5
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Container>
    </>
  );
}
