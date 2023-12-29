import { LoadingButton } from "@mui/lab";
import { Autocomplete, InputAdornment, TextField } from "@mui/material";
import { useFormik, type FormikHelpers } from "formik";
import { NumericFormat } from "react-number-format";
import { api, type RouterOutputs } from "~/utils/api";

export interface NewPostFormFields {
  productId: string;
  commerceId: string;
  price: number;
}

export function NewPostForm({
  onSubmit,
}: {
  onSubmit: (
    values: NewPostFormFields,
    formikHelpers: FormikHelpers<NewPostFormFields>,
  ) => void;
}) {
  const {
    values,
    errors,
    touched,
    initialValues,
    handleSubmit,
    handleChange,
    setFieldValue,
    isSubmitting,
  } = useFormik<NewPostFormFields>({
    initialValues: {
      productId: "",
      commerceId: "",
      price: 0,
    },
    validate(formikValues) {
      const formikErrors: Partial<Record<keyof NewPostFormFields, string>> = {};
      if (formikValues.productId.length == 0) {
        formikErrors.productId = "Seleccione un producto";
      }

      return formikErrors;
    },
    onSubmit: onSubmit,
    validateOnBlur: false,
    validateOnChange: false,
  });

  const productsQuery = api.product.getAll.useQuery();
  const commercesQuery = api.commerce.getAll.useQuery();

  const products: RouterOutputs["product"]["getAll"] = productsQuery.data ?? [];
  const commerces: RouterOutputs["commerce"]["getAll"] =
    commercesQuery.data ?? [];

  const getFieldErrorMessages = (
    field: keyof NewPostFormFields,
    opts: { ignoreTouched: boolean } = { ignoreTouched: false },
  ) => {
    const error = errors[field];
    if (isFieldInvalid(field, { ignoreTouched: opts.ignoreTouched })) {
      return error;
    }
    return "";
  };

  const isFieldInvalid = (
    field: keyof NewPostFormFields,
    opts: { ignoreTouched: boolean } = { ignoreTouched: false },
  ) => {
    return !!(errors[field] && (opts.ignoreTouched || touched[field]));
  };

  const setFieldValueSecure = <Field extends keyof NewPostFormFields>(
    field: Field,
    value: (typeof initialValues)[Field],
  ) => setFieldValue(field, value);

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="w-full">
      <Autocomplete
        id="productId"
        loading={productsQuery.isLoading}
        options={products.map((x) => x.id)}
        getOptionLabel={(option) =>
          products.find((product) => product.id === option)?.name ?? ""
        }
        isOptionEqualToValue={(option, value) => option === value}
        value={values.productId || null}
        onChange={(_, value) =>
          void setFieldValueSecure(
            "productId",
            value ?? initialValues.productId,
          )
        }
        fullWidth
        renderInput={(params) => (
          <TextField
            {...params}
            name="productId"
            label="Producto"
            margin="normal"
            error={isFieldInvalid("productId")}
            helperText={getFieldErrorMessages("productId")}
          />
        )}
      />
      <Autocomplete
        id="commerceId"
        loading={commercesQuery.isLoading}
        options={commerces.map((x) => x.id)}
        getOptionLabel={(option) => {
          const commerce = commerces.find((x) => x.id === option);
          return commerce ? `${commerce.name} - ${commerce.address}` : "";
        }}
        isOptionEqualToValue={(option, value) => option === value}
        value={values.commerceId || null}
        onChange={(_, value) =>
          void setFieldValueSecure(
            "commerceId",
            value ?? initialValues.commerceId,
          )
        }
        fullWidth
        renderInput={(params) => (
          <TextField
            {...params}
            name="commerceId"
            label="Comercio"
            margin="normal"
            error={isFieldInvalid("commerceId")}
            helperText={getFieldErrorMessages("commerceId")}
          />
        )}
      />
      <NumericFormat
        id="price"
        name="price"
        label="Precio"
        margin="normal"
        fullWidth
        error={isFieldInvalid("price")}
        helperText={getFieldErrorMessages("price")}
        InputProps={{
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        customInput={TextField}
        value={values.price}
        onValueChange={(values) =>
          void setFieldValueSecure("price", values.floatValue ?? NaN)
        }
        thousandSeparator
        valueIsNumericString
        allowNegative={false}
      />
      <LoadingButton
        type="submit"
        loading={isSubmitting}
        variant="contained"
        sx={{ my: 2 }}
        fullWidth
      >
        Publicar
      </LoadingButton>
    </form>
  );
}
