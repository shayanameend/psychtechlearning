export const paths = {
  root: () => "/",
  auth: {
    signUp: () => "/auth/signup",
    signIn: () => "/auth/signin",
    forgotPassword: () => "/auth/forgot-password",
    verifyOTP: () => "/auth/verify-otp",
  },
  profile: {
    create: () => "/profile/create",
    update: () => "/profile/update",
  },
};
