export function Meteors({ number = 20 }: { number?: number }) {
  return (
    <>
      {[...Array(number)].map((_, idx) => (
        <span
          key={idx}
          className="absolute left-1/2 top-0 h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-full bg-primary shadow-[0_0_0_1px_#ffffff10]"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.6 + 0.2}s`,
            animationDuration: `${Math.random() * 8 + 2}s`,
          }}
        >
          <style>{`
            @keyframes meteor {
              0% {
                transform: rotate(215deg) translateX(0);
                opacity: 1;
              }
              70% {
                opacity: 1;
              }
              100% {
                transform: rotate(215deg) translateX(-500px);
                opacity: 0;
              }
            }
            .animate-meteor {
              animation: meteor linear infinite;
            }
          `}</style>
        </span>
      ))}
    </>
  );
}
