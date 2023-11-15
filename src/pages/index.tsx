import Head from "next/head";
import ProductsList from "../components/ProductsList";
import Header from "../components/layout/Header";

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
      <main className="relative flex min-h-[100dvh] max-w-none flex-col items-stretch">
        <Header />
        <ProductsList />
      </main>
    </>
  );
}
