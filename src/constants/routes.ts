export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  LOGIN_CALLBACK: '/auth/github/callback',
  OTHER: '/not-found',
  ABOUT: '/about',
  PROFILE: ':id/profile',
  CODE: '/code', // TODO: remove this
  ERROR: '/error',
};

export const NESTED_ROUTES = {
  CODE_ID: '/code/:id',
};
