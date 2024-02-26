import { z } from "zod";
import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { commerceRouter } from "./routers/commerce";
import { productRouter } from "./routers/product";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  commerce: commerceRouter,
  product: productRouter,
  user: userRouter,
  search: protectedProcedure.input(z.object({ query: z.string() })).query(({ input, ctx }) => {
    return ctx.db.post.findMany({
      orderBy: [
        { price: "asc" },
        { publishDate: "desc" },
      ],
      distinct: ["commerceId", "productId", "price"],
      where: {
        product: {
          name: {
            mode: "insensitive",
            contains: input.query,
          },
        },
      },
      select: {
        id: true,
        image: true,
        commerce: true,
        price: true,
        product: true,
        publishDate: true,
        _count: {
          select: {
            colaborations: true,
          }
        }
      }
    });
  })
});

// export type definition of API
export type AppRouter = typeof appRouter;
