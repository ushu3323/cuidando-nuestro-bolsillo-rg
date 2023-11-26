import { FacebookAuthProvider, signInWithRedirect } from "firebase/auth";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { useState } from "react";
import { auth } from "../../utils/firebase";

export default function FacebookButton() {
  const [loading, setLoading] = useState(false);

  function trySignIn() {
    const provider = new FacebookAuthProvider();
    void signInWithRedirect(auth, provider);
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
