import { useState } from 'react';
import { User, Settings, Bell, Moon, Shield, LogOut, CreditCard, Award } from 'lucide-react';
import { cn } from '../lib/utils';

import { BadgeGrid } from '../components/gamification/BadgeGrid';
import { useGamification } from '../context/GamificationContext';

const Profile = () => {
    const { xp, level, streak } = useGamification();
    const [darkMode, setDarkMode] = useState(true);
    const [notifications, setNotifications] = useState(true);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header Card */}
            <div className="glass-card p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />

                <div className="relative flex flex-col md:flex-row items-center gap-6 mt-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 p-[2px] shadow-xl">
                        <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                            <User size={40} className="text-muted-foreground" />
                        </div>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl font-bold">Alex Johnson</h1>
                        <p className="text-muted-foreground">@alex_finance_guru</p>
                        <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                                Pro Member
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Member since Dec 2024
                            </span>
                        </div>
                    </div>

                    <button className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
                        Edit Profile
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/5">
                    <div className="text-center p-4 rounded-xl bg-secondary/30">
                        <div className="text-2xl font-bold text-green-400">{level}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Level</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-secondary/30">
                        <div className="text-2xl font-bold text-blue-400">{xp}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Total XP</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-secondary/30">
                        <div className="text-2xl font-bold text-purple-400">{streak}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Streak Days</div>
                    </div>
                </div>
            </div>

            {/* Badges Section */}
            <div className="glass-card p-6 rounded-2xl space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <Award className="text-primary" size={24} />
                    <h2 className="text-xl font-semibold">Achievements</h2>
                </div>
                <BadgeGrid />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Settings Section */}
                <div className="glass-card p-6 rounded-2xl space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Settings className="text-primary" size={24} />
                        <h2 className="text-xl font-semibold">Preferences</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                                    <Moon size={20} />
                                </div>
                                <div>
                                    <p className="font-medium">Dark Mode</p>
                                    <p className="text-xs text-muted-foreground">Easy on the eyes</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={cn(
                                    "w-12 h-6 rounded-full transition-colors relative",
                                    darkMode ? "bg-primary" : "bg-muted"
                                )}
                            >
                                <div className={cn(
                                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                                    darkMode ? "left-7" : "left-1"
                                )} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <p className="font-medium">Notifications</p>
                                    <p className="text-xs text-muted-foreground">Stay updated</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={cn(
                                    "w-12 h-6 rounded-full transition-colors relative",
                                    notifications ? "bg-primary" : "bg-muted"
                                )}
                            >
                                <div className={cn(
                                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                                    notifications ? "left-7" : "left-1"
                                )} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Account Section */}
                <div className="glass-card p-6 rounded-2xl space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Shield className="text-primary" size={24} />
                        <h2 className="text-xl font-semibold">Security & Account</h2>
                    </div>

                    <div className="space-y-2">
                        <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-left group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                                    <Shield size={20} />
                                </div>
                                <span className="font-medium group-hover:text-primary transition-colors">Privacy Settings</span>
                            </div>
                        </button>

                        <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-left group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                                    <CreditCard size={20} />
                                </div>
                                <span className="font-medium group-hover:text-primary transition-colors">Billing & Subscription</span>
                            </div>
                        </button>

                        <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-destructive/10 transition-colors text-left group mt-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
                                    <LogOut size={20} />
                                </div>
                                <span className="font-medium text-destructive">Sign Out</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
