import { useGamification } from '../../context/GamificationContext';
import { Star } from 'lucide-react';

export const XPIndicator = () => {
    const { xp, level } = useGamification();

    // Calculate progress to next level
    // Assuming simple linear progression for visualization for now or use the thresholds from context if exported, 
    // but for simplicity let's just animate the bar.
    // We'll trust the simple visual for now: Level X (XP)

    return (
        <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full border border-white/10">
            <div className="p-1 rounded-full bg-yellow-500/20 text-yellow-500">
                <Star size={14} fill="currentColor" />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-muted-foreground leading-none">Level {level}</span>
                <span className="text-xs font-bold leading-none">{xp} XP</span>
            </div>
        </div>
    );
};
