import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FinScoreBadge } from "@/components/media/FinScoreBadge";
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Stocks", value: 50, color: "hsl(var(--accent))" },
  { name: "Bonds", value: 25, color: "hsl(var(--secondary))" },
  { name: "Cash", value: 25, color: "hsl(var(--muted))" },
];

const Dashboard = () => {
  return (
    <main className="container py-8">
      <h1 className="font-grotesk text-2xl mb-6">Your Dashboard</h1>

      <div className="grid gap-5 md:grid-cols-4">
        <Card className="card-neo p-5 md:col-span-2">
          <h3 className="font-medium">Budget Tracker</h3>
          <p className="text-sm text-muted-foreground mt-1">Monthly snapshot</p>
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2"><span>Income</span><span>$5,200</span></div>
              <Progress value={80} className="h-2 rounded-full" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2"><span>Expenses</span><span>$3,100</span></div>
              <Progress value={60} className="h-2 rounded-full" />
            </div>
          </div>
        </Card>

        <Card className="card-neo p-5 flex items-center justify-between">
          <div>
            <h3 className="font-medium">FinScore</h3>
            <p className="text-sm text-muted-foreground">Health level</p>
          </div>
          <FinScoreBadge score={82} />
        </Card>

        <Card className="card-neo p-5 md:col-span-1">
          <h3 className="font-medium">Savings Goal</h3>
          <p className="text-sm text-muted-foreground">Vacation Fund</p>
          <div className="mt-4">
            <Progress value={45} className="h-2 rounded-full" />
            <div className="text-xs text-muted-foreground mt-2">$900 / $2,000</div>
          </div>
        </Card>

        <Card className="card-neo p-5 md:col-span-2">
          <h3 className="font-medium">Portfolio Overview</h3>
          <div className="h-52 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" innerRadius={60} outerRadius={80} paddingAngle={6}>
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 text-xs text-muted-foreground">
            {data.map((d) => (
              <div key={d.name} className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: d.color }} /> {d.name}</div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
};

export default Dashboard;
