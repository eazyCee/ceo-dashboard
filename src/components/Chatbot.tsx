import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, RefreshCw } from "lucide-react";
import { DashboardData } from "../types";
import { streamAssist, isDiscoveryEngineConfigured } from "../services/discoveryEngine";

interface ChatbotProps {
  portfolioData: DashboardData;
  user: { name: string; email: string; picture?: string; accessToken?: string; isGuest?: boolean } | null;
}

interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  sources?: string;
}

export default function Chatbot({ portfolioData, user }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>("-");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      content:
        "Hi! I'm your AI Portfolio Assistant. I have full, real-time access to the projects, deal sizes, active blockers, and historical trends of this entire portfolio.\n\nHow can I help you today? You can ask me for a weekly executive brief, analyze active transaction risks, check regulatory blockers, or drill down into PM capacities.",
      sources: "Project Database, Executive Escalation Log, CEO Office SLA Rules",
    },
  ]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    const botMsgId = `msg-${Date.now()}-bot`;
    const botMsg: ChatMessage = {
      id: botMsgId,
      role: "model",
      content: "",
      sources: "Discovery Engine Assistant Stream",
    };

    // If OAuth token exists and discovery engine is configured, use streamAssist REST client directly
    if (user?.accessToken && isDiscoveryEngineConfigured()) {
      setMessages((prev) => [...prev, botMsg]);
      let accumulatedText = "";
      
      try {
        const result = await streamAssist(
          user.accessToken,
          text,
          sessionId,
          (chunk) => {
            if (chunk.answer?.replies) {
              for (const reply of chunk.answer.replies) {
                const gc = reply.groundedContent?.content;
                if (gc?.text && !gc.thought) {
                  accumulatedText += gc.text;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === botMsgId ? { ...m, content: accumulatedText } : m
                    )
                  );
                }
              }
            }
          }
        );

        const finalContent = result.fullText || accumulatedText || "No content returned by Assistant.";

        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMsgId
              ? {
                  ...m,
                  content: finalContent,
                  sources: "Discovery Engine Live Stream",
                }
              : m
          )
        );

        if (result.sessionInfo?.session) {
          setSessionId(result.sessionInfo.session);
        }
      } catch (err: any) {
        console.error("Direct streamAssist failed, falling back to backend:", err);
        // Remove the empty/partially populated bot message first
        setMessages((prev) => prev.filter((m) => m.id !== botMsgId));
        await performBackendFallback(text);
      } finally {
        setIsLoading(false);
      }
    } else {
      await performBackendFallback(text);
      setIsLoading(false);
    }
  };

  const performBackendFallback = async (text: string) => {
    try {
      const chatHistory = [...messages, { id: `user-temp`, role: "user" as const, content: text }].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (user?.accessToken) {
        headers["Authorization"] = `Bearer ${user.accessToken}`;
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({
          messages: chatHistory,
          portfolioData,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to connect to the portfolio assistant");
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `msg-${Date.now()}-bot`,
        role: "model",
        content: data.content,
        sources: data.sources || "Real-Time Portfolio Sync Fallback",
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        role: "model",
        content: `Sorry, I encountered an error: ${err.message || "Unknown error"}. Please make sure the Gemini API key is configured correctly in Settings > Secrets.`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const suggestions = [
    "Give me the weekly brief",
    "What needs my attention?",
    "What are the blockers?",
    "Show regulatory tracker",
    "Who are we waiting on?",
    "Project Beta deep dive",
  ];

  return (
    <>
      {/* Floating Action Button */}
      <button
        id="chat-fab-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#1A1A1A] text-white shadow-2xl flex items-center justify-center hover:scale-110 cursor-pointer active:scale-95 transition transform duration-200 z-50 border-none"
        title="Ask AI Portfolio Assistant"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6 animate-pulse" />}
      </button>

      {/* Floating Chat Panel */}
      {isOpen && (
        <div
          id="chat-panel-container"
          className="fixed bottom-24 right-6 w-[380px] sm:w-[440px] h-[580px] bg-white border border-[#E5E5E1] rounded-xl shadow-2xl flex flex-col justify-between overflow-hidden animate-slideUp z-50"
        >
          {/* Header */}
          <div className="bg-[#F7F7F5] p-4 border-b border-[#E5E5E1] flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-[#1A1A1A]" />
              <div>
                <h3 className="text-sm font-serif font-bold text-[#1A1A1A]">AI Portfolio Assistant</h3>
                <span className="text-[10px] font-mono text-emerald-700 block flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse"></span>
                  Gemini 3.5 Live Sync
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#6B6B67] hover:text-[#1A1A1A] transition cursor-pointer border-none bg-transparent"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] ${
                  msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start animate-fadeIn"
                }`}
              >
                <div
                  className={`p-3 rounded-xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#1A1A1A] text-white rounded-br-none"
                      : "bg-[#F7F7F5] text-[#1A1A1A] rounded-bl-none border border-[#E5E5E1]"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.sources && (
                  <span className="text-[9px] font-mono text-[#8C8C88] mt-1 uppercase tracking-wider block">
                    Sources: {msg.sources}
                  </span>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 mr-auto bg-[#F7F7F5] p-3 rounded-xl rounded-bl-none border border-[#E5E5E1] max-w-[85%]">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A] animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A] animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A] animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
                <span className="text-xs font-mono text-[#6B6B67]">Gemini is synthesising...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions Grid */}
          {!isLoading && messages.length < 4 && (
            <div className="px-4 py-2 bg-[#F7F7F5] border-t border-[#E5E5E1] flex flex-wrap gap-1.5">
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(sug)}
                  className="px-2.5 py-1 text-[10px] font-sans font-semibold bg-white hover:bg-[#E5E5E1] text-indigo-700 hover:text-indigo-900 rounded-full border border-[#E5E5E1] transition cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-[#E5E5E1] flex gap-2 items-center shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
              placeholder="Ask anything about the portfolio..."
              className="flex-1 bg-white border border-[#E5E5E1] rounded-full px-4 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] font-sans font-medium"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              disabled={isLoading || !inputValue.trim()}
              className="w-8 h-8 rounded-full bg-[#1A1A1A] hover:bg-[#333333] text-white flex items-center justify-center transition duration-150 cursor-pointer disabled:opacity-50 border-none"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
