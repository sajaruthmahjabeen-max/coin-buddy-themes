import { useState } from "react";
import { motion } from "framer-motion";
import { CoinIcon } from "@/components/CoinIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginProps {
  onLogin: (email: string, password: string) => string | null;
  onSwitchToSignup: () => void;
}

export default function Login({ onLogin, onSwitchToSignup }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = onLogin(email, password);
    if (err) setError(err);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="inline-block">
            <CoinIcon size={64} />
          </motion.div>
          <h1 className="text-3xl font-black mt-4 text-foreground">CoinBuddy</h1>
          <p className="text-muted-foreground font-semibold">Your friendly money tracker 🪙</p>
        </div>

        <form onSubmit={handleSubmit} className="card-cartoon p-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="mt-1" />
          </div>
          {error && <p className="text-destructive text-sm font-semibold">{error}</p>}
          <Button type="submit" className="w-full btn-bounce font-bold text-lg rounded-xl bg-primary text-primary-foreground hover:opacity-90">
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
