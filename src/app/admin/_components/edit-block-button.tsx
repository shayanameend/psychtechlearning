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
import { UpdateBlockSchema } from "~/validators/block";

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

interface BlockUserNote {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Audio {
  id: string;
  title: string;
  audioLink: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Week {
  id: string;
  weekNumber: number;
  title: string;
  audios: Audio[];
  createdAt: Date;
  updatedAt: Date;
}

interface Block {
  id: string;
  blockOrder: number;
  blockTitle: string;
  blockDescription: string;
  guideLink: string;
  guideDescription: string;
  weeksDescription: string;
  flashcardsDescription: string;
  sampleTestDescription: string;
  finalTestDescription: string;
  weeks: Week[];
  flashcards: Flashcard[];
  sampleTestQuestions: TestQuestion[];
  finalTestQuestions: TestQuestion[];
  blockUserNotes: BlockUserNote[];
  createdAt: Date;
  updatedAt: Date;
}

const UpdateBlockFormSchema = UpdateBlockSchema;

export function EditBlockButton({ block }: Readonly<{ block: Block }>) {
  const queryClient = useQueryClient();

  const { token } = useUserContext();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const updateBlockform = useForm<zod.infer<typeof UpdateBlockFormSchema>>({
    resolver: zodResolver(UpdateBlockFormSchema),
    defaultValues: {
      blockOrder: block.blockOrder,
      blockTitle: block.blockTitle,
      blockDescription: block.blockDescription,
      guideLink: block.guideLink,
      guideDescription: block.guideDescription,
      weeksDescription: block.weeksDescription,
      flashcardsDescription: block.flashcardsDescription,
      sampleTestDescription: block.sampleTestDescription,
      finalTestDescription: block.finalTestDescription,
      weeks: block.weeks,
      flashcards: block.flashcards,
      sampleTestQuestions: block.sampleTestQuestions,
      finalTestQuestions: block.finalTestQuestions,
    },
  });

  useEffect(() => {
    updateBlockform.reset({
      blockOrder: block.blockOrder,
      blockTitle: block.blockTitle,
      blockDescription: block.blockDescription,
      guideLink: block.guideLink,
      guideDescription: block.guideDescription,
      weeksDescription: block.weeksDescription,
      flashcardsDescription: block.flashcardsDescription,
      sampleTestDescription: block.sampleTestDescription,
      finalTestDescription: block.finalTestDescription,
      weeks: block.weeks,
      flashcards: block.flashcards,
      sampleTestQuestions: block.sampleTestQuestions,
      finalTestQuestions: block.finalTestQuestions,
    });
  }, [updateBlockform.reset, block]);

  const updateBlockMutation = useMutation({
    mutationFn: async (data: zod.infer<typeof UpdateBlockFormSchema>) => {
      const response = await axios.put(
        paths.api.blocks.id.root({ id: block.id }),
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

      queryClient.invalidateQueries({ queryKey: ["blocks"] });

      setIsDialogOpen(false);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }
    },
    onSettled: () => {
      updateBlockform.reset();
    },
  });

  const onUpdateBlockSubmit = async (
    data: zod.infer<typeof UpdateBlockFormSchema>,
  ) => {
    updateBlockMutation.mutate(data);
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
        <Form {...updateBlockform}>
          <form
            onSubmit={updateBlockform.handleSubmit(onUpdateBlockSubmit)}
            className={cn("flex flex-col gap-6")}
          >
            <DialogHeader>
              <DialogTitle>Edit Block</DialogTitle>
            </DialogHeader>
            <main className={cn("flex flex-col gap-2")}>
              <div className={cn("flex gap-4")}>
                <FormField
                  control={updateBlockform.control}
                  name="blockOrder"
                  render={({ field }) => (
                    <FormItem className={cn("w-2/12")}>
                      <FormLabel>Block Order</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="1" type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateBlockform.control}
                  name="blockTitle"
                  render={({ field }) => (
                    <FormItem className={cn("w-2/12")}>
                      <FormLabel>Block Title</FormLabel>
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
                  control={updateBlockform.control}
                  name="blockDescription"
                  render={({ field }) => (
                    <FormItem className={cn("w-8/12")}>
                      <FormLabel>Block Description</FormLabel>
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
                  control={updateBlockform.control}
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
                  control={updateBlockform.control}
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
                  control={updateBlockform.control}
                  name="weeksDescription"
                  render={({ field }) => (
                    <FormItem className={cn("w-9/12")}>
                      <FormLabel>Weeks Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Complete weekly lessons covering nursing fundamentals and practices."
                          className={cn("resize-none min-h-14")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateBlockform.control}
                  name="weeks"
                  render={({ field }) => (
                    <FormItem className={cn("w-3/12")}>
                      <FormLabel>Weeks</FormLabel>
                      <FormControl>
                        <Input
                          onChange={(event) => {
                            updateBlockform.setValue(
                              "weeks",
                              Array.from({
                                length: Number(event.target.value),
                              }).map(() => ({
                                weekNumber: 0,
                                title: "",
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
                  control={updateBlockform.control}
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
                  control={updateBlockform.control}
                  name="flashcards"
                  render={({ field }) => (
                    <FormItem className={cn("w-3/12")}>
                      <FormLabel>Flashcards</FormLabel>
                      <FormControl>
                        <Input
                          onChange={(event) => {
                            updateBlockform.setValue(
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
                  control={updateBlockform.control}
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
                  control={updateBlockform.control}
                  name="sampleTestQuestions"
                  render={({ field }) => (
                    <FormItem className={cn("w-3/12")}>
                      <FormLabel>Sample Test Questions</FormLabel>
                      <FormControl>
                        <Input
                          onChange={(event) => {
                            updateBlockform.setValue(
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
                  control={updateBlockform.control}
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
                  control={updateBlockform.control}
                  name="finalTestQuestions"
                  render={({ field }) => (
                    <FormItem className={cn("w-3/12")}>
                      <FormLabel>Final Test Questions</FormLabel>
                      <FormControl>
                        <Input
                          onChange={(event) => {
                            updateBlockform.setValue(
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
                disabled={updateBlockMutation.isPending}
                variant="outline"
                size="sm"
                type="submit"
              >
                {updateBlockMutation.isPending && (
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
