"use client";

import { useQuery } from "@tanstack/react-query";
import { default as axios } from "axios";
import { useEffect, useState } from "react";

import { cn } from "~/lib/utils";
import { useUserContext } from "~/providers/user-provider";
import { paths } from "~/routes/paths";
import { CourseSection } from "./_components/course-section";
import { NewSectionButton } from "./_components/new-section-button";

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

export default function AdminPage() {
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
            <NewSectionButton newSectionOrder={content.length + 1} />
          </header>
          <div className={cn("flex-1 flex flex-col gap-6")}>
            {content.length > 0 ? (
              content.map((section) => (
                <CourseSection key={section.id} section={section} />
              ))
            ) : (
              <section
                className={cn(
                  "flex items-center justify-center flex-1 text-gray-500",
                )}
              >
                <p className={cn("text-lg")}>No sections found.</p>
              </section>
            )}
          </div>
        </main>
      </section>
    </>
  );
}
