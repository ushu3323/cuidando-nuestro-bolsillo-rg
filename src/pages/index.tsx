import { useRouter } from "next/router";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import Header from "../components/layout/Header/Header";

export default function HomePage() {
  const router = useRouter();
  return (
    <>
      <Header showTitle={false} />
      <main className="flex min-h-screen flex-col">
        <h1 className="text-center">Precios RG</h1>
        <div className="mb-14 flex w-full justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="m-auto h-56 w-56 pe-8 text-center"
            src="/favicon.svg"
            alt=""
          />
        </div>
        <div className="mb-20 flex w-full justify-center gap-12">
          <Button
            icon={PrimeIcons.PLUS}
            label="Cargar precios"
            severity="success"
            onClick={() => router.push("/offers/new")}
          />
          <Button
            icon={PrimeIcons.SEARCH}
            label="Visualizar precios"
            onClick={() => router.push("/offers")}
          />
        </div>
      </main>
      <footer className="">
        MAGIANPC Marca registrada <span className="text-base">&#174;</span>
      </footer>
    </>
  );
}
