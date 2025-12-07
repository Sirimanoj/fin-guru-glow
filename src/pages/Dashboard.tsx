import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, IndianRupee, Target, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useGamification } from '../context/GamificationContext';
import { getMyProfile } from '@/integrations/supabase/db';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import MoodTracker from '../components/MoodTracker';
import { InstallPrompt } from '../components/InstallPrompt';
import { EditFinancialsDialog } from '../components/dashboard/EditFinancialsDialog';

const portfolioData = [
    { name: 'Stocks', value: 400 },
    { name: 'Crypto', value: 300 },
    { name: 'Cash', value: 300 },
    { name: 'Bonds', value: 200 },
];

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981'];

const Dashboard = () => {
    const { t } = useTranslation();
    const { checkStreak, performDailyCheckIn, lastCheckIn } = useGamification();
    const [userSegment, setUserSegment] = useState<string | null>(null);
    const [financials, setFinancials] = useState({
        monthly_salary: 0,
        total_balance: 0,
        monthly_expenses: 0,
        savings_goal_target: 0,
        current_savings: 0,
        investment_portfolio_value: 0
    });
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        const loadProfile = async () => {
            const profile = await getMyProfile();
            if (profile) {
                if (profile.display_name) setUserSegment(profile.display_name);

                const newFinancials = {
                    monthly_salary: profile.monthly_salary || 0,
                    total_balance: profile.total_balance || 0,
                    monthly_expenses: profile.monthly_expenses || 0,
                    savings_goal_target: profile.savings_goal_target || 0,
                    current_savings: profile.current_savings || 0,
                    investment_portfolio_value: profile.investment_portfolio_value || 0
                };
                setFinancials(newFinancials);
                generateChartData(newFinancials.monthly_salary, newFinancials.monthly_expenses);
            } else {
                const segment = localStorage.getItem('fin_user_segment');
                if (segment) setUserSegment(segment);
                generateChartData(50000, 30000); // Default mock
            }
        };
        loadProfile();
        checkStreak();
    }, []);

    const generateChartData = (income: number, expenses: number) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
        // Avoid zeros for nicer looking graphs if data is missing
        const baseIncome = income || 5000;
        const baseExpenses = expenses || 3000;

        const newData = months.map(month => {
            // Visualize "Ups and Downs" by adding random variance to the baseline
            const incomeVariance = (Math.random() * 0.2 - 0.1) * baseIncome; // +/- 10%
            const expenseVariance = (Math.random() * 0.3 - 0.15) * baseExpenses; // +/- 15%

            return {
                name: month,
                income: Math.max(0, Math.floor(baseIncome + incomeVariance)),
                expenses: Math.max(0, Math.floor(baseExpenses + expenseVariance))
            };
        });
        setChartData(newData);
    };

    const isCheckedInToday = () => {
        if (!lastCheckIn) return false;
        const today = new Date();
        const last = new Date(lastCheckIn);
        return today.setHours(0, 0, 0, 0) === last.setHours(0, 0, 0, 0);
    };

    const getSegmentTip = () => {
        switch (userSegment) {
            case 'Saver': return "Tip: Try the 50/30/20 rule to boost your savings.";
            case 'Investor': return "Market Update: Tech sector is rallying. Check your portfolio.";
            case 'Learner': return "Did you know? Compound interest is the 8th wonder of the world.";
            default: return "Track your expenses to find savings opportunities.";
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex justify-between items-end gap-4 flex-wrap md:flex-nowrap">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                        {t('financial_dashboard')}
                    </h1>
                    <p className="text-muted-foreground">
                        Welcome back, {userSegment || 'Friend'}!
                    </p>
                    {userSegment && (
                        <div className="mt-2 text-sm text-primary bg-primary/10 px-3 py-1 rounded-full w-fit">
                            {getSegmentTip()}
                        </div>
                    )}
                </div>
                <div className="text-right flex items-center gap-4">
                    <Button
                        onClick={performDailyCheckIn}
                        disabled={isCheckedInToday()}
                        className={isCheckedInToday()
                            ? "bg-secondary text-muted-foreground border-0"
                            : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0"
                        }
                    >
                        {isCheckedInToday() ? "Checked In ✅" : "Daily Check-in (+50 XP)"}
                    </Button>
                </div>
            </header>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6 rounded-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className="flex justify-between items-start">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <IndianRupee size={64} />
                        </div>
                        <div className="z-10 bg-background/50 backdrop-blur-sm rounded-full">
                            <EditFinancialsDialog
                                initialData={financials}
                                onUpdate={() => window.location.reload()}
                            />
                        </div>
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground">{t('total_balance')}</h3>
                    <p className="text-2xl font-bold mt-2">₹{financials.total_balance.toLocaleString()}</p>
                    <div className="flex items-center gap-1 text-green-400 text-sm mt-2">
                        <TrendingUp size={16} /> +12.5%
                    </div>
                </div>

                <div className="glass-card p-6 rounded-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingDown size={64} />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground">{t('monthly_expenses')}</h3>
                    <p className="text-2xl font-bold mt-2">₹{financials.monthly_expenses.toLocaleString()}</p>
                    <div className="flex items-center gap-1 text-red-400 text-sm mt-2">
                        <TrendingUp size={16} /> +2.1%
                    </div>
                </div>

                <div className="glass-card p-6 rounded-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Target size={64} />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground">{t('savings_goal')}</h3>
                    <p className="text-2xl font-bold mt-2">
                        ₹{financials.current_savings.toLocaleString()} / ₹{financials.savings_goal_target > 0 ? (financials.savings_goal_target / 1000) + 'k' : '0'}
                    </p>
                    <div className="w-full bg-secondary h-2 rounded-full mt-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-500"
                            style={{ width: `${Math.min(((financials.current_savings / (financials.savings_goal_target || 1)) * 100), 100)}%` }}
                        />
                    </div>
                </div>

                <div className="glass-card p-6 rounded-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity size={64} />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground">{t('investment_return')}</h3>
                    <p className="text-2xl font-bold mt-2">₹{financials.investment_portfolio_value.toLocaleString()}</p>
                    <div className="flex items-center gap-1 text-green-400 text-sm mt-2">
                        <TrendingUp size={16} /> +15.2%
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Income vs Expenses Chart */}
                <div className="lg:col-span-2 glass-card p-6 rounded-xl min-h-[400px]">
                    <h3 className="text-lg font-semibold mb-6">{t('income_vs_expenses')}</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.8)', borderColor: 'rgba(255,255,255,0.1)' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="income" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorIncome)" />
                                <Area type="monotone" dataKey="expenses" stroke="#ec4899" fillOpacity={1} fill="url(#colorExpenses)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Portfolio Allocation & Mood Tracker */}
                <div className="space-y-6">
                    <MoodTracker />

                    <div className="glass-card p-6 rounded-xl min-h-[300px]">
                        <h3 className="text-lg font-semibold mb-6">{t('portfolio_allocation')}</h3>
                        <div className="flex flex-col items-center justify-center">
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={portfolioData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {portfolioData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            {/* Legend */}
                            <div className="mt-4 flex justify-center gap-4 flex-wrap">
                                {portfolioData.map((entry, index) => (
                                    <div key={entry.name} className="flex items-center gap-2 text-xs">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                                        <span className="text-muted-foreground">{entry.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">{t('recent_transactions')}</h3>
                <div className="space-y-4">
                    {[
                        { name: 'Apple Store', cat: 'Electronics', amount: -1299.00, date: 'Today' },
                        { name: 'Starbucks', cat: 'Food & Drink', amount: -12.50, date: 'Today' },
                        { name: 'Freelance Work', cat: 'Income', amount: 2500.00, date: 'Yesterday' },
                        { name: 'Uber', cat: 'Transport', amount: -45.00, date: 'Yesterday' },
                    ].map((tx, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-card/30 hover:bg-card/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                    <IndianRupee size={20} />
                                </div>
                                <div>
                                    <p className="font-medium">{tx.name}</p>
                                    <p className="text-xs text-muted-foreground">{tx.cat} • {tx.date}</p>
                                </div>
                            </div>
                            <span className={`font-semibold ${tx.amount > 0 ? 'text-green-400' : 'text-white'}`}>
                                {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <InstallPrompt />
        </div>
    );
};

export default Dashboard;
