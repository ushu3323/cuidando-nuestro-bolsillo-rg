import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect } from "react";
import FacebookButton from "~/components/LoginButtons/FacebookButton";
import GoogleButton from "~/components/LoginButtons/GoogleButton";

export default function AccessPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      void router.replace("/");
    }
  }, [status, router]);

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex grow items-stretch justify-center sm:items-center">
        <div className="flex w-full sm:w-96">
          {status === "loading" || status === "authenticated" ? (
            <>
              <ProgressSpinner />
              {status === "authenticated" && (
                <p>Autenticado, redirigiendo...</p>
              )}
            </>
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
