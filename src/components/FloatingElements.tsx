import { motion } from "framer-motion";

export function FloatingCoins() {
  const coins = [
    { emoji: "🪙", x: "10%", delay: 0, dur: 4 },
    { emoji: "💰", x: "80%", delay: 1.2, dur: 5 },
    { emoji: "✨", x: "50%", delay: 0.5, dur: 3.5 },
    { emoji: "🪙", x: "30%", delay: 2, dur: 4.5 },
    { emoji: "💎", x: "70%", delay: 1.8, dur: 3.8 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {coins.map((c, i) => (
        <motion.div
          key={i}
          className="absolute text-lg opacity-30"
          style={{ left: c.x, top: "100%" }}
          animate={{ y: [0, -500], opacity: [0.3, 0] }}
          transition={{ repeat: Infinity, duration: c.dur, delay: c.delay, ease: "linear" }}
        >
          {c.emoji}
        </motion.div>
      ))}
    </div>
  );
}

export function Sparkles({ count = 6 }: { count?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-xs"
          style={{
            left: `${10 + (i * 80) / count}%`,
            top: `${20 + Math.sin(i) * 30}%`,
          }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  );
}
