import createCache, { type EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import {
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { AppCacheProvider } from "@mui/material-nextjs/v13-pagesRouter";
import { type PropsWithChildren } from "react";

const theme = createTheme({
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
  },
  shape: {
    borderRadius: 4,
  },
});

const cache = createCache({
  key: "css",
  prepend: true,
});

interface EmotionCacheProviderProps {
  emotionCache?: EmotionCache;
}

export default function MUIProvider({
  children,
  ...props
}: PropsWithChildren<EmotionCacheProviderProps>) {
  return (
    <AppCacheProvider {...props}>
      <StyledEngineProvider injectFirst>
        <CacheProvider value={cache}>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </CacheProvider>
      </StyledEngineProvider>
    </AppCacheProvider>
  );
}
