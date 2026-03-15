import { motion } from "framer-motion";

interface CoinIconProps {
  size?: number;
  animate?: boolean;
  className?: string;
}

export function CoinIcon({ size = 24, animate = false, className = "" }: CoinIconProps) {
  const coin = (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <defs>
        <radialGradient id="coinGrad" cx="40%" cy="35%">
          <stop offset="0%" stopColor="hsl(48, 100%, 75%)" />
          <stop offset="100%" stopColor="hsl(var(--coin-gold))" />
        </radialGradient>
        <filter id="coinGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="24" cy="24" r="22" fill="url(#coinGrad)" filter="url(#coinGlow)" />
      <circle cx="24" cy="24" r="18" fill="hsl(var(--coin-glow))" opacity="0.4" />
      <circle cx="24" cy="24" r="20" stroke="hsl(var(--accent))" strokeWidth="1.5" fill="none" opacity="0.5" />
      <text x="24" y="30" textAnchor="middle" fontSize="18" fontWeight="900" fill="hsl(var(--accent-foreground))">₹</text>
      {/* Sparkle */}
      <circle cx="14" cy="14" r="2" fill="white" opacity="0.7" />
    </svg>
  );

  if (animate) {
    return (
      <motion.div
        animate={{ y: [0, -20, 0], rotateY: [0, 360] }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {coin}
      </motion.div>
    );
  }
  return coin;
}
