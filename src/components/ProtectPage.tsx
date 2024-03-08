import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState, type PropsWithChildren } from "react";
import LoadingPage from "./LoadingPage";

export default function ProtectPage({ children }: PropsWithChildren) {
  const router = useRouter();
  const [allow, setAllow] = useState(false);
  const { status, data } = useSession();

  const checkSession = () => {
    if (status === "loading") {
    } else if (status === "unauthenticated") {
      void router.replace("/auth/login");
    } else if (status === "authenticated") {
      if (data.user.TOSAccepted) {
        setAllow(true);
      } else {
        void router.replace("/accept-tos")
      }
    }
  }

  useEffect(() => {
    checkSession();
  }, [data, status])

  if (!allow) {
    return <LoadingPage />;
  }

  return children;
}
