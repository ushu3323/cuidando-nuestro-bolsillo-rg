import { TRPCClientError } from "@trpc/client";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { useRef } from "react";
import { RouterInputs, api } from "~/utils/api";
import Header from "../../components/layout/Header";
import { AppRouter } from "../../server/api/root";

const barcodeScanViewId = "barcode-scan-view";

export default function NewOfferPage() {
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const { mutateAsync, isLoading, error } = api.offer.create.useMutation({
    cacheTime: 0,
  });
  const fieldErrors = error?.data?.zodError?.fieldErrors;

  const formik = useFormik({
    initialValues: {
      code: "",
      name: "",
      price: 0,
      commerce_name: "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    validateOnMount: false,
    onSubmit: (values, { setTouched, setErrors }) =>
      mutateAsync({
        code: values.code,
        name: values.name,
        price: values.price,
        commerce_name: values.commerce_name,
      })
        .then((offer) => {
          console.log(offer);
          void router.push("/");
        })
        .catch((err: TRPCClientError<AppRouter>) => {
          const fieldErrors = err?.data?.zodError?.fieldErrors;
          if (fieldErrors) {
            void setTouched({
              code: false,
              name: false,
              price: false,
              commerce_name: false,
            });
            void setErrors({
              code: fieldErrors.code?.join("\n"),
              name: fieldErrors.name?.join("\n"),
              price: fieldErrors.price?.join("\n"),
              commerce_name: fieldErrors.commerce_name?.join("\n"),
            });
            return;
          }
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: error?.message,
          });
        }),
  });

  const getFieldErrorMessages = (
    name: keyof RouterInputs["offer"]["create"],
  ) => {
    const errors = fieldErrors?.[name];
    if (errors && !formik.touched[name]) {
      return (
        <div className="p-error mb-3">
          {errors.map((error, i) => (
            <small key={i} className="block p-1">
              {error}
            </small>
          ))}
        </div>
      );
    }
    return <small className="p-error">&nbsp;</small>;
  };

  const isFieldInvalid = (name: keyof RouterInputs["offer"]["create"]) => {
    const errors = fieldErrors?.[name];
    return errors && !formik.touched[name] ? true : false;
  };

  return (
    <main className="flex h-full min-h-screen flex-col">
      <Header />
      <Toast ref={toast} />
      <div className="flex w-full grow items-center justify-center">
        <Card
          title="Publicar oferta"
          className="w-full border-2 border-solid border-zinc-100 shadow-none sm:w-96 sm:shadow-xl"
        >
          <div className={barcodeScanViewId}></div>
          <form onSubmit={formik.handleSubmit} className="mt-2">
            <div className="mb-6 flex flex-col gap-4">
              <div className="">
                <span className="p-float-label">
                  <InputText
                    id="code"
                    name="code"
                    className={classNames("w-full", {
                      "p-invalid": isFieldInvalid("code"),
                    })}
                    value={formik.values.code}
                    keyfilter="int"
                    maxLength={13}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <label htmlFor="code">Codigo</label>
                </span>
                {getFieldErrorMessages("code")}
              </div>
              <div>
                <span className="p-float-label">
                  <InputText
                    id="name"
                    name="name"
                    className={classNames("w-full", {
                      "p-invalid": isFieldInvalid("name"),
                    })}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <label htmlFor="name">Nombre</label>
                </span>
                {getFieldErrorMessages("name")}
              </div>
              <div>
                <span className="p-float-label">
                  <InputNumber
                    inputId="price"
                    name="price"
                    className={classNames("w-full", {
                      "p-invalid": isFieldInvalid("price"),
                    })}
                    prefix="$"
                    minFractionDigits={2}
                    maxFractionDigits={2}
                    value={formik.values.price > 0 ? formik.values.price : null}
                    onValueChange={formik.handleChange}
                  />
                  <label htmlFor="price">Precio</label>
                </span>
                {getFieldErrorMessages("price")}
              </div>
              <div>
                <span className="p-float-label">
                  <InputText
                    id="commerce_name"
                    name="commerce_name"
                    className={classNames("w-full", {
                      "p-invalid": isFieldInvalid("commerce_name"),
                    })}
                    value={formik.values.commerce_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <label htmlFor="commerce_name">Comercio</label>
                </span>
                {getFieldErrorMessages("commerce_name")}
              </div>
            </div>
            <Button
              label="Enviar"
              type="submit"
              className="w-full"
              loading={isLoading}
            />
          </form>
        </Card>
      </div>
    </main>
  );
}
