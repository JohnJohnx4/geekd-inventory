import { Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
} from "@mui/material";

import InventoryIcon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import BarIcon from "@mui/icons-material/LocalDrink";

export default function InventoryLayout() {
  const navigate = useNavigate();
  const location = useRouterState({ select: (s) => s.location });

  const path = location.pathname;

  const navValue = path.endsWith("/overview")
    ? "overview"
    : path.endsWith("/115")
    ? "115"
    : path.endsWith("/options")
    ? "options"
    : "bar";

  console.log("navValue", navValue);
  return (
    <Box sx={{ pb: 7 }}>
      <Outlet />

      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={8}
      >
        <BottomNavigation
          value={navValue}
          onChange={(_, value) => navigate({ to: `/${value}` })}
          showLabels
        >
          <BottomNavigationAction
            label="Bar"
            value="inventory/bar"
            icon={
              <BarIcon color={navValue === "bar" ? "secondary" : "inherit"} />
            }
          />
          <BottomNavigationAction
            label="115"
            value="inventory/115"
            icon={
              <LocalShippingIcon
                color={navValue === "115" ? "secondary" : "inherit"}
              />
            }
          />
          <BottomNavigationAction
            label="Inventory"
            value="inventory/overview"
            icon={
              <InventoryIcon
                color={navValue === "overview" ? "secondary" : "inherit"}
              />
            }
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
