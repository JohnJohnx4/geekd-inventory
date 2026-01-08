import * as React from "react";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import DeleteIcon from "@mui/icons-material/Delete";
import StorageIcon from "@mui/icons-material/Storage";
import { seedIfEmpty } from "../lib/seed";

const actions = [
  { icon: <DeleteIcon />, name: "Drop DB" },
  { icon: <StorageIcon />, name: "Seed DB" },
];
interface Props {
  handleDelete: () => void;
}
export default function InventorySpeedDial({ handleDelete }: Props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handlePress = (actionName: string) => {
    handleClose();
    if (actionName === "Drop DB") {
      handleDelete();
    }
    if (actionName === "Seed DB") {
      seedIfEmpty();
    }
  };

  return (
    <Box sx={{ height: 330, transform: "translateZ(0px)", flexGrow: 1 }}>
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            slotProps={{
              tooltip: {
                open: true,
                title: action.name,
              },
            }}
            onClick={() => handlePress(action.name)}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
