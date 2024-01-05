import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { inter } from "../font";
import MUIProvider from "./providers/MUIProvider";
import SessionProvider from "./providers/SessionProvider";

import "~/styles/globals.css";

export const metadata = {
  title: "Precios RG",
  icons: "favicon.svg",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body id="__next" className={inter.className}>
        <SessionProvider>
          <AppRouterCacheProvider>
            <MUIProvider>{children}</MUIProvider>
          </AppRouterCacheProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
