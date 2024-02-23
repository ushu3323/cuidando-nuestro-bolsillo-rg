import { CssBaseline, GlobalStyles } from "@mui/material";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import Head from "next/head";
import { api } from "~/utils/api";
import Layout, { type LayoutProps } from "../components/layout/Layout";
import MUIProvider from "../providers/MUI/MUIProvider";

import "~/styles/globals.css";

const inputGlobalStyles = (
  <GlobalStyles
    styles={(theme) => ({
      body: {
        fontFamily: theme.typography.fontFamily,
      },
    })}
  />
);

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const layoutProps = (Component as unknown as { layoutProps?: LayoutProps })
    .layoutProps;
  return (
    <>
      <Head>
        <title>Precios Río Grande</title>
      </Head>
      <SessionProvider session={session}>
        <CssBaseline />
        <MUIProvider {...pageProps}>
          {inputGlobalStyles}
          <Layout {...layoutProps}>
            <Component {...pageProps} />
          </Layout>
        </MUIProvider>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
