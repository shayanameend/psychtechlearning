"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { EditIcon, Loader2Icon, Trash2Icon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";
import { useUserContext } from "~/providers/user-provider";
import { paths } from "~/routes/paths";
import type {
  AudioType,
  BlockType,
  FlashcardType,
  PresentationType,
  TestQuestionType,
  WeekType,
} from "~/types/block";

type NewWeekType = Omit<Omit<Omit<WeekType, "updatedAt">, "createdAt">, "id">;
type NewPresentationType = Omit<
  Omit<Omit<PresentationType, "updatedAt">, "createdAt">,
  "id"
>;
type NewAudioType = Omit<Omit<Omit<AudioType, "updatedAt">, "createdAt">, "id">;
type NewFlashcardType = Omit<
  Omit<Omit<FlashcardType, "updatedAt">, "createdAt">,
  "id"
>;
type NewTestQuestionType = Omit<
  Omit<Omit<TestQuestionType, "updatedAt">, "createdAt">,
  "id"
>;

export default function WeeksManagementPage() {
  const params = useParams();
  const blockId = params.id as string;
  const queryClient = useQueryClient();
  const { token } = useUserContext();

  const [activeTab, setActiveTab] = useState("week-details");

  const [weekIndex, setWeekIndex] = useState(0);
  const [weeks, setWeeks] = useState<WeekType[]>([]);
  const [deletedWeeks, setDeletedWeeks] = useState<string[]>([]);
  const [newWeeks, setNewWeeks] = useState<NewWeekType[]>([]);

  // Fields for editing
  const [weekNumberEditing, setWeekNumberEditing] = useState(false);
  const [weekNumber, setWeekNumber] = useState(0);
  const [weekTitleEditing, setWeekTitleEditing] = useState(false);
  const [weekTitle, setWeekTitle] = useState("");

  // Presentations
  const [presentations, setPresentations] = useState<PresentationType[]>([]);
  const [deletedPresentations, setDeletedPresentations] = useState<string[]>(
    [],
  );
  const [newPresentations, setNewPresentations] = useState<
    NewPresentationType[]
  >([]);
  const [presentationIndex, setPresentationIndex] = useState(0);
  const [presentationTitleEditing, setPresentationTitleEditing] =
    useState(false);
  const [presentationTitle, setPresentationTitle] = useState("");
  const [presentationLinkEditing, setPresentationLinkEditing] = useState(false);
  const [presentationLink, setPresentationLink] = useState("");

  // Audios
  const [audios, setAudios] = useState<AudioType[]>([]);
  const [deletedAudios, setDeletedAudios] = useState<string[]>([]);
  const [newAudios, setNewAudios] = useState<NewAudioType[]>([]);
  const [audioIndex, setAudioIndex] = useState(0);
  const [audioTitleEditing, setAudioTitleEditing] = useState(false);
  const [audioTitle, setAudioTitle] = useState("");
  const [audioLinkEditing, setAudioLinkEditing] = useState(false);
  const [audioLink, setAudioLink] = useState("");

  // Flashcards
  const [flashcards, setFlashcards] = useState<FlashcardType[]>([]);
  const [deletedFlashcards, setDeletedFlashcards] = useState<string[]>([]);
  const [newFlashcards, setNewFlashcards] = useState<NewFlashcardType[]>([]);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardQuestionEditing, setFlashcardQuestionEditing] =
    useState(false);
  const [flashcardQuestion, setFlashcardQuestion] = useState("");
  const [flashcardAnswerEditing, setFlashcardAnswerEditing] = useState(false);
  const [flashcardAnswer, setFlashcardAnswer] = useState("");

  // Sample Test Questions
  const [sampleTestQuestions, setSampleTestQuestions] = useState<
    TestQuestionType[]
  >([]);
  const [deletedSampleTestQuestions, setDeletedSampleTestQuestions] = useState<
    string[]
  >([]);
  const [newSampleTestQuestions, setNewSampleTestQuestions] = useState<
    NewTestQuestionType[]
  >([]);
  const [sampleTestQuestionIndex, setSampleTestQuestionIndex] = useState(0);
  const [sampleTestQuestionEditing, setSampleTestQuestionEditing] =
    useState(false);
  const [sampleTestQuestion, setSampleTestQuestion] = useState("");
  const [sampleTestAnswersEditing, setSampleTestAnswersEditing] =
    useState(false);
  const [sampleTestAnswers, setSampleTestAnswers] = useState<string[]>([]);
  const [sampleTestCorrectAnswerEditing, setSampleTestCorrectAnswerEditing] =
    useState(false);
  const [sampleTestCorrectAnswer, setSampleTestCorrectAnswer] = useState("");

  // Final Test Questions
  const [finalTestQuestions, setFinalTestQuestions] = useState<
    TestQuestionType[]
  >([]);
  const [deletedFinalTestQuestions, setDeletedFinalTestQuestions] = useState<
    string[]
  >([]);
  const [newFinalTestQuestions, setNewFinalTestQuestions] = useState<
    NewTestQuestionType[]
  >([]);
  const [finalTestQuestionIndex, setFinalTestQuestionIndex] = useState(0);
  const [finalTestQuestionEditing, setFinalTestQuestionEditing] =
    useState(false);
  const [finalTestQuestion, setFinalTestQuestion] = useState("");
  const [finalTestAnswersEditing, setFinalTestAnswersEditing] = useState(false);
  const [finalTestAnswers, setFinalTestAnswers] = useState<string[]>([]);
  const [finalTestCorrectAnswerEditing, setFinalTestCorrectAnswerEditing] =
    useState(false);
  const [finalTestCorrectAnswer, setFinalTestCorrectAnswer] = useState("");

  // Fetch block data
  const { data: blockQueryResult, isPending: blockQueryIsPending } = useQuery({
    queryKey: ["block", blockId],
    queryFn: async () => {
      const response = await axios.get(
        paths.api.blocks.id.root({ id: blockId }),
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data as { data: { block: BlockType } };
    },
  });

  // Initialize data when block is loaded
  useEffect(() => {
    if (blockQueryResult?.data.block) {
      setWeeks(blockQueryResult?.data.block.weeks);
      setDeletedWeeks([]);
      setNewWeeks([]);
      setWeekIndex(0);

      if (blockQueryResult?.data.block.weeks.length > 0) {
        setPresentations(
          blockQueryResult?.data.block.weeks[0].presentations || [],
        );
        setAudios(blockQueryResult?.data.block.weeks[0].audios || []);
        setFlashcards(blockQueryResult?.data.block.weeks[0].flashcards || []);
        setSampleTestQuestions(
          blockQueryResult?.data.block.weeks[0].sampleTestQuestions || [],
        );
        setFinalTestQuestions(
          blockQueryResult?.data.block.weeks[0].finalTestQuestions || [],
        );
      } else {
        setPresentations([]);
        setAudios([]);
        setFlashcards([]);
        setSampleTestQuestions([]);
        setFinalTestQuestions([]);
      }

      setDeletedPresentations([]);
      setNewPresentations([]);
      setPresentationIndex(0);

      setDeletedAudios([]);
      setNewAudios([]);
      setAudioIndex(0);

      setDeletedFlashcards([]);
      setNewFlashcards([]);
      setFlashcardIndex(0);

      setDeletedSampleTestQuestions([]);
      setNewSampleTestQuestions([]);
      setSampleTestQuestionIndex(0);

      setDeletedFinalTestQuestions([]);
      setNewFinalTestQuestions([]);
      setFinalTestQuestionIndex(0);

      resetEditingStates();
    }
  }, [blockQueryResult?.data.block]);

  // Update presentations and audios when week changes
  useEffect(() => {
    if (weekIndex < weeks.length) {
      const currentWeek = weeks[weekIndex];
      setPresentations(currentWeek.presentations || []);
      setAudios(currentWeek.audios || []);
      setFlashcards(currentWeek.flashcards || []);
      setSampleTestQuestions(currentWeek.sampleTestQuestions || []);
      setFinalTestQuestions(currentWeek.finalTestQuestions || []);
    } else if (weekIndex - weeks.length < newWeeks.length) {
      const currentWeek = newWeeks[weekIndex - weeks.length];
      setPresentations([]);
      setAudios([]);
      setFlashcards([]);
      setSampleTestQuestions([]);
      setFinalTestQuestions([]);
    }

    setDeletedPresentations([]);
    setNewPresentations([]);
    setPresentationIndex(0);

    setDeletedAudios([]);
    setNewAudios([]);
    setAudioIndex(0);

    setDeletedFlashcards([]);
    setNewFlashcards([]);
    setFlashcardIndex(0);

    setDeletedSampleTestQuestions([]);
    setNewSampleTestQuestions([]);
    setSampleTestQuestionIndex(0);

    setDeletedFinalTestQuestions([]);
    setNewFinalTestQuestions([]);
    setFinalTestQuestionIndex(0);

    resetEditingStates();
  }, [weekIndex, weeks, newWeeks]);

  const resetEditingStates = () => {
    setWeekNumberEditing(false);
    setWeekTitleEditing(false);
    setPresentationTitleEditing(false);
    setPresentationLinkEditing(false);
    setAudioTitleEditing(false);
    setAudioLinkEditing(false);
    setFlashcardQuestionEditing(false);
    setFlashcardAnswerEditing(false);
    setSampleTestQuestionEditing(false);
    setSampleTestAnswersEditing(false);
    setSampleTestCorrectAnswerEditing(false);
    setFinalTestQuestionEditing(false);
    setFinalTestAnswersEditing(false);
    setFinalTestCorrectAnswerEditing(false);

    if (weekIndex < weeks.length) {
      const currentWeek = weeks[weekIndex];
      setWeekNumber(currentWeek.weekNumber);
      setWeekTitle(currentWeek.title);
    } else if (weekIndex - weeks.length < newWeeks.length) {
      const currentWeek = newWeeks[weekIndex - weeks.length];
      setWeekNumber(currentWeek.weekNumber);
      setWeekTitle(currentWeek.title);
    }
  };

  const updateWeeksMutation = useMutation({
    mutationFn: async ({
      blockId,
      weeks,
      deletedWeeks,
      newWeeks,
    }: {
      blockId: string;
      weeks: WeekType[];
      deletedWeeks: string[];
      newWeeks: NewWeekType[];
    }) => {
      const response = await axios.put(
        paths.api.blocks.id.weeks.bulk({ id: blockId }),
        {
          weeks,
          deletedWeeks,
          newWeeks,
        },
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
      queryClient.invalidateQueries({ queryKey: ["block", blockId] });
      setDeletedWeeks([]);
      setNewWeeks([]);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }
    },
    onSettled: () => {
      resetEditingStates();
    },
  });

  const updatePresentationsMutation = useMutation({
    mutationFn: async ({
      blockId,
      weekId,
      presentations,
      deletedPresentations,
      newPresentations,
    }: {
      blockId: string;
      weekId: string;
      presentations: PresentationType[];
      deletedPresentations: string[];
      newPresentations: NewPresentationType[];
    }) => {
      const response = await axios.put(
        paths.api.blocks.id.weeks.id.presentations.bulk({
          id: blockId,
          weekId,
        }),
        {
          presentations,
          deletedPresentations,
          newPresentations,
        },
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
      queryClient.invalidateQueries({ queryKey: ["block", blockId] });
      setDeletedPresentations([]);
      setNewPresentations([]);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }
    },
  });

  const updateAudiosMutation = useMutation({
    mutationFn: async ({
      blockId,
      weekId,
      audios,
      deletedAudios,
      newAudios,
    }: {
      blockId: string;
      weekId: string;
      audios: AudioType[];
      deletedAudios: string[];
      newAudios: NewAudioType[];
    }) => {
      const response = await axios.put(
        paths.api.blocks.id.weeks.id.audios.bulk({
          id: blockId,
          weekId,
        }),
        {
          audios,
          deletedAudios,
          newAudios,
        },
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
      queryClient.invalidateQueries({ queryKey: ["block", blockId] });
      setDeletedAudios([]);
      setNewAudios([]);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }
    },
  });

  const updateFlashcardsMutation = useMutation({
    mutationFn: async ({
      blockId,
      weekId,
      flashcards,
      deletedFlashcards,
      newFlashcards,
    }: {
      blockId: string;
      weekId: string;
      flashcards: FlashcardType[];
      deletedFlashcards: string[];
      newFlashcards: NewFlashcardType[];
    }) => {
      const response = await axios.put(
        paths.api.blocks.id.weeks.id.flashcards.bulk({
          id: blockId,
          weekId,
        }),
        {
          flashcards,
          deletedFlashcards,
          newFlashcards,
        },
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
      queryClient.invalidateQueries({ queryKey: ["block", blockId] });
      setDeletedFlashcards([]);
      setNewFlashcards([]);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }
    },
  });

  const updateSampleTestQuestionsMutation = useMutation({
    mutationFn: async ({
      blockId,
      weekId,
      sampleTestQuestions,
      deletedSampleTestQuestions,
      newSampleTestQuestions,
    }: {
      blockId: string;
      weekId: string;
      sampleTestQuestions: TestQuestionType[];
      deletedSampleTestQuestions: string[];
      newSampleTestQuestions: NewTestQuestionType[];
    }) => {
      const response = await axios.put(
        paths.api.blocks.id.weeks.id.sampleTestQuestions.bulk({
          id: blockId,
          weekId,
        }),
        {
          sampleTestQuestions,
          deletedSampleTestQuestions,
          newSampleTestQuestions,
        },
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
      queryClient.invalidateQueries({ queryKey: ["block", blockId] });
      setDeletedSampleTestQuestions([]);
      setNewSampleTestQuestions([]);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }
    },
  });

  const updateFinalTestQuestionsMutation = useMutation({
    mutationFn: async ({
      blockId,
      weekId,
      finalTestQuestions,
      deletedFinalTestQuestions,
      newFinalTestQuestions,
    }: {
      blockId: string;
      weekId: string;
      finalTestQuestions: TestQuestionType[];
      deletedFinalTestQuestions: string[];
      newFinalTestQuestions: NewTestQuestionType[];
    }) => {
      const response = await axios.put(
        paths.api.blocks.id.weeks.id.finalTestQuestions.bulk({
          id: blockId,
          weekId,
        }),
        {
          finalTestQuestions,
          deletedFinalTestQuestions,
          newFinalTestQuestions,
        },
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
      queryClient.invalidateQueries({ queryKey: ["block", blockId] });
      setDeletedFinalTestQuestions([]);
      setNewFinalTestQuestions([]);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }
    },
  });

  const saveWeek = () => {
    if (weekIndex < weeks.length) {
      setWeeks(
        weeks.map((week, index) =>
          index === weekIndex
            ? {
                ...week,
                weekNumber,
                title: weekTitle,
              }
            : week,
        ),
      );
    } else {
      setNewWeeks(
        newWeeks.map((week, index) =>
          index === weekIndex - weeks.length
            ? {
                ...week,
                weekNumber,
                title: weekTitle,
              }
            : week,
        ),
      );
    }
  };

  const deleteWeek = () => {
    // If it's an existing week, add to deletedWeeks
    if (weekIndex < weeks.length) {
      setDeletedWeeks([...deletedWeeks, weeks[weekIndex].id]);

      // Update weeks list by removing the current week
      setWeeks(weeks.filter((_, index) => index !== weekIndex));

      // Reset presentations and audios for this week
      setPresentations([]);
      setAudios([]);

      // Move to previous week or first week if this was the first week
      if (weekIndex > 0) {
        setWeekIndex(weekIndex - 1);
      } else if (weeks.length > 1 || newWeeks.length > 0) {
        // If we have other weeks, stay at index 0
        setWeekIndex(0);
      }
    } else {
      // For new weeks, just remove from newWeeks array
      const newWeekIndex = weekIndex - weeks.length;
      setNewWeeks(newWeeks.filter((_, index) => index !== newWeekIndex));

      // Move to previous week
      if (weekIndex > 0) {
        setWeekIndex(weekIndex - 1);
      }
    }

    // Reset tab to week details
    setActiveTab("week-details");

    // Reset editing states
    resetEditingStates();
  };

  if (blockQueryIsPending) {
    return (
      <div className={cn("flex items-center justify-center")}>
        <Loader2Icon className={cn("size-8 text-primary animate-spin")} />
      </div>
    );
  }

  if (!blockQueryResult?.data.block) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Block not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h2 className="text-2xl">
          Weeks Management: {blockQueryResult.data.block.blockTitle}
        </h2>
        <p className="text-gray-600">
          Manage weekly content including presentations and audio files.
        </p>
      </div>

      <div className="flex justify-between items-center mb-4 mt-2">
        <h4 className="font-medium">
          Week {weekIndex + 1} of {weeks.length + newWeeks.length}
        </h4>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              if (weekIndex > 0) {
                setWeekIndex(weekIndex - 1);
                setActiveTab("week-details");
              }
            }}
            disabled={weekIndex === 0}
            size="sm"
            variant="outline"
          >
            Previous
          </Button>
          <Button
            onClick={() => {
              if (weekIndex < weeks.length + newWeeks.length - 1) {
                setWeekIndex(weekIndex + 1);
                setActiveTab("week-details");
              }
            }}
            disabled={weekIndex === weeks.length + newWeeks.length - 1}
            size="sm"
            variant="outline"
          >
            Next
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="week-details"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-6 mb-2">
          <TabsTrigger value="week-details">Week Details</TabsTrigger>
          <TabsTrigger value="presentations">Presentations</TabsTrigger>
          <TabsTrigger value="audios">Audios</TabsTrigger>
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          <TabsTrigger value="sample-test-questions">Sample Test</TabsTrigger>
          <TabsTrigger value="final-test-questions">Final Test</TabsTrigger>
        </TabsList>

        <TabsContent
          value="week-details"
          className="space-y-4 mt-2 border rounded-md p-4"
        >
          <div className="flex justify-between">
            <h4 className="text-base font-medium">Week Details</h4>
            <div className="flex gap-2">
              <Button
                onClick={() => deleteWeek()}
                size="sm"
                variant="outline"
                disabled={weeks.length === 0 && newWeeks.length === 0}
              >
                <Trash2Icon className="size-4" />
              </Button>
              <Button
                onClick={() => {
                  setNewWeeks([
                    ...newWeeks,
                    {
                      weekNumber: weeks.length + newWeeks.length + 1,
                      title: `Week ${weeks.length + newWeeks.length + 1}`,
                      presentations: [],
                      audios: [],
                      flashcards: [],
                      sampleTestQuestions: [],
                      finalTestQuestions: [],
                    },
                  ]);

                  setWeekIndex(weeks.length + newWeeks.length);
                  setActiveTab("week-details");
                }}
                size="sm"
                variant="outline"
              >
                New
              </Button>
              <Button
                onClick={() => {
                  updateWeeksMutation.mutate({
                    blockId: blockQueryResult.data.block.id,
                    weeks,
                    deletedWeeks,
                    newWeeks,
                  });
                }}
                size="sm"
                variant="outline"
                disabled={updateWeeksMutation.isPending}
              >
                {updateWeeksMutation.isPending && (
                  <Loader2Icon className="animate-spin h-4 w-4 mr-1" />
                )}
                Save
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="week-number" className="text-right">
                Week Number
              </Label>
              {weekNumberEditing ? (
                <Input
                  id="week-number"
                  type="number"
                  value={weekNumber}
                  onChange={(e) =>
                    setWeekNumber(Number.parseInt(e.target.value))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setWeekNumberEditing(false);
                      saveWeek();
                    }
                  }}
                  onBlur={() => {
                    setWeekNumberEditing(false);
                    saveWeek();
                  }}
                  className="col-span-3"
                  autoFocus
                />
              ) : (
                <div className="col-span-3 flex items-center">
                  <span className="mr-2">
                    {(weekIndex < weeks.length
                      ? weeks[weekIndex]
                      : newWeeks[weekIndex - weeks.length]
                    )?.weekNumber || 0}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setWeekNumber(
                        (weekIndex < weeks.length
                          ? weeks[weekIndex]
                          : newWeeks[weekIndex - weeks.length]
                        )?.weekNumber || 0,
                      );
                      setWeekNumberEditing(true);
                    }}
                  >
                    <EditIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="week-title" className="text-right">
                Week Title
              </Label>
              {weekTitleEditing ? (
                <Input
                  id="week-title"
                  value={weekTitle}
                  onChange={(e) => setWeekTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setWeekTitleEditing(false);
                      saveWeek();
                    }
                  }}
                  onBlur={() => {
                    setWeekTitleEditing(false);
                    saveWeek();
                  }}
                  className="col-span-3"
                  autoFocus
                />
              ) : (
                <div className="col-span-3 flex items-center">
                  <span className="mr-2">
                    {(weekIndex < weeks.length
                      ? weeks[weekIndex]
                      : newWeeks[weekIndex - weeks.length]
                    )?.title || "Untitled Week"}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setWeekTitle(
                        (weekIndex < weeks.length
                          ? weeks[weekIndex]
                          : newWeeks[weekIndex - weeks.length]
                        )?.title || "",
                      );
                      setWeekTitleEditing(true);
                    }}
                  >
                    <EditIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="presentations"
          className="space-y-4 mt-2 border rounded-md p-4"
        >
          <div className="flex justify-between">
            <h4 className="text-base font-medium">
              Presentation {presentationIndex + 1} of{" "}
              {presentations.length + newPresentations.length}
            </h4>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  if (weekIndex >= weeks.length) {
                    toast.error(
                      "Please save the week first before adding presentations.",
                    );
                    return;
                  }

                  setNewPresentations([
                    ...newPresentations,
                    {
                      title: `Presentation ${
                        presentations.length + newPresentations.length + 1
                      }`,
                      presentationLink: "",
                    },
                  ]);

                  setPresentationIndex(
                    presentations.length + newPresentations.length,
                  );
                }}
                size="sm"
                variant="outline"
                disabled={
                  updatePresentationsMutation.isPending ||
                  weekIndex >= weeks.length
                }
              >
                New
              </Button>

              <Button
                onClick={() => {
                  if (weekIndex >= weeks.length) {
                    toast.error(
                      "Please save the week first before saving presentations.",
                    );
                    return;
                  }

                  updatePresentationsMutation.mutate({
                    blockId: blockQueryResult.data.block.id,
                    weekId: weeks[weekIndex].id,
                    presentations,
                    deletedPresentations,
                    newPresentations,
                  });
                }}
                size="sm"
                variant="outline"
                disabled={
                  updatePresentationsMutation.isPending ||
                  weekIndex >= weeks.length
                }
              >
                {updatePresentationsMutation.isPending && (
                  <Loader2Icon className="animate-spin h-4 w-4 mr-1" />
                )}
                Save
              </Button>
            </div>
          </div>

          {weekIndex < weeks.length ? (
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="presentation-title" className="text-right">
                  Title
                </Label>
                {presentationTitleEditing ? (
                  <Input
                    id="presentation-title"
                    value={presentationTitle}
                    onChange={(e) => setPresentationTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setPresentationTitleEditing(false);
                        if (presentationIndex < presentations.length) {
                          setPresentations(
                            presentations.map((presentation, index) =>
                              index === presentationIndex
                                ? {
                                    ...presentation,
                                    title: presentationTitle,
                                  }
                                : presentation,
                            ),
                          );
                        } else {
                          setNewPresentations(
                            newPresentations.map((presentation, index) =>
                              index === presentationIndex - presentations.length
                                ? {
                                    ...presentation,
                                    title: presentationTitle,
                                  }
                                : presentation,
                            ),
                          );
                        }
                      }
                    }}
                    onBlur={() => {
                      setPresentationTitleEditing(false);
                      if (presentationIndex < presentations.length) {
                        setPresentations(
                          presentations.map((presentation, index) =>
                            index === presentationIndex
                              ? {
                                  ...presentation,
                                  title: presentationTitle,
                                }
                              : presentation,
                          ),
                        );
                      } else {
                        setNewPresentations(
                          newPresentations.map((presentation, index) =>
                            index === presentationIndex - presentations.length
                              ? {
                                  ...presentation,
                                  title: presentationTitle,
                                }
                              : presentation,
                          ),
                        );
                      }
                    }}
                    className="col-span-3"
                    autoFocus
                  />
                ) : (
                  <div className="col-span-3 flex items-center">
                    <span className="mr-2">
                      {presentationIndex < presentations.length &&
                      presentations[presentationIndex]
                        ? presentations[presentationIndex].title
                        : presentationIndex - presentations.length <
                            newPresentations.length
                          ? newPresentations[
                              presentationIndex - presentations.length
                            ].title
                          : "No presentation available"}
                    </span>
                    {(presentationIndex < presentations.length ||
                      presentationIndex - presentations.length <
                        newPresentations.length) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (presentationIndex < presentations.length) {
                            setPresentationTitle(
                              presentations[presentationIndex].title,
                            );
                          } else {
                            setPresentationTitle(
                              newPresentations[
                                presentationIndex - presentations.length
                              ].title,
                            );
                          }
                          setPresentationTitleEditing(true);
                        }}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="presentation-link" className="text-right">
                  Link
                </Label>
                {presentationLinkEditing ? (
                  <Input
                    id="presentation-link"
                    value={presentationLink}
                    onChange={(e) => setPresentationLink(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setPresentationLinkEditing(false);
                        if (presentationIndex < presentations.length) {
                          setPresentations(
                            presentations.map((presentation, index) =>
                              index === presentationIndex
                                ? {
                                    ...presentation,
                                    presentationLink: presentationLink,
                                  }
                                : presentation,
                            ),
                          );
                        } else {
                          setNewPresentations(
                            newPresentations.map((presentation, index) =>
                              index === presentationIndex - presentations.length
                                ? {
                                    ...presentation,
                                    presentationLink: presentationLink,
                                  }
                                : presentation,
                            ),
                          );
                        }
                      }
                    }}
                    onBlur={() => {
                      setPresentationLinkEditing(false);
                      if (presentationIndex < presentations.length) {
                        setPresentations(
                          presentations.map((presentation, index) =>
                            index === presentationIndex
                              ? {
                                  ...presentation,
                                  presentationLink: presentationLink,
                                }
                              : presentation,
                          ),
                        );
                      } else {
                        setNewPresentations(
                          newPresentations.map((presentation, index) =>
                            index === presentationIndex - presentations.length
                              ? {
                                  ...presentation,
                                  presentationLink: presentationLink,
                                }
                              : presentation,
                          ),
                        );
                      }
                    }}
                    className="col-span-3"
                    autoFocus
                  />
                ) : (
                  <div className="col-span-3 flex items-center">
                    <span className="mr-2 max-w-[300px] truncate text-sm">
                      {presentationIndex < presentations.length &&
                      presentations[presentationIndex]
                        ? presentations[presentationIndex].presentationLink
                        : presentationIndex - presentations.length <
                            newPresentations.length
                          ? newPresentations[
                              presentationIndex - presentations.length
                            ].presentationLink
                          : "No link available"}
                    </span>
                    {(presentationIndex < presentations.length ||
                      presentationIndex - presentations.length <
                        newPresentations.length) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (presentationIndex < presentations.length) {
                            setPresentationLink(
                              presentations[presentationIndex].presentationLink,
                            );
                          } else {
                            setPresentationLink(
                              newPresentations[
                                presentationIndex - presentations.length
                              ].presentationLink,
                            );
                          }
                          setPresentationLinkEditing(true);
                        }}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {(presentations.length > 0 || newPresentations.length > 0) && (
                <div className="flex justify-between pt-4">
                  <Button
                    onClick={() => {
                      if (presentationIndex < presentations.length) {
                        setDeletedPresentations([
                          ...deletedPresentations,
                          presentations[presentationIndex].id,
                        ]);
                        setPresentations(
                          presentations.filter(
                            (_, index) => index !== presentationIndex,
                          ),
                        );
                      } else {
                        setNewPresentations(
                          newPresentations.filter(
                            (_, index) =>
                              index !==
                              presentationIndex - presentations.length,
                          ),
                        );
                      }

                      if (presentationIndex > 0) {
                        setPresentationIndex(presentationIndex - 1);
                      }
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2Icon className="h-4 w-4 mr-1" />
                    Delete
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        if (presentationIndex > 0) {
                          setPresentationIndex(presentationIndex - 1);
                        }
                      }}
                      disabled={presentationIndex === 0}
                      size="sm"
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => {
                        if (
                          presentationIndex <
                          presentations.length + newPresentations.length - 1
                        ) {
                          setPresentationIndex(presentationIndex + 1);
                        }
                      }}
                      disabled={
                        presentationIndex ===
                        presentations.length + newPresentations.length - 1
                      }
                      size="sm"
                      variant="outline"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 border border-dashed rounded-md text-center">
              Please save the week first before adding presentations.
            </div>
          )}
        </TabsContent>

        <TabsContent
          value="audios"
          className="space-y-4 mt-2 border rounded-md p-4"
        >
          <div className="flex justify-between">
            <h4 className="text-base font-medium">
              Audio {audioIndex + 1} of {audios.length + newAudios.length}
            </h4>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  if (weekIndex >= weeks.length) {
                    toast.error(
                      "Please save the week first before adding audio files.",
                    );
                    return;
                  }

                  setNewAudios([
                    ...newAudios,
                    {
                      title: `Audio ${audios.length + newAudios.length + 1}`,
                      audioLink: "",
                    },
                  ]);

                  setAudioIndex(audios.length + newAudios.length);
                }}
                size="sm"
                variant="outline"
                disabled={
                  updateAudiosMutation.isPending || weekIndex >= weeks.length
                }
              >
                New
              </Button>

              <Button
                onClick={() => {
                  if (weekIndex >= weeks.length) {
                    toast.error(
                      "Please save the week first before saving audio files.",
                    );
                    return;
                  }

                  updateAudiosMutation.mutate({
                    blockId: blockQueryResult.data.block.id,
                    weekId: weeks[weekIndex].id,
                    audios,
                    deletedAudios,
                    newAudios,
                  });
                }}
                size="sm"
                variant="outline"
                disabled={
                  updateAudiosMutation.isPending || weekIndex >= weeks.length
                }
              >
                {updateAudiosMutation.isPending && (
                  <Loader2Icon className="animate-spin h-4 w-4 mr-1" />
                )}
                Save
              </Button>
            </div>
          </div>

          {weekIndex < weeks.length ? (
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="audio-title" className="text-right">
                  Title
                </Label>
                {audioTitleEditing ? (
                  <Input
                    id="audio-title"
                    value={audioTitle}
                    onChange={(e) => setAudioTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setAudioTitleEditing(false);
                        if (audioIndex < audios.length) {
                          setAudios(
                            audios.map((audio, index) =>
                              index === audioIndex
                                ? {
                                    ...audio,
                                    title: audioTitle,
                                  }
                                : audio,
                            ),
                          );
                        } else {
                          setNewAudios(
                            newAudios.map((audio, index) =>
                              index === audioIndex - audios.length
                                ? {
                                    ...audio,
                                    title: audioTitle,
                                  }
                                : audio,
                            ),
                          );
                        }
                      }
                    }}
                    onBlur={() => {
                      setAudioTitleEditing(false);
                      if (audioIndex < audios.length) {
                        setAudios(
                          audios.map((audio, index) =>
                            index === audioIndex
                              ? {
                                  ...audio,
                                  title: audioTitle,
                                }
                              : audio,
                          ),
                        );
                      } else {
                        setNewAudios(
                          newAudios.map((audio, index) =>
                            index === audioIndex - audios.length
                              ? {
                                  ...audio,
                                  title: audioTitle,
                                }
                              : audio,
                          ),
                        );
                      }
                    }}
                    className="col-span-3"
                    autoFocus
                  />
                ) : (
                  <div className="col-span-3 flex items-center">
                    <span className="mr-2">
                      {audioIndex < audios.length && audios[audioIndex]
                        ? audios[audioIndex].title
                        : audioIndex - audios.length < newAudios.length
                          ? newAudios[audioIndex - audios.length].title
                          : "No audio available"}
                    </span>
                    {(audioIndex < audios.length ||
                      audioIndex - audios.length < newAudios.length) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (audioIndex < audios.length) {
                            setAudioTitle(audios[audioIndex].title);
                          } else {
                            setAudioTitle(
                              newAudios[audioIndex - audios.length].title,
                            );
                          }
                          setAudioTitleEditing(true);
                        }}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="audio-link" className="text-right">
                  Link
                </Label>
                {audioLinkEditing ? (
                  <Input
                    id="audio-link"
                    value={audioLink}
                    onChange={(e) => setAudioLink(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setAudioLinkEditing(false);
                        if (audioIndex < audios.length) {
                          setAudios(
                            audios.map((audio, index) =>
                              index === audioIndex
                                ? {
                                    ...audio,
                                    audioLink: audioLink,
                                  }
                                : audio,
                            ),
                          );
                        } else {
                          setNewAudios(
                            newAudios.map((audio, index) =>
                              index === audioIndex - audios.length
                                ? {
                                    ...audio,
                                    audioLink: audioLink,
                                  }
                                : audio,
                            ),
                          );
                        }
                      }
                    }}
                    onBlur={() => {
                      setAudioLinkEditing(false);
                      if (audioIndex < audios.length) {
                        setAudios(
                          audios.map((audio, index) =>
                            index === audioIndex
                              ? {
                                  ...audio,
                                  audioLink: audioLink,
                                }
                              : audio,
                          ),
                        );
                      } else {
                        setNewAudios(
                          newAudios.map((audio, index) =>
                            index === audioIndex - audios.length
                              ? {
                                  ...audio,
                                  audioLink: audioLink,
                                }
                              : audio,
                          ),
                        );
                      }
                    }}
                    className="col-span-3"
                    autoFocus
                  />
                ) : (
                  <div className="col-span-3 flex items-center">
                    <span className="mr-2 max-w-[300px] truncate text-sm">
                      {audioIndex < audios.length && audios[audioIndex]
                        ? audios[audioIndex].audioLink
                        : audioIndex - audios.length < newAudios.length
                          ? newAudios[audioIndex - audios.length].audioLink
                          : "No link available"}
                    </span>
                    {(audioIndex < audios.length ||
                      audioIndex - audios.length < newAudios.length) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (audioIndex < audios.length) {
                            setAudioLink(audios[audioIndex].audioLink);
                          } else {
                            setAudioLink(
                              newAudios[audioIndex - audios.length].audioLink,
                            );
                          }
                          setAudioLinkEditing(true);
                        }}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {(audios.length > 0 || newAudios.length > 0) && (
                <div className="flex justify-between pt-4">
                  <Button
                    onClick={() => {
                      if (audioIndex < audios.length) {
                        setDeletedAudios([
                          ...deletedAudios,
                          audios[audioIndex].id,
                        ]);
                        setAudios(
                          audios.filter((_, index) => index !== audioIndex),
                        );
                      } else {
                        setNewAudios(
                          newAudios.filter(
                            (_, index) => index !== audioIndex - audios.length,
                          ),
                        );
                      }

                      if (audioIndex > 0) {
                        setAudioIndex(audioIndex - 1);
                      }
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2Icon className="h-4 w-4 mr-1" />
                    Delete
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        if (audioIndex > 0) {
                          setAudioIndex(audioIndex - 1);
                        }
                      }}
                      disabled={audioIndex === 0}
                      size="sm"
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => {
                        if (audioIndex < audios.length + newAudios.length - 1) {
                          setAudioIndex(audioIndex + 1);
                        }
                      }}
                      disabled={
                        audioIndex === audios.length + newAudios.length - 1
                      }
                      size="sm"
                      variant="outline"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 border border-dashed rounded-md text-center">
              Please save the week first before adding audio files.
            </div>
          )}
        </TabsContent>

        <TabsContent
          value="flashcards"
          className="space-y-4 mt-2 border rounded-md p-4"
        >
          <div className="flex justify-between">
            <h4 className="text-base font-medium">
              Flashcard {flashcardIndex + 1} of{" "}
              {flashcards.length + newFlashcards.length}
            </h4>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  if (weekIndex >= weeks.length) {
                    toast.error(
                      "Please save the week first before adding flashcards.",
                    );
                    return;
                  }

                  setNewFlashcards([
                    ...newFlashcards,
                    {
                      question: `Question ${flashcards.length + newFlashcards.length + 1}`,
                      answer: "",
                    },
                  ]);

                  setFlashcardIndex(flashcards.length + newFlashcards.length);
                }}
                size="sm"
                variant="outline"
                disabled={
                  updateFlashcardsMutation.isPending ||
                  weekIndex >= weeks.length
                }
              >
                New
              </Button>

              <Button
                onClick={() => {
                  if (weekIndex >= weeks.length) {
                    toast.error(
                      "Please save the week first before saving flashcards.",
                    );
                    return;
                  }

                  updateFlashcardsMutation.mutate({
                    blockId: blockQueryResult.data.block.id,
                    weekId: weeks[weekIndex].id,
                    flashcards,
                    deletedFlashcards,
                    newFlashcards,
                  });
                }}
                size="sm"
                variant="outline"
                disabled={
                  updateFlashcardsMutation.isPending ||
                  weekIndex >= weeks.length
                }
              >
                {updateFlashcardsMutation.isPending && (
                  <Loader2Icon className="animate-spin h-4 w-4 mr-1" />
                )}
                Save
              </Button>
            </div>
          </div>

          {weekIndex < weeks.length ? (
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="flashcard-question" className="text-right">
                  Question
                </Label>
                {flashcardQuestionEditing ? (
                  <Input
                    id="flashcard-question"
                    value={flashcardQuestion}
                    onChange={(e) => setFlashcardQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setFlashcardQuestionEditing(false);
                        if (flashcardIndex < flashcards.length) {
                          setFlashcards(
                            flashcards.map((flashcard, index) =>
                              index === flashcardIndex
                                ? {
                                    ...flashcard,
                                    question: flashcardQuestion,
                                  }
                                : flashcard,
                            ),
                          );
                        } else {
                          setNewFlashcards(
                            newFlashcards.map((flashcard, index) =>
                              index === flashcardIndex - flashcards.length
                                ? {
                                    ...flashcard,
                                    question: flashcardQuestion,
                                  }
                                : flashcard,
                            ),
                          );
                        }
                      }
                    }}
                    onBlur={() => {
                      setFlashcardQuestionEditing(false);
                      if (flashcardIndex < flashcards.length) {
                        setFlashcards(
                          flashcards.map((flashcard, index) =>
                            index === flashcardIndex
                              ? {
                                  ...flashcard,
                                  question: flashcardQuestion,
                                }
                              : flashcard,
                          ),
                        );
                      } else {
                        setNewFlashcards(
                          newFlashcards.map((flashcard, index) =>
                            index === flashcardIndex - flashcards.length
                              ? {
                                  ...flashcard,
                                  question: flashcardQuestion,
                                }
                              : flashcard,
                          ),
                        );
                      }
                    }}
                    className="col-span-3"
                    autoFocus
                  />
                ) : (
                  <div className="col-span-3 flex items-center">
                    <span className="mr-2">
                      {flashcardIndex < flashcards.length &&
                      flashcards[flashcardIndex]
                        ? flashcards[flashcardIndex].question
                        : flashcardIndex - flashcards.length <
                            newFlashcards.length
                          ? newFlashcards[flashcardIndex - flashcards.length]
                              .question
                          : "No flashcard available"}
                    </span>
                    {(flashcardIndex < flashcards.length ||
                      flashcardIndex - flashcards.length <
                        newFlashcards.length) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (flashcardIndex < flashcards.length) {
                            setFlashcardQuestion(
                              flashcards[flashcardIndex].question,
                            );
                          } else {
                            setFlashcardQuestion(
                              newFlashcards[flashcardIndex - flashcards.length]
                                .question,
                            );
                          }
                          setFlashcardQuestionEditing(true);
                        }}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="flashcard-answer" className="text-right">
                  Answer
                </Label>
                {flashcardAnswerEditing ? (
                  <Input
                    id="flashcard-answer"
                    value={flashcardAnswer}
                    onChange={(e) => setFlashcardAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setFlashcardAnswerEditing(false);
                        if (flashcardIndex < flashcards.length) {
                          setFlashcards(
                            flashcards.map((flashcard, index) =>
                              index === flashcardIndex
                                ? {
                                    ...flashcard,
                                    answer: flashcardAnswer,
                                  }
                                : flashcard,
                            ),
                          );
                        } else {
                          setNewFlashcards(
                            newFlashcards.map((flashcard, index) =>
                              index === flashcardIndex - flashcards.length
                                ? {
                                    ...flashcard,
                                    answer: flashcardAnswer,
                                  }
                                : flashcard,
                            ),
                          );
                        }
                      }
                    }}
                    onBlur={() => {
                      setFlashcardAnswerEditing(false);
                      if (flashcardIndex < flashcards.length) {
                        setFlashcards(
                          flashcards.map((flashcard, index) =>
                            index === flashcardIndex
                              ? {
                                  ...flashcard,
                                  answer: flashcardAnswer,
                                }
                              : flashcard,
                          ),
                        );
                      } else {
                        setNewFlashcards(
                          newFlashcards.map((flashcard, index) =>
                            index === flashcardIndex - flashcards.length
                              ? {
                                  ...flashcard,
                                  answer: flashcardAnswer,
                                }
                              : flashcard,
                          ),
                        );
                      }
                    }}
                    className="col-span-3"
                    autoFocus
                  />
                ) : (
                  <div className="col-span-3 flex items-center">
                    <span className="mr-2 max-w-[300px] truncate text-sm">
                      {flashcardIndex < flashcards.length &&
                      flashcards[flashcardIndex]
                        ? flashcards[flashcardIndex].answer
                        : flashcardIndex - flashcards.length <
                            newFlashcards.length
                          ? newFlashcards[flashcardIndex - flashcards.length]
                              .answer
                          : "No answer available"}
                    </span>
                    {(flashcardIndex < flashcards.length ||
                      flashcardIndex - flashcards.length <
                        newFlashcards.length) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (flashcardIndex < flashcards.length) {
                            setFlashcardAnswer(
                              flashcards[flashcardIndex].answer,
                            );
                          } else {
                            setFlashcardAnswer(
                              newFlashcards[flashcardIndex - flashcards.length]
                                .answer,
                            );
                          }
                          setFlashcardAnswerEditing(true);
                        }}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {(flashcards.length > 0 || newFlashcards.length > 0) && (
                <div className="flex justify-between pt-4">
                  <Button
                    onClick={() => {
                      if (flashcardIndex < flashcards.length) {
                        setDeletedFlashcards([
                          ...deletedFlashcards,
                          flashcards[flashcardIndex].id,
                        ]);
                        setFlashcards(
                          flashcards.filter(
                            (_, index) => index !== flashcardIndex,
                          ),
                        );
                      } else {
                        setNewFlashcards(
                          newFlashcards.filter(
                            (_, index) =>
                              index !== flashcardIndex - flashcards.length,
                          ),
                        );
                      }

                      if (flashcardIndex > 0) {
                        setFlashcardIndex(flashcardIndex - 1);
                      }
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2Icon className="h-4 w-4 mr-1" />
                    Delete
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        if (flashcardIndex > 0) {
                          setFlashcardIndex(flashcardIndex - 1);
                        }
                      }}
                      disabled={flashcardIndex === 0}
                      size="sm"
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => {
                        if (
                          flashcardIndex <
                          flashcards.length + newFlashcards.length - 1
                        ) {
                          setFlashcardIndex(flashcardIndex + 1);
                        }
                      }}
                      disabled={
                        flashcardIndex ===
                        flashcards.length + newFlashcards.length - 1
                      }
                      size="sm"
                      variant="outline"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 border border-dashed rounded-md text-center">
              Please save the week first before adding flashcards.
            </div>
          )}
        </TabsContent>

        <TabsContent
          value="sample-test-questions"
          className="space-y-4 mt-2 border rounded-md p-4"
        >
          <div className="flex justify-between">
            <h4 className="text-base font-medium">
              Sample Test Question {sampleTestQuestionIndex + 1} of{" "}
              {sampleTestQuestions.length + newSampleTestQuestions.length}
            </h4>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  if (weekIndex >= weeks.length) {
                    toast.error(
                      "Please save the week first before adding sample test questions.",
                    );
                    return;
                  }

                  setNewSampleTestQuestions([
                    ...newSampleTestQuestions,
                    {
                      question: `Question ${sampleTestQuestions.length + newSampleTestQuestions.length + 1}`,
                      answers: ["", "", "", ""],
                      correctAnswer: "",
                    },
                  ]);

                  setSampleTestQuestionIndex(
                    sampleTestQuestions.length + newSampleTestQuestions.length,
                  );
                }}
                size="sm"
                variant="outline"
                disabled={
                  updateSampleTestQuestionsMutation.isPending ||
                  weekIndex >= weeks.length
                }
              >
                New
              </Button>

              <Button
                onClick={() => {
                  if (weekIndex >= weeks.length) {
                    toast.error(
                      "Please save the week first before saving sample test questions.",
                    );
                    return;
                  }

                  updateSampleTestQuestionsMutation.mutate({
                    blockId: blockQueryResult.data.block.id,
                    weekId: weeks[weekIndex].id,
                    sampleTestQuestions,
                    deletedSampleTestQuestions,
                    newSampleTestQuestions,
                  });
                }}
                size="sm"
                variant="outline"
                disabled={
                  updateSampleTestQuestionsMutation.isPending ||
                  weekIndex >= weeks.length
                }
              >
                {updateSampleTestQuestionsMutation.isPending && (
                  <Loader2Icon className="animate-spin h-4 w-4 mr-1" />
                )}
                Save
              </Button>
            </div>
          </div>

          {weekIndex < weeks.length ? (
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sample-test-question" className="text-right">
                  Question
                </Label>
                {sampleTestQuestionEditing ? (
                  <Input
                    id="sample-test-question"
                    value={sampleTestQuestion}
                    onChange={(e) => setSampleTestQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setSampleTestQuestionEditing(false);
                        if (
                          sampleTestQuestionIndex < sampleTestQuestions.length
                        ) {
                          setSampleTestQuestions(
                            sampleTestQuestions.map((question, index) =>
                              index === sampleTestQuestionIndex
                                ? {
                                    ...question,
                                    question: sampleTestQuestion,
                                  }
                                : question,
                            ),
                          );
                        } else {
                          setNewSampleTestQuestions(
                            newSampleTestQuestions.map((question, index) =>
                              index ===
                              sampleTestQuestionIndex -
                                sampleTestQuestions.length
                                ? {
                                    ...question,
                                    question: sampleTestQuestion,
                                  }
                                : question,
                            ),
                          );
                        }
                      }
                    }}
                    onBlur={() => {
                      setSampleTestQuestionEditing(false);
                      if (
                        sampleTestQuestionIndex < sampleTestQuestions.length
                      ) {
                        setSampleTestQuestions(
                          sampleTestQuestions.map((question, index) =>
                            index === sampleTestQuestionIndex
                              ? {
                                  ...question,
                                  question: sampleTestQuestion,
                                }
                              : question,
                          ),
                        );
                      } else {
                        setNewSampleTestQuestions(
                          newSampleTestQuestions.map((question, index) =>
                            index ===
                            sampleTestQuestionIndex - sampleTestQuestions.length
                              ? {
                                  ...question,
                                  question: sampleTestQuestion,
                                }
                              : question,
                          ),
                        );
                      }
                    }}
                    className="col-span-3"
                    autoFocus
                  />
                ) : (
                  <div className="col-span-3 flex items-center">
                    <span className="mr-2">
                      {sampleTestQuestionIndex < sampleTestQuestions.length &&
                      sampleTestQuestions[sampleTestQuestionIndex]
                        ? sampleTestQuestions[sampleTestQuestionIndex].question
                        : sampleTestQuestionIndex - sampleTestQuestions.length <
                            newSampleTestQuestions.length
                          ? newSampleTestQuestions[
                              sampleTestQuestionIndex -
                                sampleTestQuestions.length
                            ].question
                          : "No question available"}
                    </span>
                    {(sampleTestQuestionIndex < sampleTestQuestions.length ||
                      sampleTestQuestionIndex - sampleTestQuestions.length <
                        newSampleTestQuestions.length) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (
                            sampleTestQuestionIndex < sampleTestQuestions.length
                          ) {
                            setSampleTestQuestion(
                              sampleTestQuestions[sampleTestQuestionIndex]
                                .question,
                            );
                          } else {
                            setSampleTestQuestion(
                              newSampleTestQuestions[
                                sampleTestQuestionIndex -
                                  sampleTestQuestions.length
                              ].question,
                            );
                          }
                          setSampleTestQuestionEditing(true);
                        }}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sample-test-answers" className="text-right">
                  Answers (comma separated)
                </Label>
                {sampleTestAnswersEditing ? (
                  <Input
                    id="sample-test-answers"
                    value={sampleTestAnswers.join(", ")}
                    onChange={(e) =>
                      setSampleTestAnswers(
                        e.target.value
                          .split(",")
                          .map((answer) => answer.trim()),
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setSampleTestAnswersEditing(false);
                        if (
                          sampleTestQuestionIndex < sampleTestQuestions.length
                        ) {
                          setSampleTestQuestions(
                            sampleTestQuestions.map((question, index) =>
                              index === sampleTestQuestionIndex
                                ? {
                                    ...question,
                                    answers: sampleTestAnswers,
                                  }
                                : question,
                            ),
                          );
                        } else {
                          setNewSampleTestQuestions(
                            newSampleTestQuestions.map((question, index) =>
                              index ===
                              sampleTestQuestionIndex -
                                sampleTestQuestions.length
                                ? {
                                    ...question,
                                    answers: sampleTestAnswers,
                                  }
                                : question,
                            ),
                          );
                        }
                      }
                    }}
                    onBlur={() => {
                      setSampleTestAnswersEditing(false);
                      if (
                        sampleTestQuestionIndex < sampleTestQuestions.length
                      ) {
                        setSampleTestQuestions(
                          sampleTestQuestions.map((question, index) =>
                            index === sampleTestQuestionIndex
                              ? {
                                  ...question,
                                  answers: sampleTestAnswers,
                                }
                              : question,
                          ),
                        );
                      } else {
                        setNewSampleTestQuestions(
                          newSampleTestQuestions.map((question, index) =>
                            index ===
                            sampleTestQuestionIndex - sampleTestQuestions.length
                              ? {
                                  ...question,
                                  answers: sampleTestAnswers,
                                }
                              : question,
                          ),
                        );
                      }
                    }}
                    className="col-span-3"
                    autoFocus
                  />
                ) : (
                  <div className="col-span-3 flex items-center">
                    <span className="mr-2 max-w-[300px] truncate text-sm">
                      {sampleTestQuestionIndex < sampleTestQuestions.length &&
                      sampleTestQuestions[sampleTestQuestionIndex]
                        ? sampleTestQuestions[
                            sampleTestQuestionIndex
                          ].answers.join(", ")
                        : sampleTestQuestionIndex - sampleTestQuestions.length <
                            newSampleTestQuestions.length
                          ? newSampleTestQuestions[
                              sampleTestQuestionIndex -
                                sampleTestQuestions.length
                            ].answers.join(", ")
                          : "No answers available"}
                    </span>
                    {(sampleTestQuestionIndex < sampleTestQuestions.length ||
                      sampleTestQuestionIndex - sampleTestQuestions.length <
                        newSampleTestQuestions.length) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (
                            sampleTestQuestionIndex < sampleTestQuestions.length
                          ) {
                            setSampleTestAnswers(
                              sampleTestQuestions[sampleTestQuestionIndex]
                                .answers,
                            );
                          } else {
                            setSampleTestAnswers(
                              newSampleTestQuestions[
                                sampleTestQuestionIndex -
                                  sampleTestQuestions.length
                              ].answers,
                            );
                          }
                          setSampleTestAnswersEditing(true);
                        }}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="sample-test-correct-answer"
                  className="text-right"
                >
                  Correct Answer
                </Label>
                {sampleTestCorrectAnswerEditing ? (
                  <Input
                    id="sample-test-correct-answer"
                    value={sampleTestCorrectAnswer}
                    onChange={(e) => setSampleTestCorrectAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setSampleTestCorrectAnswerEditing(false);
                        if (
                          sampleTestQuestionIndex < sampleTestQuestions.length
                        ) {
                          setSampleTestQuestions(
                            sampleTestQuestions.map((question, index) =>
                              index === sampleTestQuestionIndex
                                ? {
                                    ...question,
                                    correctAnswer: sampleTestCorrectAnswer,
                                  }
                                : question,
                            ),
                          );
                        } else {
                          setNewSampleTestQuestions(
                            newSampleTestQuestions.map((question, index) =>
                              index ===
                              sampleTestQuestionIndex -
                                sampleTestQuestions.length
                                ? {
                                    ...question,
                                    correctAnswer: sampleTestCorrectAnswer,
                                  }
                                : question,
                            ),
                          );
                        }
                      }
                    }}
                    onBlur={() => {
                      setSampleTestCorrectAnswerEditing(false);
                      if (
                        sampleTestQuestionIndex < sampleTestQuestions.length
                      ) {
                        setSampleTestQuestions(
                          sampleTestQuestions.map((question, index) =>
                            index === sampleTestQuestionIndex
                              ? {
                                  ...question,
                                  correctAnswer: sampleTestCorrectAnswer,
                                }
                              : question,
                          ),
                        );
                      } else {
                        setNewSampleTestQuestions(
                          newSampleTestQuestions.map((question, index) =>
                            index ===
                            sampleTestQuestionIndex - sampleTestQuestions.length
                              ? {
                                  ...question,
                                  correctAnswer: sampleTestCorrectAnswer,
                                }
                              : question,
                          ),
                        );
                      }
                    }}
                    className="col-span-3"
                    autoFocus
                  />
                ) : (
                  <div className="col-span-3 flex items-center">
                    <span className="mr-2">
                      {sampleTestQuestionIndex < sampleTestQuestions.length &&
                      sampleTestQuestions[sampleTestQuestionIndex]
                        ? sampleTestQuestions[sampleTestQuestionIndex]
                            .correctAnswer
                        : sampleTestQuestionIndex - sampleTestQuestions.length <
                            newSampleTestQuestions.length
                          ? newSampleTestQuestions[
                              sampleTestQuestionIndex -
                                sampleTestQuestions.length
                            ].correctAnswer
                          : "No correct answer available"}
                    </span>
                    {(sampleTestQuestionIndex < sampleTestQuestions.length ||
                      sampleTestQuestionIndex - sampleTestQuestions.length <
                        newSampleTestQuestions.length) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (
                            sampleTestQuestionIndex < sampleTestQuestions.length
                          ) {
                            setSampleTestCorrectAnswer(
                              sampleTestQuestions[sampleTestQuestionIndex]
                                .correctAnswer,
                            );
                          } else {
                            setSampleTestCorrectAnswer(
                              newSampleTestQuestions[
                                sampleTestQuestionIndex -
                                  sampleTestQuestions.length
                              ].correctAnswer,
                            );
                          }
                          setSampleTestCorrectAnswerEditing(true);
                        }}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {(sampleTestQuestions.length > 0 ||
                newSampleTestQuestions.length > 0) && (
                <div className="flex justify-between pt-4">
                  <Button
                    onClick={() => {
                      if (
                        sampleTestQuestionIndex < sampleTestQuestions.length
                      ) {
                        setDeletedSampleTestQuestions([
                          ...deletedSampleTestQuestions,
                          sampleTestQuestions[sampleTestQuestionIndex].id,
                        ]);
                        setSampleTestQuestions(
                          sampleTestQuestions.filter(
                            (_, index) => index !== sampleTestQuestionIndex,
                          ),
                        );
                      } else {
                        setNewSampleTestQuestions(
                          newSampleTestQuestions.filter(
                            (_, index) =>
                              index !==
                              sampleTestQuestionIndex -
                                sampleTestQuestions.length,
                          ),
                        );
                      }

                      if (sampleTestQuestionIndex > 0) {
                        setSampleTestQuestionIndex(sampleTestQuestionIndex - 1);
                      }
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2Icon className="h-4 w-4 mr-1" />
                    Delete
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        if (sampleTestQuestionIndex > 0) {
                          setSampleTestQuestionIndex(
                            sampleTestQuestionIndex - 1,
                          );
                        }
                      }}
                      disabled={sampleTestQuestionIndex === 0}
                      size="sm"
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => {
                        if (
                          sampleTestQuestionIndex <
                          sampleTestQuestions.length +
                            newSampleTestQuestions.length -
                            1
                        ) {
                          setSampleTestQuestionIndex(
                            sampleTestQuestionIndex + 1,
                          );
                        }
                      }}
                      disabled={
                        sampleTestQuestionIndex ===
                        sampleTestQuestions.length +
                          newSampleTestQuestions.length -
                          1
                      }
                      size="sm"
                      variant="outline"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 border border-dashed rounded-md text-center">
              Please save the week first before adding sample test questions.
            </div>
          )}
        </TabsContent>

        <TabsContent
          value="final-test-questions"
          className="space-y-4 mt-2 border rounded-md p-4"
        >
          <div className="flex justify-between">
            <h4 className="text-base font-medium">
              Final Test Question {finalTestQuestionIndex + 1} of{" "}
              {finalTestQuestions.length + newFinalTestQuestions.length}
            </h4>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  if (weekIndex >= weeks.length) {
                    toast.error(
                      "Please save the week first before adding final test questions.",
                    );
                    return;
                  }

                  setNewFinalTestQuestions([
                    ...newFinalTestQuestions,
                    {
                      question: `Question ${finalTestQuestions.length + newFinalTestQuestions.length + 1}`,
                      answers: ["", "", "", ""],
                      correctAnswer: "",
                    },
                  ]);

                  setFinalTestQuestionIndex(
                    finalTestQuestions.length + newFinalTestQuestions.length,
                  );
                }}
                size="sm"
                variant="outline"
                disabled={
                  updateFinalTestQuestionsMutation.isPending ||
                  weekIndex >= weeks.length
                }
              >
                New
              </Button>

              <Button
                onClick={() => {
                  if (weekIndex >= weeks.length) {
                    toast.error(
                      "Please save the week first before saving final test questions.",
                    );
                    return;
                  }

                  updateFinalTestQuestionsMutation.mutate({
                    blockId: blockQueryResult.data.block.id,
                    weekId: weeks[weekIndex].id,
                    finalTestQuestions,
                    deletedFinalTestQuestions,
                    newFinalTestQuestions,
                  });
                }}
                size="sm"
                variant="outline"
                disabled={
                  updateFinalTestQuestionsMutation.isPending ||
                  weekIndex >= weeks.length
                }
              >
                {updateFinalTestQuestionsMutation.isPending && (
                  <Loader2Icon className="animate-spin h-4 w-4 mr-1" />
                )}
                Save
              </Button>
            </div>
          </div>

          {weekIndex < weeks.length ? (
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="final-test-question" className="text-right">
                  Question
                </Label>
                {finalTestQuestionEditing ? (
                  <Input
                    id="final-test-question"
                    value={finalTestQuestion}
                    onChange={(e) => setFinalTestQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setFinalTestQuestionEditing(false);
                        if (
                          finalTestQuestionIndex < finalTestQuestions.length
                        ) {
                          setFinalTestQuestions(
                            finalTestQuestions.map((question, index) =>
                              index === finalTestQuestionIndex
                                ? {
                                    ...question,
                                    question: finalTestQuestion,
                                  }
                                : question,
                            ),
                          );
                        } else {
                          setNewFinalTestQuestions(
                            newFinalTestQuestions.map((question, index) =>
                              index ===
                              finalTestQuestionIndex - finalTestQuestions.length
                                ? {
                                    ...question,
                                    question: finalTestQuestion,
                                  }
                                : question,
                            ),
                          );
                        }
                      }
                    }}
                    onBlur={() => {
                      setFinalTestQuestionEditing(false);
                      if (finalTestQuestionIndex < finalTestQuestions.length) {
                        setFinalTestQuestions(
                          finalTestQuestions.map((question, index) =>
                            index === finalTestQuestionIndex
                              ? {
                                  ...question,
                                  question: finalTestQuestion,
                                }
                              : question,
                          ),
                        );
                      } else {
                        setNewFinalTestQuestions(
                          newFinalTestQuestions.map((question, index) =>
                            index ===
                            finalTestQuestionIndex - finalTestQuestions.length
                              ? {
                                  ...question,
                                  question: finalTestQuestion,
                                }
                              : question,
                          ),
                        );
                      }
                    }}
                    className="col-span-3"
                    autoFocus
                  />
                ) : (
                  <div className="col-span-3 flex items-center">
                    <span className="mr-2">
                      {finalTestQuestionIndex < finalTestQuestions.length &&
                      finalTestQuestions[finalTestQuestionIndex]
                        ? finalTestQuestions[finalTestQuestionIndex].question
                        : finalTestQuestionIndex - finalTestQuestions.length <
                            newFinalTestQuestions.length
                          ? newFinalTestQuestions[
                              finalTestQuestionIndex - finalTestQuestions.length
                            ].question
                          : "No question available"}
                    </span>
                    {(finalTestQuestionIndex < finalTestQuestions.length ||
                      finalTestQuestionIndex - finalTestQuestions.length <
                        newFinalTestQuestions.length) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (
                            finalTestQuestionIndex < finalTestQuestions.length
                          ) {
                            setFinalTestQuestion(
                              finalTestQuestions[finalTestQuestionIndex]
                                .question,
                            );
                          } else {
                            setFinalTestQuestion(
                              newFinalTestQuestions[
                                finalTestQuestionIndex -
                                  finalTestQuestions.length
                              ].question,
                            );
                          }
                          setFinalTestQuestionEditing(true);
                        }}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="final-test-answers" className="text-right">
                  Answers (comma separated)
                </Label>
                {finalTestAnswersEditing ? (
                  <Input
                    id="final-test-answers"
                    value={finalTestAnswers.join(", ")}
                    onChange={(e) =>
                      setFinalTestAnswers(
                        e.target.value
                          .split(",")
                          .map((answer) => answer.trim()),
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setFinalTestAnswersEditing(false);
                        if (
                          finalTestQuestionIndex < finalTestQuestions.length
                        ) {
                          setFinalTestQuestions(
                            finalTestQuestions.map((question, index) =>
                              index === finalTestQuestionIndex
                                ? {
                                    ...question,
                                    answers: finalTestAnswers,
                                  }
                                : question,
                            ),
                          );
                        } else {
                          setNewFinalTestQuestions(
                            newFinalTestQuestions.map((question, index) =>
                              index ===
                              finalTestQuestionIndex - finalTestQuestions.length
                                ? {
                                    ...question,
                                    answers: finalTestAnswers,
                                  }
                                : question,
                            ),
                          );
                        }
                      }
                    }}
                    onBlur={() => {
                      setFinalTestAnswersEditing(false);
                      if (finalTestQuestionIndex < finalTestQuestions.length) {
                        setFinalTestQuestions(
                          finalTestQuestions.map((question, index) =>
                            index === finalTestQuestionIndex
                              ? {
                                  ...question,
                                  answers: finalTestAnswers,
                                }
                              : question,
                          ),
                        );
                      } else {
                        setNewFinalTestQuestions(
                          newFinalTestQuestions.map((question, index) =>
                            index ===
                            finalTestQuestionIndex - finalTestQuestions.length
                              ? {
                                  ...question,
                                  answers: finalTestAnswers,
                                }
                              : question,
                          ),
                        );
                      }
                    }}
                    className="col-span-3"
                    autoFocus
                  />
                ) : (
                  <div className="col-span-3 flex items-center">
                    <span className="mr-2 max-w-[300px] truncate text-sm">
                      {finalTestQuestionIndex < finalTestQuestions.length &&
                      finalTestQuestions[finalTestQuestionIndex]
                        ? finalTestQuestions[
                            finalTestQuestionIndex
                          ].answers.join(", ")
                        : finalTestQuestionIndex - finalTestQuestions.length <
                            newFinalTestQuestions.length
                          ? newFinalTestQuestions[
                              finalTestQuestionIndex - finalTestQuestions.length
                            ].answers.join(", ")
                          : "No answers available"}
                    </span>
                    {(finalTestQuestionIndex < finalTestQuestions.length ||
                      finalTestQuestionIndex - finalTestQuestions.length <
                        newFinalTestQuestions.length) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (
                            finalTestQuestionIndex < finalTestQuestions.length
                          ) {
                            setFinalTestAnswers(
                              finalTestQuestions[finalTestQuestionIndex]
                                .answers,
                            );
                          } else {
                            setFinalTestAnswers(
                              newFinalTestQuestions[
                                finalTestQuestionIndex -
                                  finalTestQuestions.length
                              ].answers,
                            );
                          }
                          setFinalTestAnswersEditing(true);
                        }}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="final-test-correct-answer"
                  className="text-right"
                >
                  Correct Answer
                </Label>
                {finalTestCorrectAnswerEditing ? (
                  <Input
                    id="final-test-correct-answer"
                    value={finalTestCorrectAnswer}
                    onChange={(e) => setFinalTestCorrectAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setFinalTestCorrectAnswerEditing(false);
                        if (
                          finalTestQuestionIndex < finalTestQuestions.length
                        ) {
                          setFinalTestQuestions(
                            finalTestQuestions.map((question, index) =>
                              index === finalTestQuestionIndex
                                ? {
                                    ...question,
                                    correctAnswer: finalTestCorrectAnswer,
                                  }
                                : question,
                            ),
                          );
                        } else {
                          setNewFinalTestQuestions(
                            newFinalTestQuestions.map((question, index) =>
                              index ===
                              finalTestQuestionIndex - finalTestQuestions.length
                                ? {
                                    ...question,
                                    correctAnswer: finalTestCorrectAnswer,
                                  }
                                : question,
                            ),
                          );
                        }
                      }
                    }}
                    onBlur={() => {
                      setFinalTestCorrectAnswerEditing(false);
                      if (finalTestQuestionIndex < finalTestQuestions.length) {
                        setFinalTestQuestions(
                          finalTestQuestions.map((question, index) =>
                            index === finalTestQuestionIndex
                              ? {
                                  ...question,
                                  correctAnswer: finalTestCorrectAnswer,
                                }
                              : question,
                          ),
                        );
                      } else {
                        setNewFinalTestQuestions(
                          newFinalTestQuestions.map((question, index) =>
                            index ===
                            finalTestQuestionIndex - finalTestQuestions.length
                              ? {
                                  ...question,
                                  correctAnswer: finalTestCorrectAnswer,
                                }
                              : question,
                          ),
                        );
                      }
                    }}
                    className="col-span-3"
                    autoFocus
                  />
                ) : (
                  <div className="col-span-3 flex items-center">
                    <span className="mr-2">
                      {finalTestQuestionIndex < finalTestQuestions.length &&
                      finalTestQuestions[finalTestQuestionIndex]
                        ? finalTestQuestions[finalTestQuestionIndex]
                            .correctAnswer
                        : finalTestQuestionIndex - finalTestQuestions.length <
                            newFinalTestQuestions.length
                          ? newFinalTestQuestions[
                              finalTestQuestionIndex - finalTestQuestions.length
                            ].correctAnswer
                          : "No correct answer available"}
                    </span>
                    {(finalTestQuestionIndex < finalTestQuestions.length ||
                      finalTestQuestionIndex - finalTestQuestions.length <
                        newFinalTestQuestions.length) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (
                            finalTestQuestionIndex < finalTestQuestions.length
                          ) {
                            setFinalTestCorrectAnswer(
                              finalTestQuestions[finalTestQuestionIndex]
                                .correctAnswer,
                            );
                          } else {
                            setFinalTestCorrectAnswer(
                              newFinalTestQuestions[
                                finalTestQuestionIndex -
                                  finalTestQuestions.length
                              ].correctAnswer,
                            );
                          }
                          setFinalTestCorrectAnswerEditing(true);
                        }}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {(finalTestQuestions.length > 0 ||
                newFinalTestQuestions.length > 0) && (
                <div className="flex justify-between pt-4">
                  <Button
                    onClick={() => {
                      if (finalTestQuestionIndex < finalTestQuestions.length) {
                        setDeletedFinalTestQuestions([
                          ...deletedFinalTestQuestions,
                          finalTestQuestions[finalTestQuestionIndex].id,
                        ]);
                        setFinalTestQuestions(
                          finalTestQuestions.filter(
                            (_, index) => index !== finalTestQuestionIndex,
                          ),
                        );
                      } else {
                        setNewFinalTestQuestions(
                          newFinalTestQuestions.filter(
                            (_, index) =>
                              index !==
                              finalTestQuestionIndex -
                                finalTestQuestions.length,
                          ),
                        );
                      }

                      if (finalTestQuestionIndex > 0) {
                        setFinalTestQuestionIndex(finalTestQuestionIndex - 1);
                      }
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2Icon className="h-4 w-4 mr-1" />
                    Delete
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        if (finalTestQuestionIndex > 0) {
                          setFinalTestQuestionIndex(finalTestQuestionIndex - 1);
                        }
                      }}
                      disabled={finalTestQuestionIndex === 0}
                      size="sm"
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => {
                        if (
                          finalTestQuestionIndex <
                          finalTestQuestions.length +
                            newFinalTestQuestions.length -
                            1
                        ) {
                          setFinalTestQuestionIndex(finalTestQuestionIndex + 1);
                        }
                      }}
                      disabled={
                        finalTestQuestionIndex ===
                        finalTestQuestions.length +
                          newFinalTestQuestions.length -
                          1
                      }
                      size="sm"
                      variant="outline"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 border border-dashed rounded-md text-center">
              Please save the week first before adding final test questions.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
