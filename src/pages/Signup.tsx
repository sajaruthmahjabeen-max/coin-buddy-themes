import { useState } from "react";
import { motion } from "framer-motion";
import { CoinIcon } from "@/components/CoinIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SignupProps {
  onSignup: (name: string, email: string, password: string) => string | null;
  onSwitchToLogin: () => void;
}

export default function Signup({ onSignup, onSwitchToLogin }: SignupProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords don't match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    const err = onSignup(name, email, password);
    if (err) setError(err);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-6">
          <CoinIcon size={48} />
          <h1 className="text-2xl font-black mt-2 text-foreground">Join CoinBuddy!</h1>
        </div>
        <form onSubmit={handleSubmit} className="card-cartoon p-6 space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="pw">Password</Label>
            <Input id="pw" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="cpw">Confirm Password</Label>
            <Input id="cpw" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" required className="mt-1" />
          </div>
          {error && <p className="text-destructive text-sm font-semibold">{error}</p>}
          <Button type="submit" className="w-full btn-bounce font-bold text-lg rounded-xl bg-primary text-primary-foreground hover:opacity-90">
            Create Account ✨
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button type="button" onClick={onSwitchToLogin} className="text-primary font-bold hover:underline">Login</button>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
