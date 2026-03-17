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
import { CoinBuddyMascot } from "@/components/CoinBuddyMascot";
import { Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getExpenses, addExpense, deleteExpense,
  getUserData, setUserData, awardCoins, updateStreak, checkAchievements,
  THEMES, type UserData, type Expense
} from "@/lib/store";
import { toast } from "sonner";

const Index = () => {
  const { user, loading, login, signup, logout } = useAuth();
  const [authView, setAuthView] = useState<"login" | "signup">("login");
  const [tab, setTab] = useState<Tab>("home");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [userData, setUD] = useState<UserData>({ 
    id: "",
    budget: 10000, 
    coins: 0, 
    streak: 0, 
    last_track_date: "", 
    achievements: [], 
    unlocked_themes: ["default"], 
    active_theme: "default" 
  });
  const [dark, setDark] = useState(false);

  const refreshData = useCallback(async () => {
    if (!user) return;
    const [fetchedExpenses, fetchedUserData] = await Promise.all([
      getExpenses(user.id),
      getUserData(user.id)
    ]);
    setExpenses(fetchedExpenses);
    setUD(fetchedUserData);
  }, [user]);

  useEffect(() => { refreshData(); }, [refreshData]);

  // Apply theme class
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", dark);
    THEMES.forEach(t => { if (t.className) root.classList.remove(t.className); });
    const theme = THEMES.find(t => t.id === userData.active_theme);
    if (theme?.className) root.classList.add(theme.className);
  }, [dark, userData.active_theme]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-pink-soft gap-3">
      <CoinBuddyMascot size={80} mood="waving" />
      <p className="font-black text-foreground animate-pulse">Loading...</p>
    </div>
  );

  if (!user) {
    if (authView === "signup") return <Signup onSignup={signup} onSwitchToLogin={() => setAuthView("login")} />;
    return <Login onLogin={login} onSwitchToSignup={() => setAuthView("signup")} />;
  }

  const handleAddExpense = async (name: string, amount: number, category: string, date: string) => {
    await addExpense({ user_id: user.id, name, amount, category, date });
    await awardCoins(user.id, 5);
    await updateStreak(user.id);
    const newAch = await checkAchievements(user.id);
    newAch.forEach(a => toast.success(`Achievement unlocked: ${a}`));
    refreshData();
    toast.success("Expense added! +5 coins 🪙");
  };

  const handleDeleteExpense = async (id: string) => {
    await deleteExpense(id);
    refreshData();
  };

  const handleSetBudget = async (budget: number) => {
    await setUserData(user.id, { budget });
    refreshData();
    toast.success("Budget updated! 🎯");
  };

  const handleBuyTheme = async (themeId: string, cost: number) => {
    const d = await getUserData(user.id);
    const unlocked = [...d.unlocked_themes, themeId];
    await setUserData(user.id, { 
      coins: d.coins - cost, 
      unlocked_themes: unlocked 
    });
    refreshData();
    toast.success("Theme unlocked! 🎨");
  };

  const handleApplyTheme = async (themeId: string) => {
    await setUserData(user.id, { active_theme: themeId });
    refreshData();
  };

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlySpending = expenses
    .filter(e => { const d = new Date(e.date); return d.getMonth() === currentMonth && d.getFullYear() === currentYear; })
    .reduce((s, e) => s + e.amount, 0);
  const underBudget = monthlySpending <= userData.budget;

  return (
    <div className="min-h-screen bg-gradient-pink-soft pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b-2 border-border">
        <div className="max-w-md mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <CoinIcon size={28} />
            <span className="font-black text-lg text-foreground">CoinBuddy</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setDark(!dark)} className="text-foreground rounded-full">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground rounded-full">
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
              <div className="card-glow p-3 text-center">
                <p className="font-bold text-primary">🎉 You&apos;re under budget! Keep it up for bonus coins!</p>
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
