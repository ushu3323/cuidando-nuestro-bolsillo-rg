import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { productCategoryRouter } from "./category";

export const productRouter = createTRPCRouter({
  category: productCategoryRouter,
  create: protectedProcedure.input(z.object({
    name: z.string().nonempty(),
    categoryId: z.string().uuid(),
  })).mutation(async ({ ctx, input }) => {
    await ctx.db.product.create({
      data: input,
    });
  }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.product.findMany({
      select: {
        id: true,
        name: true,
        category: true,
      },
    });
  }),
});
