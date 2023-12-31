import { z } from "zod";

const schema = z.object({
  image: z.lazy(() =>
    z.instanceof(File, {
      fatal: true,
      message: "Debe seleccionar una imagen",
    }),
  ),
  productId: z.string().min(1, { message: "Seleccione un producto" }),
  commerceId: z.string().min(1, { message: "Seleccione un comercio" }),
  price: z.number().min(1, { message: "Ingrese un precio valido" }),
});

export const NewPostFormSchema = schema;

export type NewPostFormFields = z.infer<typeof schema>;
