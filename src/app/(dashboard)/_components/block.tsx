"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import {
  BookOpen,
  Check,
  ClipboardList,
  FileCheck,
  FlipHorizontal,
  Pause,
  Play,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { cn } from "~/lib/utils";

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

export function Block({
  block,
  showNotes,
}: Readonly<{ block: Block; showNotes: boolean }>) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(block.flashcards);
  const [showFlashcard, setShowFlashcard] = useState(false);
  const [sampleTestQuestions, setSampleTestQuestions] = useState<
    TestQuestion[]
  >(block.sampleTestQuestions);
  const [finalTestQuestions, setFinalTestQuestions] = useState<TestQuestion[]>(
    block.finalTestQuestions,
  );
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

  // New state for weeks and audio selection
  const [selectedWeekId, setSelectedWeekId] = useState<string>("");
  const [selectedAudioId, setSelectedAudioId] = useState<string>("");
  const [currentAudio, setCurrentAudio] = useState<Audio | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Initialize selected week and audio when block data is loaded
  useEffect(() => {
    setFlashcards(block.flashcards);
    setSampleTestQuestions(block.sampleTestQuestions);
    setFinalTestQuestions(block.finalTestQuestions);
    
    // Initialize week and audio selection if weeks exist
    if (block.weeks && block.weeks.length > 0) {
      const firstWeek = block.weeks[0];
      setSelectedWeekId(firstWeek.id);
      
      if (firstWeek.audios && firstWeek.audios.length > 0) {
        const firstAudio = firstWeek.audios[0];
        setSelectedAudioId(firstAudio.id);
        setCurrentAudio(firstAudio);
      } else {
        setCurrentAudio(null);
      }
    }
  }, [block]);

  // Update current audio when selected week or audio changes
  useEffect(() => {
    if (selectedWeekId && selectedAudioId) {
      const week = block.weeks.find(w => w.id === selectedWeekId);
      if (week) {
        const audio = week.audios.find(a => a.id === selectedAudioId);
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
    }
  }, [selectedWeekId, selectedAudioId, block.weeks]);

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
    questions: TestQuestion[],
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
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
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
        <article
          className={cn("space-y-2 bg-white/50 p-4 rounded-lg shadow-sm")}
        >
          <h3
            className={cn(
              "text-foreground/70 text-lg font-medium flex items-center"
            )}
          >
            <Volume2 className="h-5 w-5 mr-2 text-primary/70" />
            Audio Content
          </h3>
          
          {/* Week and Audio Selection UI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
            <div>
              <Label htmlFor="week-select" className="text-xs text-gray-500 mb-1 block">
                Select Week
              </Label>
              <Select
                value={selectedWeekId}
                onValueChange={(value) => {
                  setSelectedWeekId(value);
                  // Reset audio selection when week changes
                  const week = block.weeks.find(w => w.id === value);
                  if (week && week.audios.length > 0) {
                    setSelectedAudioId(week.audios[0].id);
                  } else {
                    setSelectedAudioId("");
                  }
                }}
              >
                <SelectTrigger id="week-select" className="bg-white/80">
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
            
            <div>
              <Label htmlFor="audio-select" className="text-xs text-gray-500 mb-1 block">
                Select Audio
              </Label>
              <Select
                value={selectedAudioId}
                onValueChange={setSelectedAudioId}
                disabled={!selectedWeekId}
              >
                <SelectTrigger id="audio-select" className="bg-white/80">
                  <SelectValue placeholder="Select an audio" />
                </SelectTrigger>
                <SelectContent>
                  {block.weeks
                    .find(w => w.id === selectedWeekId)
                    ?.audios.map((audio) => (
                      <SelectItem key={audio.id} value={audio.id}>
                        {audio.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {currentAudio ? (
            <div className="bg-white/80 rounded-lg p-3 shadow-sm">
              <div className="mb-2 text-sm font-medium text-gray-700">
                {currentAudio.title}
              </div>
              {/* biome-ignore lint/a11y/useMediaCaption: <> */}
              <audio
                ref={audioRef}
                src={currentAudio.audioLink}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleAudioEnd}
                className="hidden"
              />
              <div className="flex items-center space-x-2 mb-2">
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

                <Button
                  onClick={toggleMute}
                  size="sm"
                  variant="ghost"
                  className="w-8 h-8 p-0"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-primary/70" />
                  )}
                </Button>

                <div className="flex-1 flex items-center space-x-2">
                  <span className="text-xs text-gray-500 w-10">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                  />
                  <span className="text-xs text-gray-500 w-10">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 rounded-lg p-4 text-center text-gray-500">
              {block.weeks.length > 0 ? 
                "Select a week and audio to listen" : 
                "No audio content available for this block"}
            </div>
          )}
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
