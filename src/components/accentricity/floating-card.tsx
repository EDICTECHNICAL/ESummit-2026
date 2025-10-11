import { ReactNode } from "react";
import { motion } from "motion/react";

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FloatingCard({ children, className = "", delay = 0 }: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -10, scale: 1.02 }}
      className={`backdrop-blur-sm bg-card/80 rounded-lg border shadow-lg transition-all ${className}`}
    >
      {children}
    </motion.div>
  );
}
