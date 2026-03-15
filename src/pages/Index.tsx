import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import { Dashboard } from "@/components/Dashboard";
import { AddExpenseForm } from "@/components/AddExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { ExpenseChart } from "@/components/ExpenseChart";
import { CalendarView } from "@/components/CalendarView";
import { Achievements } from "@/components/Achievements";
import { ThemeStore } from "@/components/ThemeStore";
import { BudgetSetter } from "@/components/BudgetSetter";
import { BottomNav, Tab } from "@/components/BottomNav";
import { CoinIcon } from "@/components/CoinIcon";
import { Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getExpenses, addExpense, deleteExpense,
  getUserData, setUserData, awardCoins, updateStreak, checkAchievements,
  THEMES, type UserData
} from "@/lib/store";
import { toast } from "sonner";

const Index = () => {
  const { user, loading, login, signup, logout } = useAuth();
  const [authView, setAuthView] = useState<"login" | "signup">("login");
  const [tab, setTab] = useState<Tab>("home");
  const [expenses, setExpenses] = useState<ReturnType<typeof getExpenses>>([]);
  const [userData, setUD] = useState<UserData>({ budget: 10000, coins: 0, streak: 0, lastTrackDate: "", achievements: [], unlockedThemes: ["default"], activeTheme: "default" });
  const [dark, setDark] = useState(false);

  const refreshData = useCallback(() => {
    if (!user) return;
    setExpenses(getExpenses(user.id));
    setUD(getUserData(user.id));
  }, [user]);

  useEffect(() => { refreshData(); }, [refreshData]);

  // Apply theme class
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", dark);
    // Remove all theme classes
    THEMES.forEach(t => { if (t.className) root.classList.remove(t.className); });
    const theme = THEMES.find(t => t.id === userData.activeTheme);
    if (theme?.className) root.classList.add(theme.className);
  }, [dark, userData.activeTheme]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><CoinIcon size={48} animate /></div>;

  if (!user) {
    if (authView === "signup") return <Signup onSignup={signup} onSwitchToLogin={() => setAuthView("login")} />;
    return <Login onLogin={login} onSwitchToSignup={() => setAuthView("signup")} />;
  }

  const handleAddExpense = (name: string, amount: number, category: string, date: string) => {
    addExpense({ userId: user.id, name, amount, category, date });
    awardCoins(user.id, 5);
    updateStreak(user.id);
    const newAch = checkAchievements(user.id);
    newAch.forEach(a => toast.success(`Achievement unlocked: ${a}`));
    refreshData();
    toast.success("Expense added! +5 coins 🪙");
  };

  const handleDeleteExpense = (id: string) => {
    deleteExpense(id);
    refreshData();
  };

  const handleSetBudget = (budget: number) => {
    const d = getUserData(user.id);
    d.budget = budget;
    setUserData(user.id, d);
    refreshData();
    toast.success("Budget updated! 🎯");
  };

  const handleBuyTheme = (themeId: string, cost: number) => {
    const d = getUserData(user.id);
    d.coins -= cost;
    d.unlockedThemes.push(themeId);
    setUserData(user.id, d);
    refreshData();
    toast.success("Theme unlocked! 🎨");
  };

  const handleApplyTheme = (themeId: string) => {
    const d = getUserData(user.id);
    d.activeTheme = themeId;
    setUserData(user.id, d);
    refreshData();
  };

  // Check if under budget → award coins
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlySpending = expenses
    .filter(e => { const d = new Date(e.date); return d.getMonth() === currentMonth && d.getFullYear() === currentYear; })
    .reduce((s, e) => s + e.amount, 0);
  const underBudget = monthlySpending <= userData.budget;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur border-b-2 border-border">
        <div className="max-w-md mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <CoinIcon size={28} />
            <span className="font-black text-lg text-foreground">CoinBuddy</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setDark(!dark)} className="text-foreground">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground">
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {tab === "home" && <Dashboard expenses={expenses} userData={userData} userName={user.name} />}
        {tab === "add" && <AddExpenseForm onAdd={handleAddExpense} />}
        {tab === "list" && <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />}
        {tab === "chart" && <ExpenseChart expenses={expenses} />}
        {tab === "calendar" && <CalendarView expenses={expenses} />}
        {tab === "more" && (
          <div className="space-y-4">
            <BudgetSetter currentBudget={userData.budget} onSet={handleSetBudget} />
            <Achievements userData={userData} />
            <ThemeStore userData={userData} onBuyTheme={handleBuyTheme} onApplyTheme={handleApplyTheme} />
            {underBudget && userData.streak > 0 && (
              <div className="card-cartoon p-3 bg-accent/20 text-center">
                <p className="font-bold text-accent-foreground">🎉 You&apos;re under budget! Keep it up for bonus coins!</p>
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
};

export default Index;
