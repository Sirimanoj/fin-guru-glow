import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlockedDate?: Date;
}

interface GamificationContextType {
    xp: number;
    level: number;
    streak: number;
    badges: Badge[];
    addXP: (amount: number) => void;
    checkStreak: () => void;
    unlockBadge: (badgeId: string) => void;
    lastCheckIn: Date | null;
    performDailyCheckIn: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500];

const INITIAL_BADGES: Badge[] = [
    { id: 'first_login', name: 'First Step', description: 'Log in to the app for the first time', icon: '🚀', unlocked: false },
    { id: 'streak_3', name: 'On Fire', description: 'Reach a 3-day streak', icon: '🔥', unlocked: false },
    { id: 'streak_7', name: 'Unstoppable', description: 'Reach a 7-day streak', icon: '⚡', unlocked: false },
    { id: 'xp_100', name: 'Novice', description: 'Earn 100 XP', icon: '🌱', unlocked: false },
    { id: 'xp_1000', name: 'Expert', description: 'Earn 1000 XP', icon: '🎓', unlocked: false },
];

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [xp, setXp] = useState(() => {
        const saved = localStorage.getItem('fin_xp');
        return saved ? parseInt(saved) : 0;
    });

    const [streak, setStreak] = useState(() => {
        const saved = localStorage.getItem('fin_streak');
        return saved ? parseInt(saved) : 0;
    });

    const [lastLoginDate, setLastLoginDate] = useState(() => {
        const saved = localStorage.getItem('fin_last_login');
        return saved ? new Date(saved) : null;
    });

    const [lastCheckIn, setLastCheckIn] = useState(() => {
        const saved = localStorage.getItem('fin_last_check_in');
        return saved ? new Date(saved) : null;
    });

    const [badges, setBadges] = useState<Badge[]>(() => {
        const saved = localStorage.getItem('fin_badges');
        return saved ? JSON.parse(saved) : INITIAL_BADGES;
    });

    const level = LEVEL_THRESHOLDS.findIndex(threshold => xp < threshold) === -1
        ? LEVEL_THRESHOLDS.length
        : LEVEL_THRESHOLDS.findIndex(threshold => xp < threshold);

    useEffect(() => {
        localStorage.setItem('fin_xp', xp.toString());
    }, [xp]);

    useEffect(() => {
        localStorage.setItem('fin_streak', streak.toString());
    }, [streak]);

    useEffect(() => {
        if (lastLoginDate) {
            localStorage.setItem('fin_last_login', lastLoginDate.toISOString());
        }
    }, [lastLoginDate]);

    useEffect(() => {
        if (lastCheckIn) {
            localStorage.setItem('fin_last_check_in', lastCheckIn.toISOString());
        }
    }, [lastCheckIn]);

    useEffect(() => {
        localStorage.setItem('fin_badges', JSON.stringify(badges));
    }, [badges]);

    const addXP = (amount: number) => {
        setXp(prev => {
            const newXp = prev + amount;

            // Check for level up
            const oldLevel = LEVEL_THRESHOLDS.findIndex(t => prev < t);
            const newLevel = LEVEL_THRESHOLDS.findIndex(t => newXp < t);

            if (newLevel > oldLevel && oldLevel !== -1) {
                toast.success(`Level Up! You are now level ${newLevel}! 🎉`);
            }

            return newXp;
        });
        toast.success(`+${amount} XP`);
    };

    const checkStreak = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!lastLoginDate) {
            setStreak(1);
            setLastLoginDate(today);
            return;
        }

        const lastLogin = new Date(lastLoginDate);
        lastLogin.setHours(0, 0, 0, 0);

        const diffTime = Math.abs(today.getTime() - lastLogin.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            setStreak(prev => prev + 1);
            setLastLoginDate(today);
            toast.success("Streak continued! 🔥");
        } else if (diffDays > 1) {
            setStreak(1);
            setLastLoginDate(today);
            toast.info("Streak reset. Start fresh! 🌱");
        } else {
            // Same day
            setLastLoginDate(today);
        }
    };

    const performDailyCheckIn = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (lastCheckIn) {
            const last = new Date(lastCheckIn);
            last.setHours(0, 0, 0, 0);
            if (last.getTime() === today.getTime()) {
                toast.error("You've already checked in today! Come back tomorrow.");
                return;
            }
        }

        setLastCheckIn(new Date());
        addXP(50);
        // Ensure streak is updated/checked on proactive action too
        checkStreak();
        toast.success("Daily Check-in Complete!");
    };

    const unlockBadge = (badgeId: string) => {
        setBadges(prev => {
            const badgeIndex = prev.findIndex(b => b.id === badgeId);
            if (badgeIndex === -1 || prev[badgeIndex].unlocked) return prev;

            const newBadges = [...prev];
            newBadges[badgeIndex] = { ...newBadges[badgeIndex], unlocked: true, unlockedDate: new Date() };

            toast.success(`Badge Unlocked: ${newBadges[badgeIndex].name}! ${newBadges[badgeIndex].icon}`);

            return newBadges;
        });
    };

    // Check for badge unlocks when stats change
    useEffect(() => {
        if (streak >= 3) unlockBadge('streak_3');
        if (streak >= 7) unlockBadge('streak_7');
        if (xp >= 100) unlockBadge('xp_100');
        if (xp >= 1000) unlockBadge('xp_1000');
    }, [streak, xp]);

    return (
        <GamificationContext.Provider value={{ xp, level, streak, badges, addXP, checkStreak, unlockBadge, lastCheckIn, performDailyCheckIn }}>
            {children}
        </GamificationContext.Provider>
    );
};

export const useGamification = () => {
    const context = useContext(GamificationContext);
    if (context === undefined) {
        throw new Error('useGamification must be used within a GamificationProvider');
    }
    return context;
};
