// src/pages/InventoryPage.tsx
import { useMemo, useState } from "react";
import {
  AppBar,
  Box,
  Chip,
  Container,
  Paper,
  Stack,
  Toolbar,
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

interface Props {
  onEditItem?: (item: InventoryItem) => void;
}

export default function InventoryPage({ onEditItem }: Props) {
  const { items, loading, clearDatabase } = useItems();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [category, setCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ["All", ...Array.from(set).sort()];
  }, [items]);

  const visibleItems = useMemo(() => {
    return items.filter((i) => {
      if (category !== "All" && i.category !== category) return false;
      return true;
    });
  }, [items, category]);

  const summary = useMemo(() => {
    const total = items.length;
    const noBarStock = items.filter(
      (i) => i.category === "Concessions" && !i.stockAtBar
    ).length;
    const lowStorage = items.filter(
      (i) => i.storageQty <= i.backstockMin
    ).length;

    return { total, noBarStock, lowStorage };
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

  return (
    <>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <Typography variant="h6">Inventory Status</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 1 }}>
        <Button
          color="error"
          variant="contained"
          onClick={() => setConfirmOpen(true)}
        >
          Clear Inventory
        </Button>
      </Container>
      <Container maxWidth="sm" sx={{ py: 1 }}>
        <Stack direction="row" spacing={1} sx={{ overflowX: "auto", pb: 1 }}>
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
      </Container>

      <Container maxWidth="sm" sx={{ py: 2 }}>
        {/* Summary */}
        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }} flexWrap="wrap">
          <Chip label={`${summary.total} items`} />
          <Chip
            label={`${summary.noBarStock} Not stocked at bar`}
            color={summary.noBarStock > 0 ? "error" : "default"}
          />
          <Chip
            label={`${summary.lowStorage} storage low`}
            color={summary.lowStorage > 0 ? "warning" : "default"}
          />
        </Stack>

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
                <Paper key={item.id} variant="outlined" sx={{ p: 1.5 }}>
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

                        <Typography variant="caption" color="text.secondary">
                          {item.category}
                        </Typography>
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
      </Container>
    </>
  );
}
