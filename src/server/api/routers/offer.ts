import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const offerRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        productId: z
          .string()
          .nonempty({ message: "El producto no debe quedar vacio" })
          .uuid({}),
        brandId: z
          .string()
          .nonempty({ message: "La marca del producto no debe quedar vacia" })
          .uuid(),
        commerceId: z
          .string()
          .nonempty({ message: "El comercio no debe quedar vacio" })
          .uuid(),
        price: z
          .number({ invalid_type_error: "Debe ingresar el precio" })
          .positive({ message: "Ingrese un precio valido" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.offer.create({
        data: {
          brandedProduct: {
            connect: {
              productId_brandId: {
                productId: input.productId,
                brandId: input.brandId,
              },
            },
          },
          commerce: {
            connect: {
              id: input.commerceId,
            },
          },
          price: new Prisma.Decimal(input.price),
        },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.offer.findMany({
      select: {
        id: true,
        brandedProduct: {
          include: { brand: true, product: true },
        },
        commerce: true,
        price: true,
        publishDate: true,
      },
    });
  }),
  getByBrandedProduct: publicProcedure
    .input(z.object({ brandedProductId: z.string().uuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.offer.findMany({
        where: {
          brandedProduct: { id: input.brandedProductId },
        },
        select: {
          id: true,
          brandedProduct: true,
          commerce: true,
          price: true,
          publishDate: true,
        },
      });
    }),
});
