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
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { useUserContext } from "~/providers/user-provider";
import { paths } from "~/routes/paths";
import type {
  BlockType,
  NewTestQuestionType,
  TestQuestionType,
} from "~/types/block";

interface TestQuestionsDialogProps {
  block: BlockType;
  type: "sample" | "final";
  title: string;
  description: string;
}

export function TestQuestionsDialog({
  block,
  type,
  title,
  description,
}: TestQuestionsDialogProps) {
  const queryClient = useQueryClient();
  const { token } = useUserContext();

  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<TestQuestionType[]>(
    type === "sample" ? block.sampleTestQuestions : block.finalTestQuestions,
  );
  const [deletedQuestions, setDeletedQuestions] = useState<string[]>([]);
  const [newQuestions, setNewQuestions] = useState<NewTestQuestionType[]>([]);

  const [questionIsEditing, setIsQuestionEditing] = useState(-1);
  const [question, setQuestion] = useState("");
  const [answersIsEditing, setIsAnswersEditing] = useState([-1, -1]);
  const [answers, setAnswers] = useState<string[]>(Array(4).fill(""));

  useEffect(() => {
    setQuestions(
      type === "sample" ? block.sampleTestQuestions : block.finalTestQuestions,
    );
    setDeletedQuestions([]);
    setNewQuestions([]);
    setQuestionIndex(0);
    setQuestion("");
    setAnswers(Array(4).fill(""));
    setIsQuestionEditing(-1);
    setIsAnswersEditing([-1, -1]);
  }, [block, type]);

  const updateTestQuestionsMutation = useMutation({
    mutationFn: async ({
      blockId,
      questions,
      deletedQuestions,
      newQuestions,
    }: {
      blockId: string;
      questions: TestQuestionType[];
      deletedQuestions: string[];
      newQuestions: NewTestQuestionType[];
    }) => {
      const endpoint =
        type === "sample"
          ? paths.api.blocks.id.sampleTestQuestions.bulk({ id: blockId })
          : paths.api.blocks.id.finalTestQuestions.bulk({ id: blockId });

      const payload =
        type === "sample"
          ? {
              sampleTestQuestions: questions,
              deletedSampleTestQuestions: deletedQuestions,
              newSampleTestQuestions: newQuestions,
            }
          : {
              finalTestQuestions: questions,
              deletedFinalTestQuestions: deletedQuestions,
              newFinalTestQuestions: newQuestions,
            };

      const response = await axios.put(endpoint, payload, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
    onSuccess: ({ info }) => {
      toast.success(info.message);
      queryClient.invalidateQueries({ queryKey: ["blocks"] });
      setDeletedQuestions([]);
      setNewQuestions([]);
      setIsTestDialogOpen(false);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }
    },
    onSettled: () => {
      setQuestionIndex(0);
      setQuestion("");
      setAnswers(Array(4).fill(""));
      setIsQuestionEditing(-1);
      setIsAnswersEditing([-1, -1]);
    },
  });

  return (
    <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsTestDialogOpen(true)}
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
          <DialogTitle>
            {title}: {block.blockTitle}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
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

                    if (questionIndex < questions.length) {
                      setQuestions(
                        questions.map((testQuestion, index) =>
                          index === questionIndex
                            ? {
                                ...testQuestion,
                                question,
                              }
                            : testQuestion,
                        ),
                      );
                    } else {
                      setNewQuestions(
                        newQuestions.map((testQuestion, index) =>
                          index === questionIndex - questions.length
                            ? {
                                ...testQuestion,
                                question,
                              }
                            : testQuestion,
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
                  {(questionIndex >= questions.length
                    ? newQuestions[questionIndex - questions.length]
                    : questions[questionIndex]
                  )?.question || "Empty Question"}
                </p>
                <Button
                  onClick={() => {
                    setIsQuestionEditing(questionIndex);
                    setQuestion(
                      (questionIndex >= questions.length
                        ? newQuestions[questionIndex - questions.length]
                        : questions[questionIndex]
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
            {(questionIndex >= questions.length
              ? newQuestions[questionIndex - questions.length]
              : questions[questionIndex]
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
                      (questionIndex >= questions.length
                        ? newQuestions[questionIndex - questions.length]
                        : questions[questionIndex]
                      ).correctAnswer === option
                    }
                    onClick={() => {
                      if (questionIndex < questions.length) {
                        setQuestions(
                          questions.map((question, index) =>
                            index === questionIndex
                              ? {
                                  ...question,
                                  correctAnswer: option,
                                }
                              : question,
                          ),
                        );
                      } else {
                        setNewQuestions(
                          newQuestions.map((question, index) =>
                            index === questionIndex - questions.length
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
                        newAnswers[optionIndex] = event.currentTarget.value;
                        setAnswers(newAnswers);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          setIsAnswersEditing([-1, -1]);

                          if (questionIndex < questions.length) {
                            setQuestions(
                              questions.map((question, index) =>
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
                            setNewQuestions(
                              newQuestions.map((question, index) =>
                                index === questionIndex - questions.length
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
                          setIsAnswersEditing([questionIndex, optionIndex]);
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
        <DialogFooter className={cn("justify-between flex-row-reverse")}>
          <div className={cn("flex gap-2 flex-row-reverse")}>
            <Button
              onClick={() => {
                updateTestQuestionsMutation.mutate({
                  blockId: block.id,
                  questions,
                  deletedQuestions,
                  newQuestions,
                });
              }}
              size="sm"
              variant="outline"
              disabled={updateTestQuestionsMutation.isPending}
            >
              {updateTestQuestionsMutation.isPending ? (
                <Loader2Icon className={cn("animate-spin mr-1 h-4 w-4")} />
              ) : null}
              Save
            </Button>
            <Button
              onClick={() => {
                setNewQuestions([
                  ...newQuestions,
                  {
                    question: `Question ${
                      questions.length -
                      deletedQuestions.length +
                      newQuestions.length +
                      1
                    }`,
                    answers: ["Option 1", "Option 2", "Option 3", "Option 4"],
                    correctAnswer: "Option 1",
                  },
                ]);

                setQuestionIndex(
                  questions.length -
                    deletedQuestions.length +
                    newQuestions.length,
                );
              }}
              disabled={updateTestQuestionsMutation.isPending}
              size="sm"
              variant="outline"
              className={cn("px-2 height-8 gap-1 [&_svg]:size-5")}
            >
              <PlusIcon />
            </Button>
            <Button
              onClick={() => {
                if (questionIndex < questions.length) {
                  setDeletedQuestions([
                    ...deletedQuestions,
                    questions[questionIndex].id,
                  ]);

                  setQuestions(
                    questions.filter((_, index) => index !== questionIndex),
                  );
                } else {
                  setNewQuestions(
                    newQuestions.filter(
                      (_, index) => index !== questionIndex - questions.length,
                    ),
                  );
                }

                if (questionIndex !== 0) {
                  setQuestionIndex(questionIndex - 1);
                }
              }}
              disabled={
                updateTestQuestionsMutation.isPending ||
                (questions.length + newQuestions.length < 2 &&
                  questionIndex) ===
                  questions.length + newQuestions.length - 1
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
                setIsAnswersEditing([-1, -1]);
              }}
              disabled={
                updateTestQuestionsMutation.isPending || questionIndex === 0
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
                  questions.length + newQuestions.length - 1
                ) {
                  setQuestionIndex(questionIndex + 1);
                }

                setIsQuestionEditing(-1);
                setIsAnswersEditing([-1, -1]);
              }}
              disabled={
                updateTestQuestionsMutation.isPending ||
                questionIndex === questions.length + newQuestions.length - 1
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
