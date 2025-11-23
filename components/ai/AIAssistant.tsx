"use client";

import { useState, useEffect } from "react";
import { Send, Sparkles, X, Minimize2, Maximize2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  initialPrompt?: string;
  position?: "right-rail" | "floating";
}

export function AIAssistant({ initialPrompt, position = "right-rail" }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (initialPrompt) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSend = async (message?: string) => {
    const messageToSend = message || input.trim();
    if (!messageToSend) return;

    const userMessage: Message = {
      role: "user",
      content: messageToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageToSend,
          sessionId,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const { data } = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI chat error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    "Analyze my book sales",
    "Suggest pricing improvements",
    "Review marketing strategy",
    "Identify growth opportunities",
  ];

  if (isMinimized) {
    return (
      <Button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full bg-burgundy shadow-lg hover:bg-burgundy/90"
      >
        <Sparkles className="h-6 w-6 text-surface" />
      </Button>
    );
  }

  return (
    <Card
      className={`${
        position === "floating"
          ? "fixed bottom-4 right-4 z-50 w-96 shadow-2xl"
          : "h-full"
      } ${isExpanded ? "fixed inset-4 z-50 w-auto" : ""} border-stroke bg-surface`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-heading-3 text-ink">
          <Sparkles className="h-5 w-5 text-burgundy" />
          AI Assistant
        </CardTitle>
        <div className="flex gap-1">
          {position === "floating" && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8"
              >
                {isExpanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(true)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Messages */}
        <ScrollArea className={isExpanded ? "h-[calc(100vh-200px)]" : "h-96"}>
          <div className="space-y-4 pr-4">
            {messages.length === 0 ? (
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-burgundy/10">
                  <Sparkles className="h-8 w-8 text-burgundy" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink">How can I help you today?</h3>
                  <p className="text-sm text-charcoal">
                    I can help with pricing, marketing, sales analysis, and launch planning.
                  </p>
                </div>
                <div className="grid gap-2">
                  {quickActions.map((action, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSend(action)}
                      className="text-left justify-start"
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-4 py-2 ${
                      msg.role === "user"
                        ? "bg-burgundy text-surface"
                        : "bg-stroke/50 text-ink"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p
                      className={`mt-1 text-xs ${
                        msg.role === "user" ? "text-surface/70" : "text-charcoal"
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-lg bg-stroke/50 px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-charcoal"></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-charcoal"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-charcoal"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="bg-burgundy hover:bg-burgundy/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-xs text-charcoal text-center">
          AI suggestions are for guidance only. Always verify recommendations.
        </p>
      </CardContent>
    </Card>
  );
}
