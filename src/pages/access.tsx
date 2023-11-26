import { getRedirectResult } from "firebase/auth";
import { useRouter } from "next/router";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import FacebookButton from "~/components/LoginButtons/FacebookButton";
import GoogleButton from "~/components/LoginButtons/GoogleButton";
import { auth } from "../utils/firebase";

export default function AccessPage() {
  const router = useRouter();
  const [user, userLoading, userError] = useAuthState(auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    console.info("[Auth] Trying to get redirect operation result...");
    getRedirectResult(auth)
      .then((credential) => {
        if (credential) {
          console.info(
            "[Auth] Successfully received credential from redirect operation result",
          );
        } else {
          console.log("[Auth] Redirect operation not found");
        }
      })
      .catch((error) => {
        console.error(
          "[Auth] Error while trying to get redirect operation result",
          error,
        );
      });
  }, []);

  useEffect(() => {
    if (!userLoading) {
      if (user) {
        console.error("[Auth] User authenticated", userError);
        void router.replace("/");
      } else {
        if (userError) {
          console.error("[Auth] Error while authenticating user", userError);
        }
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userLoading]);

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex grow items-stretch justify-center sm:items-center">
        <div className="flex w-full sm:w-96">
          {userLoading || loading ? (
            <ProgressSpinner />
          ) : (
            <Card
              title={
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    className="text-black"
                    aria-label="Back"
                    icon={PrimeIcons.ARROW_LEFT}
                    onClick={() => router.back()}
                    rounded
                    text
                  />
                  <span>Acceder</span>
                </div>
              }
              className="w-full grow border-2 border-zinc-100 shadow-none sm:border-solid sm:shadow-xl"
              pt={{
                title: {
                  className: "mb-5",
                },
                body: { className: "h-full flex flex-col items-stretch" },
                content: { className: "grow" },
              }}
            >
              <div className="flex flex-col gap-4">
                <FacebookButton />
                <GoogleButton />
              </div>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
