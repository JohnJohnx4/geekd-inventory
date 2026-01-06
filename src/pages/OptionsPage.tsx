import { Button, Container, Stack } from "@mui/material";
import type { AppScreen } from "../App";

interface Props {
  setScreen: (screen: AppScreen) => void;
}

const OptionsPage = ({ setScreen }: Props) => {
  return (
    <>
      <Container maxWidth="sm" sx={{ py: 1, mt: 2 }}>
        <Stack direction="column" spacing={1} sx={{ overflowX: "auto", pb: 1 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => setScreen("prizing")}
          >
            Prizing Calculator
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => setScreen("weakest-link")}
          >
            Weakest Link
          </Button>
        </Stack>
      </Container>
    </>
  );
};

export default OptionsPage;
