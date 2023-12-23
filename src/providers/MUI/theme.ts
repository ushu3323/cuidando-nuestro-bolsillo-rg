import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4c6e9a",
    },
    secondary: {
      main: "#ffa000",
    },
  },
  typography: {
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 700,
    },
    fontFamily: "Inter",
  },
  shape: {
    borderRadius: 4,
  },
});
