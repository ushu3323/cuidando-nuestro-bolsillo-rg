import Head from "next/head";
import { Button } from "primereact/button";

export default function Home() {
  return (
    <>
      <Head>
        <title>Cuidando Nuestro Bolsillo</title>
        <meta
          name="description"
          content="Colaboramos entre todos para ahorrar en Rio Grande!"
        />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <Button label="Hola mundo" />
      </main>
    </>
  );
}
