import { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Stack,
  Divider,
  Chip,
} from "@mui/material";

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
  const [players, setPlayers] = useState(16);
  const [topCut, setTopCut] = useState(4);
  const [creditPerPack, setCreditPerPack] = useState(4);

  const prizes = useMemo(
    () => calculateStaircasePrizing(players, topCut),
    [players, topCut]
  );

  const totalPacks = players * 2;
  const totalCredit = totalPacks * creditPerPack;

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
          <TextField
            label="Players"
            type="number"
            value={players}
            inputProps={{ min: 1 }}
            onChange={(e) => setPlayers(Number(e.target.value))}
            fullWidth
          />

          <TextField
            label="Top Cut"
            type="number"
            value={topCut}
            inputProps={{ min: 1 }}
            onChange={(e) => setTopCut(Number(e.target.value))}
            fullWidth
          />
        </Stack>

        <TextField
          label="Store Credit per Pack ($)"
          type="number"
          value={creditPerPack}
          inputProps={{ min: 0 }}
          onChange={(e) => setCreditPerPack(Number(e.target.value))}
          fullWidth
          sx={{ mb: 2 }}
        />

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1}>
          {prizes.length === 0 ? (
            <Typography color="error" textAlign="center" variant="body2">
              Not enough packs to support this top cut.
            </Typography>
          ) : (
            prizes.map((packs, index) => {
              const credit = packs * creditPerPack;

              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1.25,
                    borderRadius: 2,
                    bgcolor:
                      index === 0
                        ? "success.light"
                        : index === 1
                        ? "info.light"
                        : "grey.100",
                  }}
                >
                  <Typography variant="body2">
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
                      color={index === 0 ? "success" : "default"}
                    />
                    <Chip
                      label={`$${credit}`}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                </Box>
              );
            })
          )}
        </Stack>

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
