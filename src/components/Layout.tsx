import React from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { Button } from "./ui/button";

export const Layout = (): JSX.Element => {
  const location = useLocation();
  
  // Navigation menu items data - REORDERED: Dashboard, Mood Tracker, Journal, Breathwork, History
  const navItems = [
    { label: "Dashboard", path: "/", position: "top-0" },
    { label: "Mood Tracker", path: "/mood-tracker", position: "top-[58px]" },
    { label: "Journal", path: "/journal", position: "top-[116px]" },
    { label: "Breathwork", path: "/breathwork", position: "top-[174px]" },
    { label: "History", path: "/history", position: "top-[232px]" },
  ];

  // Custom text for each page
  const getPageText = () => {
    switch (location.pathname) {
      case "/":
        return "Hello, my name is Baymax, your personal mental health care companion";
      case "/journal":
        return "Journaling is a healthy way to process emotions, reduce stress and improve your overall well-being.";
      case "/breathwork":
        return "Breathing exercises are a simple but powerful way to support your emotional and physical health.";
      case "/history":
        return "Let's review your mental health journey and progress";
      case "/mood-tracker":
        return "On a scale of 1 to 10, how would you rate your...";
      default:
        return "Hello, my name is Baymax, your personal mental health care companion";
    }
  };

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden w-[1280px] h-[832px] relative">
        {/* Built with Bolt Badge - Bottom Left Corner */}
        <div className="absolute bottom-[-30px] left-[20px] z-50">
          <a
            href="https://bolt.new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-colors duration-200 shadow-lg"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-yellow-400"
            >
              <path
                d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                fill="currentColor"
              />
            </svg>
            Built with Bolt
          </a>
        </div>

        {/* 3D Baymax - Moved to FRONT with high z-index */}
        <div className="absolute w-[450px] h-[600px] top-[150px] left-1/2 transform -translate-x-1/2 z-50">
          <iframe 
              src='https://my.spline.design/baymax-ovCsD4wewwEI8tYgCyaXyLm5/' 
              frameBorder='0' 
              width='100%'
              height='100%'
              className="rounded-lg"
              title="3D Baymax"
          />
        </div>

        {/* Top section with navigation and expanded text */}
        <div className="absolute w-[1200px] h-[388px] top-7 left-7 z-10">
          <div className="absolute w-[1200px] h-[388px] top-0 left-0">
            {/* Baymax greeting message - moved higher */}
            <div className="flex flex-col w-[800px] items-center gap-12 absolute top-[85px] left-[200px]">
              <div className="relative self-stretch mt-[-1.00px] [font-family:'Manrope',Helvetica] font-normal text-[#160211] text-2xl text-center tracking-[0] leading-[normal]">
                {getPageText()}
              </div>
            </div>

            <div className="absolute w-[432px] h-[388px] top-0 left-0">
              {/* Navigation buttons - moved down by 100px */}
              <div className="absolute w-[133px] h-[278px] top-[100px] left-0">
                {navItems.map((item, index) => (
                  <Link key={index} to={item.path}>
                    <Button
                      className={`absolute w-[133px] h-10 ${item.position} left-0 rounded-[30px] transition-colors duration-200 ${
                        location.pathname === item.path
                          ? "bg-[#222222] hover:bg-[#333333]"
                          : "bg-[#040404] hover:bg-[#222222]"
                      }`}
                    >
                      <span className="font-m3-label-large font-[number:var(--m3-label-large-font-weight)] text-white text-[length:var(--m3-label-large-font-size)] tracking-[var(--m3-label-large-letter-spacing)] leading-[var(--m3-label-large-line-height)] whitespace-nowrap [font-style:var(--m3-label-large-font-style)]">
                        {item.label}
                      </span>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main content area - lower z-index so it appears behind Baymax */}
        <div className="absolute w-[1024px] h-[464px] top-[416px] left-[127px] z-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};