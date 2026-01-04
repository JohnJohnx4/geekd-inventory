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
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useItems } from "../lib/useItems";

export default function BarRestockPage() {
  const { items, moveToBar, returnToStorage, removeFromBar } = useItems();

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6">Bar Restock</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 2 }}>
        <Stack spacing={1.25}>
          {items.map((item) => {
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
