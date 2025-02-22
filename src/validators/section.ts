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

const CreateSectionSchema = zod.object({
  sectionOrder: zod
    .number({
      message: "Section order is required!",
    })
    .min(1, {
      message: "Section order must be at least 1!",
    }),
  sectionTitle: zod
    .string({
      message: "Section title is required!",
    })
    .min(3, {
      message: "Section title must be at least 3 characters long!",
    }),
  sectionDescription: zod
    .string({
      message: "Section description is required!",
    })
    .min(32, {
      message: "Section description must be at least 32 characters long!",
    }),
  guideLabel: zod
    .string({
      message: "Guide label is required!",
    })
    .min(3, {
      message: "Guide label must be at least 3 characters long!",
    }),
  guideLink: zod
    .string({
      message: "Guide link is required!",
    })
    .url({
      message: "Guide link must be a valid url!",
    }),
  flashcardsLabel: zod
    .string({
      message: "Flashcards label is required!",
    })
    .min(3, {
      message: "Flashcards label must be at least 3 characters long!",
    }),
  sampleTestLabel: zod
    .string({
      message: "Sample test label is required!",
    })
    .min(3, {
      message: "Sample test label must be at least 3 characters long!",
    }),
  finalTestLabel: zod
    .string({
      message: "Final test label is required!",
    })
    .min(3, {
      message: "Final test label must be at least 3 characters long!",
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

const UpdateSectionSchema = CreateSectionSchema;

export {
  CreateSectionSchema,
  UpdateSectionSchema,
  BulkUpdateFlashcardsSchema,
  BulkUpdateSampleTestQuestionsSchema,
  BulkUpdateFinalTestQuestionsSchema,
  BulkUpdateUserNotesSchema,
};
