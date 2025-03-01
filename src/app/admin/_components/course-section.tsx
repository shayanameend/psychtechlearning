import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, default as axios } from "axios";
import { EditIcon, Loader2Icon, PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { useUserContext } from "~/providers/user-provider";
import { paths } from "~/routes/paths";
import { EditSectionButton } from "./edit-section-button";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TestQuestion {
  id: string;
  question: string;
  answers: string[];
  correctAnswer: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SectionUserNote {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Section {
  id: string;
  sectionOrder: number;
  sectionTitle: string;
  sectionDescription: string;
  guideLabel: string;
  guideLink: string;
  flashcardsLabel: string;
  sampleTestLabel: string;
  finalTestLabel: string;
  flashcards: Flashcard[];
  sampleTestQuestions: TestQuestion[];
  finalTestQuestions: TestQuestion[];
  sectionUserNotes: SectionUserNote[];
  createdAt: Date;
  updatedAt: Date;
}

export function CourseSection({ section }: Readonly<{ section: Section }>) {
  const queryClient = useQueryClient();

  const { token } = useUserContext();

  const [isFlashcardsDialogOpen, setIsFlashcardsDialogOpen] = useState(false);
  const [isSampleTestDialogOpen, setIsSampleTestDialogOpen] = useState(false);
  const [isFinalTestDialogOpen, setIsFinalTestDialogOpen] = useState(false);

  const [flashcards, setFlashcards] = useState<Flashcard[]>(section.flashcards);
  const [deletedFlashcards, setDeletedFlashcards] = useState<string[]>([]);
  const [newFlashcards, setNewFlashcards] = useState<
    Omit<Omit<Omit<Flashcard, "updatedAt">, "createdAt">, "id">[]
  >([]);

  const [sampleTestQuestions, setSampleTestQuestions] = useState<
    TestQuestion[]
  >(section.sampleTestQuestions);
  const [deletedSampleTestQuestions, setDeletedSampleTestQuestions] = useState<
    string[]
  >([]);
  const [newSampleTestQuestions, setNewSampleTestQuestions] = useState<
    Omit<Omit<Omit<TestQuestion, "updatedAt">, "createdAt">, "id">[]
  >([]);

  const [finalTestQuestions, setFinalTestQuestions] = useState<TestQuestion[]>(
    section.finalTestQuestions,
  );
  const [deletedFinalTestQuestions, setDeletedFinalTestQuestions] = useState<
    string[]
  >([]);
  const [newFinalTestQuestions, setNewFinalTestQuestions] = useState<
    Omit<Omit<Omit<TestQuestion, "updatedAt">, "createdAt">, "id">[]
  >([]);

  const [questionIndex, setQuestionIndex] = useState(0);

  const [questionIsEditing, setIsQuestionEditing] = useState(-1);
  const [question, setQuestion] = useState("");
  const [correctAnswerIsEditing, setIsCorrectAnswerEditing] = useState(-1);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [answersIsEditing, setIsAnswersEditing] = useState([-1, -1]);
  const [answers, setAnswers] = useState<string[]>(Array(4).fill(""));

  useEffect(() => {
    setFlashcards(section.flashcards);
    setDeletedFlashcards([]);
    setNewFlashcards([]);
    setSampleTestQuestions(section.sampleTestQuestions);
    setDeletedSampleTestQuestions([]);
    setNewSampleTestQuestions([]);
    setFinalTestQuestions(section.finalTestQuestions);
    setDeletedFinalTestQuestions([]);
    setNewFinalTestQuestions([]);
    setQuestionIndex(0);
    setQuestion("");
    setCorrectAnswer("");
    setAnswers(Array(4).fill(""));
    setIsQuestionEditing(-1);
    setIsCorrectAnswerEditing(-1);
    setIsAnswersEditing([-1, -1]);
  }, [section]);

  const updateFlashcardsMutation = useMutation({
    mutationFn: async ({
      sectionId,
      flashcards,
      deletedFlashcards,
      newFlashcards,
    }: {
      sectionId: string;
      flashcards: Flashcard[];
      deletedFlashcards: string[];
      newFlashcards: Omit<
        Omit<Omit<Flashcard, "updatedAt">, "createdAt">,
        "id"
      >[];
    }) => {
      const response = await axios.put(
        paths.api.sections.id.flashcards.bulk({ id: sectionId }),
        {
          flashcards,
          deletedFlashcards,
          newFlashcards,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    },
    onSuccess: ({ info }) => {
      toast.success(info.message);

      queryClient.invalidateQueries({ queryKey: ["sections"] });

      setDeletedFlashcards([]);
      setNewFlashcards([]);
      setIsFlashcardsDialogOpen(false);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }
    },
    onSettled: () => {
      setQuestionIndex(0);
      setQuestion("");
      setCorrectAnswer("");
      setAnswers(Array(4).fill(""));
      setIsQuestionEditing(-1);
      setIsCorrectAnswerEditing(-1);
      setIsAnswersEditing([-1, -1]);
    },
  });

  const updateSampleTestQuestionsMutation = useMutation({
    mutationFn: async ({
      sectionId,
      sampleTestQuestions,
      deletedSampleTestQuestions,
      newSampleTestQuestions,
    }: {
      sectionId: string;
      sampleTestQuestions: TestQuestion[];
      deletedSampleTestQuestions: string[];
      newSampleTestQuestions: Omit<
        Omit<Omit<TestQuestion, "updatedAt">, "createdAt">,
        "id"
      >[];
    }) => {
      const response = await axios.put(
        paths.api.sections.id.sampleTestQuestions.bulk({ id: sectionId }),
        {
          sampleTestQuestions,
          deletedSampleTestQuestions,
          newSampleTestQuestions,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    },
    onSuccess: ({ info }) => {
      toast.success(info.message);

      queryClient.invalidateQueries({ queryKey: ["sections"] });

      setDeletedSampleTestQuestions([]);
      setNewSampleTestQuestions([]);
      setIsSampleTestDialogOpen(false);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }
    },
    onSettled: () => {
      setQuestionIndex(0);
      setQuestion("");
      setCorrectAnswer("");
      setAnswers(Array(4).fill(""));
      setIsQuestionEditing(-1);
      setIsCorrectAnswerEditing(-1);
      setIsAnswersEditing([-1, -1]);
    },
  });

  const updateFinalTestQuestionsMutation = useMutation({
    mutationFn: async ({
      sectionId,
      finalTestQuestions,
      deletedFinalTestQuestions,
      newFinalTestQuestions,
    }: {
      sectionId: string;
      finalTestQuestions: TestQuestion[];
      deletedFinalTestQuestions: string[];
      newFinalTestQuestions: Omit<
        Omit<Omit<TestQuestion, "updatedAt">, "createdAt">,
        "id"
      >[];
    }) => {
      const response = await axios.put(
        paths.api.sections.id.finalTestQuestions.bulk({ id: sectionId }),
        {
          finalTestQuestions,
          deletedFinalTestQuestions,
          newFinalTestQuestions,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    },
    onSuccess: ({ info }) => {
      toast.success(info.message);

      queryClient.invalidateQueries({ queryKey: ["sections"] });

      setDeletedFinalTestQuestions([]);
      setNewFinalTestQuestions([]);
      setIsFinalTestDialogOpen(false);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }
    },
    onSettled: () => {
      setQuestionIndex(0);
      setQuestion("");
      setCorrectAnswer("");
      setAnswers(Array(4).fill(""));
      setIsQuestionEditing(-1);
      setIsCorrectAnswerEditing(-1);
      setIsAnswersEditing([-1, -1]);
    },
  });

  const deleteSectionMutation = useMutation({
    mutationFn: async (sectionId: string) => {
      const response = await axios.delete(
        paths.api.sections.id.root({ id: sectionId }),
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    },
    onSuccess: ({ info }) => {
      toast.success(info.message);

      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }
    },
  });

  return (
    <section
      key={section.id}
      className={cn(
        "flex flex-col gap-4 border border-gray-200 p-4 rounded-lg shadow-sm",
      )}
    >
      <header
        className={cn(
          "flex items-center justify-between border-b border-gray-200 pb-2",
        )}
      >
        <h3 className={cn("text-lg font-semibold text-gray-800")}>
          {section.sectionOrder}. {section.sectionTitle}
        </h3>
        <div className={cn("flex gap-2")}>
          <EditSectionButton section={section} />
          <Button
            onClick={() => {
              deleteSectionMutation.mutate(section.id);
            }}
            variant="outline"
            size="icon"
            className={cn(
              "size-9 flex items-center gap-2 border-destructive hover:bg-destructive text-destructive",
            )}
          >
            <Trash2Icon className={cn("w-4 h-4")} />
          </Button>
        </div>
      </header>
      <article className={cn("flex flex-col gap-4")}>
        <div className={cn("flex flex-col gap-2")}>
          <Label className={cn("font-bold")}>Section Description</Label>
          <p className={cn("text-sm text-gray-600")}>
            {section.sectionDescription}
          </p>
        </div>
        <div className={cn("flex flex-col gap-2")}>
          <Label className={cn("font-bold")}>Study Guide</Label>
          <a
            href={section.guideLink}
            target="_blank"
            rel="noopener noreferrer"
            className={cn("text-sm text-blue-600")}
          >
            {section.guideLabel}
          </a>
        </div>
        <div className={cn("flex gap-4 justify-between")}>
          <div className={cn("flex flex-col gap-2")}>
            <Label className={cn("font-bold")}>Flashcards</Label>
            <p className={cn("text-sm text-gray-600")}>
              {section.flashcardsLabel}
            </p>
          </div>
          <div>
            <Dialog
              open={isFlashcardsDialogOpen}
              onOpenChange={setIsFlashcardsDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setQuestionIndex(0);
                  }}
                  variant="outline"
                  size="sm"
                >
                  View
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[384px] lg:max-w-[512px]">
                <DialogHeader>
                  <DialogTitle>Flashcards: {section.sectionTitle}</DialogTitle>
                  <DialogDescription>
                    This is a set of flashcards to help you reinforce your
                    learning on {section.sectionTitle}.
                  </DialogDescription>
                </DialogHeader>
                <article className={cn("space-y-2")}>
                  <div className={cn("space-y-2 text-gray-600 text-sm")}>
                    <div className={cn("flex gap-1")}>
                      <span>{questionIndex + 1}.</span>
                      {questionIsEditing === questionIndex ? (
                        <Textarea
                          value={question}
                          onChange={(event) => {
                            setQuestion(event.currentTarget.value);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              setIsQuestionEditing(-1);

                              if (questionIndex < flashcards.length) {
                                setFlashcards(
                                  flashcards.map((flashcard, index) =>
                                    index === questionIndex
                                      ? {
                                          ...flashcard,
                                          question,
                                        }
                                      : flashcard,
                                  ),
                                );
                              } else {
                                setNewFlashcards(
                                  newFlashcards.map((flashcard, index) =>
                                    index === questionIndex - flashcards.length
                                      ? {
                                          ...flashcard,
                                          question,
                                        }
                                      : flashcard,
                                  ),
                                );
                              }
                            }
                          }}
                          className={cn("resize-none min-h-14")}
                        />
                      ) : (
                        <>
                          <span>
                            {(questionIndex >= flashcards.length
                              ? newFlashcards[questionIndex - flashcards.length]
                              : flashcards[questionIndex]
                            )?.question || "Empty Question"}
                          </span>
                          <Button
                            onClick={() => {
                              setIsQuestionEditing(questionIndex);

                              setQuestion(
                                (questionIndex >= flashcards.length
                                  ? newFlashcards[
                                      questionIndex - flashcards.length
                                    ]
                                  : flashcards[questionIndex]
                                ).question,
                              );
                            }}
                            variant="link"
                            size="icon"
                            className={cn("ml-1 size-6")}
                          >
                            <EditIcon />
                          </Button>
                        </>
                      )}
                    </div>
                    <div className={cn("ml-4 flex gap-1")}>
                      {correctAnswerIsEditing === questionIndex ? (
                        <Textarea
                          value={correctAnswer}
                          onChange={(event) => {
                            setCorrectAnswer(event.currentTarget.value);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              setIsCorrectAnswerEditing(-1);

                              if (questionIndex < flashcards.length) {
                                setFlashcards(
                                  flashcards.map((flashcard, index) =>
                                    index === questionIndex
                                      ? {
                                          ...flashcard,
                                          answer: correctAnswer,
                                        }
                                      : flashcard,
                                  ),
                                );
                              } else {
                                setNewFlashcards(
                                  newFlashcards.map((flashcard, index) =>
                                    index === questionIndex - flashcards.length
                                      ? {
                                          ...flashcard,
                                          answer: correctAnswer,
                                        }
                                      : flashcard,
                                  ),
                                );
                              }
                            }
                          }}
                          className={cn("resize-none min-h-14")}
                        />
                      ) : (
                        <>
                          <span>
                            {(questionIndex >= flashcards.length
                              ? newFlashcards[questionIndex - flashcards.length]
                              : flashcards[questionIndex]
                            )?.answer || "Empty Answer"}
                          </span>
                          <Button
                            onClick={() => {
                              setIsCorrectAnswerEditing(questionIndex);

                              setCorrectAnswer(
                                (questionIndex >= flashcards.length
                                  ? newFlashcards[
                                      questionIndex - flashcards.length
                                    ]
                                  : flashcards[questionIndex]
                                ).answer,
                              );
                            }}
                            variant="link"
                            size="icon"
                            className={cn("ml-1 size-6")}
                          >
                            <EditIcon />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
                <DialogFooter className={cn("justify-between")}>
                  <div className={cn("flex gap-2")}>
                    <Button
                      onClick={() => {
                        setNewFlashcards([
                          ...newFlashcards,
                          {
                            question: `Question ${flashcards.length - deletedFlashcards.length + newFlashcards.length + 1}`,
                            answer: `Answer ${flashcards.length - deletedFlashcards.length + newFlashcards.length + 1}`,
                          },
                        ]);

                        setQuestionIndex(
                          flashcards.length -
                            deletedFlashcards.length +
                            newFlashcards.length,
                        );
                      }}
                      size="sm"
                      variant="outline"
                      className={cn("px-2 height-8 gap-1")}
                    >
                      <PlusIcon />
                      New Card
                    </Button>
                    <Button
                      onClick={() => {
                        if (questionIndex < flashcards.length) {
                          setDeletedFlashcards([
                            ...deletedFlashcards,
                            flashcards[questionIndex].id,
                          ]);

                          setFlashcards(
                            flashcards.filter(
                              (_, index) => index !== questionIndex,
                            ),
                          );
                        } else {
                          setNewFlashcards(
                            newFlashcards.filter(
                              (_, index) =>
                                index !== questionIndex - flashcards.length,
                            ),
                          );
                        }

                        if (questionIndex !== 0) {
                          setQuestionIndex(questionIndex - 1);
                        }
                      }}
                      disabled={
                        (flashcards.length + newFlashcards.length < 2 &&
                          questionIndex) ===
                        flashcards.length + newFlashcards.length - 1
                      }
                      variant="outline"
                      size="icon"
                      className={cn(
                        "size-9 flex items-center gap-2 border-destructive hover:bg-destructive text-destructive",
                      )}
                    >
                      <Trash2Icon className={cn("w-4 h-4")} />
                    </Button>
                  </div>
                  <div className={cn("flex gap-2")}>
                    <Button
                      onClick={() => {
                        if (questionIndex > 0) {
                          setQuestionIndex(questionIndex - 1);
                        }

                        setIsQuestionEditing(-1);
                        setIsCorrectAnswerEditing(-1);
                      }}
                      disabled={questionIndex === 0}
                      size="sm"
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => {
                        if (
                          questionIndex <
                          flashcards.length + newFlashcards.length - 1
                        ) {
                          setQuestionIndex(questionIndex + 1);
                        }

                        setIsQuestionEditing(-1);
                        setIsCorrectAnswerEditing(-1);

                        if (
                          questionIndex ===
                          flashcards.length + newFlashcards.length - 1
                        ) {
                          updateFlashcardsMutation.mutate({
                            sectionId: section.id,
                            flashcards,
                            deletedFlashcards,
                            newFlashcards,
                          });
                        }
                      }}
                      size="sm"
                      variant="outline"
                    >
                      {updateFlashcardsMutation.isPending && (
                        <Loader2Icon className={cn("animate-spin")} />
                      )}
                      <span>
                        {questionIndex ===
                        flashcards.length + newFlashcards.length - 1
                          ? "Save"
                          : "Next"}
                      </span>
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className={cn("flex gap-4 justify-between")}>
          <div className={cn("flex flex-col gap-2")}>
            <Label className={cn("font-bold")}>Sample Test</Label>
            <p className={cn("text-sm text-gray-600")}>
              {section.sampleTestLabel}
            </p>
          </div>
          <div>
            <Dialog
              open={isSampleTestDialogOpen}
              onOpenChange={setIsSampleTestDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setQuestionIndex(0);
                  }}
                  variant="outline"
                  size="sm"
                >
                  View
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[384px] lg:max-w-[512px]">
                <DialogHeader>
                  <DialogTitle>
                    Sample Questions: {section.sectionTitle}
                  </DialogTitle>
                  <DialogDescription>
                    This is a set of sample questions to help you practice and
                    reinforce your knowledge on {section.sectionTitle}. The
                    questions consist of multiple choice questions.
                  </DialogDescription>
                </DialogHeader>
                <article className={cn("space-y-3")}>
                  <div className={cn("space-y-1")}>
                    <h4 className={cn("text-lg font-medium")}>
                      Question {questionIndex + 1}
                    </h4>
                    {questionIsEditing === questionIndex ? (
                      <Textarea
                        value={question}
                        onChange={(event) => {
                          setQuestion(event.currentTarget.value);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            setIsQuestionEditing(-1);

                            if (questionIndex < sampleTestQuestions.length) {
                              setSampleTestQuestions(
                                sampleTestQuestions.map(
                                  (sampletestQuestion, index) =>
                                    index === questionIndex
                                      ? {
                                          ...sampletestQuestion,
                                          question: sampletestQuestion.question,
                                        }
                                      : sampletestQuestion,
                                ),
                              );
                            } else {
                              setNewSampleTestQuestions(
                                newSampleTestQuestions.map(
                                  (sampletestQuestion, index) =>
                                    index ===
                                    questionIndex - sampleTestQuestions.length
                                      ? {
                                          ...sampletestQuestion,
                                          question: sampletestQuestion.question,
                                        }
                                      : sampletestQuestion,
                                ),
                              );
                            }
                          }
                        }}
                        className={cn("resize-none min-h-14")}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className={cn("text-gray-600 text-sm")}>
                          {(questionIndex >= sampleTestQuestions.length
                            ? newSampleTestQuestions[
                                questionIndex - sampleTestQuestions.length
                              ]
                            : sampleTestQuestions[questionIndex]
                          )?.question || "Empty Question"}
                        </p>
                        <Button
                          onClick={() => {
                            setIsQuestionEditing(questionIndex);
                            setQuestion(
                              (questionIndex >= sampleTestQuestions.length
                                ? newSampleTestQuestions[
                                    questionIndex - sampleTestQuestions.length
                                  ]
                                : sampleTestQuestions[questionIndex]
                              ).question,
                            );
                          }}
                          variant="link"
                          size="icon"
                          className={cn("ml-1 size-6")}
                        >
                          <EditIcon />
                        </Button>
                      </div>
                    )}
                  </div>
                  <RadioGroup>
                    {(questionIndex >= sampleTestQuestions.length
                      ? newSampleTestQuestions[
                          questionIndex - sampleTestQuestions.length
                        ]
                      : sampleTestQuestions[questionIndex]
                    )?.answers.map((option, optionIndex) => {
                      return (
                        <div
                          // biome-ignore lint/suspicious/noArrayIndexKey: <>
                          key={optionIndex}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={option}
                            id={option}
                            checked={
                              (questionIndex >= sampleTestQuestions.length
                                ? newSampleTestQuestions[
                                    questionIndex - sampleTestQuestions.length
                                  ]
                                : sampleTestQuestions[questionIndex]
                              ).correctAnswer === option
                            }
                            onClick={() => {
                              if (questionIndex < sampleTestQuestions.length) {
                                setSampleTestQuestions(
                                  sampleTestQuestions.map((question, index) =>
                                    index === questionIndex
                                      ? {
                                          ...question,
                                          correctAnswer: option,
                                        }
                                      : question,
                                  ),
                                );
                              } else {
                                setNewSampleTestQuestions(
                                  newSampleTestQuestions.map(
                                    (question, index) =>
                                      index ===
                                      questionIndex - sampleTestQuestions.length
                                        ? {
                                            ...question,
                                            correctAnswer: option,
                                          }
                                        : question,
                                  ),
                                );
                              }
                            }}
                          />
                          {answersIsEditing[0] === questionIndex &&
                          answersIsEditing[1] === optionIndex ? (
                            <Textarea
                              value={answers[optionIndex]}
                              onChange={(event) => {
                                const newAnswers = [...answers];
                                newAnswers[optionIndex] =
                                  event.currentTarget.value;
                                setAnswers(newAnswers);
                              }}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  setIsAnswersEditing([-1, -1]);

                                  if (
                                    questionIndex < sampleTestQuestions.length
                                  ) {
                                    setSampleTestQuestions(
                                      sampleTestQuestions.map(
                                        (question, index) =>
                                          index === questionIndex
                                            ? {
                                                ...question,
                                                answers: question.answers.map(
                                                  (answer, answerIndex) =>
                                                    answerIndex === optionIndex
                                                      ? answers[optionIndex]
                                                      : answer,
                                                ),
                                              }
                                            : question,
                                      ),
                                    );
                                  } else {
                                    setNewSampleTestQuestions(
                                      newSampleTestQuestions.map(
                                        (question, index) =>
                                          index ===
                                          questionIndex -
                                            sampleTestQuestions.length
                                            ? {
                                                ...question,
                                                answers: question.answers.map(
                                                  (answer, answerIndex) =>
                                                    answerIndex === optionIndex
                                                      ? answers[optionIndex]
                                                      : answer,
                                                ),
                                              }
                                            : question,
                                      ),
                                    );
                                  }
                                }
                              }}
                              className={cn("resize-none min-h-8")}
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <Label htmlFor={option}>{option}</Label>
                              <Button
                                onClick={() => {
                                  setIsAnswersEditing([
                                    questionIndex,
                                    optionIndex,
                                  ]);
                                  const newAnswers = [...answers];
                                  newAnswers[optionIndex] = option;
                                  setAnswers(newAnswers);
                                }}
                                variant="link"
                                size="icon"
                                className={cn("ml-1 size-6")}
                              >
                                <EditIcon />
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </RadioGroup>
                </article>
                <DialogFooter className={cn("justify-between")}>
                  <div className={cn("flex gap-2")}>
                    <Button
                      onClick={() => {
                        setNewSampleTestQuestions([
                          ...newSampleTestQuestions,
                          {
                            question: `Question ${sampleTestQuestions.length - deletedSampleTestQuestions.length + newSampleTestQuestions.length + 1}`,
                            answers: [
                              "Option 1",
                              "Option 2",
                              "Option 3",
                              "Option 4",
                            ],
                            correctAnswer: "Option 1",
                          },
                        ]);

                        setQuestionIndex(
                          sampleTestQuestions.length -
                            deletedSampleTestQuestions.length +
                            newSampleTestQuestions.length,
                        );
                      }}
                      size="sm"
                      variant="outline"
                      className={cn("px-2 height-8 gap-1")}
                    >
                      <PlusIcon />
                      New Question
                    </Button>
                    <Button
                      onClick={() => {
                        if (questionIndex < sampleTestQuestions.length) {
                          setDeletedSampleTestQuestions([
                            ...deletedSampleTestQuestions,
                            sampleTestQuestions[questionIndex].id,
                          ]);

                          setSampleTestQuestions(
                            sampleTestQuestions.filter(
                              (_, index) => index !== questionIndex,
                            ),
                          );
                        } else {
                          setNewSampleTestQuestions(
                            newSampleTestQuestions.filter(
                              (_, index) =>
                                index !==
                                questionIndex - sampleTestQuestions.length,
                            ),
                          );
                        }

                        if (questionIndex !== 0) {
                          setQuestionIndex(questionIndex - 1);
                        }
                      }}
                      disabled={
                        (sampleTestQuestions.length +
                          newSampleTestQuestions.length <
                          2 && questionIndex) ===
                        sampleTestQuestions.length +
                          newSampleTestQuestions.length -
                          1
                      }
                      variant="outline"
                      size="icon"
                      className={cn(
                        "size-8 flex items-center gap-2 border-destructive hover:bg-destructive text-destructive",
                      )}
                    >
                      <Trash2Icon className={cn("w-4 h-4")} />
                    </Button>
                  </div>
                  <div className={cn("flex gap-2")}>
                    <Button
                      onClick={() => {
                        if (questionIndex > 0) {
                          setQuestionIndex(questionIndex - 1);
                        }

                        setIsQuestionEditing(-1);
                        setIsCorrectAnswerEditing(-1);
                        setIsAnswersEditing([-1, -1]);
                      }}
                      disabled={questionIndex === 0}
                      size="sm"
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => {
                        if (
                          questionIndex <
                          sampleTestQuestions.length +
                            newSampleTestQuestions.length -
                            1
                        ) {
                          setQuestionIndex(questionIndex + 1);
                        }

                        setIsQuestionEditing(-1);
                        setIsCorrectAnswerEditing(-1);
                        setIsAnswersEditing([-1, -1]);

                        if (
                          questionIndex ===
                          sampleTestQuestions.length +
                            newSampleTestQuestions.length -
                            1
                        ) {
                          updateSampleTestQuestionsMutation.mutate({
                            sectionId: section.id,
                            sampleTestQuestions,
                            deletedSampleTestQuestions,
                            newSampleTestQuestions,
                          });
                        }
                      }}
                      size="sm"
                      variant="outline"
                    >
                      {updateSampleTestQuestionsMutation.isPending && (
                        <Loader2Icon className={cn("animate-spin")} />
                      )}
                      <span>
                        {questionIndex ===
                        sampleTestQuestions.length +
                          newSampleTestQuestions.length -
                          1
                          ? "Save"
                          : "Next"}
                      </span>
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className={cn("flex gap-4 justify-between")}>
          <div className={cn("flex flex-col gap-2")}>
            <Label className={cn("font-bold")}>Final Test</Label>
            <p className={cn("text-sm text-gray-600")}>
              {section.finalTestLabel}
            </p>
          </div>
          <div>
            <Dialog
              open={isFinalTestDialogOpen}
              onOpenChange={setIsFinalTestDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setQuestionIndex(0);
                  }}
                  variant="outline"
                  size="sm"
                >
                  View
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[384px] lg:max-w-[512px]">
                <DialogHeader>
                  <DialogTitle>
                    Final Questions: {section.sectionTitle}
                  </DialogTitle>
                  <DialogDescription>
                    This is a set of final questions to help you practice and
                    reinforce your knowledge on {section.sectionTitle}. The
                    questions consist of multiple choice questions.
                  </DialogDescription>
                </DialogHeader>
                <article className={cn("space-y-3")}>
                  <div className={cn("space-y-1")}>
                    <h4 className={cn("text-lg font-medium")}>
                      Question {questionIndex + 1}
                    </h4>
                    {questionIsEditing === questionIndex ? (
                      <Textarea
                        value={question}
                        onChange={(event) => {
                          setQuestion(event.currentTarget.value);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            setIsQuestionEditing(-1);

                            if (questionIndex < finalTestQuestions.length) {
                              setFinalTestQuestions(
                                finalTestQuestions.map(
                                  (finaltestQuestion, index) =>
                                    index === questionIndex
                                      ? {
                                          ...finaltestQuestion,
                                          question: finaltestQuestion.question,
                                        }
                                      : finaltestQuestion,
                                ),
                              );
                            } else {
                              setNewFinalTestQuestions(
                                newFinalTestQuestions.map(
                                  (finaltestQuestion, index) =>
                                    index ===
                                    questionIndex - finalTestQuestions.length
                                      ? {
                                          ...finaltestQuestion,
                                          question: finaltestQuestion.question,
                                        }
                                      : finaltestQuestion,
                                ),
                              );
                            }
                          }
                        }}
                        className={cn("resize-none min-h-14")}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className={cn("text-gray-600 text-sm")}>
                          {(questionIndex >= finalTestQuestions.length
                            ? newFinalTestQuestions[
                                questionIndex - finalTestQuestions.length
                              ]
                            : finalTestQuestions[questionIndex]
                          )?.question || "Empty Question"}
                        </p>
                        <Button
                          onClick={() => {
                            setIsQuestionEditing(questionIndex);
                            setQuestion(
                              (questionIndex >= finalTestQuestions.length
                                ? newFinalTestQuestions[
                                    questionIndex - finalTestQuestions.length
                                  ]
                                : finalTestQuestions[questionIndex]
                              ).question,
                            );
                          }}
                          variant="link"
                          size="icon"
                          className={cn("ml-1 size-6")}
                        >
                          <EditIcon />
                        </Button>
                      </div>
                    )}
                  </div>
                  <RadioGroup>
                    {(questionIndex >= finalTestQuestions.length
                      ? newFinalTestQuestions[
                          questionIndex - finalTestQuestions.length
                        ]
                      : finalTestQuestions[questionIndex]
                    )?.answers.map((option, optionIndex) => {
                      return (
                        <div
                          // biome-ignore lint/suspicious/noArrayIndexKey: <>
                          key={optionIndex}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={option}
                            id={option}
                            checked={
                              (questionIndex >= finalTestQuestions.length
                                ? newFinalTestQuestions[
                                    questionIndex - finalTestQuestions.length
                                  ]
                                : finalTestQuestions[questionIndex]
                              ).correctAnswer === option
                            }
                            onClick={() => {
                              if (questionIndex < finalTestQuestions.length) {
                                setFinalTestQuestions(
                                  finalTestQuestions.map((question, index) =>
                                    index === questionIndex
                                      ? {
                                          ...question,
                                          correctAnswer: option,
                                        }
                                      : question,
                                  ),
                                );
                              } else {
                                setNewFinalTestQuestions(
                                  newFinalTestQuestions.map(
                                    (question, index) =>
                                      index ===
                                      questionIndex - finalTestQuestions.length
                                        ? {
                                            ...question,
                                            correctAnswer: option,
                                          }
                                        : question,
                                  ),
                                );
                              }
                            }}
                          />
                          {answersIsEditing[0] === questionIndex &&
                          answersIsEditing[1] === optionIndex ? (
                            <Textarea
                              value={answers[optionIndex]}
                              onChange={(event) => {
                                const newAnswers = [...answers];
                                newAnswers[optionIndex] =
                                  event.currentTarget.value;
                                setAnswers(newAnswers);
                              }}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  setIsAnswersEditing([-1, -1]);

                                  if (
                                    questionIndex < finalTestQuestions.length
                                  ) {
                                    setFinalTestQuestions(
                                      finalTestQuestions.map(
                                        (question, index) =>
                                          index === questionIndex
                                            ? {
                                                ...question,
                                                answers: question.answers.map(
                                                  (answer, answerIndex) =>
                                                    answerIndex === optionIndex
                                                      ? answers[optionIndex]
                                                      : answer,
                                                ),
                                              }
                                            : question,
                                      ),
                                    );
                                  } else {
                                    setNewFinalTestQuestions(
                                      newFinalTestQuestions.map(
                                        (question, index) =>
                                          index ===
                                          questionIndex -
                                            finalTestQuestions.length
                                            ? {
                                                ...question,
                                                answers: question.answers.map(
                                                  (answer, answerIndex) =>
                                                    answerIndex === optionIndex
                                                      ? answers[optionIndex]
                                                      : answer,
                                                ),
                                              }
                                            : question,
                                      ),
                                    );
                                  }
                                }
                              }}
                              className={cn("resize-none min-h-8")}
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <Label htmlFor={option}>{option}</Label>
                              <Button
                                onClick={() => {
                                  setIsAnswersEditing([
                                    questionIndex,
                                    optionIndex,
                                  ]);
                                  const newAnswers = [...answers];
                                  newAnswers[optionIndex] = option;
                                  setAnswers(newAnswers);
                                }}
                                variant="link"
                                size="icon"
                                className={cn("ml-1 size-6")}
                              >
                                <EditIcon />
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </RadioGroup>
                </article>
                <DialogFooter className={cn("justify-between")}>
                  <div className={cn("flex gap-2")}>
                    <Button
                      onClick={() => {
                        setNewFinalTestQuestions([
                          ...newFinalTestQuestions,
                          {
                            question: `Question ${finalTestQuestions.length - deletedFinalTestQuestions.length + newFinalTestQuestions.length + 1}`,
                            answers: [
                              "Option 1",
                              "Option 2",
                              "Option 3",
                              "Option 4",
                            ],
                            correctAnswer: "Option 1",
                          },
                        ]);

                        setQuestionIndex(
                          finalTestQuestions.length -
                            deletedFinalTestQuestions.length +
                            newFinalTestQuestions.length,
                        );
                      }}
                      size="sm"
                      variant="outline"
                      className={cn("px-2 height-8 gap-1")}
                    >
                      <PlusIcon />
                      New Question
                    </Button>
                    <Button
                      onClick={() => {
                        if (questionIndex < finalTestQuestions.length) {
                          setDeletedFinalTestQuestions([
                            ...deletedFinalTestQuestions,
                            finalTestQuestions[questionIndex].id,
                          ]);

                          setFinalTestQuestions(
                            finalTestQuestions.filter(
                              (_, index) => index !== questionIndex,
                            ),
                          );
                        } else {
                          setNewFinalTestQuestions(
                            newFinalTestQuestions.filter(
                              (_, index) =>
                                index !==
                                questionIndex - finalTestQuestions.length,
                            ),
                          );
                        }

                        if (questionIndex !== 0) {
                          setQuestionIndex(questionIndex - 1);
                        }
                      }}
                      disabled={
                        (finalTestQuestions.length +
                          newFinalTestQuestions.length <
                          2 && questionIndex) ===
                        finalTestQuestions.length +
                          newFinalTestQuestions.length -
                          1
                      }
                      variant="outline"
                      size="icon"
                      className={cn(
                        "size-8 flex items-center gap-2 border-destructive hover:bg-destructive text-destructive",
                      )}
                    >
                      <Trash2Icon className={cn("w-4 h-4")} />
                    </Button>
                  </div>
                  <div className={cn("flex gap-2")}>
                    <Button
                      onClick={() => {
                        if (questionIndex > 0) {
                          setQuestionIndex(questionIndex - 1);
                        }

                        setIsQuestionEditing(-1);
                        setIsCorrectAnswerEditing(-1);
                        setIsAnswersEditing([-1, -1]);
                      }}
                      disabled={questionIndex === 0}
                      size="sm"
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => {
                        if (
                          questionIndex <
                          finalTestQuestions.length +
                            newFinalTestQuestions.length -
                            1
                        ) {
                          setQuestionIndex(questionIndex + 1);
                        }

                        setIsQuestionEditing(-1);
                        setIsCorrectAnswerEditing(-1);
                        setIsAnswersEditing([-1, -1]);

                        if (
                          questionIndex ===
                          finalTestQuestions.length +
                            newFinalTestQuestions.length -
                            1
                        ) {
                          updateFinalTestQuestionsMutation.mutate({
                            sectionId: section.id,
                            finalTestQuestions,
                            deletedFinalTestQuestions,
                            newFinalTestQuestions,
                          });
                        }
                      }}
                      size="sm"
                      variant="outline"
                    >
                      {updateFinalTestQuestionsMutation.isPending && (
                        <Loader2Icon className={cn("animate-spin")} />
                      )}
                      <span>
                        {questionIndex ===
                        finalTestQuestions.length +
                          newFinalTestQuestions.length -
                          1
                          ? "Save"
                          : "Next"}
                      </span>
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </article>
    </section>
  );
}
