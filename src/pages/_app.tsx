import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { PrimeReactProvider } from "primereact/api";
import { api } from "~/utils/api";

import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-blue/theme.css";

import { type Session } from "next-auth";
import Head from "next/head";
import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <PrimeReactProvider value={{ ripple: true }}>
        <Head>
          <title>Cuidando Nuestro Bolsillo</title>
          <meta
            name="description"
            content="Colaboramos entre todos para ahorrar en Rio Grande!"
          />
          <link rel="icon" href="/favicon.svg" />
        </Head>
        <Component {...pageProps} />
      </PrimeReactProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
