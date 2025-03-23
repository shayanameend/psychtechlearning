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
    courses: {
      root: () => "/api/courses",
      id: {
        root: ({ id }: { id: string }) => `/api/courses/${id}`,
        flashcards: {
          bulk: ({ id }: { id: string }) =>
            `/api/courses/${id}/flashcards/bulk`,
        },
        sampleTestQuestions: {
          bulk: ({ id }: { id: string }) =>
            `/api/courses/${id}/sample-test-questions/bulk`,
        },
        finalTestQuestions: {
          bulk: ({ id }: { id: string }) =>
            `/api/courses/${id}/final-test-questions/bulk`,
        },
        userNotes: {
          bulk: ({ id }: { id: string }) =>
            `/api/courses/${id}/user-notes/bulk`,
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
    courses: {
      root: () => "/courses",
      id: {
        root: ({ id }: { id: string }) => `/courses/${id}`,
      },
    },
    admin: {
      root: () => "/admin",
    },
  },
};
