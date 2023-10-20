import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const commerceRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.commerce.findMany();
  }),
});
