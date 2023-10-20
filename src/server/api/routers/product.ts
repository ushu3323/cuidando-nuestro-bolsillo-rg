import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const productRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.product.findMany({});
  }),
  getProductBrands: publicProcedure
    .input(z.object({ productId: z.string().uuid() }).optional())
    .query(({ ctx, input }) => {
      return ctx.db.brand.findMany({
        where: {
          brandedProducts: {
            every: {
              productId: input?.productId,
            },
          },
        },
      });
    }),
});
