import { z } from "zod";
import { adminProcedure, createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const commerceRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.commerce.findMany();
  }),
  getCount: publicProcedure.query(({ ctx }) => {
    return ctx.db.commerce.count()
  }),
  create: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      address: z.string().min(1),
    }))
    .mutation(({ctx, input}) => {
      return ctx.db.commerce.create({
        data: input
      })
    }),
  update: adminProcedure
    .input(z.object({
      id: z.string().uuid(),
      name: z.string().min(1),
      address: z.string().min(1),
    }))
    .mutation(({ctx, input}) => {
      const {id, ...data} = input
      return ctx.db.commerce.update({
        where: {id},
        data
      })
    }),
  delete: adminProcedure
    .input(z.object({
      id: z.string().uuid()
    }))
    .mutation(({ctx, input}) => {
      return ctx.db.commerce.delete({
        where: {
          id: input.id
        }
      })
    })
});
