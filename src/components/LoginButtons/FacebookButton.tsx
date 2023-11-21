import type { AuthError, UserCredential } from "firebase/auth";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { useSignInWithFacebook } from "react-firebase-hooks/auth";
import { auth } from "../../utils/firebase";

interface Props {
  onSuccess: (user: UserCredential | undefined) => void;
  onError: (error: AuthError) => void;
}

export default function FacebookButton({ onSuccess, onError }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [signInWithFacebook, _user, loading] = useSignInWithFacebook(auth);

  function trySignIn() {
    signInWithFacebook()
      .then((user) => onSuccess(user))
      .catch((error) => onError(error as AuthError));
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
