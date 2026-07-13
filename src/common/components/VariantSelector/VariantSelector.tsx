import { cn } from '@/lib/utils';
import type { VariantSelectorProps } from './VariantSelector.types';

export function VariantSelector({ variants, activeVariantId, onSelect }: VariantSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Color">
      {variants.map((variant) => {
        const isActive = variant.id === activeVariantId;
        return (
          <button
            key={variant.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onSelect(variant.id)}
            className={cn(
              'flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors',
              isActive
                ? 'border-foreground text-foreground'
                : 'border-border text-muted-foreground hover:border-foreground/40',
            )}
          >
            <span
              className="size-3.5 shrink-0 rounded-full border border-black/10"
              style={{ backgroundColor: variant.swatch }}
              aria-hidden="true"
            />
            {variant.label}
          </button>
        );
      })}
    </div>
  );
}
