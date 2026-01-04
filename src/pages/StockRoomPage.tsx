import { useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Stack,
  Paper,
  Chip,
  Button,
  Divider,
  FormControlLabel,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ReplayIcon from "@mui/icons-material/Replay";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../lib/db";
import type { InventoryItem } from "../lib/types";

function clampInt(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.floor(n));
}

export default function BarRunPage() {
  const items = useLiveQuery(
    () => db.items.where("category").equals("Concessions").sortBy("name"),
    [],
    [] as InventoryItem[]
  );

  const [onlyUnderBar, setOnlyUnderBar] = useState(true);

  const visibleItems = useMemo(() => {
    if (!onlyUnderBar) return items;
    return items.filter((i) => i.stockUnderBar === true);
  }, [items, onlyUnderBar]);

  const lowCount = useMemo(() => {
    return visibleItems.filter((i) => i.barQty <= i.barMin).length;
  }, [visibleItems]);

  async function updateItem(id: string, patch: Partial<InventoryItem>) {
    await db.items.update(id, { ...patch, updatedAt: Date.now() });
  }

  // Restock dialog state
  const [restockOpen, setRestockOpen] = useState(false);
  const [restockItem, setRestockItem] = useState<InventoryItem | null>(null);
  const [restockAmount, setRestockAmount] = useState("0");

  function openRestock(item: InventoryItem) {
    setRestockItem(item);
    setRestockAmount("0");
    setRestockOpen(true);
  }

  async function applyRestock() {
    if (!restockItem) return;

    const amount = clampInt(Number(restockAmount));
    const take = Math.min(amount, restockItem.storageQty);

    await updateItem(restockItem.id, {
      barQty: restockItem.barQty + take,
      storageQty: restockItem.storageQty - take,
    });

    setRestockOpen(false);
    setRestockItem(null);
  }

  async function quickSetLow(item: InventoryItem) {
    // “Low” = set barQty to barMin (or 0 if barMin is 0)
    await updateItem(item.id, { barQty: clampInt(item.barMin) });
  }

  async function quickSetOut(item: InventoryItem) {
    await updateItem(item.id, { barQty: 0 });
  }

  async function adjustBar(item: InventoryItem, delta: number) {
    await updateItem(item.id, { barQty: clampInt(item.barQty + delta) });
  }

  return (
    <>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Restock 115 Storage
          </Typography>

          <Chip
            label={`${lowCount} low`}
            color={lowCount > 0 ? "warning" : "default"}
            sx={{ bgcolor: "white" }}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 2 }}>
        <Stack spacing={1.5}>
          <Paper variant="outlined" sx={{ p: 1.25 }}>
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Walk the bar and tap + / - to match what you see. Use “Restock”
                to move from storage.
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={onlyUnderBar}
                    onChange={(e) => setOnlyUnderBar(e.target.checked)}
                  />
                }
                label="Only items stocked under bar"
              />
            </Stack>
          </Paper>

          {visibleItems.map((item) => {
            const isLow = item.barQty <= item.barMin;

            return (
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
                        Bar min: {item.barMin} • Storage: {item.storageQty}
                        {typeof item.fridgeSpace === "number"
                          ? ` • Fridge space: ${item.fridgeSpace}`
                          : ""}
                      </Typography>
                    </Stack>

                    {isLow ? (
                      <Chip size="small" color="warning" label="Low" />
                    ) : (
                      <Chip size="small" label="OK" />
                    )}
                  </Stack>

                  <Divider />

                  {/* Big bar quantity controls */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                      variant="outlined"
                      sx={{ minWidth: 52, height: 48 }}
                      onClick={() => adjustBar(item, -1)}
                    >
                      <RemoveIcon />
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
                        {item.barQty}
                      </Typography>
                    </Paper>

                    <Button
                      variant="outlined"
                      sx={{ minWidth: 52, height: 48 }}
                      onClick={() => adjustBar(item, +1)}
                    >
                      <AddIcon />
                    </Button>
                  </Stack>

                  {/* Fast actions */}
                  <Stack direction="row" spacing={1}>
                    <Button
                      fullWidth
                      variant="text"
                      color="error"
                      onClick={() => quickSetOut(item)}
                    >
                      Out
                    </Button>

                    <Button
                      fullWidth
                      variant="text"
                      startIcon={<ReplayIcon />}
                      onClick={() => quickSetLow(item)}
                    >
                      Low
                    </Button>

                    <Button
                      fullWidth
                      variant="contained"
                      disabled={item.storageQty <= 0}
                      onClick={() => openRestock(item)}
                    >
                      Restock
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      </Container>

      {/* Restock dialog */}
      <Dialog
        open={restockOpen}
        onClose={() => setRestockOpen(false)}
        fullWidth
      >
        <DialogTitle>Restock from Storage</DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {restockItem?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Storage available: {restockItem?.storageQty ?? 0}
            </Typography>

            <TextField
              label="Move to bar"
              type="number"
              value={restockAmount}
              onChange={(e) => setRestockAmount(e.target.value)}
              fullWidth
              helperText="This subtracts from storage and adds to bar"
            />

            {/* Quick buttons */}
            <Stack direction="row" spacing={1}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setRestockAmount("1")}
              >
                +1
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() =>
                  setRestockAmount(
                    String(Math.min(6, restockItem?.storageQty ?? 0))
                  )
                }
              >
                +6
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() =>
                  setRestockAmount(String(restockItem?.storageQty ?? 0))
                }
              >
                All
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRestockOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={applyRestock}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
