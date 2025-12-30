import { useEffect, useState } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Box,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AddIcon from "@mui/icons-material/Add";

import InventoryPage from "./pages/Inventory";
import AddItemPage from "./pages/AddItemPage";
import StockingModePage from "./pages/BarRunMode";
import { seedIfEmpty } from "./lib/seed";

type Screen = "inventory" | "stocking" | "add";

export default function App() {
  const [screen, setScreen] = useState<Screen>("inventory");

  useEffect(() => {
    seedIfEmpty();
  }, []);

  return (
    <Box sx={{ pb: 7 }}>
      {/* Main content */}
      {screen === "inventory" && <InventoryPage />}
      {screen === "stocking" && <StockingModePage />}
      {screen === "add" && (
        <AddItemPage onBack={() => setScreen("inventory")} />
      )}

      {/* Bottom navigation */}
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={8}
      >
        <BottomNavigation
          value={screen}
          onChange={(_, value) => setScreen(value)}
          showLabels
        >
          <BottomNavigationAction
            label="Inventory"
            value="inventory"
            icon={<InventoryIcon />}
          />
          <BottomNavigationAction
            label="Stocking"
            value="stocking"
            icon={<LocalShippingIcon />}
          />
          <BottomNavigationAction
            label="Add Item"
            value="add"
            icon={<AddIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
