import { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowCard({
  children,
  className = "",
  glowColor = "rgba(220, 38, 38, 0.3)",
}: GlowCardProps) {
  return (
    <div className={`relative group ${className}`}>
      <div
        className="absolute -inset-0.5 rounded-lg opacity-75 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200"
        style={{
          background: `linear-gradient(to right, ${glowColor}, transparent, ${glowColor})`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
