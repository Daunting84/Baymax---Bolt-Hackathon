import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { ClockIcon, MessageCircleIcon, BookOpenIcon, WindIcon, HeartIcon, ZapIcon, SunIcon } from "lucide-react";

interface HistoryItem {
  id: number;
  type: string;
  title: string;
  date: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  mood?: number;
  prompt?: string;
  response?: string;
  timestamp?: Date;
}

interface MoodData {
  [key: number]: number; // mood level -> count
}

export const History = (): JSX.Element => {
  const [moodData, setMoodData] = useState<MoodData>({});
  const [stressData, setStressData] = useState<MoodData>({});
  const [dayData, setDayData] = useState<MoodData>({});
  const [journalEntries, setJournalEntries] = useState<HistoryItem[]>([]);

  // Icon mapping for localStorage entries
  const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    BookOpenIcon,
    MessageCircleIcon,
    WindIcon,
    HeartIcon,
    ZapIcon,
    SunIcon,
    ClockIcon,
  };

  // Initialize empty data structure for mood levels 1-10
  const initializeEmptyData = (): MoodData => {
    const data: MoodData = {};
    for (let i = 1; i <= 10; i++) {
      data[i] = 0;
    }
    return data;
  };

  // Function to format date and time for display - same as Journal
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

  // Load all data from localStorage on component mount
  useEffect(() => {
    // Load journal entries
    const journalHistory = JSON.parse(localStorage.getItem('journalHistory') || '[]');
    if (journalHistory.length > 0) {
      const convertedJournalHistory = journalHistory.map((entry: any) => {
        const timestamp = entry.timestamp ? new Date(entry.timestamp) : new Date();
        return {
          ...entry,
          icon: iconMap[entry.iconName] || BookOpenIcon,
          timestamp: timestamp,
          date: formatDateTime(timestamp), // Recalculate the date display using current time
        };
      });
      
      convertedJournalHistory.sort((a, b) => {
        const aTime = a.timestamp ? a.timestamp.getTime() : 0;
        const bTime = b.timestamp ? b.timestamp.getTime() : 0;
        return bTime - aTime;
      });
      
      setJournalEntries(convertedJournalHistory);
    }
    
    // Load mood data
    const moodHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    const moodCounts = initializeEmptyData();
    moodHistory.forEach((entry: any) => {
      if (entry.mood && entry.mood >= 1 && entry.mood <= 10) {
        moodCounts[entry.mood]++;
      }
    });
    setMoodData(moodCounts);
    
    // Load stress data
    const stressHistory = JSON.parse(localStorage.getItem('stressHistory') || '[]');
    const stressCounts = initializeEmptyData();
    stressHistory.forEach((entry: any) => {
      if (entry.stress && entry.stress >= 1 && entry.stress <= 10) {
        stressCounts[entry.stress]++;
      }
    });
    setStressData(stressCounts);
    
    // Load day data
    const dayHistory = JSON.parse(localStorage.getItem('dayHistory') || '[]');
    const dayCounts = initializeEmptyData();
    dayHistory.forEach((entry: any) => {
      if (entry.day && entry.day >= 1 && entry.day <= 10) {
        dayCounts[entry.day]++;
      }
    });
    setDayData(dayCounts);
  }, []);

  // Get colors based on mood ranges: 1-5 yellow, 6-8 orange, 9-10 red
  const getBarColor = (moodId: number) => {
    if (moodId <= 5) {
      return "#FFD700"; // Yellow for 1-5
    } else if (moodId <= 8) {
      return "#FFA500"; // Orange for 6-8
    } else {
      return "#FF4444"; // Red for 9-10
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

  // Bar chart component with emoji faces and gradient bars positioned above
  const BarChart = ({ data }: { 
    data: MoodData
  }) => {
    const maxCount = Math.max(...Object.values(data));
    const hasData = maxCount > 0;
    
    return (
      <div className="space-y-2">
        {hasData ? (
          <div className="flex items-end justify-center gap-1 h-24">
            {Object.entries(data).map(([mood, count]) => {
              const height = maxCount > 0 ? (count / maxCount) * 60 : 0; // Reduced max height to 60px
              const barColor = getBarColor(parseInt(mood));
              
              return (
                <div key={mood} className="flex flex-col items-center">
                  {/* Count display at top */}
                  <div className="text-xs text-[#160211] [font-family:'Manrope',Helvetica] font-medium h-4">
                    {count > 0 ? count : ''}
                  </div>
                  
                  {/* Bar positioned above the emoji - mirrored upward */}
                  <div 
                    className="w-4 transition-all duration-300 mb-1"
                    style={{ 
                      height: `${Math.max(height, count > 0 ? 8 : 2)}px`,
                      background: count > 0 
                        ? `linear-gradient(to bottom, ${barColor}, rgba(255, 255, 255, 0.8))`
                        : `linear-gradient(to bottom, ${barColor}40, rgba(255, 255, 255, 0.3))`,
                      minHeight: count > 0 ? '6px' : '2px',
                      opacity: count > 0 ? 1 : 0.3,
                      borderRadius: '8px 8px 0 0' // Rounded top like half circles
                    }}
                  />
                  
                  {/* Emoji face positioned below the bar */}
                  <div className="w-4 h-4 rounded-full flex items-center justify-center">
                    <img 
                      src={getEmojiImagePath(parseInt(mood))}
                      alt={`Mood ${mood}`}
                      className="w-4 h-4 rounded-full object-contain"
                      onError={(e) => {
                        console.error(`Failed to load emoji image for mood ${mood}`);
                        // Fallback to colored circle with number if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.style.backgroundColor = barColor;
                        target.parentElement!.style.border = '1px solid black';
                        target.parentElement!.innerHTML = `<span style="color: black; font-weight: bold; font-size: 8px;">${mood}</span>`;
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-24">
            <p className="text-xs text-[#00000099] [font-family:'Manrope',Helvetica] text-center">
              No data yet
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full overflow-hidden">
      {/* Background blur effects - UPDATED TO MATCH DASHBOARD */}
      <div className="absolute w-[544px] h-[464px] top-0 left-[231px]">
        <div className="relative h-[464px]">
          <div className="absolute w-[280px] h-[280px] top-0 left-[264px] bg-[#aaaaaa] rounded-[140px] blur-[150px]" />
          <div className="absolute w-[414px] h-[414px] top-[50px] left-0 bg-[#b8b8b8] rounded-[207px] blur-[250px]" />
        </div>
      </div>

      {/* JOURNAL SECTION - Move this entire div to reposition journal card */}
      <div 
        className="absolute z-10"
        style={{ top: '20px', left: '-100px' }}
      >
        <Card className="bg-white/80 backdrop-blur-sm border border-white/50 w-[350px] h-[350px]">
          <CardContent className="p-4 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <BookOpenIcon className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-[#160211] [font-family:'Manrope',Helvetica]">
                Journal Entries
              </h2>
            </div>
            
            {/* Scrollable journal entries */}
            <div className="flex-1 overflow-y-auto space-y-3">
              {journalEntries.length > 0 ? (
                journalEntries.map((entry) => (
                  <div key={entry.id} className="bg-white/60 rounded-lg p-3 border border-white/30">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-[#160211] [font-family:'Manrope',Helvetica] text-sm">
                        {entry.title}
                      </h4>
                      <span className="text-xs text-[#00000099] [font-family:'Manrope',Helvetica]">
                        {entry.date}
                      </span>
                    </div>
                    
                    {entry.prompt && entry.response && (
                      <div className="space-y-1">
                        <p className="text-xs text-blue-600 [font-family:'Manrope',Helvetica] font-medium">
                          "{entry.prompt}"
                        </p>
                        <p className="text-xs text-[#160211] [font-family:'Manrope',Helvetica] opacity-80 line-clamp-2">
                          {entry.response}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-sm text-[#00000099] [font-family:'Manrope',Helvetica] text-center">
                    No journal entries yet.<br />
                    Start writing in the Journal section!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MOOD WIDGETS SECTION - Move this entire div to reposition all 3 widgets together */}
      <div 
        className="absolute z-10"
        style={{ top: '-210px', right: '-70px' }}
      >
        <div className="flex flex-col gap-4 w-[280px]">
          {/* Mood Widget */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-3">
                <HeartIcon className="w-4 h-4 text-pink-600" />
                <h2 className="text-sm font-semibold text-[#160211] [font-family:'Manrope',Helvetica]">
                  Mood
                </h2>
              </div>
              <BarChart data={moodData} />
            </CardContent>
          </Card>

          {/* Stress Widget */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-3">
                <ZapIcon className="w-4 h-4 text-orange-600" />
                <h2 className="text-sm font-semibold text-[#160211] [font-family:'Manrope',Helvetica]">
                  Stress
                </h2>
              </div>
              <BarChart data={stressData} />
            </CardContent>
          </Card>

          {/* Day Widget */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-3">
                <SunIcon className="w-4 h-4 text-yellow-600" />
                <h2 className="text-sm font-semibold text-[#160211] [font-family:'Manrope',Helvetica]">
                  Day Rating
                </h2>
              </div>
              <BarChart data={dayData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};