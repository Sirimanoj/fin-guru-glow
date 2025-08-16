
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { MonthlyExpenseItem } from "@/integrations/supabase/db";

interface BudgetRowProps {
  item: MonthlyExpenseItem;
  onChange: (item: MonthlyExpenseItem) => void;
  onRemove: () => void;
}

export const BudgetRow = ({ item, onChange, onRemove }: BudgetRowProps) => {
  return (
    <div className="grid grid-cols-12 gap-2 items-center">
      <div className="col-span-7">
        <Input
          placeholder="Label (e.g., Rent)"
          className="rounded-2xl"
          value={item.label}
          onChange={(e) => onChange({ ...item, label: e.target.value })}
        />
      </div>
      <div className="col-span-4">
        <Input
          placeholder="0"
          type="number"
          className="rounded-2xl"
          value={Number.isFinite(item.amount) && item.amount !== 0 ? item.amount : ""}
          onChange={(e) => onChange({ ...item, amount: Number(e.target.value) || 0 })}
        />
      </div>
      <div className="col-span-1 flex justify-end">
        <Button variant="outline" size="icon" className="rounded-2xl" onClick={onRemove}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
