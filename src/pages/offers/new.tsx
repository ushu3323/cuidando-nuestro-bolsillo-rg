import { type TRPCClientError } from "@trpc/client";
import { type FormikHelpers } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import {
  NewOfferForm,
  type NewOfferFormProps,
} from "~/components/NewOfferForm";
import { type AppRouter } from "~/server/api/root";
import { api } from "~/utils/api";
import LoadingPage from "../../components/LoadingPage";
import Header from "../../components/layout/Header/Header";

export default function NewOfferPage() {
  const { status } = useSession({ required: true });
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const { mutateAsync, error } = api.offer.create.useMutation({
    cacheTime: 0,
  });

  const handleOnSubmit = (
    values: NewOfferFormProps,
    { setErrors }: FormikHelpers<NewOfferFormProps>,
  ) =>
    mutateAsync({
      productId: values.productId,
      commerceId: values.commerceId,
      price: values.price,
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
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: error?.message,
        });
      });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {status === "loading" ? (
        <LoadingPage />
      ) : (
        <main className="flex h-full flex-grow">
          <Toast ref={toast} />
          <div className="flex grow items-stretch justify-center sm:items-center">
            <NewOfferForm onSubmit={handleOnSubmit} />
          </div>
        </main>
      )}
    </div>
  );
}
