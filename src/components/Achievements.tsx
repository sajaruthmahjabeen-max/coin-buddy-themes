import { motion } from "framer-motion";
import { UserData, Expense } from "@/lib/store";
import { Progress } from "@/components/ui/progress";

interface AchievementsProps {
  userData: UserData;
  expenses: Expense[];
}

const BADGES = [
  { id: "first_expense", name: "First Steps", emoji: "👣", desc: "Add your first expense", requirement: 1, type: "count" },
  { id: "smart_saver", name: "Smart Saver", emoji: "🏅", desc: "3 days tracking expenses", requirement: 3, type: "streak" },
  { id: "budget_master", name: "Budget Master", emoji: "🏆", desc: "7 days under budget", requirement: 7, type: "streak" },
  { id: "money_champion", name: "Money Champion", emoji: "👑", desc: "30 days under budget", requirement: 30, type: "streak" },
  { id: "big_spender", name: "Big Spender", emoji: "💸", desc: "Spend 5,000 total", requirement: 5000, type: "spending" },
  { id: "category_king", name: "Category King", emoji: "👑", desc: "Use 5 different categories", requirement: 5, type: "categories" },
];

export function Achievements({ userData, expenses }: AchievementsProps) {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const categoriesCount = new Set(expenses.map(e => e.category)).size;

  return (
    <div className="card-cartoon p-4">
      <h3 className="font-black text-lg text-foreground mb-3">Achievements 🎖️</h3>
      <div className="space-y-3">
        {BADGES.map((badge, i) => {
          const unlocked = userData.achievements.includes(badge.id);
          
          let current = 0;
          if (badge.type === "streak") current = userData.streak;
          if (badge.type === "count") current = expenses.length;
          if (badge.type === "spending") current = totalSpent;
          if (badge.type === "categories") current = categoriesCount;

          const progress = Math.min((current / badge.requirement) * 100, 100);

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col gap-2 p-3 rounded-xl border-2 transition-all ${
                unlocked ? "border-primary bg-primary/10" : "border-border bg-muted/30 opacity-70"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{badge.emoji}</span>
                <div className="flex-1">
                  <p className="font-bold text-sm text-foreground">{badge.name}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{badge.desc}</p>
                </div>
                {unlocked ? (
                  <span className="text-primary font-bold text-sm">✓</span>
                ) : (
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {current > 0 ? `${Math.floor(current)}/${badge.requirement}` : ""}
                  </span>
                )}
              </div>
              
              {!unlocked && progress > 0 && (
                <Progress value={progress} className="h-1.5 bg-muted" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
