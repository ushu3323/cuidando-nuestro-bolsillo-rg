import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const productRouter = createTRPCRouter({
  getAllWithBrands: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.product.findMany({
      where: {
        brandedProducts: {
          some: {
            productId: { not: "" },
          },
        },
      },
      include: {
        brandedProducts: {
          select: { brand: true },
        },
      },
    });
    return products.map(({ brandedProducts, ...rest }) => ({
      ...rest,
      brands: brandedProducts.map((bp) => bp.brand),
    }));
  }),
  getBrandedWithOffers: publicProcedure
    .input(z.object({ brandedProductId: z.string().uuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.brandedProduct.findUnique({
        where: {
          id: input.brandedProductId,
        },
        select: {
          product: true,
          brand: true,
          offers: {
            select: {
              id: true,
              price: true,
              commerce: true,
              publishDate: true,
            },
          },
        },
      });
    }),
});
