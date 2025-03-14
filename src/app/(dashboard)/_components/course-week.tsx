"use client";

import { useEffect, useState } from "react";

import { CourseWeekNotes } from "~/app/(dashboard)/_components/course-week-notes";
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
import { cn } from "~/lib/utils";

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

interface WeekUserNote {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Week {
  id: string;
  weekOrder: number;
  weekTitle: string;
  weekDescription: string;
  guideLabel: string;
  guideLink: string;
  flashcardsLabel: string;
  sampleTestLabel: string;
  finalTestLabel: string;
  flashcards: Flashcard[];
  sampleTestQuestions: TestQuestion[];
  finalTestQuestions: TestQuestion[];
  weekUserNotes: WeekUserNote[];
  createdAt: Date;
  updatedAt: Date;
}

export function CourseWeek({
  week,
  showNotes,
}: Readonly<{ week: Week; showNotes: boolean }>) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(week.flashcards);
  const [showFlashcard, setShowFlashcard] = useState(false);
  const [sampleTestQuestions, setSampleTestQuestions] = useState<
    TestQuestion[]
  >(week.sampleTestQuestions);
  const [finalTestQuestions, setFinalTestQuestions] = useState<TestQuestion[]>(
    week.finalTestQuestions,
  );
  const [sampleTestAnswers, setSampleTestAnswers] = useState<
    Array<string | null>
  >([]);
  const [finalTestAnswers, setFinalTestAnswers] = useState<
    Array<string | null>
  >([]);
  const [showResults, setShowResults] = useState(false);
  const [testScore, setTestScore] = useState<{
    correct: number;
    total: number;
    percentage: number;
  } | null>(null);

  const [questionIndex, setQuestionIndex] = useState(0);

  useEffect(() => {
    setFlashcards(week.flashcards);
    setSampleTestQuestions(week.sampleTestQuestions);
    setFinalTestQuestions(week.finalTestQuestions);
  }, [week]);

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

  const calculateTestScore = (
    answers: (string | null)[],
    questions: TestQuestion[],
  ) => {
    const correct = answers.reduce((acc, answer, index) => {
      return answer === questions[index]?.correctAnswer ? acc + 1 : acc;
    }, 0);

    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
    };
  };

  const currentFlashcard = flashcards[questionIndex];
  const currentSampleQuestion = sampleTestQuestions[questionIndex];
  const currentFinalQuestion = finalTestQuestions[questionIndex];

  return (
    <section className={cn("flex-1 flex")}>
      <div
        className={cn(
          "w-full lg:w-2/3 space-y-4 lg:space-y-8",
          showNotes && "hidden",
        )}
      >
        <article className={cn("space-y-2")}>
          <h3 className={cn("text-primary text-xl font-bold")}>
            {week.weekTitle}
          </h3>
          <p className={cn("text-gray-600 text-sm")}>{week.weekDescription}</p>
        </article>
        <article className={cn("space-y-2")}>
          <h3 className={cn("text-foreground/70 text-lg font-medium")}>
            Study Guide
          </h3>
          <p className={cn("text-gray-600 text-sm")}>{week.guideLabel}</p>
          <Button
            onClick={() => {
              window.open(week.guideLink, "_blank");
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
          <p className={cn("text-gray-600 text-sm")}>{week.flashcardsLabel}</p>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setQuestionIndex(0);
                  setShowFlashcard(false);
                }}
                size="sm"
              >
                View Flashcards
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[320px] lg:max-w-[512px]">
              <DialogHeader>
                <DialogTitle>Flashcards: {week.weekTitle}</DialogTitle>
                <DialogDescription>
                  This is a set of flashcards to help you reinforce your
                  learning on {week.weekTitle}.
                </DialogDescription>
              </DialogHeader>
              {currentFlashcard ? (
                <article className={cn("relative")}>
                  <div
                    className={cn(
                      "relative w-full min-h-[150px] perspective-[1000px] transition-transform duration-500",
                    )}
                  >
                    <div
                      className={cn(
                        "absolute w-full h-full transform-style-3d transition-all duration-500",
                        showFlashcard ? "rotate-y-180" : "",
                      )}
                    >
                      {/* Front of card (question) */}
                      <div
                        className={cn(
                          "absolute w-full h-full backface-hidden bg-white p-4 rounded-md border border-gray-200",
                          showFlashcard ? "invisible" : "",
                        )}
                      >
                        <p className={cn("text-gray-600")}>
                          <span className={cn("mr-1 font-medium")}>
                            Question {questionIndex + 1}:
                          </span>
                          {currentFlashcard.question}
                        </p>
                      </div>

                      {/* Back of card (answer) */}
                      <div
                        className={cn(
                          "absolute w-full h-full backface-hidden bg-white p-4 rounded-md border border-gray-200 rotate-y-180",
                          !showFlashcard ? "invisible" : "",
                        )}
                      >
                        <p className={cn("text-primary")}>
                          <span
                            className={cn("mr-1 font-medium text-gray-600")}
                          >
                            Answer:
                          </span>
                          {currentFlashcard.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ) : (
                <p>No flashcards available</p>
              )}
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
                    if (questionIndex < flashcards.length - 1) {
                      setQuestionIndex(questionIndex + 1);
                      setShowFlashcard(false);
                    }
                  }}
                  disabled={questionIndex === flashcards.length - 1}
                  size="sm"
                  variant="outline"
                >
                  Next
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </article>
        <article className={cn("space-y-2")}>
          <h3 className={cn("text-foreground/70 text-lg font-medium")}>
            Sample Questions
          </h3>
          <p className={cn("text-gray-600 text-sm")}>{week.sampleTestLabel}</p>
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
                <DialogTitle>Sample Questions: {week.weekTitle}</DialogTitle>
                <DialogDescription>
                  This is a set of sample questions to help you practice and
                  reinforce your knowledge on {week.weekTitle}. The questions
                  consist of multiple choice questions.
                </DialogDescription>
              </DialogHeader>
              <article className={cn("space-y-3")}>
                <div className={cn("space-y-1")}>
                  <h4 className={cn("text-lg font-medium")}>
                    Question {questionIndex + 1}
                  </h4>
                  <p className={cn("text-gray-600 text-sm")}>
                    {currentSampleQuestion?.question}
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
                  {currentSampleQuestion?.answers.map((option, index) => {
                    return (
                      <div
                        // biome-ignore lint/suspicious/noArrayIndexKey: <>
                        key={index}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          checked={sampleTestAnswers[questionIndex] === option}
                          value={option}
                          id={option}
                        />
                        <Label htmlFor={option}>{option}</Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </article>
              <DialogFooter>
                {showResults ? (
                  <>
                    <p className="mr-auto text-sm">
                      Score: {testScore?.correct}/{testScore?.total} (
                      {testScore?.percentage}%)
                    </p>
                    <Button
                      onClick={() => {
                        setShowResults(false);
                        setQuestionIndex(0);
                        setSampleTestAnswers(
                          Array(sampleTestQuestions.length).fill(null),
                        );
                      }}
                      size="sm"
                    >
                      Try Again
                    </Button>
                  </>
                ) : (
                  <>
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
                        } else {
                          setTestScore(
                            calculateTestScore(
                              sampleTestAnswers,
                              sampleTestQuestions,
                            ),
                          );
                          setShowResults(true);
                        }
                      }}
                      size="sm"
                      variant="outline"
                    >
                      {questionIndex === sampleTestQuestions.length - 1
                        ? "Submit"
                        : "Next"}
                    </Button>
                  </>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </article>
        <article className={cn("space-y-2")}>
          <h3 className={cn("text-foreground/70 text-lg font-medium")}>Test</h3>
          <p className={cn("text-gray-600 text-sm")}>{week.finalTestLabel}</p>
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
                <DialogTitle>Test: {week.weekTitle}</DialogTitle>
                <DialogDescription>
                  This is a test to assess your knowledge on {week.weekTitle}.
                  The test consists of multiple choice questions and is timed.
                  Good luck!
                </DialogDescription>
              </DialogHeader>
              <article className={cn("space-y-3")}>
                <div className={cn("space-y-1")}>
                  <h4 className={cn("text-lg font-medium")}>
                    Question {questionIndex + 1}
                  </h4>
                  <p className={cn("text-gray-600 text-sm")}>
                    {currentFinalQuestion?.question}
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
                  {currentFinalQuestion?.answers.map((option, index) => {
                    return (
                      <div
                        // biome-ignore lint/suspicious/noArrayIndexKey: <>
                        key={index}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          checked={finalTestAnswers[questionIndex] === option}
                          value={option}
                          id={option}
                        />
                        <Label htmlFor={option}>{option}</Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </article>
              <DialogFooter>
                {showResults ? (
                  <>
                    <p className="mr-auto text-sm">
                      Score: {testScore?.correct}/{testScore?.total} (
                      {testScore?.percentage}%)
                    </p>
                    <Button
                      onClick={() => {
                        setShowResults(false);
                        setQuestionIndex(0);
                        setFinalTestAnswers(
                          Array(finalTestQuestions.length).fill(null),
                        );
                      }}
                      size="sm"
                    >
                      Try Again
                    </Button>
                  </>
                ) : (
                  <>
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
                        } else {
                          setTestScore(
                            calculateTestScore(
                              finalTestAnswers,
                              finalTestQuestions,
                            ),
                          );
                          setShowResults(true);
                        }
                      }}
                      size="sm"
                      variant="outline"
                    >
                      {questionIndex === finalTestQuestions.length - 1
                        ? "Submit"
                        : "Next"}
                    </Button>
                  </>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </article>
      </div>
      <CourseWeekNotes showNotes={showNotes} week={week} />
    </section>
  );
}
