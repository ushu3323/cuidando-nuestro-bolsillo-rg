import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#448aff",
    },
    secondary: {
      main: "#ffC107",
    },
    success: {
      main: "#00c853",
      contrastText: "#fff",
    },
    info: {
      main: "#03a9f4",
    },
    error: {
      main: "#d50000",
    },
    warning: {
      main: "#f57c00",
    },
  },
  typography: {
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 700,
      textTransform: "none",
      fontSize: "1rem",
    },
    fontFamily: "Inter",
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
  },
});
