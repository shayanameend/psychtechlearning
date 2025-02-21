"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, default as axios } from "axios";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { default as zod } from "zod";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Steps } from "~/components/ui/steps";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { useUserContext } from "~/providers/user-provider";
import { paths } from "~/routes/paths";
import { CreateSectionSchema } from "~/validators/section";

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

const CreateSectionFormSchema = CreateSectionSchema;

export default function DashboardPage() {
  const { token } = useUserContext();

  const queryClient = useQueryClient();

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

  const form = useForm<zod.infer<typeof CreateSectionFormSchema>>({
    resolver: zodResolver(CreateSectionFormSchema),
    defaultValues: {
      sectionOrder: content.length + 1,
      sectionTitle: "Nursing Science",
      sectionDescription:
        "Learn about essential nursing skills, including how to take blood pressure, perform CPR, and more.",
      guideLabel: "Download the nursing science study guide.",
      guideLink: "https://drive.google.com/nursing.pdf",
      flashcardsLabel: "Review medication flashcards to reinforce learning.",
      sampleTestLabel: "Test your knowledge with sample questions.",
      finalTestLabel: "Take a test to assess your knowledge.",
      flashcards: [],
      sampleTestQuestions: [],
      finalTestQuestions: [],
    },
  });

  const createSectionMutation = useMutation({
    mutationFn: async (data: zod.infer<typeof CreateSectionFormSchema>) => {
      const response = await axios.post(paths.api.sections.root(), data, {
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
    onSettled: () => {
      form.reset();
    },
  });

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

  const onCreateSectionSubmit = async (
    data: zod.infer<typeof CreateSectionFormSchema>,
  ) => {
    createSectionMutation.mutate(data);
  };

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
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  className={cn("flex items-center gap-2")}
                >
                  <PlusIcon className={cn("w-4 h-4")} />
                  <span>New Section</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[512px] lg:max-w-[768px]">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onCreateSectionSubmit)}
                    className={cn("flex flex-col gap-6")}
                  >
                    <DialogHeader>
                      <DialogTitle>New Section</DialogTitle>
                    </DialogHeader>
                    <main className={cn("flex flex-col gap-2")}>
                      <div
                        className={cn("flex gap-4 flex-row-reverse-reverse")}
                      >
                        <FormField
                          control={form.control}
                          name="sectionTitle"
                          render={({ field }) => (
                            <FormItem className={cn("w-2/6")}>
                              <FormLabel>Section Title</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Nursing Science"
                                  type="text"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="sectionDescription"
                          render={({ field }) => (
                            <FormItem className={cn("w-4/6")}>
                              <FormLabel>Section Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="Learn about essential nursing skills, including how to take blood pressure, perform CPR, and more."
                                  className={cn("resize-none min-h-14")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className={cn("flex gap-4 flex-row-reverse")}>
                        <FormField
                          control={form.control}
                          name="guideLabel"
                          render={({ field }) => (
                            <FormItem className={cn("w-4/6")}>
                              <FormLabel>Guide Label</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="Download the nursing science study guide."
                                  className={cn("resize-none min-h-14")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="guideLink"
                          render={({ field }) => (
                            <FormItem className={cn("w-2/6")}>
                              <FormLabel>Guide Link</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="https://drive.google.com/nursing.pdf"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className={cn("flex gap-4 flex-row-reverse")}>
                        <FormField
                          control={form.control}
                          name="flashcardsLabel"
                          render={({ field }) => (
                            <FormItem className={cn("w-4/6")}>
                              <FormLabel>Flashcards Label</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="Review medication flashcards to reinforce learning."
                                  className={cn("resize-none min-h-14")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="flashcards"
                          render={({ field }) => (
                            <FormItem className={cn("w-2/6")}>
                              <FormLabel>Flashcards</FormLabel>
                              <FormControl>
                                <Input
                                  onChange={(event) => {
                                    form.setValue(
                                      "flashcards",
                                      Array.from({
                                        length: Number(event.target.value),
                                      }).map(() => ({
                                        question: "",
                                        answer: "",
                                      })),
                                    );
                                  }}
                                  value={field.value.length}
                                  type="text"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className={cn("flex gap-4 flex-row-reverse")}>
                        <FormField
                          control={form.control}
                          name="sampleTestLabel"
                          render={({ field }) => (
                            <FormItem className={cn("w-4/6")}>
                              <FormLabel>Sample Test Label</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="Test your knowledge with sample questions."
                                  className={cn("resize-none min-h-14")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="sampleTestQuestions"
                          render={({ field }) => (
                            <FormItem className={cn("w-2/6")}>
                              <FormLabel>Sample Test Questions</FormLabel>
                              <FormControl>
                                <Input
                                  onChange={(event) => {
                                    form.setValue(
                                      "sampleTestQuestions",
                                      Array.from({
                                        length: Number(event.target.value),
                                      }).map(() => ({
                                        question: "",
                                        answers: ["", "", "", ""],
                                        correctAnswer: "",
                                      })),
                                    );
                                  }}
                                  value={field.value.length}
                                  type="text"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className={cn("flex gap-4 flex-row-reverse")}>
                        <FormField
                          control={form.control}
                          name="finalTestLabel"
                          render={({ field }) => (
                            <FormItem className={cn("w-4/6")}>
                              <FormLabel>Final Test Label</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="Take a test to assess your knowledge."
                                  className={cn("resize-none min-h-14")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="finalTestQuestions"
                          render={({ field }) => (
                            <FormItem className={cn("w-2/6")}>
                              <FormLabel>Final Test Questions</FormLabel>
                              <FormControl>
                                <Input
                                  onChange={(event) => {
                                    form.setValue(
                                      "finalTestQuestions",
                                      Array.from({
                                        length: Number(event.target.value),
                                      }).map(() => ({
                                        question: "",
                                        answers: ["", "", "", ""],
                                        correctAnswer: "",
                                      })),
                                    );
                                  }}
                                  value={field.value.length}
                                  type="text"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </main>
                    <DialogFooter>
                      <Button
                        onClick={() => {
                          form.setValue("sectionOrder", content.length + 1);
                        }}
                        variant="outline"
                        size="sm"
                        type="submit"
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </header>
          <div className={cn("flex-1 flex flex-col gap-6")}>
            {content.length > 0 ? (
              content.map((section) => (
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
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn("flex items-center gap-2")}
                      >
                        <EditIcon className={cn("w-4 h-4")} />
                        <span>Edit</span>
                      </Button>
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
                  </article>
                </section>
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
