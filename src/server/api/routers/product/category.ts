import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const productCategoryRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.category.findMany();
  }),
  getCount: publicProcedure.query(({ ctx }) => {
    return ctx.db.category.count();
  })
});
