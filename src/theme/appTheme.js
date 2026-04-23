import { createTheme } from "@mui/material/styles";

const sharedSurfaceColor = "hsl(243, 18%, 23%)";
const sharedBorderColor = "rgba(255, 255, 255, 0.12)";

const appTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#c084fc",
    },
    background: {
      default: "var(--bg)",
      paper: sharedSurfaceColor,
    },
    text: {
      primary: "#f3f4f6",
      secondary: "#c9ced6",
    },
    divider: sharedBorderColor,
  },
  typography: {
    fontFamily: "var(--mono)",
    h1: {
      fontFamily: "var(--heading)",
    },
    h2: {
      fontFamily: "var(--heading)",
    },
    h3: {
      fontFamily: "var(--heading)",
    },
    h4: {
      fontFamily: "var(--heading)",
    },
    h5: {
      fontFamily: "var(--heading)",
    },
    h6: {
      fontFamily: "var(--heading)",
    },
    button: {
      fontFamily: "var(--mono)",
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ":root": {
          colorScheme: "dark",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: sharedSurfaceColor,
          border: `1px solid ${sharedBorderColor}`,
          boxShadow: "0 14px 34px rgba(0, 0, 0, 0.22)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundImage: "none",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundImage: "none",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: sharedSurfaceColor,
          color: "#f3f4f6",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: sharedBorderColor,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(192, 132, 252, 0.55)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#c084fc",
          },
        },
        input: {
          fontFamily: "var(--mono)",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#c9ced6",
          fontFamily: "var(--mono)",
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "#c9ced6",
          fontFamily: "var(--mono)",
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          backgroundImage: "none",
        },
        option: {
          fontFamily: "var(--mono)",
          '&[aria-selected="true"]': {
            backgroundColor: "rgba(192, 132, 252, 0.2)",
          },
          "&.Mui-focused": {
            backgroundColor: "rgba(192, 132, 252, 0.12)",
          },
        },
      },
    },
  },
});

export default appTheme;
