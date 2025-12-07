import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/integrations/supabase/db";
import { toast } from "sonner";
import { Pencil, IndianRupee } from "lucide-react";

interface Financials {
    monthly_salary: number;
    total_balance: number;
    monthly_expenses: number;
    savings_goal_target: number;
    current_savings: number;
    investment_portfolio_value: number;
}

interface EditFinancialsDialogProps {
    initialData: Financials;
    onUpdate: () => void;
}

export function EditFinancialsDialog({ initialData, onUpdate }: EditFinancialsDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Financials>(initialData);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfile(formData);
            toast.success("Financials updated successfully!");
            onUpdate();
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update financials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Financials</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="salary">Monthly Income (Salary)</Label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="salary"
                                type="number"
                                className="pl-9"
                                value={formData.monthly_salary}
                                onChange={(e) => setFormData({ ...formData, monthly_salary: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="balance">Total Balance</Label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="balance"
                                type="number"
                                className="pl-9"
                                value={formData.total_balance}
                                onChange={(e) => setFormData({ ...formData, total_balance: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="expenses">Monthly Expenses</Label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="expenses"
                                type="number"
                                className="pl-9"
                                value={formData.monthly_expenses}
                                onChange={(e) => setFormData({ ...formData, monthly_expenses: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="savings_goal">Savings Goal Target</Label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="savings_goal"
                                type="number"
                                className="pl-9"
                                value={formData.savings_goal_target}
                                onChange={(e) => setFormData({ ...formData, savings_goal_target: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="current_savings">Current Savings</Label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="current_savings"
                                type="number"
                                className="pl-9"
                                value={formData.current_savings}
                                onChange={(e) => setFormData({ ...formData, current_savings: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="investment">Investment Value</Label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="investment"
                                type="number"
                                className="pl-9"
                                value={formData.investment_portfolio_value}
                                onChange={(e) => setFormData({ ...formData, investment_portfolio_value: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
