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
import { Steps } from "~/components/ui/steps";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

const data = [
  {
    sectionTitle: "Nursing Science",
    sectionDescription:
      "Learn about essential nursing skills, including how to take blood pressure, perform CPR, and more.",
    sectionGuidePdf: {
      label: "Download the nursing science study guide.",
      action: () => {},
    },
    sectionMedCards: {
      label: "Review medication flashcards to reinforce learning.",
      action: () => {},
    },
    sectionSampleQuestions: {
      label: "Test your knowledge with sample questions.",
      action: () => {},
    },
    sectionTest: {
      label: "Take a test to assess your knowledge.",
      action: () => {},
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
      action: () => {},
    },
    sectionMedCards: {
      label: "Review medication flashcards to reinforce learning.",
      action: () => {},
    },
    sectionSampleQuestions: {
      label: "Test your knowledge with sample questions.",
      action: () => {},
    },
    sectionTest: {
      label: "Take a test to assess your knowledge.",
      action: () => {},
    },
    sectionUserNotes: [],
  },
  {
    sectionTitle: "Pharmacology",
    sectionDescription:
      "Learn about the principles of pharmacology, including drug classifications, side effects, and more.",
    sectionGuidePdf: {
      label: "Download the pharmacology study guide.",
      action: () => {},
    },
    sectionMedCards: {
      label: "Review medication flashcards to reinforce learning.",
      action: () => {},
    },
    sectionSampleQuestions: {
      label: "Test your knowledge with sample questions.",
      action: () => {},
    },
    sectionTest: {
      label: "Take a test to assess your knowledge.",
      action: () => {},
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
      action: () => {},
    },
    sectionMedCards: {
      label: "Review medication flashcards to reinforce learning.",
      action: () => {},
    },
    sectionSampleQuestions: {
      label: "Test your knowledge with sample questions.",
      action: () => {},
    },
    sectionTest: {
      label: "Take a test to assess your knowledge.",
      action: () => {},
    },
    sectionUserNotes: [],
  },
];

export default function DashboardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [content, setContent] = useState(data[currentStep - 1]);
  const [showNotes, setShowNotes] = useState(false);
  const [isEditing, setIsEditing] = useState(-1);
  const [noteValue, setNoteValue] = useState("");

  useEffect(() => {
    setContent(data[currentStep - 1]);
  }, [currentStep]);

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
                <Button onClick={content?.sectionGuidePdf?.action} size="sm">
                  Download
                </Button>
              </article>
              <article className={cn("space-y-2")}>
                <h3 className={cn("text-foreground/70 text-lg font-medium")}>
                  Medication Flashcards
                </h3>
                <p className={cn("text-gray-600 text-sm")}>
                  {content?.sectionMedCards?.label}
                </p>
                <Button onClick={content?.sectionMedCards?.action} size="sm">
                  View Med Cards
                </Button>
              </article>
              <article className={cn("space-y-2")}>
                <h3 className={cn("text-foreground/70 text-lg font-medium")}>
                  Sample Questions
                </h3>
                <p className={cn("text-gray-600 text-sm")}>
                  {content?.sectionSampleQuestions?.label}
                </p>
                <Button
                  onClick={content?.sectionSampleQuestions?.action}
                  size="sm"
                >
                  View Questions
                </Button>
              </article>
              <article className={cn("space-y-2")}>
                <h3 className={cn("text-foreground/70 text-lg font-medium")}>
                  Test
                </h3>
                <p className={cn("text-gray-600 text-sm")}>
                  {content?.sectionTest?.label}
                </p>
                <Button onClick={content?.sectionTest?.action} size="sm">
                  Take Test
                </Button>
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
                        ].content.trim() !== ""
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
