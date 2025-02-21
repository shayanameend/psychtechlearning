import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, default as axios } from "axios";
import { toast } from "sonner";

import { Trash2Icon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { useUserContext } from "~/providers/user-provider";
import { paths } from "~/routes/paths";
import { EditSectionButton } from "./edit-section-button";

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

export function CourseSection({ section }: Readonly<{ section: Section }>) {
  const queryClient = useQueryClient();

  const { token } = useUserContext();

  const deleteSectionMutation = useMutation({
    mutationFn: async (sectionId: string) => {
      const response = await axios.delete(paths.api.sections.id(sectionId), {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
    onSuccess: ({ info }) => {
      toast.success(info.message);

      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }
    },
  });

  return (
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
          {section.sectionOrder}. {section.sectionTitle}
        </h3>
        <div className={cn("flex gap-2")}>
          <EditSectionButton section={section} />
          <Button
            onClick={() => {
              deleteSectionMutation.mutate(section.id);
            }}
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
      <article className={cn("flex flex-col gap-4")}>
        <div className={cn("flex flex-col gap-2")}>
          <Label className={cn("font-bold")}>Section Description</Label>
          <p className={cn("text-sm text-gray-600")}>
            {section.sectionDescription}
          </p>
        </div>
        <div className={cn("flex flex-col gap-2")}>
          <Label className={cn("font-bold")}>Study Guide</Label>
          <a
            href={section.guideLink}
            target="_blank"
            rel="noopener noreferrer"
            className={cn("text-sm text-blue-600")}
          >
            {section.guideLabel}
          </a>
        </div>
        <div className={cn("flex gap-4 justify-between")}>
          <div className={cn("flex flex-col gap-2")}>
            <Label className={cn("font-bold")}>Flashcards</Label>
            <p className={cn("text-sm text-gray-600")}>
              {section.flashcardsLabel}
            </p>
          </div>
          <div>
            <Button variant="outline" size="sm">
              View
            </Button>
          </div>
        </div>
        <div className={cn("flex gap-4 justify-between")}>
          <div className={cn("flex flex-col gap-2")}>
            <Label className={cn("font-bold")}>Sample Test</Label>
            <p className={cn("text-sm text-gray-600")}>
              {section.sampleTestLabel}
            </p>
          </div>
          <div>
            <Button variant="outline" size="sm">
              View
            </Button>
          </div>
        </div>
        <div className={cn("flex gap-4 justify-between")}>
          <div className={cn("flex flex-col gap-2")}>
            <Label className={cn("font-bold")}>Final Test</Label>
            <p className={cn("text-sm text-gray-600")}>
              {section.finalTestLabel}
            </p>
          </div>
          <div>
            <Button variant="outline" size="sm">
              View
            </Button>
          </div>
        </div>
      </article>
    </section>
  );
}
