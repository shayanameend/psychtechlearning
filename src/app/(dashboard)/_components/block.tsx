"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  FileCheck,
  FlipHorizontal,
  Pause,
  Play,
  Presentation,
  RefreshCcw,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { BlockNotes } from "~/app/(dashboard)/_components/block-notes";
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
import { Label } from "~/components/ui/label";
import { Progress } from "~/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";
import type {
  AudioType,
  BlockType,
  FlashcardType,
  PresentationType,
  TestQuestionType,
  WeekType,
} from "~/types/block";

export function Block({
  block,
  showNotes,
}: Readonly<{ block: BlockType; showNotes: boolean }>) {
  const [flashcards, setFlashcards] = useState<FlashcardType[]>(
    block.flashcards,
  );
  const [showFlashcard, setShowFlashcard] = useState(false);
  const [sampleTestQuestions, setSampleTestQuestions] = useState<
    TestQuestionType[]
  >(block.sampleTestQuestions);
  const [finalTestQuestions, setFinalTestQuestions] = useState<
    TestQuestionType[]
  >(block.finalTestQuestions);
  const [sampleTestAnswers, setSampleTestAnswers] = useState<
    Array<string | null>
  >([]);
  const [finalTestAnswers, setFinalTestAnswers] = useState<
    Array<string | null>
  >([]);
  const [showResults, setShowResults] = useState(false);
  const [testScore, setTestScore] = useState<{
    correct: number;
    total: number;
    percentage: number;
  } | null>(null);

  const [questionIndex, setQuestionIndex] = useState(0);

  // Week, presentation, and audio state
  const [selectedWeekId, setSelectedWeekId] = useState<string>("");
  const [currentWeek, setCurrentWeek] = useState<WeekType | null>(null);
  const [selectedPresentationIndex, setSelectedPresentationIndex] = useState(0);
  const [selectedAudioId, setSelectedAudioId] = useState<string>("");
  const [currentAudio, setCurrentAudio] = useState<AudioType | null>(null);

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Initialize with first week when block data is loaded
  useEffect(() => {
    setFlashcards(block.flashcards);
    setSampleTestQuestions(block.sampleTestQuestions);
    setFinalTestQuestions(block.finalTestQuestions);

    // Initialize week selection if weeks exist
    if (block.weeks && block.weeks.length > 0) {
      const firstWeek = block.weeks[0];
      setSelectedWeekId(firstWeek.id);
      setCurrentWeek(firstWeek);
      setSelectedPresentationIndex(0);

      if (firstWeek.audios && firstWeek.audios.length > 0) {
        const firstAudio = firstWeek.audios[0];
        setSelectedAudioId(firstAudio.id);
        setCurrentAudio(firstAudio);
      } else {
        setCurrentAudio(null);
      }
    } else {
      setCurrentWeek(null);
      setCurrentAudio(null);
    }
  }, [block]);

  // Update current week when selected week changes
  useEffect(() => {
    if (selectedWeekId) {
      const week = block.weeks.find((w) => w.id === selectedWeekId);
      if (week) {
        setCurrentWeek(week);
        setSelectedPresentationIndex(0);

        // Reset audio selection
        if (week.audios.length > 0) {
          const firstAudio = week.audios[0];
          setSelectedAudioId(firstAudio.id);
          setCurrentAudio(firstAudio);

          // Reset audio player state
          setIsPlaying(false);
          setCurrentTime(0);
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
          }
        } else {
          setCurrentAudio(null);
          setSelectedAudioId("");
        }
      }
    }
  }, [selectedWeekId, block.weeks]);

  // Update current audio when selected audio changes
  useEffect(() => {
    if (selectedAudioId && currentWeek) {
      const audio = currentWeek.audios.find((a) => a.id === selectedAudioId);
      if (audio) {
        setCurrentAudio(audio);
        // Reset audio player state
        setIsPlaying(false);
        setCurrentTime(0);
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
        }
      }
    }
  }, [selectedAudioId, currentWeek]);

  useEffect(() => {
    setSampleTestAnswers(
      Array.from({ length: sampleTestQuestions.length }, () => null),
    );
  }, [sampleTestQuestions]);

  useEffect(() => {
    setFinalTestAnswers(
      Array.from({ length: finalTestQuestions.length }, () => null),
    );
  }, [finalTestQuestions]);

  const calculateTestScore = (
    answers: (string | null)[],
    questions: TestQuestionType[],
  ) => {
    const correct = answers.reduce((acc, answer, index) => {
      return answer === questions[index]?.correctAnswer ? acc + 1 : acc;
    }, 0);

    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
    };
  };

  const currentFlashcard = flashcards[questionIndex];
  const currentSampleQuestion = sampleTestQuestions[questionIndex];
  const currentFinalQuestion = finalTestQuestions[questionIndex];

  // Handle play/pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle mute/unmute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Update audio time
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Set duration when metadata is loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Format time in MM:SS
  const formatTime = (time: number) => {
    if (Number.isNaN(time)) return "00:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = Number.parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  // Handle audio end
  const handleAudioEnd = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  // Handle presentation navigation
  const navigatePresentation = (direction: "next" | "prev") => {
    if (!currentWeek) return;

    const presentations = getWeekPresentations();
    if (!presentations.length) return;

    if (
      direction === "next" &&
      selectedPresentationIndex < presentations.length - 1
    ) {
      setSelectedPresentationIndex(selectedPresentationIndex + 1);
    } else if (direction === "prev" && selectedPresentationIndex > 0) {
      setSelectedPresentationIndex(selectedPresentationIndex - 1);
    }
  };

  // Helper to get current week's presentations (handle both single and array)
  const getWeekPresentations = (): PresentationType[] => {
    if (!currentWeek) return [];

    // Return the presentations array
    return currentWeek.presentations || [];
  };

  // Get current presentation
  const getCurrentPresentation = (): PresentationType | null => {
    const presentations = getWeekPresentations();
    if (presentations.length > selectedPresentationIndex) {
      return presentations[selectedPresentationIndex];
    }
    return null;
  };

  return (
    <section className={cn("flex-1 flex")}>
      <div
        className={cn(
          "w-full lg:w-2/3 space-y-2 lg:space-y-4 pb-4 lg:px-0",
          showNotes && "hidden",
        )}
      >
        <article
          className={cn("space-y-2 bg-white/50 p-4 rounded-lg shadow-sm")}
        >
          <h3 className={cn("text-primary text-xl font-bold")}>
            {block.blockTitle}
          </h3>
          <p className={cn("text-gray-600 text-sm leading-relaxed")}>
            {block.blockDescription}
          </p>
        </article>

        {/* Week selection UI */}
        <article
          className={cn("space-y-3 bg-white/50 p-4 rounded-lg shadow-sm")}
        >
          <h3
            className={cn(
              "text-foreground/70 text-lg font-medium flex items-center",
            )}
          >
            <Presentation className="h-5 w-5 mr-2 text-primary/70" />
            Weekly Content
          </h3>

          <div className="bg-white/70 rounded-lg p-4 shadow-sm">
            <p className={cn("text-gray-600 text-sm mb-3")}>
              {block.weeksDescription}
            </p>

            <div className="mb-4">
              <Label
                htmlFor="week-select"
                className="text-xs text-gray-500 mb-1 block"
              >
                Select Week
              </Label>
              <Select
                value={selectedWeekId}
                onValueChange={(value) => {
                  setSelectedWeekId(value);
                }}
              >
                <SelectTrigger id="week-select" className="bg-white">
                  <SelectValue placeholder="Select a week" />
                </SelectTrigger>
                <SelectContent>
                  {block.weeks.map((week) => (
                    <SelectItem key={week.id} value={week.id}>
                      Week {week.weekNumber}: {week.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {currentWeek && (
              <Tabs defaultValue="presentations" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-3">
                  <TabsTrigger value="presentations" className="text-sm">
                    Presentations
                  </TabsTrigger>
                  <TabsTrigger value="audios" className="text-sm">
                    Audio Content
                  </TabsTrigger>
                </TabsList>

                {/* Presentations Tab */}
                <TabsContent value="presentations" className="space-y-3">
                  {getWeekPresentations().length > 0 ? (
                    getWeekPresentations().map((presentation, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg border transition-all bg-white border-gray-100 hover:bg-gray-50 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Presentation className="mr-3 h-5 w-5 text-gray-400" />
                            <div>
                              <h4 className="font-medium text-gray-700">
                                {presentation.title}
                              </h4>
                            </div>
                          </div>
                          <Button
                            onClick={() => {
                              window.open(
                                presentation.presentationLink,
                                "_blank",
                              );
                            }}
                            size="sm"
                            variant="outline"
                            className="ml-2"
                          >
                            <ExternalLink className="h-3.5 w-3.5 mr-1" />
                            Open
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white/80 rounded-lg p-6 text-center text-gray-500">
                      <Presentation className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                      <p>No presentations available for this week</p>
                    </div>
                  )}
                </TabsContent>

                {/* Audios Tab */}
                <TabsContent value="audios" className="space-y-3">
                  {currentWeek?.audios && currentWeek.audios.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 gap-2 mb-2">
                        {currentWeek.audios.map((audio) => (
                          <button
                            key={audio.id}
                            onClick={() => setSelectedAudioId(audio.id)}
                            className={cn(
                              "text-left px-3 py-2 rounded-lg transition-all flex items-center",
                              audio.id === selectedAudioId
                                ? "bg-primary/10 border border-primary/20"
                                : "bg-white hover:bg-gray-50 border border-gray-100",
                            )}
                          >
                            <div
                              className={cn(
                                "w-8 h-8 mr-3 rounded-full flex items-center justify-center",
                                audio.id === selectedAudioId
                                  ? "bg-primary/20"
                                  : "bg-gray-100",
                              )}
                            >
                              {audio.id === selectedAudioId && isPlaying ? (
                                <Pause
                                  className={cn(
                                    "h-4 w-4",
                                    audio.id === selectedAudioId
                                      ? "text-primary"
                                      : "text-gray-500",
                                  )}
                                />
                              ) : (
                                <Play
                                  className={cn(
                                    "h-4 w-4",
                                    audio.id === selectedAudioId
                                      ? "text-primary"
                                      : "text-gray-500",
                                  )}
                                />
                              )}
                            </div>
                            <div>
                              <p
                                className={cn(
                                  "font-medium",
                                  audio.id === selectedAudioId
                                    ? "text-primary"
                                    : "text-gray-700",
                                )}
                              >
                                {audio.title}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Audio Player */}
                      {currentAudio && (
                        <div className="rounded-xl p-3 bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-sm">
                          {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
                          <audio
                            ref={audioRef}
                            src={currentAudio.audioLink}
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            onEnded={handleAudioEnd}
                            className="hidden"
                          />

                          <div className="flex justify-between mb-2 items-center">
                            <div className="text-xs font-medium text-gray-500">
                              {formatTime(currentTime)}
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                onClick={toggleMute}
                                size="sm"
                                variant="ghost"
                                className="w-7 h-7 p-0 rounded-full"
                              >
                                {isMuted ? (
                                  <VolumeX className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <Volume2 className="h-4 w-4 text-primary/70" />
                                )}
                              </Button>
                              <Button
                                onClick={togglePlayPause}
                                size="sm"
                                variant="outline"
                                className="w-8 h-8 p-0 rounded-full"
                              >
                                {isPlaying ? (
                                  <Pause className="h-4 w-4" />
                                ) : (
                                  <Play className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            <div className="text-xs font-medium text-gray-500">
                              {formatTime(duration)}
                            </div>
                          </div>

                          <div className="w-full px-1">
                            <input
                              type="range"
                              min="0"
                              max={duration || 0}
                              value={currentTime}
                              onChange={handleSeek}
                              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                            />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-white/80 rounded-lg p-6 text-center text-gray-500">
                      <Volume2 className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                      <p>No audio content available for this week</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </article>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-4">
          <article
            className={cn(
              "space-y-2 bg-white/50 p-4 rounded-lg shadow-sm flex flex-col h-full transform transition-transform hover:shadow-md hover:scale-[1.01]",
            )}
          >
            <h3
              className={cn(
                "text-foreground/70 text-lg font-medium flex items-center",
              )}
            >
              <BookOpen className="h-5 w-5 mr-2 text-primary/70" />
              Study Guide
            </h3>
            <p className={cn("text-gray-600 text-sm flex-grow")}>
              {block.guideDescription}
            </p>
            <Button
              onClick={() => {
                window.open(block.guideLink, "_blank");
              }}
              size="sm"
              className="transition-all hover:scale-105 mt-auto w-full sm:w-auto"
            >
              Open Study Guide
            </Button>
          </article>

          <article
            className={cn(
              "space-y-2 bg-white/50 p-4 rounded-lg shadow-sm flex flex-col h-full transform transition-transform hover:shadow-md hover:scale-[1.01]",
            )}
          >
            <h3
              className={cn(
                "text-foreground/70 text-lg font-medium flex items-center",
              )}
            >
              <FlipHorizontal className="h-5 w-5 mr-2 text-primary/70" />
              Flashcards
            </h3>
            <p className={cn("text-gray-600 text-sm flex-grow")}>
              {block.flashcardsDescription}
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setQuestionIndex(0);
                    setShowFlashcard(false);
                  }}
                  size="sm"
                  className="transition-all hover:scale-105 mt-auto w-full sm:w-auto"
                >
                  Reinforce Your Knowledge
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[320px] lg:max-w-[512px]">
                <DialogHeader>
                  <DialogTitle className="text-primary">
                    Flashcards: {block.blockTitle}
                  </DialogTitle>
                  <DialogDescription>
                    This is a set of flashcards to help you reinforce your
                    learning on {block.blockTitle}.
                  </DialogDescription>
                </DialogHeader>
                {currentFlashcard ? (
                  <article className={cn("relative")}>
                    <div className="w-full mb-3">
                      <Progress
                        value={((questionIndex + 1) / flashcards.length) * 100}
                        className="h-1"
                      />
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>
                          Card {questionIndex + 1} of {flashcards.length}
                        </span>
                        <span>
                          {Math.round(
                            ((questionIndex + 1) / flashcards.length) * 100,
                          )}
                          % complete
                        </span>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "relative w-full min-h-[200px] perspective-[1000px] transition-transform duration-500",
                      )}
                    >
                      <div
                        className={cn(
                          "absolute w-full h-full transform-style-3d transition-all duration-500",
                          showFlashcard ? "rotate-y-180" : "",
                        )}
                      >
                        {/* Front of card (question) */}
                        <motion.div
                          initial={{ opacity: 0.8 }}
                          animate={{ opacity: 1 }}
                          className={cn(
                            "absolute w-full h-full backface-hidden bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl border border-blue-100 shadow-md flex flex-col justify-center",
                            showFlashcard ? "invisible" : "",
                          )}
                        >
                          <p
                            className={cn(
                              "text-gray-700 font-medium text-center",
                            )}
                          >
                            {currentFlashcard.question}
                          </p>
                          <div className="absolute bottom-3 left-0 right-0 text-center text-xs text-gray-400">
                            Click "Show" to reveal the answer
                          </div>
                        </motion.div>

                        {/* Back of card (answer) */}
                        <motion.div
                          initial={{ opacity: 0.8 }}
                          animate={{ opacity: 1 }}
                          className={cn(
                            "absolute w-full h-full backface-hidden bg-gradient-to-br from-white to-green-50 p-6 rounded-xl border border-green-100 shadow-md flex flex-col justify-center rotate-y-180",
                            !showFlashcard ? "invisible" : "",
                          )}
                        >
                          <p className={cn("text-primary text-center")}>
                            {currentFlashcard.answer}
                          </p>
                          <div className="absolute bottom-3 left-0 right-0 text-center text-xs text-gray-400">
                            Click "Hide" to see the question again
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </article>
                ) : (
                  <p className="text-center py-8 text-gray-500">
                    No flashcards available
                  </p>
                )}
                <DialogFooter className="flex justify-between space-x-2">
                  <Button
                    onClick={() => {
                      setShowFlashcard(!showFlashcard);
                    }}
                    size="sm"
                    variant="outline"
                    className={cn(
                      "mr-auto",
                      showFlashcard ? "bg-blue-50" : "bg-green-50",
                    )}
                  >
                    {showFlashcard ? "Hide" : "Show"}
                  </Button>
                  <Button
                    onClick={() => {
                      if (questionIndex > 0) {
                        setQuestionIndex(questionIndex - 1);
                        setShowFlashcard(false);
                      }
                    }}
                    disabled={questionIndex === 0}
                    size="sm"
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => {
                      if (questionIndex < flashcards.length - 1) {
                        setQuestionIndex(questionIndex + 1);
                        setShowFlashcard(false);
                      }
                    }}
                    disabled={questionIndex === flashcards.length - 1}
                    size="sm"
                    variant="outline"
                  >
                    Next
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </article>

          <article
            className={cn(
              "space-y-2 bg-white/50 p-4 rounded-lg shadow-sm flex flex-col h-full transform transition-transform hover:shadow-md hover:scale-[1.01]",
            )}
          >
            <h3
              className={cn(
                "text-foreground/70 text-lg font-medium flex items-center",
              )}
            >
              <ClipboardList className="h-5 w-5 mr-2 text-primary/70" />
              Sample Questions
            </h3>
            <p className={cn("text-gray-600 text-sm flex-grow")}>
              {block.sampleTestDescription}
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setQuestionIndex(0);
                  }}
                  size="sm"
                  className="transition-all hover:scale-105 mt-auto w-full sm:w-auto"
                >
                  Practice Your Knowledge
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[320px] lg:max-w-[512px]">
                <DialogHeader>
                  <DialogTitle className="text-primary">
                    Sample Questions: {block.blockTitle}
                  </DialogTitle>
                  <DialogDescription>
                    This is a set of sample questions to help you practice and
                    reinforce your knowledge on {block.blockTitle}. The
                    questions consist of multiple choice questions.
                  </DialogDescription>
                </DialogHeader>
                <article className={cn("space-y-3")}>
                  {!showResults && (
                    <div className="w-full mb-3">
                      <Progress
                        value={
                          ((questionIndex + 1) / sampleTestQuestions.length) *
                          100
                        }
                        className="h-1"
                      />
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>
                          Question {questionIndex + 1} of{" "}
                          {sampleTestQuestions.length}
                        </span>
                        <span>
                          {Math.round(
                            ((questionIndex + 1) / sampleTestQuestions.length) *
                              100,
                          )}
                          % complete
                        </span>
                      </div>
                    </div>
                  )}
                  {showResults ? (
                    <div className="space-y-4 py-4">
                      <div
                        className={cn(
                          "text-center p-4 rounded-lg",
                          testScore && testScore.percentage >= 70
                            ? "bg-green-50 border border-green-100"
                            : "bg-amber-50 border border-amber-100",
                        )}
                      >
                        <h3 className="text-xl font-bold mb-2">
                          {testScore && testScore.percentage >= 70 ? (
                            <span className="text-green-600">Well Done!</span>
                          ) : (
                            <span className="text-amber-600">
                              Keep Practicing
                            </span>
                          )}
                        </h3>
                        <div className="text-lg font-medium">
                          Score: {testScore?.correct}/{testScore?.total} (
                          {testScore?.percentage}%)
                        </div>
                        {testScore && testScore.percentage < 70 && (
                          <p className="text-sm text-gray-600 mt-2">
                            Review the material and try again!
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={cn("space-y-1")}>
                        <h4 className={cn("text-lg font-medium")}>
                          Question {questionIndex + 1}
                        </h4>
                        <p className={cn("text-gray-600 text-sm")}>
                          {currentSampleQuestion?.question}
                        </p>
                      </div>
                      <RadioGroup
                        onValueChange={(value) => {
                          setSampleTestAnswers((prev) => {
                            const answers = [...prev];

                            answers[questionIndex] = value;

                            return answers;
                          });
                        }}
                      >
                        {currentSampleQuestion?.answers.map((option, index) => {
                          return (
                            <div
                              // biome-ignore lint/suspicious/noArrayIndexKey: <>
                              key={index}
                              className="flex items-center space-x-2 py-1 px-2 rounded-lg hover:bg-gray-50" // Reduced padding-y from p-2
                            >
                              <RadioGroupItem
                                checked={
                                  sampleTestAnswers[questionIndex] === option
                                }
                                value={option}
                                id={option}
                              />
                              <Label
                                htmlFor={option}
                                className="flex-1 cursor-pointer text-sm" // Added text-sm for more compact text
                              >
                                {option}
                              </Label>
                            </div>
                          );
                        })}
                      </RadioGroup>
                    </>
                  )}
                </article>
                <DialogFooter>
                  {showResults ? (
                    <>
                      <Button
                        onClick={() => {
                          setShowResults(false);
                          setQuestionIndex(0);
                          setSampleTestAnswers(
                            Array(sampleTestQuestions.length).fill(null),
                          );
                        }}
                        size="sm"
                        className="ml-auto"
                      >
                        <RefreshCcw className="h-4 w-4 mr-2" />
                        Try Again
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => {
                          if (questionIndex > 0) {
                            setQuestionIndex(questionIndex - 1);
                          }
                        }}
                        disabled={questionIndex === 0}
                        size="sm"
                        variant="outline"
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={() => {
                          if (questionIndex < sampleTestQuestions.length - 1) {
                            setQuestionIndex(questionIndex + 1);
                          } else {
                            setTestScore(
                              calculateTestScore(
                                sampleTestAnswers,
                                sampleTestQuestions,
                              ),
                            );
                            setShowResults(true);
                          }
                        }}
                        size="sm"
                        variant={
                          questionIndex === sampleTestQuestions.length - 1
                            ? "default"
                            : "outline"
                        }
                      >
                        {questionIndex === sampleTestQuestions.length - 1
                          ? "Submit"
                          : "Next"}
                      </Button>
                    </>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </article>

          <article
            className={cn(
              "space-y-2 bg-white/50 p-4 rounded-lg shadow-sm flex flex-col h-full transform transition-transform hover:shadow-md hover:scale-[1.01]",
            )}
          >
            <h3
              className={cn(
                "text-foreground/70 text-lg font-medium flex items-center",
              )}
            >
              <FileCheck className="h-5 w-5 mr-2 text-primary/70" />
              Test
            </h3>
            <p className={cn("text-gray-600 text-sm flex-grow")}>
              {block.finalTestDescription}
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setQuestionIndex(0);
                  }}
                  size="sm"
                  className="transition-all hover:scale-105 mt-auto w-full sm:w-auto"
                >
                  Take Final Test
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[320px] lg:max-w-[512px]">
                <DialogHeader>
                  <DialogTitle className="text-primary">
                    Test: {block.blockTitle}
                  </DialogTitle>
                  <DialogDescription>
                    This is a test to assess your knowledge on{" "}
                    {block.blockTitle}. The test consists of multiple choice
                    questions and is timed. Good luck!
                  </DialogDescription>
                </DialogHeader>
                <article className={cn("space-y-3")}>
                  {!showResults && (
                    <div className="w-full mb-3">
                      <Progress
                        value={
                          ((questionIndex + 1) / finalTestQuestions.length) *
                          100
                        }
                        className="h-1"
                      />
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>
                          Question {questionIndex + 1} of{" "}
                          {finalTestQuestions.length}
                        </span>
                        <span>
                          {Math.round(
                            ((questionIndex + 1) / finalTestQuestions.length) *
                              100,
                          )}
                          % complete
                        </span>
                      </div>
                    </div>
                  )}
                  {showResults ? (
                    <div className="space-y-4 py-4">
                      <div
                        className={cn(
                          "text-center p-4 rounded-lg",
                          testScore && testScore.percentage >= 70
                            ? "bg-green-50 border border-green-100"
                            : "bg-amber-50 border border-amber-100",
                        )}
                      >
                        <h3 className="text-xl font-bold mb-2">
                          {testScore && testScore.percentage >= 70 ? (
                            <div className="flex items-center justify-center">
                              <Check className="h-5 w-5 mr-2 text-green-600" />
                              <span className="text-green-600">Passed!</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <X className="h-5 w-5 mr-2 text-amber-600" />
                              <span className="text-amber-600">Not Passed</span>
                            </div>
                          )}
                        </h3>
                        <div className="text-lg font-medium">
                          Score: {testScore?.correct}/{testScore?.total} (
                          {testScore?.percentage}%)
                        </div>
                        {testScore && testScore.percentage < 70 && (
                          <p className="text-sm text-gray-600 mt-2">
                            Review the material and try again!
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={cn("space-y-1")}>
                        <h4 className={cn("text-lg font-medium")}>
                          Question {questionIndex + 1}
                        </h4>
                        <p className={cn("text-gray-600 text-sm")}>
                          {currentFinalQuestion?.question}
                        </p>
                      </div>
                      <RadioGroup
                        onValueChange={(value) => {
                          setFinalTestAnswers((prev) => {
                            const answers = [...prev];

                            answers[questionIndex] = value;

                            return answers;
                          });
                        }}
                      >
                        {currentFinalQuestion?.answers.map((option, index) => {
                          return (
                            <div
                              // biome-ignore lint/suspicious/noArrayIndexKey: <>
                              key={index}
                              className="flex items-center space-x-2 py-1 px-2 rounded-lg hover:bg-gray-50" // Reduced padding-y from p-2
                            >
                              <RadioGroupItem
                                checked={
                                  finalTestAnswers[questionIndex] === option
                                }
                                value={option}
                                id={option}
                              />
                              <Label
                                htmlFor={option}
                                className="flex-1 cursor-pointer text-sm" // Added text-sm for more compact text
                              >
                                {option}
                              </Label>
                            </div>
                          );
                        })}
                      </RadioGroup>
                    </>
                  )}
                </article>
                <DialogFooter>
                  {showResults ? (
                    <>
                      <Button
                        onClick={() => {
                          setShowResults(false);
                          setQuestionIndex(0);
                          setFinalTestAnswers(
                            Array(finalTestQuestions.length).fill(null),
                          );
                        }}
                        size="sm"
                        className="ml-auto"
                      >
                        <RefreshCcw className="h-4 w-4 mr-2" />
                        Try Again
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => {
                          if (questionIndex > 0) {
                            setQuestionIndex(questionIndex - 1);
                          }
                        }}
                        disabled={questionIndex === 0}
                        size="sm"
                        variant="outline"
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={() => {
                          if (questionIndex < finalTestQuestions.length - 1) {
                            setQuestionIndex(questionIndex + 1);
                          } else {
                            setTestScore(
                              calculateTestScore(
                                finalTestAnswers,
                                finalTestQuestions,
                              ),
                            );
                            setShowResults(true);
                          }
                        }}
                        size="sm"
                        variant={
                          questionIndex === finalTestQuestions.length - 1
                            ? "default"
                            : "outline"
                        }
                      >
                        {questionIndex === finalTestQuestions.length - 1
                          ? "Submit"
                          : "Next"}
                      </Button>
                    </>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </article>
        </div>
      </div>
      <BlockNotes showNotes={showNotes} block={block} />
    </section>
  );
}
