import { ReactNode } from "react";

interface ShineBorderProps {
  children: ReactNode;
  className?: string;
  color?: string;
}

export function ShineBorder({
  children,
  className = "",
  color = "red",
}: ShineBorderProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={
        {
          "--shine-color": color,
        } as React.CSSProperties
      }
    >
      <div className="relative z-10">{children}</div>
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          animation: "shine 3s linear infinite",
          transform: "translateX(-100%)",
        }}
      />
      <style>{`
        @keyframes shine {
          to {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
