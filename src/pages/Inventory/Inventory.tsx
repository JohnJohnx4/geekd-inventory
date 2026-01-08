// src/pages/InventoryPage.tsx
import { useMemo, useState } from "react";
import {
  Box,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";

import { useItems } from "../../lib/useItems";
import BasicSpeedDial from "../../components/SpeedDial";
import FilterItems from "../../components/FilterItems";
import type { InventoryItem } from "../../lib/types";
import { useNavigate } from "@tanstack/react-router";

export default function InventoryPage() {
  const navigate = useNavigate();
  const {
    items,
    visibleItems,
    loading,
    clearDatabase,
    updateItemTypeBulk,
    categories,
    itemTypes,
    category,
    itemType,
    setCategory,
    setStockStatus,
    stockStatus,
    setItemType,
  } = useItems();
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

  const getCategoryColor = (category: string | undefined) => {
    switch (category) {
      case "Cleaning":
        return "#1976d2";
      case "Concessions":
        return "#d41e11";
      case "Work Supplies":
        return "#00b8b8";
      default:
        return "#9e9e9e";
    }
  };

  const getTypeColor = (itemType: string | undefined) => {
    switch (itemType) {
      case "Drinks":
        return "#4caf50";
      case "Food":
        return "#ff9800";
      case "Supplies":
        return "#9c27b0";
      default:
        return "#9e9e9e";
    }
  };

  const handleEditItem = (item: InventoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate({ to: `/inventory/settings/${item.id}` });
  };

  return (
    <>
      <FilterItems
        categories={categories}
        itemTypes={itemTypes}
        category={category}
        itemType={itemType}
        setCategory={setCategory}
        setItemType={setItemType}
        setStockStatus={setStockStatus}
        stockStatus={stockStatus}
      />
      <Container maxWidth="sm" sx={{ py: 2 }}>
        <Paper
          elevation={3}
          sx={{
            p: 1.25,
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Stack spacing={1}>
            <Typography fontWeight={700}>
              {selectedIds.size} selected
            </Typography>
            {selectedIds.size > 0 && (
              <>
                <Stack direction="row" spacing={1}>
                  <Chip
                    size="small"
                    label="Drinks"
                    sx={{
                      color: selectedIds.size > 0 ? "#000" : "#aaa",
                    }}
                    variant={selectedIds.size > 0 ? "outlined" : "filled"}
                    clickable={selectedIds.size > 0}
                    onClick={() => handleSetBulkType("Drinks")}
                  />
                  <Chip
                    size="small"
                    label="Food"
                    sx={{
                      color: selectedIds.size > 0 ? "#000" : "#aaa",
                    }}
                    variant={selectedIds.size > 0 ? "outlined" : "filled"}
                    clickable={selectedIds.size > 0}
                    onClick={() => handleSetBulkType("Food")}
                  />
                  <Chip
                    size="small"
                    label="Supplies"
                    sx={{
                      color: selectedIds.size > 0 ? "#000" : "#aaa",
                    }}
                    variant={selectedIds.size > 0 ? "outlined" : "filled"}
                    clickable={selectedIds.size > 0}
                    onClick={() => handleSetBulkType("Supplies")}
                  />
                  <Chip
                    size="small"
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
                    size="small"
                    onClick={async () => {
                      await updateItemTypeBulk(
                        Array.from(selectedIds),
                        bulkType
                      );
                      clearSelection();
                    }}
                  >
                    Apply
                  </Button>

                  <Button
                    size="small"
                    disabled={!bulkType}
                    onClick={clearSelection}
                  >
                    Cancel
                  </Button>
                </Stack>
              </>
            )}
          </Stack>
        </Paper>
      </Container>
      <Container maxWidth="sm">
        {/* Summary */}

        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }} flexWrap="wrap">
          <Chip size="small" label={`${summary.total} total items`} />
          <Chip
            size="small"
            label={`${summary.lowQuantity} low stock`}
            color={"warning"}
          />
          <Chip
            size="small"
            label={`${summary.noQuantity} out of stock`}
            color={"error"}
          />
        </Stack>

        {loading ? (
          <Typography color="text.secondary">Loading…</Typography>
        ) : items.length === 0 ? (
          <Typography color="text.secondary">No items yet.</Typography>
        ) : (
          <Stack spacing={1}>
            {visibleItems.map((item) => {
              const hasStock = item.storageQty > 0;

              return (
                <Paper
                  key={item.id}
                  variant="outlined"
                  sx={{
                    p: 1,
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
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <IconButton
                            color="info"
                            size="small"
                            onClick={(e) => handleEditItem?.(item, e)}
                          >
                            <EditIcon />
                          </IconButton>

                          <Typography fontSize={14} fontWeight={800}>
                            {item.name}
                          </Typography>
                        </div>

                        <Chip
                          sx={{
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                          label={`${item.storageQty}`}
                          color={hasStock ? "success" : "error"}
                        />
                      </Box>

                      {/* Bar status */}
                      <Stack
                        direction="row"
                        spacing={0.75}
                        alignItems="center"
                      ></Stack>
                    </Stack>

                    {/* Storage info */}
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip
                        label={item.category ?? "No Category"}
                        sx={{
                          backgroundColor: getCategoryColor(item.category),
                          color: "#fff",
                        }}
                        size="small"
                      />

                      <Chip
                        size="small"
                        sx={{
                          backgroundColor: getTypeColor(item.category),
                          color: "#fff",
                        }}
                        label={item.itemType ?? "No Item Type"}
                      />
                      <Chip size="small" label={`Par: ${item.backstockMin}`} />
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
