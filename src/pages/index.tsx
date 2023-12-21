import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import LoadingPage from "../components/LoadingPage";

export default function HomePage() {
  const { data: session, status } = useSession({ required: true });
  const user = session?.user;
  const router = useRouter();

  if (status === "loading") {
    return <LoadingPage />;
  }

  return (
    <>
      <main className="flex flex-col p-10">
        <h1 className="text-center">Precios RG</h1>
        <div className="mb-14 flex w-full justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="m-auto h-56 w-56 pe-8 text-center"
            src="/favicon.svg"
            alt=""
          />
        </div>
        <h2 className="mb-10 text-center">Bienvenido, {user?.name}!</h2>
        <div className="mb-20 flex w-full justify-center gap-12">
          <Button
            icon={PrimeIcons.PLUS}
            label="Cargar precios"
            severity="success"
            onClick={() => void router.push("/offers/new")}
          />
          <Button
            icon={PrimeIcons.SEARCH}
            label="Visualizar precios"
            onClick={() => void router.push("/offers")}
          />
        </div>
      </main>
      <footer className="">
        MAGIANPC Marca registrada <span className="text-base">&#174;</span>
      </footer>
    </>
  );
}
