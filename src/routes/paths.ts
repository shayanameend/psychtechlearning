export const paths = {
  root: () => "/",
  api: {
    auth: {
      root: () => "/api/auth",
      signUp: () => "/api/auth/sign-up",
      signIn: () => "/api/auth/sign-in",
      resetPassword: () => "/api/auth/reset-password",
      resendOTP: () => "/api/auth/resend-otp",
      verifyOTP: () => "/api/auth/verify-otp",
      updatePassword: () => "/api/auth/update-password",
      refresh: () => "/api/auth/refresh",
      profile: () => "/api/auth/profile",
    },
    weeks: {
      root: () => "/api/weeks",
      id: {
        root: ({ id }: { id: string }) => `/api/weeks/${id}`,
        flashcards: {
          bulk: ({ id }: { id: string }) => `/api/weeks/${id}/flashcards/bulk`,
        },
        sampleTestQuestions: {
          bulk: ({ id }: { id: string }) =>
            `/api/weeks/${id}/sample-test-questions/bulk`,
        },
        finalTestQuestions: {
          bulk: ({ id }: { id: string }) =>
            `/api/weeks/${id}/final-test-questions/bulk`,
        },
        userNotes: {
          bulk: ({ id }: { id: string }) => `/api/weeks/${id}/user-notes/bulk`,
        },
      },
    },
  },
  app: {
    auth: {
      root: () => "/auth",
      signUp: () => "/auth/sign-up",
      signIn: () => "/auth/sign-in",
      forgotPassword: () => "/auth/forgot-password",
      verifyOTP: () => "/auth/verify-otp",
      profile: {
        create: () => "/auth/profile/create",
        update: () => "/auth/profile/update",
      },
    },
    dashboard: {
      root: () => "/dashboard",
    },
    admin: {
      root: () => "/admin",
    },
  },
};
