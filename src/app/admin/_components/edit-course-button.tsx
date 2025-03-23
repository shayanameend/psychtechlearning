"use client";

import type { default as zod } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, default as axios } from "axios";
import { EditIcon, Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { useUserContext } from "~/providers/user-provider";
import { paths } from "~/routes/paths";
import { UpdateCourseSchema } from "~/validators/course";

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

const UpdateCourseFormSchema = UpdateCourseSchema;

export function EditCourseButton({ course }: Readonly<{ course: Course }>) {
  const queryClient = useQueryClient();

  const { token } = useUserContext();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const updateCourseform = useForm<zod.infer<typeof UpdateCourseFormSchema>>({
    resolver: zodResolver(UpdateCourseFormSchema),
    defaultValues: {
      courseOrder: course.courseOrder,
      courseTitle: course.courseTitle,
      courseDescription: course.courseDescription,
      guideLink: course.guideLink,
      guideDescription: course.guideDescription,
      audioLink: course.audioLink,
      audioDescription: course.audioDescription,
      flashcardsDescription: course.flashcardsDescription,
      sampleTestDescription: course.sampleTestDescription,
      finalTestDescription: course.finalTestDescription,
      flashcards: course.flashcards,
      sampleTestQuestions: course.sampleTestQuestions,
      finalTestQuestions: course.finalTestQuestions,
    },
  });

  useEffect(() => {
    updateCourseform.reset({
      courseOrder: course.courseOrder,
      courseTitle: course.courseTitle,
      courseDescription: course.courseDescription,
      guideLink: course.guideLink,
      guideDescription: course.guideDescription,
      audioLink: course.audioLink,
      audioDescription: course.audioDescription,
      flashcardsDescription: course.flashcardsDescription,
      sampleTestDescription: course.sampleTestDescription,
      finalTestDescription: course.finalTestDescription,
      flashcards: course.flashcards,
      sampleTestQuestions: course.sampleTestQuestions,
      finalTestQuestions: course.finalTestQuestions,
    });
  }, [updateCourseform.reset, course]);

  const updateCourseMutation = useMutation({
    mutationFn: async (data: zod.infer<typeof UpdateCourseFormSchema>) => {
      const response = await axios.put(
        paths.api.courses.id.root({ id: course.id }),
        data,
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

      queryClient.invalidateQueries({ queryKey: ["courses"] });

      setIsDialogOpen(false);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }
    },
    onSettled: () => {
      updateCourseform.reset();
    },
  });

  const onUpdateCourseSubmit = async (
    data: zod.infer<typeof UpdateCourseFormSchema>,
  ) => {
    updateCourseMutation.mutate(data);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className={cn("flex items-center gap-2")}
        >
          <EditIcon className={cn("w-4 h-4")} />
          <span>Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[512px] lg:max-w-[768px]">
        <Form {...updateCourseform}>
          <form
            onSubmit={updateCourseform.handleSubmit(onUpdateCourseSubmit)}
            className={cn("flex flex-col gap-6")}
          >
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
            </DialogHeader>
            <main className={cn("flex flex-col gap-2")}>
              <div className={cn("flex gap-4")}>
                <FormField
                  control={updateCourseform.control}
                  name="courseOrder"
                  render={({ field }) => (
                    <FormItem className={cn("w-2/12")}>
                      <FormLabel>Course Order</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="1" type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateCourseform.control}
                  name="courseTitle"
                  render={({ field }) => (
                    <FormItem className={cn("w-2/12")}>
                      <FormLabel>Course Title</FormLabel>
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
                  control={updateCourseform.control}
                  name="courseDescription"
                  render={({ field }) => (
                    <FormItem className={cn("w-8/12")}>
                      <FormLabel>Course Description</FormLabel>
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
                  control={updateCourseform.control}
                  name="guideDescription"
                  render={({ field }) => (
                    <FormItem className={cn("w-9/12")}>
                      <FormLabel>Guide Description</FormLabel>
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
                  control={updateCourseform.control}
                  name="guideLink"
                  render={({ field }) => (
                    <FormItem className={cn("w-3/12")}>
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
                  control={updateCourseform.control}
                  name="audioDescription"
                  render={({ field }) => (
                    <FormItem className={cn("w-9/12")}>
                      <FormLabel>Audio Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Listen to the nursing science audio guide."
                          className={cn("resize-none min-h-14")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateCourseform.control}
                  name="audioLink"
                  render={({ field }) => (
                    <FormItem className={cn("w-3/12")}>
                      <FormLabel>Audio Link</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://drive.google.com/nursing.mp3"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className={cn("flex gap-4 flex-row-reverse")}>
                <FormField
                  control={updateCourseform.control}
                  name="flashcardsDescription"
                  render={({ field }) => (
                    <FormItem className={cn("w-9/12")}>
                      <FormLabel>Flashcards Description</FormLabel>
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
                  control={updateCourseform.control}
                  name="flashcards"
                  render={({ field }) => (
                    <FormItem className={cn("w-3/12")}>
                      <FormLabel>Flashcards</FormLabel>
                      <FormControl>
                        <Input
                          onChange={(event) => {
                            updateCourseform.setValue(
                              "flashcards",
                              Array.from({
                                length: Number(event.target.value),
                              }).map(() => ({
                                question: "",
                                answer: "",
                              })),
                            );
                          }}
                          disabled={true}
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
                  control={updateCourseform.control}
                  name="sampleTestDescription"
                  render={({ field }) => (
                    <FormItem className={cn("w-9/12")}>
                      <FormLabel>Sample Test Description</FormLabel>
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
                  control={updateCourseform.control}
                  name="sampleTestQuestions"
                  render={({ field }) => (
                    <FormItem className={cn("w-3/12")}>
                      <FormLabel>Sample Test Questions</FormLabel>
                      <FormControl>
                        <Input
                          onChange={(event) => {
                            updateCourseform.setValue(
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
                          disabled={true}
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
                  control={updateCourseform.control}
                  name="finalTestDescription"
                  render={({ field }) => (
                    <FormItem className={cn("w-9/12")}>
                      <FormLabel>Final Test Description</FormLabel>
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
                  control={updateCourseform.control}
                  name="finalTestQuestions"
                  render={({ field }) => (
                    <FormItem className={cn("w-3/12")}>
                      <FormLabel>Final Test Questions</FormLabel>
                      <FormControl>
                        <Input
                          onChange={(event) => {
                            updateCourseform.setValue(
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
                          disabled={true}
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
                disabled={updateCourseMutation.isPending}
                variant="outline"
                size="sm"
                type="submit"
              >
                {updateCourseMutation.isPending && (
                  <Loader2Icon className={cn("animate-spin")} />
                )}
                <span>Save</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
