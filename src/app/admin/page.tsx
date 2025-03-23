"use client";

import { useQuery } from "@tanstack/react-query";
import { default as axios } from "axios";
import { useEffect, useState } from "react";

import { cn } from "~/lib/utils";
import { useUserContext } from "~/providers/user-provider";
import { paths } from "~/routes/paths";
import { Course } from "./_components/course";
import { NewCourseButton } from "./_components/new-course-button";

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

interface CourseUserNote {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Course {
  id: string;
  courseOrder: number;
  courseTitle: string;
  courseDescription: string;
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
  courseUserNotes: CourseUserNote[];
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminPage() {
  const { token } = useUserContext();

  const { data: coursesQueryResult, isSuccess: coursesQueryIsSuccess } =
    useQuery({
      queryKey: ["courses"],
      queryFn: async () => {
        const response = await axios.get(paths.api.courses.root(), {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        return response.data as { data: { courses: Course[] } };
      },
    });

  const [content, setContent] = useState<Course[]>(
    coursesQueryResult?.data.courses || [],
  );

  useEffect(() => {
    setContent(coursesQueryResult?.data.courses || []);
  }, [coursesQueryResult?.data.courses]);

  if (!coursesQueryIsSuccess) {
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
              Courses
            </h2>
            <NewCourseButton />
          </header>
          <div className={cn("flex-1 grid gap-6 grid-cols-1 lg:grid-cols-2")}>
            {content.length > 0 ? (
              content.map((course) => (
                <Course key={course.id} course={course} />
              ))
            ) : (
              <section
                className={cn(
                  "flex items-center justify-center col-span-full h-40 text-gray-500",
                )}
              >
                <p className={cn("text-lg")}>No courses found.</p>
              </section>
            )}
          </div>
        </main>
      </section>
    </>
  );
}
