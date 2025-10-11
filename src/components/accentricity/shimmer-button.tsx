import { ReactNode } from "react";
import { Button } from "../ui/button";

interface ShimmerButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function ShimmerButton({
  children,
  className = "",
  onClick,
  size = "default",
  variant = "default",
}: ShimmerButtonProps) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-shimmer" />
      <Button
        onClick={onClick}
        size={size}
        variant={variant}
        className={`relative ${className}`}
      >
        {children}
      </Button>
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-shimmer {
          background-size: 200% 200%;
          animation: shimmer 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
