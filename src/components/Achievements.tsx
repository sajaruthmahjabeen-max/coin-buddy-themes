import { motion } from "framer-motion";
import { UserData } from "@/lib/store";

interface AchievementsProps {
  userData: UserData;
}

const BADGES = [
  { id: "smart_saver", name: "Smart Saver", emoji: "🏅", desc: "3 days tracking expenses", requirement: 3 },
  { id: "budget_master", name: "Budget Master", emoji: "🏆", desc: "7 days under budget", requirement: 7 },
  { id: "money_champion", name: "Money Champion", emoji: "👑", desc: "30 days under budget", requirement: 30 },
];

export function Achievements({ userData }: AchievementsProps) {
  return (
    <div className="card-cartoon p-4">
      <h3 className="font-black text-lg text-foreground mb-3">Achievements 🎖️</h3>
      <div className="space-y-2">
        {BADGES.map((badge, i) => {
          const unlocked = userData.achievements.includes(badge.id);
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 ${
                unlocked ? "border-primary bg-primary/10" : "border-border bg-muted/30 opacity-60"
              }`}
            >
              <span className="text-3xl">{badge.emoji}</span>
              <div>
                <p className="font-bold text-foreground">{badge.name}</p>
                <p className="text-xs text-muted-foreground">{badge.desc}</p>
              </div>
              {unlocked && <span className="ml-auto text-primary font-bold">✓</span>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
