import { Button, Container, Stack } from "@mui/material";
import type { AppScreen } from "../App";

interface Props {
  setScreen: (screen: AppScreen) => void;
}

const OptionsPage = ({ setScreen }: Props) => {
  return (
    <>
      <Container maxWidth="sm" sx={{ py: 1, mt: 2 }}>
        <Stack direction="row" spacing={1} sx={{ overflowX: "auto", pb: 1 }}>
          <Button onClick={() => setScreen("prizing")}>
            Prizing Calculator
          </Button>
        </Stack>
      </Container>
    </>
  );
};

export default OptionsPage;
