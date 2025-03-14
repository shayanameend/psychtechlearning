"use client";

import { useQuery } from "@tanstack/react-query";
import { default as axios } from "axios";
import { useEffect, useState } from "react";

import { cn } from "~/lib/utils";
import { useUserContext } from "~/providers/user-provider";
import { paths } from "~/routes/paths";
import { CourseWeek } from "./_components/course-week";
import { NewWeekButton } from "./_components/new-week-button";

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
  guideLink: string;
  guideDescription: string;
  audioLink: string;
  audioDescription: string;
  flashcardsDescription: string;
  sampleTestDescription: string;
  finalTestDescription: string;
  flashcards: Flashcard[];
  sampleTestQuestions: TestQuestion[];
  finalTestQuestions: TestQuestion[];
  weekUserNotes: WeekUserNote[];
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminPage() {
  const { token } = useUserContext();

  const { data: weeksQueryResult, isSuccess: weeksQueryIsSuccess } = useQuery({
    queryKey: ["weeks"],
    queryFn: async () => {
      const response = await axios.get(paths.api.weeks.root(), {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      return response.data as { data: { weeks: Week[] } };
    },
  });

  const [content, setContent] = useState<Week[]>(
    weeksQueryResult?.data.weeks || [],
  );

  useEffect(() => {
    setContent(weeksQueryResult?.data.weeks || []);
  }, [weeksQueryResult?.data.weeks]);

  if (!weeksQueryIsSuccess) {
    return null;
  }

  return (
    <>
      <section
        className={cn(
          "py-2 px-6 lg:px-10 lg:pb-6 min-h-[calc(100svh_-_4.5rem)] lg:min-h-[calc(100svh_-_6.5rem)]",
        )}
      >
        <main
          className={cn("flex-1 py-4 lg:py-0 lg:px-8 flex flex-col gap-12 ")}
        >
          <header
            className={cn(
              "flex items-center justify-between py-4 border-b border-gray-200",
            )}
          >
            <h2 className={cn("text-xl font-semibold text-gray-800")}>
              Course Weeks
            </h2>
            <NewWeekButton />
          </header>
          <div className={cn("flex-1 flex flex-col gap-6")}>
            {content.length > 0 ? (
              content.map((week) => <CourseWeek key={week.id} week={week} />)
            ) : (
              <section
                className={cn(
                  "flex items-center justify-center flex-1 text-gray-500",
                )}
              >
                <p className={cn("text-lg")}>No weeks found.</p>
              </section>
            )}
          </div>
        </main>
      </section>
    </>
  );
}
