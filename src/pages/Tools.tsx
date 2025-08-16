
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BudgetRow } from "@/components/tools/BudgetRow";
import {
  getMonthlyBudget,
  upsertMonthlyBudget,
  MonthlyExpenseItem,
} from "@/integrations/supabase/db";
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip as RechartTooltip } from "recharts";

const monthKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const Tools = () => {
  const { toast } = useToast();
  const qc = useQueryClient();

  const [selectedMonth, setSelectedMonth] = useState<string>(monthKey());
  const [income, setIncome] = useState<number>(0);
  const [savingsGoal, setSavingsGoal] = useState<number>(0);
  const [fixed, setFixed] = useState<MonthlyExpenseItem[]>([{ label: "Rent", amount: 0 }]);
  const [variable, setVariable] = useState<MonthlyExpenseItem[]>([{ label: "Food", amount: 0 }]);

  const { data, isLoading } = useQuery({
    queryKey: ["monthly-budget", selectedMonth],
    queryFn: () => getMonthlyBudget(selectedMonth),
  });

  useEffect(() => {
    if (data) {
      setIncome(Number(data.income || 0));
      setSavingsGoal(Number(data.savings_goal || 0));
      setFixed(Array.isArray(data.fixed_expenses) ? (data.fixed_expenses as any) : []);
      setVariable(Array.isArray(data.variable_expenses) ? (data.variable_expenses as any) : []);
    } else {
      // Reset if no data for the month
      setIncome(0);
      setSavingsGoal(0);
      setFixed([{ label: "Rent", amount: 0 }]);
      setVariable([{ label: "Food", amount: 0 }]);
    }
  }, [data]);

  const totalFixed = useMemo(
    () => fixed.reduce((sum, i) => sum + (Number(i.amount) || 0), 0),
    [fixed]
  );
  const totalVariable = useMemo(
    () => variable.reduce((sum, i) => sum + (Number(i.amount) || 0), 0),
    [variable]
  );
  const leftover = useMemo(
    () => Math.max(0, income - totalFixed - totalVariable - savingsGoal),
    [income, totalFixed, totalVariable, savingsGoal]
  );

  const chartData = useMemo(
    () => [
      { name: "Fixed", value: totalFixed, color: "hsl(var(--accent))" },
      { name: "Variable", value: totalVariable, color: "hsl(var(--secondary))" },
      { name: "Savings", value: savingsGoal, color: "hsl(var(--muted))" },
      { name: "Leftover", value: leftover, color: "hsl(var(--primary))" },
    ],
    [totalFixed, totalVariable, savingsGoal, leftover]
  );

  const saveMutation = useMutation({
    mutationFn: () =>
      upsertMonthlyBudget({
        month: selectedMonth,
        income,
        savings_goal: savingsGoal,
        fixed_expenses: fixed,
        variable_expenses: variable,
      }),
    meta: {
      onError: (err: any) => {
        console.error("Save budget error", err);
      },
    },
    onSuccess: () => {
      toast({ title: "Plan saved", description: "Your monthly plan has been updated." });
      qc.invalidateQueries({ queryKey: ["monthly-budget", selectedMonth] });
    },
  });

  const addFixed = () => setFixed((arr) => [...arr, { label: "", amount: 0 }]);
  const addVariable = () => setVariable((arr) => [...arr, { label: "", amount: 0 }]);

  return (
    <main className="container py-8">
      <h1 className="font-grotesk text-2xl mb-6">FinCoach Tools</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="card-neo p-5">
          <h3 className="font-medium">Monthly Budget Planner</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Plan income, expenses, and savings. Switch months to compare.
          </p>

          <div className="mt-4 grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="month">Month</Label>
                <Input
                  id="month"
                  type="month"
                  className="rounded-2xl mt-1"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="income">Monthly Income</Label>
                <Input
                  id="income"
                  type="number"
                  placeholder="$"
                  className="rounded-2xl mt-1"
                  value={income || ""}
                  onChange={(e) => setIncome(Number(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Fixed Expenses</h4>
                  <Button variant="outline" size="sm" onClick={addFixed} className="rounded-2xl">
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {fixed.map((item, idx) => (
                    <BudgetRow
                      key={`fixed-${idx}`}
                      item={item}
                      onChange={(next) =>
                        setFixed((arr) => arr.map((a, i) => (i === idx ? next : a)))
                      }
                      onRemove={() =>
                        setFixed((arr) => arr.filter((_, i) => i !== idx))
                      }
                    />
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">Total: ${totalFixed.toFixed(2)}</div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Variable Expenses</h4>
                  <Button variant="outline" size="sm" onClick={addVariable} className="rounded-2xl">
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {variable.map((item, idx) => (
                    <BudgetRow
                      key={`variable-${idx}`}
                      item={item}
                      onChange={(next) =>
                        setVariable((arr) => arr.map((a, i) => (i === idx ? next : a)))
                      }
                      onRemove={() =>
                        setVariable((arr) => arr.filter((_, i) => i !== idx))
                      }
                    />
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">
                  Total: ${totalVariable.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="savings">Savings Goal</Label>
                <Input
                  id="savings"
                  type="number"
                  placeholder="$"
                  className="rounded-2xl mt-1"
                  value={savingsGoal || ""}
                  onChange={(e) => setSavingsGoal(Number(e.target.value) || 0)}
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="hero"
                  className="w-full rounded-2xl"
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending || isLoading}
                >
                  {saveMutation.isPending ? "Saving..." : "Save Plan"}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="card-neo p-5">
          <h3 className="font-medium">Summary</h3>
          <p className="text-sm text-muted-foreground">Your allocation breakdown</p>

          <div className="h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" innerRadius={60} outerRadius={80} paddingAngle={6}>
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <RechartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-muted-foreground">Income</TableCell>
                  <TableCell>${income.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">Fixed</TableCell>
                  <TableCell>${totalFixed.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">Variable</TableCell>
                  <TableCell>${totalVariable.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">Savings</TableCell>
                  <TableCell>${savingsGoal.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">Leftover</TableCell>
                  <TableCell>${leftover.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card className="card-neo p-5 md:col-span-2">
          <h3 className="font-medium">Quote of the Day</h3>
          <p className="text-sm text-muted-foreground mt-2">
            “The goal isn’t more money. The goal is living life on your terms.” — Chris Brogan
          </p>
        </Card>
      </div>
    </main>
  );
};

export default Tools;
