interface PulseDotProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
}

export function PulseDot({ className = "", size = "md", color = "bg-primary" }: PulseDotProps) {
  const sizeClass = size === "sm" ? "h-2 w-2" : size === "lg" ? "h-4 w-4" : "h-3 w-3";

  return (
    <span className={`relative flex ${sizeClass} ${className}`}>
      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${color} opacity-75`} />
      <span className={`relative inline-flex rounded-full ${sizeClass} ${color}`} />
    </span>
  );
}
