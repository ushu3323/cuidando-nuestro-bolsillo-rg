import { CssBaseline, GlobalStyles } from "@mui/material";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import Head from "next/head";
import { api } from "~/utils/api";
import MUIProvider from "../components/MUIProvider";

import "~/styles/globals.css";

const inputGlobalStyles = (
  <GlobalStyles styles={{ body: { fontFamily: "Inter" } }} />
);

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <title>Cuidando Nuestro Bolsillo</title>
      </Head>
      <SessionProvider session={session}>
        <CssBaseline />
        <MUIProvider {...pageProps}>
          {inputGlobalStyles}
          <Component {...pageProps} />
        </MUIProvider>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
