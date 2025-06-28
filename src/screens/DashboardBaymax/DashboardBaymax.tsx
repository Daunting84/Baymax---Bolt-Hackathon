import { SendIcon } from "lucide-react";
import React from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export const DashboardBaymax = (): JSX.Element => {
  // Navigation menu items data
  const navItems = [
    { label: "Dashboard", position: "top-0" },
    { label: "Journal", position: "top-[58px]" },
    { label: "Breathwork", position: "top-[116px]" },
    { label: "History", position: "top-[174px]" },
    { label: "Mood Tracker", position: "top-[232px]" },
  ];

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden w-[1280px] h-[832px] relative">
        {/* Chat area */}
        <div className="absolute w-[1024px] h-[464px] top-[501px] left-[127px]">
          <div className="absolute w-[1024px] h-[464px] top-0 left-0">
            {/* Background blur effects */}
            <div className="absolute w-[544px] h-[464px] top-0 left-[231px]">
              <div className="relative h-[464px]">
                <div className="absolute w-[280px] h-[280px] top-0 left-[264px] bg-[#aaaaaa] rounded-[140px] blur-[150px]" />
                <div className="absolute w-[414px] h-[414px] top-[50px] left-0 bg-[#b8b8b8] rounded-[207px] blur-[250px]" />
              </div>
            </div>

            {/* Chat input field */}
            <Card className="flex w-[1024px] h-[60px] items-center justify-between absolute top-[234px] left-0 bg-white rounded-lg border border-solid border-[#1602114c]">
              <CardContent className="flex items-center justify-between w-full p-2.5">
                <Input
                  className="border-none shadow-none focus-visible:ring-0 [font-family:'DM_Sans',Helvetica] font-normal text-[#aaaaaa] text-sm"
                  placeholder="How is your day going?"
                />
                <Button variant="ghost" size="icon" className="p-0">
                  <SendIcon className="w-9 h-9" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* User message */}
          <div className="flex flex-col w-[203px] items-start absolute top-40 left-[821px]">
            <div className="relative self-stretch h-4 mt-[-1.00px] [font-family:'Manrope',Helvetica] font-medium text-[#00000099] text-[11px] text-right tracking-[0] leading-[normal]">
              ME
            </div>
            <Card className="flex items-center justify-center gap-2.5 p-2.5 relative self-stretch w-full flex-[0_0_auto] bg-[#ffffff80] rounded-lg border border-solid border-white">
              <CardContent className="p-0">
                <div className="relative w-fit mt-[-1.00px] [font-family:'Manrope',Helvetica] font-normal text-[#160211] text-sm tracking-[0] leading-[normal]">
                  I&apos;m feeling stressed Baymax
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Top section with navigation and Baymax */}
        <div className="absolute w-[817px] h-[388px] top-7 left-7">
          <div className="absolute w-[817px] h-[388px] top-0 left-0">
            {/* Baymax greeting message */}
            <div className="flex flex-col w-[409px] items-center gap-12 absolute top-[115px] left-[408px]">
              <div className="relative self-stretch mt-[-1.00px] [font-family:'Manrope',Helvetica] font-normal text-[#160211] text-2xl text-center tracking-[0] leading-[normal]">
                Hello, my name is Baymax, your personal mental health care
                companion
              </div>
            </div>

            <div className="absolute w-[432px] h-[388px] top-0 left-0">
              {/* Baymax chat bubble */}
              <div className="absolute w-[322px] h-[126px] top-[262px] left-[110px]">
                <img
                  className="w-full h-full"
                  alt="Chat bubble"
                  src="/chat-bubble.svg"
                />
              </div>

              <div className="absolute w-[221px] top-[287px] left-[171px] [font-family:'Manrope',Helvetica] font-normal text-[#160211] text-sm tracking-[0] leading-[normal]">
                I am sorry to hear that, I am here to help. Might I suggest
                trying a breathing exercise?
              </div>

              {/* Navigation buttons */}
              <div className="absolute w-[133px] h-[278px] top-0 left-0">
                {navItems.map((item, index) => (
                  <Button
                    key={index}
                    className={`absolute w-[133px] h-10 ${item.position} left-0 bg-[#040404] rounded-[30px] hover:bg-[#222222]`}
                  >
                    <span className="font-m3-label-large font-[number:var(--m3-label-large-font-weight)] text-white text-[length:var(--m3-label-large-font-size)] tracking-[var(--m3-label-large-letter-spacing)] leading-[var(--m3-label-large-line-height)] whitespace-nowrap [font-style:var(--m3-label-large-font-style)]">
                      {item.label}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Baymax eyes */}
          <img
            className="absolute w-[115px] h-12 top-[51px] left-[555px] object-cover"
            alt="Baymax eyes"
            src="/baymax-eyes-ixiu2ufeaczj0v8c-removebg-preview-2.png"
          />
        </div>
      </div>
    </div>
  );
};
