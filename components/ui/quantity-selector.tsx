"use client";

import { SquareMinus, SquarePlus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  step?: number;
  min?: number;
  compact?: boolean;
}

export function QuantitySelector({
  quantity,
  onChange,
  step = 0.5,
  min = 0.5,
  compact = false,
}: QuantitySelectorProps) {
  const iconSize = compact ? "h-6 w-6" : "h-6 w-6";

  return (
    <div className={`flex items-center ${compact ? "gap-1" : "gap-2"}`}>
      <SquareMinus
        strokeWidth={1}
        className={`${iconSize} cursor-pointer text-muted-foreground transition-colors hover:text-foreground ${quantity <= min ? "pointer-events-none opacity-30" : ""}`}
        onClick={() => onChange(Math.max(min, quantity - step))}
        aria-label="Decrease quantity"
      />
      <span
        className={`text-center font-semibold ${compact ? "min-w-8 text-xs" : "min-w-8 text-sm"}`}
      >
        {quantity.toFixed(1)}
      </span>
      <SquarePlus
        strokeWidth={1}
        className={`${iconSize} cursor-pointer text-muted-foreground transition-colors hover:text-foreground`}
        onClick={() => onChange(quantity + step)}
        aria-label="Increase quantity"
      />
    </div>
  );
}
