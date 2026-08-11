declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;

      // APP
      PORT: string;
      VERSION: string;
      NODE_ENV: 'development' | 'production' | 'test';
      CORS_ORIGIN: string;

      // FRONTEND
      FRONTEND_URL: string;

      // SECURITY
      COOKIE_SECRET: string;
      CSRF_TOKEN_SIZE: string;
    }
  }
}

export default {};