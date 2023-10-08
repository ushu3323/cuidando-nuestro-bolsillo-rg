import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const offerRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z
          .string()
          .nonempty({ message: "El nombre no debe quedar vacio" }),
        price: z.number().positive({ message: "El precio debe ser positivo" }),
        commerce: z.object({
          name: z.string().nonempty(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      input.commerce.name = input.commerce.name
        .split(/ +/)
        .map((v) => v.at(0)?.toUpperCase() + v.substring(1))
        .join(" ");
      return ctx.db.offer.create({
        data: {
          price: new Prisma.Decimal(input.price),
          product: {
            connectOrCreate: {
              where: { name: input.name },
              create: { name: input.name },
            },
          },
          commerce: {
            connectOrCreate: {
              where: { name: input.commerce.name },
              create: {
                name: input.commerce.name,
              },
            },
          },
        },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.offer.findMany({
      select: {
        id: true,
        product: true,
        commerce: true,
        price: true,
        publishDate: true,
      },
    });
  }),
  getForProduct: publicProcedure
    .input(z.object({ productId: z.string().uuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.offer.findMany({
        where: {
          productId: input.productId,
        },
        select: {
          id: true,
          product: true,
          commerce: true,
          price: true,
          publishDate: true,
        },
      });
    }),
});
