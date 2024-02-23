import { type PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure, createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { productCategoryRouter } from "./category";

export const productRouter = createTRPCRouter({
  category: productCategoryRouter,
  create: adminProcedure.input(z.object({
    name: z.string().nonempty(),
    categoryId: z.string().uuid(),
  })).mutation(async ({ ctx, input }) => {
    await ctx.db.product.create({
      data: input,
    });
  }),
  update: adminProcedure.input(z.object({
    id: z.string().uuid(),
    name: z.string(),
    categoryId: z.string().uuid(),
  }))
    .mutation(async ({ ctx, input: { id, ...input } }) => {
      return await ctx.db.product.update({
        data: input,
        where: { id }
      }).catch((error: PrismaClientKnownRequestError) => {
        if (error.code === "P2002") {
          throw new TRPCError({
            code: "CONFLICT",
            message: `Ya existe un producto con ese nombre`
          })
        }
      })
    }),
  getCount: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.product.count()
  }),
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.product.findMany({
      select: {
        id: true,
        name: true,
        category: true,
      },
    });
  }),
  delete: protectedProcedure
    .input(z.object({
      id: z.string().uuid()
    }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.product.delete({
        where: { id: input.id },
      }).catch((err: PrismaClientKnownRequestError) => {
        if (err.code === "P2003") // Foreigh key constraint failed
          throw new TRPCError({
            code: "CONFLICT",
            message: "El producto ya posee publicaciones, eliminelas antes de continuar"
          })
        throw err;
      })
    })
});
