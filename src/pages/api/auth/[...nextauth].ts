import NextAuth from "next-auth";

import { authOptions } from "~/server/auth";

export const runtime = 'experimental-edge';

export default NextAuth(authOptions);
