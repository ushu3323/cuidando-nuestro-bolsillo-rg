import { type AppType } from "next/app";
import { PrimeReactProvider } from "primereact/api";
import { api } from "~/utils/api";

import Tailwind from "primereact/passthrough/tailwind";
import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
      <Component {...pageProps} />
    </PrimeReactProvider>
  );
};

export default api.withTRPC(MyApp);
