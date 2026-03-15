import { useMemo } from "react";
import { motion } from "framer-motion";
import { CoinIcon } from "./CoinIcon";
import { CoinBuddyMascot } from "./CoinBuddyMascot";
import { Sparkles } from "./FloatingElements";
import { Progress } from "@/components/ui/progress";
import { Expense, UserData } from "@/lib/store";

interface DashboardProps {
  expenses: Expense[];
  userData: UserData;
  userName: string;
}

export function Dashboard({ expenses, userData, userName }: DashboardProps) {
  const today = new Date().toISOString().split("T")[0];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const todaySpending = useMemo(() =>
    expenses.filter(e => e.date.startsWith(today)).reduce((s, e) => s + e.amount, 0),
    [expenses, today]
  );

  const monthlySpending = useMemo(() =>
    expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).reduce((s, e) => s + e.amount, 0),
    [expenses, currentMonth, currentYear]
  );

  const remaining = userData.budget - monthlySpending;
  const progress = Math.min((monthlySpending / userData.budget) * 100, 100);
  const overBudget = monthlySpending > userData.budget;

  const mascotMood = overBudget ? "excited" : userData.streak > 3 ? "celebrating" : "happy";
  const mascotMsg = overBudget
    ? "Slow down! 😅"
    : userData.streak > 3
    ? `${userData.streak} day streak! 🔥`
    : `Hi ${userName}! 💕`;

  const tips = [
    "Try cooking at home to save on food! 🍳",
    "Track daily to build your streak! 🔥",
    "Small savings add up over time! 💰",
    "Set realistic budgets you can stick to! 📊",
  ];
  const tip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div className="space-y-4">
      {/* Mascot greeting */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3">
        <CoinBuddyMascot size={64} mood={mascotMood} message={mascotMsg} />
        <div className="pt-2">
          <h2 className="text-xl font-black text-foreground">Hey {userName}! 👋</h2>
          <p className="text-muted-foreground text-sm font-semibold">Here&apos;s your spending overview</p>
        </div>
      </motion.div>

      {/* Today / Month cards */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="card-glow p-4 relative overflow-hidden">
          <Sparkles count={3} />
          <p className="text-xs font-bold text-primary uppercase">Today 💳</p>
          <p className="text-2xl font-black text-foreground">₹{todaySpending.toLocaleString()}</p>
        </motion.div>
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} className="card-glow p-4 relative overflow-hidden">
          <Sparkles count={3} />
          <p className="text-xs font-bold text-primary uppercase">This Month 📅</p>
          <p className="text-2xl font-black text-foreground">₹{monthlySpending.toLocaleString()}</p>
        </motion.div>
      </div>

      {/* Budget card */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="card-glow p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-sm text-foreground">💰 Monthly Budget</span>
          <span className="font-black text-foreground">₹{userData.budget.toLocaleString()}</span>
        </div>
        <Progress value={progress} className="h-3 rounded-full" />
        <div className="flex justify-between mt-2 text-xs font-semibold">
          <span className="text-muted-foreground">Spent: ₹{monthlySpending.toLocaleString()}</span>
          <span className={overBudget ? "text-destructive" : "text-primary"}>
            {overBudget ? "Over!" : `Remaining: ₹${remaining.toLocaleString()}`}
          </span>
        </div>
        {overBudget && (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: [1, 1.02, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
            className="mt-3 p-2 rounded-xl bg-destructive/10 text-destructive text-sm font-bold text-center">
            ⚠️ Warning! You have exceeded your budget.
          </motion.div>
        )}
      </motion.div>

      {/* Streak & coins */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card-cartoon p-4 bg-primary/10">
          <p className="text-xs font-bold uppercase text-muted-foreground">🔥 Saving Streak</p>
          <p className="text-xl font-black text-foreground">
            {"🔥".repeat(Math.min(userData.streak, 10))} {userData.streak > 0 ? `(${userData.streak} days)` : "Start today!"}
          </p>
        </div>
        <div className="card-cartoon p-4 bg-accent/10 flex items-center gap-2">
          <CoinIcon size={32} />
          <div>
            <p className="text-xs font-bold uppercase text-muted-foreground">🪙 Coins</p>
            <p className="text-xl font-black text-foreground">{userData.coins}</p>
          </div>
        </div>
      </div>

      {/* Tip */}
      <div className="card-cartoon p-3 bg-secondary/30">
        <p className="text-sm font-bold text-foreground">💡 Tip: {tip}</p>
      </div>
    </div>
  );
}
