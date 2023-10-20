import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const offerRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        productId: z.string().uuid({ message: "El producto es requerido" }),
        brandId: z.string().uuid({ message: "El producto es requerido" }),
        commerceId: z.string().uuid({ message: "El comercio es requerido" }),
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
