import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const commerceRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.commerce.findMany();
  }),
  getCount: publicProcedure.query(({ ctx }) => {
    return ctx.db.commerce.count()
  })
});
