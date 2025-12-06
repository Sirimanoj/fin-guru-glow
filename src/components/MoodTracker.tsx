import { useState, useEffect } from 'react';
import { Smile, Frown, Meh, Annoyed, Star, History } from 'lucide-react';
import { cn } from '../lib/utils';

type Mood = 'happy' | 'sad' | 'neutral' | 'stressed' | 'excited';

interface MoodEntry {
    date: string;
    mood: Mood;
    timestamp: number;
}

const MOODS: { type: Mood; icon: any; label: string; color: string }[] = [
    { type: 'excited', icon: Star, label: 'Excited', color: 'text-yellow-400' },
    { type: 'happy', icon: Smile, label: 'Happy', color: 'text-green-400' },
    { type: 'neutral', icon: Meh, label: 'Neutral', color: 'text-gray-400' },
    { type: 'stressed', icon: Annoyed, label: 'Stressed', color: 'text-orange-400' },
    { type: 'sad', icon: Frown, label: 'Sad', color: 'text-blue-400' },
];

const MoodTracker = () => {
    const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
    const [insight, setInsight] = useState<string>('');
    const [history, setHistory] = useState<MoodEntry[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        // Load mood history
        const savedHistory = localStorage.getItem('mood_history');
        if (savedHistory) {
            const parsedHistory: MoodEntry[] = JSON.parse(savedHistory);
            setHistory(parsedHistory);

            // Check if logged today
            const today = new Date().toDateString();
            const todayEntry = parsedHistory.find(entry => entry.date === today);
            if (todayEntry) {
                setSelectedMood(todayEntry.mood);
                generateInsight(todayEntry.mood);
            }
        }
    }, []);

    const handleMoodSelect = (mood: Mood) => {
        setSelectedMood(mood);
        generateInsight(mood);

        const today = new Date().toDateString();
        const newEntry: MoodEntry = { date: today, mood, timestamp: Date.now() };

        // Filter out any existing entry for today and add new one
        const newHistory = [newEntry, ...history.filter(h => h.date !== today)];

        setHistory(newHistory);
        localStorage.setItem('mood_history', JSON.stringify(newHistory));
    };

    const generateInsight = (mood: Mood) => {
        const insights = {
            excited: "You tend to make impulse purchases when excited. Watch your wallet!",
            happy: "Great mood! You usually stick to your budget on happy days.",
            neutral: "Steady state. A good day to review your long-term goals.",
            stressed: "Warning: You spend 20% more on 'Comfort Food' when stressed.",
            sad: "Retail therapy alert. Try a free activity like walking instead."
        };
        setInsight(insights[mood]);
    };

    return (
        <div className="glass-card p-6 rounded-xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Daily Mood Tracker</h3>
                <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                >
                    <History size={14} /> {showHistory ? 'Hide History' : 'History'}
                </button>
            </div>

            <div className="flex justify-between items-center gap-2 mb-6">
                {MOODS.map((m) => {
                    const Icon = m.icon;
                    const isSelected = selectedMood === m.type;

                    return (
                        <button
                            key={m.type}
                            onClick={() => handleMoodSelect(m.type)}
                            className={cn(
                                "flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300",
                                isSelected
                                    ? "bg-primary/20 scale-110 ring-2 ring-primary"
                                    : "hover:bg-card/50 hover:scale-105 opacity-70 hover:opacity-100"
                            )}
                        >
                            <Icon size={32} className={cn(isSelected ? m.color : "text-muted-foreground")} />
                            <span className="text-xs font-medium">{m.label}</span>
                        </button>
                    );
                })}
            </div>

            {insight && !showHistory && (
                <div className="bg-secondary/50 p-4 rounded-lg border border-border animate-in fade-in slide-in-from-bottom-2">
                    <p className="text-sm text-center font-medium text-foreground">
                        💡 {insight}
                    </p>
                </div>
            )}

            {showHistory && (
                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-2">
                    {history.length === 0 ? (
                        <p className="text-center text-xs text-muted-foreground py-4">No mood history yet.</p>
                    ) : (
                        history.map((entry, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-sm">
                                <span className="text-muted-foreground">{entry.date}</span>
                                <span className={cn("font-medium capitalize", MOODS.find(m => m.type === entry.mood)?.color)}>
                                    {entry.mood}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default MoodTracker;
