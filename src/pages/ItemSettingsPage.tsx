import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Stack,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  MenuItem,
  Paper,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { db } from "../lib/db";
import type { InventoryItem, Category } from "../lib/types";

const categories: Category[] = ["Concessions", "Cleaning", "Work Supplies"];

export default function ItemSettingsPage({
  item,
  onBack,
}: {
  item: InventoryItem;
  onBack: () => void;
}) {
  const [form, setForm] = useState<InventoryItem>({ ...item });
  const [saving, setSaving] = useState(false);

  function update<K extends keyof InventoryItem>(
    key: K,
    value: InventoryItem[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function number(value: string) {
    const n = Math.floor(Number(value));
    return Number.isFinite(n) && n >= 0 ? n : 0;
  }

  async function save() {
    setSaving(true);

    const normalized = {
      ...form,
      backstockMax:
        form.backstockMax < form.backstockMin
          ? form.backstockMin
          : form.backstockMax,
      updatedAt: Date.now(),
    };

    await db.items.update(item.id, normalized);
    setSaving(false);
    onBack();
  }

  return (
    <>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <Typography variant="h6">Item Settings</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 2 }}>
        <Stack spacing={2}>
          {/* Basic info */}
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Typography fontWeight={800}>Basic</Typography>

              <TextField
                label="Item name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                fullWidth
              />

              <TextField
                select
                label="Category"
                value={form.category}
                onChange={(e) => update("category", e.target.value as Category)}
                fullWidth
              >
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </Paper>

          {/* Stock rules */}
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Typography fontWeight={800}>Stock Rules</Typography>

              <TextField
                label="Bar minimum"
                type="number"
                value={form.barMin}
                onChange={(e) => update("barMin", number(e.target.value))}
              />

              <Divider />

              <TextField
                label="Backstock minimum"
                type="number"
                value={form.backstockMin}
                onChange={(e) => update("backstockMin", number(e.target.value))}
              />

              <TextField
                label="Backstock maximum"
                type="number"
                value={form.backstockMax}
                onChange={(e) => update("backstockMax", number(e.target.value))}
                helperText="Will auto-normalize if lower than minimum"
              />
            </Stack>
          </Paper>

          {/* Location */}
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Typography fontWeight={800}>Location</Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={form.stockUnderBar ?? false}
                    onChange={(e) => update("stockUnderBar", e.target.checked)}
                  />
                }
                label="Stocked under bar"
              />

              <TextField
                label="Fridge space"
                type="number"
                value={form.fridgeSpace ?? ""}
                onChange={(e) => update("fridgeSpace", number(e.target.value))}
              />

              <TextField
                label="Storage location"
                value={form.storageLocation ?? ""}
                onChange={(e) => update("storageLocation", e.target.value)}
              />
            </Stack>
          </Paper>

          {/* Ordering */}
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Typography fontWeight={800}>Ordering</Typography>

              <TextField
                label="Vendor"
                value={form.vendor ?? ""}
                onChange={(e) => update("vendor", e.target.value)}
              />

              <TextField
                label="Case size"
                type="number"
                value={form.orderMultiple ?? ""}
                onChange={(e) =>
                  update("orderMultiple", number(e.target.value))
                }
                helperText="Units per case"
              />
            </Stack>
          </Paper>

          {/* Notes */}
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Typography fontWeight={800}>Notes</Typography>

              <TextField
                multiline
                minRows={3}
                label="Notes"
                value={form.notes ?? ""}
                onChange={(e) => update("notes", e.target.value)}
                fullWidth
              />
            </Stack>
          </Paper>

          <Button
            variant="contained"
            size="large"
            onClick={save}
            disabled={saving || !form.name}
          >
            Save Changes
          </Button>
        </Stack>
      </Container>
    </>
  );
}
