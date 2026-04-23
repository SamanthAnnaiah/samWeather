import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import TuneIcon from "@mui/icons-material/Tune";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckIcon from "@mui/icons-material/Check";

const formatGroupName = (name) => name.replace(/([A-Z])/g, " $1").trim();

export function MultiSelectorCheckbox({
  optionsGroup = {},
  selectedValues = [],
  setSelectedValues,
  isVisible = true,
  isEditable = true,
  heading = "Units",
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => {
    if (!isEditable) return;
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleSelect = (groupOptions, value) => {
    if (typeof setSelectedValues !== "function") return;
    const groupValues = groupOptions.map((o) => o.value);
    const filtered = selectedValues.filter((v) => !groupValues.includes(v));
    setSelectedValues([...filtered, value]);
  };

  if (!isVisible) return null;

  return (
    <Box className="multi-selector">
      <Button
        className={`multi-selector__trigger${
          open ? " multi-selector__trigger--open" : ""
        }`}
        disabled={!isEditable}
        endIcon={<KeyboardArrowDownIcon className="multi-selector__chevron" />}
        onClick={handleOpen}
        startIcon={<TuneIcon />}
        variant="outlined"
      >
        {heading}
      </Button>

      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={handleClose}
        open={open}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: { className: "multi-selector__popup" },
        }}
      >
        <Box className="multi-selector__content">
          {Object.entries(optionsGroup).map(([groupName, options]) => (
            <Box key={groupName} className="multi-selector__group">
              <Typography className="multi-selector__group-label">
                {formatGroupName(groupName)}
              </Typography>
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <Box
                    key={option.value}
                    className={`multi-selector__option${
                      isSelected ? " multi-selector__option--selected" : ""
                    }`}
                    onClick={() => handleSelect(options, option.value)}
                  >
                    <span className="multi-selector__option-label">
                      {option.label}
                    </span>
                    {isSelected && (
                      <CheckIcon className="multi-selector__check" />
                    )}
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      </Popover>
    </Box>
  );
}

export default MultiSelectorCheckbox;
