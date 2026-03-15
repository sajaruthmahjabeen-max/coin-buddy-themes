import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Expense, CATEGORIES } from "@/lib/store";

const COLORS = [
  "hsl(43, 100%, 55%)",
  "hsl(200, 90%, 75%)",
  "hsl(330, 80%, 70%)",
  "hsl(270, 60%, 65%)",
  "hsl(155, 60%, 70%)",
];

interface ExpenseChartProps {
  expenses: Expense[];
}

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  const data = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach(e => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return CATEGORIES.map(c => ({ name: c.label, value: map[c.value] || 0 })).filter(d => d.value > 0);
  }, [expenses]);

  if (!data.length) {
    return (
      <div className="card-cartoon p-6 text-center">
        <p className="text-4xl mb-2">📊</p>
        <p className="font-bold text-muted-foreground">Add expenses to see your chart!</p>
      </div>
    );
  }

  return (
    <div className="card-cartoon p-4">
      <h3 className="font-black text-lg text-foreground mb-2">Spending by Category 📊</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={4} dataKey="value">
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />)}
          </Pie>
          <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
