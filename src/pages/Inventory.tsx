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
import FilterIcon from "@mui/icons-material/FilterList";
import FilterOffIcon from "@mui/icons-material/FilterListOff";

import { useItems } from "../lib/useItems";
import type { InventoryItem } from "../lib/types";
import BasicSpeedDial from "./SpeedDial";

interface Props {
  onEditItem?: (item: InventoryItem) => void;
}

export default function InventoryPage({ onEditItem }: Props) {
  const { items, loading, clearDatabase, updateItemTypeBulk } = useItems();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [category, setCategory] = useState<string>("All");
  const [itemType, setItemType] = useState<string>("All");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkType, setBulkType] = useState<string>("");

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ["All", ...Array.from(set).sort()];
  }, [items]);

  const itemTypes = useMemo(() => {
    const set = new Set(items.map((i) => i.itemType));
    return ["All", "Uncategorized", ...Array.from(set).sort()];
  }, [items]);

  const visibleItems = useMemo(() => {
    return items.filter((i) => {
      // Category filter
      if (category !== "All" && i.category !== category) {
        return false;
      }

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
      <Container maxWidth="sm" sx={{ py: 1 }}>
        <IconButton onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? <FilterOffIcon /> : <FilterIcon />}
        </IconButton>
        {showFilters && (
          <>
            <Stack
              direction="row"
              spacing={1}
              sx={{ overflowX: "auto", pb: 1 }}
            >
              {categories.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  clickable
                  color={category === cat ? "primary" : "default"}
                  variant={category === cat ? "filled" : "outlined"}
                  onClick={() => setCategory(cat)}
                  sx={{ flexShrink: 0 }}
                />
              ))}
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              sx={{ overflowX: "auto", pb: 1 }}
            >
              {itemTypes
                .filter((i) => !!i)
                .map((iType, i) => (
                  <Chip
                    key={iType + "keys" + i}
                    label={iType}
                    clickable
                    color={itemType === iType ? "primary" : "default"}
                    variant={itemType === iType ? "filled" : "outlined"}
                    onClick={() => setItemType(`${iType}`)}
                    sx={{ flexShrink: 0 }}
                  />
                ))}
            </Stack>
          </>
        )}
      </Container>

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
