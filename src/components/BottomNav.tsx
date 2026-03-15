import { motion } from "framer-motion";
import { Home, Plus, PieChart, Calendar, ShoppingBag, Settings } from "lucide-react";

export type Tab = "home" | "add" | "list" | "chart" | "calendar" | "more";

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const items: { id: Tab; icon: React.ElementType; label: string }[] = [
  { id: "home", icon: Home, label: "Home" },
  { id: "add", icon: Plus, label: "Add" },
  { id: "list", icon: ShoppingBag, label: "List" },
  { id: "chart", icon: PieChart, label: "Chart" },
  { id: "calendar", icon: Calendar, label: "Calendar" },
  { id: "more", icon: Settings, label: "More" },
];

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t-2 border-border z-50">
      <div className="max-w-md mx-auto flex">
        {items.map(item => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`flex-1 flex flex-col items-center py-2 gap-0.5 btn-bounce text-xs font-bold transition-all duration-200 relative ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute -top-0.5 w-8 h-1 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <motion.div animate={isActive ? { scale: 1.15, y: -2 } : { scale: 1, y: 0 }}>
                <item.icon size={20} />
              </motion.div>
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
