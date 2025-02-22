"use client";

import { EditIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
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

export function CourseSectionNotes({
  sectionUserNotes,
  showNotes,
}: Readonly<{ sectionUserNotes: SectionUserNote[]; showNotes: boolean }>) {
  const [notes, setNotes] = useState<SectionUserNote[]>(sectionUserNotes);
  const [isEditing, setIsEditing] = useState(-1);
  const [noteValue, setNoteValue] = useState("");

  useEffect(() => {
    setNoteValue(notes[isEditing]?.content || "");
  }, [isEditing, notes[isEditing]?.content]);

  return (
    <div
      className={cn(
        "space-y-3 lg:space-y-6",
        !showNotes && "w-1/3 hidden lg:block",
      )}
    >
      <article>
        <div className={cn("flex justify-between items-center")}>
          <h3 className={cn("text-primary text-lg font-medium")}>Your Notes</h3>
          <Button
            onClick={() => {
              if (notes[notes.length - 1]?.content.trim() !== "") {
                setNotes((prev) => [
                  ...prev,
                  {
                    id: String(new Date().getTime()),
                    content: "",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                ]);

                setIsEditing(notes.length || 0);
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
          Here you can find the notes you've taken while studying this section.
          These notes are personal to you and can help reinforce your learning.
          Feel free to add, edit, or delete any notes as you progress through
          the material.
        </p>
      </article>
      <article>
        {notes.length < 1 ? (
          <p className={cn("text-gray-600 text-sm")}>
            No notes added by users.
          </p>
        ) : (
          <ul className={cn("space-y-2 pl-3")}>
            {notes.map((note, index) => (
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
                          setNotes((prev) =>
                            prev ? prev.filter((n) => n.id !== note.id) : prev,
                          );
                        } else {
                          setNotes((prev) =>
                            prev.map((n) => {
                              if (n.id === note.id) {
                                return {
                                  ...n,
                                  content: noteValue,
                                };
                              }

                              return n;
                            }),
                          );
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
                        setNotes((prev) =>
                          prev ? prev.filter((n) => n.id !== note.id) : prev,
                        );
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
  );
}
