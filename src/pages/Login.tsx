import { useState } from "react";
import { motion } from "framer-motion";
import { CoinBuddyMascot } from "@/components/CoinBuddyMascot";
import { FloatingCoins } from "@/components/FloatingElements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<string | null>;
  onSwitchToSignup: () => void;
}

export default function Login({ onLogin, onSwitchToSignup }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = await onLogin(email, password);
    if (err) setError(err);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-pink-soft">
      <FloatingCoins />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-6">
          <CoinBuddyMascot size={80} mood="waving" message="Welcome back! 💕" />
          <h1 className="text-3xl font-black mt-3 text-foreground">CoinBuddy</h1>
          <p className="text-muted-foreground font-semibold">Your friendly money tracker 💖</p>
        </div>

        <form onSubmit={handleSubmit} className="card-glow p-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="mt-1" />
          </div>
          {error && <p className="text-destructive text-sm font-semibold">{error}</p>}
          <Button type="submit" className="w-full btn-bounce btn-sparkle font-bold text-lg rounded-2xl text-primary-foreground h-12 hover:opacity-90">
            Login 🚀
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            No account?{" "}
            <button type="button" onClick={onSwitchToSignup} className="text-primary font-bold hover:underline">
              Create Account
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
