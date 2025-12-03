import { useState } from 'react';
import { Send, Mic, Bot } from 'lucide-react';
import { cn } from '../lib/utils';

type Persona = 'warren' | 'naval' | 'dalio';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    persona?: Persona;
}

const PERSONAS = {
    warren: {
        name: 'Warren Buffett',
        role: 'Value Investor',
        color: 'from-blue-500 to-cyan-500',
        avatar: 'WB',
        intro: "Hello! I'm Warren. Let's talk about value investing and the power of compounding."
    },
    naval: {
        name: 'Naval Ravikant',
        role: 'Angel Philosopher',
        color: 'from-purple-500 to-pink-500',
        avatar: 'NR',
        intro: "I'm Naval. Seek wealth, not money or status. What specific knowledge can I help you with?"
    },
    dalio: {
        name: 'Ray Dalio',
        role: 'Macro Economist',
        color: 'from-amber-500 to-orange-500',
        avatar: 'RD',
        intro: "I'm Ray. Let's look at the economic machine and principles for success."
    }
};

const Chat = () => {
    const [activePersona, setActivePersona] = useState<Persona>('warren');
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: PERSONAS['warren'].intro, persona: 'warren' }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Mock response
        setTimeout(() => {
            const responses = [
                "That's an interesting perspective. In the long run, the market is a weighing machine.",
                "Compound interest is the eighth wonder of the world. He who understands it, earns it.",
                "Price is what you pay. Value is what you get.",
                "The most important investment you can make is in yourself."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: randomResponse,
                persona: activePersona
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const handlePersonaChange = (persona: Persona) => {
        setActivePersona(persona);
        setMessages([{
            id: Date.now().toString(),
            role: 'assistant',
            content: PERSONAS[persona].intro,
            persona: persona
        }]);
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6 animate-in fade-in duration-500">
            {/* Persona Selector Sidebar */}
            <div className="w-64 hidden lg:flex flex-col gap-4">
                <h2 className="text-lg font-semibold px-2">Select Mentor</h2>
                {Object.entries(PERSONAS).map(([key, p]) => (
                    <button
                        key={key}
                        onClick={() => handlePersonaChange(key as Persona)}
                        className={cn(
                            "p-4 rounded-xl text-left transition-all duration-300 border border-transparent",
                            activePersona === key
                                ? "bg-card border-primary/50 shadow-[0_0_20px_rgba(124,58,237,0.2)] scale-105"
                                : "bg-card/30 hover:bg-card/50 hover:scale-102"
                        )}
                    >
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mb-3 bg-gradient-to-br", p.color)}>
                            {p.avatar}
                        </div>
                        <h3 className="font-semibold">{p.name}</h3>
                        <p className="text-xs text-muted-foreground">{p.role}</p>
                    </button>
                ))}
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col glass-card rounded-xl overflow-hidden relative">
                {/* Chat Header */}
                <div className="p-4 border-b border-border bg-card/30 flex items-center gap-4 backdrop-blur-md z-10">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br", PERSONAS[activePersona].color)}>
                        {PERSONAS[activePersona].avatar}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">{PERSONAS[activePersona].name}</h2>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Online
                        </p>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-6 overflow-y-auto space-y-6 scroll-smooth">
                    {messages.map((msg) => (
                        <div key={msg.id} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                            <div className={cn(
                                "max-w-[80%] p-4 rounded-2xl shadow-sm relative group",
                                msg.role === 'user'
                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                    : "bg-secondary text-secondary-foreground rounded-tl-none"
                            )}>
                                {msg.role === 'assistant' && (
                                    <div className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-card flex items-center justify-center border border-border">
                                        <Bot size={16} className="text-primary" />
                                    </div>
                                )}
                                <p className="text-sm leading-relaxed">{msg.content}</p>
                                <span className="text-[10px] opacity-50 mt-2 block">
                                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-secondary p-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
                                <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-border bg-card/30 backdrop-blur-md">
                    <div className="flex gap-2 items-center bg-background/50 p-2 rounded-xl border border-border focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                        <button className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                            <Mic size={20} />
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={`Ask ${PERSONAS[activePersona].name} anything...`}
                            className="flex-1 bg-transparent border-none focus:ring-0 placeholder:text-muted-foreground px-2"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
