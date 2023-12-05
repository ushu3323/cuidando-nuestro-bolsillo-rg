import { cert, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { env } from "../env.mjs";

const globalForFbAdmin = globalThis as unknown as {
  fbAdmin:
    | {
        app: App;
        auth: Auth;
      }
    | undefined;
};

export const fbAdmin = globalForFbAdmin.fbAdmin ?? {
  app: initializeApp({
    credential: cert({
      projectId: env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: env.FIREBASE_ADMIN_PRIVATE_KEY,
    }),
  }),
  auth: getAuth(),
};

if (env.NODE_ENV !== "production") globalForFbAdmin.fbAdmin = fbAdmin;
