import { motion, AnimatePresence } from "framer-motion";

interface CoinBuddyMascotProps {
  size?: number;
  mood?: "happy" | "excited" | "waving" | "celebrating";
  message?: string;
  className?: string;
}

export function CoinBuddyMascot({ size = 80, mood = "happy", message, className = "" }: CoinBuddyMascotProps) {
  const eyeVariants = {
    happy: { scaleY: 1 },
    excited: { scaleY: [1, 0.2, 1] },
    waving: { scaleY: 1 },
    celebrating: { scaleY: [1, 0.1, 1, 0.1, 1] },
  };

  return (
    <motion.div
      className={`flex flex-col items-center ${className}`}
      animate={mood === "celebrating" ? { y: [0, -8, 0] } : mood === "waving" ? { rotate: [0, -5, 5, 0] } : {}}
      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        {/* Body - golden coin */}
        <circle cx="50" cy="50" r="45" fill="hsl(var(--coin-gold))" />
        <circle cx="50" cy="50" r="38" fill="hsl(var(--coin-glow))" opacity="0.6" />
        <circle cx="50" cy="50" r="42" stroke="hsl(var(--accent))" strokeWidth="2" fill="none" opacity="0.5" />

        {/* Blush cheeks */}
        <circle cx="28" cy="56" r="7" fill="hsl(var(--pink))" opacity="0.35" />
        <circle cx="72" cy="56" r="7" fill="hsl(var(--pink))" opacity="0.35" />

        {/* Eyes */}
        <motion.ellipse
          cx="38" cy="44" rx="5" ry="6"
          fill="hsl(var(--foreground))"
          animate={eyeVariants[mood]}
          transition={{ repeat: mood === "excited" || mood === "celebrating" ? Infinity : 0, duration: 1.5 }}
        />
        <motion.ellipse
          cx="62" cy="44" rx="5" ry="6"
          fill="hsl(var(--foreground))"
          animate={eyeVariants[mood]}
          transition={{ repeat: mood === "excited" || mood === "celebrating" ? Infinity : 0, duration: 1.5 }}
        />
        {/* Eye sparkles */}
        <circle cx="40" cy="42" r="2" fill="white" />
        <circle cx="64" cy="42" r="2" fill="white" />

        {/* Mouth */}
        {mood === "excited" || mood === "celebrating" ? (
          <ellipse cx="50" cy="62" rx="8" ry="6" fill="hsl(var(--pink))" />
        ) : (
          <path d="M 40 60 Q 50 70 60 60" stroke="hsl(var(--foreground))" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}

        {/* ₹ symbol */}
        <text x="50" y="85" textAnchor="middle" fontSize="12" fontWeight="900" fill="hsl(var(--accent))" opacity="0.6">₹</text>
      </svg>

      {/* Sparkles around mascot */}
      {(mood === "excited" || mood === "celebrating") && (
        <>
          {[0, 1, 2, 3].map(i => (
            <motion.div
              key={i}
              className="absolute text-accent"
              style={{
                top: `${10 + i * 15}%`,
                left: `${15 + i * 20}%`,
              }}
              animate={{ opacity: [0, 1, 0], y: [0, -10, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.3 }}
            >
              ✨
            </motion.div>
          ))}
        </>
      )}

      {/* Speech bubble */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mt-1 px-3 py-1.5 rounded-2xl bg-card border-2 border-border text-xs font-bold text-foreground text-center max-w-[160px]"
            style={{ boxShadow: "var(--glow-pink)" }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
