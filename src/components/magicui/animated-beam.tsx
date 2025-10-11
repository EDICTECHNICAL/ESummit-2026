import { motion } from "motion/react";

interface AnimatedBeamProps {
  className?: string;
  duration?: number;
  delay?: number;
}

export function AnimatedBeam({
  className = "",
  duration = 3,
  delay = 0,
}: AnimatedBeamProps) {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{
        duration,
        delay,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className={`h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent ${className}`}
    />
  );
}
