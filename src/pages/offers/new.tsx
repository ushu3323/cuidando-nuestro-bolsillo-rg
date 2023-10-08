import { useFormik } from "formik";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { api } from "~/utils/api";
import Header from "../../components/layout/Header";

export default function NewOfferPage() {
  const router = useRouter();
  const { mutateAsync, isLoading } = api.offer.create.useMutation();
  const formik = useFormik({
    initialValues: {
      name: "",
      price: 0,
      commerce_name: "",
    },
    onSubmit: async (values) => {
      const res = await mutateAsync({
        name: values.name,
        price: values.price,
        commerce: {
          name: values.commerce_name,
        },
      });
      console.log(res.price);
      void router.push("/");
    },
  });

  return (
    <main className="flex h-full min-h-screen flex-col">
      <Header />
      <div className="flex w-full grow items-center justify-center">
        <Card
          title="Publicar oferta"
          className="w-full border-2 border-solid  border-zinc-100 shadow-none sm:w-96 sm:shadow-xl"
        >
          <form onSubmit={formik.handleSubmit} className="mt-2">
            <div className="mb-6 flex flex-col gap-7">
              <span className="p-float-label">
                <InputText
                  name="name"
                  className="w-full"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <label htmlFor="name">Nombre</label>
              </span>
              <span className="p-float-label">
                <InputNumber
                  id="price"
                  inputId="price"
                  name="price"
                  prefix="$"
                  minFractionDigits={2}
                  maxFractionDigits={2}
                  className="w-full"
                  value={formik.values.price > 0 ? formik.values.price : null}
                  onValueChange={formik.handleChange}
                />
                <label htmlFor="price">Precio</label>
              </span>
              <span className="p-float-label">
                <InputText
                  name="commerce_name"
                  className="w-full"
                  value={formik.values.commerce_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <label htmlFor="commerce_name">Comercio</label>
              </span>
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
