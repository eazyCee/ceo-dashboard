import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, RefreshCw, ChevronDown, LogOut, Mail, Folder, Globe, Sliders } from "lucide-react";
import { DashboardData } from "../types";
import { streamAssist, isDiscoveryEngineConfigured, configureDiscoveryEngine, getEngine } from "../services/discoveryEngine";

interface ChatbotProps {
  portfolioData: DashboardData;
  user: { name: string; email: string; picture?: string; accessToken?: string; isGuest?: boolean } | null;
  onUserUpdate?: (user: { name: string; email: string; picture?: string; accessToken?: string; isGuest?: boolean } | null) => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  sources?: string;
}

export default function Chatbot({ portfolioData, user, onUserUpdate }: ChatbotProps) {
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
  const [showProfileDropdown, setShowProfileDropdown] = useState<boolean>(false);
  const [oauthConfig, setOauthConfig] = useState<{
    isConfigured: boolean;
    clientId: string | null;
    redirectUri: string;
  } | null>(null);

  interface DataStoreToggleInfo {
    id: string;
    displayName: string;
    type?: string;
    enabled: boolean;
  }

  const [availableDataStores, setAvailableDataStores] = useState<DataStoreToggleInfo[]>([]);
  const [isLoadingDataStores, setIsLoadingDataStores] = useState<boolean>(false);

  useEffect(() => {
    const fetchDataStores = async () => {
      if (!user?.accessToken) {
        setAvailableDataStores([]);
        return;
      }
      setIsLoadingDataStores(true);
      try {
        if (!isDiscoveryEngineConfigured()) {
          try {
            const res = await fetch("/api/discovery/config");
            if (res.ok) {
              const config = await res.json();
              configureDiscoveryEngine(config.projectNumber, config.engineId, config.location);
            } else {
              setAvailableDataStores([]);
              return;
            }
          } catch (err) {
            console.error("Failed to load Discovery Engine configuration inside Chatbot:", err);
            setAvailableDataStores([]);
            return;
          }
        }

        const engine = await getEngine(user.accessToken);
        if (engine.dataStoreIds && engine.dataStoreIds.length > 0) {
          const mappedStores = engine.dataStoreIds.map((dsId) => {
            let type = "WEBSITE";
            let displayName = dsId;
            const lowerId = dsId.toLowerCase();
            if (lowerId.endsWith("_google_mail") || lowerId.includes("_google_mail") || lowerId.includes("gmail") || lowerId.includes("mail")) {
              type = "GOOGLE_MAIL";
              displayName = "Gmail";
            } else if (lowerId.endsWith("_google_drive") || lowerId.includes("_google_drive") || lowerId.includes("drive")) {
              type = "GOOGLE_DRIVE";
              displayName = "Google Drive";
            } else if (lowerId.endsWith("_google_calendar") || lowerId.includes("_google_calendar") || lowerId.includes("calendar")) {
              type = "GOOGLE_CALENDAR";
              displayName = "Google Calendar";
            } else {
              // Strip trailing numeric ID and format nicely
              displayName = dsId.replace(/_\d+$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            }
            return {
              id: dsId,
              displayName,
              type,
              enabled: true,
            };
          });
          setAvailableDataStores(mappedStores);
        } else {
          setAvailableDataStores([]);
        }
      } catch (err) {
        console.error("Error fetching engine or data stores in Chatbot:", err);
        setAvailableDataStores([]);
      } finally {
        setIsLoadingDataStores(false);
      }
    };
    fetchDataStores();
  }, [user?.accessToken]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchAuthConfig = async () => {
      try {
        const res = await fetch("/api/auth/config");
        if (res.ok) {
          const data = await res.json();
          setOauthConfig(data);
        }
      } catch (err) {
        console.error("Error fetching OAuth config in Chatbot:", err);
      }
    };
    fetchAuthConfig();
  }, []);

  const handleGoogleLoginInChat = async () => {
    if (!oauthConfig || !oauthConfig.isConfigured) return;

    try {
      const res = await fetch("/api/auth/google/url");
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to initiate Google OAuth flow");
      }
      const { url } = await res.json();

      const width = 500;
      const height = 650;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        url,
        "google_oauth_popup",
        `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
      );

      if (!popup) {
        alert("Popup blocker detected! Please enable popups for this site to complete authorization.");
        return;
      }

      const handleMessage = (event: MessageEvent) => {
        const origin = event.origin;
        if (!origin.endsWith(".run.app") && !origin.includes("localhost") && !origin.includes("127.0.0.1")) {
          return;
        }

        if (event.data?.type === "OAUTH_AUTH_SUCCESS") {
          if (onUserUpdate) {
            onUserUpdate(event.data.user);
          }
          window.removeEventListener("message", handleMessage);
        } else if (event.data?.type === "OAUTH_AUTH_FAILURE") {
          alert(`Authentication failed: ${event.data.error || "Unknown error"}`);
          window.removeEventListener("message", handleMessage);
        }
      };

      window.addEventListener("message", handleMessage);

    } catch (err: any) {
      console.error("Google Authentication Initiation Error from Chatbot:", err);
      alert(err.message || "Unable to initiate authentication.");
    }
  };

  const handleDisconnectSession = () => {
    if (onUserUpdate) {
      onUserUpdate({
        name: "Guest Executive",
        email: "guest.ceo@altostrat.com",
        picture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=faces",
        isGuest: true
      });
    }
    setShowProfileDropdown(false);
  };

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
        const enabledStoreIds = availableDataStores
          .filter((ds) => ds.enabled)
          .map((ds) => ds.id);

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
          },
          undefined,
          enabledStoreIds.length > 0 ? enabledStoreIds : undefined
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
          <div className="bg-[#F7F7F5] px-4 py-3 border-b border-[#E5E5E1] flex justify-between items-center shrink-0 relative">
            <div className="flex items-center gap-2.5">
              <Bot className="h-5 w-5 text-[#1A1A1A]" />
              <div>
                <h3 className="text-xs font-serif font-bold text-[#1A1A1A] leading-tight">AI Portfolio Assistant</h3>
                {user?.accessToken ? (
                  <span className="text-[9px] font-mono text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    StreamAssist Active
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-[#6B6B67] flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    Gemini Fallback Mode
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Profile dropdown trigger */}
              {user && (
                <button
                  id="chatbot-profile-trigger"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-1 p-1 hover:bg-[#E5E5E1]/50 rounded-full transition cursor-pointer border-none bg-transparent"
                >
                  <img
                    src={user.picture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=faces"}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-black/10"
                  />
                  <ChevronDown className={`h-3 w-3 text-[#6B6B67] transition-transform duration-200 ${showProfileDropdown ? "rotate-180" : ""}`} />
                </button>
              )}

              <button
                onClick={() => setIsOpen(false)}
                className="text-[#6B6B67] hover:text-[#1A1A1A] p-1 rounded-full hover:bg-[#E5E5E1]/50 transition cursor-pointer border-none bg-transparent"
                title="Close Chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Profile Dropdown Menu */}
            {showProfileDropdown && user && (
              <div
                id="chatbot-profile-dropdown"
                className="absolute top-full right-4 mt-1 w-64 bg-white/95 backdrop-blur-md border border-[#E5E5E1] rounded-xl shadow-xl z-50 p-4 animate-fadeIn space-y-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.picture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=faces"}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-black/5"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-serif font-bold text-[#1A1A1A] truncate">{user.name}</p>
                    <p className="text-[10px] text-[#6B6B67] font-sans truncate">{user.email}</p>
                  </div>
                </div>

                <div className="border-t border-[#E5E5E1] pt-2.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#6B6B67]">Status:</span>
                    {user.isGuest ? (
                      <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold">Guest Mode</span>
                    ) : (
                      <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">Google Connected</span>
                    )}
                  </div>
                  {!user.isGuest && (
                    <div className="flex items-center justify-between text-[10px] font-mono mt-1.5">
                      <span className="text-[#6B6B67]">Service:</span>
                      <span className="text-blue-700 font-bold">Discovery Engine streamAssist</span>
                    </div>
                  )}
                </div>

                <div className="pt-1.5 flex gap-2">
                  {user.isGuest ? (
                    oauthConfig?.isConfigured && (
                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          handleGoogleLoginInChat();
                        }}
                        className="w-full py-1.5 bg-[#244E80] hover:bg-[#1C3E67] text-white text-[10px] font-sans font-bold rounded-lg transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer border-none"
                      >
                        Connect Google
                      </button>
                    )
                  ) : (
                    <button
                      id="disconnect-google-chatbot-btn"
                      onClick={handleDisconnectSession}
                      className="w-full py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-sans font-bold rounded-lg border border-rose-200 transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="h-3 w-3" />
                      Disconnect Account
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
            {user?.isGuest && oauthConfig?.isConfigured && (
              <div className="p-4 bg-gradient-to-br from-blue-50/90 to-indigo-50/90 border border-blue-100 rounded-xl shadow-sm text-[#1A1A1A] space-y-3 animate-fadeIn mb-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0 mt-0.5 animate-pulse">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-serif font-bold text-[#1C3E67] flex items-center gap-1.5">
                      Enable Live StreamAssist
                    </h4>
                    <p className="text-[11px] text-[#4A5568] leading-relaxed mt-1 font-sans">
                      Connect your Google Account to unlock real-time document search, live streaming, and secure corporate email analysis grounded in your Enterprise knowledgebase.
                    </p>
                  </div>
                </div>
                <button
                  id="connect-google-chatbot-cta"
                  onClick={handleGoogleLoginInChat}
                  className="w-full py-2 bg-[#244E80] hover:bg-[#1C3E67] text-white text-[11px] font-sans font-bold rounded-lg transition duration-150 flex items-center justify-center gap-2 cursor-pointer border-none shadow-xs"
                >
                  <svg className="h-3.5 w-3.5 shrink-0 fill-current" viewBox="0 0 24 24">
                    <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.51 0-6.377-2.87-6.377-6.38s2.867-6.38 6.377-6.38c1.623 0 3.097.55 4.27 1.626l3.097-3.099C19.205 2.13 15.96 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c5.85 0 10.74-4.26 10.74-10.714 0-.643-.075-1.272-.24-1.714H12.24z" />
                  </svg>
                  Connect Google Workspace
                </button>
              </div>
            )}

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
          {/* Data Sources Toggle Bar */}
          {user?.accessToken && availableDataStores.length > 0 && (
            <div className="px-3 py-1.5 bg-[#F7F7F5] border-t border-[#E5E5E1] flex flex-wrap items-center gap-1.5 shrink-0 animate-fadeIn">
              <span className="text-[9px] font-sans font-bold text-[#6B6B67] uppercase tracking-wider flex items-center gap-1 mr-1">
                <Sliders className="h-3 w-3" />
                Grounding Sources:
              </span>
              {availableDataStores.map((ds) => {
                const isMail = ds.type === "GOOGLE_MAIL" || ds.id.toLowerCase().includes("mail") || ds.id.toLowerCase().includes("gmail");
                const isDrive = ds.type === "GOOGLE_DRIVE" || ds.id.toLowerCase().includes("drive");
                
                let Icon = Globe;
                let activeColorClass = "border-emerald-600 bg-emerald-50 text-emerald-800";
                let inactiveColorClass = "border-[#E5E5E1] bg-white text-[#6B6B67] hover:bg-[#E5E5E1]/20";

                if (isMail) {
                  Icon = Mail;
                  activeColorClass = "border-blue-600 bg-blue-50 text-blue-800";
                } else if (isDrive) {
                  Icon = Folder;
                  activeColorClass = "border-amber-600 bg-amber-50 text-amber-800";
                }

                return (
                  <button
                    key={ds.id}
                    onClick={() => {
                      setAvailableDataStores(prev =>
                        prev.map(item =>
                          item.id === ds.id ? { ...item, enabled: !item.enabled } : item
                        )
                      );
                    }}
                    className={`px-2 py-0.5 text-[9px] font-sans font-semibold rounded-full border flex items-center gap-1 transition-all duration-200 cursor-pointer active:scale-95 ${
                      ds.enabled ? activeColorClass : inactiveColorClass
                    }`}
                    title={`${ds.enabled ? "Disable" : "Enable"} ${ds.displayName}`}
                  >
                    <Icon className="h-2.5 w-2.5 shrink-0" />
                    <span>{ds.displayName}</span>
                    <span className={`w-1 h-1 rounded-full ${
                      ds.enabled ? "bg-current animate-pulse" : "bg-gray-300"
                    }`} />
                  </button>
                );
              })}
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
