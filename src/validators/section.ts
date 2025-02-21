import { default as zod } from "zod";

const FlashcardSchema = zod.object({
  question: zod.string(),
  answer: zod.string(),
});

const QuestionSchema = zod.object({
  question: zod.string(),
  answers: zod.array(zod.string()),
  correctAnswer: zod.string(),
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

const UpdateSectionSchema = CreateSectionSchema;

export { CreateSectionSchema, UpdateSectionSchema };
