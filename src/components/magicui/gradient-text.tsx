import { ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  from?: string;
  to?: string;
  via?: string;
}

export function GradientText({
  children,
  className = "",
  from = "from-red-600",
  to = "to-red-400",
  via,
}: GradientTextProps) {
  return (
    <span
      className={`bg-gradient-to-r ${from} ${via || ""} ${to} bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  );
}
