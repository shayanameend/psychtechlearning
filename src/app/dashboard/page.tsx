"use client";

import { useQuery } from "@tanstack/react-query";
import { default as axios } from "axios";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

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
import { Steps } from "~/components/ui/steps";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { useUserContext } from "~/providers/user-provider";
import { paths } from "~/routes/paths";

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

export default function DashboardPage() {
  const { token } = useUserContext();

  const { data: sectionsQueryResult, isSuccess: sectionsQueryIsSuccess } =
    useQuery({
      queryKey: ["sections"],
      queryFn: async () => {
        const response = await axios.get(paths.api.sections.root(), {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        return response.data as { data: { sections: Section[] } };
      },
    });

  const [currentStep, setCurrentStep] = useState(1);
  const [content, setContent] = useState<Section | undefined>(
    sectionsQueryResult?.data.sections[currentStep - 1],
  );
  const [flashcards, setFlashcards] = useState<Flashcard[]>(
    sectionsQueryResult?.data.sections[currentStep - 1]?.flashcards || [],
  );
  const [showFlashcard, setShowFlashcard] = useState(false);
  const [sampleTestQuestions, setSampleTestQuestions] = useState<
    TestQuestion[]
  >([]);
  const [sampleTestAnswers, setSampleTestAnswers] = useState<
    Array<string | null>
  >([]);
  const [finalTestQuestions, setFinalTestQuestions] = useState<TestQuestion[]>(
    [],
  );
  const [finalTestAnswers, setFinalTestAnswers] = useState<
    Array<string | null>
  >([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [isEditing, setIsEditing] = useState(-1);
  const [noteValue, setNoteValue] = useState("");

  useEffect(() => {
    setContent(sectionsQueryResult?.data.sections[currentStep - 1]);
  }, [currentStep, sectionsQueryResult?.data.sections[currentStep - 1]]);

  useEffect(() => {
    setFlashcards(content?.flashcards || []);
  }, [content]);

  useEffect(() => {
    setSampleTestQuestions(content?.sampleTestQuestions || []);
  }, [content]);

  useEffect(() => {
    setSampleTestAnswers(
      Array.from({ length: sampleTestQuestions.length }, () => null),
    );
  }, [sampleTestQuestions]);

  useEffect(() => {
    setFinalTestAnswers(
      Array.from({ length: finalTestQuestions.length }, () => null),
    );
  }, [finalTestQuestions]);

  useEffect(() => {
    setFinalTestQuestions(content?.finalTestQuestions || []);
  }, [content]);

  useEffect(() => {
    setNoteValue(content?.sectionUserNotes[isEditing]?.content || "");
  }, [content, isEditing]);

  const steps = Array.from(
    { length: sectionsQueryResult?.data.sections.length || 0 },
    (_, index) => index + 1,
  );

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  if (!sectionsQueryIsSuccess) {
    return null;
  }

  return (
    <>
      <section
        className={cn(
          "py-2 px-6 lg:px-10 lg:pb-6 min-h-[calc(100svh_-_4.5rem)] lg:min-h-[calc(100svh_-_6.5rem)] flex flex-col lg:flex-row",
        )}
      >
        <aside>
          {sectionsQueryResult.data.sections.length > 1 && (
            <Steps steps={steps} currentStep={currentStep} />
          )}
        </aside>
        <main
          className={cn("flex-1 py-4 lg:py-0 lg:px-8 flex flex-col gap-12")}
        >
          <section className={cn("flex-1 flex")}>
            <div
              className={cn(
                "w-full lg:w-2/3 space-y-4 lg:space-y-8",
                showNotes && "hidden",
              )}
            >
              <article className={cn("space-y-2")}>
                <h3 className={cn("text-primary text-xl font-bold")}>
                  {content?.sectionTitle}
                </h3>
                <p className={cn("text-gray-600 text-sm")}>
                  {content?.sectionDescription}
                </p>
              </article>
              <article className={cn("space-y-2")}>
                <h3 className={cn("text-foreground/70 text-lg font-medium")}>
                  Study Guide
                </h3>
                <p className={cn("text-gray-600 text-sm")}>
                  {content?.guideLabel}
                </p>
                <Button
                  onClick={() => {
                    window.open(content?.guideLink, "_blank");
                  }}
                  size="sm"
                >
                  Download
                </Button>
              </article>
              <article className={cn("space-y-2")}>
                <h3 className={cn("text-foreground/70 text-lg font-medium")}>
                  Flashcards
                </h3>
                <p className={cn("text-gray-600 text-sm")}>
                  {content?.flashcardsLabel}
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setQuestionIndex(0);
                      }}
                      size="sm"
                    >
                      View Flashcards
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[320px] lg:max-w-[512px]">
                    <DialogHeader>
                      <DialogTitle>
                        Flashcards: {content?.sectionTitle}
                      </DialogTitle>
                      <DialogDescription>
                        This is a set of flashcards to help you reinforce your
                        learning on {content?.sectionTitle}.
                      </DialogDescription>
                    </DialogHeader>
                    <article className={cn("space-y-2")}>
                      <p className={cn("text-gray-600 text-sm")}>
                        <span className={cn("mr-1")}>{questionIndex + 1}.</span>
                        {flashcards[questionIndex]?.question}
                        {showFlashcard && (
                          <span className={cn("ml-1 text-primary")}>
                            {flashcards[questionIndex]?.answer}
                          </span>
                        )}
                      </p>
                    </article>
                    <DialogFooter>
                      <Button
                        onClick={() => {
                          setShowFlashcard(!showFlashcard);
                        }}
                        size="sm"
                        variant="outline"
                        className={cn("mr-auto")}
                      >
                        {showFlashcard ? "Hide" : "Show"}
                      </Button>
                      <Button
                        onClick={() => {
                          if (questionIndex > 0) {
                            setQuestionIndex(questionIndex - 1);
                            setShowFlashcard(false);
                          }
                        }}
                        disabled={questionIndex === 0}
                        size="sm"
                        variant="outline"
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={() => {
                          if (questionIndex < sampleTestQuestions.length - 1) {
                            setQuestionIndex(questionIndex + 1);
                            setShowFlashcard(false);
                          }
                        }}
                        size="sm"
                        variant="outline"
                      >
                        {questionIndex === sampleTestQuestions.length - 1
                          ? "Submit"
                          : "Next"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </article>
              <article className={cn("space-y-2")}>
                <h3 className={cn("text-foreground/70 text-lg font-medium")}>
                  Sample Questions
                </h3>
                <p className={cn("text-gray-600 text-sm")}>
                  {content?.sampleTestLabel}
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setQuestionIndex(0);
                      }}
                      size="sm"
                    >
                      View Questions
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[320px] lg:max-w-[512px]">
                    <DialogHeader>
                      <DialogTitle>
                        Sample Questions: {content?.sectionTitle}
                      </DialogTitle>
                      <DialogDescription>
                        This is a set of sample questions to help you practice
                        and reinforce your knowledge on {content?.sectionTitle}.
                        The questions consist of multiple choice questions.
                      </DialogDescription>
                    </DialogHeader>
                    <article className={cn("space-y-3")}>
                      <div className={cn("space-y-1")}>
                        <h4 className={cn("text-lg font-medium")}>
                          Question {questionIndex + 1}
                        </h4>
                        <p className={cn("text-gray-600 text-sm")}>
                          {sampleTestQuestions[questionIndex]?.question}
                        </p>
                      </div>
                      <RadioGroup
                        onValueChange={(value) => {
                          setSampleTestAnswers((prev) => {
                            const answers = [...prev];

                            answers[questionIndex] = value;

                            return answers;
                          });
                        }}
                      >
                        {sampleTestQuestions[questionIndex]?.answers.map(
                          (option, index) => {
                            return (
                              <div
                                // biome-ignore lint/suspicious/noArrayIndexKey: <>
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem
                                  checked={
                                    sampleTestAnswers[questionIndex] === option
                                  }
                                  value={option}
                                  id={option}
                                />
                                <Label htmlFor={option}>{option}</Label>
                              </div>
                            );
                          },
                        )}
                      </RadioGroup>
                    </article>
                    <DialogFooter>
                      <Button
                        onClick={() => {
                          if (questionIndex > 0) {
                            setQuestionIndex(questionIndex - 1);
                          }
                        }}
                        disabled={questionIndex === 0}
                        size="sm"
                        variant="outline"
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={() => {
                          if (questionIndex < sampleTestQuestions.length - 1) {
                            setQuestionIndex(questionIndex + 1);
                          }
                        }}
                        size="sm"
                        variant="outline"
                      >
                        {questionIndex === sampleTestQuestions.length - 1
                          ? "Submit"
                          : "Next"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </article>
              <article className={cn("space-y-2")}>
                <h3 className={cn("text-foreground/70 text-lg font-medium")}>
                  Test
                </h3>
                <p className={cn("text-gray-600 text-sm")}>
                  {content?.finalTestLabel}
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setQuestionIndex(0);
                      }}
                      size="sm"
                    >
                      Take Test
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[320px] lg:max-w-[512px]">
                    <DialogHeader>
                      <DialogTitle>Test: {content?.sectionTitle}</DialogTitle>
                      <DialogDescription>
                        This is a test to assess your knowledge on{" "}
                        {content?.sectionTitle}. The test consists of multiple
                        choice questions and is timed. Good luck!
                      </DialogDescription>
                    </DialogHeader>
                    <article className={cn("space-y-3")}>
                      <div className={cn("space-y-1")}>
                        <h4 className={cn("text-lg font-medium")}>
                          Question {questionIndex + 1}
                        </h4>
                        <p className={cn("text-gray-600 text-sm")}>
                          {finalTestQuestions[questionIndex]?.question}
                        </p>
                      </div>
                      <RadioGroup
                        onValueChange={(value) => {
                          setFinalTestAnswers((prev) => {
                            const answers = [...prev];

                            answers[questionIndex] = value;

                            return answers;
                          });
                        }}
                      >
                        {finalTestQuestions[questionIndex]?.answers.map(
                          (option, index) => {
                            return (
                              <div
                                // biome-ignore lint/suspicious/noArrayIndexKey: <>
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem
                                  checked={
                                    finalTestAnswers[questionIndex] === option
                                  }
                                  value={option}
                                  id={option}
                                />
                                <Label htmlFor={option}>{option}</Label>
                              </div>
                            );
                          },
                        )}
                      </RadioGroup>
                    </article>
                    <DialogFooter>
                      <Button
                        onClick={() => {
                          if (questionIndex > 0) {
                            setQuestionIndex(questionIndex - 1);
                          }
                        }}
                        disabled={questionIndex === 0}
                        size="sm"
                        variant="outline"
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={() => {
                          if (questionIndex < finalTestQuestions.length - 1) {
                            setQuestionIndex(questionIndex + 1);
                          }
                        }}
                        size="sm"
                        variant="outline"
                      >
                        {questionIndex === finalTestQuestions.length - 1
                          ? "Submit"
                          : "Next"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </article>
            </div>
            <div
              className={cn(
                "space-y-3 lg:space-y-6",
                !showNotes && "w-1/3 hidden lg:block",
              )}
            >
              <article>
                <div className={cn("flex justify-between items-center")}>
                  <h3 className={cn("text-primary text-lg font-medium")}>
                    Your Notes
                  </h3>
                  <Button
                    onClick={() => {
                      if (
                        content?.sectionUserNotes[
                          content?.sectionUserNotes.length - 1
                        ]?.content?.trim() !== ""
                      ) {
                        setContent((prev) => {
                          if (!prev) return prev;

                          return {
                            ...prev,
                            sectionUserNotes: [
                              ...prev.sectionUserNotes,
                              {
                                id: String(
                                  Number(
                                    prev.sectionUserNotes[
                                      prev.sectionUserNotes.length - 1
                                    ]?.id,
                                  ) + 1,
                                ),
                                content: "",
                                createdAt: new Date(),
                                updatedAt: new Date(),
                              },
                            ],
                          };
                        });

                        setIsEditing(content?.sectionUserNotes?.length || 0);
                      }
                    }}
                    variant="outline"
                    size="icon"
                    className={cn("size-5 rounded-sm")}
                  >
                    <PlusIcon />
                  </Button>
                </div>
                <p className={cn("text-gray-600 text-sm")}>
                  Here you can find the notes you've taken while studying this
                  section. These notes are personal to you and can help
                  reinforce your learning. Feel free to add, edit, or delete any
                  notes as you progress through the material.
                </p>
              </article>
              <article>
                {content?.sectionUserNotes?.length === 0 ? (
                  <p className={cn("text-gray-600 text-sm")}>
                    No notes added by users.
                  </p>
                ) : (
                  <ul className={cn("space-y-2 pl-3")}>
                    {content?.sectionUserNotes?.map((note, index) => (
                      <li
                        key={note.id}
                        className={cn("text-gray-600 text-sm list-disc")}
                      >
                        {isEditing === index ? (
                          <Textarea
                            value={noteValue}
                            onChange={(event) => {
                              setNoteValue(event.currentTarget.value);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                setIsEditing(-1);
                                if (event.currentTarget.value.trim() === "") {
                                  setContent((prev) => {
                                    if (!prev) return prev;

                                    return {
                                      ...prev,
                                      sectionUserNotes:
                                        prev.sectionUserNotes.filter(
                                          (n) => n.id !== note.id,
                                        ),
                                    };
                                  });
                                } else {
                                  setContent((prev) => {
                                    if (!prev) return prev;

                                    return {
                                      ...prev,
                                      sectionUserNotes:
                                        prev.sectionUserNotes.map((n) =>
                                          n.id === note.id
                                            ? {
                                                ...n,
                                                content: noteValue,
                                              }
                                            : n,
                                        ),
                                    };
                                  });
                                }
                              }
                            }}
                            className={cn("resize-none")}
                          />
                        ) : (
                          <>
                            <span>{note.content}</span>
                            <Button
                              onClick={() => {
                                setIsEditing(index);
                              }}
                              variant="link"
                              size="icon"
                              className={cn("ml-1 size-6")}
                            >
                              <EditIcon />
                            </Button>
                            <Button
                              onClick={() => {
                                setContent((prev) => {
                                  if (!prev) return prev;

                                  return {
                                    ...prev,
                                    sectionUserNotes:
                                      prev.sectionUserNotes.filter(
                                        (n) => n.id !== note.id,
                                      ),
                                  };
                                });
                              }}
                              variant="link"
                              size="icon"
                              className={cn("ml-1 size-6")}
                            >
                              <Trash2Icon className={cn("text-red-500")} />
                            </Button>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </div>
          </section>
          <footer className={cn("flex justify-between items-center")}>
            <div>
              <Button
                onClick={() => {
                  setShowNotes(!showNotes);
                }}
                size={showNotes ? "icon" : "default"}
                variant="outline"
                className={cn("lg:hidden", showNotes && "rounded-full")}
              >
                {!showNotes ? "Show Notes" : <XIcon />}
              </Button>
            </div>
            <div className={cn("flex gap-4")}>
              <Button
                onClick={handlePrev}
                disabled={currentStep === 1}
                size="icon"
                className={cn("rounded-full")}
              >
                <ChevronLeftIcon />
              </Button>
              <Button
                onClick={handleNext}
                disabled={steps.length === 0 || currentStep === steps.length}
                size="icon"
                className={cn("rounded-full")}
              >
                {currentStep === steps.length ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </Button>
            </div>
          </footer>
        </main>
      </section>
    </>
  );
}
