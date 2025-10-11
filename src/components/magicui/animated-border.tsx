import { ReactNode } from "react";

interface AnimatedBorderProps {
  children: ReactNode;
  className?: string;
  duration?: string;
}

export function AnimatedBorder({
  children,
  className = "",
  duration = "3s",
}: AnimatedBorderProps) {
  return (
    <div className={`group relative ${className}`}>
      <div
        className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-red-600 to-red-400 opacity-75 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200"
        style={{
          animation: `gradient ${duration} ease infinite`,
        }}
      />
      <div className="relative">{children}</div>
      <style>{`
        @keyframes gradient {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
      `}</style>
    </div>
  );
}
