import { ReactNode } from "react";
import { motion } from "motion/react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  blur?: "sm" | "md" | "lg";
}

export function GlassCard({ children, className = "", blur = "md" }: GlassCardProps) {
  const blurClass = blur === "sm" ? "backdrop-blur-sm" : blur === "lg" ? "backdrop-blur-lg" : "backdrop-blur-md";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`${blurClass} bg-card/40 border border-border/50 rounded-lg shadow-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}
