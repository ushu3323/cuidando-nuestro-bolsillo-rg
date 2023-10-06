import { type AppType } from "next/app";
import { PrimeReactProvider } from "primereact/api";
import { api } from "~/utils/api";

import "~/styles/globals.css";

import "primereact/resources/themes/lara-light-blue/theme.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <PrimeReactProvider>
      <Component {...pageProps} />
    </PrimeReactProvider>
  );
};

export default api.withTRPC(MyApp);
