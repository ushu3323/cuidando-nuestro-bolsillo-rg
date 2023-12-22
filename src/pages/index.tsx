import { Button, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import LoadingPage from "../components/LoadingPage";

export default function HomePage() {
  const { data: session, status } = useSession({ required: true });
  const user = session?.user;

  if (status === "loading") {
    return <LoadingPage />;
  }

  return (
    <>
      <main className="flex flex-col p-10">
        <Typography variant="h1" className="text-center">
          Precios RG
        </Typography>
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
          <Button variant="contained">Cargar Precios</Button>
          <Button variant="contained">Visualizar precios</Button>
        </div>
      </main>
      <footer className="">
        MAGIANPC Marca registrada <span className="text-base">&#174;</span>
      </footer>
    </>
  );
}
