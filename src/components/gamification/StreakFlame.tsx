import { useGamification } from '../../context/GamificationContext';
import { cn } from '../../lib/utils';
import { Flame } from 'lucide-react';

export const StreakFlame = () => {
    const { streak } = useGamification();

    const isActive = streak > 0;

    return (
        <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300",
            isActive
                ? "bg-orange-500/10 border-orange-500/20 text-orange-500"
                : "bg-secondary/50 border-white/10 text-muted-foreground"
        )}>
            <Flame
                size={18}
                className={cn(
                    "transition-all duration-500",
                    isActive && "fill-orange-500 animate-pulse"
                )}
            />
            <span className="font-bold">{streak}</span>
        </div>
    );
};
