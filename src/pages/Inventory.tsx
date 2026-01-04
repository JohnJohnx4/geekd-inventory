// src/pages/InventoryPage.tsx
import { useMemo } from "react";
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
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import { useItems } from "../lib/useItems";
import type { InventoryItem } from "../lib/types";

interface Props {
  onEditItem?: (item: InventoryItem) => void;
}

export default function InventoryPage({ onEditItem }: Props) {
  const { items, loading } = useItems();

  const summary = useMemo(() => {
    const total = items.length;
    const noBarStock = items.filter((i) => i.barQty === 0).length;
    const lowStorage = items.filter(
      (i) => i.storageQty <= i.backstockMin
    ).length;

    return { total, noBarStock, lowStorage };
  }, [items]);

  return (
    <>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <Typography variant="h6">Inventory Status</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 2 }}>
        {/* Summary */}
        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }} flexWrap="wrap">
          <Chip label={`${summary.total} items`} />
          <Chip
            label={`${summary.noBarStock} missing at bar`}
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
            {items.map((item) => {
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
                        <Typography fontWeight={800}>{item.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.category}
                        </Typography>
                        <Button size="small" onClick={() => onEditItem?.(item)}>
                          Edit
                        </Button>
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
      </Container>
    </>
  );
}
