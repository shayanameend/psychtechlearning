"use client";

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
import { cn } from "~/lib/utils";
import { CourseSectionNotes } from "./course-section-notes";

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

export function CourseSection({
  section,
  showNotes,
}: Readonly<{ section: Section; showNotes: boolean }>) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(section.flashcards);
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
            {section.sectionTitle}
          </h3>
          <p className={cn("text-gray-600 text-sm")}>
            {section.sectionDescription}
          </p>
        </article>
        <article className={cn("space-y-2")}>
          <h3 className={cn("text-foreground/70 text-lg font-medium")}>
            Study Guide
          </h3>
          <p className={cn("text-gray-600 text-sm")}>{section.guideLabel}</p>
          <Button
            onClick={() => {
              window.open(section.guideLink, "_blank");
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
            {section.flashcardsLabel}
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
                <DialogTitle>Flashcards: {section.sectionTitle}</DialogTitle>
                <DialogDescription>
                  This is a set of flashcards to help you reinforce your
                  learning on {section.sectionTitle}.
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
                    }
                    setShowFlashcard(false);
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
                    setShowFlashcard(false);
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
            {section.sampleTestLabel}
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
          <h3 className={cn("text-foreground/70 text-lg font-medium")}>Test</h3>
          <p className={cn("text-gray-600 text-sm")}>
            {section.finalTestLabel}
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
                <DialogTitle>Test: {section.sectionTitle}</DialogTitle>
                <DialogDescription>
                  This is a test to assess your knowledge on{" "}
                  {section.sectionTitle}. The test consists of multiple choice
                  questions and is timed. Good luck!
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
                            checked={finalTestAnswers[questionIndex] === option}
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
      <CourseSectionNotes
        sectionUserNotes={section.sectionUserNotes}
        showNotes={showNotes}
      />
    </section>
  );
}
