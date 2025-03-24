import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
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
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { useUserContext } from "~/providers/user-provider";
import { paths } from "~/routes/paths";
import type { BlockType, FlashcardType, NewFlashcardType } from "~/types/block";

interface FlashcardsDialogProps {
  block: BlockType;
}

export function FlashcardsDialog({ block }: FlashcardsDialogProps) {
  const queryClient = useQueryClient();
  const { token } = useUserContext();

  const [isFlashcardsDialogOpen, setIsFlashcardsDialogOpen] = useState(false);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [flashcards, setFlashcards] = useState<FlashcardType[]>(
    block.flashcards,
  );
  const [deletedFlashcards, setDeletedFlashcards] = useState<string[]>([]);
  const [newFlashcards, setNewFlashcards] = useState<NewFlashcardType[]>([]);

  const [questionIsEditing, setIsQuestionEditing] = useState(-1);
  const [question, setQuestion] = useState("");
  const [correctAnswerIsEditing, setIsCorrectAnswerEditing] = useState(-1);
  const [correctAnswer, setCorrectAnswer] = useState("");

  useEffect(() => {
    setFlashcards(block.flashcards);
    setDeletedFlashcards([]);
    setNewFlashcards([]);
    setQuestionIndex(0);
    setQuestion("");
    setCorrectAnswer("");
    setIsQuestionEditing(-1);
    setIsCorrectAnswerEditing(-1);
  }, [block]);

  const updateFlashcardsMutation = useMutation({
    mutationFn: async ({
      blockId,
      flashcards,
      deletedFlashcards,
      newFlashcards,
    }: {
      blockId: string;
      flashcards: FlashcardType[];
      deletedFlashcards: string[];
      newFlashcards: NewFlashcardType[];
    }) => {
      const response = await axios.put(
        paths.api.blocks.id.flashcards.bulk({ id: blockId }),
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
      queryClient.invalidateQueries({ queryKey: ["blocks"] });
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
      setIsQuestionEditing(-1);
      setIsCorrectAnswerEditing(-1);
    },
  });

  return (
    <Dialog
      open={isFlashcardsDialogOpen}
      onOpenChange={setIsFlashcardsDialogOpen}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsFlashcardsDialogOpen(true)}
          variant="outline"
          size="sm"
        >
          <span>
            <EditIcon />
          </span>
          <span>Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[384px] lg:max-w-[512px]">
        <DialogHeader>
          <DialogTitle>Flashcards: {block.blockTitle}</DialogTitle>
          <DialogDescription>
            This is a set of flashcards to help you reinforce your learning on{" "}
            {block.blockTitle}.
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
                          ? newFlashcards[questionIndex - flashcards.length]
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
                          ? newFlashcards[questionIndex - flashcards.length]
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
        <DialogFooter className={cn("justify-between flex-row-reverse")}>
          <div className={cn("flex flex-row-reverse gap-2")}>
            <Button
              onClick={() => {
                updateFlashcardsMutation.mutate({
                  blockId: block.id,
                  flashcards,
                  deletedFlashcards,
                  newFlashcards,
                });
              }}
              size="sm"
              variant="outline"
              disabled={updateFlashcardsMutation.isPending}
            >
              {updateFlashcardsMutation.isPending ? (
                <Loader2Icon className={cn("animate-spin mr-1 h-4 w-4")} />
              ) : null}
              Save
            </Button>
            <Button
              onClick={() => {
                setNewFlashcards([
                  ...newFlashcards,
                  {
                    question: `Question ${
                      flashcards.length -
                      deletedFlashcards.length +
                      newFlashcards.length +
                      1
                    }`,
                    answer: `Answer ${
                      flashcards.length -
                      deletedFlashcards.length +
                      newFlashcards.length +
                      1
                    }`,
                  },
                ]);

                setQuestionIndex(
                  flashcards.length -
                    deletedFlashcards.length +
                    newFlashcards.length,
                );
              }}
              disabled={updateFlashcardsMutation.isPending}
              size="sm"
              variant="outline"
              className={cn("px-2 height-8 gap-1 [&_svg]:size-5")}
            >
              <PlusIcon />
            </Button>
            <Button
              onClick={() => {
                if (questionIndex < flashcards.length) {
                  setDeletedFlashcards([
                    ...deletedFlashcards,
                    flashcards[questionIndex].id,
                  ]);

                  setFlashcards(
                    flashcards.filter((_, index) => index !== questionIndex),
                  );
                } else {
                  setNewFlashcards(
                    newFlashcards.filter(
                      (_, index) => index !== questionIndex - flashcards.length,
                    ),
                  );
                }

                if (questionIndex !== 0) {
                  setQuestionIndex(questionIndex - 1);
                }
              }}
              disabled={
                updateFlashcardsMutation.isPending ||
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
              <Trash2Icon />
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
              disabled={
                updateFlashcardsMutation.isPending || questionIndex === 0
              }
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
              }}
              disabled={
                updateFlashcardsMutation.isPending ||
                questionIndex === flashcards.length + newFlashcards.length - 1
              }
              size="sm"
              variant="outline"
            >
              <span>Next</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
