import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type User as DbUser, type Role } from "@prisma/client";
import {
  GetServerSideProps,
  type GetServerSidePropsContext
} from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions
} from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";

import { env } from "~/env.mjs";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      role: Role;
      TOSAccepted: string | null;
      // ...other properties
      // role: UserRole;
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface User extends Pick<DbUser, "TOSAccepted" | "role"> {
    // ...other properties
    // role: UserRole;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    redirect: ({ url, baseUrl }) => {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        role: user.role,
        TOSAccepted: user.TOSAccepted?.toISOString(),
      },
    }),
  },
  adapter: PrismaAdapter(db),
  providers: [
    FacebookProvider({
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

export const getServerAuthSessionProps: GetServerSideProps = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  const session = await getServerAuthSession(ctx);
  if (session) {
    if (session.user.TOSAccepted) {
      return {
        props: {
          session,
        },
      };
    } else {
      return {
        redirect: {
          permanent: false,
          destination: `/accept-tos`
        }
      }
    }
  }

  const originUrl = ctx.req.url;
  const callbackUrlParam = originUrl && `?callbackUrl=${originUrl}`;
  console.log({ callbackUrlParam })
  return {
    props: { session },
    redirect: {
      permanent: false,
      destination: `/auth/login${callbackUrlParam}`,
    },
  };
};
