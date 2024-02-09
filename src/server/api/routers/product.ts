import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const productRouter = createTRPCRouter({
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
