import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  Divider,
  IconButton,
  Box,
  // Button,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";

type Denomination = {
  label: string;
  value: number;
  count: number;
};

type DrawerDenom = {
  label: string;
  value: number;
  count: number;
};

export function generateCashDrawer(target = 300): DrawerDenom[] {
  let remaining = target;

  const result: DrawerDenom[] = [];

  const preferred = [
    { label: "$20", value: 20, max: 8 },
    { label: "$10", value: 10, max: 8 },
    { label: "$5", value: 5, max: 12 },
    { label: "$1", value: 1, max: Infinity },
  ];

  for (const denom of preferred) {
    if (remaining <= 0) break;

    const maxBills = Math.min(Math.floor(remaining / denom.value), denom.max);

    if (maxBills > 0) {
      result.push({
        label: denom.label,
        value: denom.value,
        count: maxBills,
      });

      remaining -= maxBills * denom.value;
    }
  }

  // Safety fallback (should never hit, but protects edge cases)
  if (remaining > 0) {
    result.push({
      label: "$1",
      value: 1,
      count: remaining,
    });
    remaining = 0;
  }

  return result;
}

const DENOMS: Denomination[] = [
  { label: "$100", value: 100, count: 0 },
  { label: "$50", value: 50, count: 0 },
  { label: "$20", value: 20, count: 0 },
  { label: "$10", value: 10, count: 0 },
  { label: "$5", value: 5, count: 0 },
  { label: "$1", value: 1, count: 0 },
];

const coinDenoms = [
  { label: "25¢", value: 0.25 },
  { label: "10¢", value: 0.1 },
  { label: "5¢", value: 0.05 },
  { label: "1¢", value: 0.01 },
];

export default function CashCalculator() {
  const [denoms, setDenoms] = useState(DENOMS);
  // const [drawer, setDrawer] = useState<DrawerDenom[]>([]);
  const [coins, setCoins] = useState(
    coinDenoms.map((d) => ({ ...d, count: 0 }))
  );

  const updateCount = (index: number, newCount: number) => {
    setDenoms((prev) =>
      prev.map((d, i) =>
        i === index ? { ...d, count: Math.max(0, newCount) } : d
      )
    );
  };

  const incrementBills = (index: number) =>
    updateCount(index, denoms[index].count + 1);

  const decrementBills = (index: number) =>
    updateCount(index, denoms[index].count - 1);

  const billTotal = useMemo(
    () => denoms.reduce((sum, d) => sum + d.count * d.value, 0),
    [denoms]
  );

  const incrementCoin = (index: number) => {
    setCoins((prev) =>
      prev.map((c, i) => (i === index ? { ...c, count: c.count + 1 } : c))
    );
  };

  const decrementCoin = (index: number) => {
    setCoins((prev) =>
      prev.map((c, i) =>
        i === index && c.count > 0 ? { ...c, count: c.count - 1 } : c
      )
    );
  };

  const coinTotal = coins.reduce((sum, c) => sum + c.count * c.value, 0);
  const grandTotal = billTotal + coinTotal;

  // const handleCalculateDrawer = () => {
  //   const suggestedDrawer = generateCashDrawer(300);
  //   setDrawer(suggestedDrawer);
  // };

  return (
    <>
      <Card sx={{ maxWidth: 520, mx: "auto", borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" textAlign="center" gutterBottom>
            Cash Counter
          </Typography>

          <Stack spacing={2}>
            {denoms.map((d, index) => {
              const amount = d.count * d.value;

              return (
                <Card
                  key={d.value}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    py: 1.5,
                  }}
                >
                  <Stack spacing={1}>
                    {/* Denomination Label */}
                    <Typography variant="subtitle1" fontWeight={600}>
                      {d.label}
                    </Typography>

                    {/* Bill Controls */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <IconButton
                        size="large"
                        onClick={() => decrementBills(index)}
                      >
                        <RemoveIcon />
                      </IconButton>

                      <TextField
                        label="Bills"
                        type="number"
                        value={d.count}
                        onChange={(e) =>
                          updateCount(index, Number(e.target.value))
                        }
                        inputProps={{
                          inputMode: "numeric",
                          style: { textAlign: "center", fontSize: 18 },
                        }}
                        sx={{ width: 120 }}
                      />

                      <IconButton
                        size="large"
                        onClick={() => incrementBills(index)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Stack>

                    {/* Dollar Total */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign="center"
                    >
                      Total: <strong>${amount}</strong>
                    </Typography>
                  </Stack>
                </Card>
              );
            })}
          </Stack>

          <Accordion sx={{ mt: 2, borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack direction="row" spacing={1} alignItems="center">
                <MonetizationOnIcon fontSize="small" />
                <Typography fontWeight={600}>Coins</Typography>
                <Typography variant="body2" color="text.secondary">
                  (${coinTotal.toFixed(2)})
                </Typography>
              </Stack>
            </AccordionSummary>

            <AccordionDetails>
              <Stack spacing={2}>
                {coins.map((coin, index) => {
                  const amount = coin.count * coin.value;

                  return (
                    <Card
                      key={coin.value}
                      variant="outlined"
                      sx={{ borderRadius: 2, px: 2, py: 1.5 }}
                    >
                      <Stack spacing={1}>
                        <Typography fontWeight={600}>{coin.label}</Typography>

                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <IconButton
                            size="large"
                            onClick={() => decrementCoin(index)}
                          >
                            <RemoveIcon />
                          </IconButton>

                          <TextField
                            label="Qty"
                            type="number"
                            value={coin.count}
                            onChange={(e) =>
                              setCoins((prev) =>
                                prev.map((c, i) =>
                                  i === index
                                    ? {
                                        ...c,
                                        count: Number(e.target.value) || 0,
                                      }
                                    : c
                                )
                              )
                            }
                            inputProps={{
                              inputMode: "numeric",
                              style: {
                                textAlign: "center",
                                fontSize: 18,
                              },
                            }}
                            sx={{ width: 120 }}
                          />

                          <IconButton
                            size="large"
                            onClick={() => incrementCoin(index)}
                          >
                            <AddIcon />
                          </IconButton>
                        </Stack>

                        <Typography
                          variant="body2"
                          textAlign="center"
                          color="text.secondary"
                        >
                          Total: ${amount.toFixed(2)}
                        </Typography>
                      </Stack>
                    </Card>
                  );
                })}
              </Stack>
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>
      {/* <Stack p={2} mt={2}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => handleCalculateDrawer()}
        >
          Calculate Drawer Amount
        </Button>
      </Stack> */}

      {/* {drawer.length > 0 && (
        <CardContent>
          <Typography variant="h6" textAlign="center">
            Suggested $300 Drawer
          </Typography>

          <Stack spacing={1} mt={2}>
            {drawer.map((d) => (
              <Box key={d.value} display="flex" justifyContent="space-between">
                <Typography>{d.label}</Typography>
                <Typography>
                  {d.count} x ${d.value} = ${d.count * d.value}
                </Typography>
              </Box>
            ))}
          </Stack>
        </CardContent>
      )} */}

      <Box
        position="sticky"
        bottom={0}
        bgcolor="background.paper"
        zIndex={99}
        py={2}
        my={4}
      >
        <Divider />
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 600,
          }}
          textAlign="center"
          my={2}
        >
          Total: Coins ${coinTotal.toFixed(2)} + Bills $
          {billTotal.toLocaleString()} = $
          {grandTotal.toFixed(2).toLocaleString()}
        </Typography>
      </Box>
    </>
  );
}
