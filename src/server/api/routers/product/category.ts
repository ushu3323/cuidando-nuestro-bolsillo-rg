import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const productCategoryRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.category.findMany();
  }),
});
