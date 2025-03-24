"use client";

import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AlertCircle, BlocksIcon, XIcon } from "lucide-react";

import { Block } from "~/app/(dashboard)/_components/block";
import { Button } from "~/components/ui/button";
import { Steps } from "~/components/ui/steps";
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
  weeksDescription: string;
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

const LoadingState = () => (
  <section className="flex-1 flex flex-col items-center justify-center">
    <div className="text-center p-10">
      <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      <p className="mt-4 text-gray-600">Loading content...</p>
    </div>
  </section>
);

const ErrorState = ({ message }: { message: string }) => (
  <section className="flex-1 flex justify-center items-center">
    <div className="text-center p-10 rounded-lg bg-red-50 shadow-sm max-w-md">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-red-800 mb-2">
        Error Loading Content
      </h3>
      <p className="text-red-600">{message}</p>
      <div className="mt-4">
        <Button
          onClick={() => window.location.reload()}
          variant="destructive"
          size="sm"
        >
          Try Again
        </Button>
      </div>
    </div>
  </section>
);

const EmptyState = () => (
  <section className="flex-1 flex justify-center items-center">
    <div className="text-center p-10 rounded-lg bg-gray-50 shadow-sm">
      <BlocksIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600">
        Block not found. Please go back and try again.
      </p>
    </div>
  </section>
);

export function BlockSection({
  id,
  total,
  on,
}: {
  id: string;
  total: number;
  on: number;
}) {
  const [content, setContent] = useState<Block | null>(null);
  const [showNotes, setShowNotes] = useState(false);

  const { token } = useUserContext();

  const {
    data: blocksQueryResult,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["blocks", id],
    queryFn: async () => {
      const response = await axios.get(paths.api.blocks.id.root({ id }), {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      return response.data as { data: { block: Block } };
    },
  });

  useEffect(() => {
    setContent(blocksQueryResult?.data.block ?? null);
  }, [blocksQueryResult?.data.block]);

  const steps = Array.from({ length: total }, (_, index) => index + 1);

  return (
    <>
      <section
        className={cn(
          "py-2 px-6 lg:px-10 lg:pb-6 min-h-[calc(100svh_-_4.5rem)] lg:min-h-[calc(100svh_-_6.5rem)] flex flex-col lg:flex-row",
        )}
      >
        <aside>
          {steps.length > 1 && <Steps steps={steps} currentStep={on} />}
        </aside>
        <main className={cn("flex-1 py-4 lg:py-0 lg:px-8 flex flex-col gap-6")}>
          {isLoading ? (
            <LoadingState />
          ) : isError ? (
            <ErrorState
              message={
                (error as Error)?.message || "Failed to load block content"
              }
            />
          ) : content ? (
            <Block block={content} showNotes={showNotes} />
          ) : (
            <EmptyState />
          )}
          <footer className={cn("flex justify-end items-center")}>
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
          </footer>
        </main>
      </section>
    </>
  );
}
