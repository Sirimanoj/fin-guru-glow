import { useGamification } from '../../context/GamificationContext';
import { cn } from '../../lib/utils';
import { Lock } from 'lucide-react';

export const BadgeGrid = () => {
    const { badges } = useGamification();

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {badges.map((badge) => (
                <div
                    key={badge.id}
                    className={cn(
                        "aspect-square rounded-2xl flex flex-col items-center justify-center p-4 text-center transition-all duration-300 border",
                        badge.unlocked
                            ? "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:scale-105"
                            : "bg-secondary/30 border-white/5 opacity-70 grayscale"
                    )}
                >
                    <div className="text-4xl mb-3 relative">
                        {badge.icon}
                        {!badge.unlocked && (
                            <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-full backdrop-blur-[1px]">
                                <Lock size={16} className="text-muted-foreground" />
                            </div>
                        )}
                    </div>
                    <h3 className={cn("font-bold text-sm mb-1", badge.unlocked ? "text-foreground" : "text-muted-foreground")}>
                        {badge.name}
                    </h3>
                    <p className="text-[10px] text-muted-foreground line-clamp-2">
                        {badge.description}
                    </p>
                </div>
            ))}
        </div>
    );
};
