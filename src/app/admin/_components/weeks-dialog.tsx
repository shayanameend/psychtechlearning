"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { EditIcon, Loader2Icon, PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";
import { useUserContext } from "~/providers/user-provider";
import { paths } from "~/routes/paths";
import type {
  AudioType,
  BlockType,
  PresentationType,
  WeekType,
} from "~/types/block";
import { truncateText } from "./utils";

interface WeeksDialogProps {
  block: BlockType;
}

type NewWeekType = Omit<Omit<Omit<WeekType, "updatedAt">, "createdAt">, "id">;
type NewPresentationType = Omit<
  Omit<Omit<PresentationType, "updatedAt">, "createdAt">,
  "id"
>;
type NewAudioType = Omit<Omit<Omit<AudioType, "updatedAt">, "createdAt">, "id">;

export function WeeksDialog({ block }: WeeksDialogProps) {
  const queryClient = useQueryClient();
  const { token } = useUserContext();

  const [isWeeksDialogOpen, setIsWeeksDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("week-details");

  const [weekIndex, setWeekIndex] = useState(0);
  const [weeks, setWeeks] = useState<WeekType[]>(block.weeks);
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

  // Reset everything when block changes
  useEffect(() => {
    setWeeks(block.weeks);
    setDeletedWeeks([]);
    setNewWeeks([]);
    setWeekIndex(0);

    if (block.weeks.length > 0) {
      setPresentations([block.weeks[0].presentation].filter(Boolean));
      setAudios(block.weeks[0].audios || []);
    } else {
      setPresentations([]);
      setAudios([]);
    }

    setDeletedPresentations([]);
    setNewPresentations([]);
    setPresentationIndex(0);

    setDeletedAudios([]);
    setNewAudios([]);
    setAudioIndex(0);

    resetEditingStates();
  }, [block]);

  // Update presentations and audios when week changes
  useEffect(() => {
    if (weekIndex < weeks.length) {
      const currentWeek = weeks[weekIndex];
      setPresentations([currentWeek.presentation].filter(Boolean));
      setAudios(currentWeek.audios || []);
    } else if (weekIndex - weeks.length < newWeeks.length) {
      const currentWeek = newWeeks[weekIndex - weeks.length];
      setPresentations([]);
      setAudios([]);
    }

    setDeletedPresentations([]);
    setNewPresentations([]);
    setPresentationIndex(0);

    setDeletedAudios([]);
    setNewAudios([]);
    setAudioIndex(0);

    resetEditingStates();
  }, [weekIndex, weeks, newWeeks]);

  const resetEditingStates = () => {
    setWeekNumberEditing(false);
    setWeekTitleEditing(false);
    setPresentationTitleEditing(false);
    setPresentationLinkEditing(false);
    setAudioTitleEditing(false);
    setAudioLinkEditing(false);

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
      setDeletedWeeks([]);
      setNewWeeks([]);
      setIsWeeksDialogOpen(false);
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
      setDeletedAudios([]);
      setNewAudios([]);
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

  return (
    <Dialog open={isWeeksDialogOpen} onOpenChange={setIsWeeksDialogOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsWeeksDialogOpen(true)}
          variant="outline"
          size="sm"
        >
          <EditIcon className="h-4 w-4 mr-1.5" />
          <span>Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[384px] lg:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>Weeks: {block.blockTitle}</DialogTitle>
          <DialogDescription>
            Manage weekly content including presentations and audio files.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-between items-center mb-4 mt-2">
          <h4 className="text-lg font-medium">
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
          <TabsList className="grid grid-cols-3 mb-2">
            <TabsTrigger value="week-details">Week Details</TabsTrigger>
            <TabsTrigger value="presentations">Presentations</TabsTrigger>
            <TabsTrigger value="audios">Audio Files</TabsTrigger>
          </TabsList>

          <TabsContent
            value="week-details"
            className="space-y-4 mt-2 border rounded-md p-4"
          >
            <div className="flex justify-between">
              <h4 className="text-base font-medium">Week Details</h4>
              <Button onClick={() => saveWeek()} size="sm" variant="outline">
                Save Week
              </Button>
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
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add
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
                      blockId: block.id,
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
                                index ===
                                presentationIndex - presentations.length
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
                                index ===
                                presentationIndex - presentations.length
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
                                presentations[presentationIndex]
                                  .presentationLink,
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
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add
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
                      blockId: block.id,
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
                              (_, index) =>
                                index !== audioIndex - audios.length,
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
                          if (
                            audioIndex <
                            audios.length + newAudios.length - 1
                          ) {
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
        </Tabs>

        <DialogFooter className="mt-6 pt-4 border-t">
          <div className="flex justify-between w-full">
            <Button
              onClick={() => {
                setNewWeeks([
                  ...newWeeks,
                  {
                    weekNumber: weeks.length + newWeeks.length + 1,
                    title: `Week ${weeks.length + newWeeks.length + 1}`,
                    presentation: null as any,
                    audios: [],
                  },
                ]);

                setWeekIndex(weeks.length + newWeeks.length);
                setActiveTab("week-details");
              }}
              size="sm"
              variant="outline"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Week
            </Button>

            <Button
              onClick={() => {
                updateWeeksMutation.mutate({
                  blockId: block.id,
                  weeks,
                  deletedWeeks,
                  newWeeks,
                });
              }}
              size="sm"
              disabled={updateWeeksMutation.isPending}
            >
              {updateWeeksMutation.isPending && (
                <Loader2Icon className="animate-spin mr-1 h-4 w-4" />
              )}
              Save All Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
