import { default as zod } from "zod";

const FlashcardSchema = zod.object({
  question: zod
    .string({
      message: "Question is required!",
    })
    .min(3, {
      message: "Question must be at least 3 characters long!",
    }),
  answer: zod
    .string({
      message: "Answer is required!",
    })
    .min(3, {
      message: "Answer must be at least 3 characters long!",
    }),
});

const QuestionSchema = zod.object({
  question: zod
    .string({
      message: "Question is required!",
    })
    .min(3, {
      message: "Question must be at least 3 characters long!",
    }),
  answers: zod.array(
    zod
      .string({
        message: "Answer is required!",
      })
      .min(3, {
        message: "Answer must be at least 3 characters long!",
      }),
  ),
  correctAnswer: zod
    .string({
      message: "Correct answer is required!",
    })
    .min(3, {
      message: "Correct answer must be at least 3 characters long!",
    }),
});

const UserNoteSchema = zod.object({
  content: zod
    .string({
      message: "Content is required!",
    })
    .min(3, {
      message: "Content must be at least 3 characters long!",
    }),
});

const CreateWeekSchema = zod.object({
  weekOrder: zod.coerce
    .number({
      message: "Week order is required!",
    })
    .min(1, {
      message: "Week order must be at least 1!",
    }),
  weekTitle: zod
    .string({
      message: "Week title is required!",
    })
    .min(3, {
      message: "Week title must be at least 3 characters long!",
    }),
  weekDescription: zod
    .string({
      message: "Week description is required!",
    })
    .min(32, {
      message: "Week description must be at least 32 characters long!",
    }),
  guideLink: zod
    .string({
      message: "Guide link is required!",
    })
    .url({
      message: "Guide link must be a valid url!",
    }),
  guideDescription: zod
    .string({
      message: "Guide description is required!",
    })
    .min(3, {
      message: "Guide description must be at least 3 characters long!",
    }),
  audioLink: zod
    .string({
      message: "Audio link is required!",
    })
    .url({
      message: "Audio link must be a valid url!",
    }),
  audioDescription: zod
    .string({
      message: "Audio description is required!",
    })
    .min(3, {
      message: "Audio description must be at least 3 characters long!",
    }),
  flashcardsDescription: zod
    .string({
      message: "Flashcards description is required!",
    })
    .min(3, {
      message: "Flashcards description must be at least 3 characters long!",
    }),
  sampleTestDescription: zod
    .string({
      message: "Sample test description is required!",
    })
    .min(3, {
      message: "Sample test description must be at least 3 characters long!",
    }),
  finalTestDescription: zod
    .string({
      message: "Final test description is required!",
    })
    .min(3, {
      message: "Final test description must be at least 3 characters long!",
    }),
  flashcards: zod.array(FlashcardSchema).min(1, {
    message: "Flashcards must have at least 1 item!",
  }),
  sampleTestQuestions: zod.array(QuestionSchema).min(1, {
    message: "Sample test questions must have at least 1 item!",
  }),
  finalTestQuestions: zod.array(QuestionSchema).min(1, {
    message: "Final test questions must have at least 1 item!",
  }),
});

const BulkUpdateFlashcardsSchema = zod.object({
  flashcards: zod.array(
    FlashcardSchema.extend({
      id: zod
        .string({
          message: "Flashcard id is required!",
        })
        .min(3, {
          message: "Flashcard id must be at least 3 characters long!",
        }),
    }),
  ),
  deletedFlashcards: zod.array(
    zod
      .string({
        message: "Flashcard id is required!",
      })
      .min(3, {
        message: "Flashcard id must be at least 3 characters long!",
      }),
  ),
  newFlashcards: zod.array(FlashcardSchema),
});

const BulkUpdateSampleTestQuestionsSchema = zod.object({
  sampleTestQuestions: zod.array(
    QuestionSchema.extend({
      id: zod
        .string({
          message: "Question id is required!",
        })
        .min(3, {
          message: "Question id must be at least 3 characters long!",
        }),
    }),
  ),
  deletedSampleTestQuestions: zod.array(
    zod
      .string({
        message: "Question id is required!",
      })
      .min(3, {
        message: "Question id must be at least 3 characters long!",
      }),
  ),
  newSampleTestQuestions: zod.array(QuestionSchema),
});

const BulkUpdateFinalTestQuestionsSchema = zod.object({
  finalTestQuestions: zod.array(
    QuestionSchema.extend({
      id: zod
        .string({
          message: "Question id is required!",
        })
        .min(3, {
          message: "Question id must be at least 3 characters long!",
        }),
    }),
  ),
  deletedFinalTestQuestions: zod.array(
    zod
      .string({
        message: "Question id is required!",
      })
      .min(3, {
        message: "Question id must be at least 3 characters long!",
      }),
  ),
  newFinalTestQuestions: zod.array(QuestionSchema),
});

const BulkUpdateUserNotesSchema = zod.object({
  notes: zod.array(
    UserNoteSchema.extend({
      id: zod
        .string({
          message: "User note id is required!",
        })
        .min(3, {
          message: "User note id must be at least 3 characters long!",
        }),
    }),
  ),
  deletedNotes: zod.array(
    zod
      .string({
        message: "User note id is required!",
      })
      .min(3, {
        message: "User note id must be at least 3 characters long!",
      }),
  ),
  newNotes: zod.array(UserNoteSchema),
});

const UpdateWeekSchema = CreateWeekSchema;

export {
  CreateWeekSchema,
  UpdateWeekSchema,
  BulkUpdateFlashcardsSchema,
  BulkUpdateSampleTestQuestionsSchema,
  BulkUpdateFinalTestQuestionsSchema,
  BulkUpdateUserNotesSchema,
};
