export const paths = {
  root: () => "/",
  api: {
    auth: {
      signUp: () => "/api/auth/sign-up",
      signIn: () => "/api/auth/sign-in",
      resetPassword: () => "/api/auth/reset-password",
      resendOTP: () => "/api/auth/resend-otp",
      verifyOTP: () => "/api/auth/verify-otp",
      updatePassword: () => "/api/auth/update-password",
      refresh: () => "/api/auth/refresh",
    },
  },
  app: {
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
    dashboard: {
      root: () => "/dashboard",
    },
  },
};
