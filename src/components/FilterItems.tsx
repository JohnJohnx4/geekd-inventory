import { Chip, Container, Stack, IconButton } from "@mui/material";

import { useState } from "react";

import FilterIcon from "@mui/icons-material/FilterList";
import FilterOffIcon from "@mui/icons-material/FilterListOff";

interface FilterItemsProps {
  categories: string[];
  itemTypes: (string | undefined)[];
  stockStatus: "All" | "Full" | "Moderate" | "Low" | "Out";
  category: string;
  itemType: string;
  setCategory: (category: string) => void;
  setItemType: (itemType: string) => void;
  setStockStatus: (
    stockStatus: "All" | "Full" | "Moderate" | "Low" | "Out"
  ) => void;
}

const FilterItems = ({
  categories,
  itemTypes,
  category,
  itemType,
  stockStatus,
  setCategory,
  setItemType,
  setStockStatus,
}: FilterItemsProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const stockStatuses: ("All" | "Full" | "Moderate" | "Low" | "Out")[] = [
    "All",
    "Full",
    "Moderate",
    "Low",
    "Out",
  ];

  const handleClickCategory = (cat: string) => {
    setCategory(cat);
    setItemType("All");
    setStockStatus("All");
  };

  const handleClickItemType = (iType: string) => {
    setItemType(iType);
    setStockStatus("All");
  };

  return (
    <Container maxWidth="sm" sx={{ py: 1 }}>
      <IconButton onClick={() => setShowFilters(!showFilters)}>
        {showFilters ? <FilterOffIcon /> : <FilterIcon />}
      </IconButton>
      {showFilters && (
        <>
          <Stack direction="row" spacing={1} sx={{ overflowX: "auto", pb: 1 }}>
            {categories.map((cat) => (
              <Chip
                size="small"
                key={cat}
                label={cat}
                clickable
                color={category === cat ? "primary" : "default"}
                variant={category === cat ? "filled" : "outlined"}
                onClick={() => handleClickCategory(cat)}
                sx={{ flexShrink: 0 }}
              />
            ))}
          </Stack>
          <Stack direction="row" spacing={1} sx={{ overflowX: "auto", pb: 1 }}>
            {itemTypes
              .filter((i) => !!i)
              .map((iType, i) => (
                <Chip
                  size="small"
                  key={iType + "keys" + i}
                  label={iType}
                  clickable
                  color={itemType === iType ? "primary" : "default"}
                  variant={itemType === iType ? "filled" : "outlined"}
                  onClick={() => handleClickItemType(`${iType}`)}
                  sx={{ flexShrink: 0 }}
                />
              ))}
          </Stack>
          <Stack direction="row" spacing={1} sx={{ overflowX: "auto", pb: 1 }}>
            {stockStatuses.map((status) => (
              <Chip
                size="small"
                key={status + "statuskey"}
                label={status}
                clickable
                color={stockStatus === status ? "primary" : "default"}
                variant={stockStatus === status ? "filled" : "outlined"}
                onClick={() => setStockStatus(status)}
                sx={{ flexShrink: 0 }}
              />
            ))}
          </Stack>
        </>
      )}
    </Container>
  );
};

export default FilterItems;
