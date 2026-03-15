// Simple localStorage-based store for CoinBuddy

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface Expense {
  id: string;
  userId: string;
  name: string;
  amount: number;
  category: string;
  date: string; // ISO string
}

export interface UserData {
  budget: number;
  coins: number;
  streak: number;
  lastTrackDate: string;
  achievements: string[];
  unlockedThemes: string[];
  activeTheme: string;
}

const USERS_KEY = "coinbuddy_users";
const EXPENSES_KEY = "coinbuddy_expenses";
const CURRENT_USER_KEY = "coinbuddy_current_user";
const USERDATA_KEY = "coinbuddy_userdata";

function getItem<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}
function setItem(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Auth
export function getUsers(): User[] { return getItem(USERS_KEY, []); }
export function signup(name: string, email: string, password: string): User | string {
  const users = getUsers();
  if (users.find(u => u.email === email)) return "Email already registered";
  const user: User = { id: crypto.randomUUID(), name, email, password };
  users.push(user);
  setItem(USERS_KEY, users);
  setItem(`${USERDATA_KEY}_${user.id}`, { budget: 10000, coins: 0, streak: 0, lastTrackDate: "", achievements: [], unlockedThemes: ["default"], activeTheme: "default" } as UserData);
  return user;
}
export function login(email: string, password: string): User | string {
  const user = getUsers().find(u => u.email === email && u.password === password);
  if (!user) return "Invalid email or password";
  setItem(CURRENT_USER_KEY, user);
  return user;
}
export function getCurrentUser(): User | null { return getItem(CURRENT_USER_KEY, null); }
export function logout() { localStorage.removeItem(CURRENT_USER_KEY); }

// User data
export function getUserData(userId: string): UserData {
  return getItem(`${USERDATA_KEY}_${userId}`, { budget: 10000, coins: 0, streak: 0, lastTrackDate: "", achievements: [], unlockedThemes: ["default"], activeTheme: "default" });
}
export function setUserData(userId: string, data: UserData) {
  setItem(`${USERDATA_KEY}_${userId}`, data);
}

// Expenses
export function getExpenses(userId: string): Expense[] {
  return getItem<Expense[]>(EXPENSES_KEY, []).filter(e => e.userId === userId);
}
export function addExpense(expense: Omit<Expense, "id">): Expense {
  const all = getItem<Expense[]>(EXPENSES_KEY, []);
  const newExp: Expense = { ...expense, id: crypto.randomUUID() };
  all.push(newExp);
  setItem(EXPENSES_KEY, all);
  return newExp;
}
export function deleteExpense(id: string) {
  const all = getItem<Expense[]>(EXPENSES_KEY, []);
  setItem(EXPENSES_KEY, all.filter(e => e.id !== id));
}

// Gamification helpers
export function awardCoins(userId: string, amount: number) {
  const data = getUserData(userId);
  data.coins += amount;
  setUserData(userId, data);
}

export function updateStreak(userId: string) {
  const data = getUserData(userId);
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  if (data.lastTrackDate === today) return; // already tracked today
  if (data.lastTrackDate === yesterday) {
    data.streak += 1;
  } else {
    data.streak = 1;
  }
  data.lastTrackDate = today;
  setUserData(userId, data);
}

export function checkAchievements(userId: string): string[] {
  const data = getUserData(userId);
  const newAchievements: string[] = [];
  const achievementDefs = [
    { id: "smart_saver", name: "Smart Saver 🏅", condition: data.streak >= 3 },
    { id: "budget_master", name: "Budget Master 🏆", condition: data.streak >= 7 },
    { id: "money_champion", name: "Money Champion 👑", condition: data.streak >= 30 },
  ];
  for (const a of achievementDefs) {
    if (a.condition && !data.achievements.includes(a.id)) {
      data.achievements.push(a.id);
      newAchievements.push(a.name);
    }
  }
  if (newAchievements.length) setUserData(userId, data);
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
