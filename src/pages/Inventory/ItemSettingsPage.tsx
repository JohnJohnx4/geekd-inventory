import { useEffect, useState } from "react";
import {
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
import { db } from "../../lib/db";
import type { InventoryItem, Category } from "../../lib/types";
import { useNavigate } from "@tanstack/react-router";
import { inventorySettingsRoute } from "../../Router";
import { useItems } from "../../lib/useItems";

const categories: Category[] = ["Concessions", "Cleaning", "Work Supplies"];

export default function ItemSettingsPage() {
  const navigate = useNavigate();
  const { itemID } = inventorySettingsRoute.useParams();
  const { getItemById } = useItems();
  const [item, setItem] = useState<InventoryItem | null>(null);

  // const itemID
  const [form, setForm] = useState<InventoryItem>(
    item
      ? { ...item }
      : ({
          name: "",
          barMin: 0,
        } as InventoryItem)
  );
  const [saving, setSaving] = useState(false);

  // Derived item types
  const [itemTypes, setItemTypes] = useState<string[]>([]);
  const [addingType, setAddingType] = useState(false);
  const [newType, setNewType] = useState("");

  useEffect(() => {
    db.items.toArray().then((items) => {
      const types = Array.from(
        new Set(
          items
            .map((i) => i.itemType)
            .filter((t): t is string => !!t && t.trim() !== "")
        )
      ).sort();

      setItemTypes(types);
    });

    const fetchItem = async () => {
      const fetchedItem = await getItemById(itemID);
      if (fetchedItem) {
        setItem(fetchedItem);
        setForm(fetchedItem);
      }
    };
    void fetchItem();
  }, []);

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
    if (!item) return;
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
    navigate({ to: "/inventory/overview" });
  }

  function addItemType() {
    const trimmed = newType.trim();
    if (!trimmed) return;

    // Add locally so it appears immediately
    setItemTypes((prev) =>
      prev.includes(trimmed) ? prev : [...prev, trimmed].sort()
    );

    update("itemType", trimmed);
    setNewType("");
    setAddingType(false);
  }

  if (!item) {
    return (
      <Container maxWidth="sm" sx={{ py: 2 }}>
        <Typography variant="h6">Item not found.</Typography>
      </Container>
    );
  }

  return (
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

        {/* Item Type */}
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Typography fontWeight={800}>Item Type</Typography>

            <TextField
              select
              label="Item type"
              value={form.itemType ?? ""}
              onChange={(e) => {
                if (e.target.value === "__add_new__") {
                  setAddingType(true);
                } else {
                  update("itemType", e.target.value);
                }
              }}
              fullWidth
            >
              {itemTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}

              <Divider />

              <MenuItem value="__add_new__">+ Add new item type</MenuItem>
            </TextField>

            {addingType && (
              <Stack direction="row" spacing={1}>
                <TextField
                  label="New item type"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  fullWidth
                  autoFocus
                />

                <Button
                  variant="contained"
                  onClick={addItemType}
                  disabled={!newType.trim()}
                >
                  Add
                </Button>
              </Stack>
            )}
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
                  checked={form.stockAtBar ?? false}
                  onChange={(e) => update("stockAtBar", e.target.checked)}
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
              onChange={(e) => update("orderMultiple", number(e.target.value))}
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
  );
}
