import { useRouter } from "next/router";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect, type ReactNode } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";

export default function Private({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (router) {
      if (!loading && !user) {
        if (!error) {
          void router.replace({
            pathname: "/login",
            query: {
              next: router.asPath,
            },
          });
        }
      }
    }
  }, [user, loading, error, router]);

  if (loading || !user) {
    return (
      <main className="fixed left-0 top-0 flex h-full w-full flex-col items-center justify-center">
        <ProgressSpinner></ProgressSpinner>
      </main>
    );
  }

  if (error) {
    return (
      <main className="fixed left-0 top-0 flex h-full w-full flex-col items-center justify-center">
        <h1>Error</h1>
        <h2>{error.name}</h2>
        <div>{error.message}</div>
        <div>{!!error.cause && String(error.cause)}</div>
      </main>
    );
  }

  return children;
}
