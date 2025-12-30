// src/pages/InventoryPage.tsx
import { useMemo, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Toolbar,
  Typography,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type { Category } from "../lib/types";
import { useItems } from "../lib/useItems";

const categories: Category[] = ["Concessions", "Cleaning", "Work Supplies"];

export default function InventoryPage() {
  const { items, loading } = useItems();

  const [categoryFilter, setCategoryFilter] = useState<Category | "All">("All");

  const filtered = useMemo(() => {
    if (categoryFilter === "All") return items;
    return items.filter((i) => i.category === categoryFilter);
  }, [items, categoryFilter]);

  const summary = useMemo(() => {
    const total = filtered.length;
    const lowAtBar = filtered.filter((i) => i.barQty <= i.barMin).length;
    const lowBackstock = filtered.filter(
      (i) => i.barQty + i.storageQty <= i.backstockMin
    ).length;
    return { total, lowAtBar, lowBackstock };
  }, [filtered]);

  return (
    <>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <Typography variant="h6">Inventory</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 2 }}>
        {/* Summary chips */}
        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }} flexWrap="wrap">
          <Chip label={`${summary.total} items`} />
          <Chip
            label={`${summary.lowAtBar} low at bar`}
            color={summary.lowAtBar > 0 ? "warning" : "default"}
          />
          <Chip
            label={`${summary.lowBackstock} backstock low`}
            color={summary.lowBackstock > 0 ? "error" : "default"}
          />
        </Stack>

        {loading ? (
          <Typography color="text.secondary">Loading…</Typography>
        ) : filtered.length === 0 ? (
          <Typography color="text.secondary">No items yet.</Typography>
        ) : (
          <Stack spacing={1.25}>
            {filtered.map((item) => {
              const totalQty = item.barQty + item.storageQty;
              const lowAtBar = item.barQty <= item.barMin;
              const lowBackstock = totalQty <= item.backstockMin;

              const statusChip = lowBackstock ? (
                <Chip size="small" color="error" label="Backstock low" />
              ) : lowAtBar ? (
                <Chip size="small" color="warning" label="Low at bar" />
              ) : (
                <Chip size="small" label="OK" />
              );

              return (
                <Paper key={item.id} variant="outlined" sx={{ p: 1.5 }}>
                  <Stack spacing={1}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box>
                        <Typography fontWeight={800}>{item.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.category}
                          {item.storageLocation
                            ? ` • Storage: ${item.storageLocation}`
                            : ""}
                        </Typography>
                      </Box>
                      {statusChip}
                    </Stack>

                    <Divider />

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip label={`Bar: ${item.barQty}`} />
                      <Chip label={`Storage: ${item.storageQty}`} />
                      <Chip label={`Total: ${totalQty}`} />
                      {typeof item.fridgeSpace === "number" && (
                        <Chip label={`Fridge: ${item.fridgeSpace}`} />
                      )}
                      {typeof item.stockUnderBar === "boolean" && (
                        <Chip
                          label={
                            item.stockUnderBar ? "Under bar" : "Not under bar"
                          }
                        />
                      )}
                    </Stack>

                    <Typography variant="caption" color="text.secondary">
                      Bar min: {item.barMin} • Min: {item.backstockMin} • Max:{" "}
                      {item.backstockMax}
                      {item.vendor ? ` • Vendor: ${item.vendor}` : ""}
                      {item.orderMultiple
                        ? ` • Case: ${item.orderMultiple}`
                        : ""}
                    </Typography>

                    {item.notes ? (
                      <Typography variant="caption" color="text.secondary">
                        Notes: {item.notes}
                      </Typography>
                    ) : null}
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
