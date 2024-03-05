import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { DateTime } from "luxon";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getCount: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.count();
  }),
  getConnectedCount: publicProcedure.query(async ({ctx}) => {
    const now = DateTime.now().setZone("UTC-3");
    const result = await ctx.db.$queryRaw<Record<string, unknown>[]>(
      Prisma.sql`
      SELECT COUNT(*) FROM (
        SELECT DISTINCT ON ("userId")
          "userId",
          "expires"
          FROM "Session"
          WHERE "expires" >= TO_DATE(${now.toUTC().toISO()!}, 'YYYY-MM-DD"T"HH24:MI:SS')
          ORDER BY "userId", "expires" ASC
      );`);
      
    const count = result[0]?.count as bigint ?? BigInt(0);
    return +count.toString();
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