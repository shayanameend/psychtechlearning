"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import {
  BookOpen,
  Check,
  ClipboardList,
  FileCheck,
  FlipHorizontal,
  RefreshCcw,
  X,
} from "lucide-react";
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
import { Progress } from "~/components/ui/progress";
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
          "w-full lg:w-2/3 space-y-2 lg:space-y-4 p-4 pt-0",
          showNotes && "hidden",
        )}
      >
        <article
          className={cn("space-y-2 bg-white/50 p-4 rounded-lg shadow-sm")}
        >
          <h3 className={cn("text-primary text-xl font-bold")}>
            {week.weekTitle}
          </h3>
          <p className={cn("text-gray-600 text-sm leading-relaxed")}>
            {week.weekDescription}
          </p>
        </article>
        <article
          className={cn("space-y-2 bg-white/50 p-4 rounded-lg shadow-sm")}
        >
          <h3
            className={cn(
              "text-foreground/70 text-lg font-medium flex items-center",
            )}
          >
            <BookOpen className="h-5 w-5 mr-2 text-primary/70" />
            Study Guide
          </h3>
          <p className={cn("text-gray-600 text-sm")}>{week.guideLabel}</p>
          <Button
            onClick={() => {
              window.open(week.guideLink, "_blank");
            }}
            size="sm"
            className="transition-all hover:scale-105"
          >
            Download
          </Button>
        </article>
        <article
          className={cn("space-y-2 bg-white/50 p-4 rounded-lg shadow-sm")}
        >
          <h3
            className={cn(
              "text-foreground/70 text-lg font-medium flex items-center",
            )}
          >
            <FlipHorizontal className="h-5 w-5 mr-2 text-primary/70" />
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
                className="transition-all hover:scale-105"
              >
                View Flashcards
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[320px] lg:max-w-[512px]">
              <DialogHeader>
                <DialogTitle className="text-primary">
                  Flashcards: {week.weekTitle}
                </DialogTitle>
                <DialogDescription>
                  This is a set of flashcards to help you reinforce your
                  learning on {week.weekTitle}.
                </DialogDescription>
              </DialogHeader>
              {currentFlashcard ? (
                <article className={cn("relative")}>
                  <div className="w-full mb-3">
                    <Progress
                      value={((questionIndex + 1) / flashcards.length) * 100}
                      className="h-1"
                    />
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>
                        Card {questionIndex + 1} of {flashcards.length}
                      </span>
                      <span>
                        {Math.round(
                          ((questionIndex + 1) / flashcards.length) * 100,
                        )}
                        % complete
                      </span>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "relative w-full min-h-[200px] perspective-[1000px] transition-transform duration-500",
                    )}
                  >
                    <div
                      className={cn(
                        "absolute w-full h-full transform-style-3d transition-all duration-500",
                        showFlashcard ? "rotate-y-180" : "",
                      )}
                    >
                      {/* Front of card (question) */}
                      <motion.div
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 1 }}
                        className={cn(
                          "absolute w-full h-full backface-hidden bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl border border-blue-100 shadow-md flex flex-col justify-center",
                          showFlashcard ? "invisible" : "",
                        )}
                      >
                        <p
                          className={cn(
                            "text-gray-700 font-medium text-center",
                          )}
                        >
                          {currentFlashcard.question}
                        </p>
                        <div className="absolute bottom-3 left-0 right-0 text-center text-xs text-gray-400">
                          Click "Show" to reveal the answer
                        </div>
                      </motion.div>

                      {/* Back of card (answer) */}
                      <motion.div
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 1 }}
                        className={cn(
                          "absolute w-full h-full backface-hidden bg-gradient-to-br from-white to-green-50 p-6 rounded-xl border border-green-100 shadow-md flex flex-col justify-center rotate-y-180",
                          !showFlashcard ? "invisible" : "",
                        )}
                      >
                        <p className={cn("text-primary text-center")}>
                          {currentFlashcard.answer}
                        </p>
                        <div className="absolute bottom-3 left-0 right-0 text-center text-xs text-gray-400">
                          Click "Hide" to see the question again
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </article>
              ) : (
                <p className="text-center py-8 text-gray-500">
                  No flashcards available
                </p>
              )}
              <DialogFooter className="flex justify-between space-x-2">
                <Button
                  onClick={() => {
                    setShowFlashcard(!showFlashcard);
                  }}
                  size="sm"
                  variant="outline"
                  className={cn(
                    "mr-auto",
                    showFlashcard ? "bg-blue-50" : "bg-green-50",
                  )}
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
        <article
          className={cn("space-y-2 bg-white/50 p-4 rounded-lg shadow-sm")}
        >
          <h3
            className={cn(
              "text-foreground/70 text-lg font-medium flex items-center",
            )}
          >
            <ClipboardList className="h-5 w-5 mr-2 text-primary/70" />
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
                className="transition-all hover:scale-105"
              >
                View Questions
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[320px] lg:max-w-[512px]">
              <DialogHeader>
                <DialogTitle className="text-primary">
                  Sample Questions: {week.weekTitle}
                </DialogTitle>
                <DialogDescription>
                  This is a set of sample questions to help you practice and
                  reinforce your knowledge on {week.weekTitle}. The questions
                  consist of multiple choice questions.
                </DialogDescription>
              </DialogHeader>
              <article className={cn("space-y-3")}>
                {!showResults && (
                  <div className="w-full mb-3">
                    <Progress
                      value={
                        ((questionIndex + 1) / sampleTestQuestions.length) * 100
                      }
                      className="h-1"
                    />
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>
                        Question {questionIndex + 1} of{" "}
                        {sampleTestQuestions.length}
                      </span>
                      <span>
                        {Math.round(
                          ((questionIndex + 1) / sampleTestQuestions.length) *
                            100,
                        )}
                        % complete
                      </span>
                    </div>
                  </div>
                )}
                {showResults ? (
                  <div className="space-y-4 py-4">
                    <div
                      className={cn(
                        "text-center p-4 rounded-lg",
                        testScore && testScore.percentage >= 70
                          ? "bg-green-50 border border-green-100"
                          : "bg-amber-50 border border-amber-100",
                      )}
                    >
                      <h3 className="text-xl font-bold mb-2">
                        {testScore && testScore.percentage >= 70 ? (
                          <span className="text-green-600">Well Done!</span>
                        ) : (
                          <span className="text-amber-600">
                            Keep Practicing
                          </span>
                        )}
                      </h3>
                      <div className="text-lg font-medium">
                        Score: {testScore?.correct}/{testScore?.total} (
                        {testScore?.percentage}%)
                      </div>
                      {testScore && testScore.percentage < 70 && (
                        <p className="text-sm text-gray-600 mt-2">
                          Review the material and try again!
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
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
                            className="flex items-center space-x-2 py-1 px-2 rounded-lg hover:bg-gray-50" // Reduced padding-y from p-2
                          >
                            <RadioGroupItem
                              checked={
                                sampleTestAnswers[questionIndex] === option
                              }
                              value={option}
                              id={option}
                            />
                            <Label
                              htmlFor={option}
                              className="flex-1 cursor-pointer text-sm" // Added text-sm for more compact text
                            >
                              {option}
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </>
                )}
              </article>
              <DialogFooter>
                {showResults ? (
                  <>
                    <Button
                      onClick={() => {
                        setShowResults(false);
                        setQuestionIndex(0);
                        setSampleTestAnswers(
                          Array(sampleTestQuestions.length).fill(null),
                        );
                      }}
                      size="sm"
                      className="ml-auto"
                    >
                      <RefreshCcw className="h-4 w-4 mr-2" />
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
                      variant={
                        questionIndex === sampleTestQuestions.length - 1
                          ? "default"
                          : "outline"
                      }
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
        <article
          className={cn("space-y-2 bg-white/50 p-4 rounded-lg shadow-sm")}
        >
          <h3
            className={cn(
              "text-foreground/70 text-lg font-medium flex items-center",
            )}
          >
            <FileCheck className="h-5 w-5 mr-2 text-primary/70" />
            Test
          </h3>
          <p className={cn("text-gray-600 text-sm")}>{week.finalTestLabel}</p>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setQuestionIndex(0);
                }}
                size="sm"
                className="transition-all hover:scale-105"
              >
                Take Test
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[320px] lg:max-w-[512px]">
              <DialogHeader>
                <DialogTitle className="text-primary">
                  Test: {week.weekTitle}
                </DialogTitle>
                <DialogDescription>
                  This is a test to assess your knowledge on {week.weekTitle}.
                  The test consists of multiple choice questions and is timed.
                  Good luck!
                </DialogDescription>
              </DialogHeader>
              <article className={cn("space-y-3")}>
                {!showResults && (
                  <div className="w-full mb-3">
                    <Progress
                      value={
                        ((questionIndex + 1) / finalTestQuestions.length) * 100
                      }
                      className="h-1"
                    />
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>
                        Question {questionIndex + 1} of{" "}
                        {finalTestQuestions.length}
                      </span>
                      <span>
                        {Math.round(
                          ((questionIndex + 1) / finalTestQuestions.length) *
                            100,
                        )}
                        % complete
                      </span>
                    </div>
                  </div>
                )}
                {showResults ? (
                  <div className="space-y-4 py-4">
                    <div
                      className={cn(
                        "text-center p-4 rounded-lg",
                        testScore && testScore.percentage >= 70
                          ? "bg-green-50 border border-green-100"
                          : "bg-amber-50 border border-amber-100",
                      )}
                    >
                      <h3 className="text-xl font-bold mb-2">
                        {testScore && testScore.percentage >= 70 ? (
                          <div className="flex items-center justify-center">
                            <Check className="h-5 w-5 mr-2 text-green-600" />
                            <span className="text-green-600">Passed!</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <X className="h-5 w-5 mr-2 text-amber-600" />
                            <span className="text-amber-600">Not Passed</span>
                          </div>
                        )}
                      </h3>
                      <div className="text-lg font-medium">
                        Score: {testScore?.correct}/{testScore?.total} (
                        {testScore?.percentage}%)
                      </div>
                      {testScore && testScore.percentage < 70 && (
                        <p className="text-sm text-gray-600 mt-2">
                          Review the material and try again!
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
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
                            className="flex items-center space-x-2 py-1 px-2 rounded-lg hover:bg-gray-50" // Reduced padding-y from p-2
                          >
                            <RadioGroupItem
                              checked={
                                finalTestAnswers[questionIndex] === option
                              }
                              value={option}
                              id={option}
                            />
                            <Label
                              htmlFor={option}
                              className="flex-1 cursor-pointer text-sm" // Added text-sm for more compact text
                            >
                              {option}
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </>
                )}
              </article>
              <DialogFooter>
                {showResults ? (
                  <>
                    <Button
                      onClick={() => {
                        setShowResults(false);
                        setQuestionIndex(0);
                        setFinalTestAnswers(
                          Array(finalTestQuestions.length).fill(null),
                        );
                      }}
                      size="sm"
                      className="ml-auto"
                    >
                      <RefreshCcw className="h-4 w-4 mr-2" />
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
                      variant={
                        questionIndex === finalTestQuestions.length - 1
                          ? "default"
                          : "outline"
                      }
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
