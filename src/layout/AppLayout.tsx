import { useState } from "react";
import { Outlet, useNavigate } from "@tanstack/react-router";
import {
  AppBar,
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
} from "@mui/material";

import GeekLogo from "../assets/GEEKD-Logo.png";
import WeakestLinkIcon from "@mui/icons-material/Extension";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import PrizingIcon from "@mui/icons-material/EmojiEvents";
import InventoryIcon from "@mui/icons-material/Inventory";

export default function AppLayout() {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (link: string) => {
    handleClose();
    navigate({ to: link });
  };

  return (
    <Box sx={{ pb: 7 }}>
      <AppBar position="sticky">
        <Toolbar>
          <img
            src={GeekLogo}
            style={{
              width: "72px",
            }}
          />

          <Stack direction="row" sx={{ ml: "auto" }}>
            <IconButton onClick={handleClick} sx={{ ml: "auto" }}>
              <MenuIcon color="secondary" />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              slotProps={{
                list: {
                  "aria-labelledby": "basic-button",
                },
              }}
            >
              <MenuItem onClick={() => handleNavigation("/")}>
                <ListItemIcon>
                  <HomeIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Home</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleNavigation("/inventory/bar")}>
                <ListItemIcon>
                  <InventoryIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Inventory</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleNavigation("/weakest-link")}>
                <ListItemIcon>
                  <WeakestLinkIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Weakest Link</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleNavigation("/prizing")}>
                <ListItemIcon>
                  <PrizingIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Prizing Calculator</ListItemText>
              </MenuItem>
            </Menu>
          </Stack>
        </Toolbar>
      </AppBar>

      <Outlet />
    </Box>
  );
}
