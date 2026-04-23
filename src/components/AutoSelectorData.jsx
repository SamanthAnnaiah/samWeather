import { useMemo } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export function AutoSelectorData({
  options = [],
  selectedValue = "",
  setSelectedValue,
  heading = "",
  isVisible = true,
  isEditable = true,
  placeholder = "Day",
}) {
  const normalizedOptions = useMemo(
    () =>
      options.map((option) => ({
        label: option?.label ?? "",
        value: option?.value ?? "",
      })),
    [options],
  );

  const resolvedSelectedOption =
    normalizedOptions.find((option) => option.value === selectedValue) || null;

  if (!isVisible) {
    return null;
  }

  return (
    <Box className="auto-selector">
      {heading ? (
        <Typography className="auto-selector__heading" variant="body1">
          {heading}
        </Typography>
      ) : null}

      <Autocomplete
        className="auto-selector__input"
        disableClearable={false}
        disabled={!isEditable}
        fullWidth
        getOptionLabel={(option) => option.label || ""}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        onChange={(_, newValue) => {
          if (typeof setSelectedValue === "function") {
            setSelectedValue(newValue?.value || "");
          }
        }}
        options={normalizedOptions}
        slotProps={{
          listbox: { className: "auto-selector__listbox" },
          paper: { className: "auto-selector__listbox" },
        }}
        renderInput={(params) => (
          <TextField {...params} placeholder={placeholder} size="small" />
        )}
        value={resolvedSelectedOption}
      />
    </Box>
  );
}

export default AutoSelectorData;
