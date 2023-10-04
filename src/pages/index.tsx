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
      <main className="prose flex min-h-screen max-w-none flex-col items-center justify-center">
        <h1 className="mb-5">Hello world</h1>

        <Button label="Hola mundo" loading={true} />
      </main>
    </>
  );
}
