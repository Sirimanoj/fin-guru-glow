/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef } from "react";

export const PointerGlow = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--cursor-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background: "radial-gradient(600px 300px at var(--cursor-x) var(--cursor-y), hsl(var(--primary) / 0.15), transparent 60%)" }}
      aria-hidden
    />
  );
};
