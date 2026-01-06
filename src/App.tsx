import { useEffect, useState } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import BarIcon from "@mui/icons-material/LocalDrink";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import HanburgerIcon from "@mui/icons-material/Menu";

import InventoryPage from "./pages/Inventory";
import AddItemPage from "./pages/AddItemPage";
import StockingModePage from "./pages/StockRoomInventoryPage";
import { seedIfEmpty } from "./lib/seed";
import type { InventoryItem } from "./lib/types";
import ItemSettingsPage from "./pages/ItemSettingsPage";
import BarRestockPage from "./pages/BarInventoryPage";
import OptionsPage from "./pages/OptionsPage";
import StaircasePrizingCalculator from "./pages/PrizingCalculator";
import WeakestLinkTracker from "./pages/WeakestLink";

export type AppScreen =
  | "inventory"
  | "115"
  | "bar"
  | "add"
  | "settings"
  | "prizing"
  | "weakest-link"
  | "options";

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("bar");
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    seedIfEmpty();
  }, []);

  const getTitle = () => {
    switch (screen) {
      case "bar":
        return "Bar Inventory";
      case "115":
        return "115 Inventory";
      case "inventory":
        return "Inventory Status";
      case "settings":
        return "Item Settings";
      case "add":
        return "";
      default:
        "Page";
    }
  };

  return (
    <Box sx={{ pb: 7 }}>
      <AppBar position="sticky">
        <Toolbar>
          {screen === "settings" && (
            <Button
              variant="contained"
              sx={{
                marginRight: "1px",
              }}
              onClick={() => {
                setEditingItem(null);
                setScreen("inventory");
              }}
            >
              <ArrowLeftIcon />
            </Button>
          )}
          <Typography variant="h6">{getTitle()}</Typography>
        </Toolbar>
      </AppBar>
      {/* Main content */}
      {screen === "inventory" && (
        <InventoryPage
          onEditItem={(item) => {
            setEditingItem(item);
            setScreen("settings");
          }}
        />
      )}

      {screen === "bar" && <BarRestockPage />}
      {screen === "115" && <StockingModePage />}
      {screen === "settings" && editingItem && (
        <ItemSettingsPage
          onBack={() => {
            setEditingItem(null);
            setScreen("inventory");
          }}
          item={editingItem}
        />
      )}
      {screen === "options" && <OptionsPage setScreen={setScreen} />}
      {screen === "add" && (
        <AddItemPage onBack={() => setScreen("inventory")} />
      )}
      {screen === "prizing" && <StaircasePrizingCalculator />}
      {screen === "weakest-link" && <WeakestLinkTracker />}

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
          <BottomNavigationAction label="Bar" value="bar" icon={<BarIcon />} />
          <BottomNavigationAction
            label="115"
            value="115"
            icon={<LocalShippingIcon />}
          />
          <BottomNavigationAction
            label="Inventory"
            value="inventory"
            icon={<InventoryIcon />}
          />
          <BottomNavigationAction
            label="Other"
            value="options"
            icon={<HanburgerIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
