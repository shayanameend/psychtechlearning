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
  sectionTitle: zod.string(),
  sectionDescription: zod.string(),
  guideLabel: zod.string(),
  guideLink: zod.string().url(),
  flashcardsLabel: zod.string(),
  sampleTestLabel: zod.string(),
  finalTestLabel: zod.string(),
  flashcards: zod.array(FlashcardSchema),
  sampleTestQuestions: zod.array(QuestionSchema),
  finalTestQuestions: zod.array(QuestionSchema),
});

const UpdateSectionSchema = zod.object({
  id: zod.string(),
  sectionTitle: zod.string().optional(),
  sectionDescription: zod.string().optional(),
  guideLabel: zod.string().optional(),
  guideLink: zod.string().url(),
  flashcardsLabel: zod.string().optional(),
  sampleTestLabel: zod.string().optional(),
  finalTestLabel: zod.string().optional(),
  createFlashcards: zod.array(FlashcardSchema),
  createSampleTestQuestions: zod.array(QuestionSchema),
  createFinalTestQuestions: zod.array(QuestionSchema),
  deleteFlashcards: zod.array(zod.string()),
  deleteSampleTestQuestions: zod.array(zod.string()),
  deleteFinalTestQuestions: zod.array(zod.string()),
  updateFlashcards: zod.array(FlashcardSchema.setKey("id", zod.string())),
  updateSampleTestQuestions: zod.array(
    QuestionSchema.setKey("id", zod.string()),
  ),
  updateFinalTestQuestions: zod.array(
    QuestionSchema.setKey("id", zod.string()),
  ),
});

export { CreateSectionSchema, UpdateSectionSchema };
