import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { BookOpenIcon, SendIcon, PlusIcon, RefreshCwIcon } from "lucide-react";

interface JournalEntry {
  id: number;
  prompt: string;
  response: string;
  date: string;
  timestamp: Date;
}

export const Journal = (): JSX.Element => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [currentPrompts, setCurrentPrompts] = useState<string[]>([]);
  const [isUnpromptedMode, setIsUnpromptedMode] = useState(false);

  // Comprehensive list of journal prompts
  const allJournalPrompts = [
    "What are you grateful for today?",
    "What challenged you today and how did you handle it?",
    "Describe a moment that made you smile today.",
    "What did you learn about yourself today?",
    "How are you feeling right now and why?",
    "What would you like to accomplish tomorrow?",
    "What's one thing you're proud of this week?",
    "How did you take care of yourself today?",
    "What's something new you discovered recently?",
    "Who made a positive impact on your day?",
    "What's a fear you'd like to overcome?",
    "Describe your ideal peaceful moment.",
    "What's a skill you'd like to develop?",
    "How did you show kindness today?",
    "What's weighing on your mind right now?",
    "What made you feel energized today?",
    "What's a memory that brings you joy?",
    "How do you want to grow as a person?",
    "What's something you're looking forward to?",
    "What would you tell your younger self?",
    "What's a habit you'd like to change?",
    "How did you connect with others today?",
    "What's something beautiful you noticed?",
    "What's a goal that excites you?",
    "How do you define success for yourself?",
    "What's a lesson you learned from a mistake?",
    "What makes you feel most alive?",
    "How do you handle stress and pressure?",
    "What's a compliment you'd give yourself?",
    "What's something you're curious about?",
    "How do you want to be remembered?",
    "What's a tradition that's meaningful to you?",
    "What's something you've been avoiding?",
    "How do you recharge when you're tired?",
    "What's a book, movie, or song that moved you?",
    "What's something you'd like to forgive?",
    "How do you express creativity in your life?",
    "What's a place that makes you feel at peace?",
    "What's something you're learning to accept?",
    "How do you celebrate small victories?",
    "What's a relationship you're grateful for?",
    "What's something that surprised you recently?",
    "How do you stay motivated during tough times?",
    "What's a dream you're working toward?",
    "What's something you love about your personality?",
    "How do you practice self-compassion?",
    "What's a change you've noticed in yourself?",
    "What's something that makes you laugh?",
    "How do you find balance in your life?",
    "What's a value that guides your decisions?",
    "What's something you're excited to share?",
    "How do you deal with uncertainty?",
    "What's a moment when you felt truly understood?",
    "What's something you'd like to let go of?",
    "How do you nurture your relationships?",
    "What's a strength you didn't know you had?",
    "What's something that inspires you?",
    "How do you practice gratitude daily?",
    "What's a risk you're glad you took?",
    "What's something you're passionate about?",
    "How do you handle disappointment?",
    "What's a quality you admire in others?",
    "What's something you're working to improve?",
    "How do you find joy in ordinary moments?",
    "What's a boundary you've learned to set?",
    "What's something that gives your life meaning?",
    "How do you stay true to yourself?",
    "What's a hope you have for the future?",
    "What's something you've overcome?",
    "How do you show love to the people you care about?",
    "What's a moment when you felt proud of yourself?",
    "What's something you're still figuring out?"
  ];

  // Function to get 4 random prompts
  const getRandomPrompts = () => {
    const shuffled = [...allJournalPrompts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  };

  // Function to format date and time for display
  const formatDateTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    } else if (diffInMinutes < 1440) { // Less than 24 hours
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else {
      // More than 24 hours, show actual date and time
      return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  // Set random prompts on component mount
  useEffect(() => {
    setCurrentPrompts(getRandomPrompts());
  }, []);

  const handlePromptClick = (prompt: string) => {
    setSelectedPrompt(prompt);
    setIsUnpromptedMode(false);
    setInputValue("");
  };

  const handleUnpromptedClick = () => {
    setIsUnpromptedMode(true);
    setSelectedPrompt(null);
    setInputValue("");
  };

  const handleRefreshPrompts = () => {
    setCurrentPrompts(getRandomPrompts());
    // Clear any selected prompt when refreshing
    setSelectedPrompt(null);
    setIsUnpromptedMode(false);
  };

  const handleSubmitEntry = () => {
    if ((selectedPrompt || isUnpromptedMode) && inputValue.trim()) {
      const now = new Date();
      
      const newEntry: JournalEntry = {
        id: entries.length + 1,
        prompt: selectedPrompt || "Free writing",
        response: inputValue.trim(),
        date: formatDateTime(now),
        timestamp: now,
      };
      
      setEntries([newEntry, ...entries]);
      
      // Add to history with proper timestamp formatting
      const historyEntry = {
        id: Date.now(),
        type: "journal",
        title: "Journal Entry",
        date: formatDateTime(now), // Use the same formatting function
        iconName: "BookOpenIcon", // Store icon name as string instead of component
        description: `${selectedPrompt ? `Prompt: "${selectedPrompt}"` : "Free writing"} - Response: "${inputValue.trim().substring(0, 50)}${inputValue.trim().length > 50 ? '...' : ''}"`,
        prompt: selectedPrompt || "Free writing",
        response: inputValue.trim(),
        timestamp: now.toISOString(), // Store as ISO string for localStorage
      };
      
      // Store in localStorage for now (in a real app, this would go to a database)
      const existingHistory = JSON.parse(localStorage.getItem('journalHistory') || '[]');
      localStorage.setItem('journalHistory', JSON.stringify([historyEntry, ...existingHistory]));
      
      setSelectedPrompt(null);
      setIsUnpromptedMode(false);
      setInputValue("");
      
      // Generate new prompts after submitting
      setCurrentPrompts(getRandomPrompts());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmitEntry();
    }
  };

  return (
    <div className="relative w-full h-full p-6">
      {/* Background blur effects - UPDATED TO MATCH DASHBOARD */}
      <div className="absolute w-[544px] h-[464px] top-0 left-[231px]">
        <div className="relative h-[464px]">
          <div className="absolute w-[280px] h-[280px] top-0 left-[264px] bg-[#aaaaaa] rounded-[140px] blur-[150px]" />
          <div className="absolute w-[414px] h-[414px] top-[50px] left-0 bg-[#b8b8b8] rounded-[207px] blur-[250px]" />
        </div>
      </div>

      <div className="relative z-10">
        {/* JOURNAL CARD - Easy to reposition by changing these style values */}
        <div 
          className="absolute"
          style={{ 
            top: '-250px',      // Vertical position - change this to move up/down
            right: '-100px',    // Horizontal position - change this to move left/right
            width: '320px'      // Width of the card - made smaller
          }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border border-white/50 p-4">
            <CardContent className="p-0">
              {/* Header - more compact */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <BookOpenIcon className="w-6 h-6 text-[#160211]" />
                <h1 className="text-lg font-semibold text-[#160211] [font-family:'Manrope',Helvetica]">
                  My Journal
                </h1>
              </div>

              {/* Subtitle - matching Breathwork color */}
              <p className="text-sm text-[#00000099] [font-family:'Manrope',Helvetica] text-center mb-4">
                Choose a prompt to write about
              </p>

              {/* Prompt Cards - more compact with subtle outlines */}
              <div className="flex flex-col gap-2 mb-4">
                {currentPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className={`text-left h-auto p-3 rounded-lg transition-all duration-200 w-full border ${
                      selectedPrompt === prompt
                        ? "bg-blue-100 border-2 border-blue-300 text-blue-800"
                        : "bg-white/80 hover:bg-white/90 text-[#160211] border border-gray-200/50"
                    }`}
                    onClick={() => handlePromptClick(prompt)}
                  >
                    <span className="text-xs [font-family:'Manrope',Helvetica] leading-relaxed">
                      {prompt}
                    </span>
                  </Button>
                ))}
              </div>
              
              {/* Action buttons - smaller and more compact */}
              <div className="flex justify-center gap-2 mb-3">
                <Button
                  variant="outline"
                  size="sm"
                  className={`transition-all duration-200 text-xs border ${
                    isUnpromptedMode
                      ? "bg-green-100 border-2 border-green-300 text-green-800"
                      : "bg-white/80 hover:bg-white/90 text-[#160211] border border-gray-200/50"
                  }`}
                  onClick={handleUnpromptedClick}
                >
                  <PlusIcon className="w-3 h-3 mr-1" />
                  Free write
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/80 hover:bg-white/90 text-[#160211] border border-gray-200/50 transition-all duration-200 text-xs"
                  onClick={handleRefreshPrompts}
                >
                  <RefreshCwIcon className="w-3 h-3 mr-1" />
                  Refresh
                </Button>
              </div>

              {/* Info message - smaller */}
              <Card className="bg-white/60 backdrop-blur-sm border border-white/50">
                <CardContent className="p-2">
                  <p className="text-xs text-[#160211] [font-family:'Manrope',Helvetica] opacity-70 text-center">
                    Entries saved in <span className="font-medium">History</span>
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* BOTTOM WRITING BAR - Centered with fixed width like chat */}
      {(selectedPrompt || isUnpromptedMode) && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20 w-[1024px]">
          {/* Selected Prompt Display */}
          <Card className={`backdrop-blur-sm border-2 mb-3 ${
            isUnpromptedMode 
              ? "bg-green-50/80 border-green-200" 
              : "bg-blue-50/80 border-blue-200"
          }`}>
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  isUnpromptedMode ? "bg-green-500" : "bg-blue-500"
                }`}></div>
                <p className={`text-sm font-medium [font-family:'Manrope',Helvetica] ${
                  isUnpromptedMode ? "text-green-800" : "text-blue-800"
                }`}>
                  {isUnpromptedMode 
                    ? "Free writing: Express whatever is on your mind"
                    : `Writing about: "${selectedPrompt}"`
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Input Bar - Matching chat dimensions */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/50 h-[60px]">
            <CardContent className="flex items-center justify-between w-full p-2.5 h-full">
              <Input
                className="border-none shadow-none focus-visible:ring-0 [font-family:'DM_Sans',Helvetica] font-normal text-[#160211] text-sm bg-transparent flex-1"
                placeholder={isUnpromptedMode ? "Start writing freely..." : "Start writing your thoughts..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button
                onClick={handleSubmitEntry}
                disabled={!inputValue.trim()}
                variant="ghost" 
                size="icon" 
                className="p-0 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SendIcon className={`w-9 h-9 ${inputValue.trim() ? 'text-gray-600 hover:text-gray-800' : 'text-gray-300'}`} />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};