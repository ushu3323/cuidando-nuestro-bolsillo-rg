declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      NETLIFY?: boolean;
      PULL_REQUEST?: string;
      URL?: string;
      DEPLOY_URL?: string;
      DEPLOY_PRIME_URL?: string;
    }
  }
}

export {};
