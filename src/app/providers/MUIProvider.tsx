"use client";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import { PropsWithChildren } from "react";
import { theme } from "~/providers/MUI/theme";

const cache = createCache({
  key: "css-app",
  prepend: true,
});

export default function MUIProvider({ children }: PropsWithChildren) {
  return (
    <>
      <StyledEngineProvider injectFirst>
        <CssBaseline />
        <CacheProvider value={cache}>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </CacheProvider>
      </StyledEngineProvider>
    </>
  );
}
