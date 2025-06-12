export interface FlashcardType {
  id: string;
  question: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestQuestionType {
  id: string;
  question: string;
  answers: string[];
  correctAnswer: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlockUserNoteType {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PresentationType {
  id: string;
  title: string;
  presentationLink: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AudioType {
  id: string;
  title: string;
  audioLink: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeekType {
  id: string;
  weekNumber: number;
  title: string;
  presentations: PresentationType[];
  audios: AudioType[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BlockType {
  id: string;
  blockOrder: number;
  blockTitle: string;
  blockDescription: string;
  guideLink: string;
  guideDescription: string;
  weeksDescription: string;
  flashcardsDescription: string;
  sampleTestDescription: string;
  finalTestDescription: string;
  isPublished: boolean;
  isFlashcardsEnabled: boolean;
  isSampleTestEnabled: boolean;
  isFinalTestEnabled: boolean;
  weeks: WeekType[];
  flashcards: FlashcardType[];
  sampleTestQuestions: TestQuestionType[];
  finalTestQuestions: TestQuestionType[];
  blockUserNotes: BlockUserNoteType[];
  createdAt: Date;
  updatedAt: Date;
}

export type NewFlashcardType = Omit<
  Omit<Omit<FlashcardType, "updatedAt">, "createdAt">,
  "id"
>;
export type NewTestQuestionType = Omit<
  Omit<Omit<TestQuestionType, "updatedAt">, "createdAt">,
  "id"
>;
export type NewPresentationType = Omit<
  Omit<Omit<PresentationType, "updatedAt">, "createdAt">,
  "id"
>;
export type NewAudioType = Omit<
  Omit<Omit<AudioType, "updatedAt">, "createdAt">,
  "id"
>;
export type NewWeekType = Omit<
  Omit<Omit<WeekType, "updatedAt">, "createdAt">,
  "id"
>;
