import { offerRouter } from "~/server/api/routers/offer";
import { createTRPCRouter } from "~/server/api/trpc";
import { commerceRouter } from "./routers/commerce";
import { productRouter } from "./routers/product";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  offer: offerRouter,
  commerce: commerceRouter,
  product: productRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
