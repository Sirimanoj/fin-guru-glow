import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Mic, Sparkles, BookOpen, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMyProfile } from '@/integrations/supabase/db';
import { useToast } from '../components/ui/use-toast';

type Persona = 'warren' | 'naval' | 'dalio';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    persona?: Persona;
    sources?: { title: string; section: string }[];
}

const PERSONAS = {
    warren: {
        name: 'Warren Buffett',
        role: 'The Oracle of Omaha',
        color: 'from-blue-600 to-cyan-500',
        avatar: 'WB',
        introKey: "warren_intro",
        style: "folksy, patient, focused on long-term value, uses metaphors about moats and compounding",
    },
    naval: {
        name: 'Naval Ravikant',
        role: 'Angel Philosopher',
        color: 'from-purple-600 to-pink-500',
        avatar: 'NR',
        introKey: "naval_intro",
        style: "philosophical, concise, focused on leverage and specific knowledge",
    },
    dalio: {
        name: 'Ray Dalio',
        role: 'Macro Economist',
        color: 'from-amber-500 to-orange-600',
        avatar: 'RD',
        introKey: "dalio_intro",
        style: "analytical, principle-based, focused on cycles and diversification",
    }
};

const Chat = () => {
    const { t } = useTranslation();
    const { personaId } = useParams<{ personaId: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();

    // Get preferred persona from storage or default to warren
    const preferredPersona = (localStorage.getItem('fin_preferred_persona') as Persona) || 'warren';
    const activePersona = (personaId as Persona) || preferredPersona;

    // Validate persona
    useEffect(() => {
        if (!PERSONAS[activePersona]) {
            navigate(`/chat/${preferredPersona}`);
        }
    }, [activePersona, navigate, preferredPersona]);

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [userProfile, setUserProfile] = useState<any>(null);

    // Load user profile
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profile = await getMyProfile();
                if (profile) setUserProfile(profile);
            } catch (error) {
                console.error("Failed to load profile for chat context", error);
            }
        };
        loadProfile();
    }, []);

    // Load messages from localStorage when persona changes
    useEffect(() => {
        const savedMessages = localStorage.getItem(`chat_history_${activePersona}`);
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        } else {
            // Initial message if no history
            setMessages([{
                id: 'init',
                role: 'assistant',
                content: t(PERSONAS[activePersona].introKey),
                persona: activePersona
            }]);
        }
    }, [activePersona, t]);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem(`chat_history_${activePersona}`, JSON.stringify(messages));
        }
    }, [messages, activePersona]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);

        // Call RAG Backend
        const callRagBackend = async () => {
            try {
                // Construct user context from profile
                let contextMessage = "User Context: ";
                if (userProfile) {
                    contextMessage += `Monthly Salary: ₹${userProfile.monthly_salary}, `;
                    contextMessage += `Expenses: ₹${userProfile.monthly_expenses}, `;
                    contextMessage += `Savings: ₹${userProfile.current_savings}, `;
                    contextMessage += `Goal: ₹${userProfile.savings_goal_target}, `;
                    contextMessage += `Portfolio: ₹${userProfile.investment_portfolio_value}. `;
                } else {
                    contextMessage += "No specific financial data available. ";
                }
                contextMessage += "Please keep this context in mind when answering, but do not explicitly mention the numbers unless relevant.";

                // Prepare history (convert to backend format)
                const history = newMessages.map(m => ({
                    role: m.role,
                    content: m.content
                }));

                // Inject context as the first history item
                history.unshift({ role: "user", content: contextMessage });

                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                const response = await fetch(`${apiUrl}/api/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: "current_user",
                        message: userMsg.content, // Use the message content we just added
                        locale: "en-IN",
                        persona: activePersona,
                        history: history
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch from RAG backend');
                }

                const data = await response.json();

                const aiMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: data.answer,
                    persona: activePersona,
                    sources: data.sources
                };
                setMessages(prev => [...prev, aiMsg]);

            } catch (error) {
                console.error("RAG Error:", error);
                toast({
                    title: "AI Service Unavailable",
                    description: "Falling back to offline mode. Please ensure the backend server is running on port 8000.",
                    variant: "destructive"
                });

                // Fallback to mock logic
                setTimeout(() => {
                    const lowerInput = userMsg.content.toLowerCase();
                    let topic = 'default';

                    if (lowerInput.includes('invest') || lowerInput.includes('stock') || lowerInput.includes('buy')) {
                        topic = 'invest';
                    } else if (lowerInput.includes('crypto') || lowerInput.includes('bitcoin')) {
                        topic = 'crypto';
                    }

                    const response = t(`${activePersona}_${topic}_response`);

                    const aiMsg: Message = {
                        id: (Date.now() + 1).toString(),
                        role: 'assistant',
                        content: response + "\n\n(Offline Mode - could not connect to RAG backend)",
                        persona: activePersona
                    };
                    setMessages(prev => [...prev, aiMsg]);
                }, 1000);
            } finally {
                setIsTyping(false);
            }
        };

        callRagBackend();
    };

    if (!PERSONAS[activePersona]) return null;

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6 animate-in fade-in duration-500">
            {/* Persona Selector Sidebar */}
            <div className="w-64 hidden lg:flex flex-col gap-4">
                <div className="flex items-center gap-2 px-2 mb-2">
                    <Sparkles className="text-primary" size={20} />
                    <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                        {t('ai_mentors')}
                    </h2>
                </div>
                {Object.entries(PERSONAS).map(([key, p]) => (
                    <Link
                        key={key}
                        to={`/chat/${key}`}
                        className={cn(
                            "p-4 rounded-xl text-left transition-all duration-300 border relative overflow-hidden group",
                            activePersona === key
                                ? "bg-card border-primary/50 shadow-lg scale-105"
                                : "bg-card/30 border-transparent hover:bg-card/50 hover:scale-102"
                        )}
                    >
                        <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-r", p.color)} />
                        <div className="flex items-center gap-3 relative z-10">
                            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md bg-gradient-to-br", p.color)}>
                                {p.avatar}
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">{p.name}</h3>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{p.role}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col glass-card rounded-2xl overflow-hidden relative border border-white/5 shadow-2xl">
                {/* Chat Header */}
                <div className="p-4 border-b border-white/5 bg-black/20 backdrop-blur-xl flex items-center justify-between z-10">
                    <div className="flex items-center gap-4">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br shadow-inner", PERSONAS[activePersona].color)}>
                            {PERSONAS[activePersona].avatar}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">{PERSONAS[activePersona].name}</h2>
                            <div className="flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <p className="text-xs text-green-400 font-medium">{t('online_ready')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-6 overflow-y-auto space-y-6 scroll-smooth custom-scrollbar">
                    {messages.map((msg) => (
                        <div key={msg.id} className={cn("flex w-full animate-in slide-in-from-bottom-2 duration-300", msg.role === 'user' ? "justify-end" : "justify-start")}>
                            <div className={cn(
                                "max-w-[85%] lg:max-w-[75%] p-5 rounded-3xl shadow-lg relative group transition-all",
                                msg.role === 'user'
                                    ? "bg-primary text-primary-foreground rounded-tr-md"
                                    : "bg-secondary/40 backdrop-blur-md border border-white/10 text-secondary-foreground rounded-tl-md"
                            )}>
                                {msg.role === 'assistant' && (
                                    <div className="absolute -left-10 lg:-left-12 top-0">
                                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-[10px] text-white font-bold bg-gradient-to-br shadow-lg ring-2 ring-background", PERSONAS[msg.persona || activePersona].color)}>
                                            {PERSONAS[msg.persona || activePersona].avatar}
                                        </div>
                                    </div>
                                )}

                                {/* Content with basic markdown rendering */}
                                <div className="space-y-2 text-sm leading-relaxed">
                                    {msg.content.split('\n').map((line, i) => {
                                        // Simple bold parsing
                                        const parts = line.split(/(\*\*.*?\*\*)/g);
                                        return (
                                            <p key={i} className="min-h-[1rem]">
                                                {parts.map((part, j) => {
                                                    if (part.startsWith('**') && part.endsWith('**')) {
                                                        return <strong key={j} className="text-primary-foreground/90 font-bold">{part.slice(2, -2)}</strong>;
                                                    }
                                                    if (part.startsWith('###')) {
                                                        return <span key={j} className="block text-lg font-bold mt-2 mb-1 text-purple-300">{part.replace(/^###\s*/, '')}</span>
                                                    }
                                                    if (part.startsWith('- ')) {
                                                        return <span key={j} className="block pl-4 border-l-2 border-white/10 my-1">{part}</span>
                                                    }
                                                    return part;
                                                })}
                                            </p>
                                        );
                                    })}
                                </div>

                                {/* Sources Section */}
                                {msg.sources && msg.sources.length > 0 && (
                                    <div className="mt-4 pt-3 border-t border-white/10">
                                        <details className="group">
                                            <summary className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-primary transition-colors select-none">
                                                <BookOpen size={12} />
                                                <span>{msg.sources.length} Sources Cited</span>
                                                <ChevronDown size={12} className="group-open:rotate-180 transition-transform" />
                                            </summary>
                                            <div className="mt-2 space-y-1 pl-5">
                                                {msg.sources.map((source, idx) => (
                                                    <div key={idx} className="text-[10px] text-muted-foreground/80 flex items-center gap-1.5">
                                                        <span className="w-1 h-1 rounded-full bg-primary/50" />
                                                        <span className="font-medium text-purple-200">{source.title}</span>
                                                        <span className="opacity-50">({source.section})</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </details>
                                    </div>
                                )}

                                <span className="text-[10px] opacity-40 mt-2 block text-right font-mono">
                                    {new Date(parseInt(msg.id) || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start animate-in fade-in">
                            <div className="bg-secondary/50 p-4 rounded-2xl rounded-tl-sm flex gap-1.5 items-center ml-12">
                                <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-xl">
                    <div className="flex gap-2 items-center bg-secondary/30 p-2 rounded-xl border border-white/5 focus-within:ring-2 focus-within:ring-primary/50 transition-all shadow-inner">
                        <button className="p-2.5 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-primary">
                            <Mic size={20} />
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={t('type_message', { name: PERSONAS[activePersona].name })}
                            className="flex-1 bg-transparent border-none focus:ring-0 placeholder:text-muted-foreground px-2 text-sm"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="p-2.5 rounded-lg bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <p className="text-[10px] text-center text-muted-foreground mt-2 opacity-50">
                        {t('ai_disclaimer')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Chat;
