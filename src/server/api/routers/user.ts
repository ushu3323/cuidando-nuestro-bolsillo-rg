import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getCount: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.count();
  })
})