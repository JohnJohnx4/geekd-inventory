import {
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

export default function BarInventoryPage() {
  const { items, removeFromStorage, setStockedAtBar } = useItems();

  const [category, setCategory] = useState<string>("All");
  const [itemType, setItemType] = useState<string>("All");

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ["All", ...Array.from(set).sort()];
  }, [items]);

  const itemTypes = useMemo(() => {
    const set = new Set(items.map((i) => i.itemType));
    return ["All", ...Array.from(set).sort()];
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

  return (
    <>
      <Container maxWidth="sm" sx={{ py: 1, mt: 2 }}>
        <Stack direction="row" spacing={1} sx={{ overflowX: "auto", pb: 1 }}>
          {categories.map((cat, i) => (
            <Chip
              key={cat + "keys" + i}
              label={cat}
              clickable
              color={category === cat ? "primary" : "default"}
              variant={category === cat ? "filled" : "outlined"}
              onClick={() => setCategory(cat)}
              sx={{ flexShrink: 0 }}
            />
          ))}
        </Stack>
        <Stack direction="row" spacing={1} sx={{ overflowX: "auto", pb: 1 }}>
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
      </Container>

      <Container maxWidth="sm" sx={{ py: 2 }}>
        <Stack spacing={1.25}>
          {visibleItems.map((item) => {
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
                        Stock in 115: {item.storageQty}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider />

                  {/* <Stack direction="row" spacing={1} flexWrap="wrap">
                    {/* <Chip
                      size="small"
                      color={atBar ? "success" : "error"}
                      label={atBar ? "At Bar" : "Not at Bar"}
                    /> 

                    {/* {lowAtBar && (
                      <Chip size="small" color="warning" label="Low at Bar" />
                    )} 

                   {storageLow && (
                      <Chip size="small" color="error" label="Backstock Low" />
                    )}
                  </Stack> */}

                  {/* Actions */}
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      color={item.stockAtBar ? "success" : "error"}
                      variant={item.stockAtBar ? "outlined" : "contained"}
                      onClick={() => setStockedAtBar(item, !item.stockAtBar)}
                    >
                      {item.stockAtBar ? "Stocked" : "Empty"}
                    </Button>

                    <Button
                      size="small"
                      variant="contained"
                      disabled={item.storageQty === 0}
                      onClick={() => removeFromStorage(item, 1)}
                    >
                      Take from 115
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
