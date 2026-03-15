import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Expense, CATEGORIES } from "@/lib/store";
import { Button } from "@/components/ui/button";

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  const sorted = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!sorted.length) {
    return (
      <div className="card-cartoon p-6 text-center">
        <p className="text-4xl mb-2">🪙</p>
        <p className="font-bold text-muted-foreground">No expenses yet! Start tracking.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="font-black text-lg text-foreground">Recent Expenses 📋</h3>
      <AnimatePresence>
        {sorted.map(exp => {
          const cat = CATEGORIES.find(c => c.value === exp.category);
          return (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="card-cartoon p-3 flex items-center gap-3"
            >
              <span className="text-2xl">{cat?.emoji || "📦"}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground truncate">{exp.name}</p>
                <p className="text-xs text-muted-foreground">{cat?.label} · {new Date(exp.date).toLocaleDateString()}</p>
              </div>
              <span className="font-black text-foreground whitespace-nowrap">₹{exp.amount.toLocaleString()}</span>
              <Button variant="ghost" size="icon" onClick={() => onDelete(exp.id)} className="text-destructive hover:bg-destructive/10 shrink-0">
                <Trash2 size={16} />
              </Button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
