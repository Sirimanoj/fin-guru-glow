import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bookmark, Mic, Play, Send, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { listChatHistory, addChatMessage } from "@/integrations/supabase/db";

const AVATARS = [
  { id: "buffett", name: "Warren", color: "bg-purple-500/20" },
  { id: "naval", name: "Naval", color: "bg-teal-500/20" },
  { id: "dalio", name: "Ray", color: "bg-indigo-500/20" },
];

const AVATAR_QUOTES: Record<string, { text: string; author: string }> = {
  buffett: {
    text: "Price is what you pay; value is what you get. Compound relentlessly.",
    author: "Warren Buffett",
  },
  naval: {
    text: "Specific knowledge is found by pursuing your genuine curiosity and passion.",
    author: "Naval Ravikant",
  },
  dalio: {
    text: "Pain + reflection = progress. Build principles that compound your outcomes.",
    author: "Ray Dalio",
  },
};

type Msg = { id: number; role: "user" | "ai"; text: string };
const initial: Msg[] = [
  { id: 1, role: "ai", text: "Hey Money Maestro! What goal are we optimizing for this month?" },
];

const Chat = () => {
  const [active, setActive] = useState("naval");
  const [messages, setMessages] = useState<Msg[]>(initial);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const { isRecording, transcript, error: sttError, startRecording, stopRecording, reset } = useSpeechToText();

  useEffect(() => {
    document.title = "AI Chat — Finance Personas | Gen Z Money Coach";
    const meta = document.querySelector('meta[name="description"]');
    const content = "Chat with Warren, Naval, or Ray—AI personas for budgets, investing, and goals.";
    if (meta) meta.setAttribute("content", content);
  }, []);

  useEffect(() => {
    if (sttError) {
      toast({ title: "Mic error", description: sttError, variant: "destructive" });
    }
  }, [sttError]);

  useEffect(() => {
    if (transcript && !isRecording) {
      setInput(transcript);
      handleSend(transcript);
      reset();
    }
  }, [transcript, isRecording]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await listChatHistory({ avatarId: active, limit: 10 });
        const msgs: Msg[] = [];
        rows.reverse().forEach((r: any, idx: number) => {
          msgs.push({ id: Date.now() + idx * 2, role: "user", text: r.user_message });
          if (r.ai_response) {
            msgs.push({ id: Date.now() + idx * 2 + 1, role: "ai", text: r.ai_response });
          }
        });
        if (!cancelled) setMessages(msgs.length ? msgs : initial);
      } catch (e) {
        console.warn("History load skipped:", e);
        if (!cancelled) setMessages(initial);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [active]);

const handleSend = async (forcedText?: string) => {
    if (sending) return;
    const text = (forcedText ?? input).trim();
    if (!text) return;
    const userMsg: Msg = { id: Date.now(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);
    try {
      const history = [...messages, userMsg].slice(-8).map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      }));
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: { avatar_id: active, message: text, history },
      });
      if (error) throw error;
      const replyText = data?.reply || "";
      const aiMsg: Msg = { id: Date.now() + 1, role: "ai", text: replyText };
      setMessages((prev) => [...prev, aiMsg]);

      try {
        await addChatMessage({ avatar_id: active, user_message: text, ai_response: replyText });
      } catch (e) {
        console.warn("Chat save skipped:", e);
      }
    } catch (e: any) {
      console.error("Chat error:", e);
      toast({
        title: "Chat error",
        description: e?.message ?? "Unable to get a reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="container py-8">
      <h1 className="sr-only">Chat with FinAvatars</h1>

      {/* Avatar selector */}
      <div className="flex gap-3 overflow-x-auto pb-3">
        {AVATARS.map((a) => (
          <button
            key={a.id}
            onClick={() => setActive(a.id)}
            className={`px-4 py-2 rounded-xl glass ${active === a.id ? "ring-2 ring-ring" : ""}`}
            aria-pressed={active === a.id}
          >
            <div className="flex items-center gap-2">
              <Avatar className={`${a.color} border border-border`}>
                <AvatarFallback>{a.name[0]}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{a.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Chat window */}
      <Card key={active} className="card-neo p-4 md:p-6 mt-4 animate-enter">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl ${m.role === "user" ? "bg-accent/20" : "glass"}`}>
                <p className="text-sm leading-relaxed">{m.text}</p>
                {m.role === "ai" && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <button className="hover:text-accent flex items-center gap-1"><Play className="h-3 w-3"/> Voice</button>
                    <span>•</span>
                    <button className="hover:text-accent flex items-center gap-1"><Bookmark className="h-3 w-3"/> Bookmark</button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {sending && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <div className="typing-dots"><span></span><span></span><span></span></div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="mt-4 flex items-center gap-2">
          <Button
            variant={isRecording ? "hero" : "glass"}
            size="icon"
            aria-label={isRecording ? "Stop recording" : "Start recording"}
            onClick={() => (isRecording ? stopRecording() : startRecording())}
            disabled={sending}
            className={isRecording ? "pulse" : ""}
          >
            <Mic />
          </Button>
          {isRecording && <span className="text-xs text-accent ml-1">Listening…</span>}
          <Input
            placeholder="Ask about budgets, investing, or goals..."
            className="rounded-2xl"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <Button variant="hero" aria-label="Send" onClick={() => handleSend()} disabled={sending || !input.trim()}>
            <Send />
          </Button>
        </div>
      </Card>

      {/* Quote highlight */}
      <Card className="card-neo p-4 mt-4">
        <p className="text-sm text-muted-foreground">
          {`“${AVATAR_QUOTES[active].text}” — ${AVATAR_QUOTES[active].author}`}
        </p>
      </Card>
    </main>
  );
};

export default Chat;
