import {
  Typography,
  Container,
  Stack,
  Paper,
  Box,
  Divider,
  Button,
} from "@mui/material";
import { useItems } from "../../lib/useItems";
import FilterItems from "../../components/FilterItems";
import type { InventoryItem } from "../../lib/types";

export default function BarInventoryPage() {
  const {
    visibleItems,
    categories,
    itemTypes,
    category,
    itemType,
    stockStatus,
    setCategory,
    setItemType,
    setStockedAtBar,
    setStockStatus,
    setStockedStatus,
    removeFromStorage,
  } = useItems();

  const handleStockLoop = (item: InventoryItem) => {
    const statusFlow = [
      "Full",
      "Moderate",
      "Low",
      "Out",
    ] as (typeof item.stockStatus)[];
    const currentIndex = statusFlow.indexOf(item.stockStatus || "Out");
    const nextIndex = (currentIndex + 1) % statusFlow.length;
    const nextStatus = statusFlow[nextIndex] || "Out";
    setStockedStatus(item, nextStatus);
    setStockedAtBar(item, nextStatus !== "Out");
  };

  const handleRemoveFromStorage = (item: InventoryItem, qty = 1) => {
    if (item.storageQty === 0) return;
    removeFromStorage(item, qty);
    setStockedStatus(item, "Full");
  };

  const getStockStatusColor = (status?: string) => {
    switch (status) {
      case "Full":
        return "success";
      case "Moderate":
        return "success";
      case "Low":
        return "warning";
      case "Out":
      default:
        return "error";
    }
  };

  const getStockVariant = (status?: string) => {
    return status === "Out" || status === "Low" || !status
      ? "contained"
      : "outlined";
  };

  return (
    <>
      <FilterItems
        categories={categories}
        itemTypes={itemTypes}
        category={category}
        itemType={itemType}
        stockStatus={stockStatus}
        setCategory={setCategory}
        setItemType={setItemType}
        setStockStatus={setStockStatus}
      />

      <Container maxWidth="sm" sx={{ pb: 2 }}>
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
                      color={getStockStatusColor(item.stockStatus)}
                      variant={getStockVariant(item.stockStatus)}
                      onClick={() => handleStockLoop(item)}
                    >
                      {item.stockStatus || "Out"}
                    </Button>

                    <Button
                      size="small"
                      variant="contained"
                      disabled={item.storageQty === 0}
                      onClick={() => handleRemoveFromStorage(item, 1)}
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
