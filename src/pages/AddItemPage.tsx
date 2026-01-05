import { useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import { nanoid } from "nanoid";
import styled from "styled-components";

import type { Category, InventoryItem } from "../lib/types";
import { db } from "../lib/db";

const PageCard = styled(Paper)`
  padding: 16px;
`;

const categories: Category[] = ["Concessions", "Cleaning", "Work Supplies"];

function toInt(value: string) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.floor(n));
}

type Props = {
  onBack?: () => void; // optional until you add routing
};

export default function AddItemPage({ onBack }: Props) {
  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("Concessions");

  const [barQty, setBarQty] = useState("0");
  const [storageQty, setStorageQty] = useState("0");

  const [barMin, setBarMin] = useState("0");
  const [backstockMin, setBackstockMin] = useState("0");
  const [backstockMax, setBackstockMax] = useState("0");

  const [orderUnit, setOrderUnit] = useState("");
  const [orderMultiple, setOrderMultiple] = useState("1");
  const [vendor, setVendor] = useState("");

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    open: boolean;
    msg: string;
    type: "success" | "error";
  }>({
    open: false,
    msg: "",
    type: "success",
  });

  const nameTrimmed = useMemo(() => name.trim(), [name]);

  const canSave = useMemo(() => {
    if (!nameTrimmed) return false;

    const bMin = toInt(barMin);
    const bsMin = toInt(backstockMin);
    const bsMax = toInt(backstockMax);

    // Allow zeros, but enforce: max >= min
    if (bsMax < bsMin) return false;

    // orderMultiple must be >= 1
    if (toInt(orderMultiple) < 1) return false;

    // barMin can be any non-negative
    if (bMin < 0) return false;

    return true;
  }, [nameTrimmed, barMin, backstockMin, backstockMax, orderMultiple]);

  async function save(andAddAnother: boolean) {
    if (!canSave || saving) return;

    setSaving(true);
    try {
      const now = Date.now();

      const item: InventoryItem = {
        id: nanoid(),
        name: nameTrimmed,
        category,

        barQty: toInt(barQty),
        storageQty: toInt(storageQty),

        barMin: toInt(barMin),
        backstockMin: toInt(backstockMin),
        backstockMax: toInt(backstockMax),

        orderUnit: orderUnit.trim(),
        orderMultiple: toInt(orderMultiple) || 1,
        vendor: vendor.trim(),

        updatedAt: now,
      };

      await db.items.add(item);

      setToast({ open: true, msg: `Added "${item.name}"`, type: "success" });

      if (andAddAnother) {
        // Keep category (usually same batch), reset the rest
        setName("");
        setBarQty("0");
        setStorageQty("0");
        setBarMin("0");
        setBackstockMin("0");
        setBackstockMax("0");
        setOrderUnit("");
        setOrderMultiple("1");
        setVendor("");
        // keep focus on name on mobile
        // (autofocus below will handle on rerender)
      } else {
        onBack?.();
      }
    } catch (e: any) {
      setToast({
        open: true,
        msg: e?.message ?? "Failed to add item",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Add Item
          </Typography>
          <Button
            color="inherit"
            startIcon={<SaveIcon />}
            onClick={() => save(false)}
            disabled={!canSave || saving}
          >
            Save
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 2 }}>
        <PageCard variant="outlined">
          <Stack spacing={2}>
            <TextField
              label="Item name"
              placeholder='e.g. "Coke Can"'
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
              >
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider />

            <Typography variant="subtitle2" color="text.secondary">
              Current counts
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                label="Bar qty"
                type="number"
                value={barQty}
                onChange={(e) => setBarQty(e.target.value)}
                fullWidth
              />
              <TextField
                label="Storage qty"
                type="number"
                value={storageQty}
                onChange={(e) => setStorageQty(e.target.value)}
                fullWidth
              />
            </Stack>

            <Divider />

            <Typography variant="subtitle2" color="text.secondary">
              Thresholds
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                label="Bar min (low)"
                type="number"
                value={barMin}
                onChange={(e) => setBarMin(e.target.value)}
                fullWidth
              />
              <TextField
                label="Backstock min"
                type="number"
                value={backstockMin}
                onChange={(e) => setBackstockMin(e.target.value)}
                fullWidth
              />
            </Stack>

            <TextField
              label="Backstock max (target)"
              type="number"
              value={backstockMax}
              onChange={(e) => setBackstockMax(e.target.value)}
              fullWidth
              helperText={
                toInt(backstockMax) < toInt(backstockMin)
                  ? "Max must be ≥ Min"
                  : "Used for suggested ordering later"
              }
              error={toInt(backstockMax) < toInt(backstockMin)}
            />

            <Divider />

            <Typography variant="subtitle2" color="text.secondary">
              Ordering (optional)
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                label="Order unit"
                placeholder="case / box / each"
                value={orderUnit}
                onChange={(e) => setOrderUnit(e.target.value)}
                fullWidth
              />
              <TextField
                label="Order multiple"
                type="number"
                value={orderMultiple}
                onChange={(e) => setOrderMultiple(e.target.value)}
                fullWidth
                helperText="e.g. 12 for a 12-pack"
                error={toInt(orderMultiple) < 1}
              />
            </Stack>

            <TextField
              label="Vendor (optional)"
              placeholder="Costco, Sysco, Amazon..."
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              fullWidth
            />

            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<SaveIcon />}
                disabled={!canSave || saving}
                onClick={() => save(false)}
              >
                Save & Back
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<AddIcon />}
                disabled={!canSave || saving}
                onClick={() => save(true)}
              >
                Save + Add Another
              </Button>
            </Stack>
          </Stack>
        </PageCard>
      </Container>

      <Snackbar
        open={toast.open}
        autoHideDuration={2200}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      >
        <Alert
          severity={toast.type}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          sx={{ width: "100%" }}
        >
          {toast.msg}
        </Alert>
      </Snackbar>
    </>
  );
}
