import { motion } from "framer-motion";
import { CoinIcon } from "./CoinIcon";
import { UserData, THEMES } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ThemeStoreProps {
  userData: UserData;
  onBuyTheme: (themeId: string, cost: number) => void;
  onApplyTheme: (themeId: string) => void;
}

export function ThemeStore({ userData, onBuyTheme, onApplyTheme }: ThemeStoreProps) {
  return (
    <div className="card-cartoon p-4">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-black text-lg text-foreground">Theme Store 🎨</h3>
        <div className="ml-auto flex items-center gap-1">
          <CoinIcon size={20} />
          <span className="font-black text-foreground">{userData.coins}</span>
        </div>
      </div>
      <div className="space-y-2">
        {THEMES.map((theme, i) => {
          const owned = userData.unlockedThemes.includes(theme.id);
          const active = userData.activeTheme === theme.id;
          return (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 ${
                active ? "border-primary bg-primary/10" : "border-border"
              }`}
            >
              <span className="text-2xl">{theme.name.split(" ").pop()}</span>
              <div className="flex-1">
                <p className="font-bold text-foreground">{theme.name}</p>
                {!owned && <p className="text-xs text-muted-foreground flex items-center gap-1"><CoinIcon size={12} /> {theme.cost} coins</p>}
              </div>
              {active ? (
                <span className="text-xs font-bold text-primary">Active</span>
              ) : owned ? (
                <Button size="sm" onClick={() => onApplyTheme(theme.id)} className="btn-bounce bg-primary text-primary-foreground rounded-xl text-xs">
                  Apply
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => {
                    if (userData.coins >= theme.cost) onBuyTheme(theme.id, theme.cost);
                    else toast.error("Not enough coins! 🪙");
                  }}
                  className="btn-bounce bg-accent text-accent-foreground rounded-xl text-xs"
                >
                  Buy
                </Button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
