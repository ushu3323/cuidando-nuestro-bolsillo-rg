import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const offerRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        code: z
          .string()
          .length(13, {
            message: "Debe contener 13 caracteres",
          })
          .pipe(
            z
              .string()
              .regex(/[0-9]+/g, { message: "Solo se permiten numeros" }),
          ),
        name: z
          .string()
          .nonempty({ message: "No debe quedar vacio" })
          .max(40)
          .pipe(
            z.string().regex(/^[a-zA-Z0-9 ]+$/, {
              message: "Solo se aceptan letras, numeros y espacios",
            }),
          )
          .transform((v) =>
            v
              .split(/ +/)
              .map((v) => v.at(0)?.toUpperCase() + v.substring(1))
              .join(" "),
          ),
        price: z
          .number({ invalid_type_error: "Debe ingresar el precio" })
          .positive({ message: "Ingrese un precio valido" }),
        commerce_name: z
          .string()
          .nonempty({ message: "No debe quedar vacio" })
          .max(40)
          .pipe(
            z.string().regex(/^[a-zA-Z0-9 ]+$/, {
              message: "Solo se aceptan letras, numeros y espacios",
            }),
          )
          .transform((v) =>
            v
              .split(/ +/)
              .map((v) => v.at(0)?.toUpperCase() + v.substring(1))
              .join(" "),
          ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
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
              where: { name: input.commerce_name },
              create: {
                name: input.commerce_name,
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
