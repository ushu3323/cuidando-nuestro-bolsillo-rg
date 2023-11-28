import { type FirebaseError } from "firebase-admin";
import { cert, getApp, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { env } from "../env.mjs";

try {
  getApp();
} catch (error) {
  const fbError = error as FirebaseError;
  if (fbError.code === "app/no-app") {
    initializeApp({
      credential: cert({
        projectId: env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: env.FIREBASE_ADMIN_PRIVATE_KEY,
      }),
    });
  }
  throw error;
}

export const auth = getAuth();
