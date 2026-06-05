import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: number | string;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
};

function formatValue(value: number) {
  const precision = Number.isInteger(value) ? 0 : 1;
  return value.toLocaleString(undefined, {
    maximumFractionDigits: precision,
    minimumFractionDigits: precision,
  });
}

export function AnimatedNumber({ value, prefix, suffix, duration = 900, className }: Props) {
  const [count, setCount] = useState<number>(
    typeof value === "number" && Number.isFinite(value) ? 0 : 0,
  );
  const ref = useRef<HTMLDivElement | null>(null);
  const hasAnimated = useRef(false);
  const frameRef = useRef<number | null>(null);

  const isNumericValue = typeof value === "number" && Number.isFinite(value);
  const targetValue = isNumericValue ? value : 0;

  const animate = (from: number, to: number) => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    const startTime = performance.now();
    const delta = to - from;

    const step = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const nextValue = Number((from + delta * progress).toFixed(Number.isInteger(to) ? 0 : 1));
      setCount(nextValue);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      }
    };

    frameRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    if (!isNumericValue) {
      return;
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animate(0, targetValue);
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isNumericValue, targetValue, duration]);

  useEffect(() => {
    if (!isNumericValue) {
      return;
    }
    if (!hasAnimated.current) {
      return;
    }
    animate(count, targetValue);
  }, [count, isNumericValue, targetValue, duration]);

  const displayValue = isNumericValue ? formatValue(count) : String(value ?? "");

  return (
    <div ref={ref} className={cn("inline-flex items-baseline", className)}>
      {prefix}
      {displayValue}
      {suffix}
    </div>
  );
}
