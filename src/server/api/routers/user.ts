import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getCount: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.count();
  }),
  acceptTOS: publicProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session) {
      throw new TRPCError({
        code: "UNAUTHORIZED"
      })
    }

    const user = await ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      }
    });

    if (!user) {
      // The request might be from an unkown client!
      throw new TRPCError({
        code: "BAD_REQUEST"
      })
    }

    if (user.TOSAccepted instanceof Date) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "TOS already accepted"
      });
    }

    return ctx.db.user.update({
      where: {
        id: user.id,
      },
      data: {
        TOSAccepted: new Date(),
      },
    })
  })
})