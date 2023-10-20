import { useFormikContext } from "formik";
import { useRouter } from "next/navigation";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown, DropdownProps } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import { RouterOutputs, api } from "../utils/api";

export interface NewOfferFormProps {
  productId: string;
  brandId: string;
  commerceId: string;
  price: number;
}

export function NewOfferForm() {
  const router = useRouter();
  const { values, errors, touched, handleSubmit, handleChange, isSubmitting } =
    useFormikContext<NewOfferFormProps>();

  // const { data: categories } = api.category.getAll.useQuery();
  const { data: commerces } = api.commerce.getAll.useQuery();

  const { data: products } = api.product.getAll.useQuery();
  const { data: brands } = api.product.getProductBrands.useQuery(
    { productId: values.productId },
    { enabled: values.productId.length > 0 },
  );

  const getFieldErrorMessages = (
    name: keyof NewOfferFormProps,
    opts: { ignoreTouched: boolean } = { ignoreTouched: false },
  ) => {
    const error = errors[name];
    if (error && (opts.ignoreTouched || !touched[name])) {
      return (
        <div className="p-error mb-3">
          {error.split("\n").map((error, i) => (
            <small key={i} className="block p-1">
              {error}
            </small>
          ))}
        </div>
      );
    }
    return <small className="p-error">&nbsp;</small>;
  };

  const isFieldInvalid = (
    name: keyof NewOfferFormProps,
    opts: { ignoreTouched: boolean } = { ignoreTouched: false },
  ) => {
    const error = errors[name];
    return error && (opts.ignoreTouched || !touched[name]) ? true : false;
  };

  // commerceId Dropdown templates
  const commerceOptionTemplate = (
    option: RouterOutputs["commerce"]["getAll"][number],
  ) => (
    <div>
      <div>
        {option.name} - {option.street}
      </div>
      <div className="opacity-70">&quot;{option.observations}&quot;</div>
    </div>
  );
  const selectedCommerceTemplate = (
    option: RouterOutputs["commerce"]["getAll"][number],
    props: DropdownProps,
  ) =>
    option ? (
      <div>
        {option.name} - {option.street}
        <div className="opacity-70">&quot;{option.observations}&quot;</div>
      </div>
    ) : (
      <div>{props.placeholder ?? "&nbsp;"}</div>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full sm:w-96"
      autoComplete="off"
    >
      <Card
        title={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              className="text-black"
              aria-label="Back"
              icon={PrimeIcons.ARROW_LEFT}
              onClick={() => router.back()}
              rounded
              text
            />
            <span>Publicar oferta</span>
          </div>
        }
        className="w-full grow border-2 border-zinc-100 shadow-none sm:border-solid sm:shadow-xl"
        pt={{
          title: {
            className: "mb-5",
          },
          body: { className: "h-full flex flex-col items-stretch" },
          content: { className: "grow" },
        }}
        footer={
          <Button
            label="Enviar"
            type="submit"
            className="w-full"
            loading={isSubmitting}
          />
        }
      >
        <div className="flex flex-col gap-4">
          <div>
            <span className="p-float-label">
              <Dropdown
                inputId="productId"
                name="productId"
                className={classNames("w-full", {
                  "p-invalid": isFieldInvalid("productId"),
                })}
                options={products}
                optionLabel="name"
                optionValue="id"
                value={values.productId}
                onChange={handleChange}
                filter
              />
              <label htmlFor="productId">Producto</label>
            </span>
            {getFieldErrorMessages("productId")}
          </div>
          <div>
            <span className="p-float-label">
              <Dropdown
                inputId="brandId"
                name="brandId"
                className={classNames("w-full", {
                  "p-invalid": isFieldInvalid("brandId"),
                })}
                disabled={values.productId.length == 0 || brands?.length == 0}
                options={
                  brands?.length ? brands : [{ id: "null", name: "Generica" }]
                }
                optionLabel="name"
                optionValue="id"
                value={brands?.length == 0 ? "null" : values.brandId}
                onChange={handleChange}
                filter
              />
              <label htmlFor="brandId">Marca</label>
            </span>
            {getFieldErrorMessages("brandId")}
          </div>
          <div>
            <span className="p-float-label">
              <InputNumber
                inputId="price"
                name="price"
                className={classNames("w-full", {
                  "p-invalid": isFieldInvalid("price"),
                })}
                pt={{ input: { root: { className: "w-full" } } }}
                prefix="$"
                minFractionDigits={2}
                maxFractionDigits={2}
                value={values.price > 0 ? values.price : null}
                disabled={!values.productId}
                onValueChange={handleChange}
              />
              <label htmlFor="price">Precio</label>
            </span>
            {getFieldErrorMessages("price")}
          </div>
          <div>
            <span className="p-float-label">
              <Dropdown
                inputId="commerceId"
                name="commerceId"
                className={classNames("w-full", {
                  "p-invalid": isFieldInvalid("commerceId"),
                })}
                options={commerces}
                optionLabel="name"
                optionValue="id"
                value={values.commerceId}
                itemTemplate={commerceOptionTemplate}
                valueTemplate={selectedCommerceTemplate}
                onChange={handleChange}
                filter
              />
              <label htmlFor="commerceId">Comercio</label>
            </span>
            {getFieldErrorMessages("commerceId")}
          </div>
        </div>
      </Card>
    </form>
  );
}
