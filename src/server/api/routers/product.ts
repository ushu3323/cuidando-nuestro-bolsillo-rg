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
});
