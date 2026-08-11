import { CSRF_HEADER_NAME, UID_COOKIE_NAME } from "./env";

export const Config = {
  cookies: {
    session: {
      name: 'MIMISBRUNNR_SID',
    },
     userId: {
      name: UID_COOKIE_NAME,
    },
  },
   csrf: {
    headerName: CSRF_HEADER_NAME,
  }, 
/*   frontend: {
    accountVerificationPath: '/account/verify',
    passwordResetPath: '/account/reset',
  }, */
} as const;