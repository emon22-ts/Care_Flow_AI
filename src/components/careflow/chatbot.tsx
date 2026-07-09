import { useState, useEffect, useRef } from "react";
import { useDemo } from "@/context/DemoContext";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Msg {
  id: string;
  role: "user" | "assistant";
  text: string;
  streaming?: boolean;
}

const quickReplies = [
  "Check my queue position",
  "Explain my prescription",
  "What does borderline mean?",
  "How can I get seen sooner?",
];

function answerFor(prompt: string, ctx: { position: number; specialty: string }) {
  const p = prompt.toLowerCase();
  if (p.includes("queue") || p.includes("position"))
    return `You're currently position #${ctx.position} on the ${ctx.specialty} waiting list. I'm actively watching for earlier appointments and will let you know the moment one opens up nearby.`;
  if (p.includes("prescription"))
    return `Your current prescription is ramipril 5mg once daily — it helps lower blood pressure and protect your heart. Take it at the same time each day, and let your GP know if you have a persistent dry cough.`;
  if (p.includes("borderline"))
    return `A "borderline" result sits just outside the normal range. It's usually not urgent, but your care team may want to monitor it or suggest small lifestyle changes.`;
  if (p.includes("sooner") || p.includes("earlier"))
    return `Two quick things help: turn on Flexible for short notice, and widen your travel distance. This makes you eligible for more slots that open unexpectedly.`;
  return `Great question. I can help with your queue, appointments, results, prescriptions, and referrals — try one of the suggestions below.`;
}

export function HealthAssistant() {
  const { patientPosition } = useDemo();
  const [messages, setMessages] = useState<Msg[]>([
    { id: "m0", role: "assistant", text: "Hi, I'm your CareFlow assistant. How can I help today?" },
  ]);
  const [input, setInput]   = useState("");
  const [busy, setBusy]     = useState(false);
  const listRef             = useRef<HTMLDivElement | null>(null);
  const streamRef           = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => { if (streamRef.current) clearInterval(streamRef.current); };
  }, []);

  const send = (text: string) => {
    if (!text.trim() || busy) return;
    const userMsg: Msg = { id: `u${Date.now()}`, role: "user", text };
    const assistantId  = `a${Date.now()}`;
    setMessages((m) => [...m, userMsg, { id: assistantId, role: "assistant", text: "", streaming: true }]);
    setInput("");
    setBusy(true);
    const full = answerFor(text, { position: patientPosition, specialty: "Cardiology" });
    let i = 0;
    streamRef.current = setInterval(() => {
      i += 2;
      setMessages((m) =>
        m.map((msg) => msg.id === assistantId ? { ...msg, text: full.slice(0, i) } : msg),
      );
      if (i >= full.length) {
        if (streamRef.current) clearInterval(streamRef.current);
        streamRef.current = null;
        setMessages((m) => m.map((msg) => msg.id === assistantId ? { ...msg, streaming: false } : msg));
        setBusy(false);
      }
    }, 22);
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Chat header */}
      <div className="border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-foreground">Health Assistant</p>
            <p className="flex items-center gap-1 text-[10px] text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success glow-pulse" />
              Online · CareFlow AI
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <div key={m.id} className={cn("flex gap-2 items-end", m.role === "user" ? "justify-end" : "justify-start")}>
            {m.role === "assistant" && (
              <div className="mb-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-3 w-3" />
              </div>
            )}
            <div className={cn(
              "max-w-[78%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed",
              m.role === "user"
                ? "rounded-br-sm bg-primary text-primary-foreground shadow-sm"
                : "rounded-bl-sm bg-muted text-foreground",
            )}>
              {m.text || (m.streaming ? "" : "")}
              {m.streaming && <TypingDots />}
            </div>
            {m.role === "user" && (
              <div className="mb-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <User className="h-3 w-3" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="border-t border-border bg-card px-3 py-2.5">
        {/* Quick replies */}
        <div className="mb-2 flex flex-wrap gap-1.5">
          {quickReplies.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              disabled={busy}
              className="rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-medium text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Text input */}
        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your care…"
            className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-[13px] text-foreground placeholder:text-muted-foreground/60 transition-all focus:border-primary/40 focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Message assistant"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 disabled:opacity-45 disabled:cursor-not-allowed"
            aria-label="Send"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="ml-1 inline-flex gap-0.5 align-middle">
      {[0, 0.15, 0.3].map((delay, i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-current"
          style={{ animation: "typing-dot 1.2s infinite", animationDelay: `${delay}s` }}
        />
      ))}
    </span>
  );
}
