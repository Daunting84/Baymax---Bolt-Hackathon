import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { HeartIcon, ZapIcon, SunIcon } from "lucide-react";

export const MoodTracker = (): JSX.Element => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedStress, setSelectedStress] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const handleMoodSelect = (moodId: number) => {
    setSelectedMood(moodId);
  };

  const handleStressSelect = (stressId: number) => {
    setSelectedStress(stressId);
  };

  const handleDaySelect = (dayId: number) => {
    setSelectedDay(dayId);
  };

  const handleSaveAll = () => {
    let savedCount = 0;
    
    // Save mood if selected
    if (selectedMood) {
      const moodEntry = {
        id: Date.now() + Math.random(), // Ensure unique IDs
        mood: selectedMood,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString()
      };
      
      const existingMoodHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]');
      localStorage.setItem('moodHistory', JSON.stringify([moodEntry, ...existingMoodHistory]));
      savedCount++;
    }

    // Save stress if selected
    if (selectedStress) {
      const stressEntry = {
        id: Date.now() + Math.random() + 1, // Ensure unique IDs
        stress: selectedStress,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString()
      };
      
      const existingStressHistory = JSON.parse(localStorage.getItem('stressHistory') || '[]');
      localStorage.setItem('stressHistory', JSON.stringify([stressEntry, ...existingStressHistory]));
      savedCount++;
    }

    // Save day if selected
    if (selectedDay) {
      const dayEntry = {
        id: Date.now() + Math.random() + 2, // Ensure unique IDs
        day: selectedDay,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString()
      };
      
      const existingDayHistory = JSON.parse(localStorage.getItem('dayHistory') || '[]');
      localStorage.setItem('dayHistory', JSON.stringify([dayEntry, ...existingDayHistory]));
      savedCount++;
    }

    if (savedCount > 0) {
      console.log(`Saved ${savedCount} entries`);
      // Clear selections after saving
      setSelectedMood(null);
      setSelectedStress(null);
      setSelectedDay(null);
    }
  };

  // Map mood IDs to their corresponding image files
  const getEmojiImagePath = (moodId: number): string => {
    const imageMap: { [key: number]: string } = {
      1: "/eee62d39e1db3bd44337120f5b31e9c7-removebg-preview - face1.png",
      2: "/eee62d39e1db3bd44337120f5b31e9c7-removebg-preview - Copy.png",
      3: "/eee62d39e1db3bd44337120f5b31e9c7-removebg-preview - face3.png",
      4: "/eee62d39e1db3bd44337120f5b31e9c7-removebg-preview - face 4.png",
      5: "/eee62d39e1db3bd44337120f5b31e9c7-removebg-preview - Copy (2).png",
      6: "/eee62d39e1db3bd44337120f5b31e9c7-removebg-preview - face6.png",
      7: "/eee62d39e1db3bd44337120f5b31e9c7-removebg-preview - face 7.png",
      8: "/eee62d39e1db3bd44337120f5b31e9c7-removebg-preview - Copy (3).png",
      9: "/eee62d39e1db3bd44337120f5b31e9c7-removebg-preview - face9.png",
      10: "/eee62d39e1db3bd44337120f5b31e9c7-removebg-preview - face10.png"
    };
    
    return imageMap[moodId] || imageMap[1]; // Fallback to face 1 if not found
  };

  // Create emoji face component using individual images - made smaller
  const EmojiButton = ({ moodId, isSelected, onSelect }: { 
    moodId: number, 
    isSelected: boolean, 
    onSelect: (id: number) => void 
  }) => {
    return (
      <Button
        variant="ghost"
        className={`w-8 h-8 p-0 rounded-full transition-all duration-200 hover:scale-110 ${
          isSelected ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
        }`}
        onClick={() => onSelect(moodId)}
      >
        <img 
          src={getEmojiImagePath(moodId)}
          alt={`Mood ${moodId}`}
          className="w-6 h-6 rounded-full object-contain"
          onError={(e) => {
            console.error(`Failed to load emoji image for mood ${moodId}`);
            // Fallback to a simple colored circle if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.style.backgroundColor = moodId <= 5 ? '#FFD700' : moodId <= 8 ? '#FFA500' : '#FF4444';
            target.parentElement!.innerHTML = `<span style="color: black; font-weight: bold; font-size: 10px;">${moodId}</span>`;
          }}
        />
      </Button>
    );
  };

  // Reusable tracking panel component - made more compact without save buttons
  const TrackingPanel = ({ 
    title, 
    icon: Icon, 
    selectedValue, 
    onSelect
  }: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    selectedValue: number | null;
    onSelect: (id: number) => void;
  }) => (
    <Card className={`bg-white/80 backdrop-blur-sm border border-white/50 w-full`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Icon className="w-4 h-4 text-[#160211]" />
          <h3 className="text-sm font-medium text-[#160211] [font-family:'Manrope',Helvetica]">
            {title}
          </h3>
        </div>
        
        {/* Top row - faces 1-5 - more compact */}
        <div className="flex justify-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((moodId) => (
            <div key={moodId} className="flex flex-col items-center">
              <EmojiButton 
                moodId={moodId}
                isSelected={selectedValue === moodId}
                onSelect={onSelect}
              />
              <span className="text-xs mt-0.5 text-center [font-family:'Manrope',Helvetica] text-gray-600">
                {moodId}
              </span>
            </div>
          ))}
        </div>
        
        {/* Bottom row - faces 6-10 - more compact */}
        <div className="flex justify-center gap-1 mb-2">
          {[6, 7, 8, 9, 10].map((moodId) => (
            <div key={moodId} className="flex flex-col items-center">
              <EmojiButton 
                moodId={moodId}
                isSelected={selectedValue === moodId}
                onSelect={onSelect}
              />
              <span className="text-xs mt-0.5 text-center [font-family:'Manrope',Helvetica] text-gray-600">
                {moodId}
              </span>
            </div>
          ))}
        </div>

        {/* Show selected value without save button */}
        {selectedValue && (
          <div className="text-center">
            <p className="text-xs text-[#160211] [font-family:'Manrope',Helvetica]">
              Selected: <span className="font-medium">{selectedValue}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

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
        {/* SINGLE COLUMN STACK - Easy to reposition by changing these style values */}
        <div 
          className="absolute flex flex-col gap-3"
          style={{ 
            top: '-270px',      // Vertical position - change this to move up/down
            right: '-100px',    // Horizontal position - change this to move left/right
            width: '280px'      // Width of each card - made smaller
          }}
        >
          <TrackingPanel
            title="Mood"
            icon={HeartIcon}
            selectedValue={selectedMood}
            onSelect={handleMoodSelect}
          />
          
          <TrackingPanel
            title="Stress"
            icon={ZapIcon}
            selectedValue={selectedStress}
            onSelect={handleStressSelect}
          />
          
          <TrackingPanel
            title="Day"
            icon={SunIcon}
            selectedValue={selectedDay}
            onSelect={handleDaySelect}
          />

          {/* Single Save Button at the bottom */}
          {(selectedMood || selectedStress || selectedDay) && (
            <div className="text-center mt-2">
              <Button 
                onClick={handleSaveAll}
                className="bg-[#040404] hover:bg-[#222222] text-white rounded-lg px-6 py-2 text-sm"
              >
                Save Selected
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};