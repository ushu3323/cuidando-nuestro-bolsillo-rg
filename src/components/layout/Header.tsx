import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  return (
    <header className="sticky top-0 flex items-center justify-between px-4 py-2 shadow">
      <Link href="/" className="text-lg font-bold text-black no-underline">
        Cuidando nuestro bolsillo
      </Link>
      <Button
        icon={PrimeIcons.PLUS}
        label="Oferta"
        disabled={path.startsWith("/offers/new")}
        onClick={() => void router.push("/offers/new")}
      />
    </header>
  );
}
