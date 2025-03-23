"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, default as axios } from "axios";
import { EditIcon, PlusIcon, RefreshCwIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { useUserContext } from "~/providers/user-provider";
import { paths } from "~/routes/paths";

const MAX_NOTES = 5;
const MAX_NOTE_LENGTH = 210;

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

interface BlockUserNote {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Audio {
  id: string;
  title: string;
  audioLink: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Week {
  id: string;
  weekNumber: number;
  title: string;
  audios: Audio[];
  createdAt: Date;
  updatedAt: Date;
}

interface Block {
  id: string;
  blockOrder: number;
  blockTitle: string;
  blockDescription: string;
  guideLink: string;
  guideDescription: string;
  flashcardsDescription: string;
  sampleTestDescription: string;
  finalTestDescription: string;
  weeks: Week[];
  flashcards: Flashcard[];
  sampleTestQuestions: TestQuestion[];
  finalTestQuestions: TestQuestion[];
  blockUserNotes: BlockUserNote[];
  createdAt: Date;
  updatedAt: Date;
}

export function BlockNotes({
  block,
  showNotes,
}: Readonly<{ block: Block; showNotes: boolean }>) {
  const [notes, setNotes] = useState<BlockUserNote[]>(block.blockUserNotes);
  const [deletedNotes, setDeletedNotes] = useState<string[]>([]);
  const [newNotes, setNewNotes] = useState<
    Omit<Omit<Omit<BlockUserNote, "updatedAt">, "createdAt">, "id">[]
  >([]);

  const [isEditing, setIsEditing] = useState(-1);
  const [noteValue, setNoteValue] = useState("");

  const queryClient = useQueryClient();
  const { token } = useUserContext();

  useEffect(() => {
    setNotes(block.blockUserNotes);
  }, [block.blockUserNotes]);

  useEffect(() => {
    if (isEditing >= 0) {
      const note =
        isEditing < notes.length
          ? notes[isEditing]
          : newNotes[isEditing - notes.length];
      setNoteValue(note?.content || "");
    }
  }, [isEditing, notes, newNotes]);

  const updateNotesMutation = useMutation({
    mutationFn: async ({
      blockId,
      notes,
      deletedNotes,
      newNotes,
    }: {
      blockId: string;
      notes: BlockUserNote[];
      deletedNotes: string[];
      newNotes: Omit<
        Omit<Omit<BlockUserNote, "updatedAt">, "createdAt">,
        "id"
      >[];
    }) => {
      const response = await axios.put(
        paths.api.blocks.id.userNotes.bulk({ id: blockId }),
        {
          notes,
          deletedNotes,
          newNotes,
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
      setDeletedNotes([]);
      setNewNotes([]);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }
    },
    onSettled: () => {
      setIsEditing(-1);
      setNoteValue("");
    },
  });

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
          <div className={cn("flex items-center gap-2")}>
            <Button
              onClick={() => {
                const totalNotes = notes.length + newNotes.length;
                if (totalNotes < MAX_NOTES) {
                  setNewNotes([
                    ...newNotes,
                    {
                      content: "",
                    },
                  ]);
                  setIsEditing(notes.length + newNotes.length);
                }
              }}
              variant="outline"
              size="icon"
              disabled={notes.length + newNotes.length >= MAX_NOTES}
              className={cn("rounded-sm size-5 [&_svg]:size-3")}
            >
              <PlusIcon />
            </Button>
            <Button
              onClick={() => {
                updateNotesMutation.mutate({
                  blockId: block.id,
                  notes,
                  deletedNotes,
                  newNotes,
                });
              }}
              variant="outline"
              size="icon"
              className={cn("rounded-sm size-5 [&_svg]:size-3")}
            >
              <RefreshCwIcon />
            </Button>
          </div>
        </div>
        <p className={cn("text-gray-600 text-sm")}>
          Here you can find the notes you've taken while studying this block.
          (Max {MAX_NOTES} notes, each up to {MAX_NOTE_LENGTH} characters).
          These notes are personal to you and can help reinforce your learning.
          Feel free to add, edit, or delete any notes as you progress through
          the material.
        </p>
      </article>
      <article>
        {notes.length + newNotes.length < 1 ? (
          <p className={cn("text-gray-600 text-sm")}>No notes added by you.</p>
        ) : !updateNotesMutation.isPending ? (
          <ul className={cn("space-y-2 pl-3")}>
            {/* Existing Notes */}
            {notes.map((note, index) => (
              <li
                key={note.id}
                className={cn("text-gray-600 text-sm list-disc")}
              >
                {isEditing === index ? (
                  <Textarea
                    value={noteValue}
                    onChange={(event) => {
                      const newVal = event.currentTarget.value.slice(
                        0,
                        MAX_NOTE_LENGTH,
                      );
                      setNoteValue(newVal);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        setIsEditing(-1);

                        if (event.currentTarget.value.trim() === "") {
                          setDeletedNotes([...deletedNotes, note.id]);
                          setNotes(notes.filter((_, i) => i !== index));
                        } else {
                          setNotes(
                            notes.map((n, i) =>
                              i === index ? { ...n, content: noteValue } : n,
                            ),
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
                        setDeletedNotes([...deletedNotes, note.id]);
                        setNotes(notes.filter((_, i) => i !== index));
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

            {/* New Notes */}
            {newNotes.map((note, index) => (
              <li
                key={`new-${
                  // biome-ignore lint/suspicious/noArrayIndexKey: <>
                  index
                }`}
                className={cn("text-gray-600 text-sm list-disc")}
              >
                {isEditing === notes.length + index ? (
                  <Textarea
                    value={noteValue}
                    onChange={(event) => {
                      const newVal = event.currentTarget.value.slice(
                        0,
                        MAX_NOTE_LENGTH,
                      );
                      setNoteValue(newVal);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        setIsEditing(-1);

                        if (event.currentTarget.value.trim() === "") {
                          setNewNotes(newNotes.filter((_, i) => i !== index));
                        } else {
                          setNewNotes(
                            newNotes.map((n, i) =>
                              i === index ? { ...n, content: noteValue } : n,
                            ),
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
                        setIsEditing(notes.length + index);
                      }}
                      variant="link"
                      size="icon"
                      className={cn("ml-1 size-6")}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      onClick={() => {
                        setNewNotes(newNotes.filter((_, i) => i !== index));
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
        ) : (
          <p className={cn("text-gray-600 text-sm")}>Syncing notes...</p>
        )}
      </article>
    </div>
  );
}
