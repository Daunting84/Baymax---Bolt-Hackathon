import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { PlayIcon, PauseIcon, RotateCcwIcon, ArrowLeftIcon, ClockIcon } from "lucide-react";

interface Exercise {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  benefits: string[];
  pattern: {
    inhale: number;
    hold?: number;
    exhale: number;
    holdEmpty?: number;
    isWimHof?: boolean;
  };
  icon: React.ComponentType<{ className?: string }>;
}

interface BreathworkExerciseProps {
  exercise: Exercise;
  onBack: () => void;
}

export const BreathworkExercise = ({ exercise, onBack }: BreathworkExerciseProps): JSX.Element => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "holdEmpty">("inhale");
  const [count, setCount] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  
  // Wim Hof specific states
  const [wimHofRound, setWimHofRound] = useState(1);
  const [wimHofBreathCount, setWimHofBreathCount] = useState(0);
  const [wimHofPhase, setWimHofPhase] = useState<"breathing" | "retention" | "recovery">("breathing");
  const [retentionTime, setRetentionTime] = useState(0);

  // Initialize count based on current phase
  const getInitialCount = (currentPhase: "inhale" | "hold" | "exhale" | "holdEmpty") => {
    const pattern = exercise.pattern;
    switch (currentPhase) {
      case "inhale":
        return pattern.inhale;
      case "hold":
        return pattern.hold || 0;
      case "exhale":
        return pattern.exhale;
      case "holdEmpty":
        return pattern.holdEmpty || 0;
      default:
        return pattern.inhale;
    }
  };

  // Set initial count when component mounts or exercise changes
  useEffect(() => {
    setCount(getInitialCount("inhale"));
    setPhase("inhale");
  }, [exercise]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        if (exercise.pattern.isWimHof) {
          // Wim Hof Method logic
          if (wimHofPhase === "breathing") {
            // 30 breathing cycles
            setCount((prevCount) => {
              if (prevCount <= 1) {
                setPhase((currentPhase) => {
                  if (currentPhase === "inhale") {
                    return "exhale";
                  } else {
                    // Completed one breath cycle
                    setWimHofBreathCount((prev) => {
                      const newCount = prev + 1;
                      if (newCount >= 30) {
                        // Switch to retention phase after 30 breaths
                        setWimHofPhase("retention");
                        setRetentionTime(0);
                        return 0; // Reset breath count
                      }
                      return newCount;
                    });
                    return "inhale";
                  }
                });
                return phase === "inhale" ? exercise.pattern.exhale : exercise.pattern.inhale;
              }
              return prevCount - 1;
            });
          } else if (wimHofPhase === "retention") {
            // Retention phase - count up instead of down
            setRetentionTime((prev) => prev + 1);
            setCount(retentionTime + 1); // Show increasing count
            setPhase("holdEmpty");
          } else if (wimHofPhase === "recovery") {
            // Recovery breath (15 seconds)
            setCount((prevCount) => {
              if (prevCount <= 1) {
                // Complete recovery, start next round or finish
                if (wimHofRound < 4) {
                  setWimHofRound((prev) => prev + 1);
                  setWimHofPhase("breathing");
                  setWimHofBreathCount(0);
                  setPhase("inhale");
                  return exercise.pattern.inhale;
                } else {
                  // All rounds complete
                  setIsActive(false);
                  return 0;
                }
              }
              return prevCount - 1;
            });
          }
        } else {
          // Regular breathing patterns
          setCount((prevCount) => {
            if (prevCount <= 1) {
              setPhase((currentPhase) => {
                const pattern = exercise.pattern;
                let nextPhase: "inhale" | "hold" | "exhale" | "holdEmpty" = "inhale";
                
                if (currentPhase === "inhale") {
                  nextPhase = pattern.hold ? "hold" : "exhale";
                } else if (currentPhase === "hold") {
                  nextPhase = "exhale";
                } else if (currentPhase === "exhale") {
                  if (pattern.holdEmpty) {
                    nextPhase = "holdEmpty";
                  } else {
                    setCycle((prev) => prev + 1);
                    nextPhase = "inhale";
                  }
                } else if (currentPhase === "holdEmpty") {
                  setCycle((prev) => prev + 1);
                  nextPhase = "inhale";
                }
                
                return nextPhase;
              });
              
              // Return the duration for the next phase
              return getInitialCount(phase === "inhale" ? 
                (exercise.pattern.hold ? "hold" : "exhale") :
                phase === "hold" ? "exhale" :
                phase === "exhale" ? 
                  (exercise.pattern.holdEmpty ? "holdEmpty" : "inhale") :
                "inhale"
              );
            }
            return prevCount - 1;
          });
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, exercise.pattern, wimHofPhase, phase, retentionTime, wimHofRound]);

  // Timer effect - runs every second when active
  useEffect(() => {
    let timerInterval: NodeJS.Timeout;

    if (isActive) {
      timerInterval = setInterval(() => {
        setTotalTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [isActive]);

  const handleStart = () => {
    if (!isActive) {
      // When starting, ensure we begin with the first phase
      setPhase("inhale");
      setCount(exercise.pattern.inhale);
      
      // Reset Wim Hof specific states
      if (exercise.pattern.isWimHof) {
        setWimHofRound(1);
        setWimHofBreathCount(0);
        setWimHofPhase("breathing");
        setRetentionTime(0);
      }
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase("inhale");
    setCount(exercise.pattern.inhale);
    setCycle(0);
    setTotalTime(0);
    
    // Reset Wim Hof specific states
    if (exercise.pattern.isWimHof) {
      setWimHofRound(1);
      setWimHofBreathCount(0);
      setWimHofPhase("breathing");
      setRetentionTime(0);
    }
  };

  // Manual retention completion for Wim Hof
  const handleRetentionComplete = () => {
    if (exercise.pattern.isWimHof && wimHofPhase === "retention") {
      setWimHofPhase("recovery");
      setPhase("hold");
      setCount(15); // 15 second recovery breath
    }
  };

  const getPhaseText = () => {
    if (exercise.pattern.isWimHof) {
      if (wimHofPhase === "breathing") {
        return phase === "inhale" ? "Deep Inhale" : "Quick Exhale";
      } else if (wimHofPhase === "retention") {
        return "Hold Empty";
      } else {
        return "Recovery Breath";
      }
    }
    
    switch (phase) {
      case "inhale":
        return "Breathe In";
      case "hold":
        return "Hold";
      case "exhale":
        return "Breathe Out";
      case "holdEmpty":
        return "Hold Empty";
    }
  };

  // Fixed circle scaling - properly synchronized with phases and timing
  const getCircleScale = () => {
    if (!isActive) {
      return "scale-75"; // Start small when not active
    }
    
    if (exercise.pattern.isWimHof) {
      if (wimHofPhase === "breathing") {
        return phase === "inhale" ? "scale-150" : "scale-75";
      } else if (wimHofPhase === "retention") {
        return "scale-75"; // Stay small during retention
      } else {
        return "scale-150"; // Expanded during recovery breath
      }
    }
    
    // For regular breathing patterns
    switch (phase) {
      case "inhale":
        return "scale-150"; // Expand during inhale
      case "hold":
        return "scale-150"; // Stay expanded during hold
      case "exhale":
        return "scale-75"; // Contract during exhale
      case "holdEmpty":
        return "scale-75"; // Stay contracted during hold empty
      default:
        return "scale-75";
    }
  };

  // Fixed transition duration - use actual phase durations for smooth animation
  const getTransitionDuration = () => {
    if (!isActive) return "0.5s";
    
    const pattern = exercise.pattern;
    
    if (pattern.isWimHof) {
      if (wimHofPhase === "breathing") {
        return phase === "inhale" ? `${pattern.inhale}s` : `${pattern.exhale}s`;
      } else if (wimHofPhase === "retention") {
        return "1s"; // Slow transition for retention
      } else {
        return "2s"; // Slow transition for recovery
      }
    }
    
    // Use the actual duration of the current phase for smooth transitions
    switch (phase) {
      case "inhale":
        return `${pattern.inhale}s`;
      case "hold":
        return "0.3s"; // Quick transition to hold position
      case "exhale":
        return `${pattern.exhale}s`;
      case "holdEmpty":
        return "0.3s"; // Quick transition to hold empty position
      default:
        return "1s";
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get cycle info text
  const getCycleInfo = () => {
    if (exercise.pattern.isWimHof) {
      if (wimHofPhase === "breathing") {
        return `Round ${wimHofRound}/4 - Breath ${wimHofBreathCount + 1}/30`;
      } else if (wimHofPhase === "retention") {
        return `Round ${wimHofRound}/4 - Retention: ${retentionTime}s`;
      } else {
        return `Round ${wimHofRound}/4 - Recovery`;
      }
    }
    return `Cycle ${cycle}`;
  };

  // *** EASY DIMENSION CONTROLS - Change these values to adjust the info card ***
  const INFO_CARD_WIDTH = 350;     // Width of the info card (make smaller for less wide)
  const INFO_CARD_HEIGHT = 380;    // Height of the info card
  const INFO_CARD_TOP = 10;        // Distance from top (negative moves up)
  const INFO_CARD_LEFT = -100;     // Distance from left (negative moves left)

  return (
    <div className="relative w-full h-full">
      {/* Background blur effects - matching original design */}
      <div className="absolute w-[544px] h-[464px] top-0 left-[231px]">
        <div className="relative h-[464px]">
          <div className="absolute w-[280px] h-[280px] top-0 left-[264px] bg-[#aaaaaa] rounded-[140px] blur-[150px]" />
          <div className="absolute w-[414px] h-[414px] top-[50px] left-0 bg-[#b8b8b8] rounded-[207px] blur-[250px]" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col h-full p-6">
        {/* BREATHING CIRCLE AND CONTROLS - BACK TO ORIGINAL POSITION */}
        <div className="absolute top-[-250px] right-[-100px] flex flex-col items-center gap-6">
          {/* Title and Subtitle */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#160211] [font-family:'Manrope',Helvetica] mb-2">
              {exercise.title}
            </h1>
            <p className="text-sm text-[#00000099] [font-family:'Manrope',Helvetica]">
              {exercise.subtitle}
            </p>
          </div>

          {/* Timer Display - Added more spacing with mb-8 instead of mb-4 */}
          <div className="mt-8 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-[#160211]" />
                  <span className="text-lg font-medium text-[#160211] [font-family:'Manrope',Helvetica]">
                    {formatTime(totalTime)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Breathing Circle */}
          <div className="flex flex-col items-center mb-6">
            <div
              className={`w-40 h-40 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center transition-transform ease-in-out ${getCircleScale()}`}
              style={{ transitionDuration: getTransitionDuration() }}
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{count}</div>
                <div className="text-sm text-white/80 [font-family:'Manrope',Helvetica]">
                  {getPhaseText()}
                </div>
              </div>
            </div>
          </div>

          {/* Cycle Info */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/50 mb-4">
            <CardContent className="p-4 text-center">
              <div className="text-lg font-medium text-[#160211] [font-family:'Manrope',Helvetica] mb-1">
                {getCycleInfo()}
              </div>
              <div className="text-sm text-[#00000099] [font-family:'Manrope',Helvetica]">
                Current phase: {getPhaseText()}
              </div>
            </CardContent>
          </Card>

          {/* Control Buttons */}
          <div className="flex flex-col gap-4 items-center">
            <div className="flex gap-4">
              <Button
                onClick={handleStart}
                className="bg-[#040404] hover:bg-[#222222] text-white rounded-full px-6"
              >
                {isActive ? (
                  <>
                    <PauseIcon className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <PlayIcon className="w-4 h-4 mr-2" />
                    Start
                  </>
                )}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="rounded-full px-6"
              >
                <RotateCcwIcon className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            {/* Wim Hof specific button for retention completion */}
            {exercise.pattern.isWimHof && wimHofPhase === "retention" && isActive && (
              <Button
                onClick={handleRetentionComplete}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
              >
                Complete Retention
              </Button>
            )}
            
            {/* Back button */}
            <Button
              onClick={onBack}
              variant="ghost"
              className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Exercises
            </Button>
          </div>
        </div>

        {/* INFO CARD - BACK ON THE LEFT WITH EASY DIMENSION CONTROLS */}
        <div 
          className="absolute"
          style={{ 
            top: `${INFO_CARD_TOP}px`,
            left: `${INFO_CARD_LEFT}px`,
            width: `${INFO_CARD_WIDTH}px`,
            height: `${INFO_CARD_HEIGHT}px`
          }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border border-white/50 h-full">
            <CardContent className="p-4 h-full flex flex-col">
              {/* About This Exercise */}
              <div className="mb-4">
                <h3 className="font-semibold text-[#160211] [font-family:'Manrope',Helvetica] mb-2 text-sm">
                  About This Exercise
                </h3>
                <p className="text-xs text-[#160211] [font-family:'Manrope',Helvetica] opacity-80 mb-3 leading-relaxed">
                  {exercise.description}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#160211] [font-family:'Manrope',Helvetica]">
                      Duration:
                    </span>
                    <span className="text-xs text-[#00000099] [font-family:'Manrope',Helvetica]">
                      {exercise.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#160211] [font-family:'Manrope',Helvetica]">
                      Difficulty:
                    </span>
                    <span className="text-xs text-[#00000099] [font-family:'Manrope',Helvetica]">
                      {exercise.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Breathing Pattern */}
              <div className="mb-4">
                <h3 className="font-semibold text-[#160211] [font-family:'Manrope',Helvetica] mb-2 text-sm">
                  Breathing Pattern
                </h3>
                {exercise.pattern.isWimHof ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#160211] [font-family:'Manrope',Helvetica]">Deep breaths:</span>
                      <span className="text-xs font-medium text-[#160211] [font-family:'Manrope',Helvetica]">30 cycles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#160211] [font-family:'Manrope',Helvetica]">Inhale:</span>
                      <span className="text-xs font-medium text-[#160211] [font-family:'Manrope',Helvetica]">{exercise.pattern.inhale}s</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#160211] [font-family:'Manrope',Helvetica]">Exhale:</span>
                      <span className="text-xs font-medium text-[#160211] [font-family:'Manrope',Helvetica]">{exercise.pattern.exhale}s</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#160211] [font-family:'Manrope',Helvetica]">Retention:</span>
                      <span className="text-xs font-medium text-[#160211] [font-family:'Manrope',Helvetica]">As long as comfortable</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#160211] [font-family:'Manrope',Helvetica]">Rounds:</span>
                      <span className="text-xs font-medium text-[#160211] [font-family:'Manrope',Helvetica]">4 total</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#160211] [font-family:'Manrope',Helvetica]">Inhale:</span>
                      <span className="text-xs font-medium text-[#160211] [font-family:'Manrope',Helvetica]">
                        {exercise.pattern.inhale}s
                      </span>
                    </div>
                    {exercise.pattern.hold && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#160211] [font-family:'Manrope',Helvetica]">Hold:</span>
                        <span className="text-xs font-medium text-[#160211] [font-family:'Manrope',Helvetica]">
                          {exercise.pattern.hold}s
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#160211] [font-family:'Manrope',Helvetica]">Exhale:</span>
                      <span className="text-xs font-medium text-[#160211] [font-family:'Manrope',Helvetica]">
                        {exercise.pattern.exhale}s
                      </span>
                    </div>
                    {exercise.pattern.holdEmpty && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#160211] [font-family:'Manrope',Helvetica]">Hold Empty:</span>
                        <span className="text-xs font-medium text-[#160211] [font-family:'Manrope',Helvetica]">
                          {exercise.pattern.holdEmpty}s
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Benefits */}
              <div className="flex-1">
                <h3 className="font-semibold text-[#160211] [font-family:'Manrope',Helvetica] mb-2 text-sm">
                  Benefits
                </h3>
                <div className="space-y-2">
                  {exercise.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full flex-shrink-0"></div>
                      <span className="text-xs text-[#160211] [font-family:'Manrope',Helvetica] opacity-80">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};