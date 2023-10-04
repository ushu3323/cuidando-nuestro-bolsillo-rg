import { type AppType } from "next/app";
import { PrimeReactProvider, type PrimeReactPTOptions } from "primereact/api";
import { usePassThrough } from "primereact/passthrough";
import { api } from "~/utils/api";

import Tailwind from "primereact/passthrough/tailwind";
import { classNames } from "primereact/utils";
import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  const CustomTailwind = usePassThrough(Tailwind, {
    button: {
      loadingIcon() {
        return classNames("animate-[spin_1500ms_linear_infinite] me-2");
      },
    },
  } satisfies PrimeReactPTOptions);
  return (
    <PrimeReactProvider value={{ unstyled: true, pt: CustomTailwind }}>
      <Component {...pageProps} />
    </PrimeReactProvider>
  );
};

export default api.withTRPC(MyApp);
