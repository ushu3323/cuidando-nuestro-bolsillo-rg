import {
  Alert,
  AlertTitle,
  Box,
  Container,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FacebookButton from "~/components/LoginButtons/FacebookButton";
import GoogleButton from "~/components/LoginButtons/GoogleButton";
import LoadingPage from "../../components/LoadingPage";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const [callbackUrl, setCallbackUrl] = useState("/");
  const [snackbarOpts, setSnackbarOpts] = useState({
    message: "",
    show: false,
  });

  useEffect(() => {
    if (status === "authenticated") {
      setTimeout(() => {
        void router.replace("/");
      }, 2000);
    }
  }, [status, router]);

  useEffect(() => {
    if (router.isReady) {
      if (router.query.callbackUrl) {
        setSnackbarOpts({
          message: "Inicie sesion para continuar",
          show: true,
        });
      }
      setCallbackUrl(router.query.callbackUrl as string);
    }
  }, [router.isReady]);

  if (status === "loading" || status === "authenticated") {
    return (
      <LoadingPage>{status === "authenticated" && "Volviendo ;)"}</LoadingPage>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mb: 4 }}>
      <Stack alignItems="center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="h-56 w-56 pe-8 text-center" src="/favicon.svg" alt="" />
      </Stack>
      <Box marginBottom={5}>
        <Typography component="h1" variant="h3" textAlign="center" gutterBottom>
          Precios RG
        </Typography>
      </Box>
      <Box marginBottom={10}>
        <Typography
          component="h2"
          fontSize={20}
          fontWeight={700}
          textAlign="center"
        >
          Bienvenido
        </Typography>
        <Typography variant="body1" textAlign="center">
          Para comenzar primero debe iniciar sesión
        </Typography>
      </Box>
      <Stack
        direction="column"
        spacing={2}
        marginTop={3}
        justifyContent="center"
      >
        <FacebookButton callbackUrl={callbackUrl} disabled />
        <GoogleButton callbackUrl={callbackUrl} />
      </Stack>
      <Alert severity="info" className="mt-5">
        <AlertTitle className="font-bold">Atención</AlertTitle>
        La opción para acceder mediante Facebook estará deshabilitada{" "}
        <strong>hasta nuevo aviso</strong> debido a que aún no está configurada
        para soportar múltiples usuarios. Este inconveniente está siendo
        investigado. Mientras tanto, puede acceder con una cuenta
        de Google. Disculpe las molestias ocasionadas y muchas gracias por probar la aplicación.
        <br />
        <br />
        - Matias, Desarrollador de Precios RG
      </Alert>
      <Snackbar
        message={snackbarOpts.message}
        open={snackbarOpts.show}
        autoHideDuration={5000}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
        sx={{ mt: 8 }}
        onClose={() => setSnackbarOpts((opts) => ({ ...opts, show: false }))}
      />
    </Container>
  );
}
