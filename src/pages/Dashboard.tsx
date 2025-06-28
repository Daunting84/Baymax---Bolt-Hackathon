import React, { useState, useEffect, useRef } from "react";
import { SendIcon, AlertCircleIcon, CheckCircleIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { chatService, ChatMessage } from "../services/chatService";

interface Message {
  id: number;
  text: string;
  sender: "user" | "baymax";
  timestamp: Date;
  isLoading?: boolean;
}

export const Dashboard = (): JSX.Element => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I am Baymax, your personal healthcare companion. I am here to help you with your mental wellness. How are you feeling today?",
      sender: "baymax",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isServerReady, setIsServerReady] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check server health on component mount
    checkServerHealth();
    
    // Set up periodic health checks
    const healthCheckInterval = setInterval(checkServerHealth, 30000); // Check every 30 seconds
    
    return () => clearInterval(healthCheckInterval);
  }, []);

  const checkServerHealth = async () => {
    try {
      setIsCheckingHealth(true);
      const isHealthy = await chatService.checkHealth();
      setIsServerReady(isHealthy);
      
      if (!isHealthy) {
        setServerError("Baymax server is not ready. Please ensure the server is running with 'npm run start'.");
      } else {
        setServerError(null);
      }
    } catch (error) {
      setIsServerReady(false);
      setServerError("Cannot connect to Baymax server. Please run 'npm run start' to start both frontend and backend.");
    } finally {
      setIsCheckingHealth(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    if (!isServerReady) {
      setServerError("Baymax is not available. Please check server status.");
      return;
    }

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    const loadingMessage: Message = {
      id: messages.length + 2,
      text: "Baymax is thinking...",
      sender: "baymax",
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInputValue("");

    try {
      // Convert messages to chat format for API
      const conversationHistory: ChatMessage[] = messages.map(msg => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text
      }));

      const response = await chatService.sendMessage(inputValue, conversationHistory);
      
      const baymaxResponse: Message = {
        id: messages.length + 2,
        text: response,
        sender: "baymax",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev.slice(0, -1), baymaxResponse]);
    } catch (error) {
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "I apologize, but I'm having trouble connecting right now. Please make sure the server is running and try again.",
        sender: "baymax",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev.slice(0, -1), errorMessage]);
      console.error("Chat error:", error);
      
      // Check server health again after error
      checkServerHealth();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleRetryConnection = () => {
    checkServerHealth();
  };

  return (
    <div className="relative w-full h-full">
      {/* Background blur effects */}
      <div className="absolute w-[544px] h-[464px] top-0 left-[231px]">
        <div className="relative h-[464px]">
          <div className="absolute w-[280px] h-[280px] top-0 left-[264px] bg-[#aaaaaa] rounded-[140px] blur-[150px]" />
          <div className="absolute w-[414px] h-[414px] top-[50px] left-0 bg-[#b8b8b8] rounded-[207px] blur-[250px]" />
        </div>
      </div>

      {/* Server Status Indicator - MOVED TO BOTTOM */}
      <div className="absolute bottom-2 right-2 z-10">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
          isServerReady 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isCheckingHealth ? (
            <>
              <RefreshCwIcon className="w-3 h-3 animate-spin" />
              <span>Checking...</span>
            </>
          ) : isServerReady ? (
            <>
              <CheckCircleIcon className="w-3 h-3" />
              <span>Baymax Ready</span>
            </>
          ) : (
            <>
              <AlertCircleIcon className="w-3 h-3" />
              <span>Server Offline</span>
            </>
          )}
        </div>
      </div>

      {/* Chat messages area */}
      <div className="absolute w-[1000px] h-[200px] top-[170px] left-[12px] overflow-y-auto">
        <div className="flex flex-col gap-4 p-2">
          {messages.map((message) => (
            <div key={message.id} className={`flex flex-col ${message.sender === "user" ? "items-end" : "items-start"}`}>
              <div className={`relative h-4 mb-1 [font-family:'Manrope',Helvetica] font-medium text-[#00000099] text-[11px] tracking-[0] leading-[normal] ${
                message.sender === "user" ? "text-right" : "text-left"
              }`}>
                {message.sender === "user" ? "ME" : "BAYMAX"}
              </div>
              <Card className={`flex items-center justify-center gap-2.5 p-2.5 max-w-[350px] ${
                message.sender === "user" 
                  ? "bg-[#ffffff80] border-white" 
                  : "bg-[#ffffff80] border-white"
              } rounded-lg border border-solid ${message.isLoading ? 'animate-pulse' : ''}`}>
                <CardContent className="p-0">
                  <div className="relative w-fit [font-family:'Manrope',Helvetica] font-normal text-[#160211] text-sm tracking-[0] leading-[normal]">
                    {message.text}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat input field */}
      <Card className="flex w-[1024px] h-[60px] items-center justify-between absolute top-[340px] left-0 bg-white rounded-lg border border-solid border-[#1602114c]">
        <CardContent className="flex items-center justify-between w-full p-2.5">
          <Input
            className="border-none shadow-none focus-visible:ring-0 [font-family:'DM_Sans',Helvetica] font-normal text-[#160211] text-sm"
            placeholder={isServerReady ? "How are you feeling today?" : "Baymax is not available..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!isServerReady}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-0 hover:bg-gray-100 rounded-full"
            onClick={handleSendMessage}
            disabled={!isServerReady || !inputValue.trim()}
          >
            <SendIcon className={`w-9 h-9 ${isServerReady && inputValue.trim() ? 'text-gray-600 hover:text-gray-800' : 'text-gray-300'}`} />
          </Button>
        </CardContent>
      </Card>

      {/* Server Error Notice with Retry Button */}
      {serverError && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-red-800 flex-1">
                  <AlertCircleIcon className="w-4 h-4" />
                  <span className="text-sm [font-family:'Manrope',Helvetica]">
                    {serverError}
                  </span>
                </div>
                <Button
                  onClick={handleRetryConnection}
                  size="sm"
                  variant="outline"
                  className="text-red-800 border-red-300 hover:bg-red-100"
                  disabled={isCheckingHealth}
                >
                  {isCheckingHealth ? (
                    <RefreshCwIcon className="w-3 h-3 animate-spin" />
                  ) : (
                    "Retry"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};