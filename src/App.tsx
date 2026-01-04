import { useEffect, useState } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Box,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import BarIcon from "@mui/icons-material/LocalDrink";

import AddIcon from "@mui/icons-material/Add";

import InventoryPage from "./pages/Inventory";
import AddItemPage from "./pages/AddItemPage";
import StockingModePage from "./pages/StockRoomPage";
import { seedIfEmpty } from "./lib/seed";
import type { InventoryItem } from "./lib/types";
import ItemSettingsPage from "./pages/ItemSettingsPage";
import BarRestockPage from "./pages/BarStockPage";

type Screen = "inventory" | "115" | "bar" | "add" | "settings";

export default function App() {
  const [screen, setScreen] = useState<Screen>("bar");
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    seedIfEmpty();
  }, []);

  return (
    <Box sx={{ pb: 7 }}>
      {/* Main content */}
      {screen === "inventory" && (
        <InventoryPage
          onEditItem={(item) => {
            setEditingItem(item);
            setScreen("settings");
          }}
        />
      )}

      {screen === "bar" && (
        <BarRestockPage
          onBack={() => {
            setEditingItem(null);
            setScreen("inventory");
          }}
        />
      )}
      {screen === "115" && (
        <StockingModePage
          onBack={() => {
            setEditingItem(null);
            setScreen("inventory");
          }}
        />
      )}
      {screen === "settings" && editingItem && (
        <ItemSettingsPage
          item={editingItem}
          onBack={() => {
            setEditingItem(null);
            setScreen("inventory");
          }}
        />
      )}
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
            label="Add Item"
            value="add"
            icon={<AddIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
