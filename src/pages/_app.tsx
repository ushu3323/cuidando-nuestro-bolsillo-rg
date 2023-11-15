import { type AppType } from "next/app";
import { PrimeReactProvider } from "primereact/api";
import { api } from "~/utils/api";

import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-blue/theme.css";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <PrimeReactProvider value={{ ripple: true }}>
      <Component {...pageProps} />
    </PrimeReactProvider>
  );
};

export default api.withTRPC(MyApp);
