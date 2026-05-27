import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, ChatMessage } from "../types";
import { Send, Heart, BrainCircuit, Activity, HelpCircle, Loader, RefreshCw, Volume2 } from "lucide-react";

interface AIHelpAssistantProps {
  userProfile: UserProfile;
}

export default function AIHelpAssistant({ userProfile }: AIHelpAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `🌸 Namaste, **${userProfile.name || "Citizen"}**! I am **Sashakt Sahayak**, your women's safety AI counselor and legal guide.\n\nI can assist you with:\n*   **Understanding Indian Women Safety Laws** (Zero FIR, PoSH Act, DV Act, Modesty Clauses).\n*   **Navigating structural ICJS workflows** (Police Dispatch to Trials).\n*   **Drafting legal e-FIR representations**.\n\n*If you are in direct active peril, please immediately trigger the red 3D SOS button or dial emergency helpline **112**.*`,
      timestamp: new Date()
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [panicLevel, setPanicLevel] = useState(false); // Controls the de-escalation breathing expander
  const [breathingText, setBreathingText] = useState("Ground Yourself");
  const [breathCycle, setBreathCycle] = useState<"idle" | "in" | "hold" | "out">("idle");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Suggestions triggers
  const SUGGESTED_QUESTIONS = [
    "What is the exact scope of a Zero FIR?",
    "Show my legal rights under PoSH Act at workplace",
    "How does the ICJS pathway fast-track cases?",
    "Draft a complaint guide for online cyber stalking"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Breathing loop simulation
  useEffect(() => {
    if (!panicLevel) {
      setBreathCycle("idle");
      setBreathingText("Ground Yourself");
      return;
    }

    let isSubscribed = true;
    const runCycle = async () => {
      while (isSubscribed && panicLevel) {
        if (!isSubscribed) break;
        setBreathCycle("in");
        setBreathingText("Breathe In...");
        await new Promise((r) => setTimeout(r, 4000));
        
        if (!isSubscribed) break;
        setBreathCycle("hold");
        setBreathingText("Hold...");
        await new Promise((r) => setTimeout(r, 4000));
        
        if (!isSubscribed) break;
        setBreathCycle("out");
        setBreathingText("Breathe Out...");
        await new Promise((r) => setTimeout(r, 4000));
      }
    };

    runCycle();

    return () => {
      isSubscribed = false;
    };
  }, [panicLevel]);

  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = customMessage || input;
    if (!textToSend.trim() || loading) return;

    if (!customMessage) setInput("");

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content
          })),
          userProfile: userProfile
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            role: "assistant",
            content: data.text,
            timestamp: new Date()
          }
        ]);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          content: `⚠️ **System Integration Alert**: ${err.message || "Failed to establish counselor socket connection. Falling back to static safety guidelines."}`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-help-assistant" className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-2xl relative flex flex-col justify-between h-[600px] overflow-hidden">
      
      {/* Visual Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-tr from-rose-500 to-teal-500 rounded-xl flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Sashakt Sahayak Counselor</h4>
            <span className="text-[10px] text-teal-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping"></span>
              Gemini Legal Live Sync
            </span>
          </div>
        </div>

        {/* Breathing ground tool button */}
        <button
          id="btn-breathing-panic"
          onClick={() => setPanicLevel(!panicLevel)}
          className={`px-3 py-1.5 rounded-xl border font-sans text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
            panicLevel 
              ? "bg-rose-500 text-white border-rose-400 shadow-[0_0_12px_rgba(239,68,68,0.40)] font-bold animate-pulse" 
              : "bg-slate-950/80 text-rose-400 border-rose-950 hover:bg-slate-950"
          }`}
        >
          <Activity className="w-3.5 h-3.5" /> 
          {panicLevel ? "Exit Anxiety Relief" : "Soothe Distress"}
        </button>
      </div>

      {/* Dynamic Pane Switcher (Anxiety relieve expander vs Chat logger) */}
      <div className="relative flex-grow flex flex-col justify-between overflow-hidden">
        
        <AnimatePresence mode="wait">
          {panicLevel ? (
            /* Anxiety Grounding Expander Panel */
            <motion.div
              key="panic"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-15 bg-slate-950 rounded-xl border border-rose-950/40 p-6 flex flex-col items-center justify-center text-center space-y-8"
            >
              <div>
                <Heart className="w-8 h-8 text-rose-400 mx-auto animate-pulse mb-2" />
                <h4 className="text-md font-bold text-white">Diaphragmatic Grounding Cycle</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  If you feel alarmed or panicked, match your breathing tempo exactly with the contracting 3D ring to calm your nervous system.
                </p>
              </div>

              {/* Animated rings */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* Visual pulse backdrops */}
                <motion.div
                  animate={{
                    scale: breathCycle === "in" ? 1.6 : breathCycle === "hold" ? 1.6 : 0.8,
                    opacity: breathCycle === "in" ? 0.2 : breathCycle === "hold" ? 0.35 : 0.1
                  }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-rose-500/20 blur-xl"
                />

                <motion.div
                  animate={{
                    scale: breathCycle === "in" ? 1.4 : breathCycle === "hold" ? 1.4 : 0.9,
                    borderWidth: breathCycle === "hold" ? "4px" : "2px"
                  }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className="absolute inset-2 rounded-full border border-rose-500/50 flex items-center justify-center"
                />

                <div className="z-12 font-sans font-bold text-xs text-white uppercase tracking-wider">
                  {breathingText}
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-500 leading-normal max-w-xs">
                In-breath spans 4s ➔ Hold spans 4s ➔ Out-breath spans 4s. Repeat as necessary to steady your pulse.
              </div>
            </motion.div>
          ) : (
            /* Regular Chat Logs Panel */
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-grow overflow-y-auto pr-1 space-y-4 text-xs scrollbar-thin"
            >
              {messages.map((m) => {
                const isAssistant = m.role === "assistant";
                return (
                  <div key={m.id} className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
                    <div className={`p-3.5 rounded-2xl max-w-[85%] border relative ${
                      isAssistant 
                        ? "bg-slate-950/80 border-slate-850 text-slate-300 rounded-tl-none font-sans" 
                        : "bg-teal-500 text-slate-950 border-teal-400/30 rounded-tr-none font-sans font-medium"
                    }`}>
                      
                      {/* Interactive Copy/Speaker (Assistant messages only) */}
                      {isAssistant && (
                        <div className="flex justify-between items-center mb-1 pb-1 border-b border-slate-900/50 text-[10px] text-slate-500">
                          <span className="font-mono">Sashakt Advisor</span>
                          <span className="font-mono">{m.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      )}

                      <div className="markdown-body leading-relaxed whitespace-pre-wrap">
                        {/* Beautiful list renderings inside raw text formatting */}
                        {m.content}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-950/50 border border-slate-900 rounded-2xl rounded-tl-none p-3.5 text-slate-500 flex items-center gap-2">
                    <Loader className="w-3.5 h-3.5 animate-spin text-teal-400" />
                    <span className="font-mono text-[10px] tracking-wider uppercase">Counselor analysis processing...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating preset buttons list at the bottom of regular chat screen */}
        {!panicLevel && messages.length <= 1 && (
          <div className="shrink-0 pt-3 flex flex-wrap gap-1.5 justify-start z-10 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                id={`suggest-btn-${q.replace(/\s+/g, '').replace(/[^a-zA-Z]/g, '')}`}
                onClick={() => handleSendMessage(q)}
                className="py-1 px-2 text-[10.5px] font-sans font-medium bg-slate-950/90 hover:bg-slate-950 hover:border-teal-500/30 text-slate-400 hover:text-white border border-slate-800 rounded-lg transition-all text-left truncate max-w-full cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Input controls box */}
      <div className="shrink-0 pt-3 border-t border-slate-800 mt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <input
            id="chat-user-input"
            type="text"
            placeholder={panicLevel ? "Expiate breathing grounding..." : "Ask India laws, case tracing, protective orders..."}
            disabled={panicLevel || loading}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 disabled:opacity-40"
          />
          <button
            id="btn-chat-send"
            type="submit"
            disabled={panicLevel || loading || !input.trim()}
            className="py-3 px-4.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-slate-950 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center shadow-lg shadow-teal-500/10"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
