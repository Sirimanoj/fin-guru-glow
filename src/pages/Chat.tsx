import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bookmark, Mic, Play, Send, Sparkles } from "lucide-react";

const AVATARS = [
  { id: "buffett", name: "Warren", color: "bg-purple-500/20" },
  { id: "naval", name: "Naval", color: "bg-teal-500/20" },
  { id: "dalio", name: "Ray", color: "bg-indigo-500/20" },
];

type Msg = { id: number; role: "user" | "ai"; text: string };

const initial: Msg[] = [
  { id: 1, role: "ai", text: "Hey Money Maestro! What goal are we optimizing for this month?" },
];

const Chat = () => {
  const [active, setActive] = useState("naval");
  const [messages] = useState<Msg[]>(initial);

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
      <Card className="card-neo p-4 md:p-6 mt-4">
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
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <div className="typing-dots"><span></span><span></span><span></span></div>
          </div>
        </div>

        {/* Input */}
        <div className="mt-4 flex items-center gap-2">
          <Button variant="glass" size="icon" aria-label="Speech to text"><Mic /></Button>
          <Input placeholder="Ask about budgets, investing, or goals..." className="rounded-2xl" />
          <Button variant="hero" aria-label="Send"><Send /></Button>
        </div>
      </Card>

      {/* Quote highlight */}
      <Card className="card-neo p-4 mt-4">
        <p className="text-sm text-muted-foreground">
          “Specific knowledge is found by pursuing your genuine curiosity and passion.” — Naval
        </p>
      </Card>
    </main>
  );
};

export default Chat;
