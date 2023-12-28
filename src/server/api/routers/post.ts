import { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        productId: z
          .string()
          .nonempty({ message: "El producto no debe quedar vacio" })
          .pipe(z.string().uuid()),
        commerceId: z
          .string()
          .nonempty({ message: "El comercio no debe quedar vacio" })
          .pipe(z.string().uuid()),
        image: z
          .string()
          .nonempty({ message: "La imagen es requerida" })
          .url({ message: "Url invalido" }),
        price: z
          .number({ invalid_type_error: "Debe ingresar el precio" })
          .positive({ message: "Ingrese un precio valido" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          product: {
            connect: { id: input.productId },
          },
          commerce: {
            connect: {
              id: input.commerceId,
            },
          },
          image: input.image,
          price: new Prisma.Decimal(input.price),
          author: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({
      select: {
        id: true,
        product: true,
        commerce: true,
        price: true,
        publishDate: true,
      },
    });
  }),
  getDaily: publicProcedure.query(({ ctx }) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return ctx.db.post.findMany({
      orderBy: [{ price: "asc" }, { publishDate: "desc" }],
      distinct: "productId",
      select: {
        id: true,
        product: true,
        commerce: true,
        price: true,
        publishDate: true,
      },
    });
  }),
  getByProduct: publicProcedure
    .input(z.object({ productId: z.string().uuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.product.findUnique({
        where: { id: input.productId },
        include: {
          category: true,
          posts: {
            select: {
              id: true,
              commerce: true,
              price: true,
              publishDate: true,
            },
          },
        },
      });
    }),
});
