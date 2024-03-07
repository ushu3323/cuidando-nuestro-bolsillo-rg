import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { DateTime } from "luxon";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getCount: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.count();
  }),
  getTodayRanking: protectedProcedure.query(({ctx}) => {
    const today = DateTime.now().setZone("UTC-3").startOf("day");

    if (!today.isValid) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR"
      })
    }

    return ctx.db.$queryRaw<{
      id: string,
      name: string,
      image: string,
      postsCount: number,
    }[]>(Prisma.sql`
      SELECT "User"."id", "User"."name", "User"."image", CAST(COUNT(*) AS INTEGER) "postsCount"
      FROM "Post"
      INNER JOIN "User" ON ("User".id = "Post"."authorId")  
      WHERE "publishDate" >= ${today.toUTC().toISO()}::date
      GROUP BY "User".id
      ORDER BY "postsCount" DESC;
    `)
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