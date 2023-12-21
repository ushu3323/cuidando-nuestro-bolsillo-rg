import { signIn } from "next-auth/react";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { useState } from "react";

export default function FacebookButton({
  callbackUrl,
}: {
  callbackUrl?: string;
}) {
  const [loading, setLoading] = useState(false);

  function trySignIn() {
    void signIn("facebook", {
      callbackUrl: callbackUrl,
    });
    setLoading(true);
  }

  return (
    <Button
      type="button"
      label="Acceder con Facebook"
      icon={
        <i className={`${PrimeIcons.FACEBOOK} bg-[#2374f2] text-[20px]`}></i>
      }
      onClick={trySignIn}
      loading={loading}
    ></Button>
  );
}
