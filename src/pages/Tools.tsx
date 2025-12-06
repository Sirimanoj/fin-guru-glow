import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Plus, Trash2, Save, Calculator } from 'lucide-react';

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981'];

interface Expense {
    id: string;
    name: string;
    amount: number;
}

const Tools = () => {
    const [income, setIncome] = useState<number>(5000);
    const [savingsGoal, setSavingsGoal] = useState<number>(1000);

    const [fixedExpenses, setFixedExpenses] = useState<Expense[]>([
        { id: '1', name: 'Rent', amount: 1500 },
        { id: '2', name: 'Utilities', amount: 200 },
        { id: '3', name: 'Internet', amount: 80 },
    ]);

    const [variableExpenses, setVariableExpenses] = useState<Expense[]>([
        { id: '1', name: 'Groceries', amount: 400 },
        { id: '2', name: 'Entertainment', amount: 200 },
        { id: '3', name: 'Dining Out', amount: 150 },
    ]);

    const [totals, setTotals] = useState({
        fixed: 0,
        variable: 0,
        totalExpenses: 0,
        leftover: 0
    });

    useEffect(() => {
        const fixed = fixedExpenses.reduce((acc, curr) => acc + curr.amount, 0);
        const variable = variableExpenses.reduce((acc, curr) => acc + curr.amount, 0);
        const totalExpenses = fixed + variable;
        const leftover = income - totalExpenses - savingsGoal;

        setTotals({ fixed, variable, totalExpenses, leftover });
    }, [income, savingsGoal, fixedExpenses, variableExpenses]);

    const addExpense = (type: 'fixed' | 'variable') => {
        const newExpense = { id: Math.random().toString(), name: 'New Expense', amount: 0 };
        if (type === 'fixed') {
            setFixedExpenses([...fixedExpenses, newExpense]);
        } else {
            setVariableExpenses([...variableExpenses, newExpense]);
        }
    };

    const updateExpense = (type: 'fixed' | 'variable', id: string, field: 'name' | 'amount', value: string | number) => {
        const setter = type === 'fixed' ? setFixedExpenses : setVariableExpenses;
        const list = type === 'fixed' ? fixedExpenses : variableExpenses;

        setter(list.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const removeExpense = (type: 'fixed' | 'variable', id: string) => {
        if (type === 'fixed') {
            setFixedExpenses(fixedExpenses.filter(e => e.id !== id));
        } else {
            setVariableExpenses(variableExpenses.filter(e => e.id !== id));
        }
    };

    const chartData = [
        { name: 'Fixed Expenses', value: totals.fixed },
        { name: 'Variable Expenses', value: totals.variable },
        { name: 'Savings', value: savingsGoal },
        { name: 'Leftover', value: Math.max(0, totals.leftover) },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                    Budget Planner
                </h1>
                <p className="text-muted-foreground">Plan your monthly cash flow.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Input Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Income & Goals */}
                    <div className="glass-card p-6 rounded-xl">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Calculator size={20} className="text-primary" /> Income & Goals
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-muted-foreground">Monthly Income</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                                    <input
                                        type="number"
                                        value={income}
                                        onChange={(e) => setIncome(Number(e.target.value))}
                                        className="w-full bg-background/50 border border-border rounded-lg p-2 pl-8 focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-muted-foreground">Savings Goal</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                                    <input
                                        type="number"
                                        value={savingsGoal}
                                        onChange={(e) => setSavingsGoal(Number(e.target.value))}
                                        className="w-full bg-background/50 border border-border rounded-lg p-2 pl-8 focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fixed Expenses */}
                    <div className="glass-card p-6 rounded-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Fixed Expenses</h2>
                            <button onClick={() => addExpense('fixed')} className="p-2 hover:bg-primary/20 rounded-full text-primary transition-colors">
                                <Plus size={20} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {fixedExpenses.map((expense) => (
                                <div key={expense.id} className="flex gap-3 items-center">
                                    <input
                                        type="text"
                                        value={expense.name}
                                        onChange={(e) => updateExpense('fixed', expense.id, 'name', e.target.value)}
                                        className="flex-1 bg-background/30 border border-border rounded-lg p-2 text-sm"
                                    />
                                    <div className="relative w-32">
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">₹</span>
                                        <input
                                            type="number"
                                            value={expense.amount}
                                            onChange={(e) => updateExpense('fixed', expense.id, 'amount', Number(e.target.value))}
                                            className="w-full bg-background/30 border border-border rounded-lg p-2 pl-6 text-sm"
                                        />
                                    </div>
                                    <button onClick={() => removeExpense('fixed', expense.id)} className="text-destructive hover:bg-destructive/10 p-2 rounded-lg">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Variable Expenses */}
                    <div className="glass-card p-6 rounded-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Variable Expenses</h2>
                            <button onClick={() => addExpense('variable')} className="p-2 hover:bg-primary/20 rounded-full text-primary transition-colors">
                                <Plus size={20} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {variableExpenses.map((expense) => (
                                <div key={expense.id} className="flex gap-3 items-center">
                                    <input
                                        type="text"
                                        value={expense.name}
                                        onChange={(e) => updateExpense('variable', expense.id, 'name', e.target.value)}
                                        className="flex-1 bg-background/30 border border-border rounded-lg p-2 text-sm"
                                    />
                                    <div className="relative w-32">
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">₹</span>
                                        <input
                                            type="number"
                                            value={expense.amount}
                                            onChange={(e) => updateExpense('variable', expense.id, 'amount', Number(e.target.value))}
                                            className="w-full bg-background/30 border border-border rounded-lg p-2 pl-6 text-sm"
                                        />
                                    </div>
                                    <button onClick={() => removeExpense('variable', expense.id)} className="text-destructive hover:bg-destructive/10 p-2 rounded-lg">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="space-y-6">
                    <div className="glass-card p-6 rounded-xl sticky top-6">
                        <h2 className="text-xl font-semibold mb-6">Monthly Breakdown</h2>

                        <div className="h-[250px] w-full mb-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((_, index) => (
                                            <Cell key={`cell-₹{index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="space-y-4 border-t border-border pt-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Total Income</span>
                                <span className="font-medium text-green-400">+₹{income.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Total Expenses</span>
                                <span className="font-medium text-red-400">-₹{totals.totalExpenses.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Savings Goal</span>
                                <span className="font-medium text-blue-400">-₹{savingsGoal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t border-border pt-4">
                                <span>Leftover</span>
                                <span className={totals.leftover >= 0 ? 'text-primary' : 'text-destructive'}>
                                    ₹{totals.leftover.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <button className="w-full mt-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                            <Save size={18} /> Save Budget Plan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tools;
