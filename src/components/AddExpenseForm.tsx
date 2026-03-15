import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CoinIcon } from "./CoinIcon";
import { CoinBuddyMascot } from "./CoinBuddyMascot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES } from "@/lib/store";

interface AddExpenseFormProps {
  onAdd: (name: string, amount: number, category: string, date: string) => void;
}

export function AddExpenseForm({ onAdd }: AddExpenseFormProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [showCoin, setShowCoin] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !category) return;
    onAdd(name, parseFloat(amount), category, date);
    setName(""); setAmount(""); setCategory("");
    setShowCoin(true);
    setTimeout(() => setShowCoin(false), 1500);
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {showCoin && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -80, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
          >
            <CoinBuddyMascot size={48} mood="celebrating" />
            <div className="flex items-center gap-1 mt-1">
              <CoinIcon size={24} animate />
              <p className="text-sm font-black text-primary">+5 coins!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="card-glow p-4 space-y-3">
        <h3 className="font-black text-lg text-foreground">Add Expense 💸</h3>
        <div>
          <Label>Expense Name</Label>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Lunch" required className="mt-1" />
        </div>
        <div>
          <Label>Amount (₹)</Label>
          <Input type="number" min="1" value={amount} onChange={e => setAmount(e.target.value)} placeholder="250" required className="mt-1" />
        </div>
        <div>
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Date</Label>
          <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1" />
        </div>
        <Button type="submit" className="w-full btn-bounce btn-sparkle font-bold rounded-2xl text-primary-foreground h-11 hover:opacity-90">
          Add Expense ✅
        </Button>
      </form>
    </div>
  );
}
