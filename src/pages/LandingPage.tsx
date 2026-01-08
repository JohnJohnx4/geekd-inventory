import { Button, Container, Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Paper sx={{ p: 2, mt: 4 }}>
        <Typography variant="h1">Welcome to the Geekd Toolkit</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          A site with various tools to help manage your Geek'd work experience
        </Typography>
      </Paper>

      <Stack spacing={2} sx={{ mt: 4 }}>
        <Button
          variant="contained"
          sx={{ p: 2 }}
          onClick={() => navigate({ to: "/inventory/bar" })}
        >
          Inventory Management
        </Button>
        <Button
          variant="contained"
          sx={{ p: 2 }}
          onClick={() => navigate({ to: "/cash-calculator" })}
        >
          Cashout / Deposit Calculator
        </Button>
        <Button
          variant="contained"
          sx={{ p: 2 }}
          onClick={() => navigate({ to: "/prizing" })}
        >
          Prizing Calculator
        </Button>
        <Button
          variant="contained"
          sx={{ p: 2 }}
          onClick={() => navigate({ to: "/weakest-link" })}
        >
          Weakest Link
        </Button>
      </Stack>
    </Container>
  );
};

export default LandingPage;
