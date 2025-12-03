import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, Activity } from 'lucide-react';

const data = [
    { name: 'Jan', income: 4000, expenses: 2400 },
    { name: 'Feb', income: 3000, expenses: 1398 },
    { name: 'Mar', income: 2000, expenses: 9800 },
    { name: 'Apr', income: 2780, expenses: 3908 },
    { name: 'May', income: 1890, expenses: 4800 },
    { name: 'Jun', income: 2390, expenses: 3800 },
    { name: 'Jul', income: 3490, expenses: 4300 },
];

const portfolioData = [
    { name: 'Stocks', value: 400 },
    { name: 'Crypto', value: 300 },
    { name: 'Cash', value: 300 },
    { name: 'Bonds', value: 200 },
];

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981'];

const Dashboard = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                        Financial Dashboard
                    </h1>
                    <p className="text-muted-foreground">Welcome back, Future Billionaire.</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-muted-foreground">FinScore</p>
                    <div className="text-3xl font-bold text-primary flex items-center gap-2">
                        850 <Activity size={24} />
                    </div>
                </div>
            </header>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6 rounded-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign size={64} />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground">Total Balance</h3>
                    <p className="text-2xl font-bold mt-2">$24,500.00</p>
                    <div className="flex items-center gap-1 text-green-400 text-sm mt-2">
                        <TrendingUp size={16} /> +12.5%
                    </div>
                </div>

                <div className="glass-card p-6 rounded-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingDown size={64} />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground">Monthly Expenses</h3>
                    <p className="text-2xl font-bold mt-2">$1,250.00</p>
                    <div className="flex items-center gap-1 text-red-400 text-sm mt-2">
                        <TrendingUp size={16} /> +2.1%
                    </div>
                </div>

                <div className="glass-card p-6 rounded-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Target size={64} />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground">Savings Goal</h3>
                    <p className="text-2xl font-bold mt-2">$8,000 / $10k</p>
                    <div className="w-full bg-secondary h-2 rounded-full mt-3 overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-full w-[80%]" />
                    </div>
                </div>

                <div className="glass-card p-6 rounded-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity size={64} />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground">Investment Return</h3>
                    <p className="text-2xl font-bold mt-2">+ $3,400.00</p>
                    <div className="flex items-center gap-1 text-green-400 text-sm mt-2">
                        <TrendingUp size={16} /> +15.2%
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Income vs Expenses Chart */}
                <div className="lg:col-span-2 glass-card p-6 rounded-xl min-h-[400px]">
                    <h3 className="text-lg font-semibold mb-6">Income vs Expenses</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
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

                {/* Portfolio Allocation */}
                <div className="glass-card p-6 rounded-xl min-h-[400px]">
                    <h3 className="text-lg font-semibold mb-6">Portfolio Allocation</h3>
                    <div className="h-[300px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={portfolioData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
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
                        {/* Legend */}
                        <div className="absolute bottom-0 w-full flex justify-center gap-4 flex-wrap">
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

            {/* Recent Transactions */}
            <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
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
                                    <DollarSign size={20} />
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
        </div>
    );
};

export default Dashboard;
