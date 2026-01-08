import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Stack,
  Divider,
  Chip,
  IconButton,
  OutlinedInput,
  InputAdornment,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";

import ControlPointIcon from "@mui/icons-material/ControlPoint";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ArrowUpwardIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDropDown";

/**
 * Staircase prizing logic
 */
function calculateStaircasePrizing(
  playerCount: number,
  topCut: number,
  packsPerPlayer = 2
): number[] {
  const totalPacks = playerCount * packsPerPlayer;
  if (topCut <= 0 || topCut > totalPacks) return [];

  const packs = Array(topCut).fill(0);
  let remaining = totalPacks;
  let passSize = topCut;

  while (remaining > 0) {
    for (let i = 0; i < passSize && remaining > 0; i++) {
      packs[i] += 1;
      remaining -= 1;
    }
    passSize -= 1;
    if (passSize === 0) passSize = topCut;
  }

  return packs;
}

export default function StaircasePrizingCalculator() {
  const [players, setPlayers] = useState("16");
  const [topCut, setTopCut] = useState("4");
  const [creditPerPack, setCreditPerPack] = useState("4");

  const playersNum = Number(players) || 0;
  const topCutNum = Number(topCut) || 0;
  const creditNum = Number(creditPerPack) || 0;

  const prizes = useMemo(
    () => calculateStaircasePrizing(playersNum, topCutNum),
    [playersNum, topCutNum]
  );

  const basePrizes = useMemo(
    () => calculateStaircasePrizing(playersNum, topCutNum),
    [playersNum, topCutNum]
  );

  const [editablePrizes, setEditablePrizes] = useState<number[]>(basePrizes);

  const totalPacks = playersNum * 2;
  const totalCredit = totalPacks * creditNum;

  const handleIncrement = (target: string) => {
    if (target === "players") {
      setPlayers((prev) => {
        const num = Number(prev);
        return num < 0 ? "0" : String(num + 1);
      });
    } else if (target === "topCut") {
      setTopCut((prev) => {
        const num = Number(prev);
        return num < 0 ? "0" : String(num + 1);
      });
    } else if (target === "creditPerPack") {
      setCreditPerPack((prev) => {
        const num = Number(prev);
        return num < 0 ? "0" : String(num + 1);
      });
    }
  };

  const handleDecrement = (target: string) => {
    if (target === "players") {
      setPlayers((prev) => {
        const num = Number(prev);
        return num <= 1 ? "1" : String(num - 1);
      });
    } else if (target === "topCut") {
      setTopCut((prev) => {
        const num = Number(prev);
        return num <= 1 ? "1" : String(num - 1);
      });
    } else if (target === "creditPerPack") {
      setCreditPerPack((prev) => {
        const num = Number(prev);
        return num <= 0 ? "0" : String(num - 1);
      });
    }
  };

  const movePackUp = (index: number) => {
    if (index === 0) return;

    setEditablePrizes((prev) => {
      if (prev[index] <= 0) return prev;

      const next = [...prev];
      next[index] -= 1;
      next[index - 1] += 1;
      return next;
    });
  };

  const movePackDown = (index: number) => {
    if (index === editablePrizes.length - 1) return;

    setEditablePrizes((prev) => {
      if (prev[index] <= 0) return prev;

      const next = [...prev];
      next[index] -= 1;
      next[index + 1] += 1;
      return next;
    });
  };

  useEffect(() => {
    setEditablePrizes(basePrizes);
  }, [basePrizes]);

  return (
    <Card
      sx={{
        maxWidth: 480,
        mx: "auto",
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Typography variant="h6" textAlign="center" gutterBottom>
          Tournament Prizing
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2}>
          <Stack direction={"row"}>
            <IconButton onClick={() => handleDecrement("players")}>
              <RemoveCircleOutlineIcon />
            </IconButton>
            <TextField
              label="Players"
              type="number"
              value={players}
              onChange={(e) => setPlayers(e.target.value)}
              onBlur={() => {
                if (Number(players) < 0) setPlayers("0");
              }}
              fullWidth
            />
            <IconButton onClick={() => handleIncrement("players")}>
              <ControlPointIcon />
            </IconButton>
          </Stack>

          <Stack direction={"row"}>
            <IconButton onClick={() => handleDecrement("topCut")}>
              <RemoveCircleOutlineIcon />
            </IconButton>
            <TextField
              label="Top Cut"
              type="number"
              value={topCut}
              onChange={(e) => setTopCut(e.target.value)}
              onBlur={() => {
                if (Number(players) < 0) setPlayers("0");
              }}
              fullWidth
            />
            <IconButton onClick={() => handleIncrement("topCut")}>
              <ControlPointIcon />
            </IconButton>
          </Stack>
        </Stack>
        <Stack direction={"row"}>
          <IconButton onClick={() => handleDecrement("creditPerPack")}>
            <RemoveCircleOutlineIcon />
          </IconButton>
          <FormControl fullWidth>
            <InputLabel htmlFor="outlined-adornment-amount">
              Credit per Pack Rate
            </InputLabel>
            <OutlinedInput
              type="number"
              value={creditPerPack}
              onChange={(e) => setCreditPerPack(e.target.value)}
              fullWidth
              id="outlined-adornment-amount"
              label="Credit per Pack Rate"
              onBlur={() => {
                if (Number(players) < 0) setPlayers("0");
              }}
              sx={{ mb: 2 }}
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
            />
          </FormControl>
          <IconButton onClick={() => handleIncrement("creditPerPack")}>
            <ControlPointIcon />
          </IconButton>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={1} mt={1}>
          <Typography variant="caption">
            Use arrows to redistribute packs if allotments are unbalanced
          </Typography>
          {prizes.length === 0 ? (
            <Typography color="error" textAlign="center" variant="body2">
              Not enough packs to support this top cut.
            </Typography>
          ) : (
            editablePrizes.map((packs, index) => {
              const credit = packs * Number(creditPerPack);

              return (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1.25,
                    width: "100%",
                    borderRadius: 2,
                    bgcolor: index === 0 ? "info.light" : "primary.light",
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" sx={{ color: "white" }}>
                      {index + 1}
                      {index === 0
                        ? "st"
                        : index === 1
                        ? "nd"
                        : index === 2
                        ? "rd"
                        : "th"}
                    </Typography>

                    <Stack direction="row" spacing={1}>
                      <Chip
                        label={`${packs} packs`}
                        size="small"
                        color={index === 0 ? "primary" : "info"}
                        sx={{ color: "white" }}
                      />
                      <Chip
                        label={`$${credit}`}
                        size="small"
                        variant="outlined"
                        sx={{ color: "white" }}
                      />
                    </Stack>
                  </Stack>
                  <Stack direction="row">
                    {index !== 0 && (
                      <IconButton
                        size="small"
                        sx={{ color: "white" }}
                        onClick={() => movePackUp(index)}
                      >
                        <ArrowUpwardIcon />
                      </IconButton>
                    )}
                    {index < editablePrizes.length - 1 && (
                      <IconButton
                        size="small"
                        sx={{ color: "white" }}
                        onClick={() => movePackDown(index)}
                        disabled={index === editablePrizes.length - 1}
                      >
                        <ArrowDownwardIcon />
                      </IconButton>
                    )}
                  </Stack>
                </Box>
              );
            })
          )}
        </Stack>

        <Box my={2}>
          <Button
            disabled={editablePrizes === basePrizes}
            fullWidth
            variant="contained"
            color="error"
            onClick={() => setEditablePrizes(basePrizes)}
          >
            Reset Manual Distributions
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={0.5}>
          <Typography
            variant="caption"
            textAlign="center"
            color="text.secondary"
          >
            Total Packs: {totalPacks}
          </Typography>
          <Typography
            variant="caption"
            textAlign="center"
            color="text.secondary"
          >
            Total Store Credit: ${totalCredit}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
