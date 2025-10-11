import { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  repeat?: number;
  speed?: "slow" | "normal" | "fast";
}

export function Marquee({
  children,
  className = "",
  reverse = false,
  pauseOnHover = false,
  repeat = 2,
  speed = "normal",
}: MarqueeProps) {
  const duration = speed === "slow" ? "40s" : speed === "fast" ? "20s" : "30s";

  return (
    <div className={`flex overflow-hidden ${className}`}>
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={`flex shrink-0 ${pauseOnHover ? "hover:[animation-play-state:paused]" : ""}`}
          style={{
            animation: `marquee ${duration} linear infinite ${reverse ? "reverse" : ""}`,
          }}
        >
          {children}
        </div>
      ))}
      <style>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}
