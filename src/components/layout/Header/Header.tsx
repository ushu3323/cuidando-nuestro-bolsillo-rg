import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { type MenuItem } from "primereact/menuitem";
import { ProgressSpinner } from "primereact/progressspinner";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { auth } from "~/utils/firebase";
import AvatarMenu from "./AvatarMenu";

export default function Header() {
  const [user, loading] = useAuthState(auth);
  const [signOut] = useSignOut(auth);
  const path = usePathname();
  const router = useRouter();

  const menuItems: MenuItem[] = [
    {
      label: "Cerrar Sesion",
      icon: PrimeIcons.TIMES,
      command: () => void signOut(),
    },
  ];

  const Actions = () =>
    user ? (
      <div className="flex items-center gap-5">
        <Button
          icon={PrimeIcons.PLUS}
          label="Oferta"
          disabled={path.startsWith("/offers/new")}
          onClick={() => void router.push("/offers/new")}
        />
        <AvatarMenu user={user} menuItems={menuItems} />
      </div>
    ) : (
      <>
        <Button
          label="Acceder"
          severity="help"
          onClick={() => void router.push("/access")}
        />
      </>
    );

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between bg-white px-4 py-2 shadow">
      <Link href="/" className="text-lg font-bold text-black no-underline">
        Cuidando nuestro bolsillo
      </Link>
      {loading ? (
        <ProgressSpinner style={{ margin: 0, height: "100%" }} />
      ) : (
        <Actions />
      )}
    </header>
  );
}
