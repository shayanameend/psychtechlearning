import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, default as axios } from "axios";
import { toast } from "sonner";

import { EditIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
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

  const [questionIndex, setQuestionIndex] = useState(0);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(section.flashcards);
  const [deletedFlashcards, setDeletedFlashcards] = useState<string[]>([]);
  const [newFlashcards, setNewFlashcards] = useState<
    Omit<Omit<Omit<Flashcard, "updatedAt">, "createdAt">, "id">[]
  >([]);
  const [questionIsEditing, setIsQuestionEditing] = useState(-1);
  const [question, setQuestion] = useState("");
  const [correctAnswerIsEditing, setIsCorrectAnswerEditing] = useState(-1);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [answersIsEditing, setIsAnswersEditing] = useState([-1, -1]);
  const [answers, setAnswers] = useState<string[]>(Array(4).fill(""));

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
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }
    },
    onSettled: () => {
      setQuestionIndex(0);
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
            <Dialog>
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

                        setQuestionIndex(questionIndex - 1);
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
                      {questionIndex ===
                      flashcards.length + newFlashcards.length - 1
                        ? "Save"
                        : "Next"}
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
            <Button variant="outline" size="sm">
              View
            </Button>
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
            <Button variant="outline" size="sm">
              View
            </Button>
          </div>
        </div>
      </article>
    </section>
  );
}
