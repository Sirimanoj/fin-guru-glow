import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Target, TrendingUp, BookOpen, Shield, Brain, Sparkles, IndianRupee } from 'lucide-react';
import { updateProfile } from '@/integrations/supabase/db';
import { toast } from 'sonner';

const Survey = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        financialGoal: '',
        knowledgeLevel: '',
        preferredPersona: '',
        monthlySalary: '',
        assets: [] as string[],
        savingsGoals: ''
    });

    const totalSteps = 6; // Intro, Goal, Details (Salary/Assets), Savings Goals, Knowledge, Persona

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleOptionSelect = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const toggleAsset = (asset: string) => {
        setFormData(prev => {
            const assets = prev.assets.includes(asset)
                ? prev.assets.filter(a => a !== asset)
                : [...prev.assets, asset];
            return { ...prev, assets };
        });
    };

    const handleSubmit = async () => {
        console.log('Survey submitted:', formData);

        // TODO: Determine segment based on answers
        // Simplistic segmentation logic:
        let segment = 'General';
        if (formData.financialGoal === 'invest') segment = 'Investor';
        else if (formData.financialGoal === 'save') segment = 'Saver';
        else if (formData.financialGoal === 'learn') segment = 'Learner';

        try {
            await updateProfile({
                monthly_salary: parseFloat(formData.monthlySalary) || 0,
                assets: formData.assets,
                financial_goals: formData.savingsGoals,
                // store other data if needed or just use for segmentation logic
            });

            // Mock saving to local storage or state management
            localStorage.setItem('fin_user_segment', segment);
            localStorage.setItem('fin_preferred_persona', formData.preferredPersona);
            localStorage.setItem('fin_onboarding_completed', 'true');
            navigate('/dashboard');
        } catch (error) {
            console.error("Error saving survey:", error);
            toast.error("Profile update failed, but taking you to dashboard...");
            // Fallback navigation
            localStorage.setItem('fin_onboarding_completed', 'true');
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-2xl z-10">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${(step / totalSteps) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>Start</span>
                        <span>Preferences</span>
                        <span>Finish</span>
                    </div>
                </div>

                <AnimatePresence mode='wait'>
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6 text-center"
                        >
                            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                                Let's Personalize Your Journey
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                We'd like to know a bit more about you to tailor the financial advice and tools to your specific needs.
                            </p>
                            <button
                                onClick={handleNext}
                                className="mt-8 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-lg hover:opacity-90 transition-all flex items-center gap-2 mx-auto"
                            >
                                Get Started <ArrowRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl font-bold text-center mb-8">What is your primary financial goal?</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { id: 'save', icon: Shield, title: 'Build Savings', desc: 'Secure my future with an emergency fund and consistent savings.' },
                                    { id: 'invest', icon: TrendingUp, title: 'Grow Wealth', desc: 'Invest in stocks, crypto, or other assets for long-term growth.' },
                                    { id: 'learn', icon: BookOpen, title: 'Learn Basics', desc: 'Understand financial concepts and improve my literacy.' },
                                    { id: 'manage', icon: Target, title: 'Manage Debt', desc: 'Optimize my budget and clear outstanding debts.' },
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => handleOptionSelect('financialGoal', option.id)}
                                        className={`p-6 rounded-xl border-2 text-left transition-all hover:scale-[1.02] flex flex-col gap-3
                                            ${formData.financialGoal === option.id
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border bg-card hover:border-primary/50'
                                            }`}
                                    >
                                        <div className={`p-3 rounded-lg w-fit ${formData.financialGoal === option.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                                            <option.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{option.title}</h3>
                                            <p className="text-sm text-muted-foreground">{option.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handleNext}
                                disabled={!formData.financialGoal}
                                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold mt-4 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue
                            </button>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl font-bold text-center mb-8">Financial Profile</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Monthly Salary</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-3 top-3 text-muted-foreground w-5 h-5" />
                                        <input
                                            type="number"
                                            value={formData.monthlySalary}
                                            onChange={(e) => handleOptionSelect('monthlySalary', e.target.value)}
                                            className="w-full p-3 pl-10 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                            placeholder="e.g. 5000"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-3">Assets You Own</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Real Estate/Land', 'Gold/Jewelry', 'Stocks/Bonds', 'Crypto', 'Vehicle', 'Cash Savings'].map(asset => (
                                            <button
                                                key={asset}
                                                onClick={() => toggleAsset(asset)}
                                                className={`p-3 rounded-xl border text-sm font-medium transition-all ${formData.assets.includes(asset)
                                                    ? 'bg-primary/10 border-primary text-primary'
                                                    : 'bg-card border-border hover:border-primary/50'
                                                    }`}
                                            >
                                                {asset}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleNext} className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold mt-4 hover:opacity-90">
                                Continue
                            </button>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl font-bold text-center mb-8">Your Savings Goals</h2>
                            <p className="text-center text-muted-foreground mb-4">What specific things are you saving for?</p>

                            <textarea
                                value={formData.savingsGoals}
                                onChange={(e) => handleOptionSelect('savingsGoals', e.target.value)}
                                className="w-full h-32 p-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                                placeholder="e.g. Buying a house in 5 years, Vacation to Japan, Emergency fund..."
                            />

                            <button onClick={handleNext} className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold mt-4 hover:opacity-90">
                                Continue
                            </button>
                        </motion.div>
                    )}

                    {step === 5 && (
                        <motion.div
                            key="step5"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl font-bold text-center mb-8">How would you rate your financial knowledge?</h2>
                            <div className="space-y-4">
                                {[
                                    { id: 'beginner', title: 'Beginner', desc: 'I am just starting to learn about money management.' },
                                    { id: 'intermediate', title: 'Intermediate', desc: 'I know the basics but want to deepen my understanding.' },
                                    { id: 'advanced', title: 'Advanced', desc: 'I am confident in my investment and saving strategies.' },
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => handleOptionSelect('knowledgeLevel', option.id)}
                                        className={`w-full p-6 rounded-xl border-2 text-left transition-all hover:bg-accent flex items-center justify-between group
                                            ${formData.knowledgeLevel === option.id
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border bg-card'
                                            }`}
                                    >
                                        <div>
                                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{option.title}</h3>
                                            <p className="text-sm text-muted-foreground">{option.desc}</p>
                                        </div>
                                        {formData.knowledgeLevel === option.id && <Check className="w-6 h-6 text-primary" />}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handleNext}
                                disabled={!formData.knowledgeLevel}
                                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold mt-4 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue
                            </button>
                        </motion.div>
                    )}

                    {step === 6 && (
                        <motion.div
                            key="step6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl font-bold text-center mb-8">Choose your AI Financial Guide</h2>
                            <p className="text-center text-muted-foreground mb-8">Who would you like to chat with most often?</p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { id: 'warren', name: 'Warren', style: 'Wisdom & Value', desc: 'Patient, long-term focused, and conservative advice.', icon: Brain },
                                    { id: 'gordon', name: 'Gordon', style: 'Aggressive & Bold', desc: 'High-growth strategies for the ambitious investor.', icon: TrendingUp },
                                    { id: 'maya', name: 'Maya', style: 'Balanced & Modern', desc: 'Holistic approach covering tech, savings, and lifestyle.', icon: Sparkles },
                                ].map((persona) => (
                                    <button
                                        key={persona.id}
                                        onClick={() => handleOptionSelect('preferredPersona', persona.id)}
                                        className={`p-6 rounded-xl border-2 text-left transition-all hover:-translate-y-1 flex flex-col items-center text-center gap-4
                                            ${formData.preferredPersona === persona.id
                                                ? 'border-primary bg-primary/5 ring-2 ring-primary ring-opacity-50'
                                                : 'border-border bg-card'
                                            }`}
                                    >
                                        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-2">
                                            <persona.icon className="w-10 h-10 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl">{persona.name}</h3>
                                            <span className="text-xs uppercase tracking-wider text-primary font-semibold">{persona.style}</span>
                                            <p className="text-sm text-muted-foreground mt-2">{persona.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handleSubmit}
                                className="w-full mt-4 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                            >
                                Complete Setup <ArrowRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Survey;
