import { ReactNode } from "react";
import { Card } from "../ui/card";

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className = "" }: BentoGridProps) {
  return (
    <div
      className={`grid auto-rows-[minmax(200px,auto)] grid-cols-1 gap-4 md:grid-cols-3 ${className}`}
    >
      {children}
    </div>
  );
}

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  span?: "1" | "2" | "3";
}

export function BentoCard({ children, className = "", span = "1" }: BentoCardProps) {
  const spanClass = span === "3" ? "md:col-span-3" : span === "2" ? "md:col-span-2" : "md:col-span-1";
  
  return (
    <Card className={`group relative overflow-hidden transition-all hover:shadow-lg ${spanClass} ${className}`}>
      {children}
    </Card>
  );
}
