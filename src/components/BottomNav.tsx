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
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t-2 border-border z-50">
      <div className="max-w-md mx-auto flex">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 btn-bounce text-xs font-bold transition-colors ${
              active === item.id ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
