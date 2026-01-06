import { Chip, Container, Stack, IconButton } from "@mui/material";

import { useState } from "react";

import FilterIcon from "@mui/icons-material/FilterList";
import FilterOffIcon from "@mui/icons-material/FilterListOff";
import { useItems } from "../lib/useItems";

const FilterItems = () => {
  const {
    categories,
    itemTypes,
    category,
    itemType,
    setCategory,
    setItemType,
  } = useItems();

  const [showFilters, setShowFilters] = useState(false);

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
                key={cat}
                label={cat}
                clickable
                color={category === cat ? "primary" : "default"}
                variant={category === cat ? "filled" : "outlined"}
                onClick={() => setCategory(cat)}
                sx={{ flexShrink: 0 }}
              />
            ))}
          </Stack>
          <Stack direction="row" spacing={1} sx={{ overflowX: "auto", pb: 1 }}>
            {itemTypes
              .filter((i) => !!i)
              .map((iType, i) => (
                <Chip
                  key={iType + "keys" + i}
                  label={iType}
                  clickable
                  color={itemType === iType ? "primary" : "default"}
                  variant={itemType === iType ? "filled" : "outlined"}
                  onClick={() => setItemType(`${iType}`)}
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
