"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";

import { CourseWeek } from "~/app/(dashboard)/_components/course-week";
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

export function WeekSection({
  id,
  total,
  on,
}: {
  id: string;
  total: number;
  on: number;
}) {
  const [content, setContent] = useState<Week | null>(null);
  const [showNotes, setShowNotes] = useState(false);

  const { token } = useUserContext();

  const { data: weeksQueryResult, isSuccess: weeksQueryIsSuccess } = useQuery({
    queryKey: ["week", id],
    queryFn: async () => {
      const response = await axios.get(paths.api.weeks.id.root({ id }), {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      return response.data as { data: { week: Week } };
    },
  });

  useEffect(() => {
    setContent(weeksQueryResult?.data.week ?? null);
  }, [weeksQueryResult?.data.week]);

  const steps = Array.from({ length: total }, (_, index) => index + 1);

  if (!weeksQueryIsSuccess) {
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
          {steps.length > 1 && <Steps steps={steps} currentStep={on} />}
        </aside>
        <main className={cn("flex-1 py-4 lg:py-0 lg:px-8 flex flex-col gap-6")}>
          {content ? (
            <CourseWeek week={content} showNotes={showNotes} />
          ) : (
            <section className={cn("flex-1 flex justify-center items-center")}>
              <p className={cn("text-gray-600 text-sm")}>
                Week not found, Go back to calendar and try again.
              </p>
            </section>
          )}
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
          </footer>
        </main>
      </section>
    </>
  );
}
