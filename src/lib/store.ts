import { supabase } from "./supabase";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Expense {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  category: string;
  date: string; // ISO string
}

export interface UserData {
  id: string;
  budget: number;
  coins: number;
  streak: number;
  last_track_date: string;
  achievements: string[];
  unlocked_themes: string[];
  active_theme: string;
}

// User data (Profiles)
export async function getUserData(userId: string): Promise<UserData> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) {
    const defaultData = {
      id: userId,
      budget: 10000,
      coins: 0,
      streak: 0,
      last_track_date: "",
      achievements: [],
      unlocked_themes: ["default"],
      active_theme: "default"
    };
    
    // Create profile if it doesn't exist
    const { data: newData, error: insertError } = await supabase
      .from('profiles')
      .upsert(defaultData)
      .select()
      .single();

    if (insertError) {
      console.error("Error creating profile:", insertError);
      return defaultData;
    }
    return (newData || defaultData) as UserData;
  }
  return data as UserData;
}

export async function setUserData(userId: string, data: Partial<UserData>) {
  await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId);
}

// Expenses
export async function getExpenses(userId: string): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  return (data || []) as Expense[];
}

export async function addExpense(expense: Omit<Expense, "id">): Promise<Expense | null> {
  const { data, error } = await supabase
    .from('expenses')
    .insert([expense])
    .select()
    .single();

  return data as Expense;
}

export async function deleteExpense(id: string) {
  await supabase
    .from('expenses')
    .delete()
    .eq('id', id);
}

// Gamification helpers (Now async)
export async function awardCoins(userId: string, amount: number) {
  const data = await getUserData(userId);
  await setUserData(userId, { coins: data.coins + amount });
}

export async function updateStreak(userId: string) {
  const data = await getUserData(userId);
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  
  if (data.last_track_date === today) return;

  let newStreak = 1;
  if (data.last_track_date === yesterday) {
    newStreak = data.streak + 1;
  }

  await setUserData(userId, { streak: newStreak, last_track_date: today });
}

export async function checkAchievements(userId: string): Promise<string[]> {
  const data = await getUserData(userId);
  const newAchievements: string[] = [];
  const achievementDefs = [
    { id: "smart_saver", name: "Smart Saver 🏅", condition: data.streak >= 3 },
    { id: "budget_master", name: "Budget Master 🏆", condition: data.streak >= 7 },
    { id: "money_champion", name: "Money Champion 👑", condition: data.streak >= 30 },
  ];

  const currentAchievements = [...(data.achievements || [])];
  let updated = false;

  for (const a of achievementDefs) {
    if (a.condition && !currentAchievements.includes(a.id)) {
      currentAchievements.push(a.id);
      newAchievements.push(a.name);
      updated = true;
    }
  }

  if (updated) {
    await setUserData(userId, { achievements: currentAchievements });
  }
  return newAchievements;
}

export const CATEGORIES = [
  { value: "food", label: "Food 🍔", emoji: "🍔", color: "bg-primary" },
  { value: "travel", label: "Travel 🚕", emoji: "🚕", color: "bg-sky" },
  { value: "shopping", label: "Shopping 🛍", emoji: "🛍", color: "bg-pink" },
  { value: "bills", label: "Bills 🧾", emoji: "🧾", color: "bg-purple" },
  { value: "other", label: "Other 📦", emoji: "📦", color: "bg-mint" },
];

export const THEMES = [
  { id: "default", name: "Default", cost: 0, className: "" },
  { id: "rainbow", name: "Rainbow Theme 🌈", cost: 100, className: "theme-rainbow" },
  { id: "neon-dark", name: "Neon Dark Theme ⚡", cost: 150, className: "theme-neon-dark" },
  { id: "candy", name: "Candy Theme 🍬", cost: 120, className: "theme-candy" },
  { id: "nature", name: "Nature Theme 🌿", cost: 80, className: "theme-nature" },
  { id: "ocean", name: "Ocean Theme 🌊", cost: 100, className: "theme-ocean" },
];
