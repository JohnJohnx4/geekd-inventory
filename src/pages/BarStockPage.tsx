import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Stack,
  Paper,
  Box,
  Chip,
  Divider,
  Button,
} from "@mui/material";
import { useItems } from "../lib/useItems";
import { useMemo, useState } from "react";

export default function BarRestockPage() {
  const { items, moveToBar, returnToStorage, removeFromBar } = useItems();

  const [category, setCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    console.log("Categories", set);
    return ["All", ...Array.from(set).sort()];
  }, [items]);

  const visibleItems = useMemo(() => {
    return items.filter((i) => {
      if (category !== "All" && i.category !== category) return false;
      return true;
    });
  }, [items, category]);

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6">Bar Restock</Typography>
        </Toolbar>
      </AppBar>

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
        <Stack spacing={1.25}>
          {visibleItems.map((item) => {
            const atBar = item.barQty > 0;
            const lowAtBar = atBar && item.barQty <= item.barMin;
            const totalQty = item.barQty + item.storageQty;
            const storageLow = totalQty <= item.backstockMin;

            return (
              <Paper key={item.id} variant="outlined" sx={{ p: 1.5 }}>
                <Stack spacing={1}>
                  {/* Header */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography fontWeight={700}>{item.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Bar: {item.barQty} • Storage: {item.storageQty}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider />

                  {/* Status */}
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip
                      size="small"
                      color={atBar ? "success" : "error"}
                      label={atBar ? "At Bar" : "Not at Bar"}
                    />

                    {lowAtBar && (
                      <Chip size="small" color="warning" label="Low at Bar" />
                    )}

                    {storageLow && (
                      <Chip size="small" color="error" label="Backstock Low" />
                    )}
                  </Stack>

                  {/* Actions */}
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      color="secondary"
                      disabled={item.barQty === 0}
                      onClick={() => removeFromBar(item, 1)}
                    >
                      Remove from Bar
                    </Button>

                    <Button
                      size="small"
                      color="secondary"
                      variant="contained"
                      disabled={item.barQty === 0}
                      onClick={() => returnToStorage(item, 1)}
                    >
                      Bar to 115
                    </Button>

                    <Button
                      size="small"
                      variant="contained"
                      disabled={item.storageQty === 0}
                      onClick={() => moveToBar(item, 1)}
                    >
                      115 to Bar
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      </Container>
    </>
  );
}
