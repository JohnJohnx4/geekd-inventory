// src/pages/InventoryPage.tsx
import { useMemo, useState } from "react";
import {
  Box,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import EditIcon from "@mui/icons-material/Edit";

import { useItems } from "../lib/useItems";
import type { InventoryItem } from "../lib/types";
import BasicSpeedDial from "./SpeedDial";
import FilterItems from "../components/FilterItems";

interface Props {
  onEditItem?: (item: InventoryItem) => void;
}

export default function InventoryPage({ onEditItem }: Props) {
  const { items, visibleItems, loading, clearDatabase, updateItemTypeBulk } =
    useItems();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkType, setBulkType] = useState<string>("");

  const summary = useMemo(() => {
    const total = items.length;

    const lowQuantity = items.filter(
      (i) => i.storageQty <= i.backstockMin && i.storageQty !== 0
    ).length;

    const noQuantity = items.filter((i) => i.storageQty === 0).length;

    return { total, lowQuantity, noQuantity };
  }, [items]);

  async function handleClearDatabase() {
    try {
      setClearing(true);
      await clearDatabase();
      setConfirmOpen(false);
    } finally {
      setClearing(false);
    }
  }

  function toggleSelected(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
    setBulkType("");
  }

  const handleSetBulkType = (type: string) => {
    if (selectedIds.size === 0) return;
    setBulkType(type);
  };

  return (
    <>
      <FilterItems />

      <Container maxWidth="sm" sx={{ py: 2 }}>
        {/* Summary */}
        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }} flexWrap="wrap">
          <Chip label={`${summary.total} total items`} />
          <Chip
            label={`${summary.lowQuantity} low quantity`}
            color={"warning"}
          />
          <Chip label={`${summary.noQuantity} no quantity`} color={"error"} />
        </Stack>

        <Paper
          elevation={3}
          sx={{
            p: 1.25,
            mb: 1.5,
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Stack spacing={1}>
            <Typography fontWeight={700}>
              {selectedIds.size} selected
            </Typography>

            <Stack direction="row" spacing={1}>
              <Chip
                label="Drink"
                sx={{
                  color: selectedIds.size > 0 ? "#000" : "#aaa",
                }}
                variant={selectedIds.size > 0 ? "outlined" : "filled"}
                clickable={selectedIds.size > 0}
                onClick={() => handleSetBulkType("Drink")}
              />
              <Chip
                label="Food"
                sx={{
                  color: selectedIds.size > 0 ? "#000" : "#aaa",
                }}
                variant={selectedIds.size > 0 ? "outlined" : "filled"}
                clickable={selectedIds.size > 0}
                onClick={() => handleSetBulkType("Food")}
              />
              <Chip
                label="Supply"
                sx={{
                  color: selectedIds.size > 0 ? "#000" : "#aaa",
                }}
                variant={selectedIds.size > 0 ? "outlined" : "filled"}
                clickable={selectedIds.size > 0}
                onClick={() => handleSetBulkType("Supply")}
              />
              <Chip
                label="Clear"
                sx={{
                  color: selectedIds.size > 0 ? "#000" : "#aaa",
                }}
                variant={selectedIds.size > 0 ? "outlined" : "filled"}
                onClick={() => handleSetBulkType("")}
              />
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                disabled={!bulkType}
                onClick={async () => {
                  await updateItemTypeBulk(Array.from(selectedIds), bulkType);
                  clearSelection();
                }}
              >
                Apply
              </Button>

              <Button disabled={!bulkType} onClick={clearSelection}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {loading ? (
          <Typography color="text.secondary">Loading…</Typography>
        ) : items.length === 0 ? (
          <Typography color="text.secondary">No items yet.</Typography>
        ) : (
          <Stack spacing={1.25}>
            {visibleItems.map((item) => {
              const hasBarStock = item.barQty > 0;
              const barLow = item.barQty > 0 && item.barQty <= 1;
              const storageLow = item.storageQty <= item.backstockMin;

              return (
                <Paper
                  key={item.id}
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    borderColor: selectedIds.has(item.id)
                      ? "primary.main"
                      : undefined,
                    bgcolor: selectedIds.has(item.id)
                      ? "action.selected"
                      : undefined,
                  }}
                  onClick={() => toggleSelected(item.id)}
                >
                  <Stack spacing={1}>
                    {/* Header */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box>
                        <Typography fontWeight={800}>
                          <IconButton onClick={() => onEditItem?.(item)}>
                            <EditIcon />
                          </IconButton>
                          {item.name}
                        </Typography>

                        {item.category && (
                          <Chip label={item.category} sx={{ mr: 1 }} />
                        )}

                        {item.itemType && <Chip label={item.itemType} />}
                      </Box>

                      {/* Bar status */}
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        {hasBarStock ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <CancelIcon color="error" />
                        )}
                        {barLow && (
                          <WarningAmberIcon fontSize="small" color="warning" />
                        )}
                      </Stack>
                    </Stack>

                    <Divider />

                    {/* Storage info */}
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip
                        label={`Storage: ${item.storageQty}`}
                        color={storageLow ? "warning" : "default"}
                      />
                      <Chip label={`Min: ${item.backstockMin}`} />
                      <Chip label={`Max: ${item.backstockMax}`} />
                    </Stack>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        )}
        <Dialog
          open={confirmOpen}
          onClose={() => !clearing && setConfirmOpen(false)}
        >
          <DialogTitle>Clear Inventory?</DialogTitle>

          <DialogContent>
            <DialogContentText>
              This will permanently remove <strong>all inventory data</strong>{" "}
              from this device. This action cannot be undone.
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)} disabled={clearing}>
              Cancel
            </Button>

            <Button
              color="error"
              variant="contained"
              onClick={handleClearDatabase}
              disabled={clearing}
            >
              {clearing ? "Clearing…" : "Yes, Clear Everything"}
            </Button>
          </DialogActions>
        </Dialog>
        <div style={{ position: "fixed", bottom: 80, right: 16 }}>
          <BasicSpeedDial handleDelete={() => setConfirmOpen(true)} />
        </div>
      </Container>
    </>
  );
}
