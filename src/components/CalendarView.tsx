import { useMemo, useState } from "react";
import { Expense } from "@/lib/store";

interface CalendarViewProps {
  expenses: Expense[];
}

export function CalendarView({ expenses }: CalendarViewProps) {
  const [monthOffset, setMonthOffset] = useState(0);
  const now = new Date();
  const viewDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleString("default", { month: "long", year: "numeric" });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const expenseByDay = useMemo(() => {
    const map: Record<number, number> = {};
    expenses.forEach(e => {
      const d = new Date(e.date);
      if (d.getMonth() === month && d.getFullYear() === year) {
        map[d.getDate()] = (map[d.getDate()] || 0) + e.amount;
      }
    });
    return map;
  }, [expenses, month, year]);

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <div className="card-cartoon p-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setMonthOffset(o => o - 1)} className="font-bold text-primary text-lg btn-bounce">◀</button>
        <h3 className="font-black text-foreground">{monthName} 📅</h3>
        <button onClick={() => setMonthOffset(o => o + 1)} className="font-bold text-primary text-lg btn-bounce">▶</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-muted-foreground mb-1">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <div key={i} className={`rounded-lg p-1 min-h-[44px] text-center ${day ? "bg-muted/50" : ""}`}>
            {day && (
              <>
                <span className="text-xs font-bold text-foreground">{day}</span>
                {expenseByDay[day] && (
                  <p className="text-[10px] font-bold text-primary truncate">₹{expenseByDay[day]}</p>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
