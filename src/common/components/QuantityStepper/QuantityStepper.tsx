import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { QuantityStepperProps } from './QuantityStepper.types';

export function QuantityStepper({
  quantity,
  onChange,
  min = 0,
  max = 99,
  disabled = false,
  ariaLabel,
}: QuantityStepperProps) {
  const canDecrement = !disabled && quantity > min;
  const canIncrement = !disabled && quantity < max;

  return (
    <div className="inline-flex items-center gap-2.5" role="group" aria-label={ariaLabel}>
      <button
        type="button"
        aria-label={`Decrease ${ariaLabel} quantity`}
        disabled={!canDecrement}
        onClick={() => onChange(Math.max(min, quantity - 1))}
        className={cn(
          'flex size-7 items-center justify-center rounded-md border border-border bg-secondary text-foreground transition-colors',
          'hover:not-disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-40',
        )}
      >
        <Minus className="size-3.5" />
      </button>
      <span className="w-4 text-center text-sm font-semibold tabular-nums" aria-hidden="true">
        {quantity}
      </span>
      <button
        type="button"
        aria-label={`Increase ${ariaLabel} quantity`}
        disabled={!canIncrement}
        onClick={() => onChange(Math.min(max, quantity + 1))}
        className={cn(
          'flex size-7 items-center justify-center rounded-md border border-border bg-secondary text-foreground transition-colors',
          'hover:not-disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-40',
        )}
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
