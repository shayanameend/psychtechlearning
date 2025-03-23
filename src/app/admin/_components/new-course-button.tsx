"use client";

import type { default as zod } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, default as axios } from "axios";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { useState } from "react";
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
import { CreateCourseSchema } from "~/validators/course";

const CreateCourseFormSchema = CreateCourseSchema;

export function NewCourseButton() {
  const queryClient = useQueryClient();

  const { token } = useUserContext();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const createCourseform = useForm<zod.infer<typeof CreateCourseFormSchema>>({
    resolver: zodResolver(CreateCourseFormSchema),
    defaultValues: {
      courseOrder: 0,
      courseTitle: "",
      courseDescription: "",
      guideLink: "",
      guideDescription: "",
      audioLink: "",
      audioDescription: "",
      flashcardsDescription: "",
      sampleTestDescription: "",
      finalTestDescription: "",
      flashcards: [],
      sampleTestQuestions: [],
      finalTestQuestions: [],
    },
  });

  const createCourseMutation = useMutation({
    mutationFn: async (data: zod.infer<typeof CreateCourseFormSchema>) => {
      const response = await axios.post(paths.api.courses.root(), data, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

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
      createCourseform.reset();
    },
  });

  const onCreateCourseSubmit = async (
    data: zod.infer<typeof CreateCourseFormSchema>,
  ) => {
    createCourseMutation.mutate(data);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className={cn("flex items-center gap-2")}
        >
          <PlusIcon className={cn("w-4 h-4")} />
          <span>New Course</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[512px] lg:max-w-[768px]">
        <Form {...createCourseform}>
          <form
            onSubmit={createCourseform.handleSubmit(onCreateCourseSubmit)}
            className={cn("flex flex-col gap-6")}
          >
            <DialogHeader>
              <DialogTitle>New Course</DialogTitle>
            </DialogHeader>
            <main className={cn("flex flex-col gap-2")}>
              <div className={cn("flex gap-4")}>
                <FormField
                  control={createCourseform.control}
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
                  control={createCourseform.control}
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
                  control={createCourseform.control}
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
                  control={createCourseform.control}
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
                  control={createCourseform.control}
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
                  control={createCourseform.control}
                  name="audioDescription"
                  render={({ field }) => (
                    <FormItem className={cn("w-9/12")}>
                      <FormLabel>Audio Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Listen to nursing science audio lectures."
                          className={cn("resize-none min-h-14")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createCourseform.control}
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
                  control={createCourseform.control}
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
                  control={createCourseform.control}
                  name="flashcards"
                  render={({ field }) => (
                    <FormItem className={cn("w-3/12")}>
                      <FormLabel>Flashcards</FormLabel>
                      <FormControl>
                        <Input
                          onChange={(event) => {
                            createCourseform.setValue(
                              "flashcards",
                              Array.from({
                                length: Number(event.target.value),
                              }).map((_, index) => ({
                                question: `Question ${index + 1}`,
                                answer: `Answer ${index + 1}`,
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
                  control={createCourseform.control}
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
                  control={createCourseform.control}
                  name="sampleTestQuestions"
                  render={({ field }) => (
                    <FormItem className={cn("w-3/12")}>
                      <FormLabel>Sample Test Questions</FormLabel>
                      <FormControl>
                        <Input
                          onChange={(event) => {
                            createCourseform.setValue(
                              "sampleTestQuestions",
                              Array.from({
                                length: Number(event.target.value),
                              }).map((_, index) => ({
                                question: `Question ${index + 1}`,
                                answers: [
                                  "Option 1",
                                  "Option 2",
                                  "Option 3",
                                  "Option 4",
                                ],
                                correctAnswer: "Option 1",
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
                  control={createCourseform.control}
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
                  control={createCourseform.control}
                  name="finalTestQuestions"
                  render={({ field }) => (
                    <FormItem className={cn("w-3/12")}>
                      <FormLabel>Final Test Questions</FormLabel>
                      <FormControl>
                        <Input
                          onChange={(event) => {
                            createCourseform.setValue(
                              "finalTestQuestions",
                              Array.from({
                                length: Number(event.target.value),
                              }).map((_, index) => ({
                                question: `Question ${index + 1}`,
                                answers: [
                                  "Option 1",
                                  "Option 2",
                                  "Option 3",
                                  "Option 4",
                                ],
                                correctAnswer: "Option 1",
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
                disabled={createCourseMutation.isPending}
                variant="outline"
                size="sm"
                type="submit"
              >
                {createCourseMutation.isPending && (
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
