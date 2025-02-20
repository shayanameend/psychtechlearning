"use client";

import { useQuery } from "@tanstack/react-query";
import { default as axios } from "axios";
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

interface SectionUserNote {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Section {
  id: string;
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

export default function DashboardPage() {
  const { token } = useUserContext();

  const { data: sectionsQueryResult, isSuccess: sectionsQueryIsSuccess } =
    useQuery({
      queryKey: ["sections"],
      queryFn: async () => {
        const response = await axios.get(paths.api.sections.root(), {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        return response.data as { data: { sections: Section[] } };
      },
    });

  const [content, setContent] = useState<Section[]>(
    sectionsQueryResult?.data.sections || [],
  );

  useEffect(() => {
    setContent(sectionsQueryResult?.data.sections || []);
  }, [sectionsQueryResult?.data.sections]);

  if (!sectionsQueryIsSuccess) {
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
              Course Sections
            </h2>
            <Button
              variant="default"
              size="sm"
              className={cn("flex items-center gap-2")}
            >
              <PlusIcon className={cn("w-4 h-4")} />
              <span>New Section</span>
            </Button>
          </header>
          <div className={cn("flex flex-col gap-6")}>
            {content.map((section) => (
              <section
                key={section.id}
                className={cn(
                  "flex flex-col gap-4 border border-gray-200 p-4 rounded-lg shadow-sm",
                )}
              >
                <header
                  className={cn(
                    "flex items-center justify-between border-b border-gray-200 pb-2",
                  )}
                >
                  <h3 className={cn("text-lg font-semibold text-gray-800")}>
                    {section.sectionTitle}
                  </h3>
                  <div className={cn("flex gap-2")}>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn("flex items-center gap-2")}
                    >
                      <EditIcon className={cn("w-4 h-4")} />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className={cn(
                        "size-9 flex items-center gap-2 border-destructive hover:bg-destructive text-destructive",
                      )}
                    >
                      <Trash2Icon className={cn("w-4 h-4")} />
                    </Button>
                  </div>
                </header>
                <div className={cn("flex flex-col gap-4")}>
                  {section.sectionDescription && (
                    <div className={cn("flex flex-col gap-2")}>
                      <Label className={cn("font-bold")}>
                        Section Description
                      </Label>
                      <p className={cn("text-sm text-gray-600")}>
                        {section.sectionDescription}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>
        </main>
      </section>
    </>
  );
}
