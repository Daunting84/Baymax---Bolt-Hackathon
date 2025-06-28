import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { WindIcon, ArrowLeftIcon, ClockIcon, HeartIcon, BrainIcon, ZapIcon } from "lucide-react";
import { BreathworkExercise } from "../components/BreathworkExercise";

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
    isWimHof?: boolean; // Special flag for Wim Hof method
  };
  icon: React.ComponentType<{ className?: string }>;
}

const exercises: Exercise[] = [
  {
    id: "4-4-4",
    title: "4-4-4 Breathing",
    subtitle: "Box Breathing",
    description: "A simple, balanced breathing technique that helps reduce stress and improve focus.",
    duration: "5-10 minutes",
    difficulty: "Beginner",
    benefits: ["Reduces stress", "Improves focus", "Calms nervous system"],
    pattern: { inhale: 4, hold: 4, exhale: 4 },
    icon: WindIcon,
  },
  {
    id: "4-7-8",
    title: "4-7-8 Breathing",
    subtitle: "Relaxing Breath",
    description: "A powerful technique for relaxation and better sleep, developed by Dr. Andrew Weil.",
    duration: "3-5 minutes",
    difficulty: "Beginner",
    benefits: ["Promotes sleep", "Reduces anxiety", "Lowers heart rate"],
    pattern: { inhale: 4, hold: 7, exhale: 8 },
    icon: HeartIcon,
  },
  {
    id: "coherent",
    title: "Coherent Breathing",
    subtitle: "5-5 Rhythm",
    description: "Breathe at 5 breaths per minute to achieve heart rate variability coherence.",
    duration: "10-20 minutes",
    difficulty: "Intermediate",
    benefits: ["Heart coherence", "Emotional balance", "Stress resilience"],
    pattern: { inhale: 6, exhale: 6 },
    icon: HeartIcon,
  },
  {
    id: "wim-hof",
    title: "Wim Hof Method",
    subtitle: "Power Breathing",
    description: "30 deep breaths followed by breath retention. Repeat for 3-4 rounds. Based on the Wim Hof breathing technique.",
    duration: "15-20 minutes",
    difficulty: "Advanced",
    benefits: ["Increases energy", "Boosts immunity", "Improves cold tolerance"],
    pattern: { inhale: 2, exhale: 1, holdEmpty: 60, isWimHof: true },
    icon: ZapIcon,
  },
  {
    id: "alternate-nostril",
    title: "Alternate Nostril",
    subtitle: "Nadi Shodhana",
    description: "Ancient yogic breathing practice that balances the nervous system.",
    duration: "5-15 minutes",
    difficulty: "Intermediate",
    benefits: ["Balances mind", "Improves concentration", "Harmonizes energy"],
    pattern: { inhale: 4, hold: 2, exhale: 4 },
    icon: BrainIcon,
  },
  {
    id: "breath-of-fire",
    title: "Breath of Fire",
    subtitle: "Kapalabhati",
    description: "Rapid, rhythmic breathing that energizes and detoxifies the body.",
    duration: "3-5 minutes",
    difficulty: "Advanced",
    benefits: ["Energizes body", "Detoxifies", "Strengthens core"],
    pattern: { inhale: 1, exhale: 1 },
    icon: ZapIcon,
  }
];

export const Breathwork = (): JSX.Element => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-gray-100 text-gray-700";
      case "Intermediate":
        return "bg-gray-200 text-gray-800";
      case "Advanced":
        return "bg-gray-300 text-gray-900";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (selectedExercise) {
    return (
      <BreathworkExercise 
        exercise={selectedExercise} 
        onBack={() => setSelectedExercise(null)}
      />
    );
  }

  return (
    <div className="relative w-full h-full p-6">
      {/* Background blur effects */}
      <div className="absolute w-[544px] h-[464px] top-0 left-[231px]">
        <div className="relative h-[464px]">
          <div className="absolute w-[280px] h-[280px] top-0 left-[264px] bg-[#aaaaaa] rounded-[140px] blur-[150px]" />
          <div className="absolute w-[414px] h-[414px] top-[50px] left-0 bg-[#b8b8b8] rounded-[207px] blur-[250px]" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* BREATHING EXERCISES CARD - Easy to reposition by changing these style values */}
        <div 
          className="absolute"
          style={{ 
            top: '-250px',        // Vertical position - change this to move up/down
            right: '-100px',      // Horizontal position - change this to move left/right  
            width: '320px'       // Width of the card
          }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border border-white/50 p-4">
            <CardContent className="p-0">
              {/* Header inside the card */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <WindIcon className="w-6 h-6 text-[#160211]" />
                <h1 className="text-lg font-semibold text-[#160211] [font-family:'Manrope',Helvetica]">
                  Breathing Exercises
                </h1>
              </div>

              {/* Subtitle inside the card */}
              <p className="text-sm text-[#00000099] [font-family:'Manrope',Helvetica] text-center mb-4">
                Choose a breathing exercise to help you relax, focus, or energize
              </p>

              {/* Scrollable exercise list */}
              <div 
                className="overflow-y-auto"
                style={{ 
                  height: '400px',     // Height of the scrollable area
                  paddingRight: '8px'  // Space for scrollbar
                }}
              >
                <div className="flex flex-col gap-3">
                  {exercises.map((exercise) => {
                    const IconComponent = exercise.icon;
                    return (
                      <Card
                        key={exercise.id}
                        className="bg-white/60 backdrop-blur-sm border border-white/30 hover:bg-white/80 transition-all duration-200 cursor-pointer group flex-shrink-0"
                        onClick={() => setSelectedExercise(exercise)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2 mb-2">
                            <div className="p-1.5 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors duration-200">
                              <IconComponent className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-[#160211] [font-family:'Manrope',Helvetica] text-xs mb-1">
                                {exercise.title}
                              </h3>
                              <p className="text-xs text-[#00000099] [font-family:'Manrope',Helvetica] mb-2">
                                {exercise.subtitle}
                              </p>
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                                  {exercise.difficulty}
                                </span>
                                <div className="flex items-center gap-1 text-xs text-[#00000099]">
                                  <ClockIcon className="w-3 h-3" />
                                  {exercise.duration}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-xs text-[#160211] [font-family:'Manrope',Helvetica] opacity-80 mb-2 line-clamp-2">
                            {exercise.description}
                          </p>
                          
                          <div className="mb-2">
                            <p className="text-xs font-medium text-[#160211] [font-family:'Manrope',Helvetica] mb-1">
                              Benefits:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {exercise.benefits.slice(0, 2).map((benefit, index) => (
                                <span
                                  key={index}
                                  className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs [font-family:'Manrope',Helvetica]"
                                >
                                  {benefit}
                                </span>
                              ))}
                              {exercise.benefits.length > 2 && (
                                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs [font-family:'Manrope',Helvetica]">
                                  +{exercise.benefits.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>

                          <Button
                            className="w-full bg-[#040404] hover:bg-[#222222] text-white rounded-lg text-xs py-1.5"
                          >
                            Start Exercise
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};