import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

export function SearchTextField({
  value = "",
  setValue,
  handleChangeOnType,
  placeholder = "Type to Search",
  isVisible = true,
  isEditable = true,
  width = "40%",
}) {
  if (!isVisible) return null;

  function handleChange(e) {
    setValue(e.target.value);
    if (handleChangeOnType) {
      handleChangeOnType(e.target.value);
    }
  }

  return (
    <Box sx={{ width: width }}>
      <TextField
        fullWidth
        size="small"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={!isEditable}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
          htmlInput: {
            autoComplete: "off",
          },
        }}
      />
    </Box>
  );
}
