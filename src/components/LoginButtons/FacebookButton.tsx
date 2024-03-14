import { FacebookRounded as FacebookIcon } from "@mui/icons-material";
import { LoadingButton, type LoadingButtonProps } from "@mui/lab";
import { styled } from "@mui/material/styles";
import { signIn } from "next-auth/react";
import { useState } from "react";

const LoadingStyledButton = styled(LoadingButton)<LoadingButtonProps>(() => ({
  color: "#fff",
  backgroundColor: "#1877f2",
}));

export default function FacebookButton({
  callbackUrl,
  disabled = false,
}: {
  callbackUrl?: string;
  disabled?: boolean
}) {
  const [loading, setLoading] = useState(false);

  function trySignIn() {
    void signIn("facebook", {
      callbackUrl: callbackUrl,
    });
    setLoading(true);
  }

  return (
    <LoadingStyledButton
      loading={loading}
      variant="contained"
      loadingPosition="start"
      startIcon={<FacebookIcon />}
      onClick={trySignIn}
      disabled={disabled}
    >
      Acceder con Facebook
    </LoadingStyledButton>
  );
}
