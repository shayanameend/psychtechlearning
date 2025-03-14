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
import { UpdateWeekSchema } from "~/validators/week";

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

const UpdateWeekFormSchema = UpdateWeekSchema;

export function EditWeekButton({ week }: Readonly<{ week: Week }>) {
  const queryClient = useQueryClient();

  const { token } = useUserContext();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const updateWeekform = useForm<zod.infer<typeof UpdateWeekFormSchema>>({
    resolver: zodResolver(UpdateWeekFormSchema),
    defaultValues: {
      weekOrder: week.weekOrder,
      weekTitle: week.weekTitle,
      weekDescription: week.weekDescription,
      guideLink: week.guideLink,
      guideDescription: week.guideDescription,
      audioLink: week.audioLink,
      audioDescription: week.audioDescription,
      flashcardsDescription: week.flashcardsDescription,
      sampleTestDescription: week.sampleTestDescription,
      finalTestDescription: week.finalTestDescription,
      flashcards: week.flashcards,
      sampleTestQuestions: week.sampleTestQuestions,
      finalTestQuestions: week.finalTestQuestions,
    },
  });

  useEffect(() => {
    updateWeekform.reset({
      weekOrder: week.weekOrder,
      weekTitle: week.weekTitle,
      weekDescription: week.weekDescription,
      guideLink: week.guideLink,
      guideDescription: week.guideDescription,
      audioLink: week.audioLink,
      audioDescription: week.audioDescription,
      flashcardsDescription: week.flashcardsDescription,
      sampleTestDescription: week.sampleTestDescription,
      finalTestDescription: week.finalTestDescription,
      flashcards: week.flashcards,
      sampleTestQuestions: week.sampleTestQuestions,
      finalTestQuestions: week.finalTestQuestions,
    });
  }, [updateWeekform.reset, week]);

  const updateWeekMutation = useMutation({
    mutationFn: async (data: zod.infer<typeof UpdateWeekFormSchema>) => {
      const response = await axios.put(
        paths.api.weeks.id.root({ id: week.id }),
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

      queryClient.invalidateQueries({ queryKey: ["weeks"] });

      setIsDialogOpen(false);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }
    },
    onSettled: () => {
      updateWeekform.reset();
    },
  });

  const onUpdateWeekSubmit = async (
    data: zod.infer<typeof UpdateWeekFormSchema>,
  ) => {
    updateWeekMutation.mutate(data);
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
        <Form {...updateWeekform}>
          <form
            onSubmit={updateWeekform.handleSubmit(onUpdateWeekSubmit)}
            className={cn("flex flex-col gap-6")}
          >
            <DialogHeader>
              <DialogTitle>Edit Week</DialogTitle>
            </DialogHeader>
            <main className={cn("flex flex-col gap-2")}>
              <div className={cn("flex gap-4")}>
                <FormField
                  control={updateWeekform.control}
                  name="weekOrder"
                  render={({ field }) => (
                    <FormItem className={cn("w-2/12")}>
                      <FormLabel>Week Order</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="1" type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateWeekform.control}
                  name="weekTitle"
                  render={({ field }) => (
                    <FormItem className={cn("w-2/12")}>
                      <FormLabel>Week Title</FormLabel>
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
                  control={updateWeekform.control}
                  name="weekDescription"
                  render={({ field }) => (
                    <FormItem className={cn("w-8/12")}>
                      <FormLabel>Week Description</FormLabel>
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
                  control={updateWeekform.control}
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
                  control={updateWeekform.control}
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
                  control={updateWeekform.control}
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
                  control={updateWeekform.control}
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
                  control={updateWeekform.control}
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
                  control={updateWeekform.control}
                  name="flashcards"
                  render={({ field }) => (
                    <FormItem className={cn("w-3/12")}>
                      <FormLabel>Flashcards</FormLabel>
                      <FormControl>
                        <Input
                          onChange={(event) => {
                            updateWeekform.setValue(
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
                  control={updateWeekform.control}
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
                  control={updateWeekform.control}
                  name="sampleTestQuestions"
                  render={({ field }) => (
                    <FormItem className={cn("w-3/12")}>
                      <FormLabel>Sample Test Questions</FormLabel>
                      <FormControl>
                        <Input
                          onChange={(event) => {
                            updateWeekform.setValue(
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
                  control={updateWeekform.control}
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
                  control={updateWeekform.control}
                  name="finalTestQuestions"
                  render={({ field }) => (
                    <FormItem className={cn("w-3/12")}>
                      <FormLabel>Final Test Questions</FormLabel>
                      <FormControl>
                        <Input
                          onChange={(event) => {
                            updateWeekform.setValue(
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
                disabled={updateWeekMutation.isPending}
                variant="outline"
                size="sm"
                type="submit"
              >
                {updateWeekMutation.isPending && (
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
