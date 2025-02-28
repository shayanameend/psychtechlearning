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
import { CreateSectionSchema } from "~/validators/section";

const CreateSectionFormSchema = CreateSectionSchema;

export function NewSectionButton() {
  const queryClient = useQueryClient();

  const { token } = useUserContext();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const createSectionform = useForm<zod.infer<typeof CreateSectionFormSchema>>({
    resolver: zodResolver(CreateSectionFormSchema),
    defaultValues: {
      sectionOrder: 0,
      sectionTitle: "",
      sectionDescription: "",
      guideLabel: "",
      guideLink: "",
      flashcardsLabel: "",
      sampleTestLabel: "",
      finalTestLabel: "",
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

      setIsDialogOpen(false);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }
    },
    onSettled: () => {
      createSectionform.reset();
    },
  });

  const onCreateSectionSubmit = async (
    data: zod.infer<typeof CreateSectionFormSchema>,
  ) => {
    createSectionMutation.mutate(data);
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
          <span>New Section</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[512px] lg:max-w-[768px]">
        <Form {...createSectionform}>
          <form
            onSubmit={createSectionform.handleSubmit(onCreateSectionSubmit)}
            className={cn("flex flex-col gap-6")}
          >
            <DialogHeader>
              <DialogTitle>New Section</DialogTitle>
            </DialogHeader>
            <main className={cn("flex flex-col gap-2")}>
              <div className={cn("flex gap-4")}>
                <FormField
                  control={createSectionform.control}
                  name="sectionOrder"
                  render={({ field }) => (
                    <FormItem className={cn("w-2/12")}>
                      <FormLabel>Section Order</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="1" type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createSectionform.control}
                  name="sectionTitle"
                  render={({ field }) => (
                    <FormItem className={cn("w-2/12")}>
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
                  control={createSectionform.control}
                  name="sectionDescription"
                  render={({ field }) => (
                    <FormItem className={cn("w-8/12")}>
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
                  control={createSectionform.control}
                  name="guideLabel"
                  render={({ field }) => (
                    <FormItem className={cn("w-9/12")}>
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
                  control={createSectionform.control}
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
                  control={createSectionform.control}
                  name="flashcardsLabel"
                  render={({ field }) => (
                    <FormItem className={cn("w-9/12")}>
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
                  control={createSectionform.control}
                  name="flashcards"
                  render={({ field }) => (
                    <FormItem className={cn("w-3/12")}>
                      <FormLabel>Flashcards</FormLabel>
                      <FormControl>
                        <Input
                          onChange={(event) => {
                            createSectionform.setValue(
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
                  control={createSectionform.control}
                  name="sampleTestLabel"
                  render={({ field }) => (
                    <FormItem className={cn("w-9/12")}>
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
                  control={createSectionform.control}
                  name="sampleTestQuestions"
                  render={({ field }) => (
                    <FormItem className={cn("w-3/12")}>
                      <FormLabel>Sample Test Questions</FormLabel>
                      <FormControl>
                        <Input
                          onChange={(event) => {
                            createSectionform.setValue(
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
                  control={createSectionform.control}
                  name="finalTestLabel"
                  render={({ field }) => (
                    <FormItem className={cn("w-9/12")}>
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
                  control={createSectionform.control}
                  name="finalTestQuestions"
                  render={({ field }) => (
                    <FormItem className={cn("w-3/12")}>
                      <FormLabel>Final Test Questions</FormLabel>
                      <FormControl>
                        <Input
                          onChange={(event) => {
                            createSectionform.setValue(
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
                disabled={createSectionMutation.isPending}
                variant="outline"
                size="sm"
                type="submit"
              >
                {createSectionMutation.isPending && (
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
