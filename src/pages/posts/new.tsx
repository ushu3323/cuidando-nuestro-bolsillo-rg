import { Box, Snackbar } from "@mui/material";
import { type TRPCClientError } from "@trpc/client";
import { type FormikHelpers } from "formik";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  NewPostForm,
  type NewPostFormFields,
} from "~/components/posts/NewPostForm";
import { type AppRouter } from "~/server/api/root";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/utils/api";

export default function NewPostPage() {
  const router = useRouter();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const { mutateAsync } = api.post.create.useMutation({
    cacheTime: 0,
  });

  const handleOnSubmit = (
    values: NewPostFormFields,
    { setErrors }: FormikHelpers<NewPostFormFields>,
  ) =>
    mutateAsync({
      productId: values.productId,
      commerceId: values.commerceId,
      price: values.price,
      image: "",
    })
      .then((offer) => {
        console.log(offer);
        void router.push("/");
      })
      .catch((err: TRPCClientError<AppRouter>) => {
        const fieldErrors = err?.data?.zodError?.fieldErrors;
        if (fieldErrors) {
          console.log("Catch field errors on mutation", fieldErrors);
          void setErrors({
            productId: fieldErrors.productId?.join("\n"),
            commerceId: fieldErrors.commerceId?.join("\n"),
            price: fieldErrors.price?.join("\n"),
          });
          return;
        }
        setShowSnackbar(true);
        setSnackbarMsg(
          "Hubo un error al intentar publicar, intente de nuevo en unos minutos",
        );
      });

  const handleSnackbarClose = () => setShowSnackbar(false);

  return (
    <Box sx={{ pt: 2 }}>
      <NewPostForm onSubmit={handleOnSubmit} />
      <Snackbar
        open={showSnackbar}
        message={snackbarMsg}
        autoHideDuration={3500}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  if (session) {
    return {
      props: {
        session,
      },
    };
  }

  return {
    redirect: {
      destination: "/auth/login",
      permanent: false,
    },
  };
};
