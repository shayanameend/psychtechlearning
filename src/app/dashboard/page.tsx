"use client";

import { useQuery } from "@tanstack/react-query";
import { default as axios } from "axios";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { CourseWeek } from "~/app/dashboard/_components/course-week";
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

export default function DashboardPage() {
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

  const [currentStep, setCurrentStep] = useState(1);
  const [content, setContent] = useState<Week | undefined>(
    weeksQueryResult?.data.weeks[currentStep - 1],
  );
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    setContent(weeksQueryResult?.data.weeks[currentStep - 1]);
  }, [currentStep, weeksQueryResult?.data.weeks[currentStep - 1]]);

  const steps = Array.from(
    { length: weeksQueryResult?.data.weeks.length || 0 },
    (_, index) => index + 1,
  );

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
          {weeksQueryResult.data.weeks.length > 1 && (
            <Steps steps={steps} currentStep={currentStep} />
          )}
        </aside>
        <main className={cn("flex-1 py-4 lg:py-0 lg:px-8 flex flex-col gap-6")}>
          {weeksQueryResult.data.weeks.length > 0 && content ? (
            <CourseWeek week={content} showNotes={showNotes} />
          ) : (
            <section className={cn("flex-1 flex justify-center items-center")}>
              <p className={cn("text-gray-600 text-sm")}>
                No weeks available, Please check back later!
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
                disabled={steps.length === 0 || currentStep === steps.length}
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
