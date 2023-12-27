import { Box, Container, Stack, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import FacebookButton from "~/components/LoginButtons/FacebookButton";
import GoogleButton from "~/components/LoginButtons/GoogleButton";
import LoadingPage from "../../components/LoadingPage";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      setTimeout(() => {
        void router.replace("/");
      }, 2000);
    }
  }, [status, router]);

  if (status === "loading" || status === "authenticated") {
    return (
      <LoadingPage>{status === "authenticated" && "Volviendo ;)"}</LoadingPage>
    );
  }

  return (
    <Container maxWidth="sm">
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
        <FacebookButton />
        <GoogleButton />
      </Stack>
    </Container>
  );
}
