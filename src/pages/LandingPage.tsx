import { Button, Container, Paper, Stack, Typography } from "@mui/material";

const LandingPage = () => {
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
          type="href"
          href="/inventory/bar"
        >
          Inventory Management
        </Button>
        <Button
          variant="contained"
          sx={{ p: 2 }}
          type="href"
          href="/weakest-link"
        >
          Weakest Link
        </Button>
        <Button variant="contained" sx={{ p: 2 }} type="href" href="/prizing">
          Prizing Calculator
        </Button>
      </Stack>
    </Container>
  );
};

export default LandingPage;
