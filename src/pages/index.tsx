import Head from "next/head";
import ProductsTable from "../components/ProductsTable";
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
      <main className="relative min-h-screen max-w-none flex-col items-center justify-center">
        <Header />
        <ProductsTable />
      </main>
    </>
  );
}
