import { Box, Snackbar } from "@mui/material";
import { TRPCClientError } from "@trpc/client";
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

export const runtime = "edge";

export default function NewPostPage() {
  const router = useRouter();
  const trpc = api.useContext();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const { mutateAsync } = api.post.create.useMutation({
    cacheTime: 0,
  });

  const handleOnSubmit = async (
    values: NewPostFormFields,
    { setErrors }: FormikHelpers<NewPostFormFields>,
  ) => {
    try {
      const image = values.image;
      const signedUrlPayload = await trpc.post.getImageSignedUrl.fetch({
        length: image.size,
        mimetype: image.type,
      });

      // Submit image
      await fetch(signedUrlPayload.url, {
        method: "PUT",
        body: image,
        headers: {
          "Content-Type": image.type,
        },
      });

      await mutateAsync({
        productId: values.productId,
        commerceId: values.commerceId,
        price: values.price,
        imageKey: signedUrlPayload.key,
      });
      void router.push("/");
    } catch (error) {
      if (error instanceof TRPCClientError) {
        const err = error as TRPCClientError<AppRouter>;
        const fieldErrors = err?.data?.zodError?.fieldErrors;
        if (fieldErrors) {
          console.log("Catch field errors", fieldErrors);
          if (err.shape?.data.path === "post.create") {
            void setErrors({
              productId: fieldErrors.productId?.join("\n"),
              commerceId: fieldErrors.commerceId?.join("\n"),
              price: fieldErrors.price?.join("\n"),
              image: fieldErrors.image?.join("\n"),
            });
          }
          return;
        }
      }
      console.error(error);
    }
    setSnackbarMsg(
      "Hubo un error inesperado mientras se publicaba, intentelo de nuevo mas tarde",
    );
    setShowSnackbar(true);
  };

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
