import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

import AppLayout from "./layout/AppLayout";
import InventoryPage from "./pages/Inventory/Inventory";
import BarRestockPage from "./pages/Inventory/BarInventoryPage";
import StockingModePage from "./pages/Inventory/StockRoomInventoryPage";
import AddItemPage from "./pages/Inventory/AddItemPage";
import ItemSettingsPage from "./pages/Inventory/ItemSettingsPage";
import OptionsPage from "./pages/OptionsPage";
import StaircasePrizingCalculator from "./pages/PrizingCalculator";
import WeakestLinkTracker from "./pages/WeakestLink";
import LandingPage from "./pages/LandingPage";
import InventoryLayout from "./layout/InventoryLayout";

// --------------------
// Root layout
// --------------------
const rootRoute = createRootRoute({
  component: AppLayout,
});

// --------------------
// Routes
// --------------------
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const inventoryLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/inventory",
  component: InventoryLayout,
});

const inventoryRoute = createRoute({
  getParentRoute: () => inventoryLayoutRoute,
  path: "/overview",
  component: InventoryPage,
});

const barLayoutRoute = createRoute({
  getParentRoute: () => inventoryLayoutRoute,
  path: "/bar",
  component: BarRestockPage,
});

export const inventorySettingsRoute = createRoute({
  getParentRoute: () => inventoryLayoutRoute,
  path: "settings/$itemID",
  component: ItemSettingsPage,
});

const storageRoute = createRoute({
  getParentRoute: () => inventoryLayoutRoute,
  path: "/115",
  component: StockingModePage,
});

const addRoute = createRoute({
  getParentRoute: () => inventoryLayoutRoute,
  path: "/add",
  component: AddItemPage,
});

const optionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/options",
  component: OptionsPage,
});

const prizingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/prizing",
  component: StaircasePrizingCalculator,
});

const weakestLinkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/weakest-link",
  component: WeakestLinkTracker,
});

// --------------------
// Route tree
// --------------------
const routeTree = rootRoute.addChildren([
  dashboardRoute,
  inventoryLayoutRoute.addChildren([inventorySettingsRoute]),
  storageRoute,
  addRoute,
  optionsRoute,
  prizingRoute,
  weakestLinkRoute,
  barLayoutRoute,
  inventoryRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
