import { motion } from "framer-motion";

interface CoinIconProps {
  size?: number;
  animate?: boolean;
  className?: string;
}

export function CoinIcon({ size = 24, animate = false, className = "" }: CoinIconProps) {
  const coin = (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="24" r="22" fill="hsl(var(--coin-gold))" stroke="hsl(var(--coin-gold))" strokeWidth="2" />
      <circle cx="24" cy="24" r="17" fill="hsl(var(--coin-glow))" opacity="0.5" />
      <text x="24" y="30" textAnchor="middle" fontSize="20" fontWeight="900" fill="hsl(var(--primary-foreground))">₹</text>
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
