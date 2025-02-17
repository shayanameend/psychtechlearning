"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Steps } from "~/components/ui/steps";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

export default function DashboardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showNotes, setShowNotes] = useState(false);
  const [isEditing, setIsEditing] = useState(-1);

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
        {
          id: "4",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus et enim lacinia fermentum. Sed nec nunc nec purus placerat ultricies.",
        },
        {
          id: "5",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus et enim lacinia fermentum. Sed nec nunc nec purus placerat ultricies.",
        },
        {
          id: "6",
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
                  {data[currentStep - 1]?.sectionTitle}
                </h3>
                <p className={cn("text-gray-600 text-sm")}>
                  {data[currentStep - 1]?.sectionDescription}
                </p>
              </article>
              <article className={cn("space-y-2")}>
                <h3 className={cn("text-foreground/70 text-lg font-medium")}>
                  Study Guide
                </h3>
                <p className={cn("text-gray-600 text-sm")}>
                  {data[currentStep - 1]?.sectionGuidePdf?.label}
                </p>
                <Button
                  onClick={data[currentStep - 1]?.sectionGuidePdf?.action}
                  size="sm"
                >
                  Download
                </Button>
              </article>
              <article className={cn("space-y-2")}>
                <h3 className={cn("text-foreground/70 text-lg font-medium")}>
                  Medication Flashcards
                </h3>
                <p className={cn("text-gray-600 text-sm")}>
                  {data[currentStep - 1]?.sectionMedCards?.label}
                </p>
                <Button
                  onClick={data[currentStep - 1]?.sectionMedCards?.action}
                  size="sm"
                >
                  View Med Cards
                </Button>
              </article>
              <article className={cn("space-y-2")}>
                <h3 className={cn("text-foreground/70 text-lg font-medium")}>
                  Sample Questions
                </h3>
                <p className={cn("text-gray-600 text-sm")}>
                  {data[currentStep - 1]?.sectionSampleQuestions?.label}
                </p>
                <Button
                  onClick={
                    data[currentStep - 1]?.sectionSampleQuestions?.action
                  }
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
                  {data[currentStep - 1]?.sectionTest?.label}
                </p>
                <Button
                  onClick={data[currentStep - 1]?.sectionTest?.action}
                  size="sm"
                >
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
                <h3 className={cn("text-primary text-lg font-medium")}>
                  Your Notes
                </h3>
                <p className={cn("text-gray-600 text-sm")}>
                  Here you can find the notes you've taken while studying this
                  section. These notes are personal to you and can help
                  reinforce your learning. Feel free to add, edit, or delete any
                  notes as you progress through the material.
                </p>
              </article>
              <article>
                {data[currentStep - 1]?.sectionUserNotes?.length === 0 ? (
                  <p className={cn("text-gray-600 text-sm")}>
                    No notes added by users.
                  </p>
                ) : (
                  <ul className={cn("space-y-2 pl-3")}>
                    {data[currentStep - 1]?.sectionUserNotes?.map(
                      (note, index) => (
                        <li
                          key={note.id}
                          className={cn("text-gray-600 text-sm list-disc")}
                        >
                          {isEditing === index ? (
                            <Textarea
                              defaultValue={note.content}
                              className={cn("resize-none")}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  setIsEditing(-1);
                                }
                              }}
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
                            </>
                          )}
                        </li>
                      ),
                    )}
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
