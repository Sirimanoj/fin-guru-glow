type Props = { score: number; size?: number };

export const FinScoreBadge = ({ score, size = 64 }: Props) => {
  const clamped = Math.max(0, Math.min(100, score));
  const angle = (clamped / 100) * 360;
  const style: React.CSSProperties = {
    width: size,
    height: size,
    background: `conic-gradient(hsl(var(--accent)) ${angle}deg, hsl(var(--muted)) ${angle}deg 360deg)`,
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="rounded-full p-[3px]" style={style} aria-hidden />
      <div className="absolute inset-[6px] rounded-full glass grid place-content-center">
        <span className="font-grotesk text-sm">{clamped}</span>
      </div>
      <span className="sr-only">FinScore {clamped} out of 100</span>
    </div>
  );
};
