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
    blocks: {
      root: () => "/api/blocks",
      id: {
        root: ({ id }: { id: string }) => `/api/blocks/${id}`,
        publish: ({ id }: { id: string }) => `/api/blocks/${id}/publish`,
        flashcardsEnable: ({ id }: { id: string }) =>
          `/api/blocks/${id}/flashcards-enable`,
        sampleTestEnable: ({ id }: { id: string }) =>
          `/api/blocks/${id}/sample-test-enable`,
        finalTestEnable: ({ id }: { id: string }) =>
          `/api/blocks/${id}/final-test-enable`,
        flashcards: {
          bulk: ({ id }: { id: string }) => `/api/blocks/${id}/flashcards/bulk`,
        },
        weeks: {
          bulk: ({ id }: { id: string }) => `/api/blocks/${id}/weeks/bulk`,
          id: {
            presentations: {
              bulk: ({ id, weekId }: { id: string; weekId: string }) =>
                `/api/blocks/${id}/weeks/${weekId}/presentations/bulk`,
            },
            audios: {
              bulk: ({ id, weekId }: { id: string; weekId: string }) =>
                `/api/blocks/${id}/weeks/${weekId}/audios/bulk`,
            },
          },
        },
        sampleTestQuestions: {
          bulk: ({ id }: { id: string }) =>
            `/api/blocks/${id}/sample-test-questions/bulk`,
        },
        finalTestQuestions: {
          bulk: ({ id }: { id: string }) =>
            `/api/blocks/${id}/final-test-questions/bulk`,
        },
        userNotes: {
          bulk: ({ id }: { id: string }) => `/api/blocks/${id}/user-notes/bulk`,
        },
      },
    },
    users: {
      root: () => "/api/users",
      id: {
        block: ({ id }: { id: string }) => `/api/users/${id}/block`,
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
    blocks: {
      root: () => "/blocks",
      id: {
        root: ({ id }: { id: string }) => `/blocks/${id}`,
      },
    },
    admin: {
      root: () => "/admin",
    },
  },
};
