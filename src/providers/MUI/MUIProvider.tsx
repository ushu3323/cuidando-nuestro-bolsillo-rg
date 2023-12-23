import createCache, { type EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import { AppCacheProvider } from "@mui/material-nextjs/v13-pagesRouter";
import { type PropsWithChildren } from "react";
import { theme } from "./theme";

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
