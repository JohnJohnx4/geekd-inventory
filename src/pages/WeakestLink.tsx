import { Button, Container, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useState } from "react";

const POINT_CHAIN = [100, 250, 500, 1000, 2500, 5000, 7500, 12500, 50000];

function TeamTracker({ name }: { name: string }) {
  const [totalPoints, setTotalPoints] = useState(0);
  const [chainIndex, setChainIndex] = useState(0);
  const [bankedThisRound, setBankedThisRound] = useState(false);

  const currentValue =
    POINT_CHAIN[chainIndex] ?? POINT_CHAIN[POINT_CHAIN.length - 1];

  const correctAnswer = () => {
    setTotalPoints((p) => p + currentValue);
    setChainIndex((i) => Math.min(i + 1, POINT_CHAIN.length - 1));
    setBankedThisRound(false);
  };

  const wrongAnswer = () => {
    if (!bankedThisRound) {
      setTotalPoints(0);
    }
    setChainIndex(0);
    setBankedThisRound(false);
  };

  const bank = () => {
    setBankedThisRound(true);
    setChainIndex(0);
  };

  const resetAll = () => {
    setTotalPoints(0);
    setChainIndex(0);
    setBankedThisRound(false);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4 space-y-3">
        <h2 className="text-xl font-semibold">{name}</h2>
        <Container>
          <Typography sx={{ fontSize: "32px" }}>
            Total Points: <strong>{totalPoints}</strong>
          </Typography>
          <div className="text-sm">
            Current Question Value: <strong>{currentValue}</strong>
          </div>
        </Container>
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            gap: "8px",
          }}
        >
          <Button
            sx={{
              padding: "16px",
              width: "50%",
            }}
            variant="contained"
            color="success"
            onClick={correctAnswer}
          >
            Correct
          </Button>
          <Button
            sx={{
              padding: "16px",
              width: "50%",
            }}
            color="error"
            variant="contained"
            onClick={wrongAnswer}
          >
            Wrong
          </Button>
        </div>
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            gap: "8px",
          }}
        >
          <Button
            sx={{
              padding: "16px",
              width: "50%",
            }}
            variant="contained"
            onClick={bank}
          >
            Bank
          </Button>
          <Button
            sx={{
              padding: "16px",
              width: "50%",
            }}
            variant="outlined"
            onClick={resetAll}
          >
            Reset
          </Button>
        </div>
        {bankedThisRound && (
          <div className="text-xs text-green-600">
            Banked — points safe this question
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function WeakestLinkTracker() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <TeamTracker name="Team A" />
      <TeamTracker name="Team B" />
      <TeamTracker name="FINAL ROUND" />
    </div>
  );
}
