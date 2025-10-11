import { ReactNode } from "react";

interface NeonTextProps {
  children: ReactNode;
  className?: string;
  color?: string;
}

export function NeonText({ children, className = "", color = "#dc2626" }: NeonTextProps) {
  return (
    <span
      className={`animate-pulse ${className}`}
      style={{
        textShadow: `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`,
      }}
    >
      {children}
    </span>
  );
}
