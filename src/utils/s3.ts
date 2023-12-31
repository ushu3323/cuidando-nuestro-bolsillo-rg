import { S3Client } from "@aws-sdk/client-s3";
import { env } from "../env.mjs";

export const s3 = new S3Client({
  region: "auto",
  endpoint: env.S3_ENDPOINT_URL,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
});
