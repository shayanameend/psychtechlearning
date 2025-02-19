export const paths = {
  root: () => "/",
  auth: {
    signUp: () => "/auth/sign-up",
    signIn: () => "/auth/sign-in",
    forgotPassword: () => "/auth/forgot-password",
    verifyOTP: () => "/auth/verify-otp",
  },
  profile: {
    create: () => "/profile/create",
    update: () => "/profile/update",
  },
  app: {
    dashboard: () => "/dashboard",
  },
};
