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

const PresentationSchema = zod.object({
  title: zod
    .string({
      message: "Presentation title is required!",
    })
    .min(3, {
      message: "Presentation title must be at least 3 characters long!",
    }),
  presentationLink: zod
    .string({
      message: "Presentation link is required!",
    })
    .url({
      message: "Presentation link must be a valid URL!",
    }),
});

const AudioSchema = zod.object({
  title: zod
    .string({
      message: "Audio title is required!",
    })
    .min(3, {
      message: "Audio title must be at least 3 characters long!",
    }),
  audioLink: zod
    .string({
      message: "Audio link is required!",
    })
    .url({
      message: "Audio link must be a valid URL!",
    }),
});

const WeekSchema = zod.object({
  weekNumber: zod.coerce
    .number({
      message: "Week number is required!",
    })
    .min(1, {
      message: "Week number must be at least 1!",
    }),
  title: zod
    .string({
      message: "Week title is required!",
    })
    .min(3, {
      message: "Week title must be at least 3 characters long!",
    }),
});

const CreateBlockSchema = zod.object({
  blockOrder: zod.coerce
    .number({
      message: "Block order is required!",
    })
    .min(1, {
      message: "Block order must be at least 1!",
    }),
  blockTitle: zod
    .string({
      message: "Block title is required!",
    })
    .min(3, {
      message: "Block title must be at least 3 characters long!",
    }),
  blockDescription: zod
    .string({
      message: "Block description is required!",
    })
    .min(32, {
      message: "Block description must be at least 32 characters long!",
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
  weeksDescription: zod
    .string({
      message: "Weeks description is required!",
    })
    .min(3, {
      message: "Weeks description must be at least 3 characters long!",
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
  isPublished: zod.boolean().optional().default(false),
  isFlashcardsEnabled: zod.boolean().optional().default(false),
  isSampleTestEnabled: zod.boolean().optional().default(false),
  isFinalTestEnabled: zod.boolean().optional().default(false),
  weeks: zod.array(WeekSchema).min(1, {
    message: "Block must have at least 1 week!",
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

const BulkUpdatePresentationsSchema = zod.object({
  presentations: zod.array(
    PresentationSchema.extend({
      id: zod
        .string({
          message: "Presentation id is required!",
        })
        .min(3, {
          message: "Presentation id must be at least 3 characters long!",
        }),
    }),
  ),
  deletedPresentations: zod.array(
    zod
      .string({
        message: "Presentation id is required!",
      })
      .min(3, {
        message: "Presentation id must be at least 3 characters long!",
      }),
  ),
  newPresentations: zod.array(PresentationSchema),
});

const BulkUpdateAudiosSchema = zod.object({
  audios: zod.array(
    AudioSchema.extend({
      id: zod
        .string({
          message: "Audio id is required!",
        })
        .min(3, {
          message: "Audio id must be at least 3 characters long!",
        }),
    }),
  ),
  deletedAudios: zod.array(
    zod
      .string({
        message: "Audio id is required!",
      })
      .min(3, {
        message: "Audio id must be at least 3 characters long!",
      }),
  ),
  newAudios: zod.array(AudioSchema),
});

const BulkUpdateWeeksSchema = zod.object({
  weeks: zod.array(
    WeekSchema.extend({
      id: zod
        .string({
          message: "Week id is required!",
        })
        .min(3, {
          message: "Week id must be at least 3 characters long!",
        }),
    }),
  ),
  deletedWeeks: zod.array(
    zod
      .string({
        message: "Week id is required!",
      })
      .min(3, {
        message: "Week id must be at least 3 characters long!",
      }),
  ),
  newWeeks: zod.array(WeekSchema),
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

const UpdateBlockSchema = CreateBlockSchema;

const UpdateBlockPublishStatusSchema = zod.object({
  isPublished: zod.boolean({
    message: "Publish status is required!",
  }),
});

const UpdateBlockFlashcardsStatusSchema = zod.object({
  isFlashcardsEnabled: zod.boolean({
    message: "Flashcards status is required!",
  }),
});

const UpdateBlockSampleTestStatusSchema = zod.object({
  isSampleTestEnabled: zod.boolean({
    message: "Sample test status is required!",
  }),
});

const UpdateBlockFinalTestStatusSchema = zod.object({
  isFinalTestEnabled: zod.boolean({
    message: "Final test status is required!",
  }),
});

export {
  CreateBlockSchema,
  UpdateBlockSchema,
  UpdateBlockPublishStatusSchema,
  UpdateBlockFlashcardsStatusSchema,
  UpdateBlockSampleTestStatusSchema,
  UpdateBlockFinalTestStatusSchema,
  BulkUpdatePresentationsSchema,
  BulkUpdateAudiosSchema,
  BulkUpdateWeeksSchema,
  BulkUpdateFlashcardsSchema,
  BulkUpdateSampleTestQuestionsSchema,
  BulkUpdateFinalTestQuestionsSchema,
  BulkUpdateUserNotesSchema,
};
