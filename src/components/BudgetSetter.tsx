import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BudgetSetterProps {
  currentBudget: number;
  onSet: (budget: number) => void;
}

export function BudgetSetter({ currentBudget, onSet }: BudgetSetterProps) {
  const [budget, setBudget] = useState(currentBudget.toString());

  return (
    <div className="card-glow p-4">
      <h3 className="font-black text-lg text-foreground mb-2">Set Monthly Budget 🎯</h3>
      <div className="flex gap-2">
        <div className="flex-1">
          <Label className="sr-only">Budget amount</Label>
          <Input type="number" min="100" value={budget} onChange={e => setBudget(e.target.value)} placeholder="10000" />
        </div>
        <Button onClick={() => { const v = parseFloat(budget); if (v > 0) onSet(v); }} className="btn-bounce btn-sparkle text-primary-foreground rounded-2xl font-bold">
          Save 💖
        </Button>
      </div>
    </div>
  );
}
