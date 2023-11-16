import ProductsList from "../components/ProductsList";
import Header from "../components/layout/Header";

export default function Home() {
  return (
    <>
      <main className="relative flex min-h-[100dvh] max-w-none flex-col items-stretch">
        <Header />
        <ProductsList />
      </main>
    </>
  );
}
