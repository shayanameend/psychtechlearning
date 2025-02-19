"use client";

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

interface Question {
  question: string;
  answers: string[];
  correctAnswer: string;
}

const data = [
  {
    sectionTitle: "Nursing Science",
    sectionDescription:
      "Learn about essential nursing skills, including how to take blood pressure, perform CPR, and more.",
    sectionGuidePdf: {
      label: "Download the nursing science study guide.",
      link: "guide.pdf",
    },
    sectionFlashcards: {
      label: "Review medication flashcards to reinforce learning.",
      cards: [
        {
          id: "1",
          question: "What is the normal range for blood pressure?",
          answer: "120/80",
        },
        {
          id: "2",
          question: "What is the normal range for heart rate?",
          answer: "60-100 bpm",
        },
        {
          id: "3",
          question: "What is the normal range for respiratory rate?",
          answer: "12-20 bpm",
        },
      ],
    },
    sectionSampleTest: {
      label: "Test your knowledge with sample questions.",
      questions: [
        {
          question: "What is the normal range for blood pressure?",
          answers: ["120/80", "140/90", "160/100", "180/110"],
          correctAnswer: "120/80",
        },
        {
          question: "What is the normal range for heart rate?",
          answers: ["60-100 bpm", "100-140 bpm", "140-180 bpm", "180-220 bpm"],
          correctAnswer: "60-100 bpm",
        },
        {
          question: "What is the normal range for respiratory rate?",
          answers: ["12-20 bpm", "20-30 bpm", "30-40 bpm", "40-50 bpm"],
          correctAnswer: "12-20 bpm",
        },
      ],
    },
    sectionFinalTest: {
      label: "Take a test to assess your knowledge.",
      questions: [
        {
          question: "What is the normal range for blood pressure?",
          answers: ["120/80", "140/90", "160/100", "180/110"],
          correctAnswer: "120/80",
        },
        {
          question: "What is the normal range for heart rate?",
          answers: ["60-100 bpm", "100-140 bpm", "140-180 bpm", "180-220 bpm"],
          correctAnswer: "60-100 bpm",
        },
        {
          question: "What is the normal range for respiratory rate?",
          answers: ["12-20 bpm", "20-30 bpm", "30-40 bpm", "40-50 bpm"],
          correctAnswer: "12-20 bpm",
        },
      ],
    },
    sectionUserNotes: [
      {
        id: "1",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus et enim lacinia fermentum. Sed nec nunc nec purus placerat ultricies. Nullam nec purus et enim lacinia fermentum. Sed nec nunc nec purus placerat ultricies. Nullam nec purus et enim lacinia fermentum. Sed nec nunc nec purus placerat ultricies. Nullam nec purus et enim lacinia fermentum. Sed nec nunc nec purus placerat ultricies.",
      },
      {
        id: "2",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus et enim lacinia fermentum. Sed nec nunc nec purus placerat ultricies. Nullam nec purus et enim lacinia fermentum. Sed nec nunc nec purus placerat ultricies. Nullam nec purus et enim lacinia fermentum. Sed nec nunc nec purus placerat ultricies.",
      },
      {
        id: "3",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus et enim lacinia fermentum. Sed nec nunc nec purus placerat ultricies.",
      },
    ],
  },
  {
    sectionTitle: "Anatomy & Physiology",
    sectionDescription:
      "Study the structure and function of the human body, including the skeletal, muscular, and nervous systems.",
    sectionGuidePdf: {
      label: "Download the anatomy & physiology study guide.",
      link: "guide.pdf",
    },
    sectionFlashcards: {
      label: "Review medication flashcards to reinforce learning.",
      cards: [
        {
          id: "1",
          question: "What is the largest organ in the human body?",
          answer: "Skin",
        },
        {
          id: "2",
          question: "What is the smallest bone in the human body?",
          answer: "Stapes",
        },
        {
          id: "3",
          question: "What is the primary function of the respiratory system?",
          answer: "Transport oxygen to cells",
        },
      ],
    },
    sectionSampleTest: {
      label: "Test your knowledge with sample questions.",
      questions: [
        {
          question: "What is the largest organ in the human body?",
          answers: ["Liver", "Skin", "Heart", "Lungs"],
          correctAnswer: "Skin",
        },
        {
          question: "What is the smallest bone in the human body?",
          answers: ["Stapes", "Malleus", "Incus", "Femur"],
          correctAnswer: "Stapes",
        },
        {
          question: "What is the primary function of the respiratory system?",
          answers: [
            "Transport oxygen to cells",
            "Remove waste from the body",
            "Regulate body temperature",
            "Protect the body from pathogens",
          ],
          correctAnswer: "Transport oxygen to cells",
        },
      ],
    },
    sectionFinalTest: {
      label: "Take a test to assess your knowledge.",
      questions: [
        {
          question: "What is the largest organ in the human body?",
          answers: ["Liver", "Skin", "Heart", "Lungs"],
          correctAnswer: "Skin",
        },
        {
          question: "What is the smallest bone in the human body?",
          answers: ["Stapes", "Malleus", "Incus", "Femur"],
          correctAnswer: "Stapes",
        },
        {
          question: "What is the primary function of the respiratory system?",
          answers: [
            "Transport oxygen to cells",
            "Remove waste from the body",
            "Regulate body temperature",
            "Protect the body from pathogens",
          ],
          correctAnswer: "Transport oxygen to cells",
        },
      ],
    },
    sectionUserNotes: [],
  },
  {
    sectionTitle: "Pharmacology",
    sectionDescription:
      "Learn about the principles of pharmacology, including drug classifications, side effects, and more.",
    sectionGuidePdf: {
      label: "Download the pharmacology study guide.",
      link: "guide.pdf",
    },
    sectionFlashcards: {
      label: "Review medication flashcards to reinforce learning.",
      cards: [
        {
          id: "1",
          question: "What is the primary function of an analgesic?",
          answer: "Relieve pain",
        },
        {
          id: "2",
          question: "What is the primary function of an antibiotic?",
          answer: "Treat infection",
        },
        {
          id: "3",
          question: "What is the primary function of an antihypertensive?",
          answer: "Lower blood pressure",
        },
      ],
    },
    sectionSampleTest: {
      label: "Test your knowledge with sample questions.",
      questions: [
        {
          question: "What is the primary function of an analgesic?",
          answers: [
            "Reduce fever",
            "Relieve pain",
            "Treat infection",
            "Lower blood pressure",
          ],
          correctAnswer: "Relieve pain",
        },
        {
          question: "What is the primary function of an antibiotic?",
          answers: [
            "Reduce fever",
            "Relieve pain",
            "Treat infection",
            "Lower blood pressure",
          ],
          correctAnswer: "Treat infection",
        },
        {
          question: "What is the primary function of an antihypertensive?",
          answers: [
            "Reduce fever",
            "Relieve pain",
            "Treat infection",
            "Lower blood pressure",
          ],
          correctAnswer: "Lower blood pressure",
        },
      ],
    },
    sectionFinalTest: {
      label: "Take a test to assess your knowledge.",
      questions: [
        {
          question: "What is the primary function of an analgesic?",
          answers: [
            "Reduce fever",
            "Relieve pain",
            "Treat infection",
            "Lower blood pressure",
          ],
          correctAnswer: "Relieve pain",
        },
        {
          question: "What is the primary function of an antibiotic?",
          answers: [
            "Reduce fever",
            "Relieve pain",
            "Treat infection",
            "Lower blood pressure",
          ],
          correctAnswer: "Treat infection",
        },
        {
          question: "What is the primary function of an antihypertensive?",
          answers: [
            "Reduce fever",
            "Relieve pain",
            "Treat infection",
            "Lower blood pressure",
          ],
          correctAnswer: "Lower blood pressure",
        },
      ],
    },
    sectionUserNotes: [
      {
        id: "1",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus et enim lacinia fermentum. Sed nec nunc nec purus placerat ultricies. Nullam nec purus et enim lacinia fermentum. Sed nec nunc nec purus placerat ultricies. Nullam nec purus et enim lacinia fermentum. Sed nec nunc nec purus placerat ultricies. Nullam nec purus et enim lacinia fermentum. Sed nec nunc nec purus placerat ultricies.",
      },
    ],
  },
  {
    sectionTitle: "Mental Health",
    sectionDescription:
      "Study the mental health nursing concepts, including therapeutic communication, mental health disorders, and more.",
    sectionGuidePdf: {
      label: "Download the mental health study guide.",
      link: "guide.pdf",
    },
    sectionFlashcards: {
      label: "Review medication flashcards to reinforce learning.",
      cards: [
        {
          id: "1",
          question: "What is the primary symptom of depression?",
          answer: "Anhedonia",
        },
        {
          id: "2",
          question: "What is the primary symptom of anxiety?",
          answer: "Anhedonia",
        },
        {
          id: "3",
          question: "What is the primary symptom of schizophrenia?",
          answer: "Hallucinations",
        },
      ],
    },
    sectionSampleTest: {
      label: "Test your knowledge with sample questions.",
      questions: [
        {
          question: "What is the primary symptom of depression?",
          answers: ["Euphoria", "Mania", "Anhedonia", "Hallucinations"],
          correctAnswer: "Anhedonia",
        },
        {
          question: "What is the primary symptom of anxiety?",
          answers: ["Euphoria", "Mania", "Anhedonia", "Hallucinations"],
          correctAnswer: "Anhedonia",
        },
        {
          question: "What is the primary symptom of schizophrenia?",
          answers: ["Euphoria", "Mania", "Anhedonia", "Hallucinations"],
          correctAnswer: "Hallucinations",
        },
      ],
    },
    sectionFinalTest: {
      label: "Take a test to assess your knowledge.",
      questions: [
        {
          question: "What is the primary symptom of depression?",
          answers: ["Euphoria", "Mania", "Anhedonia", "Hallucinations"],
          correctAnswer: "Anhedonia",
        },
        {
          question: "What is the primary symptom of anxiety?",
          answers: ["Euphoria", "Mania", "Anhedonia", "Hallucinations"],
          correctAnswer: "Anhedonia",
        },
        {
          question: "What is the primary symptom of schizophrenia?",
          answers: ["Euphoria", "Mania", "Anhedonia", "Hallucinations"],
          correctAnswer: "Hallucinations",
        },
      ],
    },
    sectionUserNotes: [],
  },
];

export default function DashboardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [content, setContent] = useState(data[currentStep - 1]);
  const [flashcards, setFlashcards] = useState(
    data[currentStep - 1].sectionFlashcards.cards,
  );
  const [showFlashcard, setShowFlashcard] = useState(false);
  const [sampleTestQuestions, setSampleTestQuestions] = useState<Question[]>(
    [],
  );
  const [sampleTestAnswers, setSampleTestAnswers] = useState<
    Array<string | null>
  >([]);
  const [finalTestQuestions, setFinalTestQuestions] = useState<Question[]>([]);
  const [finalTestAnswers, setFinalTestAnswers] = useState<
    Array<string | null>
  >([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [isEditing, setIsEditing] = useState(-1);
  const [noteValue, setNoteValue] = useState("");

  useEffect(() => {
    setContent(data[currentStep - 1]);
  }, [currentStep]);

  useEffect(() => {
    setFlashcards(content.sectionFlashcards.cards);
  }, [content]);

  useEffect(() => {
    setSampleTestQuestions(content.sectionSampleTest.questions);
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
    setFinalTestQuestions(content.sectionFinalTest.questions);
  }, [content]);

  useEffect(() => {
    setNoteValue(content.sectionUserNotes[isEditing]?.content);
  }, [content, isEditing]);

  const steps = [1, 2, 3, 4];

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

  return (
    <>
      <section
        className={cn(
          "py-2 px-6 lg:px-10 lg:pb-6 min-h-[calc(100svh_-_4.5rem)] lg:min-h-[calc(100svh_-_6.5rem)] flex flex-col lg:flex-row",
        )}
      >
        <aside>
          <Steps steps={steps} currentStep={currentStep} />
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
                  {content?.sectionGuidePdf?.label}
                </p>
                <Button
                  onClick={() => {
                    window.open(content?.sectionGuidePdf?.link, "_blank");
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
                  {content?.sectionFlashcards?.label}
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
                  {content?.sectionSampleTest?.label}
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
                  {content?.sectionFinalTest?.label}
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
                        content.sectionUserNotes[
                          content.sectionUserNotes.length - 1
                        ]?.content.trim() !== ""
                      ) {
                        setContent((prev) => ({
                          ...prev,
                          sectionUserNotes: [
                            ...prev.sectionUserNotes,
                            {
                              id: String(
                                prev.sectionUserNotes[
                                  prev.sectionUserNotes.length - 1
                                ]?.id + 1,
                              ),
                              content: "",
                            },
                          ],
                        }));

                        setIsEditing(content.sectionUserNotes.length);
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
                                  setContent((prev) => ({
                                    ...prev,
                                    sectionUserNotes:
                                      prev.sectionUserNotes.filter(
                                        (n) => n.id !== note.id,
                                      ),
                                  }));
                                } else {
                                  setContent((prev) => ({
                                    ...prev,
                                    sectionUserNotes: prev.sectionUserNotes.map(
                                      (n) =>
                                        n.id === note.id
                                          ? {
                                              ...n,
                                              content: noteValue,
                                            }
                                          : n,
                                    ),
                                  }));
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
                                setContent((prev) => ({
                                  ...prev,
                                  sectionUserNotes:
                                    prev.sectionUserNotes.filter(
                                      (n) => n.id !== note.id,
                                    ),
                                }));
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
                disabled={currentStep === steps.length}
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
